package com.correos.masivos.contact.api.dto;

import com.correos.masivos.contact.domain.model.ContactImport;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class ContactImportDTO {
    
    private Long id;
    private String filename;
    private String originalFilename;
    private Long fileSize;
    private Integer totalRecords;
    private Integer processedRecords;
    private Integer successfulRecords;
    private Integer failedRecords;
    private ContactImport.ImportStatus status;
    private String errorMessage;
    private Long userId;
    private Long contactListId;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;

    // Para preview de datos
    private List<String> headers;
    private List<Map<String, Object>> previewData;
    private Map<String, String> fieldMapping;

    // Constructors
    public ContactImportDTO() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }

    public String getOriginalFilename() { return originalFilename; }
    public void setOriginalFilename(String originalFilename) { this.originalFilename = originalFilename; }

    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }

    public Integer getTotalRecords() { return totalRecords; }
    public void setTotalRecords(Integer totalRecords) { this.totalRecords = totalRecords; }

    public Integer getProcessedRecords() { return processedRecords; }
    public void setProcessedRecords(Integer processedRecords) { this.processedRecords = processedRecords; }

    public Integer getSuccessfulRecords() { return successfulRecords; }
    public void setSuccessfulRecords(Integer successfulRecords) { this.successfulRecords = successfulRecords; }

    public Integer getFailedRecords() { return failedRecords; }
    public void setFailedRecords(Integer failedRecords) { this.failedRecords = failedRecords; }

    public ContactImport.ImportStatus getStatus() { return status; }
    public void setStatus(ContactImport.ImportStatus status) { this.status = status; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getContactListId() { return contactListId; }
    public void setContactListId(Long contactListId) { this.contactListId = contactListId; }

    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<String> getHeaders() { return headers; }
    public void setHeaders(List<String> headers) { this.headers = headers; }

    public List<Map<String, Object>> getPreviewData() { return previewData; }
    public void setPreviewData(List<Map<String, Object>> previewData) { this.previewData = previewData; }

    public Map<String, String> getFieldMapping() { return fieldMapping; }
    public void setFieldMapping(Map<String, String> fieldMapping) { this.fieldMapping = fieldMapping; }
}