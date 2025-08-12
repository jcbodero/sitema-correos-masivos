-- Add performance indexes for template queries
-- V4__Add_performance_indexes.sql

-- Índice compuesto para consultas de plantillas activas por usuario
CREATE INDEX IF NOT EXISTS idx_templates_user_status_updated 
ON templates(user_id, status, updated_at DESC);

-- Índice para búsquedas de texto
CREATE INDEX IF NOT EXISTS idx_templates_search_name 
ON templates USING gin(to_tsvector('spanish', name));

CREATE INDEX IF NOT EXISTS idx_templates_search_description 
ON templates USING gin(to_tsvector('spanish', description));

-- Índice para consultas por tipo
CREATE INDEX IF NOT EXISTS idx_templates_user_type 
ON templates(user_id, type);

-- Optimizar consultas de variables
CREATE INDEX IF NOT EXISTS idx_template_variables_template_name 
ON template_variables(template_id, variable_name);