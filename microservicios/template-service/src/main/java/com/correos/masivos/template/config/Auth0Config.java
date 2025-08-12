package com.correos.masivos.template.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.ConfigurableEnvironment;

import javax.annotation.PostConstruct;

@Configuration
public class Auth0Config {

    @Autowired
    private Auth0TokenManager tokenManager;

    @Autowired
    private ConfigurableEnvironment environment;

    @PostConstruct
    public void updateEnvironmentWithToken() {
        String token = tokenManager.getValidToken();
        System.setProperty("AUTH0_SERVICE_TOKEN", token);
    }

    @Bean
    public String auth0ServiceToken() {
        return tokenManager.getValidToken();
    }
}