package com.correos.masivos.email.infrastructure.config;

import com.correos.masivos.email.domain.service.EmailProviderService;
import com.correos.masivos.email.infrastructure.smtp.GenericSmtpEmailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;

@Configuration
public class EmailProvidersConfig {

    @Bean("emailProviders")
    public List<EmailProviderService> emailProviders(
            @Value("${SENDGRID_ENABLED:false}") boolean sendgridEnabled,
            @Value("${SENDGRID_USERNAME:apikey}") String sendgridUsername,
            @Value("${SENDGRID_API_KEY:}") String sendgridPassword,
            
            @Value("${RESEND_ENABLED:false}") boolean resendEnabled,
            @Value("${RESEND_USERNAME:resend}") String resendUsername,
            @Value("${RESEND_API_KEY:}") String resendPassword,
            @Value("${RESEND_TO:}") String resendTo,
            
            @Value("${GMAIL_ENABLED:false}") boolean gmailEnabled,
            @Value("${GMAIL_USERNAME:}") String gmailUsername,
            @Value("${GMAIL_PASSWORD:}") String gmailPassword,
            
            @Value("${MICROSOFT_ENABLED:false}") boolean microsoftEnabled,
            @Value("${MICROSOFT_USERNAME:}") String microsoftUsername,
            @Value("${MICROSOFT_PASSWORD:}") String microsoftPassword,
            
            @Value("${MAILHOG_ENABLED:true}") boolean mailhogEnabled) {

        return Arrays.asList(
            // SendGrid SMTP
            new GenericSmtpEmailService("SENDGRID", "SendGrid SMTP", 1,
                "smtp.sendgrid.net", 587, sendgridUsername, sendgridPassword,
                sendgridEnabled, true, true, null, null),
            
            // Gmail SMTP
            new GenericSmtpEmailService("GMAIL", "Gmail SMTP", 2,
                "smtp.gmail.com", 587, gmailUsername, gmailPassword,
                gmailEnabled, true, true, null, null),
            
            // Microsoft 365 SMTP
            new GenericSmtpEmailService("MICROSOFT", "Microsoft 365", 3,
                "smtp.office365.com", 587, microsoftUsername, microsoftPassword,
                microsoftEnabled, true, true, null, "smtp.office365.com"),

            // Resend SMTP
            new GenericSmtpEmailService("RESEND", "Resend SMTP", 4,
                "smtp.resend.com", 587, resendUsername, resendPassword,
                resendEnabled, true, true, resendTo, null),
            
            // MailHog (Development)
            new GenericSmtpEmailService("MAILHOG", "MailHog", 5,
                "correos-mailhog", 1025, null, null,
                mailhogEnabled, false, false, null, null)
        );
    }
}