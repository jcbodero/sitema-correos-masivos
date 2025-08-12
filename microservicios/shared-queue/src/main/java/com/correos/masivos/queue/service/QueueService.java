package com.correos.masivos.queue.service;

import com.correos.masivos.queue.config.RabbitConfig;
import com.correos.masivos.queue.model.CampaignJob;
import com.correos.masivos.queue.model.EmailJob;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class QueueService {

    private static final Logger logger = LoggerFactory.getLogger(QueueService.class);

    @Autowired
    private RabbitTemplate rabbitTemplate;

    // Email Queue Operations
    public void sendEmailJob(EmailJob emailJob) {
        try {
            logger.info("Enviando trabajo de email a cola: campaignId={}, recipientId={}, email={}", 
                       emailJob.getCampaignId(), emailJob.getRecipientId(), emailJob.getToEmail());
            
            rabbitTemplate.convertAndSend(
                RabbitConfig.EMAIL_EXCHANGE, 
                RabbitConfig.EMAIL_ROUTING_KEY, 
                emailJob
            );
            
            logger.debug("Trabajo de email enviado exitosamente");
        } catch (Exception e) {
            logger.error("Error enviando trabajo de email a cola", e);
            throw new RuntimeException("Failed to send email job to queue", e);
        }
    }

    public void sendEmailJobBatch(List<EmailJob> emailJobs) {
        logger.info("Enviando lote de {} trabajos de email a cola", emailJobs.size());
        
        for (EmailJob emailJob : emailJobs) {
            sendEmailJob(emailJob);
        }
        
        logger.info("Lote de trabajos de email enviado exitosamente");
    }

    public void sendDelayedEmailJob(EmailJob emailJob, LocalDateTime scheduledAt) {
        emailJob.setScheduledAt(scheduledAt);
        
        // Calculate delay in milliseconds
        long delay = java.time.Duration.between(LocalDateTime.now(), scheduledAt).toMillis();
        
        if (delay > 0) {
            logger.info("Enviando trabajo de email programado para: {}", scheduledAt);
            
            rabbitTemplate.convertAndSend(
                RabbitConfig.EMAIL_EXCHANGE, 
                RabbitConfig.EMAIL_ROUTING_KEY, 
                emailJob,
                message -> {
                    message.getMessageProperties().setDelay((int) delay);
                    return message;
                }
            );
        } else {
            // Send immediately if scheduled time is in the past
            sendEmailJob(emailJob);
        }
    }

    // Campaign Queue Operations
    public void sendCampaignJob(CampaignJob campaignJob) {
        try {
            logger.info("Enviando trabajo de campaña a cola: campaignId={}, jobType={}", 
                       campaignJob.getCampaignId(), campaignJob.getJobType());
            
            rabbitTemplate.convertAndSend(
                RabbitConfig.CAMPAIGN_EXCHANGE, 
                RabbitConfig.CAMPAIGN_ROUTING_KEY, 
                campaignJob
            );
            
            logger.debug("Trabajo de campaña enviado exitosamente");
        } catch (Exception e) {
            logger.error("Error enviando trabajo de campaña a cola", e);
            throw new RuntimeException("Failed to send campaign job to queue", e);
        }
    }

    public void sendDelayedCampaignJob(CampaignJob campaignJob, LocalDateTime scheduledAt) {
        campaignJob.setScheduledAt(scheduledAt);
        
        long delay = java.time.Duration.between(LocalDateTime.now(), scheduledAt).toMillis();
        
        if (delay > 0) {
            logger.info("Enviando trabajo de campaña programado para: {}", scheduledAt);
            
            rabbitTemplate.convertAndSend(
                RabbitConfig.CAMPAIGN_EXCHANGE, 
                RabbitConfig.CAMPAIGN_ROUTING_KEY, 
                campaignJob,
                message -> {
                    message.getMessageProperties().setDelay((int) delay);
                    return message;
                }
            );
        } else {
            sendCampaignJob(campaignJob);
        }
    }

    // Priority Queue Operations
    public void sendHighPriorityEmailJob(EmailJob emailJob) {
        emailJob.setPriority(1); // Highest priority
        sendEmailJob(emailJob);
    }

    public void sendHighPriorityCampaignJob(CampaignJob campaignJob) {
        campaignJob.setPriority(1); // Highest priority
        sendCampaignJob(campaignJob);
    }

    // Retry Operations
    public void retryEmailJob(EmailJob emailJob) {
        if (!emailJob.hasReachedMaxRetries()) {
            emailJob.incrementRetry();
            
            // Exponential backoff for retries
            long delay = (long) (Math.pow(2, emailJob.getCurrentRetry()) * 1000);
            LocalDateTime retryAt = LocalDateTime.now().plusSeconds(delay / 1000);
            
            logger.info("Reintentando trabajo de email: retry={}/{}, delay={}s", 
                       emailJob.getCurrentRetry(), emailJob.getMaxRetries(), delay / 1000);
            
            sendDelayedEmailJob(emailJob, retryAt);
        } else {
            logger.error("Trabajo de email ha alcanzado el máximo de reintentos: campaignId={}, recipientId={}", 
                        emailJob.getCampaignId(), emailJob.getRecipientId());
            // Could send to a failed jobs queue or notification system
        }
    }

    // Queue Health Check
    public boolean isQueueHealthy() {
        try {
            // Simple test to check if RabbitMQ is responsive
            rabbitTemplate.convertAndSend("test.exchange", "test.key", "health-check");
            return true;
        } catch (Exception e) {
            logger.error("Queue health check failed", e);
            return false;
        }
    }
}