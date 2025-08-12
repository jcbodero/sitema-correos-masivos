package com.correos.masivos.email.infrastructure.smtp;

import com.correos.masivos.email.domain.model.EmailMessage;
import com.correos.masivos.email.domain.model.EmailProvider;
import com.correos.masivos.email.domain.service.EmailProviderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;

import javax.mail.internet.MimeMessage;
import java.util.Properties;

@Service
@ConditionalOnProperty(name = "email.use-legacy-providers", havingValue = "true")
public class MailHogEmailService implements EmailProviderService {
    
    private static final Logger logger = LoggerFactory.getLogger(MailHogEmailService.class);
    
    private final String host = "localhost";
    private final int port = 1025;
    
    @Value("${email.mailhog.enabled:true}")
    private boolean enabled;
    
    private final int priority = 5;

    @Override
    public boolean sendEmail(EmailMessage message) {
        if (!enabled || !isAvailable()) {
            return false;
        }

        try {
            JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
            mailSender.setHost(host);
            mailSender.setPort(port);
            
            Properties props = mailSender.getJavaMailProperties();
            props.put("mail.transport.protocol", "smtp");
            props.put("mail.smtp.auth", "false");
            props.put("mail.smtp.starttls.enable", "false");

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(message.getFrom(), message.getFromName());
            helper.setTo(message.getTo());
            helper.setSubject(message.getSubject());
            
            // Manejar contenido de texto y HTML
            String textContent = message.getTextContent();
            String htmlContent = message.getHtmlContent();
            
            if (htmlContent != null && textContent != null) {
                helper.setText(textContent, htmlContent);
            } else if (htmlContent != null) {
                helper.setText("", htmlContent);
            } else if (textContent != null) {
                helper.setText(textContent);
            } else {
                helper.setText("");
            }

            mailSender.send(mimeMessage);
            logger.info("Email sent successfully via MailHog to: {}", message.getTo());
            return true;
            
        } catch (Exception e) {
            logger.error("Error sending email via MailHog: ", e);
            return false;
        }
    }

    @Override
    public EmailProvider getProvider() {
        return new EmailProvider("MAILHOG", "MailHog", priority);
    }

    @Override
    public boolean isAvailable() {
        return enabled && !hasReachedDailyLimit() && !hasReachedHourlyLimit();
    }

    @Override
    public int getPriority() {
        return priority;
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