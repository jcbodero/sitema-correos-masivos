package com.correos.masivos.campaign.domain.model;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "campaign_target_lists")
public class CampaignTargetList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campaign_id", nullable = false)
    private Campaign campaign;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_type", nullable = false)
    private TargetType targetType;

    @Column(name = "target_id", nullable = false)
    private Long targetId;

    @Column(name = "added_at")
    private LocalDateTime addedAt;

    public enum TargetType {
        LIST, SEGMENT, CONTACT
    }

    public CampaignTargetList() {
        this.addedAt = LocalDateTime.now();
    }

    public CampaignTargetList(Campaign campaign, TargetType targetType, Long targetId) {
        this();
        this.campaign = campaign;
        this.targetType = targetType;
        this.targetId = targetId;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Campaign getCampaign() { return campaign; }
    public void setCampaign(Campaign campaign) { this.campaign = campaign; }

    public TargetType getTargetType() { return targetType; }
    public void setTargetType(TargetType targetType) { this.targetType = targetType; }

    public Long getTargetId() { return targetId; }
    public void setTargetId(Long targetId) { this.targetId = targetId; }

    public LocalDateTime getAddedAt() { return addedAt; }
    public void setAddedAt(LocalDateTime addedAt) { this.addedAt = addedAt; }
}