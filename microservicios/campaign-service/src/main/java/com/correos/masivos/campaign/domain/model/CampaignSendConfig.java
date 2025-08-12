package com.correos.masivos.campaign.domain.model;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "campaign_send_config")
public class CampaignSendConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campaign_id", nullable = false, unique = true)
    private Campaign campaign;

    @Column(name = "batch_size")
    private Integer batchSize = 100;

    @Column(name = "delay_between_batches")
    private Integer delayBetweenBatches = 60; // seconds

    @Column(name = "max_retries")
    private Integer maxRetries = 3;

    @Column(name = "retry_delay")
    private Integer retryDelay = 300; // seconds

    @Column(name = "smtp_provider")
    private String smtpProvider;

    @Column(name = "from_email", nullable = false)
    private String fromEmail;

    @Column(name = "from_name")
    private String fromName;

    @Column(name = "reply_to")
    private String replyTo;

    @Column(name = "track_opens")
    private Boolean trackOpens = true;

    @Column(name = "track_clicks")
    private Boolean trackClicks = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public CampaignSendConfig() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public CampaignSendConfig(Campaign campaign, String fromEmail) {
        this();
        this.campaign = campaign;
        this.fromEmail = fromEmail;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Campaign getCampaign() { return campaign; }
    public void setCampaign(Campaign campaign) { this.campaign = campaign; }

    public Integer getBatchSize() { return batchSize; }
    public void setBatchSize(Integer batchSize) { this.batchSize = batchSize; }

    public Integer getDelayBetweenBatches() { return delayBetweenBatches; }
    public void setDelayBetweenBatches(Integer delayBetweenBatches) { this.delayBetweenBatches = delayBetweenBatches; }

    public Integer getMaxRetries() { return maxRetries; }
    public void setMaxRetries(Integer maxRetries) { this.maxRetries = maxRetries; }

    public Integer getRetryDelay() { return retryDelay; }
    public void setRetryDelay(Integer retryDelay) { this.retryDelay = retryDelay; }

    public String getSmtpProvider() { return smtpProvider; }
    public void setSmtpProvider(String smtpProvider) { this.smtpProvider = smtpProvider; }

    public String getFromEmail() { return fromEmail; }
    public void setFromEmail(String fromEmail) { this.fromEmail = fromEmail; }

    public String getFromName() { return fromName; }
    public void setFromName(String fromName) { this.fromName = fromName; }

    public String getReplyTo() { return replyTo; }
    public void setReplyTo(String replyTo) { this.replyTo = replyTo; }

    public Boolean getTrackOpens() { return trackOpens; }
    public void setTrackOpens(Boolean trackOpens) { this.trackOpens = trackOpens; }

    public Boolean getTrackClicks() { return trackClicks; }
    public void setTrackClicks(Boolean trackClicks) { this.trackClicks = trackClicks; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}