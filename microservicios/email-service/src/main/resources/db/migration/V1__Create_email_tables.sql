-- Email Service Database Schema
-- V1__Create_email_tables.sql

-- Tabla de proveedores SMTP
CREATE TABLE smtp_providers (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    host VARCHAR(255) NOT NULL,
    port INTEGER NOT NULL,
    username VARCHAR(255),
    password VARCHAR(255),
    use_tls BOOLEAN DEFAULT true,
    use_ssl BOOLEAN DEFAULT false,
    max_daily_limit INTEGER,
    max_hourly_limit INTEGER,
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de logs de emails
CREATE TABLE email_logs (
    id BIGSERIAL PRIMARY KEY,
    campaign_id BIGINT,
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    from_email VARCHAR(255) NOT NULL,
    from_name VARCHAR(255),
    reply_to VARCHAR(255),
    html_content TEXT,
    text_content TEXT,
    status VARCHAR(50) DEFAULT 'PENDING',
    smtp_provider_id BIGINT,
    message_id VARCHAR(255),
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    scheduled_at TIMESTAMP,
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    opened_at TIMESTAMP,
    clicked_at TIMESTAMP,
    bounced_at TIMESTAMP,
    complained_at TIMESTAMP,
    unsubscribed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (smtp_provider_id) REFERENCES smtp_providers(id)
);

-- Tabla de eventos de email
CREATE TABLE email_events (
    id BIGSERIAL PRIMARY KEY,
    email_log_id BIGINT NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB,
    provider_event_id VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    occurred_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (email_log_id) REFERENCES email_logs(id) ON DELETE CASCADE
);

-- Tabla de bounces
CREATE TABLE email_bounces (
    id BIGSERIAL PRIMARY KEY,
    email_log_id BIGINT NOT NULL,
    bounce_type VARCHAR(50) NOT NULL, -- 'HARD', 'SOFT', 'COMPLAINT'
    bounce_subtype VARCHAR(100),
    bounce_reason TEXT,
    diagnostic_code TEXT,
    feedback_id VARCHAR(255),
    occurred_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (email_log_id) REFERENCES email_logs(id) ON DELETE CASCADE
);

-- Tabla de supresión de emails
CREATE TABLE email_suppressions (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    suppression_type VARCHAR(50) NOT NULL, -- 'BOUNCE', 'COMPLAINT', 'UNSUBSCRIBE', 'MANUAL'
    reason TEXT,
    source VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- Tabla de estadísticas diarias por proveedor
CREATE TABLE daily_provider_stats (
    id BIGSERIAL PRIMARY KEY,
    smtp_provider_id BIGINT NOT NULL,
    date DATE NOT NULL,
    emails_sent INTEGER DEFAULT 0,
    emails_delivered INTEGER DEFAULT 0,
    emails_bounced INTEGER DEFAULT 0,
    emails_complained INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (smtp_provider_id) REFERENCES smtp_providers(id),
    UNIQUE(smtp_provider_id, date)
);

-- Tabla de colas de envío
CREATE TABLE email_queue (
    id BIGSERIAL PRIMARY KEY,
    campaign_id BIGINT,
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    from_email VARCHAR(255) NOT NULL,
    from_name VARCHAR(255),
    reply_to VARCHAR(255),
    html_content TEXT,
    text_content TEXT,
    personalization_data JSONB,
    priority INTEGER DEFAULT 5,
    max_retries INTEGER DEFAULT 3,
    retry_count INTEGER DEFAULT 0,
    scheduled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'QUEUED',
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimización
CREATE INDEX idx_email_logs_campaign_id ON email_logs(campaign_id);
CREATE INDEX idx_email_logs_recipient_email ON email_logs(recipient_email);
CREATE INDEX idx_email_logs_status ON email_logs(status);
CREATE INDEX idx_email_logs_sent_at ON email_logs(sent_at);
CREATE INDEX idx_email_logs_message_id ON email_logs(message_id);
CREATE INDEX idx_email_events_email_log_id ON email_events(email_log_id);
CREATE INDEX idx_email_events_type ON email_events(event_type);
CREATE INDEX idx_email_events_occurred_at ON email_events(occurred_at);
CREATE INDEX idx_email_bounces_email_log_id ON email_bounces(email_log_id);
CREATE INDEX idx_email_bounces_type ON email_bounces(bounce_type);
CREATE INDEX idx_email_suppressions_email ON email_suppressions(email);
CREATE INDEX idx_email_suppressions_type ON email_suppressions(suppression_type);
CREATE INDEX idx_daily_provider_stats_provider_date ON daily_provider_stats(smtp_provider_id, date);
CREATE INDEX idx_email_queue_status ON email_queue(status);
CREATE INDEX idx_email_queue_scheduled_at ON email_queue(scheduled_at);
CREATE INDEX idx_email_queue_priority ON email_queue(priority);