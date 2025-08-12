-- Template Service Default Data
-- V2__Insert_default_categories_templates.sql

-- Insertar categorías por defecto
INSERT INTO template_categories (name, description) VALUES
('Newsletter', 'Plantillas para boletines informativos'),
('Promocional', 'Plantillas para campañas promocionales y ofertas'),
('Transaccional', 'Plantillas para emails transaccionales'),
('Bienvenida', 'Plantillas para emails de bienvenida'),
('Evento', 'Plantillas para invitaciones y eventos'),
('Básico', 'Plantillas básicas y simples');

-- Insertar plantilla básica por defecto
INSERT INTO templates (name, description, category_id, user_id, subject, html_content, text_content, is_public) VALUES
('Plantilla Básica', 'Plantilla básica para comenzar', 
 (SELECT id FROM template_categories WHERE name = 'Básico'), 
 1, 
 'Bienvenido {{first_name}}',
 '<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{subject}}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .footer { background-color: #f8f9fa; padding: 10px; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>{{company_name}}</h1>
        </div>
        <div class="content">
            <h2>Hola {{first_name}},</h2>
            <p>{{message_content}}</p>
            <p>Saludos cordiales,<br>El equipo de {{company_name}}</p>
        </div>
        <div class="footer">
            <p>© {{current_year}} {{company_name}}. Todos los derechos reservados.</p>
            <p><a href="{{unsubscribe_url}}">Cancelar suscripción</a></p>
        </div>
    </div>
</body>
</html>',
 'Hola {{first_name}},

{{message_content}}

Saludos cordiales,
El equipo de {{company_name}}

© {{current_year}} {{company_name}}. Todos los derechos reservados.
Cancelar suscripción: {{unsubscribe_url}}',
 true);

-- Insertar variables para la plantilla básica
INSERT INTO template_variables (template_id, variable_name, variable_type, default_value, is_required, description) VALUES
((SELECT id FROM templates WHERE name = 'Plantilla Básica'), 'first_name', 'TEXT', 'Usuario', true, 'Nombre del destinatario'),
((SELECT id FROM templates WHERE name = 'Plantilla Básica'), 'company_name', 'TEXT', 'Mi Empresa', true, 'Nombre de la empresa'),
((SELECT id FROM templates WHERE name = 'Plantilla Básica'), 'message_content', 'TEXTAREA', 'Contenido del mensaje aquí...', true, 'Contenido principal del mensaje'),
((SELECT id FROM templates WHERE name = 'Plantilla Básica'), 'current_year', 'TEXT', '2024', false, 'Año actual'),
((SELECT id FROM templates WHERE name = 'Plantilla Básica'), 'unsubscribe_url', 'URL', '#', true, 'URL para cancelar suscripción');