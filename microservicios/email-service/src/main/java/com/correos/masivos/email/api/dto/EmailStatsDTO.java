package com.correos.masivos.email.api.dto;

import java.time.LocalDateTime;
import java.util.Map;

public class EmailStatsDTO {
    
    private Long totalEmails;
    private Long sentEmails;
    private Long deliveredEmails;
    private Long openedEmails;
    private Long clickedEmails;
    private Long bouncedEmails;
    private Long failedEmails;
    
    // Rates
    private Double deliveryRate;
    private Double openRate;
    private Double clickRate;
    private Double bounceRate;
    
    // Time range
    private LocalDateTime fromDate;
    private LocalDateTime toDate;
    
    // Campaign specific
    private Long campaignId;
    
    // Status breakdown
    private Map<String, Long> statusBreakdown;
    
    public EmailStatsDTO() {}
    
    public EmailStatsDTO(Long totalEmails, Long sentEmails, Long deliveredEmails, 
                        Long openedEmails, Long clickedEmails, Long bouncedEmails, Long failedEmails) {
        this.totalEmails = totalEmails;
        this.sentEmails = sentEmails;
        this.deliveredEmails = deliveredEmails;
        this.openedEmails = openedEmails;
        this.clickedEmails = clickedEmails;
        this.bouncedEmails = bouncedEmails;
        this.failedEmails = failedEmails;
        
        calculateRates();
    }
    
    private void calculateRates() {
        if (sentEmails > 0) {
            this.deliveryRate = (deliveredEmails.doubleValue() / sentEmails.doubleValue()) * 100;
            this.bounceRate = (bouncedEmails.doubleValue() / sentEmails.doubleValue()) * 100;
        }
        
        if (deliveredEmails > 0) {
            this.openRate = (openedEmails.doubleValue() / deliveredEmails.doubleValue()) * 100;
        }
        
        if (openedEmails > 0) {
            this.clickRate = (clickedEmails.doubleValue() / openedEmails.doubleValue()) * 100;
        }
    }
    
    // Getters and Setters
    public Long getTotalEmails() { return totalEmails; }
    public void setTotalEmails(Long totalEmails) { this.totalEmails = totalEmails; }
    
    public Long getSentEmails() { return sentEmails; }
    public void setSentEmails(Long sentEmails) { this.sentEmails = sentEmails; }
    
    public Long getDeliveredEmails() { return deliveredEmails; }
    public void setDeliveredEmails(Long deliveredEmails) { this.deliveredEmails = deliveredEmails; }
    
    public Long getOpenedEmails() { return openedEmails; }
    public void setOpenedEmails(Long openedEmails) { this.openedEmails = openedEmails; }
    
    public Long getClickedEmails() { return clickedEmails; }
    public void setClickedEmails(Long clickedEmails) { this.clickedEmails = clickedEmails; }
    
    public Long getBouncedEmails() { return bouncedEmails; }
    public void setBouncedEmails(Long bouncedEmails) { this.bouncedEmails = bouncedEmails; }
    
    public Long getFailedEmails() { return failedEmails; }
    public void setFailedEmails(Long failedEmails) { this.failedEmails = failedEmails; }
    
    public Double getDeliveryRate() { return deliveryRate; }
    public void setDeliveryRate(Double deliveryRate) { this.deliveryRate = deliveryRate; }
    
    public Double getOpenRate() { return openRate; }
    public void setOpenRate(Double openRate) { this.openRate = openRate; }
    
    public Double getClickRate() { return clickRate; }
    public void setClickRate(Double clickRate) { this.clickRate = clickRate; }
    
    public Double getBounceRate() { return bounceRate; }
    public void setBounceRate(Double bounceRate) { this.bounceRate = bounceRate; }
    
    public LocalDateTime getFromDate() { return fromDate; }
    public void setFromDate(LocalDateTime fromDate) { this.fromDate = fromDate; }
    
    public LocalDateTime getToDate() { return toDate; }
    public void setToDate(LocalDateTime toDate) { this.toDate = toDate; }
    
    public Long getCampaignId() { return campaignId; }
    public void setCampaignId(Long campaignId) { this.campaignId = campaignId; }
    
    public Map<String, Long> getStatusBreakdown() { return statusBreakdown; }
    public void setStatusBreakdown(Map<String, Long> statusBreakdown) { this.statusBreakdown = statusBreakdown; }
}