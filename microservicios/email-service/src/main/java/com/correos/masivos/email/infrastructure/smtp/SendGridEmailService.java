package com.correos.masivos.email.infrastructure.smtp;

import com.correos.masivos.email.domain.model.EmailMessage;
import com.correos.masivos.email.domain.model.EmailProvider;
import com.correos.masivos.email.domain.service.EmailProviderService;
import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;

@Service
@ConditionalOnProperty(name = "email.use-legacy-providers", havingValue = "true")
public class SendGridEmailService implements EmailProviderService {
    
    private static final Logger logger = LoggerFactory.getLogger(SendGridEmailService.class);
    
    @Value("${email.sendgrid.password:}")
    private String apiKey;
    
    @Value("${email.sendgrid.enabled:false}")
    private boolean enabled;
    
    private final int priority = 1;

    @Override
    public boolean sendEmail(EmailMessage message) {
        if (!enabled || !isAvailable()) {
            return false;
        }

        try {
            Email from = new Email(message.getFrom(), message.getFromName());
            Email to = new Email(message.getTo());
            Content content = new Content("text/html", message.getHtmlContent());
            
            Mail mail = new Mail(from, message.getSubject(), to, content);
            
            if (message.getTextContent() != null) {
                mail.addContent(new Content("text/plain", message.getTextContent()));
            }

            SendGrid sg = new SendGrid(apiKey);
            Request request = new Request();
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sg.api(request);
            
            if (response.getStatusCode() >= 200 && response.getStatusCode() < 300) {
                logger.info("Email sent successfully via SendGrid to: {}", message.getTo());
                return true;
            } else {
                logger.error("SendGrid API error: {} - {}", response.getStatusCode(), response.getBody());
                return false;
            }
            
        } catch (Exception e) {
            logger.error("Error sending email via SendGrid: ", e);
            return false;
        }
    }

    @Override
    public EmailProvider getProvider() {
        return new EmailProvider("SENDGRID", "SendGrid", priority);
    }

    @Override
    public boolean isAvailable() {
        return enabled && apiKey != null && !apiKey.isEmpty() && 
               !hasReachedDailyLimit() && !hasReachedHourlyLimit();
    }

    @Override
    public int getPriority() {
        return priority;
    }

    @Override
    public boolean hasReachedDailyLimit() {
        // TODO: Implementar verificación de límite diario
        return false;
    }

    @Override
    public boolean hasReachedHourlyLimit() {
        // TODO: Implementar verificación de límite horario
        return false;
    }
}