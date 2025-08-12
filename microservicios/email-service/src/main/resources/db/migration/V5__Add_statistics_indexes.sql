-- V5__Add_statistics_indexes.sql
-- Optimización de índices para consultas de estadísticas

-- Índices compuestos para consultas de estadísticas por campaña y fecha
CREATE INDEX IF NOT EXISTS idx_email_logs_campaign_status_date ON email_logs(campaign_id, status, created_at);
CREATE INDEX IF NOT EXISTS idx_email_logs_status_date ON email_logs(status, created_at);
CREATE INDEX IF NOT EXISTS idx_email_logs_date_status ON email_logs(created_at, status);

-- Índices para optimizar conteos por estado
CREATE INDEX IF NOT EXISTS idx_email_logs_status_campaign ON email_logs(status, campaign_id);

-- Índices para webhooks y eventos
CREATE INDEX IF NOT EXISTS idx_email_logs_external_id_status ON email_logs(external_id, status) WHERE external_id IS NOT NULL;

-- Función para actualizar estadísticas automáticamente
CREATE OR REPLACE FUNCTION update_email_stats() RETURNS TRIGGER AS $$
BEGIN
    -- Esta función se puede usar para mantener estadísticas en tiempo real
    -- Por ahora solo registramos el cambio
    IF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
        -- Log status change for potential real-time stats
        INSERT INTO email_events (email_log_id, event_type, event_data, occurred_at)
        VALUES (NEW.id, 'STATUS_CHANGE', 
                json_build_object('old_status', OLD.status, 'new_status', NEW.status),
                NOW());
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar estadísticas automáticamente
DROP TRIGGER IF EXISTS email_stats_trigger ON email_logs;
CREATE TRIGGER email_stats_trigger
    AFTER UPDATE ON email_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_email_stats();

-- Vista materializada para estadísticas rápidas (opcional)
CREATE MATERIALIZED VIEW IF NOT EXISTS email_stats_summary AS
SELECT 
    campaign_id,
    status,
    COUNT(*) as count,
    DATE(created_at) as date
FROM email_logs 
GROUP BY campaign_id, status, DATE(created_at);

-- Índice en la vista materializada
CREATE UNIQUE INDEX IF NOT EXISTS idx_email_stats_summary ON email_stats_summary(campaign_id, status, date);

-- Función para refrescar estadísticas
CREATE OR REPLACE FUNCTION refresh_email_stats() RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY email_stats_summary;
END;
$$ LANGUAGE plpgsql;