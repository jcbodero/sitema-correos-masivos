package com.correos.masivos.email.infrastructure.service;

import com.correos.masivos.email.domain.model.EmailLog;
import com.correos.masivos.email.domain.model.EmailMessage;
import com.correos.masivos.email.domain.service.EmailProviderService;
import com.correos.masivos.email.domain.service.EmailService;
import com.correos.masivos.email.infrastructure.repository.EmailLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Qualifier;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeoutException;
import java.util.stream.Collectors;

@Service
@Transactional
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);
    private static final String RATE_LIMIT_KEY = "email:rate_limit:";
    private static final int RATE_LIMIT_PER_HOUR = 1000; // Default rate limit

    @Autowired
    private EmailLogRepository emailLogRepository;

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    private final List<EmailProviderService> providers;

    public EmailServiceImpl(List<EmailProviderService> providers) {
        logger.info("Initializing EmailServiceImpl with {} total providers", providers.size());
        
        // Log all providers and their availability
        for (EmailProviderService provider : providers) {
            logger.info("Provider {}: available={}", provider.getProvider().getDisplayName(), provider.isAvailable());
        }
        
        this.providers = providers.stream()
                .filter(EmailProviderService::isAvailable)
                .sorted((p1, p2) -> Integer.compare(p1.getPriority(), p2.getPriority()))
                .collect(Collectors.toList());
        
        logger.info("Loaded {} email providers: {}", 
                   this.providers.size(),
                   this.providers.stream()
                       .map(p -> p.getProvider().getDisplayName())
                       .collect(Collectors.joining(", ")));
    }

    @Override
    public EmailLog sendEmail(EmailMessage message) {
        // Create email log
        EmailLog emailLog = new EmailLog(
            message.getCampaignId(),
            message.getRecipientId(),
            message.getTo(),
            message.getSubject(),
            message.getFrom()
        );
        emailLog.setFromName(message.getFromName());
        emailLog = emailLogRepository.save(emailLog);

        // Log available providers
        logger.info("Available providers: {}", 
                    providers.stream()
                        .filter(p -> p.isAvailable() && canSendEmail(p.getProvider().getName()))
                        .map(p -> p.getProvider().getDisplayName())
                        .collect(Collectors.joining(", ")));
        
        // Try to send with available providers
        for (EmailProviderService provider : providers) {
            logger.info("Checking provider {}: available={}, canSend={}", 
                        provider.getProvider().getDisplayName(), 
                        provider.isAvailable(), 
                        canSendEmail(provider.getProvider().getName()));
                        
            if (provider.isAvailable() && canSendEmail(provider.getProvider().getName())) {
                try {
                    emailLog.markAsSending();
                    emailLogRepository.save(emailLog);

                    logger.info("Enviando email via {}: to={}, subject={}", 
                               provider.getProvider().getDisplayName(), message.getTo(), message.getSubject());

                    // Try sending with timeout
                    boolean success = false;
                    try {
                        success = java.util.concurrent.CompletableFuture
                            .supplyAsync(() -> provider.sendEmail(message))
                            .get(15, java.util.concurrent.TimeUnit.SECONDS);
                    } catch (java.util.concurrent.TimeoutException e) {
                        logger.warn("Timeout enviando email via {}", provider.getProvider().getDisplayName());
                        success = false;
                    } catch (Exception e) {
                        logger.error("Error enviando email via {}: {}", provider.getProvider().getDisplayName(), e.getMessage());
                        success = false;
                    }

                    if (success) {
                        emailLog.markAsSent(message.getExternalId(), provider.getProvider().getName());
                        recordEmailSent(provider.getProvider().getName());
                        emailLogRepository.save(emailLog);
                        
                        logger.info("Email enviado exitosamente via {}", provider.getProvider().getDisplayName());
                        return emailLog;
                    }
                } catch (Exception e) {
                    logger.error("Error enviando email via {}: {}", provider.getProvider().getDisplayName(), e.getMessage());
                }
            }
        }

        // All providers failed
        emailLog.markAsFailed("Todos los proveedores fallaron");
        emailLogRepository.save(emailLog);
        logger.error("Falló envío de email a {} - todos los proveedores fallaron", message.getTo());
        
        return emailLog;
    }

    @Override
    public List<EmailLog> sendEmailBatch(List<EmailMessage> messages) {
        logger.info("Enviando lote de {} emails", messages.size());
        
        List<EmailLog> results = new ArrayList<>();
        for (EmailMessage message : messages) {
            try {
                EmailLog result = sendEmail(message);
                results.add(result);
                
                // Small delay between emails to avoid overwhelming providers
                Thread.sleep(50);
            } catch (Exception e) {
                logger.error("Error en lote de emails: {}", e.getMessage());
            }
        }
        
        logger.info("Lote completado: {} emails procesados", results.size());
        return results;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<EmailLog> findById(Long id) {
        return emailLogRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EmailLog> findByCampaignId(Long campaignId, Pageable pageable) {
        return emailLogRepository.findByCampaignId(campaignId, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EmailLog> findByStatus(EmailLog.EmailStatus status, Pageable pageable) {
        return emailLogRepository.findByStatus(status, pageable);
    }

    @Override
    public boolean canSendEmail(String provider) {
        String key = RATE_LIMIT_KEY + provider;
        String count = redisTemplate.opsForValue().get(key);
        
        if (count == null) {
            return true;
        }
        
        return Integer.parseInt(count) < RATE_LIMIT_PER_HOUR;
    }

    @Override
    public void recordEmailSent(String provider) {
        String key = RATE_LIMIT_KEY + provider;
        redisTemplate.opsForValue().increment(key);
        redisTemplate.expire(key, 1, TimeUnit.HOURS);
    }

    @Override
    public void retryFailedEmails(Long campaignId) {
        List<EmailLog> failedEmails = emailLogRepository.findFailedEmailsForRetry(campaignId);
        
        logger.info("Reintentando {} emails fallidos para campaña {}", failedEmails.size(), campaignId);
        
        for (EmailLog emailLog : failedEmails) {
            try {
                EmailMessage message = createMessageFromLog(emailLog);
                
                // Try to send again
                for (EmailProviderService provider : providers) {
                    if (provider.isAvailable() && canSendEmail(provider.getProvider().getName())) {
                        emailLog.incrementRetry();
                        emailLog.markAsSending();
                        emailLogRepository.save(emailLog);
                        
                        if (provider.sendEmail(message)) {
                            emailLog.markAsSent(message.getExternalId(), provider.getProvider().getName());
                            recordEmailSent(provider.getProvider().getName());
                            emailLogRepository.save(emailLog);
                            break;
                        }
                    }
                }
                
                if (emailLog.getStatus() == EmailLog.EmailStatus.SENDING) {
                    emailLog.markAsFailed("Reintento fallido - todos los proveedores no disponibles");
                    emailLogRepository.save(emailLog);
                }
                
            } catch (Exception e) {
                logger.error("Error en reintento de email {}: {}", emailLog.getId(), e.getMessage());
            }
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmailLog> getFailedEmails(Long campaignId) {
        return emailLogRepository.findFailedEmailsForRetry(campaignId);
    }

    @Override
    @Transactional(readOnly = true)
    public long countByStatus(EmailLog.EmailStatus status) {
        return emailLogRepository.countByStatus(status);
    }

    @Override
    @Transactional(readOnly = true)
    public long countByCampaignIdAndStatus(Long campaignId, EmailLog.EmailStatus status) {
        return emailLogRepository.countByCampaignIdAndStatus(campaignId, status);
    }
    
    @Override
    @Transactional(readOnly = true)
    public com.correos.masivos.email.api.dto.EmailStatsDTO getDetailedStats(Long campaignId, LocalDateTime fromDate, LocalDateTime toDate) {
        // Get counts for each status
        long totalEmails = emailLogRepository.countTotalEmails(campaignId, fromDate, toDate);
        long sentEmails = emailLogRepository.countSentEmails(campaignId, fromDate, toDate);
        long deliveredEmails = emailLogRepository.countDeliveredEmails(campaignId, fromDate, toDate);
        long openedEmails = emailLogRepository.countOpenedEmails(campaignId, fromDate, toDate);
        long clickedEmails = emailLogRepository.countClickedEmails(campaignId, fromDate, toDate);
        long bouncedEmails = emailLogRepository.countBouncedEmails(campaignId, fromDate, toDate);
        long failedEmails = emailLogRepository.countFailedEmails(campaignId, fromDate, toDate);
        
        // Create DTO with calculated rates
        com.correos.masivos.email.api.dto.EmailStatsDTO stats = new com.correos.masivos.email.api.dto.EmailStatsDTO(
            totalEmails, sentEmails, deliveredEmails, openedEmails, clickedEmails, bouncedEmails, failedEmails
        );
        
        stats.setCampaignId(campaignId);
        stats.setFromDate(fromDate);
        stats.setToDate(toDate);
        
        // Get status breakdown
        List<Object[]> statusBreakdown;
        if (campaignId != null && fromDate != null && toDate != null) {
            statusBreakdown = emailLogRepository.getCampaignStatsByDateRange(campaignId, fromDate, toDate);
        } else if (campaignId != null) {
            statusBreakdown = emailLogRepository.getCampaignStats(campaignId);
        } else if (fromDate != null && toDate != null) {
            statusBreakdown = emailLogRepository.getStatsByDateRange(fromDate, toDate);
        } else {
            statusBreakdown = emailLogRepository.getGlobalStats();
        }
        
        java.util.Map<String, Long> breakdown = new java.util.HashMap<>();
        for (Object[] row : statusBreakdown) {
            breakdown.put(row[0].toString(), ((Number) row[1]).longValue());
        }
        stats.setStatusBreakdown(breakdown);
        
        return stats;
    }

    @Override
    public void handleDeliveryEvent(String externalId, String event, LocalDateTime timestamp) {
        emailLogRepository.findByExternalId(externalId).ifPresent(emailLog -> {
            emailLog.markAsDelivered();
            emailLogRepository.save(emailLog);
            logger.debug("Email delivery event processed: {}", externalId);
        });
    }

    @Override
    public void handleOpenEvent(String externalId, LocalDateTime timestamp) {
        emailLogRepository.findByExternalId(externalId).ifPresent(emailLog -> {
            emailLog.markAsOpened();
            emailLogRepository.save(emailLog);
            logger.debug("Email open event processed: {}", externalId);
        });
    }

    @Override
    public void handleClickEvent(String externalId, LocalDateTime timestamp) {
        emailLogRepository.findByExternalId(externalId).ifPresent(emailLog -> {
            emailLog.markAsClicked();
            emailLogRepository.save(emailLog);
            logger.debug("Email click event processed: {}", externalId);
        });
    }

    @Override
    public void handleBounceEvent(String externalId, String reason, LocalDateTime timestamp) {
        emailLogRepository.findByExternalId(externalId).ifPresent(emailLog -> {
            emailLog.markAsBounced(reason);
            emailLogRepository.save(emailLog);
            logger.debug("Email bounce event processed: {}", externalId);
        });
    }

    private EmailMessage createMessageFromLog(EmailLog emailLog) {
        EmailMessage message = new EmailMessage();
        message.setCampaignId(emailLog.getCampaignId());
        message.setRecipientId(emailLog.getRecipientId());
        message.setTo(emailLog.getToEmail());
        message.setSubject(emailLog.getSubject());
        message.setFrom(emailLog.getFromEmail());
        message.setFromName(emailLog.getFromName());
        return message;
    }
}