-- Campaign Service Database Schema
-- V1__Create_campaign_tables.sql

-- Tabla de campañas
CREATE TABLE campaigns (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    description TEXT,
    template_id BIGINT,
    user_id BIGINT NOT NULL,
    status VARCHAR(50) DEFAULT 'DRAFT',
    send_type VARCHAR(50) DEFAULT 'IMMEDIATE',
    scheduled_at TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    total_recipients INTEGER DEFAULT 0,
    sent_count INTEGER DEFAULT 0,
    delivered_count INTEGER DEFAULT 0,
    opened_count INTEGER DEFAULT 0,
    clicked_count INTEGER DEFAULT 0,
    bounced_count INTEGER DEFAULT 0,
    unsubscribed_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de destinatarios de campaña
CREATE TABLE campaign_recipients (
    id BIGSERIAL PRIMARY KEY,
    campaign_id BIGINT NOT NULL,
    contact_id BIGINT NOT NULL,
    email VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    opened_at TIMESTAMP,
    clicked_at TIMESTAMP,
    bounced_at TIMESTAMP,
    unsubscribed_at TIMESTAMP,
    error_message TEXT,
    personalization_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
);

-- Tabla de listas/segmentos asociados a campañas
CREATE TABLE campaign_target_lists (
    id BIGSERIAL PRIMARY KEY,
    campaign_id BIGINT NOT NULL,
    target_type VARCHAR(50) NOT NULL, -- 'LIST' o 'SEGMENT'
    target_id BIGINT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
);

-- Tabla de configuración de envío
CREATE TABLE campaign_send_config (
    id BIGSERIAL PRIMARY KEY,
    campaign_id BIGINT NOT NULL UNIQUE,
    batch_size INTEGER DEFAULT 100,
    delay_between_batches INTEGER DEFAULT 60, -- segundos
    max_retries INTEGER DEFAULT 3,
    retry_delay INTEGER DEFAULT 300, -- segundos
    smtp_provider VARCHAR(100),
    from_email VARCHAR(255) NOT NULL,
    from_name VARCHAR(255),
    reply_to VARCHAR(255),
    track_opens BOOLEAN DEFAULT true,
    track_clicks BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
);

-- Tabla de eventos de campaña
CREATE TABLE campaign_events (
    id BIGSERIAL PRIMARY KEY,
    campaign_id BIGINT NOT NULL,
    recipient_id BIGINT,
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB,
    ip_address INET,
    user_agent TEXT,
    occurred_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    FOREIGN KEY (recipient_id) REFERENCES campaign_recipients(id) ON DELETE CASCADE
);

-- Tabla de A/B testing
CREATE TABLE campaign_ab_tests (
    id BIGSERIAL PRIMARY KEY,
    campaign_id BIGINT NOT NULL,
    test_name VARCHAR(255) NOT NULL,
    variant_a_subject VARCHAR(500),
    variant_b_subject VARCHAR(500),
    variant_a_template_id BIGINT,
    variant_b_template_id BIGINT,
    test_percentage INTEGER DEFAULT 10,
    winner_criteria VARCHAR(50) DEFAULT 'OPEN_RATE',
    test_duration_hours INTEGER DEFAULT 24,
    winner_variant CHAR(1),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
);

-- Índices para optimización
CREATE INDEX idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_scheduled_at ON campaigns(scheduled_at);
CREATE INDEX idx_campaign_recipients_campaign_id ON campaign_recipients(campaign_id);
CREATE INDEX idx_campaign_recipients_contact_id ON campaign_recipients(contact_id);
CREATE INDEX idx_campaign_recipients_email ON campaign_recipients(email);
CREATE INDEX idx_campaign_recipients_status ON campaign_recipients(status);
CREATE INDEX idx_campaign_target_lists_campaign_id ON campaign_target_lists(campaign_id);
CREATE INDEX idx_campaign_events_campaign_id ON campaign_events(campaign_id);
CREATE INDEX idx_campaign_events_recipient_id ON campaign_events(recipient_id);
CREATE INDEX idx_campaign_events_type ON campaign_events(event_type);
CREATE INDEX idx_campaign_events_occurred_at ON campaign_events(occurred_at);
CREATE INDEX idx_campaign_ab_tests_campaign_id ON campaign_ab_tests(campaign_id);