package com.correos.masivos.email.api.dto;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

import java.util.Map;

public class SendEmailRequest {
    private Long campaignId;
    private Long recipientId;
    
    @NotBlank(message = "Email destinatario es requerido")
    @Email(message = "Email destinatario debe tener formato válido")
    private String to;
    
    private String from;
    private String fromName;
    
    @NotBlank(message = "Asunto es requerido")
    private String subject;
    
    @NotBlank(message = "Contenido HTML es requerido")
    private String htmlContent;
    
    private String textContent;
    private Map<String, String> personalizations;

    public String getTo() { return to; }
    public void setTo(String to) { this.to = to; }
    
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
    
    public Map<String, String> getPersonalizations() { return personalizations; }
    public void setPersonalizations(Map<String, String> personalizations) { this.personalizations = personalizations; }
    
    public Long getCampaignId() { return campaignId; }
    public void setCampaignId(Long campaignId) { this.campaignId = campaignId; }
    
    public Long getRecipientId() { return recipientId; }
    public void setRecipientId(Long recipientId) { this.recipientId = recipientId; }
}