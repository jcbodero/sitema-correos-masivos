package com.correos.masivos.email.api.dto;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;

public class BulkEmailRequest {
    
    @NotEmpty(message = "Recipients list cannot be empty")
    @Valid
    private List<EmailRecipient> recipients;
    
    private String from;
    private String fromName;
    
    @NotBlank(message = "Subject is required")
    private String subject;
    
    @NotBlank(message = "HTML content is required")
    private String htmlContent;
    
    private String textContent;
    private Long campaignId;
    private Map<String, String> globalPersonalizations;
    private Boolean trackOpens = true;
    private Boolean trackClicks = true;

    public static class EmailRecipient {
        @NotBlank(message = "Email is required")
        private String email;
        
        private Long recipientId;
        private Map<String, String> personalizations;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public Long getRecipientId() { return recipientId; }
        public void setRecipientId(Long recipientId) { this.recipientId = recipientId; }
        public Map<String, String> getPersonalizations() { return personalizations; }
        public void setPersonalizations(Map<String, String> personalizations) { this.personalizations = personalizations; }
    }

    public List<EmailRecipient> getRecipients() { return recipients; }
    public void setRecipients(List<EmailRecipient> recipients) { this.recipients = recipients; }
    public String getFrom() { return from; }
    public void setFrom(String from) { this.from = from; }
    public String getFromName() { return fromName; }
    public void setFromName(String fromName) { this.fromName = fromName; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getHtmlContent() { return htmlContent; }
    public void setHtmlContent(String htmlContent) { this.htmlContent = htmlContent; }
    public String getTextContent() { return textContent; }
    public void setTextContent(String textContent) { this.textContent = textContent; }
    public Long getCampaignId() { return campaignId; }
    public void setCampaignId(Long campaignId) { this.campaignId = campaignId; }
    public Map<String, String> getGlobalPersonalizations() { return globalPersonalizations; }
    public void setGlobalPersonalizations(Map<String, String> globalPersonalizations) { this.globalPersonalizations = globalPersonalizations; }
    public Boolean getTrackOpens() { return trackOpens; }
    public void setTrackOpens(Boolean trackOpens) { this.trackOpens = trackOpens; }
    public Boolean getTrackClicks() { return trackClicks; }
    public void setTrackClicks(Boolean trackClicks) { this.trackClicks = trackClicks; }
}