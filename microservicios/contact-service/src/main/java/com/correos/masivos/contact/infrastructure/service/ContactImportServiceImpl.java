package com.correos.masivos.contact.infrastructure.service;

import com.correos.masivos.contact.domain.model.Contact;
import com.correos.masivos.contact.domain.model.ContactImport;
import com.correos.masivos.contact.domain.service.ContactImportService;
import com.correos.masivos.contact.domain.service.ContactService;
import com.correos.masivos.contact.infrastructure.repository.ContactImportRepository;
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvException;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStreamReader;
import java.util.*;

@Service
@Transactional
public class ContactImportServiceImpl implements ContactImportService {

    @Autowired
    private ContactImportRepository importRepository;

    @Autowired
    private ContactService contactService;

    @Override
    public ContactImport createImport(String originalFilename, Long userId, Long contactListId) {
        String filename = UUID.randomUUID().toString() + "_" + originalFilename;
        return importRepository.save(new ContactImport(filename, originalFilename, userId));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ContactImport> findById(Long id) {
        return importRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ContactImport> findByUserId(Long userId, Pageable pageable) {
        return importRepository.findByUserId(userId, pageable);
    }

    @Override
    public ContactImport processCSVFile(MultipartFile file, Long userId, Long contactListId, Map<String, String> fieldMapping) {
        ContactImport importRecord = createImport(file.getOriginalFilename(), userId, contactListId);
        importRecord.setFileSize(file.getSize());
        
        try {
            importRecord.startProcessing();
            importRepository.save(importRecord);

            List<Contact> contacts = parseCSVFile(file, userId, fieldMapping);
            importRecord.setTotalRecords(contacts.size());
            
            processContacts(contacts, importRecord);
            
            importRecord.complete();
            return importRepository.save(importRecord);
            
        } catch (Exception e) {
            importRecord.fail("Error procesando archivo CSV: " + e.getMessage());
            return importRepository.save(importRecord);
        }
    }

    @Override
    public ContactImport processExcelFile(MultipartFile file, Long userId, Long contactListId, Map<String, String> fieldMapping) {
        ContactImport importRecord = createImport(file.getOriginalFilename(), userId, contactListId);
        importRecord.setFileSize(file.getSize());
        
        try {
            importRecord.startProcessing();
            importRepository.save(importRecord);

            List<Contact> contacts = parseExcelFile(file, userId, fieldMapping);
            importRecord.setTotalRecords(contacts.size());
            
            processContacts(contacts, importRecord);
            
            importRecord.complete();
            return importRepository.save(importRecord);
            
        } catch (Exception e) {
            importRecord.fail("Error procesando archivo Excel: " + e.getMessage());
            return importRepository.save(importRecord);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isValidCSVFile(MultipartFile file) {
        return file != null && !file.isEmpty() && 
               file.getOriginalFilename() != null && 
               file.getOriginalFilename().toLowerCase().endsWith(".csv");
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isValidExcelFile(MultipartFile file) {
        return file != null && !file.isEmpty() && 
               file.getOriginalFilename() != null && 
               (file.getOriginalFilename().toLowerCase().endsWith(".xlsx") ||
                file.getOriginalFilename().toLowerCase().endsWith(".xls"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getCSVHeaders(MultipartFile file) {
        try (CSVReader reader = new CSVReader(new InputStreamReader(file.getInputStream()))) {
            String[] headers = reader.readNext();
            return headers != null ? Arrays.asList(headers) : Collections.emptyList();
        } catch (IOException | CsvException e) {
            return Collections.emptyList();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getExcelHeaders(MultipartFile file) {
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            Row headerRow = sheet.getRow(0);
            
            if (headerRow == null) return Collections.emptyList();
            
            List<String> headers = new ArrayList<>();
            for (Cell cell : headerRow) {
                headers.add(cell.getStringCellValue());
            }
            return headers;
        } catch (IOException e) {
            return Collections.emptyList();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> previewCSVData(MultipartFile file, int maxRows) {
        List<Map<String, Object>> preview = new ArrayList<>();
        try (CSVReader reader = new CSVReader(new InputStreamReader(file.getInputStream()))) {
            String[] headers = reader.readNext();
            if (headers == null) return preview;
            
            String[] row;
            int count = 0;
            while ((row = reader.readNext()) != null && count < maxRows) {
                Map<String, Object> rowData = new HashMap<>();
                for (int i = 0; i < Math.min(headers.length, row.length); i++) {
                    rowData.put(headers[i], row[i]);
                }
                preview.add(rowData);
                count++;
            }
        } catch (IOException | CsvException e) {
            // Log error
        }
        return preview;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> previewExcelData(MultipartFile file, int maxRows) {
        List<Map<String, Object>> preview = new ArrayList<>();
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            Row headerRow = sheet.getRow(0);
            
            if (headerRow == null) return preview;
            
            List<String> headers = new ArrayList<>();
            for (Cell cell : headerRow) {
                headers.add(cell.getStringCellValue());
            }
            
            for (int i = 1; i <= Math.min(maxRows, sheet.getLastRowNum()); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;
                
                Map<String, Object> rowData = new HashMap<>();
                for (int j = 0; j < headers.size(); j++) {
                    Cell cell = row.getCell(j);
                    String value = cell != null ? cell.toString() : "";
                    rowData.put(headers.get(j), value);
                }
                preview.add(rowData);
            }
        } catch (IOException e) {
            // Log error
        }
        return preview;
    }

    @Override
    public void updateImportStatus(Long importId, ContactImport.ImportStatus status) {
        importRepository.findById(importId).ifPresent(importRecord -> {
            importRecord.setStatus(status);
            importRepository.save(importRecord);
        });
    }

    @Override
    public void updateImportProgress(Long importId, int processed, int successful, int failed) {
        importRepository.findById(importId).ifPresent(importRecord -> {
            importRecord.setProcessedRecords(processed);
            importRecord.setSuccessfulRecords(successful);
            importRecord.setFailedRecords(failed);
            importRepository.save(importRecord);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public long countByUserIdAndStatus(Long userId, ContactImport.ImportStatus status) {
        return importRepository.countByUserIdAndStatus(userId, status);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContactImport> findRecentImportsByUserId(Long userId, int limit) {
        return importRepository.findRecentByUserId(userId, PageRequest.of(0, limit));
    }

    @Override
    @Transactional(readOnly = true)
    public long countByUserId(Long userId) {
        return importRepository.countByUserId(userId);
    }

    @Override
    public void deleteImportRecord(Long id) {
        importRepository.deleteById(id);
    }

    // Métodos privados auxiliares
    private List<Contact> parseCSVFile(MultipartFile file, Long userId, Map<String, String> fieldMapping) 
            throws IOException, CsvException {
        List<Contact> contacts = new ArrayList<>();
        
        try (CSVReader reader = new CSVReader(new InputStreamReader(file.getInputStream()))) {
            String[] headers = reader.readNext();
            if (headers == null) return contacts;
            
            String[] row;
            while ((row = reader.readNext()) != null) {
                Contact contact = mapRowToContact(headers, row, userId, fieldMapping);
                if (contact != null) {
                    contacts.add(contact);
                }
            }
        }
        return contacts;
    }

    private List<Contact> parseExcelFile(MultipartFile file, Long userId, Map<String, String> fieldMapping) 
            throws IOException {
        List<Contact> contacts = new ArrayList<>();
        
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            Row headerRow = sheet.getRow(0);
            
            if (headerRow == null) return contacts;
            
            List<String> headers = new ArrayList<>();
            for (Cell cell : headerRow) {
                headers.add(cell.getStringCellValue());
            }
            
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;
                
                String[] rowData = new String[headers.size()];
                for (int j = 0; j < headers.size(); j++) {
                    Cell cell = row.getCell(j);
                    rowData[j] = cell != null ? cell.toString() : "";
                }
                
                Contact contact = mapRowToContact(headers.toArray(new String[0]), rowData, userId, fieldMapping);
                if (contact != null) {
                    contacts.add(contact);
                }
            }
        }
        return contacts;
    }

    private Contact mapRowToContact(String[] headers, String[] row, Long userId, Map<String, String> fieldMapping) {
        Map<String, String> rowMap = new HashMap<>();
        for (int i = 0; i < Math.min(headers.length, row.length); i++) {
            rowMap.put(headers[i], row[i]);
        }

        String email = getFieldValue(rowMap, fieldMapping, "email");
        if (email == null || email.trim().isEmpty()) {
            return null; // Email es requerido
        }

        Contact contact = new Contact(email.trim(), userId);
        contact.setFirstName(getFieldValue(rowMap, fieldMapping, "firstName"));
        contact.setLastName(getFieldValue(rowMap, fieldMapping, "lastName"));
        contact.setPhone(getFieldValue(rowMap, fieldMapping, "phone"));
        contact.setCompany(getFieldValue(rowMap, fieldMapping, "company"));
        contact.setPosition(getFieldValue(rowMap, fieldMapping, "position"));
        contact.setCountry(getFieldValue(rowMap, fieldMapping, "country"));
        contact.setCity(getFieldValue(rowMap, fieldMapping, "city"));

        return contact;
    }

    private String getFieldValue(Map<String, String> rowMap, Map<String, String> fieldMapping, String field) {
        String mappedField = fieldMapping.get(field);
        return mappedField != null ? rowMap.get(mappedField) : null;
    }

    private void processContacts(List<Contact> contacts, ContactImport importRecord) {
        int processed = 0;
        int successful = 0;
        int failed = 0;

        for (Contact contact : contacts) {
            try {
                // Verificar si el contacto ya existe
                if (!contactService.existsByEmailAndUserId(contact.getEmail(), contact.getUserId())) {
                    contactService.createContact(contact);
                    successful++;
                } else {
                    failed++; // Contacto duplicado
                }
            } catch (Exception e) {
                failed++;
            }
            processed++;
            
            // Actualizar progreso cada 100 registros
            if (processed % 100 == 0) {
                updateImportProgress(importRecord.getId(), processed, successful, failed);
            }
        }
        
        // Actualización final
        updateImportProgress(importRecord.getId(), processed, successful, failed);
    }
}