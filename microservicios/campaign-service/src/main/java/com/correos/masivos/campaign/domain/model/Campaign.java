package com.correos.masivos.campaign.domain.model;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "campaigns")
public class Campaign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nombre de campaña es requerido")
    @Size(max = 255, message = "Nombre no puede exceder 255 caracteres")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Asunto es requerido")
    @Size(max = 500, message = "Asunto no puede exceder 500 caracteres")
    @Column(nullable = false)
    private String subject;

    @Size(max = 1000, message = "Descripción no puede exceder 1000 caracteres")
    private String description;

    @Column(name = "template_id")
    private Long templateId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    private CampaignStatus status = CampaignStatus.DRAFT;

    @Enumerated(EnumType.STRING)
    @Column(name = "send_type")
    private SendType sendType = SendType.IMMEDIATE;

    @Column(name = "scheduled_at")
    private LocalDateTime scheduledAt;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "total_recipients")
    private Integer totalRecipients = 0;

    @Column(name = "sent_count")
    private Integer sentCount = 0;

    @Column(name = "delivered_count")
    private Integer deliveredCount = 0;

    @Column(name = "opened_count")
    private Integer openedCount = 0;

    @Column(name = "clicked_count")
    private Integer clickedCount = 0;

    @Column(name = "bounced_count")
    private Integer bouncedCount = 0;

    @Column(name = "unsubscribed_count")
    private Integer unsubscribedCount = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "campaign", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CampaignRecipient> recipients = new ArrayList<>();

    @OneToMany(mappedBy = "campaign", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CampaignTargetList> targetLists = new ArrayList<>();

    @OneToOne(mappedBy = "campaign", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private CampaignSendConfig sendConfig;

    public enum CampaignStatus {
        DRAFT, SCHEDULED, SENDING, SENT, PAUSED, CANCELLED, FAILED
    }

    public enum SendType {
        IMMEDIATE, SCHEDULED, RECURRING
    }

    public Campaign() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Campaign(String name, String subject, Long userId) {
        this();
        this.name = name;
        this.subject = subject;
        this.userId = userId;
    }

    // Business methods
    public void schedule(LocalDateTime scheduledAt) {
        this.scheduledAt = scheduledAt;
        this.sendType = SendType.SCHEDULED;
        this.status = CampaignStatus.SCHEDULED;
        this.updatedAt = LocalDateTime.now();
    }

    public void start() {
        this.status = CampaignStatus.SENDING;
        this.startedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public void complete() {
        this.status = CampaignStatus.SENT;
        this.completedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public void pause() {
        this.status = CampaignStatus.PAUSED;
        this.updatedAt = LocalDateTime.now();
    }

    public void cancel() {
        this.status = CampaignStatus.CANCELLED;
        this.updatedAt = LocalDateTime.now();
    }

    public void fail() {
        this.status = CampaignStatus.FAILED;
        this.updatedAt = LocalDateTime.now();
    }

    public double getOpenRate() {
        return totalRecipients > 0 ? (double) openedCount / totalRecipients * 100 : 0;
    }

    public double getClickRate() {
        return totalRecipients > 0 ? (double) clickedCount / totalRecipients * 100 : 0;
    }

    public double getDeliveryRate() {
        return totalRecipients > 0 ? (double) deliveredCount / totalRecipients * 100 : 0;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Long getTemplateId() { return templateId; }
    public void setTemplateId(Long templateId) { this.templateId = templateId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public CampaignStatus getStatus() { return status; }
    public void setStatus(CampaignStatus status) { this.status = status; }

    public SendType getSendType() { return sendType; }
    public void setSendType(SendType sendType) { this.sendType = sendType; }

    public LocalDateTime getScheduledAt() { return scheduledAt; }
    public void setScheduledAt(LocalDateTime scheduledAt) { this.scheduledAt = scheduledAt; }

    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public Integer getTotalRecipients() { return totalRecipients; }
    public void setTotalRecipients(Integer totalRecipients) { this.totalRecipients = totalRecipients; }

    public Integer getSentCount() { return sentCount; }
    public void setSentCount(Integer sentCount) { this.sentCount = sentCount; }

    public Integer getDeliveredCount() { return deliveredCount; }
    public void setDeliveredCount(Integer deliveredCount) { this.deliveredCount = deliveredCount; }

    public Integer getOpenedCount() { return openedCount; }
    public void setOpenedCount(Integer openedCount) { this.openedCount = openedCount; }

    public Integer getClickedCount() { return clickedCount; }
    public void setClickedCount(Integer clickedCount) { this.clickedCount = clickedCount; }

    public Integer getBouncedCount() { return bouncedCount; }
    public void setBouncedCount(Integer bouncedCount) { this.bouncedCount = bouncedCount; }

    public Integer getUnsubscribedCount() { return unsubscribedCount; }
    public void setUnsubscribedCount(Integer unsubscribedCount) { this.unsubscribedCount = unsubscribedCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<CampaignRecipient> getRecipients() { return recipients; }
    public void setRecipients(List<CampaignRecipient> recipients) { this.recipients = recipients; }

    public List<CampaignTargetList> getTargetLists() { return targetLists; }
    public void setTargetLists(List<CampaignTargetList> targetLists) { this.targetLists = targetLists; }

    public CampaignSendConfig getSendConfig() { return sendConfig; }
    public void setSendConfig(CampaignSendConfig sendConfig) { this.sendConfig = sendConfig; }
}