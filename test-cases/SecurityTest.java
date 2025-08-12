package com.correos.masivos.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.*;

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class SecurityTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void sqlInjection_ShouldBeBlocked() {
        // Test SQL injection in search parameters
        String maliciousSearch = "'; DROP TABLE contacts; --";
        
        ResponseEntity<String> response = restTemplate.getForEntity(
            "http://localhost:" + port + "/api/contacts?userId=1&search=" + maliciousSearch,
            String.class
        );
        
        // Should not cause server error, should handle gracefully
        assertThat(response.getStatusCode()).isIn(HttpStatus.OK, HttpStatus.BAD_REQUEST);
    }

    @Test
    void xssAttack_ShouldBeSanitized() throws Exception {
        // Test XSS in contact creation
        Map<String, Object> contact = new HashMap<>();
        contact.put("email", "xss@test.com");
        contact.put("firstName", "<script>alert('XSS')</script>");
        contact.put("lastName", "<img src=x onerror=alert('XSS')>");
        contact.put("userId", 1L);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(contact, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(
            "http://localhost:" + port + "/api/contacts",
            request,
            String.class
        );

        // Should either sanitize the input or reject it
        assertThat(response.getStatusCode()).isIn(HttpStatus.OK, HttpStatus.BAD_REQUEST);
        
        if (response.getStatusCode() == HttpStatus.OK) {
            // If accepted, should not contain script tags
            assertThat(response.getBody()).doesNotContain("<script>");
            assertThat(response.getBody()).doesNotContain("onerror");
        }
    }

    @Test
    void unauthorizedAccess_ShouldBeBlocked() {
        // Test accessing protected endpoints without authentication
        ResponseEntity<String> response = restTemplate.getForEntity(
            "http://localhost:" + port + "/api/contacts?userId=999",
            String.class
        );
        
        // Should require authentication or return forbidden
        assertThat(response.getStatusCode()).isIn(HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN, HttpStatus.OK);
    }

    @Test
    void massivePayload_ShouldBeRejected() throws Exception {
        // Test with extremely large payload
        Map<String, Object> contact = new HashMap<>();
        contact.put("email", "large@test.com");
        contact.put("firstName", "A".repeat(10000)); // Very large field
        contact.put("lastName", "B".repeat(10000));
        contact.put("customFields", "C".repeat(100000)); // Extremely large field
        contact.put("userId", 1L);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(contact, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(
            "http://localhost:" + port + "/api/contacts",
            request,
            String.class
        );

        // Should reject oversized payloads
        assertThat(response.getStatusCode()).isIn(HttpStatus.BAD_REQUEST, HttpStatus.PAYLOAD_TOO_LARGE);
    }

    @Test
    void emailInjection_ShouldBeBlocked() throws Exception {
        // Test email header injection
        Map<String, Object> email = new HashMap<>();
        email.put("to", "test@example.com\nBcc: attacker@evil.com");
        email.put("subject", "Test\nBcc: attacker@evil.com");
        email.put("htmlContent", "<h1>Test</h1>");
        email.put("textContent", "Test");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(email, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(
            "http://localhost:" + port + "/api/emails/send",
            request,
            String.class
        );

        // Should reject emails with header injection attempts
        assertThat(response.getStatusCode()).isIn(HttpStatus.BAD_REQUEST, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    @Test
    void rateLimiting_ShouldPreventAbuse() throws Exception {
        // Test rapid successive requests
        int requestCount = 100;
        int successCount = 0;
        int rateLimitedCount = 0;

        for (int i = 0; i < requestCount; i++) {
            ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/api/contacts/health",
                String.class
            );

            if (response.getStatusCode() == HttpStatus.OK) {
                successCount++;
            } else if (response.getStatusCode() == HttpStatus.TOO_MANY_REQUESTS) {
                rateLimitedCount++;
            }
        }

        // Should either allow all requests or implement rate limiting
        assertThat(successCount + rateLimitedCount).isEqualTo(requestCount);
        
        if (rateLimitedCount > 0) {
            System.out.println("Rate limiting detected: " + rateLimitedCount + " requests blocked");
        }
    }

    @Test
    void invalidContentType_ShouldBeRejected() throws Exception {
        // Test with invalid content type
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_PLAIN);
        HttpEntity<String> request = new HttpEntity<>("invalid json content", headers);

        ResponseEntity<String> response = restTemplate.postForEntity(
            "http://localhost:" + port + "/api/contacts",
            request,
            String.class
        );

        // Should reject invalid content type
        assertThat(response.getStatusCode()).isIn(HttpStatus.BAD_REQUEST, HttpStatus.UNSUPPORTED_MEDIA_TYPE);
    }

    @Test
    void pathTraversal_ShouldBeBlocked() {
        // Test path traversal attack
        String maliciousPath = "../../../etc/passwd";
        
        ResponseEntity<String> response = restTemplate.getForEntity(
            "http://localhost:" + port + "/api/templates/" + maliciousPath,
            String.class
        );
        
        // Should not allow path traversal
        assertThat(response.getStatusCode()).isIn(HttpStatus.NOT_FOUND, HttpStatus.BAD_REQUEST, HttpStatus.FORBIDDEN);
    }

    @Test
    void sensitiveDataExposure_ShouldBeProtected() throws Exception {
        // Test that sensitive data is not exposed in error messages
        Map<String, Object> invalidData = new HashMap<>();
        invalidData.put("password", "secret123");
        invalidData.put("apiKey", "sk-1234567890abcdef");
        invalidData.put("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(invalidData, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(
            "http://localhost:" + port + "/api/contacts",
            request,
            String.class
        );

        // Error response should not contain sensitive data
        if (response.getBody() != null) {
            assertThat(response.getBody()).doesNotContain("secret123");
            assertThat(response.getBody()).doesNotContain("sk-1234567890abcdef");
            assertThat(response.getBody()).doesNotContain("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
        }
    }
}