package com.correos.masivos.queue.model;

import javax.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;

public class CampaignJob {
    
    @NotNull
    private Long campaignId;
    
    @NotNull
    private Long userId;
    
    private String campaignName;
    
    private JobType jobType;
    
    private List<Long> targetListIds;
    
    private List<Long> recipientIds;
    
    private Integer batchSize = 100;
    
    private Integer delayBetweenBatches = 60; // seconds
    
    private Integer priority = 5; // 1-10, 1 = highest
    
    private LocalDateTime scheduledAt;
    
    private LocalDateTime createdAt;
    
    private String status = "PENDING";

    public enum JobType {
        START_CAMPAIGN, PROCESS_BATCH, PAUSE_CAMPAIGN, RESUME_CAMPAIGN, CANCEL_CAMPAIGN
    }

    public CampaignJob() {
        this.createdAt = LocalDateTime.now();
        this.scheduledAt = LocalDateTime.now();
    }

    public CampaignJob(Long campaignId, Long userId, JobType jobType) {
        this();
        this.campaignId = campaignId;
        this.userId = userId;
        this.jobType = jobType;
    }

    // Getters and Setters
    public Long getCampaignId() { return campaignId; }
    public void setCampaignId(Long campaignId) { this.campaignId = campaignId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getCampaignName() { return campaignName; }
    public void setCampaignName(String campaignName) { this.campaignName = campaignName; }

    public JobType getJobType() { return jobType; }
    public void setJobType(JobType jobType) { this.jobType = jobType; }

    public List<Long> getTargetListIds() { return targetListIds; }
    public void setTargetListIds(List<Long> targetListIds) { this.targetListIds = targetListIds; }

    public List<Long> getRecipientIds() { return recipientIds; }
    public void setRecipientIds(List<Long> recipientIds) { this.recipientIds = recipientIds; }

    public Integer getBatchSize() { return batchSize; }
    public void setBatchSize(Integer batchSize) { this.batchSize = batchSize; }

    public Integer getDelayBetweenBatches() { return delayBetweenBatches; }
    public void setDelayBetweenBatches(Integer delayBetweenBatches) { this.delayBetweenBatches = delayBetweenBatches; }

    public Integer getPriority() { return priority; }
    public void setPriority(Integer priority) { this.priority = priority; }

    public LocalDateTime getScheduledAt() { return scheduledAt; }
    public void setScheduledAt(LocalDateTime scheduledAt) { this.scheduledAt = scheduledAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}