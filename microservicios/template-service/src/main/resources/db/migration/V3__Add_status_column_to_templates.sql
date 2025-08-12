-- Add status column to templates table
-- V3__Add_status_column_to_templates.sql

-- Add status column with enum values
ALTER TABLE templates 
ADD COLUMN status VARCHAR(20) DEFAULT 'DRAFT';

-- Add type column for template type
ALTER TABLE templates 
ADD COLUMN type VARCHAR(20) DEFAULT 'EMAIL';

-- Update existing records to have ACTIVE status if they are active
UPDATE templates 
SET status = CASE 
    WHEN is_active = true THEN 'ACTIVE'
    ELSE 'DRAFT'
END;

-- Add constraint for status values
ALTER TABLE templates 
ADD CONSTRAINT chk_template_status 
CHECK (status IN ('DRAFT', 'ACTIVE', 'ARCHIVED'));

-- Add constraint for type values
ALTER TABLE templates 
ADD CONSTRAINT chk_template_type 
CHECK (type IN ('EMAIL', 'SMS', 'PUSH'));

-- Create index for status column
CREATE INDEX idx_templates_status ON templates(status);

-- Create index for type column
CREATE INDEX idx_templates_type ON templates(type);