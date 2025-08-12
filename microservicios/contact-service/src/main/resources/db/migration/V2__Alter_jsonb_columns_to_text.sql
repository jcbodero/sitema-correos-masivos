-- Alter JSONB columns to TEXT
-- V2__Alter_jsonb_columns_to_text.sql

-- Convert custom_fields from JSONB to TEXT
ALTER TABLE contacts ALTER COLUMN custom_fields SET DATA TYPE TEXT;