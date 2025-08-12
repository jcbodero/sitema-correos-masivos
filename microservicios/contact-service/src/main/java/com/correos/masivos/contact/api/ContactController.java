package com.correos.masivos.contact.api;

import com.correos.masivos.contact.api.dto.ContactDTO;
import com.correos.masivos.contact.api.dto.ContactImportDTO;
import com.correos.masivos.contact.api.dto.ContactListDTO;
import com.correos.masivos.contact.domain.model.Contact;
import com.correos.masivos.contact.domain.model.ContactImport;
import com.correos.masivos.contact.domain.model.ContactList;
import com.correos.masivos.contact.domain.service.ContactImportService;
import com.correos.masivos.contact.domain.service.ContactListService;
import com.correos.masivos.contact.domain.service.ContactService;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/contacts")
public class ContactController {

    @Autowired
    private ContactService contactService;

    @Autowired
    private ContactListService contactListService;

    @Autowired
    private ContactImportService contactImportService;

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
            "service", "contact-service",
            "status", "UP",
            "port", "8082"
        ));
    }

    // === CONTACTOS ===
    @PostMapping
    public ResponseEntity<ContactDTO> createContact(@Valid @RequestBody ContactDTO contactDTO) {
        Contact contact = mapToEntity(contactDTO);
        Contact savedContact = contactService.createContact(contact);
        return ResponseEntity.ok(mapToDTO(savedContact));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactDTO> getContact(@PathVariable Long id) {
        Optional<Contact> contact = contactService.findById(id);
        return contact.map(c -> ResponseEntity.ok(mapToDTO(c)))
                     .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<Page<ContactDTO>> getContacts(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) Boolean subscribed) {
        
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Contact> contacts;
        if (search != null && !search.trim().isEmpty()) {
            contacts = contactService.searchContacts(userId, search, pageable);
        } else if (active != null && active) {
            contacts = contactService.findActiveContacts(userId, pageable);
        } else if (subscribed != null && subscribed) {
            contacts = contactService.findSubscribedContacts(userId, pageable);
        } else {
            contacts = contactService.findByUserId(userId, pageable);
        }
        
        return ResponseEntity.ok(contacts.map(this::mapToDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContactDTO> updateContact(@PathVariable Long id, @Valid @RequestBody ContactDTO contactDTO) {
        Optional<Contact> existingContact = contactService.findById(id);
        if (existingContact.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Contact contact = mapToEntity(contactDTO);
        contact.setId(id);
        Contact updatedContact = contactService.updateContact(contact);
        return ResponseEntity.ok(mapToDTO(updatedContact));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(@PathVariable Long id) {
        contactService.deleteContact(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/unsubscribe")
    public ResponseEntity<Void> unsubscribeContact(@PathVariable Long id) {
        contactService.unsubscribeContact(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/resubscribe")
    public ResponseEntity<Void> resubscribeContact(@PathVariable Long id) {
        contactService.resubscribeContact(id);
        return ResponseEntity.ok().build();
    }

    // === LISTAS DE CONTACTOS ===
    @PostMapping("/lists")
    public ResponseEntity<ContactListDTO> createContactList(@Valid @RequestBody ContactListDTO listDTO) {
        ContactList contactList = mapToEntity(listDTO);
        ContactList savedList = contactListService.createContactList(contactList);
        return ResponseEntity.ok(mapToDTO(savedList));
    }

    @GetMapping("/lists")
    public ResponseEntity<Page<ContactListDTO>> getContactLists(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        
        Page<ContactList> lists;
        if (search != null && !search.trim().isEmpty()) {
            lists = contactListService.searchContactLists(userId, search, pageable);
        } else {
            lists = contactListService.findByUserId(userId, pageable);
        }
        
        return ResponseEntity.ok(lists.map(this::mapToDTO));
    }

    @PostMapping("/{contactId}/lists/{listId}")
    public ResponseEntity<Void> addContactToList(@PathVariable Long contactId, @PathVariable Long listId) {
        contactService.addContactToList(contactId, listId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{contactId}/lists/{listId}")
    public ResponseEntity<Void> removeContactFromList(@PathVariable Long contactId, @PathVariable Long listId) {
        contactService.removeContactFromList(contactId, listId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/list/{listId}")
    public ResponseEntity<ContactListDTO> getContactList(@PathVariable Long listId) {
        Optional<ContactList> contactList = contactListService.findById(listId);
        return contactList.map(list -> ResponseEntity.ok(mapToDTO(list)))
                         .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/list/{listId}")
    public ResponseEntity<ContactListDTO> updateContactList(@PathVariable Long listId, @Valid @RequestBody ContactListDTO listDTO) {
        Optional<ContactList> existingList = contactListService.findById(listId);
        if (existingList.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        ContactList contactList = mapToEntity(listDTO);
        contactList.setId(listId);
        ContactList updatedList = contactListService.updateContactList(contactList);
        return ResponseEntity.ok(mapToDTO(updatedList));
    }

    @DeleteMapping("/list/{listId}")
    public ResponseEntity<Void> deleteContactList(@PathVariable Long listId) {
        contactListService.deleteContactList(listId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/list/{listId}/contacts")
    public ResponseEntity<Page<ContactDTO>> getContactsInList(
            @PathVariable Long listId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Contact> contacts = contactService.findContactsInList(listId, pageable);
        return ResponseEntity.ok(contacts.map(this::mapToDTO));
    }

    @PostMapping("/list/{listId}/contacts/bulk")
    public ResponseEntity<Map<String, Object>> addContactsToListBulk(
            @PathVariable Long listId,
            @RequestBody List<Long> contactIds) {
        
        int addedCount = 0;
        int errorCount = 0;
        
        for (Long contactId : contactIds) {
            try {
                contactService.addContactToList(contactId, listId);
                addedCount++;
            } catch (Exception e) {
                errorCount++;
            }
        }
        
        return ResponseEntity.ok(Map.of(
            "totalRequested", contactIds.size(),
            "addedCount", addedCount,
            "errorCount", errorCount
        ));
    }

    @DeleteMapping("/list/{listId}/contacts/bulk")
    public ResponseEntity<Map<String, Object>> removeContactsFromListBulk(
            @PathVariable Long listId,
            @RequestBody List<Long> contactIds) {
        
        int removedCount = 0;
        int errorCount = 0;
        
        for (Long contactId : contactIds) {
            try {
                contactService.removeContactFromList(contactId, listId);
                removedCount++;
            } catch (Exception e) {
                errorCount++;
            }
        }
        
        return ResponseEntity.ok(Map.of(
            "totalRequested", contactIds.size(),
            "removedCount", removedCount,
            "errorCount", errorCount
        ));
    }

    // === IMPORTACIÓN MASIVA ===
    @PostMapping("/import/csv/preview")
    public ResponseEntity<ContactImportDTO> previewCSVImport(@RequestParam("file") MultipartFile file) {
        if (!contactImportService.isValidCSVFile(file)) {
            return ResponseEntity.badRequest().build();
        }
        
        ContactImportDTO preview = new ContactImportDTO();
        preview.setHeaders(contactImportService.getCSVHeaders(file));
        preview.setPreviewData(contactImportService.previewCSVData(file, 5));
        preview.setOriginalFilename(file.getOriginalFilename());
        preview.setFileSize(file.getSize());
        
        return ResponseEntity.ok(preview);
    }

    @PostMapping("/import/excel/preview")
    public ResponseEntity<ContactImportDTO> previewExcelImport(@RequestParam("file") MultipartFile file) {
        if (!contactImportService.isValidExcelFile(file)) {
            return ResponseEntity.badRequest().build();
        }
        
        ContactImportDTO preview = new ContactImportDTO();
        preview.setHeaders(contactImportService.getExcelHeaders(file));
        preview.setPreviewData(contactImportService.previewExcelData(file, 5));
        preview.setOriginalFilename(file.getOriginalFilename());
        preview.setFileSize(file.getSize());
        
        return ResponseEntity.ok(preview);
    }

    @PostMapping("/import/csv")
    public ResponseEntity<ContactImportDTO> importCSVContacts(
            @RequestParam("file") MultipartFile file,
            @RequestParam Long userId,
            @RequestParam(required = false) Long contactListId,
            @RequestParam Map<String, String> fieldMapping) {
        
        if (!contactImportService.isValidCSVFile(file)) {
            return ResponseEntity.badRequest().build();
        }
        
        ContactImport importResult = contactImportService.processCSVFile(file, userId, contactListId, fieldMapping);
        return ResponseEntity.ok(mapToDTO(importResult));
    }

    @PostMapping("/import/excel")
    public ResponseEntity<ContactImportDTO> importExcelContacts(
            @RequestParam("file") MultipartFile file,
            @RequestParam Long userId,
            @RequestParam(required = false) Long contactListId,
            @RequestParam Map<String, String> fieldMapping) {
        
        if (!contactImportService.isValidExcelFile(file)) {
            return ResponseEntity.badRequest().build();
        }
        
        ContactImport importResult = contactImportService.processExcelFile(file, userId, contactListId, fieldMapping);
        return ResponseEntity.ok(mapToDTO(importResult));
    }

    @PostMapping("/import/csv/create-list")
    public ResponseEntity<Map<String, Object>> importCSVAndCreateList(
            @RequestParam("file") MultipartFile file,
            @RequestParam Long userId,
            @RequestParam String listName,
            @RequestParam(required = false) String listDescription,
            @RequestParam Map<String, String> fieldMapping) {
        
        if (!contactImportService.isValidCSVFile(file)) {
            return ResponseEntity.badRequest().build();
        }
        
        // Crear nueva lista
        ContactList newList = new ContactList();
        newList.setName(listName);
        newList.setDescription(listDescription != null ? listDescription : "Lista creada desde importación CSV");
        newList.setUserId(userId);
        newList.setIsActive(true);
        
        ContactList savedList = contactListService.createContactList(newList);
        
        // Importar contactos a la nueva lista
        ContactImport importResult = contactImportService.processCSVFile(file, userId, savedList.getId(), fieldMapping);
        
        return ResponseEntity.ok(Map.of(
            "contactList", mapToDTO(savedList),
            "importResult", mapToDTO(importResult)
        ));
    }

    // Endpoint de compatibilidad para importación genérica
    @PostMapping("/import")
    public ResponseEntity<ContactImportDTO> importContacts(
            @RequestParam("file") MultipartFile file,
            @RequestParam Long userId,
            @RequestParam(required = false) Long contactListId,
            @RequestParam Map<String, String> fieldMapping) {
        
        ContactImport importResult;
        if (contactImportService.isValidCSVFile(file)) {
            importResult = contactImportService.processCSVFile(file, userId, contactListId, fieldMapping);
        } else if (contactImportService.isValidExcelFile(file)) {
            importResult = contactImportService.processExcelFile(file, userId, contactListId, fieldMapping);
        } else {
            return ResponseEntity.badRequest().build();
        }
        
        return ResponseEntity.ok(mapToDTO(importResult));
    }

    // Endpoint de compatibilidad para preview genérico
    @PostMapping("/import/preview")
    public ResponseEntity<ContactImportDTO> previewImport(@RequestParam("file") MultipartFile file) {
        ContactImportDTO preview = new ContactImportDTO();
        
        if (contactImportService.isValidCSVFile(file)) {
            preview.setHeaders(contactImportService.getCSVHeaders(file));
            preview.setPreviewData(contactImportService.previewCSVData(file, 5));
        } else if (contactImportService.isValidExcelFile(file)) {
            preview.setHeaders(contactImportService.getExcelHeaders(file));
            preview.setPreviewData(contactImportService.previewExcelData(file, 5));
        } else {
            return ResponseEntity.badRequest().build();
        }
        
        preview.setOriginalFilename(file.getOriginalFilename());
        preview.setFileSize(file.getSize());
        
        return ResponseEntity.ok(preview);
    }

    @GetMapping("/import/{id}")
    public ResponseEntity<ContactImportDTO> getImportStatus(@PathVariable Long id) {
        Optional<ContactImport> importRecord = contactImportService.findById(id);
        return importRecord.map(i -> ResponseEntity.ok(mapToDTO(i)))
                          .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/import")
    public ResponseEntity<Page<ContactImportDTO>> getImportHistory(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<ContactImport> imports = contactImportService.findByUserId(userId, pageable);
        return ResponseEntity.ok(imports.map(this::mapToDTO));
    }

    @DeleteMapping("/import/{id}")
    public ResponseEntity<Void> deleteImportRecord(@PathVariable Long id) {
        contactImportService.deleteImportRecord(id);
        return ResponseEntity.noContent().build();
    }

    // === ESTADÍSTICAS ===
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getContactStats(@RequestParam Long userId) {
        return ResponseEntity.ok(Map.of(
            "totalContacts", contactService.countByUserId(userId),
            "activeContacts", contactService.countActiveByUserId(userId),
            "subscribedContacts", contactService.countSubscribedByUserId(userId),
            "unsubscribedContacts", contactService.countUnsubscribedByUserId(userId),
            "totalLists", contactListService.countByUserId(userId),
            "totalImports", contactImportService.countByUserId(userId)
        ));
    }

    @GetMapping("/list/{listId}/stats")
    public ResponseEntity<Map<String, Object>> getContactListStats(@PathVariable Long listId) {
        return ResponseEntity.ok(Map.of(
            "totalContacts", contactService.countContactsInList(listId),
            "activeContacts", contactService.countActiveContactsInList(listId),
            "subscribedContacts", contactService.countSubscribedContactsInList(listId)
        ));
    }

    // === MAPPERS ===
    private ContactDTO mapToDTO(Contact contact) {
        ContactDTO dto = new ContactDTO();
        dto.setId(contact.getId());
        dto.setEmail(contact.getEmail());
        dto.setFirstName(contact.getFirstName());
        dto.setLastName(contact.getLastName());
        dto.setPhone(contact.getPhone());
        dto.setCompany(contact.getCompany());
        dto.setPosition(contact.getPosition());
        dto.setCountry(contact.getCountry());
        dto.setCity(contact.getCity());
        dto.setCustomFields(contact.getCustomFields());
        dto.setIsActive(contact.getIsActive());
        dto.setIsSubscribed(contact.getIsSubscribed());
        dto.setUserId(contact.getUserId());
        dto.setCreatedAt(contact.getCreatedAt());
        dto.setUpdatedAt(contact.getUpdatedAt());
        dto.setUnsubscribedAt(contact.getUnsubscribedAt());
        return dto;
    }

    private Contact mapToEntity(ContactDTO dto) {
        Contact contact = new Contact();
        contact.setId(dto.getId());
        contact.setEmail(dto.getEmail());
        contact.setFirstName(dto.getFirstName());
        contact.setLastName(dto.getLastName());
        contact.setPhone(dto.getPhone());
        contact.setCompany(dto.getCompany());
        contact.setPosition(dto.getPosition());
        contact.setCountry(dto.getCountry());
        contact.setCity(dto.getCity());
        contact.setCustomFields(dto.getCustomFields());
        contact.setIsActive(dto.getIsActive());
        contact.setIsSubscribed(dto.getIsSubscribed());
        contact.setUserId(dto.getUserId());
        return contact;
    }

    private ContactListDTO mapToDTO(ContactList contactList) {
        ContactListDTO dto = new ContactListDTO();
        dto.setId(contactList.getId());
        dto.setName(contactList.getName());
        dto.setDescription(contactList.getDescription());
        dto.setUserId(contactList.getUserId());
        dto.setIsActive(contactList.getIsActive());
        dto.setCreatedAt(contactList.getCreatedAt());
        dto.setUpdatedAt(contactList.getUpdatedAt());
        
        // Agregar conteo de contactos si está disponible
        try {
            dto.setContactCount(contactService.countContactsInList(contactList.getId()));
        } catch (Exception e) {
            dto.setContactCount(0L);
        }
        
        return dto;
    }

    private ContactList mapToEntity(ContactListDTO dto) {
        ContactList contactList = new ContactList();
        contactList.setId(dto.getId());
        contactList.setName(dto.getName());
        contactList.setDescription(dto.getDescription());
        contactList.setUserId(dto.getUserId());
        contactList.setIsActive(dto.getIsActive());
        return contactList;
    }

    private ContactImportDTO mapToDTO(ContactImport importRecord) {
        ContactImportDTO dto = new ContactImportDTO();
        dto.setId(importRecord.getId());
        dto.setFilename(importRecord.getFilename());
        dto.setOriginalFilename(importRecord.getOriginalFilename());
        dto.setFileSize(importRecord.getFileSize());
        dto.setTotalRecords(importRecord.getTotalRecords());
        dto.setProcessedRecords(importRecord.getProcessedRecords());
        dto.setSuccessfulRecords(importRecord.getSuccessfulRecords());
        dto.setFailedRecords(importRecord.getFailedRecords());
        dto.setStatus(importRecord.getStatus());
        dto.setErrorMessage(importRecord.getErrorMessage());
        dto.setUserId(importRecord.getUserId());
        dto.setContactListId(importRecord.getContactListId());
        dto.setStartedAt(importRecord.getStartedAt());
        dto.setCompletedAt(importRecord.getCompletedAt());
        dto.setCreatedAt(importRecord.getCreatedAt());
        return dto;
    }
}