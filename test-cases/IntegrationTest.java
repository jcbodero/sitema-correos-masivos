package com.correos.masivos.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.test.context.TestPropertySource;

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb",
    "spring.jpa.hibernate.ddl-auto=create-drop"
})
class IntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void completeEmailWorkflow_ShouldWork() throws Exception {
        // 1. Crear contacto
        Map<String, Object> contact = new HashMap<>();
        contact.put("email", "integration@test.com");
        contact.put("firstName", "Integration");
        contact.put("lastName", "Test");
        contact.put("userId", 1L);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> contactRequest = new HttpEntity<>(contact, headers);

        ResponseEntity<String> contactResponse = restTemplate.postForEntity(
            "http://localhost:" + port + "/api/contacts", 
            contactRequest, 
            String.class
        );
        assertThat(contactResponse.getStatusCode()).isEqualTo(HttpStatus.OK);

        // 2. Crear plantilla
        Map<String, Object> template = new HashMap<>();
        template.put("name", "Integration Template");
        template.put("subject", "Welcome {{firstName}}!");
        template.put("htmlContent", "<h1>Welcome {{firstName}} {{lastName}}!</h1>");
        template.put("textContent", "Welcome {{firstName}} {{lastName}}!");
        template.put("userId", 1L);

        HttpEntity<Map<String, Object>> templateRequest = new HttpEntity<>(template, headers);
        ResponseEntity<String> templateResponse = restTemplate.postForEntity(
            "http://localhost:" + port + "/api/templates", 
            templateRequest, 
            String.class
        );
        assertThat(templateResponse.getStatusCode()).isEqualTo(HttpStatus.OK);

        // 3. Crear campaña
        Map<String, Object> campaign = new HashMap<>();
        campaign.put("name", "Integration Campaign");
        campaign.put("subject", "Integration Test Campaign");
        campaign.put("description", "Test campaign for integration");
        campaign.put("templateId", 1L);
        campaign.put("userId", 1L);

        HttpEntity<Map<String, Object>> campaignRequest = new HttpEntity<>(campaign, headers);
        ResponseEntity<String> campaignResponse = restTemplate.postForEntity(
            "http://localhost:" + port + "/api/campaigns", 
            campaignRequest, 
            String.class
        );
        assertThat(campaignResponse.getStatusCode()).isEqualTo(HttpStatus.OK);

        // 4. Enviar email
        Map<String, Object> email = new HashMap<>();
        email.put("to", "integration@test.com");
        email.put("subject", "Integration Test Email");
        email.put("htmlContent", "<h1>Integration Test</h1>");
        email.put("textContent", "Integration Test");
        email.put("campaignId", 1L);

        HttpEntity<Map<String, Object>> emailRequest = new HttpEntity<>(email, headers);
        ResponseEntity<String> emailResponse = restTemplate.postForEntity(
            "http://localhost:" + port + "/api/emails/send", 
            emailRequest, 
            String.class
        );
        assertThat(emailResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void apiGateway_HealthChecks_ShouldWork() {
        // Verificar que todos los servicios estén disponibles a través del API Gateway
        String[] services = {"users", "contacts", "campaigns", "emails", "templates"};
        
        for (String service : services) {
            ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/api/" + service + "/health", 
                String.class
            );
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).contains("\"status\":\"UP\"");
        }
    }

    @Test
    void bulkEmailWorkflow_ShouldWork() throws Exception {
        // Crear múltiples contactos y enviar email masivo
        for (int i = 1; i <= 3; i++) {
            Map<String, Object> contact = new HashMap<>();
            contact.put("email", "bulk" + i + "@test.com");
            contact.put("firstName", "Bulk" + i);
            contact.put("lastName", "Test");
            contact.put("userId", 1L);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> contactRequest = new HttpEntity<>(contact, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                "http://localhost:" + port + "/api/contacts", 
                contactRequest, 
                String.class
            );
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        }

        // Enviar email masivo
        Map<String, Object> bulkEmail = new HashMap<>();
        bulkEmail.put("subject", "Bulk Test Email");
        bulkEmail.put("htmlContent", "<h1>Bulk Test</h1>");
        bulkEmail.put("textContent", "Bulk Test");
        
        // Simular recipients
        Map<String, Object>[] recipients = new Map[3];
        for (int i = 0; i < 3; i++) {
            recipients[i] = new HashMap<>();
            recipients[i].put("email", "bulk" + (i+1) + "@test.com");
            recipients[i].put("recipientId", (long)(i+1));
        }
        bulkEmail.put("recipients", recipients);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> bulkRequest = new HttpEntity<>(bulkEmail, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(
            "http://localhost:" + port + "/api/emails/send/bulk", 
            bulkRequest, 
            String.class
        );
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void errorHandling_ShouldReturnProperErrors() {
        // Test invalid email creation
        Map<String, Object> invalidContact = new HashMap<>();
        invalidContact.put("email", "invalid-email");
        invalidContact.put("userId", 1L);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(invalidContact, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(
            "http://localhost:" + port + "/api/contacts", 
            request, 
            String.class
        );
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }
}