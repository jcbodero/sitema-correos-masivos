package com.correos.masivos.email.domain.service;

import com.correos.masivos.email.domain.model.EmailLog;
import com.correos.masivos.email.domain.model.EmailMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface EmailService {
    
    // Envío de emails
    EmailLog sendEmail(EmailMessage message);
    List<EmailLog> sendEmailBatch(List<EmailMessage> messages);
    
    // Gestión de logs
    Optional<EmailLog> findById(Long id);
    Page<EmailLog> findByCampaignId(Long campaignId, Pageable pageable);
    Page<EmailLog> findByStatus(EmailLog.EmailStatus status, Pageable pageable);
    
    // Rate limiting
    boolean canSendEmail(String provider);
    void recordEmailSent(String provider);
    
    // Reintentos
    void retryFailedEmails(Long campaignId);
    List<EmailLog> getFailedEmails(Long campaignId);
    
    // Estadísticas
    long countByStatus(EmailLog.EmailStatus status);
    long countByCampaignIdAndStatus(Long campaignId, EmailLog.EmailStatus status);
    
    // Estadísticas detalladas
    com.correos.masivos.email.api.dto.EmailStatsDTO getDetailedStats(Long campaignId, LocalDateTime fromDate, LocalDateTime toDate);
    
    // Webhooks
    void handleDeliveryEvent(String externalId, String event, LocalDateTime timestamp);
    void handleOpenEvent(String externalId, LocalDateTime timestamp);
    void handleClickEvent(String externalId, LocalDateTime timestamp);
    void handleBounceEvent(String externalId, String reason, LocalDateTime timestamp);
}