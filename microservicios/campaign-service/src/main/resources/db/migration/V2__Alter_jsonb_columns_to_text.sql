-- Alter JSONB columns to TEXT
-- V2__Alter_jsonb_columns_to_text.sql

-- Convert personalization_data from JSONB to TEXT
ALTER TABLE campaign_recipients ALTER COLUMN personalization_data SET DATA TYPE TEXT;