package com.correos.masivos.email.domain.model;

import java.util.Map;

public class EmailMessage {
    private Long campaignId;
    private Long recipientId;
    private String externalId;
    private String to;
    private String from;
    private String fromName;
    private String replyTo;
    private String subject;
    private String htmlContent;
    private String textContent;
    private Map<String, String> personalizations;
    private Map<String, Object> personalizationData;
    private Boolean trackOpens;
    private Boolean trackClicks;

    public EmailMessage() {}

    public EmailMessage(String to, String from, String fromName, String subject, 
                       String htmlContent, String textContent, Map<String, String> personalizations) {
        this.to = to;
        this.from = from;
        this.fromName = fromName;
        this.subject = subject;
        this.htmlContent = htmlContent;
        this.textContent = textContent;
        this.personalizations = personalizations;
    }

    // Getters
    public Long getCampaignId() { return campaignId; }
    public Long getRecipientId() { return recipientId; }
    public String getExternalId() { return externalId; }
    public String getTo() { return to; }
    public String getFrom() { return from; }
    public String getFromName() { return fromName; }
    public String getReplyTo() { return replyTo; }
    public String getSubject() { return subject; }
    public String getHtmlContent() { return htmlContent; }
    public String getTextContent() { return textContent; }
    public Map<String, String> getPersonalizations() { return personalizations; }
    public Map<String, Object> getPersonalizationData() { return personalizationData; }
    public Boolean getTrackOpens() { return trackOpens; }
    public Boolean getTrackClicks() { return trackClicks; }

    // Setters
    public void setCampaignId(Long campaignId) { this.campaignId = campaignId; }
    public void setRecipientId(Long recipientId) { this.recipientId = recipientId; }
    public void setExternalId(String externalId) { this.externalId = externalId; }
    public void setTo(String to) { this.to = to; }
    public void setFrom(String from) { this.from = from; }
    public void setFromName(String fromName) { this.fromName = fromName; }
    public void setReplyTo(String replyTo) { this.replyTo = replyTo; }
    public void setSubject(String subject) { this.subject = subject; }
    public void setHtmlContent(String htmlContent) { this.htmlContent = htmlContent; }
    public void setTextContent(String textContent) { this.textContent = textContent; }
    public void setPersonalizations(Map<String, String> personalizations) { this.personalizations = personalizations; }
    public void setPersonalizationData(Map<String, Object> personalizationData) { this.personalizationData = personalizationData; }
    public void setTrackOpens(Boolean trackOpens) { this.trackOpens = trackOpens; }
    public void setTrackClicks(Boolean trackClicks) { this.trackClicks = trackClicks; }
}