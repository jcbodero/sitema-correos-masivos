package com.correos.masivos.user.api;

import com.correos.masivos.user.api.dto.LoginRequest;
import com.correos.masivos.user.api.dto.TokenResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
            "service", "user-service",
            "status", "UP",
            "port", "8081"
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@RequestBody LoginRequest request) {
        // Simulación simple de autenticación
        if ("admin".equals(request.getUsername()) && "password".equals(request.getPassword())) {
            String token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTY0MDk5NTIwMCwiZXhwIjoxNjQwOTk4ODAwfQ.test-token";
            return ResponseEntity.ok(new TokenResponse(token));
        }
        return ResponseEntity.status(401).build();
    }
}