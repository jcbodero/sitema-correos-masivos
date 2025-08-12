-- User Service Default Data
-- V2__Insert_default_roles_permissions.sql

-- Insertar roles por defecto
INSERT INTO roles (name, description) VALUES
('ADMIN', 'Administrador del sistema con acceso completo'),
('MANAGER', 'Gestor de campañas con permisos de gestión'),
('USER', 'Usuario básico con permisos limitados');

-- Insertar permisos por defecto
INSERT INTO permissions (name, resource, action, description) VALUES
-- Permisos de usuarios
('USER_READ', 'users', 'read', 'Leer información de usuarios'),
('USER_CREATE', 'users', 'create', 'Crear nuevos usuarios'),
('USER_UPDATE', 'users', 'update', 'Actualizar información de usuarios'),
('USER_DELETE', 'users', 'delete', 'Eliminar usuarios'),

-- Permisos de contactos
('CONTACT_READ', 'contacts', 'read', 'Leer contactos'),
('CONTACT_CREATE', 'contacts', 'create', 'Crear contactos'),
('CONTACT_UPDATE', 'contacts', 'update', 'Actualizar contactos'),
('CONTACT_DELETE', 'contacts', 'delete', 'Eliminar contactos'),
('CONTACT_IMPORT', 'contacts', 'import', 'Importar contactos masivamente'),

-- Permisos de campañas
('CAMPAIGN_READ', 'campaigns', 'read', 'Leer campañas'),
('CAMPAIGN_CREATE', 'campaigns', 'create', 'Crear campañas'),
('CAMPAIGN_UPDATE', 'campaigns', 'update', 'Actualizar campañas'),
('CAMPAIGN_DELETE', 'campaigns', 'delete', 'Eliminar campañas'),
('CAMPAIGN_SEND', 'campaigns', 'send', 'Enviar campañas'),

-- Permisos de plantillas
('TEMPLATE_READ', 'templates', 'read', 'Leer plantillas'),
('TEMPLATE_CREATE', 'templates', 'create', 'Crear plantillas'),
('TEMPLATE_UPDATE', 'templates', 'update', 'Actualizar plantillas'),
('TEMPLATE_DELETE', 'templates', 'delete', 'Eliminar plantillas'),

-- Permisos de reportes
('REPORT_READ', 'reports', 'read', 'Ver reportes y estadísticas'),
('REPORT_EXPORT', 'reports', 'export', 'Exportar reportes');

-- Asignar permisos a roles
-- ADMIN: Todos los permisos
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'ADMIN';

-- MANAGER: Permisos de gestión (sin gestión de usuarios)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'MANAGER'
AND p.name IN (
    'USER_READ',
    'CONTACT_READ', 'CONTACT_CREATE', 'CONTACT_UPDATE', 'CONTACT_DELETE', 'CONTACT_IMPORT',
    'CAMPAIGN_READ', 'CAMPAIGN_CREATE', 'CAMPAIGN_UPDATE', 'CAMPAIGN_DELETE', 'CAMPAIGN_SEND',
    'TEMPLATE_READ', 'TEMPLATE_CREATE', 'TEMPLATE_UPDATE', 'TEMPLATE_DELETE',
    'REPORT_READ', 'REPORT_EXPORT'
);

-- USER: Permisos básicos de lectura
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'USER'
AND p.name IN (
    'CONTACT_READ',
    'CAMPAIGN_READ',
    'TEMPLATE_READ',
    'REPORT_READ'
);