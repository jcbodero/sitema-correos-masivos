package com.correos.masivos.campaign.api.dto;

import com.correos.masivos.campaign.domain.model.CampaignTargetList;
import java.time.LocalDateTime;

public class CampaignTargetListDTO {
    
    private Long id;
    private Long campaignId;
    private CampaignTargetList.TargetType targetType;
    private Long targetId;
    private LocalDateTime addedAt;
    
    // Información adicional del target
    private String targetName;
    private Integer targetSize;

    // Constructors
    public CampaignTargetListDTO() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCampaignId() { return campaignId; }
    public void setCampaignId(Long campaignId) { this.campaignId = campaignId; }

    public CampaignTargetList.TargetType getTargetType() { return targetType; }
    public void setTargetType(CampaignTargetList.TargetType targetType) { this.targetType = targetType; }

    public Long getTargetId() { return targetId; }
    public void setTargetId(Long targetId) { this.targetId = targetId; }

    public LocalDateTime getAddedAt() { return addedAt; }
    public void setAddedAt(LocalDateTime addedAt) { this.addedAt = addedAt; }

    public String getTargetName() { return targetName; }
    public void setTargetName(String targetName) { this.targetName = targetName; }

    public Integer getTargetSize() { return targetSize; }
    public void setTargetSize(Integer targetSize) { this.targetSize = targetSize; }
}