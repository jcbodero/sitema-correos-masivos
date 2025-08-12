package com.correos.masivos.queue.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.retry.backoff.ExponentialBackOffPolicy;
import org.springframework.retry.policy.SimpleRetryPolicy;
import org.springframework.retry.support.RetryTemplate;

@Configuration
public class RabbitConfig {

    // Queue names
    public static final String EMAIL_QUEUE = "email.send";
    public static final String EMAIL_DLQ = "email.send.dlq";
    public static final String CAMPAIGN_QUEUE = "campaign.process";
    public static final String CAMPAIGN_DLQ = "campaign.process.dlq";

    // Exchange names
    public static final String EMAIL_EXCHANGE = "email.exchange";
    public static final String CAMPAIGN_EXCHANGE = "campaign.exchange";

    // Routing keys
    public static final String EMAIL_ROUTING_KEY = "email.send";
    public static final String CAMPAIGN_ROUTING_KEY = "campaign.process";

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory, Jackson2JsonMessageConverter messageConverter) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter);
        template.setRetryTemplate(retryTemplate());
        return template;
    }

    @Bean
    public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(ConnectionFactory connectionFactory, Jackson2JsonMessageConverter messageConverter) {
        SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory);
        factory.setMessageConverter(messageConverter);
        factory.setDefaultRequeueRejected(false);
        factory.setAcknowledgeMode(AcknowledgeMode.AUTO);
        return factory;
    }

    @Bean
    public RetryTemplate retryTemplate() {
        RetryTemplate retryTemplate = new RetryTemplate();
        
        SimpleRetryPolicy retryPolicy = new SimpleRetryPolicy();
        retryPolicy.setMaxAttempts(3);
        retryTemplate.setRetryPolicy(retryPolicy);
        
        ExponentialBackOffPolicy backOffPolicy = new ExponentialBackOffPolicy();
        backOffPolicy.setInitialInterval(1000);
        backOffPolicy.setMultiplier(2.0);
        backOffPolicy.setMaxInterval(10000);
        retryTemplate.setBackOffPolicy(backOffPolicy);
        
        return retryTemplate;
    }

    // Email Queue Configuration
    @Bean
    public DirectExchange emailExchange() {
        return new DirectExchange(EMAIL_EXCHANGE, true, false);
    }

    @Bean
    public Queue emailQueue() {
        return QueueBuilder.durable(EMAIL_QUEUE)
                .withArgument("x-dead-letter-exchange", "")
                .withArgument("x-dead-letter-routing-key", EMAIL_DLQ)
                .withArgument("x-message-ttl", 300000) // 5 minutes
                .build();
    }

    @Bean
    public Queue emailDlq() {
        return QueueBuilder.durable(EMAIL_DLQ).build();
    }

    @Bean
    public Binding emailBinding() {
        return BindingBuilder.bind(emailQueue()).to(emailExchange()).with(EMAIL_ROUTING_KEY);
    }

    // Campaign Queue Configuration
    @Bean
    public DirectExchange campaignExchange() {
        return new DirectExchange(CAMPAIGN_EXCHANGE, true, false);
    }

    @Bean
    public Queue campaignQueue() {
        return QueueBuilder.durable(CAMPAIGN_QUEUE)
                .withArgument("x-dead-letter-exchange", "")
                .withArgument("x-dead-letter-routing-key", CAMPAIGN_DLQ)
                .withArgument("x-message-ttl", 600000) // 10 minutes
                .build();
    }

    @Bean
    public Queue campaignDlq() {
        return QueueBuilder.durable(CAMPAIGN_DLQ).build();
    }

    @Bean
    public Binding campaignBinding() {
        return BindingBuilder.bind(campaignQueue()).to(campaignExchange()).with(CAMPAIGN_ROUTING_KEY);
    }
}