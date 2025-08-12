-- Email Service Default SMTP Providers
-- V2__Insert_default_smtp_providers.sql

-- Insertar proveedores SMTP por defecto
INSERT INTO smtp_providers (name, host, port, use_tls, use_ssl, max_daily_limit, max_hourly_limit, priority) VALUES
('SendGrid', 'smtp.sendgrid.net', 587, true, false, 100000, 10000, 1),
('AWS SES', 'email-smtp.us-east-1.amazonaws.com', 587, true, false, 200000, 14000, 2),
('Mailgun', 'smtp.mailgun.org', 587, true, false, 10000, 1000, 3),
('Gmail SMTP', 'smtp.gmail.com', 587, true, false, 500, 100, 4),
('Local SMTP', 'localhost', 1025, false, false, 1000, 100, 5);