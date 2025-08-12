# HttpRequest API Library

Esta biblioteca proporciona una interfaz unificada para interactuar con todos los microservicios del backend del sistema de correos masivos.

## Características

- **Singleton Pattern**: Una sola instancia para toda la aplicación
- **Autenticación automática**: Manejo automático de tokens Bearer
- **Métodos HTTP completos**: GET, POST, PUT, PATCH, DELETE
- **Callbacks personalizables**: Procesamiento flexible de respuestas
- **Manejo de errores**: Gestión centralizada de errores
- **Soporte para FormData**: Para uploads de archivos

## Instalación

### Opción 1: Con React Hook (Recomendado)
```javascript
import { useHttpRequest } from './api_lib/useHttpRequest';

function MyComponent() {
  const HttpRequest = useHttpRequest();
  // Usar HttpRequest aquí
}
```

### Opción 2: Uso Directo
```javascript
import HttpRequest from './api_lib/HttpRequest.js';
import { setAuth0Instance } from './api_lib/TokenManager.js';

// Inicializar Auth0 manualmente
setAuth0Instance(auth0Instance);
```

## Configuración

### Variables de Entorno

```env
# Base URL del API Gateway
API_BASE_URL=http://localhost:8080/api
```

### Autenticación con Auth0

La biblioteca se integra automáticamente con Auth0:

1. **Automático**: Usa `getAccessTokenSilently()` de Auth0
2. **Cache**: Guarda el token en `localStorage` como `tokenInfo`
3. **Refresh**: Actualiza automáticamente tokens expirados

```javascript
// El token se obtiene automáticamente de Auth0
// y se guarda en localStorage como 'tokenInfo'
```

## API Reference

### Usuarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `getUsers(callback)` | `GET /users` | Obtener lista de usuarios |

### Contactos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `getContacts(params, callback)` | `GET /contacts` | Obtener contactos con filtros |
| `getContact(id, callback)` | `GET /contacts/{id}` | Obtener contacto por ID |
| `createContact(data, callback)` | `POST /contacts` | Crear nuevo contacto |
| `updateContact(id, data, callback)` | `PUT /contacts/{id}` | Actualizar contacto |
| `deleteContact(id, callback)` | `DELETE /contacts/{id}` | Eliminar contacto |
| `unsubscribeContact(id, callback)` | `POST /contacts/{id}/unsubscribe` | Dar de baja contacto |
| `resubscribeContact(id, callback)` | `POST /contacts/{id}/resubscribe` | Reactivar contacto |

### Listas de Contactos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `getContactLists(params, callback)` | `GET /contacts/lists` | Obtener listas de contactos |
| `createContactList(data, callback)` | `POST /contacts/lists` | Crear nueva lista |
| `updateContactList(id, data, callback)` | `PUT /contacts/lists/{id}` | Actualizar lista |
| `deleteContactList(id, callback)` | `DELETE /contacts/lists/{id}` | Eliminar lista |
| `addContactToList(contactId, listId, callback)` | `POST /contacts/{contactId}/lists/{listId}` | Agregar contacto a lista |
| `removeContactFromList(contactId, listId, callback)` | `DELETE /contacts/{contactId}/lists/{listId}` | Remover contacto de lista |

### Campañas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `getCampaigns(params, callback)` | `GET /campaigns` | Obtener campañas con filtros |
| `getCampaign(id, callback)` | `GET /campaigns/{id}` | Obtener campaña por ID |
| `createCampaign(data, callback)` | `POST /campaigns` | Crear nueva campaña |
| `updateCampaign(id, data, callback)` | `PUT /campaigns/{id}` | Actualizar campaña |
| `deleteCampaign(id, callback)` | `DELETE /campaigns/{id}` | Eliminar campaña |
| `scheduleCampaign(id, data, callback)` | `POST /campaigns/{id}/schedule` | Programar campaña |
| `startCampaign(id, callback)` | `POST /campaigns/{id}/start` | Iniciar campaña |
| `pauseCampaign(id, callback)` | `POST /campaigns/{id}/pause` | Pausar campaña |
| `resumeCampaign(id, callback)` | `POST /campaigns/{id}/resume` | Reanudar campaña |
| `cancelCampaign(id, callback)` | `POST /campaigns/{id}/cancel` | Cancelar campaña |
| `duplicateCampaign(id, data, callback)` | `POST /campaigns/{id}/duplicate` | Duplicar campaña |

### Plantillas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `getTemplates(params, callback)` | `GET /templates` | Obtener plantillas con filtros |
| `getTemplate(id, callback)` | `GET /templates/{id}` | Obtener plantilla por ID |
| `createTemplate(data, callback)` | `POST /templates` | Crear nueva plantilla |
| `updateTemplate(id, data, callback)` | `PUT /templates/{id}` | Actualizar plantilla |
| `deleteTemplate(id, callback)` | `DELETE /templates/{id}` | Eliminar plantilla |
| `activateTemplate(id, callback)` | `POST /templates/{id}/activate` | Activar plantilla |
| `archiveTemplate(id, callback)` | `POST /templates/{id}/archive` | Archivar plantilla |
| `renderTemplate(id, data, callback)` | `POST /templates/{id}/render` | Renderizar plantilla |
| `previewTemplate(id, data, callback)` | `POST /templates/{id}/preview` | Vista previa de plantilla |
| `duplicateTemplate(id, data, callback)` | `POST /templates/{id}/duplicate` | Duplicar plantilla |

### Correos Electrónicos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `sendSingleEmail(data, callback)` | `POST /emails/send` | Enviar correo individual |
| `sendBulkEmail(data, callback)` | `POST /emails/send/bulk` | Enviar correos masivos |
| `getEmailStatus(params, callback)` | `GET /emails/status` | Obtener estado de correos |
| `getEmailLogs(params, callback)` | `GET /emails/logs` | Obtener logs de correos |
| `getEmailMetrics(params, callback)` | `GET /emails/metrics` | Obtener métricas de correos |
| `retryFailedEmails(data, callback)` | `POST /emails/retry` | Reintentar correos fallidos |
| `getEmailHistory(params, callback)` | `GET /emails/history` | Obtener historial de correos |
| `getEmailById(id, callback)` | `GET /emails/{id}` | Obtener correo por ID |
| `cancelEmail(id, callback)` | `POST /emails/{id}/cancel` | Cancelar correo |

### Importación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `previewImport(formData, callback)` | `POST /contacts/import/preview` | Vista previa de importación |
| `importContacts(formData, callback)` | `POST /contacts/import` | Importar contactos |
| `getImportStatus(importId, callback)` | `GET /contacts/import/{importId}` | Estado de importación |

### Estadísticas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `getContactStats(params, callback)` | `GET /contacts/stats` | Estadísticas de contactos |
| `getCampaignStats(params, callback)` | `GET /campaigns/stats` | Estadísticas de campañas |
| `getTemplateStats(params, callback)` | `GET /templates/stats` | Estadísticas de plantillas |
| `getDashboardStats(callback)` | `GET /dashboard/stats` | Estadísticas del dashboard |

### Health Checks

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `healthCheck(service, callback)` | `GET /{service}/health` | Verificar estado del servicio |

## Ejemplos de Uso

### En Componente React

```javascript
import { useHttpRequest } from './api_lib/useHttpRequest';

function ContactsPage() {
  const HttpRequest = useHttpRequest();
  const [contacts, setContacts] = useState([]);
  
  useEffect(() => {
    loadContacts();
  }, []);
  
  const loadContacts = () => {
    HttpRequest.getContacts({
      userId: '1',
      page: 0,
      size: 20,
      sortBy: 'createdAt',
      sortDir: 'desc',
      search: 'john',
      active: true
    }, (data) => {
      setContacts(data.content || data);
    });
  };
  
  return <div>{/* Render contacts */}</div>;
}
```

### Obtener Contactos con Filtros

```javascript
HttpRequest.getContacts({
  userId: '1',
  page: 0,
  size: 20,
  sortBy: 'createdAt',
  sortDir: 'desc',
  search: 'john',
  active: true
}, (data) => {
  console.log('Contactos:', data);
});
```

### Crear Nuevo Contacto

```javascript
HttpRequest.createContact({
  email: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+1234567890',
  company: 'Example Corp',
  userId: '1'
}, (data) => {
  console.log('Contacto creado:', data);
});
```

### Enviar Correo Individual

```javascript
HttpRequest.sendSingleEmail({
  to: 'recipient@example.com',
  subject: 'Test Email',
  templateId: 1,
  variables: {
    first_name: 'John',
    company_name: 'Example Corp'
  },
  userId: 1
}, (data) => {
  console.log('Correo enviado:', data);
});
```

### Crear Campaña

```javascript
HttpRequest.createCampaign({
  name: 'Summer Sale Campaign',
  subject: 'Don\'t miss our summer deals!',
  description: 'Promotional campaign for summer products',
  templateId: 1,
  userId: 1,
  sendType: 'SCHEDULED',
  scheduledAt: '2024-06-01T10:00:00Z'
}, (data) => {
  console.log('Campaña creada:', data);
});
```

### Importar Contactos desde CSV

```javascript
const fileInput = document.getElementById('csvFile');
const file = fileInput.files[0];
const formData = new FormData();
formData.append('file', file);
formData.append('userId', '1');
formData.append('email', 'email');
formData.append('firstName', 'first_name');

HttpRequest.importContacts(formData, (data) => {
  console.log('Importación iniciada:', data);
});
```

## Manejo de Errores

```javascript
HttpRequest.getContacts({}, (data) => {
  console.log('Éxito:', data);
}).catch((error) => {
  console.error('Error:', error);
  // Manejar error específico
  if (error.response?.status === 401) {
    // Token expirado, redirigir a login
    window.location.href = '/login';
  }
});
```

## Configuración Avanzada

### Cambiar Base URL

```javascript
// Para desarrollo
HttpRequest.setBaseURL('http://localhost:8080/api');

// Para producción
HttpRequest.setBaseURL('https://api.correos-masivos.com/api');
```

### Callbacks Personalizados

```javascript
// Callback simple
HttpRequest.getContacts({}, (data) => data);

// Callback con procesamiento
HttpRequest.getContacts({}, (data) => {
  return {
    contacts: data.content || data,
    total: data.totalElements || data.length,
    hasMore: data.hasNext || false
  };
});
```

## Parámetros Comunes

### Paginación

```javascript
{
  page: 0,        // Página (empezando en 0)
  size: 20,       // Elementos por página
  sortBy: 'createdAt',  // Campo de ordenamiento
  sortDir: 'desc' // Dirección: 'asc' | 'desc'
}
```

### Filtros de Búsqueda

```javascript
{
  search: 'término',  // Búsqueda de texto
  active: true,       // Solo activos
  status: 'ACTIVE',   // Estado específico
  userId: '1'         // ID del usuario
}
```

### Rangos de Fecha

```javascript
{
  dateFrom: '2024-01-01',
  dateTo: '2024-12-31',
  range: '30d'  // 7d, 30d, 90d, 1y
}
```

## Tipos de Datos

### Contact

```javascript
{
  id: string,
  email: string,
  firstName: string,
  lastName: string,
  phone?: string,
  company?: string,
  position?: string,
  country?: string,
  city?: string,
  userId: string,
  customFields?: object,
  createdAt: string,
  updatedAt: string,
  unsubscribed: boolean
}
```

### Campaign

```javascript
{
  id: string,
  name: string,
  subject: string,
  description?: string,
  templateId: number,
  userId: number,
  status: 'DRAFT' | 'SCHEDULED' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'CANCELLED',
  sendType: 'IMMEDIATE' | 'SCHEDULED',
  scheduledAt?: string,
  createdAt: string,
  updatedAt: string
}
```

### Template

```javascript
{
  id: string,
  name: string,
  description?: string,
  subject: string,
  htmlContent: string,
  textContent?: string,
  userId: number,
  type: 'EMAIL' | 'SMS',
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED',
  variables?: object,
  createdAt: string,
  updatedAt: string
}
```

## Troubleshooting

### Problemas Comunes

1. **Token no válido**: Verificar que el token esté almacenado en localStorage
2. **CORS Error**: Verificar configuración CORS en API Gateway
3. **404 Not Found**: Verificar que todos los servicios estén ejecutándose
4. **500 Internal Error**: Verificar logs del servicio específico

### Debug

```javascript
// Habilitar logs de debug
console.log('Base URL:', HttpRequest.getBaseURL());
console.log('Token:', localStorage.getItem('tokenInfo'));
```

## Contribución

Para agregar nuevos métodos:

1. Agregar el método a la clase HttpRequest
2. Documentar en este README
3. Agregar ejemplo en usage-examples.js
4. Probar con el backend correspondiente

## Licencia

Este proyecto está bajo la licencia MIT.