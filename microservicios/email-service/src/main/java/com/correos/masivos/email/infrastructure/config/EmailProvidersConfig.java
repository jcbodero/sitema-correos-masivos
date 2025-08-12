package com.correos.masivos.email.infrastructure.config;

import com.correos.masivos.email.domain.service.EmailProviderService;
import com.correos.masivos.email.infrastructure.smtp.GenericSmtpEmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import java.util.Arrays;
import java.util.List;

@Configuration
public class EmailProvidersConfig {

    @Autowired
    private Environment env;

    @Bean("emailProviders")
    public List<EmailProviderService> emailProviders() {
        
        // Read configuration from environment - try both env vars and properties
        boolean sendgridEnabled = Boolean.parseBoolean(env.getProperty("email.sendgrid.enabled", env.getProperty("SENDGRID_ENABLED", "false")));
        String sendgridUsername = env.getProperty("email.sendgrid.username", env.getProperty("SENDGRID_USERNAME", "apikey"));
        String sendgridPassword = env.getProperty("email.sendgrid.password", env.getProperty("SENDGRID_API_KEY", ""));
        
        boolean resendEnabled = Boolean.parseBoolean(env.getProperty("email.resend.enabled", env.getProperty("RESEND_ENABLED", "false")));
        String resendUsername = env.getProperty("email.resend.username", env.getProperty("RESEND_USERNAME", "resend"));
        String resendPassword = env.getProperty("email.resend.password", env.getProperty("RESEND_API_KEY", ""));
        String resendTo = env.getProperty("RESEND_TO", "");
        
        boolean gmailEnabled = Boolean.parseBoolean(env.getProperty("email.gmail.enabled", env.getProperty("GMAIL_ENABLED", "false")));
        String gmailUsername = env.getProperty("email.gmail.username", env.getProperty("GMAIL_USERNAME", ""));
        String gmailPassword = env.getProperty("email.gmail.password", env.getProperty("GMAIL_PASSWORD", ""));
        
        boolean microsoftEnabled = Boolean.parseBoolean(env.getProperty("email.microsoft.enabled", env.getProperty("MICROSOFT_ENABLED", "false")));
        String microsoftUsername = env.getProperty("email.microsoft.username", env.getProperty("MICROSOFT_USERNAME", ""));
        String microsoftPassword = env.getProperty("email.microsoft.password", env.getProperty("MICROSOFT_PASSWORD", ""));
        
        boolean mailhogEnabled = Boolean.parseBoolean(env.getProperty("email.mailhog.enabled", env.getProperty("MAILHOG_ENABLED", "true")));

        System.out.println("\n=== EMAIL PROVIDERS CONFIGURATION ===");
        System.out.println("Environment variables check:");
        System.out.println("  GMAIL_ENABLED=" + env.getProperty("GMAIL_ENABLED"));
        System.out.println("  GMAIL_USERNAME=" + env.getProperty("GMAIL_USERNAME"));
        System.out.println("  GMAIL_PASSWORD=" + (env.getProperty("GMAIL_PASSWORD") != null ? "***" : "null"));
        System.out.println("  MAILHOG_ENABLED=" + env.getProperty("MAILHOG_ENABLED"));
        System.out.println();
        System.out.println("SendGrid: enabled=" + sendgridEnabled + ", username=" + sendgridUsername + ", password=" + (sendgridPassword.isEmpty() ? "empty" : "***"));
        System.out.println("Gmail: enabled=" + gmailEnabled + ", username=" + gmailUsername + ", password=" + (gmailPassword.isEmpty() ? "empty" : "***"));
        System.out.println("Microsoft: enabled=" + microsoftEnabled + ", username=" + microsoftUsername + ", password=" + (microsoftPassword.isEmpty() ? "empty" : "***"));
        System.out.println("Resend: enabled=" + resendEnabled + ", username=" + resendUsername + ", password=" + (resendPassword.isEmpty() ? "empty" : "***"));
        System.out.println("MailHog: enabled=" + mailhogEnabled + " aun no carga");
        System.out.println("======================================\n");
        
        List<EmailProviderService> providers = Arrays.asList(
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
        
        // Log each provider's availability
        System.out.println("\n=== PROVIDER AVAILABILITY CHECK ===");
        for (EmailProviderService provider : providers) {
            System.out.println(provider.getProvider().getDisplayName() + ": available=" + provider.isAvailable());
        }
        System.out.println("=====================================\n");
        
        return providers;
    }
}