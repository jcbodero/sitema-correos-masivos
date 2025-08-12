package com.correos.masivos.queue.model;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.Map;

public class EmailJob {
    
    @NotNull
    private Long campaignId;
    
    @NotNull
    private Long recipientId;
    
    @NotBlank
    @Email
    private String toEmail;
    
    @NotBlank
    private String subject;
    
    @NotBlank
    private String htmlContent;
    
    private String textContent;
    
    @NotBlank
    private String fromEmail;
    
    private String fromName;
    
    private String replyTo;
    
    private Map<String, Object> personalizationData;
    
    private Integer priority = 5; // 1-10, 1 = highest
    
    private Integer maxRetries = 3;
    
    private Integer currentRetry = 0;
    
    private LocalDateTime scheduledAt;
    
    private LocalDateTime createdAt;
    
    private String smtpProvider;
    
    private Boolean trackOpens = true;
    
    private Boolean trackClicks = true;

    public EmailJob() {
        this.createdAt = LocalDateTime.now();
        this.scheduledAt = LocalDateTime.now();
    }

    public EmailJob(Long campaignId, Long recipientId, String toEmail, String subject, String htmlContent, String fromEmail) {
        this();
        this.campaignId = campaignId;
        this.recipientId = recipientId;
        this.toEmail = toEmail;
        this.subject = subject;
        this.htmlContent = htmlContent;
        this.fromEmail = fromEmail;
    }

    public void incrementRetry() {
        this.currentRetry++;
    }

    public boolean hasReachedMaxRetries() {
        return this.currentRetry >= this.maxRetries;
    }

    // Getters and Setters
    public Long getCampaignId() { return campaignId; }
    public void setCampaignId(Long campaignId) { this.campaignId = campaignId; }

    public Long getRecipientId() { return recipientId; }
    public void setRecipientId(Long recipientId) { this.recipientId = recipientId; }

    public String getToEmail() { return toEmail; }
    public void setToEmail(String toEmail) { this.toEmail = toEmail; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getHtmlContent() { return htmlContent; }
    public void setHtmlContent(String htmlContent) { this.htmlContent = htmlContent; }

    public String getTextContent() { return textContent; }
    public void setTextContent(String textContent) { this.textContent = textContent; }

    public String getFromEmail() { return fromEmail; }
    public void setFromEmail(String fromEmail) { this.fromEmail = fromEmail; }

    public String getFromName() { return fromName; }
    public void setFromName(String fromName) { this.fromName = fromName; }

    public String getReplyTo() { return replyTo; }
    public void setReplyTo(String replyTo) { this.replyTo = replyTo; }

    public Map<String, Object> getPersonalizationData() { return personalizationData; }
    public void setPersonalizationData(Map<String, Object> personalizationData) { this.personalizationData = personalizationData; }

    public Integer getPriority() { return priority; }
    public void setPriority(Integer priority) { this.priority = priority; }

    public Integer getMaxRetries() { return maxRetries; }
    public void setMaxRetries(Integer maxRetries) { this.maxRetries = maxRetries; }

    public Integer getCurrentRetry() { return currentRetry; }
    public void setCurrentRetry(Integer currentRetry) { this.currentRetry = currentRetry; }

    public LocalDateTime getScheduledAt() { return scheduledAt; }
    public void setScheduledAt(LocalDateTime scheduledAt) { this.scheduledAt = scheduledAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getSmtpProvider() { return smtpProvider; }
    public void setSmtpProvider(String smtpProvider) { this.smtpProvider = smtpProvider; }

    public Boolean getTrackOpens() { return trackOpens; }
    public void setTrackOpens(Boolean trackOpens) { this.trackOpens = trackOpens; }

    public Boolean getTrackClicks() { return trackClicks; }
    public void setTrackClicks(Boolean trackClicks) { this.trackClicks = trackClicks; }
}