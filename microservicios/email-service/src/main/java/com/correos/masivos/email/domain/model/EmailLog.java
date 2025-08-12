package com.correos.masivos.email.domain.model;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "email_logs")
public class EmailLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "campaign_id")
    private Long campaignId;

    @Column(name = "recipient_id")
    private Long recipientId;

    @Column(name = "recipient_email")
    private String recipientEmail;

    @Column(name = "to_email")
    private String toEmail;

    @Column(name = "subject")
    private String subject;

    @Column(name = "from_email")
    private String fromEmail;

    @Column(name = "from_name")
    private String fromName;

    @Enumerated(EnumType.STRING)
    private EmailStatus status = EmailStatus.PENDING;

    @Column(name = "smtp_provider")
    private String smtpProvider;

    @Column(name = "external_id")
    private String externalId;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

    @Column(name = "opened_at")
    private LocalDateTime openedAt;

    @Column(name = "clicked_at")
    private LocalDateTime clickedAt;

    @Column(name = "bounced_at")
    private LocalDateTime bouncedAt;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @Column(name = "retry_count")
    private Integer retryCount = 0;

    @Column(name = "max_retries")
    private Integer maxRetries = 3;

    @Column(name = "metadata", columnDefinition = "TEXT")
    private String metadata;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum EmailStatus {
        PENDING, SENDING, SENT, DELIVERED, OPENED, CLICKED, BOUNCED, FAILED, CANCELLED
    }

    public EmailLog() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public EmailLog(Long campaignId, Long recipientId, String toEmail, String subject, String fromEmail) {
        this();
        this.campaignId = campaignId;
        this.recipientId = recipientId;
        this.toEmail = toEmail;
        this.recipientEmail = toEmail; // Set both fields
        this.subject = subject;
        this.fromEmail = fromEmail;
    }

    // Business methods
    public void markAsSending() {
        this.status = EmailStatus.SENDING;
        this.updatedAt = LocalDateTime.now();
    }

    public void markAsSent(String externalId, String smtpProvider) {
        this.status = EmailStatus.SENT;
        this.sentAt = LocalDateTime.now();
        this.externalId = externalId;
        this.smtpProvider = smtpProvider;
        this.updatedAt = LocalDateTime.now();
    }

    public void markAsDelivered() {
        this.status = EmailStatus.DELIVERED;
        this.deliveredAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public void markAsOpened() {
        if (this.status != EmailStatus.CLICKED) {
            this.status = EmailStatus.OPENED;
        }
        this.openedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public void markAsClicked() {
        this.status = EmailStatus.CLICKED;
        this.clickedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public void markAsBounced(String errorMessage) {
        this.status = EmailStatus.BOUNCED;
        this.bouncedAt = LocalDateTime.now();
        this.errorMessage = errorMessage;
        this.updatedAt = LocalDateTime.now();
    }

    public void markAsFailed(String errorMessage) {
        this.status = EmailStatus.FAILED;
        this.errorMessage = errorMessage;
        this.updatedAt = LocalDateTime.now();
    }

    public void incrementRetry() {
        this.retryCount++;
        this.updatedAt = LocalDateTime.now();
    }

    public boolean canRetry() {
        return this.retryCount < this.maxRetries;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCampaignId() { return campaignId; }
    public void setCampaignId(Long campaignId) { this.campaignId = campaignId; }

    public Long getRecipientId() { return recipientId; }
    public void setRecipientId(Long recipientId) { this.recipientId = recipientId; }

    public String getRecipientEmail() { return recipientEmail; }
    public void setRecipientEmail(String recipientEmail) { this.recipientEmail = recipientEmail; }

    public String getToEmail() { return toEmail; }
    public void setToEmail(String toEmail) { 
        this.toEmail = toEmail;
        this.recipientEmail = toEmail; // Keep both in sync
    }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getFromEmail() { return fromEmail; }
    public void setFromEmail(String fromEmail) { this.fromEmail = fromEmail; }

    public String getFromName() { return fromName; }
    public void setFromName(String fromName) { this.fromName = fromName; }

    public EmailStatus getStatus() { return status; }
    public void setStatus(EmailStatus status) { this.status = status; }

    public String getSmtpProvider() { return smtpProvider; }
    public void setSmtpProvider(String smtpProvider) { this.smtpProvider = smtpProvider; }

    public String getExternalId() { return externalId; }
    public void setExternalId(String externalId) { this.externalId = externalId; }

    public LocalDateTime getSentAt() { return sentAt; }
    public void setSentAt(LocalDateTime sentAt) { this.sentAt = sentAt; }

    public LocalDateTime getDeliveredAt() { return deliveredAt; }
    public void setDeliveredAt(LocalDateTime deliveredAt) { this.deliveredAt = deliveredAt; }

    public LocalDateTime getOpenedAt() { return openedAt; }
    public void setOpenedAt(LocalDateTime openedAt) { this.openedAt = openedAt; }

    public LocalDateTime getClickedAt() { return clickedAt; }
    public void setClickedAt(LocalDateTime clickedAt) { this.clickedAt = clickedAt; }

    public LocalDateTime getBouncedAt() { return bouncedAt; }
    public void setBouncedAt(LocalDateTime bouncedAt) { this.bouncedAt = bouncedAt; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }

    public Integer getRetryCount() { return retryCount; }
    public void setRetryCount(Integer retryCount) { this.retryCount = retryCount; }

    public Integer getMaxRetries() { return maxRetries; }
    public void setMaxRetries(Integer maxRetries) { this.maxRetries = maxRetries; }

    public String getMetadata() { return metadata; }
    public void setMetadata(String metadata) { this.metadata = metadata; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}