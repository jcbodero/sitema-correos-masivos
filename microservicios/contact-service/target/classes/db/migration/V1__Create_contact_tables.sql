-- Contact Service Database Schema
-- V1__Create_contact_tables.sql

-- Tabla de listas de contactos
CREATE TABLE contact_lists (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    user_id BIGINT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de contactos
CREATE TABLE contacts (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    company VARCHAR(255),
    position VARCHAR(255),
    country VARCHAR(100),
    city VARCHAR(100),
    custom_fields JSONB,
    is_active BOOLEAN DEFAULT true,
    is_subscribed BOOLEAN DEFAULT true,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP
);

-- Tabla de relación contactos-listas
CREATE TABLE contact_list_memberships (
    id BIGSERIAL PRIMARY KEY,
    contact_id BIGINT NOT NULL,
    contact_list_id BIGINT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    added_by BIGINT,
    FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
    FOREIGN KEY (contact_list_id) REFERENCES contact_lists(id) ON DELETE CASCADE,
    UNIQUE(contact_id, contact_list_id)
);

-- Tabla de segmentos
CREATE TABLE segments (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    filter_criteria JSONB NOT NULL,
    user_id BIGINT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de importaciones de contactos
CREATE TABLE contact_imports (
    id BIGSERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_size BIGINT,
    total_records INTEGER DEFAULT 0,
    processed_records INTEGER DEFAULT 0,
    successful_records INTEGER DEFAULT 0,
    failed_records INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'PENDING',
    error_message TEXT,
    user_id BIGINT NOT NULL,
    contact_list_id BIGINT,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contact_list_id) REFERENCES contact_lists(id)
);

-- Tabla de errores de importación
CREATE TABLE import_errors (
    id BIGSERIAL PRIMARY KEY,
    import_id BIGINT NOT NULL,
    row_number INTEGER NOT NULL,
    error_type VARCHAR(100) NOT NULL,
    error_message TEXT NOT NULL,
    row_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (import_id) REFERENCES contact_imports(id) ON DELETE CASCADE
);

-- Índices para optimización
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_user_id ON contacts(user_id);
CREATE INDEX idx_contacts_is_active ON contacts(is_active);
CREATE INDEX idx_contacts_is_subscribed ON contacts(is_subscribed);
CREATE INDEX idx_contact_lists_user_id ON contact_lists(user_id);
CREATE INDEX idx_contact_list_memberships_contact_id ON contact_list_memberships(contact_id);
CREATE INDEX idx_contact_list_memberships_list_id ON contact_list_memberships(contact_list_id);
CREATE INDEX idx_segments_user_id ON segments(user_id);
CREATE INDEX idx_contact_imports_user_id ON contact_imports(user_id);
CREATE INDEX idx_contact_imports_status ON contact_imports(status);
CREATE INDEX idx_import_errors_import_id ON import_errors(import_id);