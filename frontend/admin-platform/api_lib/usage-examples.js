// Usage Examples for HttpRequest API Methods
import { useHttpRequest } from './useHttpRequest';
// Or for direct usage (make sure Auth0 is initialized first):
// import HttpRequest from './HttpRequest.js';

// ===== REACT COMPONENT USAGE =====
/*
function MyComponent() {
  const HttpRequest = useHttpRequest();
  
  useEffect(() => {
    // Now you can use HttpRequest with automatic Auth0 token management
    loadContacts();
  }, []);
  
  const loadContacts = () => {
    HttpRequest.getContacts({
      userId: '1',
      page: 0,
      size: 20
    }, (data) => {
      console.log('Contacts loaded:', data);
    });
  };
  
  return <div>My Component</div>;
}
*/

// ===== CONTACTS EXAMPLES =====

// Get all contacts with pagination and filters
HttpRequest.getContacts({
  userId: '1',
  page: 0,
  size: 20,
  sortBy: 'createdAt',
  sortDir: 'desc',
  search: 'john',
  active: true
}, (data) => {
  console.log('Contacts:', data);
});

// Create a new contact
HttpRequest.createContact({
  email: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+1234567890',
  company: 'Example Corp',
  position: 'Developer',
  country: 'USA',
  city: 'New York',
  userId: '1',
  customFields: {
    department: 'IT',
    level: 'Senior'
  }
}, (data) => {
  console.log('Contact created:', data);
});

// Update contact
HttpRequest.updateContact('contact-id', {
  firstName: 'Jane',
  lastName: 'Smith',
  position: 'Senior Developer'
}, (data) => {
  console.log('Contact updated:', data);
});

// Delete contact
HttpRequest.deleteContact('contact-id', (data) => {
  console.log('Contact deleted:', data);
});

// Unsubscribe contact
HttpRequest.unsubscribeContact('contact-id', (data) => {
  console.log('Contact unsubscribed:', data);
});

// ===== CONTACT LISTS EXAMPLES =====

// Get contact lists
HttpRequest.getContactLists({
  userId: '1',
  page: 0,
  size: 10,
  search: 'newsletter'
}, (data) => {
  console.log('Contact lists:', data);
});

// Create contact list
HttpRequest.createContactList({
  name: 'Newsletter Subscribers',
  description: 'Monthly newsletter subscribers',
  userId: '1'
}, (data) => {
  console.log('List created:', data);
});

// Add contact to list
HttpRequest.addContactToList('contact-id', 'list-id', (data) => {
  console.log('Contact added to list:', data);
});

// ===== CAMPAIGNS EXAMPLES =====

// Get campaigns
HttpRequest.getCampaigns({
  userId: '1',
  page: 0,
  size: 20,
  status: 'DRAFT',
  search: 'summer'
}, (data) => {
  console.log('Campaigns:', data);
});

// Create campaign
HttpRequest.createCampaign({
  name: 'Summer Sale Campaign',
  subject: 'Don\'t miss our summer deals!',
  description: 'Promotional campaign for summer products',
  templateId: 1,
  userId: 1,
  sendType: 'SCHEDULED',
  scheduledAt: '2024-06-01T10:00:00Z'
}, (data) => {
  console.log('Campaign created:', data);
});

// Start campaign
HttpRequest.startCampaign('campaign-id', (data) => {
  console.log('Campaign started:', data);
});

// Pause campaign
HttpRequest.pauseCampaign('campaign-id', (data) => {
  console.log('Campaign paused:', data);
});

// Schedule campaign
HttpRequest.scheduleCampaign('campaign-id', {
  scheduledAt: '2024-06-15T14:00:00Z'
}, (data) => {
  console.log('Campaign scheduled:', data);
});

// Duplicate campaign
HttpRequest.duplicateCampaign('campaign-id', {
  name: 'Summer Sale Campaign - Copy'
}, (data) => {
  console.log('Campaign duplicated:', data);
});

// Add target to campaign
HttpRequest.addCampaignTarget('campaign-id', {
  targetType: 'LIST',
  targetId: 1
}, (data) => {
  console.log('Target added to campaign:', data);
});

// ===== TEMPLATES EXAMPLES =====

// Get templates
HttpRequest.getTemplates({
  userId: '1',
  page: 0,
  size: 20,
  status: 'ACTIVE',
  search: 'welcome'
}, (data) => {
  console.log('Templates:', data);
});

// Create template
HttpRequest.createTemplate({
  name: 'Welcome Email',
  description: 'Welcome email for new subscribers',
  subject: 'Welcome to {{company_name}}!',
  htmlContent: '<h1>Welcome {{first_name}}!</h1><p>Thank you for joining us.</p>',
  textContent: 'Welcome {{first_name}}! Thank you for joining us.',
  userId: 1,
  type: 'EMAIL',
  status: 'DRAFT',
  variables: {
    first_name: 'John',
    company_name: 'Example Corp'
  }
}, (data) => {
  console.log('Template created:', data);
});

// Activate template
HttpRequest.activateTemplate('template-id', (data) => {
  console.log('Template activated:', data);
});

// Render template
HttpRequest.renderTemplate('template-id', {
  first_name: 'John',
  company_name: 'Example Corp',
  email: 'john@example.com'
}, (data) => {
  console.log('Template rendered:', data);
});

// Preview template
HttpRequest.previewTemplate('template-id', {
  first_name: 'John',
  company_name: 'Example Corp'
}, (data) => {
  console.log('Template preview:', data);
});

// Duplicate template
HttpRequest.duplicateTemplate('template-id', {
  name: 'Welcome Email - Copy'
}, (data) => {
  console.log('Template duplicated:', data);
});

// ===== EMAIL EXAMPLES =====

// Send single email
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
  console.log('Email sent:', data);
});

// Send bulk email
HttpRequest.sendBulkEmail({
  campaignId: 1,
  templateId: 1,
  contactListIds: [1, 2, 3],
  subject: 'Bulk Email Campaign',
  variables: {
    company_name: 'Example Corp'
  },
  userId: 1
}, (data) => {
  console.log('Bulk email sent:', data);
});

// Get email status
HttpRequest.getEmailStatus({
  page: 0,
  size: 20,
  status: 'SENT',
  dateFrom: '2024-01-01',
  dateTo: '2024-12-31'
}, (data) => {
  console.log('Email status:', data);
});

// Get email metrics
HttpRequest.getEmailMetrics({
  range: '30d',
  userId: '1'
}, (data) => {
  console.log('Email metrics:', data);
});

// Retry failed emails
HttpRequest.retryFailedEmails({
  emailIds: ['email-1', 'email-2', 'email-3']
}, (data) => {
  console.log('Emails retried:', data);
});

// Get email history
HttpRequest.getEmailHistory({
  userId: '1',
  page: 0,
  size: 50,
  sortBy: 'sentAt',
  sortDir: 'desc'
}, (data) => {
  console.log('Email history:', data);
});

// ===== STATISTICS EXAMPLES =====

// Get contact statistics
HttpRequest.getContactStats({
  userId: '1'
}, (data) => {
  console.log('Contact stats:', data);
});

// Get campaign statistics
HttpRequest.getCampaignStats({
  userId: '1'
}, (data) => {
  console.log('Campaign stats:', data);
});

// Get template statistics
HttpRequest.getTemplateStats({
  userId: '1'
}, (data) => {
  console.log('Template stats:', data);
});

// Get dashboard statistics
HttpRequest.getDashboardStats((data) => {
  console.log('Dashboard stats:', data);
});

// ===== HEALTH CHECKS =====

// Check contact service health
HttpRequest.healthCheck('contacts', (data) => {
  console.log('Contacts service health:', data);
});

// Check campaign service health
HttpRequest.healthCheck('campaigns', (data) => {
  console.log('Campaigns service health:', data);
});

// Check template service health
HttpRequest.healthCheck('templates', (data) => {
  console.log('Templates service health:', data);
});

// Check email service health
HttpRequest.healthCheck('emails', (data) => {
  console.log('Emails service health:', data);
});

// ===== IMPORT EXAMPLES =====

// Preview CSV import
const fileInput = document.getElementById('csvFile');
const file = fileInput.files[0];
const formData = new FormData();
formData.append('file', file);

HttpRequest.previewImport(formData, (data) => {
  console.log('Import preview:', data);
});

// Import contacts from CSV
const importFormData = new FormData();
importFormData.append('file', file);
importFormData.append('userId', '1');
importFormData.append('contactListId', '1');
importFormData.append('email', 'email');
importFormData.append('firstName', 'first_name');
importFormData.append('lastName', 'last_name');

HttpRequest.importContacts(importFormData, (data) => {
  console.log('Import started:', data);
});

// Check import status
HttpRequest.getImportStatus('import-id', (data) => {
  console.log('Import status:', data);
});

// ===== UTILITY EXAMPLES =====

// Change base URL (for different environments)
HttpRequest.setBaseURL('https://api.production.com/api');

// Get current base URL
console.log('Current base URL:', HttpRequest.getBaseURL());

// Build query parameters manually
const params = HttpRequest.buildQueryParams({
  page: 0,
  size: 20,
  search: 'test',
  active: true
});
console.log('Query params:', params); // page=0&size=20&search=test&active=true