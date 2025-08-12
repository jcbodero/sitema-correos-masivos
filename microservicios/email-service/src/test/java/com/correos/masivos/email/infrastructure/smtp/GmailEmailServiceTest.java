package com.correos.masivos.email.infrastructure.smtp;

import com.correos.masivos.email.domain.model.EmailMessage;
import com.correos.masivos.email.domain.service.EmailProviderService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestPropertySource(properties = {
    "GMAIL_ENABLED=true",
    "GMAIL_USERNAME=julio.home96@gmail.com", 
    "GMAIL_PASSWORD=uapcqtxtkkrknfcx"
})
class GmailEmailServiceTest {

    private EmailProviderService gmailService;

    @BeforeEach
    void setUp() {
        gmailService = new GenericSmtpEmailService(
            "GMAIL", "Gmail SMTP", 3,
            "smtp.gmail.com", 587, "julio.home96@gmail.com", "uapcqtxtkkrknfcx",
            true, true, true, null
        );
    }

    @Test
    void testGmailServiceConfiguration() {
        assertNotNull(gmailService);
        assertEquals("Gmail SMTP", gmailService.getProvider().getDisplayName());
        assertEquals(3, gmailService.getPriority());
        assertTrue(gmailService.isAvailable());
    }

    @Test
    void testSendEmailWithGmail() {
        EmailMessage message = new EmailMessage();
        message.setTo("j.boderoc@gmail.com");
        message.setFrom("test@gmail.com");
        message.setFromName("Test Gmail Sender");
        message.setSubject("Gmail Test Email");
        message.setHtmlContent("<h1>Gmail Test</h1><p>Testing Gmail SMTP</p>");
        message.setTextContent("Gmail Test - Testing Gmail SMTP");

        // This will fail with test credentials but validates the configuration
        boolean result = gmailService.sendEmail(message);
        
        // With test credentials, expect failure but no exceptions
        assertTrue(result);
        assertNotNull(message.getTo());
        assertEquals("j.boderoc@gmail.com", message.getTo());
    }

    @Test
    void testGmailProviderPriority() {
        assertEquals(3, gmailService.getPriority());
        assertEquals("GMAIL", gmailService.getProvider().getName());
    }

    @Test
    void testGmailRateLimits() {
        assertFalse(gmailService.hasReachedDailyLimit());
        assertFalse(gmailService.hasReachedHourlyLimit());
    }

    @Test
    void testGmailSmtpConfiguration() {
        // Verify Gmail SMTP settings
        assertEquals("Gmail SMTP", gmailService.getProvider().getDisplayName());
        assertTrue(gmailService.isAvailable());
        
        // Gmail should be priority 3 (after SendGrid and Resend)
        assertEquals(3, gmailService.getPriority());
    }
}