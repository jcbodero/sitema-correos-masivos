package com.correos.masivos.contact.domain.service;

import com.correos.masivos.contact.domain.model.ContactImport;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface ContactImportService {
    
    // Gestión de importaciones
    ContactImport createImport(String originalFilename, Long userId, Long contactListId);
    Optional<ContactImport> findById(Long id);
    Page<ContactImport> findByUserId(Long userId, Pageable pageable);
    
    // Procesamiento de archivos
    ContactImport processCSVFile(MultipartFile file, Long userId, Long contactListId, Map<String, String> fieldMapping);
    ContactImport processExcelFile(MultipartFile file, Long userId, Long contactListId, Map<String, String> fieldMapping);
    
    // Validación de archivos
    boolean isValidCSVFile(MultipartFile file);
    boolean isValidExcelFile(MultipartFile file);
    List<String> getCSVHeaders(MultipartFile file);
    List<String> getExcelHeaders(MultipartFile file);
    
    // Previsualización
    List<Map<String, Object>> previewCSVData(MultipartFile file, int maxRows);
    List<Map<String, Object>> previewExcelData(MultipartFile file, int maxRows);
    
    // Estado de importaciones
    void updateImportStatus(Long importId, ContactImport.ImportStatus status);
    void updateImportProgress(Long importId, int processed, int successful, int failed);
    
    // Estadísticas
    long countByUserIdAndStatus(Long userId, ContactImport.ImportStatus status);
    long countByUserId(Long userId);
    List<ContactImport> findRecentImportsByUserId(Long userId, int limit);
    
    // Gestión de registros
    void deleteImportRecord(Long id);
}