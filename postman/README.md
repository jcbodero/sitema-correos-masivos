# Postman Collections - Correos Masivos API

## 🔗 Integración Frontend Completada

✅ **El módulo de contactos del frontend está completamente integrado con la API**

- **Frontend Components**: Actualizados para usar la API real
- **Fallback Strategy**: Datos mock si la API no está disponible
- **Error Handling**: Manejo robusto de errores de red
- **Documentation**: Guía completa en `frontend/admin-platform/API-INTEGRATION.md`
- **Testing**: Script de pruebas en `frontend/admin-platform/test-api-integration.js`

## 🆕 Nuevas Funcionalidades - Contact Service

✅ **Importación CSV/Excel Completa**
- Preview de archivos antes de importar
- Mapeo flexible de columnas
- Importación a listas existentes o nuevas
- Seguimiento de progreso en tiempo real
- Historial completo de importaciones

✅ **Gestión Avanzada de Listas**
- CRUD completo de listas de contactos
- Operaciones masivas (bulk)
- Estadísticas detalladas por lista
- Búsqueda y filtrado avanzado

## Archivos Incluidos

- `Contact-Service-API.postman_collection.json` - Colección para Contact Service (✅ **ACTUALIZADA**)
- `Campaign-Service-API.postman_collection.json` - Colección para Campaign Service
- `Email-Service-API.postman_collection.json` - Colección para Email Service (✅ **ESTADÍSTICAS COMPLETAS**)
- `Template-Service-API.postman_collection.json` - Colección para Template Service
- `EMAIL-STATISTICS-API.md` - Documentación completa de estadísticas de correos
- `environments/Development.postman_environment.json` - Variables de ambiente para desarrollo
- `environments/Production.postman_environment.json` - Variables de ambiente para producción
- `sample-contacts.csv` - Archivo CSV de ejemplo para probar importación

## Configuración

### 1. Importar en Postman

1. Abrir Postman
2. Click en "Import"
3. Seleccionar los archivos JSON
4. Importar la colección y los ambientes

### 2. Configurar Variables de Ambiente

**Development:**
- `base_url`: `http://localhost:8080`
- `auth_token`: Tu JWT token de Auth0
- `user_id`: ID del usuario (por defecto: 1)
- `contact_id`: ID de contacto para pruebas (se auto-asigna)
- `list_id`: ID de lista para pruebas (se auto-asigna)
- `import_id`: ID de importación para pruebas (se auto-asigna)

**Production:**
- `base_url`: `https://api.correos-masivos.com`
- `auth_token`: Tu JWT token de Auth0 de producción
- `user_id`: ID del usuario
- `contact_id`: ID de contacto para pruebas
- `list_id`: ID de lista para pruebas
- `import_id`: ID de importación para pruebas

### 3. Obtener Token de Autenticación

Para obtener el `auth_token`, puedes:

1. **Desde el frontend:** Inspeccionar las cookies/localStorage después del login
2. **Desde Auth0 directamente:** Usar el endpoint de token de Auth0
3. **Para testing:** Usar un token de prueba generado en Auth0 Dashboard

### 4. Archivo CSV de Ejemplo

Usa el archivo `sample-contacts.csv` incluido para probar la importación:
- Contiene 10 contactos de ejemplo
- Incluye todos los campos estándar
- Formato compatible con el sistema
- Perfecto para pruebas de desarrollo

### 4. Contact Service - Endpoints Disponibles

#### Health Check
- `GET /api/contacts/health` - Verificar estado del servicio

#### Gestión de Contactos
- `POST /api/contacts` - Crear contacto
- `GET /api/contacts/{id}` - Obtener contacto por ID
- `GET /api/contacts` - Listar contactos (con filtros avanzados)
- `PUT /api/contacts/{id}` - Actualizar contacto
- `DELETE /api/contacts/{id}` - Eliminar contacto
- `POST /api/contacts/{id}/unsubscribe` - Desuscribir contacto
- `POST /api/contacts/{id}/resubscribe` - Reuscribir contacto

**Filtros disponibles:**
- `search`: Búsqueda por nombre, email, empresa
- `active`: Solo contactos activos
- `subscribed`: Solo contactos suscritos
- `sortBy`: Campo de ordenamiento
- `sortDir`: Dirección de ordenamiento (asc/desc)

#### Listas de Contactos
- `POST /api/contacts/lists` - Crear lista
- `GET /api/contacts/list/{id}` - Obtener lista por ID
- `GET /api/contacts/lists` - Listar listas (con búsqueda)
- `PUT /api/contacts/list/{id}` - Actualizar lista
- `DELETE /api/contacts/list/{id}` - Eliminar lista
- `GET /api/contacts/list/{id}/contacts` - Obtener contactos de una lista
- `GET /api/contacts/list/{id}/stats` - Estadísticas de una lista

#### Relaciones Contacto-Lista
- `POST /api/contacts/{contactId}/lists/{listId}` - Agregar contacto a lista
- `DELETE /api/contacts/{contactId}/lists/{listId}` - Remover contacto de lista
- `POST /api/contacts/list/{listId}/contacts/bulk` - Agregar múltiples contactos a lista
- `DELETE /api/contacts/list/{listId}/contacts/bulk` - Remover múltiples contactos de lista

#### Importación CSV/Excel
- `POST /api/contacts/import/csv/preview` - Preview de archivo CSV
- `POST /api/contacts/import/excel/preview` - Preview de archivo Excel
- `POST /api/contacts/import/csv` - Importar contactos desde CSV
- `POST /api/contacts/import/excel` - Importar contactos desde Excel
- `POST /api/contacts/import/csv/create-list` - Importar CSV y crear nueva lista
- `GET /api/contacts/import/{id}` - Estado de importación específica
- `GET /api/contacts/import` - Historial de importaciones
- `DELETE /api/contacts/import/{id}` - Eliminar registro de importación

#### Estadísticas
- `GET /api/contacts/stats` - Estadísticas generales de contactos
- `GET /api/contacts/list/{id}/stats` - Estadísticas específicas de una lista

### Campaign Service Endpoints

#### Campañas
- `POST /api/campaigns` - Crear campaña
- `GET /api/campaigns/{id}` - Obtener campaña por ID
- `GET /api/campaigns` - Listar campañas (con filtros)
- `PUT /api/campaigns/{id}` - Actualizar campaña
- `DELETE /api/campaigns/{id}` - Eliminar campaña

#### Gestión de Estado
- `POST /api/campaigns/{id}/schedule` - Programar campaña
- `POST /api/campaigns/{id}/start` - Iniciar campaña
- `POST /api/campaigns/{id}/pause` - Pausar campaña
- `POST /api/campaigns/{id}/resume` - Reanudar campaña
- `POST /api/campaigns/{id}/cancel` - Cancelar campaña

#### Gestión de Destinatarios
- `POST /api/campaigns/{id}/targets` - Agregar lista/segmento objetivo
- `GET /api/campaigns/{id}/targets` - Obtener listas objetivo
- `DELETE /api/campaigns/{id}/targets/{targetId}` - Remover lista objetivo

#### Operaciones
- `POST /api/campaigns/{id}/duplicate` - Duplicar campaña
- `GET /api/campaigns/stats` - Estadísticas de campañas

### Email Service Endpoints

#### Gestión de Emails
- `POST /api/emails/send` - Enviar email individual
- `GET /api/emails/{id}` - Obtener log de email por ID
- `GET /api/emails` - Listar logs de emails (con filtros)

#### Reintentos
- `POST /api/emails/campaigns/{id}/retry` - Reintentar emails fallidos
- `GET /api/emails/campaigns/{id}/failed` - Obtener emails fallidos por campaña

#### Webhooks
- `POST /api/emails/webhooks/delivery` - Webhook de entrega
- `POST /api/emails/webhooks/open` - Webhook de apertura
- `POST /api/emails/webhooks/click` - Webhook de clic
- `POST /api/emails/webhooks/bounce` - Webhook de rebote

#### Envío Masivo
- `POST /api/emails/send/bulk` - Enviar emails masivos con personalización

#### Estadísticas
- `GET /api/emails/stats` - Estadísticas básicas globales y por campaña
- `GET /api/emails/stats/detailed` - Estadísticas detalladas con tasas calculadas
- `GET /api/emails/stats/realtime` - Estadísticas en tiempo real con timestamp

**Nuevas funcionalidades de estadísticas:**
- ✅ **Tasas calculadas**: Delivery, Open, Click, Bounce rates
- ✅ **Filtros por fecha**: Consultas por rango de fechas
- ✅ **Desglose por estado**: Conteos detallados por cada estado
- ✅ **Tiempo real**: Actualización instantánea con timestamp
- ✅ **Optimización BD**: Índices y vistas materializadas para rendimiento

### Template Service Endpoints

#### Gestión de Plantillas
- `POST /api/templates` - Crear plantilla
- `GET /api/templates/{id}` - Obtener plantilla por ID
- `GET /api/templates` - Listar plantillas (con filtros)
- `PUT /api/templates/{id}` - Actualizar plantilla
- `DELETE /api/templates/{id}` - Eliminar plantilla

#### Gestión de Estados
- `POST /api/templates/{id}/activate` - Activar plantilla
- `POST /api/templates/{id}/archive` - Archivar plantilla
- `POST /api/templates/{id}/deactivate` - Desactivar plantilla

#### Renderizado
- `POST /api/templates/{id}/render` - Renderizar plantilla completa
- `POST /api/templates/{id}/render/subject` - Renderizar solo asunto
- `POST /api/templates/{id}/render/html` - Renderizar contenido HTML
- `POST /api/templates/{id}/preview` - Vista previa completa

#### Variables
- `GET /api/templates/{id}/variables` - Obtener variables de plantilla
- `POST /api/templates/{id}/variables` - Agregar variable
- `DELETE /api/templates/{id}/variables/{varId}` - Eliminar variable

#### Operaciones
- `POST /api/templates/{id}/duplicate` - Duplicar plantilla
- `GET /api/templates/{id}/validate` - Validar plantilla
- `GET /api/templates/active` - Obtener plantillas activas
- `GET /api/templates/stats` - Estadísticas de plantillas

## Uso

1. Seleccionar el ambiente apropiado (Development/Production)
2. Configurar el `auth_token` en las variables de ambiente
3. Ejecutar los requests según sea necesario
4. Los requests usan variables de ambiente automáticamente

## Estados de Campaña

**Estados válidos:** DRAFT, SCHEDULED, SENDING, SENT, PAUSED, CANCELLED, FAILED

**Transiciones permitidas:**
- DRAFT → SCHEDULED, SENDING
- SCHEDULED → SENDING, CANCELLED
- SENDING → SENT, PAUSED, CANCELLED, FAILED
- PAUSED → SENDING, CANCELLED

**Tipos de Target:** LIST (listas de contactos), SEGMENT (segmentos)

## Estados de Email

**Estados válidos:** PENDING, SENDING, SENT, DELIVERED, OPENED, CLICKED, BOUNCED, FAILED, CANCELLED

**Flujo típico:**
- PENDING → SENDING → SENT → DELIVERED → OPENED → CLICKED
- Fallos: PENDING/SENDING → FAILED
- Rebotes: SENT/DELIVERED → BOUNCED

**Webhooks:** Los proveedores SMTP envían eventos que actualizan automáticamente los estados

## Estados de Plantilla

**Estados válidos:** DRAFT, ACTIVE, ARCHIVED

**Tipos de plantilla:** EMAIL, SMS, PUSH_NOTIFICATION

**Variables dinámicas:** Se definen con sintaxis {{variable}} en el contenido

**Tipos de variables:** TEXT, NUMBER, DATE, EMAIL, URL, BOOLEAN

## Importación de Contactos

### Formatos Soportados
- **CSV**: Archivos de texto separados por comas
- **Excel**: Archivos .xlsx (Excel 2007+)

### Proceso de Importación

1. **Preview**: Subir archivo para ver estructura y datos de muestra
2. **Mapeo**: Mapear columnas del archivo a campos de contacto
3. **Importación**: Procesar archivo y crear contactos
4. **Seguimiento**: Monitorear progreso y resultados

### Campos Mapeables
- `email` (requerido)
- `firstName`
- `lastName`
- `phone`
- `company`
- `position`
- `country`
- `city`
- Campos personalizados adicionales

### Ejemplo de CSV
```csv
Email,First Name,Last Name,Phone,Company
john@example.com,John,Doe,+1234567890,Tech Corp
jane@example.com,Jane,Smith,+1234567891,Design Co
```

### Estados de Importación
- `PENDING`: Importación iniciada
- `PROCESSING`: Procesando archivo
- `COMPLETED`: Importación completada
- `FAILED`: Error en importación
- `CANCELLED`: Importación cancelada

## Gestión de Listas de Contactos

### Operaciones Disponibles
- **CRUD completo**: Crear, leer, actualizar, eliminar listas
- **Gestión de miembros**: Agregar/remover contactos individual o masivamente
- **Estadísticas**: Conteos de contactos activos, suscritos, etc.
- **Búsqueda**: Filtrar listas por nombre o descripción

### Operaciones Masivas
- Agregar múltiples contactos a una lista en una sola operación
- Remover múltiples contactos de una lista
- Importar CSV directamente a una nueva lista

## Variables de Colección Auto-Gestionadas

La colección incluye scripts que automáticamente:
- Extraen IDs de respuestas para usar en requests posteriores
- Configuran variables `contact_id`, `list_id`, `import_id`
- Validan tiempos de respuesta
- Manejan errores comunes

## Notas Importantes

- Todos los endpoints (excepto health) requieren autenticación JWT
- Los archivos de importación deben ser CSV o Excel (.xlsx)
- Tamaño máximo de archivo: 10MB
- Máximo 10,000 contactos por importación
- Las respuestas incluyen paginación donde corresponde
- Los filtros y búsquedas son opcionales en los endpoints GET
- Las campañas incluyen métricas calculadas (openRate, clickRate, deliveryRate)
- Las fechas deben estar en formato ISO 8601 (YYYY-MM-DDTHH:mm:ss)
- Los emails incluyen tracking completo del ciclo de vida
- Los webhooks permiten actualización en tiempo real de estados
- El sistema incluye rate limiting automático por proveedor SMTP
- Los reintentos se manejan automáticamente con backoff exponencial
- Las plantillas soportan variables dinámicas con sintaxis {{variable}}
- El renderizado incluye validación de variables y valores por defecto
- Las plantillas pueden duplicarse manteniendo variables y configuración
- El sistema extrae automáticamente variables del contenido HTML/texto
- **Duplicados**: Los emails duplicados se detectan y manejan automáticamente
- **Validación**: Todos los emails se validan antes de importar
- **Rollback**: Las importaciones fallidas pueden revertirse
- **Logs detallados**: Cada importación mantiene logs de errores y éxitos