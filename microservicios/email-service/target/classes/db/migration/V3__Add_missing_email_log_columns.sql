-- Add missing columns to email_logs table
-- V3__Add_missing_email_log_columns.sql

-- Add missing columns
ALTER TABLE email_logs ADD COLUMN recipient_id BIGINT;
ALTER TABLE email_logs ADD COLUMN to_email VARCHAR(255);
ALTER TABLE email_logs ADD COLUMN external_id VARCHAR(255);
ALTER TABLE email_logs ADD COLUMN smtp_provider VARCHAR(255);
ALTER TABLE email_logs ADD COLUMN metadata TEXT;

-- Update to_email from recipient_email if it exists
UPDATE email_logs SET to_email = recipient_email WHERE to_email IS NULL;

-- Update external_id from message_id if it exists  
UPDATE email_logs SET external_id = message_id WHERE external_id IS NULL;

-- Update smtp_provider from smtp_provider_id if it exists
UPDATE email_logs SET smtp_provider = (
    SELECT name FROM smtp_providers WHERE id = email_logs.smtp_provider_id
) WHERE smtp_provider IS NULL AND smtp_provider_id IS NOT NULL;