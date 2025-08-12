package com.correos.masivos.campaign.api.dto;

import com.correos.masivos.campaign.domain.model.Campaign;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CampaignDTO {
    
    private Long id;
    
    @NotBlank(message = "Nombre de campaña es requerido")
    @Size(max = 255, message = "Nombre no puede exceder 255 caracteres")
    private String name;
    
    @NotBlank(message = "Asunto es requerido")
    @Size(max = 500, message = "Asunto no puede exceder 500 caracteres")
    private String subject;
    
    @Size(max = 1000, message = "Descripción no puede exceder 1000 caracteres")
    private String description;
    
    private Long templateId;
    private Long userId;
    private Campaign.CampaignStatus status;
    private Campaign.SendType sendType;
    private LocalDateTime scheduledAt;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private Integer totalRecipients;
    private Integer sentCount;
    private Integer deliveredCount;
    private Integer openedCount;
    private Integer clickedCount;
    private Integer bouncedCount;
    private Integer unsubscribedCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Campos calculados
    private Double openRate;
    private Double clickRate;
    private Double deliveryRate;
    
    // Configuración de envío
    private CampaignSendConfigDTO sendConfig;
    
    // Listas objetivo
    private List<CampaignTargetListDTO> targetLists;

    // Constructors
    public CampaignDTO() {}

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

    public Campaign.CampaignStatus getStatus() { return status; }
    public void setStatus(Campaign.CampaignStatus status) { this.status = status; }

    public Campaign.SendType getSendType() { return sendType; }
    public void setSendType(Campaign.SendType sendType) { this.sendType = sendType; }

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

    public Double getOpenRate() { return openRate; }
    public void setOpenRate(Double openRate) { this.openRate = openRate; }

    public Double getClickRate() { return clickRate; }
    public void setClickRate(Double clickRate) { this.clickRate = clickRate; }

    public Double getDeliveryRate() { return deliveryRate; }
    public void setDeliveryRate(Double deliveryRate) { this.deliveryRate = deliveryRate; }

    public CampaignSendConfigDTO getSendConfig() { return sendConfig; }
    public void setSendConfig(CampaignSendConfigDTO sendConfig) { this.sendConfig = sendConfig; }

    public List<CampaignTargetListDTO> getTargetLists() { return targetLists; }
    public void setTargetLists(List<CampaignTargetListDTO> targetLists) { this.targetLists = targetLists; }
}