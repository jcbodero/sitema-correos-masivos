package com.correos.masivos.email.infrastructure.smtp;

import com.correos.masivos.email.domain.model.EmailMessage;
import com.correos.masivos.email.domain.model.EmailProvider;
import com.correos.masivos.email.domain.service.EmailProviderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.internet.MimeMessage;
import java.util.Properties;
import java.util.UUID;

// @Service - Disabled to use generic configuration
public class ResendEmailService implements EmailProviderService {

    private static final Logger logger = LoggerFactory.getLogger(ResendEmailService.class);
    
    @Value("${RESEND_API_KEY:}")
    private String apiKey;
    
    @Value("${RESEND_ENABLED:false}")
    private boolean enabled;
    
    @Value("${RESEND_TO:}")
    private String resendTo;
    
    private final EmailProvider provider = new EmailProvider("RESEND", "Resend SMTP", 2);

    @Override
    public boolean sendEmail(EmailMessage message) {
        if (!isAvailable()) {
            return false;
        }

        try {
            JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
            mailSender.setHost("smtp.resend.com");
            mailSender.setPort(587);
            mailSender.setUsername("resend");
            mailSender.setPassword(apiKey);

            Properties props = mailSender.getJavaMailProperties();
            props.put("mail.transport.protocol", "smtp");
            props.put("mail.smtp.auth", "true");
            props.put("mail.smtp.starttls.enable", "true");

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom("onboarding@resend.dev");
            
            // Use RESEND_TO if configured, otherwise use original recipient
            String recipient = (resendTo != null && !resendTo.isEmpty()) ? resendTo : message.getTo();
            helper.setTo(recipient);
            
            helper.setSubject(message.getSubject());
            String textContent = message.getTextContent();
            String htmlContent = message.getHtmlContent();
            
            if (textContent != null && htmlContent != null) {
                helper.setText(textContent, htmlContent);
            } else if (htmlContent != null) {
                helper.setText(htmlContent, true);
            } else if (textContent != null) {
                helper.setText(textContent, false);
            } else {
                helper.setText("Contenido del email", false);
            }

            mailSender.send(mimeMessage);
            
            String externalId = UUID.randomUUID().toString();
            message.setExternalId(externalId);
            logger.info("Email enviado via Resend SMTP: {}", externalId);
            return true;
            
        } catch (Exception e) {
            logger.error("Error enviando email via Resend SMTP: {}", e.getMessage());
            return false;
        }
    }

    @Override
    public boolean isAvailable() {
        return enabled && apiKey != null && !apiKey.isEmpty();
    }

    @Override
    public EmailProvider getProvider() {
        return provider;
    }

    @Override
    public int getPriority() {
        return provider.getPriority();
    }

    @Override
    public boolean hasReachedDailyLimit() {
        return false;
    }

    @Override
    public boolean hasReachedHourlyLimit() {
        return false;
    }
}