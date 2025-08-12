-- Fix recipient_email column constraint
-- V4__Fix_recipient_email_constraint.sql

-- Make recipient_email nullable since we're using to_email instead
ALTER TABLE email_logs ALTER COLUMN recipient_email DROP NOT NULL;

-- Update recipient_email from to_email where it exists
UPDATE email_logs SET recipient_email = to_email WHERE recipient_email IS NULL AND to_email IS NOT NULL;

-- For any remaining null values, set a default
UPDATE email_logs SET recipient_email = 'unknown@example.com' WHERE recipient_email IS NULL;