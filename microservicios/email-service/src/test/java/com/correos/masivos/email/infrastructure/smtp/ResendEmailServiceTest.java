package com.correos.masivos.email.infrastructure.smtp;

import com.correos.masivos.email.domain.model.EmailMessage;
import com.correos.masivos.email.domain.service.EmailProviderService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class ResendEmailServiceTest {

    private ResendEmailService resendService;

    @BeforeEach
    void setUp() {
        resendService = new ResendEmailService();
        ReflectionTestUtils.setField(resendService, "apiKey", "re_f7a5U7q4_6TKbWbZRJiXJmW36JjHTBXkC");
        ReflectionTestUtils.setField(resendService, "enabled", true);
    }

    @Test
    void testProviderConfiguration() {
        assertEquals("Resend SMTP", resendService.getProvider().getDisplayName());
        assertEquals("RESEND", resendService.getProvider().getName());
        assertEquals(2, resendService.getPriority());
    }

    @Test
    void testEmailMessage() {
        EmailMessage message = new EmailMessage();
        message.setTo("julio.home96@gmail.com");
        message.setFrom("onboarding@resend.dev");
        message.setSubject("Test");
        message.setHtmlContent("<h1>Test HTML</h1>");
        message.setTextContent("Test Text");
        
        System.out.println("=== EMAIL MESSAGE ===");
        System.out.println("To: " + message.getTo());
        System.out.println("From: " + message.getFrom());
        System.out.println("Subject: " + message.getSubject());
        System.out.println("HTML: " + message.getHtmlContent());
        System.out.println("Text: " + message.getTextContent());
        System.out.println("====================");
        
        assertEquals("julio.home96@gmail.com", message.getTo());
        assertEquals("onboarding@resend.dev", message.getFrom());
        assertEquals("Test", message.getSubject());
    }

    @Test
    void testIsAvailable() {
        assertTrue(resendService.isAvailable());
    }

    @Test
    void testSendEmail() {
        EmailMessage message = new EmailMessage();
        message.setTo("julio.home96@gmail.com");
        message.setFrom("onboarding@resend.dev");
        message.setSubject("Test Send");
        message.setHtmlContent("<h1>Test Send</h1>");
        message.setTextContent("Test Send");
        
        System.out.println("=== TESTING SEND EMAIL ===");
        System.out.println("Message: " + message.getTo() + " - " + message.getSubject());
        
        boolean result = resendService.sendEmail(message);
        
        System.out.println("Send result: " + result);
        System.out.println("External ID: " + message.getExternalId());
        System.out.println("=========================");
        
       
    }
}