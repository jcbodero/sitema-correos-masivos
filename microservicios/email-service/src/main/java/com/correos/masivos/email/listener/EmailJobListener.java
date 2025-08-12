package com.correos.masivos.email.listener;

import com.correos.masivos.email.domain.model.EmailMessage;
import com.correos.masivos.email.domain.service.EmailService;
import com.correos.masivos.queue.config.RabbitConfig;
import com.correos.masivos.queue.model.EmailJob;
import com.correos.masivos.queue.service.QueueService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class EmailJobListener {

    private static final Logger logger = LoggerFactory.getLogger(EmailJobListener.class);

    @Autowired
    private EmailService emailService;

    @Autowired
    private QueueService queueService;

    @RabbitListener(queues = RabbitConfig.EMAIL_QUEUE)
    public void processEmailJob(EmailJob emailJob) {
        logger.info("Procesando trabajo de email: campaignId={}, recipientId={}, email={}", 
                   emailJob.getCampaignId(), emailJob.getRecipientId(), emailJob.getToEmail());

        try {
            // Convert EmailJob to EmailMessage
            EmailMessage emailMessage = convertToEmailMessage(emailJob);
            
            // Send email
            var emailLog = emailService.sendEmail(emailMessage);
            
            if (emailLog.getStatus().name().equals("SENT")) {
                logger.info("Email enviado exitosamente: campaignId={}, recipientId={}", 
                           emailJob.getCampaignId(), emailJob.getRecipientId());
            } else {
                logger.warn("Email falló: campaignId={}, recipientId={}, status={}", 
                           emailJob.getCampaignId(), emailJob.getRecipientId(), emailLog.getStatus());
                
                // Retry if possible
                if (!emailJob.hasReachedMaxRetries()) {
                    queueService.retryEmailJob(emailJob);
                }
            }

        } catch (Exception e) {
            logger.error("Error procesando trabajo de email: campaignId={}, recipientId={}", 
                        emailJob.getCampaignId(), emailJob.getRecipientId(), e);
            
            // Retry if possible
            if (!emailJob.hasReachedMaxRetries()) {
                queueService.retryEmailJob(emailJob);
            } else {
                logger.error("Email job ha alcanzado el máximo de reintentos: campaignId={}, recipientId={}", 
                            emailJob.getCampaignId(), emailJob.getRecipientId());
            }
        }
    }

    private EmailMessage convertToEmailMessage(EmailJob emailJob) {
        EmailMessage message = new EmailMessage();
        message.setCampaignId(emailJob.getCampaignId());
        message.setRecipientId(emailJob.getRecipientId());
        message.setTo(emailJob.getToEmail());
        message.setSubject(emailJob.getSubject());
        message.setHtmlContent(emailJob.getHtmlContent());
        message.setTextContent(emailJob.getTextContent());
        message.setFrom(emailJob.getFromEmail());
        message.setFromName(emailJob.getFromName());
        message.setReplyTo(emailJob.getReplyTo());
        message.setPersonalizationData(emailJob.getPersonalizationData());
        message.setTrackOpens(emailJob.getTrackOpens());
        message.setTrackClicks(emailJob.getTrackClicks());
        return message;
    }
}