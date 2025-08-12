package com.correos.masivos.performance;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.test.context.TestPropertySource;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:perfdb",
    "spring.jpa.hibernate.ddl-auto=create-drop"
})
class PerformanceTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void bulkContactCreation_ShouldHandleLoad() throws Exception {
        int numberOfContacts = 100;
        ExecutorService executor = Executors.newFixedThreadPool(10);
        List<CompletableFuture<ResponseEntity<String>>> futures = new ArrayList<>();

        long startTime = System.currentTimeMillis();

        for (int i = 0; i < numberOfContacts; i++) {
            final int index = i;
            CompletableFuture<ResponseEntity<String>> future = CompletableFuture.supplyAsync(() -> {
                Map<String, Object> contact = new HashMap<>();
                contact.put("email", "perf" + index + "@test.com");
                contact.put("firstName", "Perf" + index);
                contact.put("lastName", "Test");
                contact.put("userId", 1L);

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                HttpEntity<Map<String, Object>> request = new HttpEntity<>(contact, headers);

                return restTemplate.postForEntity(
                    "http://localhost:" + port + "/api/contacts", 
                    request, 
                    String.class
                );
            }, executor);
            
            futures.add(future);
        }

        // Wait for all requests to complete
        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).get();
        
        long endTime = System.currentTimeMillis();
        long duration = endTime - startTime;

        // Verify all requests succeeded
        int successCount = 0;
        for (CompletableFuture<ResponseEntity<String>> future : futures) {
            ResponseEntity<String> response = future.get();
            if (response.getStatusCode() == HttpStatus.OK) {
                successCount++;
            }
        }

        assertThat(successCount).isEqualTo(numberOfContacts);
        assertThat(duration).isLessThan(30000); // Should complete within 30 seconds
        
        System.out.println("Created " + numberOfContacts + " contacts in " + duration + "ms");
        System.out.println("Average: " + (duration / numberOfContacts) + "ms per contact");

        executor.shutdown();
    }

    @Test
    void bulkEmailSending_ShouldHandleLoad() throws Exception {
        // First create some contacts
        int numberOfRecipients = 50;
        for (int i = 0; i < numberOfRecipients; i++) {
            Map<String, Object> contact = new HashMap<>();
            contact.put("email", "bulk" + i + "@test.com");
            contact.put("firstName", "Bulk" + i);
            contact.put("lastName", "Test");
            contact.put("userId", 1L);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(contact, headers);

            restTemplate.postForEntity(
                "http://localhost:" + port + "/api/contacts", 
                request, 
                String.class
            );
        }

        // Prepare bulk email
        Map<String, Object> bulkEmail = new HashMap<>();
        bulkEmail.put("subject", "Performance Test Email");
        bulkEmail.put("htmlContent", "<h1>Performance Test</h1>");
        bulkEmail.put("textContent", "Performance Test");
        
        List<Map<String, Object>> recipients = new ArrayList<>();
        for (int i = 0; i < numberOfRecipients; i++) {
            Map<String, Object> recipient = new HashMap<>();
            recipient.put("email", "bulk" + i + "@test.com");
            recipient.put("recipientId", (long)(i+1));
            recipients.add(recipient);
        }
        bulkEmail.put("recipients", recipients);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(bulkEmail, headers);

        long startTime = System.currentTimeMillis();
        
        ResponseEntity<String> response = restTemplate.postForEntity(
            "http://localhost:" + port + "/api/emails/send/bulk", 
            request, 
            String.class
        );
        
        long endTime = System.currentTimeMillis();
        long duration = endTime - startTime;

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(duration).isLessThan(15000); // Should complete within 15 seconds
        
        System.out.println("Sent bulk email to " + numberOfRecipients + " recipients in " + duration + "ms");
        System.out.println("Average: " + (duration / numberOfRecipients) + "ms per email");
    }

    @Test
    void concurrentCampaignOperations_ShouldHandleLoad() throws Exception {
        int numberOfCampaigns = 20;
        ExecutorService executor = Executors.newFixedThreadPool(5);
        List<CompletableFuture<ResponseEntity<String>>> futures = new ArrayList<>();

        long startTime = System.currentTimeMillis();

        for (int i = 0; i < numberOfCampaigns; i++) {
            final int index = i;
            CompletableFuture<ResponseEntity<String>> future = CompletableFuture.supplyAsync(() -> {
                Map<String, Object> campaign = new HashMap<>();
                campaign.put("name", "Perf Campaign " + index);
                campaign.put("subject", "Performance Test " + index);
                campaign.put("description", "Performance test campaign " + index);
                campaign.put("templateId", 1L);
                campaign.put("userId", 1L);

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                HttpEntity<Map<String, Object>> request = new HttpEntity<>(campaign, headers);

                return restTemplate.postForEntity(
                    "http://localhost:" + port + "/api/campaigns", 
                    request, 
                    String.class
                );
            }, executor);
            
            futures.add(future);
        }

        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).get();
        
        long endTime = System.currentTimeMillis();
        long duration = endTime - startTime;

        int successCount = 0;
        for (CompletableFuture<ResponseEntity<String>> future : futures) {
            ResponseEntity<String> response = future.get();
            if (response.getStatusCode() == HttpStatus.OK) {
                successCount++;
            }
        }

        assertThat(successCount).isEqualTo(numberOfCampaigns);
        assertThat(duration).isLessThan(10000); // Should complete within 10 seconds
        
        System.out.println("Created " + numberOfCampaigns + " campaigns in " + duration + "ms");

        executor.shutdown();
    }

    @Test
    void memoryUsage_ShouldStayWithinLimits() throws Exception {
        Runtime runtime = Runtime.getRuntime();
        long initialMemory = runtime.totalMemory() - runtime.freeMemory();
        
        // Perform memory-intensive operations
        for (int i = 0; i < 100; i++) {
            Map<String, Object> contact = new HashMap<>();
            contact.put("email", "memory" + i + "@test.com");
            contact.put("firstName", "Memory" + i);
            contact.put("lastName", "Test");
            contact.put("userId", 1L);
            contact.put("customFields", "Large custom field data ".repeat(100)); // Add some bulk

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(contact, headers);

            restTemplate.postForEntity(
                "http://localhost:" + port + "/api/contacts", 
                request, 
                String.class
            );
        }

        // Force garbage collection
        System.gc();
        Thread.sleep(1000);
        
        long finalMemory = runtime.totalMemory() - runtime.freeMemory();
        long memoryIncrease = finalMemory - initialMemory;
        
        System.out.println("Memory increase: " + (memoryIncrease / 1024 / 1024) + " MB");
        
        // Memory increase should be reasonable (less than 100MB for this test)
        assertThat(memoryIncrease).isLessThan(100 * 1024 * 1024);
    }
}