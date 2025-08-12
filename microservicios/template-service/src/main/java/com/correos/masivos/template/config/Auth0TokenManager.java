package com.correos.masivos.template.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Instant;
import java.util.Base64;

@Component
public class Auth0TokenManager {

    @Value("${auth0.client-id:f2dvMxIOFKGKUfFQMnpemQPeuJKsDaSh}")
    private String clientId;

    @Value("${auth0.client-secret:Vd4QjYOBc4rn6pWMfmJHwdTqo1fsh8uefWXJsoJSGy9N98UeGiGav0Bu7emDLQbb}")
    private String clientSecret;

    @Value("${auth0.audience:XtrimIdentityAPI}")
    private String audience;

    @Value("${auth0.domain:https://dev-1zvh0tbtrif4683g.us.auth0.com}")
    private String domain;

    private String currentToken;
    private long tokenExpiry;

    public String getValidToken() {
        if (currentToken == null || isTokenExpired()) {
            refreshToken();
        }
        return currentToken;
    }

    private boolean isTokenExpired() {
        return Instant.now().getEpochSecond() >= (tokenExpiry - 300); // 5 min buffer
    }

    private void refreshToken() {
        try {
            String requestBody = String.format(
                "{\"client_id\":\"%s\",\"client_secret\":\"%s\",\"audience\":\"%s\",\"grant_type\":\"client_credentials\"}",
                clientId, clientSecret, audience
            );

            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(domain + "/oauth/token"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

            HttpResponse<String> response = HttpClient.newHttpClient()
                .send(request, HttpResponse.BodyHandlers.ofString());

            ObjectMapper mapper = new ObjectMapper();
            JsonNode jsonNode = mapper.readTree(response.body());
            
            currentToken = jsonNode.get("access_token").asText();
            
            // Decode JWT to get expiry
            String[] chunks = currentToken.split("\\.");
            String payload = new String(Base64.getUrlDecoder().decode(chunks[1]));
            JsonNode payloadNode = mapper.readTree(payload);
            tokenExpiry = payloadNode.get("exp").asLong();
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to refresh Auth0 token", e);
        }
    }
}