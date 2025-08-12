package com.correos.masivos.email.infrastructure.smtp;

import com.correos.masivos.email.domain.model.EmailMessage;
import com.correos.masivos.email.domain.model.EmailProvider;
import com.correos.masivos.email.domain.service.EmailProviderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;

import javax.mail.internet.MimeMessage;
import java.util.Properties;
import java.util.UUID;

public class GenericSmtpEmailService implements EmailProviderService {

    private static final Logger logger = LoggerFactory.getLogger(GenericSmtpEmailService.class);
    
    private final String host;
    private final int port;
    private final String username;
    private final String password;
    private final boolean enabled;
    private final EmailProvider provider;
    private final boolean useAuth;
    private final boolean useStartTls;
    private final String trustHost;
    private final String overrideRecipient;

    public GenericSmtpEmailService(String providerName, String displayName, int priority,
                                 String host, int port, String username, String password, 
                                 boolean enabled, boolean useAuth, boolean useStartTls, String overrideRecipient) {
        this(providerName, displayName, priority, host, port, username, password, enabled, useAuth, useStartTls, overrideRecipient, null);
    }

    public GenericSmtpEmailService(String providerName, String displayName, int priority,
                                 String host, int port, String username, String password, 
                                 boolean enabled, boolean useAuth, boolean useStartTls, String overrideRecipient, String trustHost) {
        this.host = host;
        this.port = port;
        this.username = username;
        this.password = password;
        this.enabled = enabled;
        this.useAuth = useAuth;
        this.useStartTls = useStartTls;
        this.overrideRecipient = overrideRecipient;
        this.trustHost = trustHost;
        this.provider = new EmailProvider(providerName, displayName, priority);
    }

    @Override
    public boolean sendEmail(EmailMessage message) {
        if (!isAvailable()) {
            logger.warn("Provider {} not available", provider.getDisplayName());
            return false;
        }

        logger.info("Attempting to send email via {} to {}", provider.getDisplayName(), message.getTo());
        logger.debug("SMTP Config - Host: {}, Port: {}, Auth: {}, StartTLS: {}", host, port, useAuth, useStartTls);
        
        try {
            JavaMailSender mailSender = createMailSender();
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom(message.getFrom(), message.getFromName());
            String recipient = (overrideRecipient != null && !overrideRecipient.isEmpty()) ? overrideRecipient : message.getTo();
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

            logger.debug("Sending message: From={}, To={}, Subject={}", message.getFrom(), message.getTo(), message.getSubject());
            mailSender.send(mimeMessage);
            
            String externalId = UUID.randomUUID().toString();
            message.setExternalId(externalId);
            logger.info("Email enviado via {}: {}", provider.getDisplayName(), externalId);
            return true;
            
        } catch (Exception e) {
            logger.error("Error enviando email via {}: {}", provider.getDisplayName(), e.getMessage(), e);
            return false;
        }
    }

    private JavaMailSender createMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(host);
        mailSender.setPort(port);
        
        logger.debug("Creating mail sender - Host: {}, Port: {}", host, port);
        
        if (useAuth && username != null && password != null) {
            mailSender.setUsername(username);
            mailSender.setPassword(password);
            logger.debug("Auth enabled - Username: {}, Password length: {}", username, password.length());
        } else {
            logger.debug("Auth disabled or credentials missing");
        }

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", useAuth);
        
        // Configure SSL/TLS based on port
        if (port == 465) {
            props.put("mail.smtp.ssl.enable", "true");
            props.put("mail.smtp.starttls.enable", "false");
        } else {
            props.put("mail.smtp.starttls.enable", useStartTls);
            props.put("mail.smtp.ssl.enable", "false");
        }
        
        props.put("mail.debug", "false");
        
        // Timeout configuration
        props.put("mail.smtp.connectiontimeout", "5000"); // 5 seconds
        props.put("mail.smtp.timeout", "10000"); // 10 seconds
        props.put("mail.smtp.writetimeout", "10000"); // 10 seconds
        
        if (trustHost != null) {
            props.put("mail.smtp.ssl.trust", trustHost);
        }

        return mailSender;
    }

    @Override
    public boolean isAvailable() {
        logger.debug("Checking availability for {}: enabled={}, useAuth={}, username={}, password={}", 
                    provider.getDisplayName(), enabled, useAuth, username, password != null ? "***" : "null");
        
        if (!enabled) {
            logger.debug("Provider {} is disabled", provider.getDisplayName());
            return false;
        }
        
        if (useAuth) {
            boolean hasCredentials = username != null && !username.isEmpty() && password != null && !password.isEmpty();
            logger.debug("Provider {} requires auth: hasCredentials={}", provider.getDisplayName(), hasCredentials);
            return hasCredentials;
        }
        
        logger.debug("Provider {} is available (no auth required)", provider.getDisplayName());
        return true;
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
        // TODO: Implement rate limiting logic
        return false;
    }

    @Override
    public boolean hasReachedHourlyLimit() {
        // TODO: Implement rate limiting logic
        return false;
    }
}