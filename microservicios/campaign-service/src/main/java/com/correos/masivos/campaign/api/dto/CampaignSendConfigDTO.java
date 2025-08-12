package com.correos.masivos.campaign.api.dto;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Positive;

public class CampaignSendConfigDTO {
    
    private Long id;
    private Long campaignId;
    
    @Positive(message = "Tamaño de lote debe ser positivo")
    private Integer batchSize = 100;
    
    @Positive(message = "Delay entre lotes debe ser positivo")
    private Integer delayBetweenBatches = 60;
    
    @Positive(message = "Máximo de reintentos debe ser positivo")
    private Integer maxRetries = 3;
    
    @Positive(message = "Delay de reintento debe ser positivo")
    private Integer retryDelay = 300;
    
    private String smtpProvider;
    
    @NotBlank(message = "Email remitente es requerido")
    @Email(message = "Email remitente debe tener formato válido")
    private String fromEmail;
    
    private String fromName;
    
    @Email(message = "Reply-to debe tener formato válido")
    private String replyTo;
    
    private Boolean trackOpens = true;
    private Boolean trackClicks = true;

    // Constructors
    public CampaignSendConfigDTO() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCampaignId() { return campaignId; }
    public void setCampaignId(Long campaignId) { this.campaignId = campaignId; }

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
}