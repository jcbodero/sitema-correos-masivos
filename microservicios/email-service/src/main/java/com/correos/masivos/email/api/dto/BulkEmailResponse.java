package com.correos.masivos.email.api.dto;

import java.util.List;

public class BulkEmailResponse {
    
    private int totalEmails;
    private int successfulEmails;
    private int failedEmails;
    private List<EmailResult> results;

    public BulkEmailResponse(int totalEmails, int successfulEmails, int failedEmails, List<EmailResult> results) {
        this.totalEmails = totalEmails;
        this.successfulEmails = successfulEmails;
        this.failedEmails = failedEmails;
        this.results = results;
    }

    public static class EmailResult {
        private String email;
        private Long emailLogId;
        private boolean success;
        private String errorMessage;

        public EmailResult(String email, Long emailLogId, boolean success, String errorMessage) {
            this.email = email;
            this.emailLogId = emailLogId;
            this.success = success;
            this.errorMessage = errorMessage;
        }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public Long getEmailLogId() { return emailLogId; }
        public void setEmailLogId(Long emailLogId) { this.emailLogId = emailLogId; }
        public boolean isSuccess() { return success; }
        public void setSuccess(boolean success) { this.success = success; }
        public String getErrorMessage() { return errorMessage; }
        public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
    }

    public int getTotalEmails() { return totalEmails; }
    public void setTotalEmails(int totalEmails) { this.totalEmails = totalEmails; }
    public int getSuccessfulEmails() { return successfulEmails; }
    public void setSuccessfulEmails(int successfulEmails) { this.successfulEmails = successfulEmails; }
    public int getFailedEmails() { return failedEmails; }
    public void setFailedEmails(int failedEmails) { this.failedEmails = failedEmails; }
    public List<EmailResult> getResults() { return results; }
    public void setResults(List<EmailResult> results) { this.results = results; }
}