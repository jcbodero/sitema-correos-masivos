import axios from 'axios';
import { getToken, refreshToken } from './TokenManager.js';

class HttpRequest {
  static instance;

  constructor() {
    if (HttpRequest.instance) {
      return HttpRequest.instance;
    }

    this.baseURLs = {
      users: 'http://localhost:8081',
      contacts: 'http://localhost:8082', 
      campaigns: 'http://localhost:8083',
      emails: 'http://localhost:8084',
      templates: 'http://localhost:8085',
      gateway: 'http://localhost:8080'
    };
    this.methods = {
      GET: 'GET',
      POST: 'POST',
      PUT: 'PUT',
      PATCH: 'PATCH',
      DELETE: 'DELETE'
    };

    HttpRequest.instance = this;
  }

  async request(URL, METHOD, FN_CALLBACK = (e) => e, DATA = {}, PARAMS = {}, HEADERS = {}) {
    const token = await getToken();
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
      ...HEADERS,
    };
    
    // Build query string for GET requests
    let finalURL = URL;
    if (METHOD === this.methods.GET && PARAMS && Object.keys(PARAMS).length > 0) {
      const queryString = this.buildQueryParams(PARAMS);
      finalURL = `${URL}${queryString ? '?' + queryString : ''}`;
    }

    switch (METHOD) {
      case this.methods.GET:
        return axios.get(finalURL, { headers }).then((response) => FN_CALLBACK(response.data));
      case this.methods.POST:
        return axios.post(URL, DATA, { headers }).then((response) => FN_CALLBACK(response.data));
      case this.methods.PUT:
        return axios.put(URL, DATA, { headers }).then((response) => FN_CALLBACK(response.data));
      case this.methods.PATCH:
        return axios.patch(URL, DATA, { headers }).then((response) => FN_CALLBACK(response.data));
      case this.methods.DELETE:
        return axios.delete(finalURL, { headers }).then((response) => FN_CALLBACK(response.data));
      default:
        throw new Error('Método HTTP no soportado');
    }
  }

  // ===== TOKEN MANAGEMENT =====
  async refreshToken() {
    return await refreshToken();
  }

  // ===== USERS API =====
  async getUsers(callback) {
    return this.request(`${this.baseURLs.users}/users`, this.methods.GET, callback);
  }

  // ===== CONTACTS API =====
  async getContacts(params = {}, callback) {
    const queryParams = typeof params === 'string' ? { userId: params } : { userId: 1, ...params };
    return this.request(`${this.baseURLs.contacts}/contacts`, this.methods.GET, callback, {}, queryParams);
  }

  async getContact(id, callback) {
    return this.request(`${this.baseURLs.contacts}/contacts/${id}`, this.methods.GET, callback);
  }

  async createContact(data, callback) {
    const contactData = typeof data === 'string' ? { userId: data } : { userId: 1, ...data };
    return this.request(`${this.baseURLs.contacts}/contacts`, this.methods.POST, callback, contactData);
  }

  async updateContact(id, data, callback) {
    const contactData = typeof data === 'string' ? { userId: data } : { userId: 1, ...data };
    return this.request(`${this.baseURLs.contacts}/contacts/${id}`, this.methods.PUT, callback, contactData);
  }

  async deleteContact(id, callback) {
    return this.request(`${this.baseURLs.contacts}/contacts/${id}`, this.methods.DELETE, callback);
  }

  async unsubscribeContact(id, callback) {
    return this.request(`${this.baseURLs.contacts}/contacts/${id}/unsubscribe`, this.methods.POST, callback);
  }

  async resubscribeContact(id, callback) {
    return this.request(`${this.baseURLs.contacts}/contacts/${id}/resubscribe`, this.methods.POST, callback);
  }

  // Contact Lists
  async getContactLists(params = {}, callback) {
    const queryParams = typeof params === 'string' ? { userId: params } : { userId: 1, ...params };
    return this.request(`${this.baseURLs.contacts}/contacts/lists`, this.methods.GET, callback, {}, queryParams);
  }

  async createContactList(data, callback) {
    const listData = typeof data === 'string' ? { userId: data } : { userId: 1, ...data };
    return this.request(`${this.baseURLs.contacts}/contacts/lists`, this.methods.POST, callback, listData);
  }

  async updateContactList(id, data, callback) {
    return this.request(`${this.baseURLs.contacts}/contacts/lists/${id}`, this.methods.PUT, callback, data);
  }

  async deleteContactList(id, callback) {
    return this.request(`${this.baseURLs.contacts}/contacts/list/${id}`, this.methods.DELETE, callback);
  }

  async addContactToList(contactId, listId, callback) {
    return this.request(`${this.baseURLs.contacts}/contacts/${contactId}/lists/${listId}`, this.methods.POST, callback);
  }

  async removeContactFromList(contactId, listId, callback) {
    return this.request(`${this.baseURLs.contacts}/contacts/${contactId}/list/${listId}`, this.methods.DELETE, callback);
  }

  async getContactsByListId(listId, params = {}, callback, errorCallback) {
    try {
      let allContacts = [];
      let page = 0;
      let hasMore = true;
      
      while (hasMore) {
        const queryParams = { userId: 1, page, size: 1000, ...params };
        const response = await new Promise((resolve, reject) => {
          this.request(`${this.baseURLs.contacts}/contacts/list/${listId}/contacts`, this.methods.GET, resolve, {}, queryParams)
            .catch(reject);
        });
        
        const contacts = response.content || [];
        allContacts.push(...contacts);
        
        hasMore = !response.last && contacts.length > 0;
        page++;
      }
      
      if (callback) callback(allContacts);
      return allContacts;
    } catch (error) {
      if (errorCallback) errorCallback(error);
      throw error;
    }
  }

  // Import
  async previewImport(formData, callback) {
    return this.request(`${this.baseURLs.contacts}/contacts/import/preview`, this.methods.POST, callback, formData, {}, { 'Content-Type': 'multipart/form-data' });
  }

  async importContacts(formData, callback) {
    return this.request(`${this.baseURLs.contacts}/contacts/import`, this.methods.POST, callback, formData, {}, { 'Content-Type': 'multipart/form-data' });
  }

  async getImportStatus(importId, callback) {
    return this.request(`${this.baseURLs.contacts}/contacts/import/${importId}`, this.methods.GET, callback);
  }

  // Statistics
  async getContactStats(params = {}, callback) {
    const queryParams = typeof params === 'string' ? { userId: params } : { userId: 1, ...params };
    return this.request(`${this.baseURLs.contacts}/contacts/stats`, this.methods.GET, callback, {}, queryParams);
  }

  // ===== CAMPAIGNS API =====
  async getCampaigns(params = {}, callback) {
    return this.request(`${this.baseURLs.campaigns}/campaigns`, this.methods.GET, callback, {}, params);
  }

  async getCampaign(id, callback) {
    return this.request(`${this.baseURLs.campaigns}/campaigns/${id}`, this.methods.GET, callback);
  }

  async createCampaign(data, callback) {
    return this.request(`${this.baseURLs.campaigns}/campaigns`, this.methods.POST, callback, data);
  }

  async updateCampaign(id, data, callback) {
    return this.request(`${this.baseURLs.campaigns}/campaigns/${id}`, this.methods.PUT, callback, data);
  }

  async deleteCampaign(id, callback) {
    return this.request(`${this.baseURLs.campaigns}/campaigns/${id}`, this.methods.DELETE, callback);
  }

  // Campaign State Management
  async scheduleCampaign(id, data, callback) {
    return this.request(`${this.baseURLs.campaigns}/campaigns/${id}/schedule`, this.methods.POST, callback, data);
  }

  async startCampaign(id, callback) {
    return this.request(`${this.baseURLs.campaigns}/campaigns/${id}/start`, this.methods.POST, callback);
  }

  async pauseCampaign(id, callback) {
    return this.request(`${this.baseURLs.campaigns}/campaigns/${id}/pause`, this.methods.POST, callback);
  }

  async resumeCampaign(id, callback) {
    return this.request(`${this.baseURLs.campaigns}/campaigns/${id}/resume`, this.methods.POST, callback);
  }

  async cancelCampaign(id, callback) {
    return this.request(`${this.baseURLs.campaigns}/campaigns/${id}/cancel`, this.methods.POST, callback);
  }

  async duplicateCampaign(id, data, callback) {
    return this.request(`${this.baseURLs.campaigns}/campaigns/${id}/duplicate`, this.methods.POST, callback, data);
  }

  // Campaign Targets
  async addCampaignTarget(campaignId, data, callback) {
    return this.request(`${this.baseURLs.campaigns}/campaigns/${campaignId}/targets`, this.methods.POST, callback, data);
  }

  async getCampaignTargets(campaignId, callback) {
    return this.request(`${this.baseURLs.campaigns}/campaigns/${campaignId}/targets`, this.methods.GET, callback);
  }

  async removeCampaignTarget(campaignId, targetId, callback) {
    return this.request(`${this.baseURLs.campaigns}/campaigns/${campaignId}/targets/${targetId}`, this.methods.DELETE, callback);
  }

  // Campaign Statistics
  async getCampaignStats(params = {}, callback) {
    // Handle case where params is a string (userId)
    const queryParams = typeof params === 'string' ? { userId: params } : { userId: 1, ...params };
    return this.request(`${this.baseURLs.campaigns}/campaigns/stats`, this.methods.GET, callback, {}, queryParams);
  }

  // ===== TEMPLATES API =====
  async getTemplates(params = {}, callback) {
    const queryParams = typeof params === 'string' ? { userId: params } : { userId: 1, ...params };
    return this.request(`${this.baseURLs.templates}/templates`, this.methods.GET, callback, {}, queryParams);
  }

  async getTemplate(id, callback) {
    return this.request(`${this.baseURLs.templates}/templates/${id}`, this.methods.GET, callback);
  }

  async createTemplate(data, callback) {
    const templateData = typeof data === 'string' ? { userId: data } : { userId: 1, ...data };
    return this.request(`${this.baseURLs.templates}/templates`, this.methods.POST, callback, templateData);
  }

  async updateTemplate(id, data, callback) {
    const templateData = typeof data === 'string' ? { userId: data } : { userId: 1, ...data };
    return this.request(`${this.baseURLs.templates}/templates/${id}`, this.methods.PUT, callback, templateData);
  }

  async deleteTemplate(id, callback) {
    return this.request(`${this.baseURLs.templates}/templates/${id}`, this.methods.DELETE, callback);
  }

  // Template State Management
  async activateTemplate(id, callback) {
    return this.request(`${this.baseURLs.templates}/templates/${id}/activate`, this.methods.POST, callback);
  }

  async archiveTemplate(id, callback) {
    return this.request(`${this.baseURLs.templates}/templates/${id}/archive`, this.methods.POST, callback);
  }

  async deactivateTemplate(id, callback) {
    return this.request(`${this.baseURLs.templates}/templates/${id}/deactivate`, this.methods.POST, callback);
  }

  // Template Rendering
  async renderTemplate(id, data, callback) {
    return this.request(`${this.baseURLs.templates}/templates/${id}/render`, this.methods.POST, callback, data);
  }

  async renderTemplateSubject(id, data, callback) {
    return this.request(`${this.baseURLs.templates}/templates/${id}/render/subject`, this.methods.POST, callback, data);
  }

  async renderTemplateHtml(id, data, callback) {
    return this.request(`${this.baseURLs.templates}/templates/${id}/render/html`, this.methods.POST, callback, data);
  }

  async previewTemplate(id, data, callback) {
    return this.request(`${this.baseURLs.templates}/templates/${id}/preview`, this.methods.POST, callback, data);
  }

  // Template Variables
  async getTemplateVariables(id, callback) {
    return this.request(`${this.baseURLs.templates}/templates/${id}/variables`, this.methods.GET, callback);
  }

  async addTemplateVariable(id, data, callback) {
    return this.request(`${this.baseURLs.templates}/templates/${id}/variables`, this.methods.POST, callback, data);
  }

  async removeTemplateVariable(templateId, variableId, callback) {
    return this.request(`${this.baseURLs.templates}/templates/${templateId}/variables/${variableId}`, this.methods.DELETE, callback);
  }

  // Template Operations
  async duplicateTemplate(id, data, callback) {
    return this.request(`${this.baseURLs.templates}/templates/${id}/duplicate`, this.methods.POST, callback, data);
  }

  async validateTemplate(id, callback) {
    return this.request(`${this.baseURLs.templates}/templates/${id}/validate`, this.methods.GET, callback);
  }

  async getActiveTemplates(params = {}, callback) {
    const queryParams = typeof params === 'string' ? { userId: params } : { userId: 1, ...params };
    return this.request(`${this.baseURLs.templates}/templates/active`, this.methods.GET, callback, {}, queryParams);
  }

  // Template Statistics
  async getTemplateStats(params = {}, callback) {
    const queryParams = typeof params === 'string' ? { userId: params } : { userId: 1, ...params };
    return this.request(`${this.baseURLs.templates}/templates/stats`, this.methods.GET, callback, {}, queryParams);
  }

  // ===== EMAIL API =====
  // Health check
  async getEmailHealth(callback) {
    return this.request(`${this.baseURLs.emails}/emails/health`, this.methods.GET, callback);
  }

  // Send single email
  async sendEmail(data, callback) {
    return this.request(`${this.baseURLs.emails}/emails/send`, this.methods.POST, callback, data);
  }

  async sendSingleEmail(data, callback) {
    return this.sendEmail(data, callback);
  }

  // Send bulk emails
  async sendBulkEmails(data, callback) {
    return this.request(`${this.baseURLs.emails}/emails/send/bulk`, this.methods.POST, callback, data);
  }

  async sendBulkEmail(data, callback) {
    return this.sendBulkEmails(data, callback);
  }

  // Get email logs with filters
  async getEmailLogs(params = {}, callback) {
    return this.request(`${this.baseURLs.emails}/emails`, this.methods.GET, callback, {}, params);
  }

  // Get email status (alias for getEmailLogs)
  async getEmailStatus(params = {}, callback) {
    return this.getEmailLogs(params, callback);
  }

  // Get email history (alias for getEmailLogs)
  async getEmailHistory(params = {}, callback) {
    return this.getEmailLogs(params, callback);
  }

  // Get email history with enhanced filtering
  async getEmailHistoryEnhanced(params = {}, callback) {
    return this.request(`${this.baseURLs.emails}/emails/history`, this.methods.GET, callback, {}, params);
  }

  // Get email statistics for history page
  async getEmailHistoryStats(params = {}, callback) {
    return this.request(`${this.baseURLs.emails}/emails/stats`, this.methods.GET, callback, {}, params);
  }

  // Get email by ID
  async getEmailById(id, callback) {
    return this.request(`${this.baseURLs.emails}/emails/${id}`, this.methods.GET, callback);
  }

  // Get email logs by campaign
  async getEmailLogsByCampaign(campaignId, params = {}, callback) {
    const queryParams = { campaignId, ...params };
    return this.request(`${this.baseURLs.emails}/emails`, this.methods.GET, callback, {}, queryParams);
  }

  // Get email logs by status
  async getEmailLogsByStatus(status, params = {}, callback) {
    const queryParams = { status, ...params };
    return this.request(`${this.baseURLs.emails}/emails`, this.methods.GET, callback, {}, queryParams);
  }

  // Get email statistics
  async getEmailStats(params = {}, callback) {
    return this.request(`${this.baseURLs.emails}/emails/stats`, this.methods.GET, callback, {}, params);
  }

  // Get email metrics (alias for getEmailStats)
  async getEmailMetrics(params = {}, callback) {
    return this.getEmailStats(params, callback);
  }

  // Get campaign email statistics
  async getCampaignEmailStats(campaignId, callback) {
    return this.request(`${this.baseURLs.emails}/emails/stats`, this.methods.GET, callback, {}, { campaignId });
  }

  // Retry failed emails by campaign
  async retryFailedEmails(campaignId, callback) {
    return this.request(`${this.baseURLs.emails}/emails/campaigns/${campaignId}/retry`, this.methods.POST, callback);
  }

  // Get failed emails by campaign
  async getFailedEmails(campaignId, callback) {
    return this.request(`${this.baseURLs.emails}/emails/campaigns/${campaignId}/failed`, this.methods.GET, callback);
  }

  // Webhook handlers (for testing)
  async sendDeliveryWebhook(data, callback) {
    return this.request(`${this.baseURLs.emails}/emails/webhooks/delivery`, this.methods.POST, callback, data);
  }

  async sendOpenWebhook(data, callback) {
    return this.request(`${this.baseURLs.emails}/emails/webhooks/open`, this.methods.POST, callback, data);
  }

  async sendClickWebhook(data, callback) {
    return this.request(`${this.baseURLs.emails}/emails/webhooks/click`, this.methods.POST, callback, data);
  }

  async sendBounceWebhook(data, callback) {
    return this.request(`${this.baseURLs.emails}/emails/webhooks/bounce`, this.methods.POST, callback, data);
  }

  // ===== HEALTH CHECKS =====
  async healthCheck(service = 'contacts', callback) {
    const serviceUrl = this.baseURLs[service] || this.baseURLs.contacts;
    return this.request(`${serviceUrl}/${service}/health`, this.methods.GET, callback);
  }

  async getDashboardStats(callback) {
    return this.request(`${this.baseURLs.contacts}/dashboard/stats`, this.methods.GET, callback);
  }

  // ===== UTILITY METHODS =====
  buildQueryParams(params) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    return queryParams.toString();
  }

  setBaseURLs(urls) {
    this.baseURLs = { ...this.baseURLs, ...urls };
  }

  getBaseURLs() {
    return this.baseURLs;
  }
}

const instance = new HttpRequest();
Object.freeze(instance);

export default instance;
