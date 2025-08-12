-- Template Service Database Schema
-- V1__Create_template_tables.sql

-- Tabla de categorías de plantillas
CREATE TABLE template_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de plantillas
CREATE TABLE templates (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id BIGINT,
    user_id BIGINT NOT NULL,
    subject VARCHAR(500),
    html_content TEXT NOT NULL,
    text_content TEXT,
    thumbnail_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    is_public BOOLEAN DEFAULT false,
    version INTEGER DEFAULT 1,
    parent_template_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES template_categories(id),
    FOREIGN KEY (parent_template_id) REFERENCES templates(id)
);

-- Tabla de variables de plantilla
CREATE TABLE template_variables (
    id BIGSERIAL PRIMARY KEY,
    template_id BIGINT NOT NULL,
    variable_name VARCHAR(100) NOT NULL,
    variable_type VARCHAR(50) DEFAULT 'TEXT',
    default_value TEXT,
    is_required BOOLEAN DEFAULT false,
    description TEXT,
    validation_rules JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE,
    UNIQUE(template_id, variable_name)
);

-- Tabla de historial de versiones de plantillas
CREATE TABLE template_versions (
    id BIGSERIAL PRIMARY KEY,
    template_id BIGINT NOT NULL,
    version_number INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(500),
    html_content TEXT NOT NULL,
    text_content TEXT,
    change_description TEXT,
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE,
    UNIQUE(template_id, version_number)
);

-- Tabla de uso de plantillas
CREATE TABLE template_usage (
    id BIGSERIAL PRIMARY KEY,
    template_id BIGINT NOT NULL,
    campaign_id BIGINT,
    user_id BIGINT NOT NULL,
    usage_type VARCHAR(50) DEFAULT 'CAMPAIGN',
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES templates(id)
);

-- Tabla de plantillas favoritas
CREATE TABLE template_favorites (
    id BIGSERIAL PRIMARY KEY,
    template_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE,
    UNIQUE(template_id, user_id)
);

-- Tabla de elementos de plantilla (para editor de bloques)
CREATE TABLE template_blocks (
    id BIGSERIAL PRIMARY KEY,
    template_id BIGINT NOT NULL,
    block_type VARCHAR(50) NOT NULL,
    block_order INTEGER NOT NULL,
    block_config JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE
);

-- Tabla de assets (imágenes, archivos)
CREATE TABLE template_assets (
    id BIGSERIAL PRIMARY KEY,
    template_id BIGINT,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    asset_type VARCHAR(50) DEFAULT 'IMAGE',
    user_id BIGINT NOT NULL,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE SET NULL
);

-- Índices para optimización
CREATE INDEX idx_templates_user_id ON templates(user_id);
CREATE INDEX idx_templates_category_id ON templates(category_id);
CREATE INDEX idx_templates_is_active ON templates(is_active);
CREATE INDEX idx_templates_is_public ON templates(is_public);
CREATE INDEX idx_templates_parent_id ON templates(parent_template_id);
CREATE INDEX idx_template_variables_template_id ON template_variables(template_id);
CREATE INDEX idx_template_versions_template_id ON template_versions(template_id);
CREATE INDEX idx_template_usage_template_id ON template_usage(template_id);
CREATE INDEX idx_template_usage_user_id ON template_usage(user_id);
CREATE INDEX idx_template_favorites_template_id ON template_favorites(template_id);
CREATE INDEX idx_template_favorites_user_id ON template_favorites(user_id);
CREATE INDEX idx_template_blocks_template_id ON template_blocks(template_id);
CREATE INDEX idx_template_assets_template_id ON template_assets(template_id);
CREATE INDEX idx_template_assets_user_id ON template_assets(user_id);