package com.correos.masivos.user.api.dto;

public class TokenResponse {
    private String token;
    private String type = "Bearer";

    public TokenResponse(String token) {
        this.token = token;
    }

    public String getToken() { return token; }
    public String getType() { return type; }
}