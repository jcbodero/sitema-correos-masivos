-- Script de inicialización de bases de datos
-- Se ejecuta automáticamente cuando se crea el contenedor de PostgreSQL

-- Crear bases de datos para cada microservicio
CREATE DATABASE correos_masivos_users;
CREATE DATABASE correos_masivos_contacts;
CREATE DATABASE correos_masivos_campaigns;
CREATE DATABASE correos_masivos_emails;
CREATE DATABASE correos_masivos_templates;

-- Crear usuario específico para la aplicación (opcional)
CREATE USER correos_app WITH PASSWORD 'correos_password';

-- Otorgar permisos a todas las bases de datos
GRANT ALL PRIVILEGES ON DATABASE correos_masivos_users TO correos_app;
GRANT ALL PRIVILEGES ON DATABASE correos_masivos_contacts TO correos_app;
GRANT ALL PRIVILEGES ON DATABASE correos_masivos_campaigns TO correos_app;
GRANT ALL PRIVILEGES ON DATABASE correos_masivos_emails TO correos_app;
GRANT ALL PRIVILEGES ON DATABASE correos_masivos_templates TO correos_app;