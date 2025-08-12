package com.correos.masivos.email.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

@Component
public class RedisHealthChecker {
    
    private static final Logger logger = LoggerFactory.getLogger(RedisHealthChecker.class);
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    @EventListener(ApplicationReadyEvent.class)
    public void checkRedisConnection() {
        logger.info("🚀 EMAIL SERVICE READY - Starting Redis connection test...");
        try {
            String pong = redisTemplate.getConnectionFactory().getConnection().ping();
            logger.info("✅ Redis connection successful: {}", pong);
            
            redisTemplate.opsForValue().set("health-check", "OK");
            String value = (String) redisTemplate.opsForValue().get("health-check");
            redisTemplate.delete("health-check");
            
            logger.info("✅ Redis operations test successful: {}", value);
            logger.info("🎉 EMAIL SERVICE FULLY OPERATIONAL WITH REDIS!");
            
        } catch (Exception e) {
            logger.error("❌ Redis connection failed: {}", e.getMessage());
            logger.error("⚠️ EMAIL SERVICE STARTED BUT REDIS NOT AVAILABLE!");
        }
    }
}