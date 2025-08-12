package com.correos.masivos.email;

import com.correos.masivos.email.api.EmailController;
import com.correos.masivos.email.api.dto.SendEmailRequest;
import com.correos.masivos.email.api.dto.BulkEmailRequest;
import com.correos.masivos.email.domain.service.EmailService;
import com.correos.masivos.email.infrastructure.repository.EmailLogRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(EmailController.class)
class EmailServiceTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private EmailService emailService;

    @MockBean
    private EmailLogRepository emailLogRepository;

    @Test
    void healthCheck_ShouldReturnOK() throws Exception {
        mockMvc.perform(get("/emails/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.service").value("email-service"))
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.port").value("8084"));
    }

    @Test
    void sendEmail_WithValidData_ShouldReturnSuccess() throws Exception {
        SendEmailRequest request = new SendEmailRequest();
        request.setTo("test@example.com");
        request.setSubject("Test Subject");
        request.setHtmlContent("<h1>Test Content</h1>");
        request.setTextContent("Test Content");

        mockMvc.perform(post("/emails/send")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    void sendEmail_WithInvalidEmail_ShouldReturnBadRequest() throws Exception {
        SendEmailRequest request = new SendEmailRequest();
        request.setTo("invalid-email");
        request.setSubject("Test Subject");
        request.setHtmlContent("<h1>Test Content</h1>");

        mockMvc.perform(post("/emails/send")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void sendBulkEmails_WithValidData_ShouldReturnSuccess() throws Exception {
        BulkEmailRequest request = new BulkEmailRequest();
        request.setSubject("Bulk Test Subject");
        request.setHtmlContent("<h1>Bulk Test Content</h1>");
        request.setTextContent("Bulk Test Content");
        
        BulkEmailRequest.EmailRecipient recipient1 = new BulkEmailRequest.EmailRecipient();
        recipient1.setEmail("test1@example.com");
        recipient1.setRecipientId(1L);
        
        BulkEmailRequest.EmailRecipient recipient2 = new BulkEmailRequest.EmailRecipient();
        recipient2.setEmail("test2@example.com");
        recipient2.setRecipientId(2L);
        
        request.setRecipients(Arrays.asList(recipient1, recipient2));

        mockMvc.perform(post("/emails/send/bulk")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalEmails").value(2));
    }

    @Test
    void getEmailStats_ShouldReturnStats() throws Exception {
        mockMvc.perform(get("/emails/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalEmails").exists())
                .andExpect(jsonPath("$.sentEmails").exists())
                .andExpect(jsonPath("$.deliveredEmails").exists());
    }

    @Test
    void getEmailStats_WithCampaignId_ShouldReturnCampaignStats() throws Exception {
        mockMvc.perform(get("/emails/stats")
                .param("campaignId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalEmails").exists());
    }

    @Test
    void retryFailedEmails_WithValidCampaignId_ShouldReturnOK() throws Exception {
        mockMvc.perform(post("/emails/campaigns/1/retry"))
                .andExpect(status().isOk());
    }

    @Test
    void handleDeliveryWebhook_WithValidPayload_ShouldReturnOK() throws Exception {
        Map<String, Object> payload = new HashMap<>();
        payload.put("externalId", "test-external-id");
        payload.put("event", "delivered");

        mockMvc.perform(post("/emails/webhooks/delivery")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk());
    }

    @Test
    void getRealtimeStats_ShouldReturnRealtimeData() throws Exception {
        mockMvc.perform(get("/emails/stats/realtime"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.timestamp").exists())
                .andExpect(jsonPath("$.type").value("realtime"));
    }

    @Test
    void getEmailHistory_ShouldReturnHistory() throws Exception {
        mockMvc.perform(get("/emails/history")
                .param("page", "0")
                .param("size", "20"))
                .andExpect(status().isOk());
    }
}