package com.correos.masivos.email.api.dto;

public class EmailResponse {
    private boolean success;
    private String message;
    private Long emailLogId;

    public EmailResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
    
    public EmailResponse(boolean success, String message, Long emailLogId) {
        this.success = success;
        this.message = message;
        this.emailLogId = emailLogId;
    }

    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
    public Long getEmailLogId() { return emailLogId; }
}