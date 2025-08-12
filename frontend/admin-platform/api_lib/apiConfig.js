// API Configuration for Correos Masivos
export const API_CONFIG = {
  // Base URLs for microservices
  BASE_URLS: {
    users: 'http://localhost:8081',
    contacts: 'http://localhost:8082',
    campaigns: 'http://localhost:8083',
    emails: 'http://localhost:8084',
    templates: 'http://localhost:8085',
    gateway: 'http://localhost:8080'
  },
  
  // Default parameters
  DEFAULT_PARAMS: {
    userId: 1,
    page: 0,
    size: 20
  },
  
  // API Endpoints based on Postman collections
  ENDPOINTS: {
    // Contacts API
    CONTACTS: {
      LIST: '/contacts',
      CREATE: '/contacts',
      GET: '/contacts/{id}',
      UPDATE: '/contacts/{id}',
      DELETE: '/contacts/{id}',
      UNSUBSCRIBE: '/contacts/{id}/unsubscribe',
      RESUBSCRIBE: '/contacts/{id}/resubscribe',
      STATS: '/contacts/stats',
      
      // Contact Lists
      LISTS: '/contacts/lists',
      CREATE_LIST: '/contacts/lists',
      UPDATE_LIST: '/contacts/lists/{id}',
      DELETE_LIST: '/contacts/lists/{id}',
      ADD_TO_LIST: '/contacts/{contactId}/lists/{listId}',
      REMOVE_FROM_LIST: '/contacts/{contactId}/lists/{listId}',
      
      // Import
      IMPORT_PREVIEW: '/contacts/import/preview',
      IMPORT: '/contacts/import',
      IMPORT_STATUS: '/contacts/import/{id}'
    },
    
    // Templates API
    TEMPLATES: {
      LIST: '/templates',
      CREATE: '/templates',
      GET: '/templates/{id}',
      UPDATE: '/templates/{id}',
      DELETE: '/templates/{id}',
      ACTIVATE: '/templates/{id}/activate',
      ARCHIVE: '/templates/{id}/archive',
      DEACTIVATE: '/templates/{id}/deactivate',
      RENDER: '/templates/{id}/render',
      RENDER_SUBJECT: '/templates/{id}/render/subject',
      RENDER_HTML: '/templates/{id}/render/html',
      PREVIEW: '/templates/{id}/preview',
      VARIABLES: '/templates/{id}/variables',
      ADD_VARIABLE: '/templates/{id}/variables',
      REMOVE_VARIABLE: '/templates/{templateId}/variables/{variableId}',
      DUPLICATE: '/templates/{id}/duplicate',
      VALIDATE: '/templates/{id}/validate',
      ACTIVE: '/templates/active',
      STATS: '/templates/stats'
    },
    
    // Email API
    EMAILS: {
      SEND: '/emails/send',
      SEND_BULK: '/emails/send/bulk',
      LIST: '/emails',
      GET: '/emails/{id}',
      STATS: '/emails/stats',
      RETRY_FAILED: '/emails/campaigns/{campaignId}/retry',
      GET_FAILED: '/emails/campaigns/{campaignId}/failed',
      HEALTH: '/emails/health'
    }
  },
  
  // Template variables mapping
  TEMPLATE_VARIABLES: {
    // Spanish variables (primary)
    nombre: 'Contact name',
    email: 'Contact email',
    empresa: 'Contact company',
    telefono: 'Contact phone',
    fecha_registro: 'Registration date',
    enlace_confirmacion: 'Confirmation link',
    
    // English variables (fallback)
    name: 'Contact name',
    company: 'Contact company',
    phone: 'Contact phone'
  }
};

export default API_CONFIG;