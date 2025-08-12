import axios from 'axios'

const API_BASE_URL = '/api/backend'

class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {},
    accessToken?: string
  ): Promise<T> {
    console.log('Token being sent:', accessToken);
    
    const url = `${"http://localhost:8080/api"}${endpoint}`
    
    const headers: Record<string, string> = {
      ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
    }
    
    // Only add Content-Type if not FormData
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
    }
    
    // Merge with existing headers
    if (options.headers) {
      Object.assign(headers, options.headers)
    }
    
    const config: any = {
      ...options,
      headers,
    }

    console.log('Request config:', config);
 console.log('Request config:', url);
    try {
      const response = await axios(url, {
        ...config,
      })
      
      return response.data
    } catch (error) {
      console.log(config);
      
      console.error('API request failed 2:', error)
      throw error
    }
  }

  async requestWithAuth<T>(
    endpoint: string,
    options: RequestInit = {},
    accessToken?: string
  ): Promise<T> {
    if (!accessToken) {
      throw new Error('Access token is required')
    }
    return this.request(endpoint, options, accessToken)
  }

  // Users
  async getUsers(accessToken?: string) {
    return this.requestWithAuth('/users', {}, accessToken)
  }

  // Contacts
  async getContacts(params?: {
    userId?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
    search?: string;
    active?: boolean;
  }, accessToken?: string) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const query = queryParams.toString();
    return this.requestWithAuth(`/contacts${query ? `?${query}` : ''}`, {}, accessToken);
  }

  async getContact(id: string, accessToken?: string) {
    return this.requestWithAuth(`/contacts/${id}`, {}, accessToken);
  }

  async createContact(contact: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    company?: string;
    position?: string;
    country?: string;
    city?: string;
    userId: string;
    customFields?: Record<string, any>;
  }, accessToken?: string) {
    return this.requestWithAuth('/contacts', {
      method: 'POST',
      body: JSON.stringify(contact),
    }, accessToken);
  }

  async updateContact(id: string, contact: {
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    company?: string;
    position?: string;
    country?: string;
    city?: string;
    userId?: string;
    customFields?: Record<string, any>;
  }, accessToken?: string) {
    return this.requestWithAuth(`/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(contact),
    }, accessToken);
  }

  async deleteContact(id: string, accessToken?: string) {
    return this.requestWithAuth(`/contacts/${id}`, {
      method: 'DELETE',
    }, accessToken);
  }

  async unsubscribeContact(id: string, accessToken?: string) {
    return this.requestWithAuth(`/contacts/${id}/unsubscribe`, {
      method: 'POST',
    }, accessToken);
  }

  async resubscribeContact(id: string, accessToken?: string) {
    return this.requestWithAuth(`/contacts/${id}/resubscribe`, {
      method: 'POST',
    }, accessToken);
  }

  // Contact Lists
  async getContactLists(params?: {
    userId?: string;
    page?: number;
    size?: number;
    search?: string;
  }, accessToken?: string) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const query = queryParams.toString();
    return this.requestWithAuth(`/contacts/lists${query ? `?${query}` : ''}`, {}, accessToken);
  }

  async createContactList(list: {
    name: string;
    description?: string;
    userId: string;
  }, accessToken?: string) {
    return this.requestWithAuth('/contacts/lists', {
      method: 'POST',
      body: JSON.stringify(list),
    }, accessToken);
  }

  async updateContactList(id: string, list: {
    name?: string;
    description?: string;
  }, accessToken?: string) {
    return this.requestWithAuth(`/contacts/lists/${id}`, {
      method: 'PUT',
      body: JSON.stringify(list),
    }, accessToken);
  }

  async deleteContactList(id: string, accessToken?: string) {
    return this.requestWithAuth(`/contacts/lists/${id}`, {
      method: 'DELETE',
    }, accessToken);
  }

  async addContactToList(contactId: string, listId: string, accessToken?: string) {
    return this.requestWithAuth(`/contacts/${contactId}/lists/${listId}`, {
      method: 'POST',
    }, accessToken);
  }

  async removeContactFromList(contactId: string, listId: string, accessToken?: string) {
    return this.requestWithAuth(`/contacts/${contactId}/lists/${listId}`, {
      method: 'DELETE',
    }, accessToken);
  }

  // Import
  async previewImport(file: File, accessToken?: string) {
    const formData = new FormData();
    formData.append('file', file);
    return this.requestWithAuth('/contacts/import/preview', {
      method: 'POST',
      body: formData,
    }, accessToken);
  }

  async importContacts(file: File, mapping: {
    userId: string;
    contactListId?: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    company?: string;
  }, accessToken?: string) {
    const formData = new FormData();
    formData.append('file', file);
    Object.entries(mapping).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value.toString());
      }
    });
    return this.requestWithAuth('/contacts/import', {
      method: 'POST',
      body: formData,
    }, accessToken);
  }

  async getImportStatus(importId: string, accessToken?: string) {
    return this.requestWithAuth(`/contacts/import/${importId}`, {}, accessToken);
  }

  // Statistics
  async getContactStats(userId?: string, accessToken?: string) {
    const params = userId ? `?userId=${userId}` : '';
    return this.requestWithAuth(`/contacts/stats${params}`, {}, accessToken);
  }

  // Campaigns
  async getCampaigns(params?: {
    userId?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
    search?: string;
    status?: string;
  }, accessToken?: string) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const query = queryParams.toString();
    return this.requestWithAuth(`/campaigns${query ? `?${query}` : ''}`, {}, accessToken);
  }

  async getCampaign(id: string, accessToken?: string) {
    return this.requestWithAuth(`/campaigns/${id}`, {}, accessToken)
  }

  async createCampaign(campaign: {
    name: string;
    subject: string;
    description?: string;
    templateId: number;
    userId: number;
    sendType: 'IMMEDIATE' | 'SCHEDULED';
    scheduledAt?: string;
  }, accessToken?: string) {
    return this.requestWithAuth('/campaigns', {
      method: 'POST',
      body: JSON.stringify(campaign),
    }, accessToken)
  }

  async updateCampaign(id: string, campaign: {
    name?: string;
    subject?: string;
    description?: string;
    templateId?: number;
    sendType?: 'IMMEDIATE' | 'SCHEDULED';
    scheduledAt?: string;
  }, accessToken?: string) {
    return this.requestWithAuth(`/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(campaign),
    }, accessToken)
  }

  async deleteCampaign(id: string, accessToken?: string) {
    return this.requestWithAuth(`/campaigns/${id}`, {
      method: 'DELETE',
    }, accessToken)
  }

  // Campaign State Management
  async scheduleCampaign(id: string, scheduledAt: string, accessToken?: string) {
    return this.requestWithAuth(`/campaigns/${id}/schedule`, {
      method: 'POST',
      body: JSON.stringify({ scheduledAt }),
    }, accessToken)
  }

  async startCampaign(id: string, accessToken?: string) {
    return this.requestWithAuth(`/campaigns/${id}/start`, {
      method: 'POST',
    }, accessToken)
  }

  async pauseCampaign(id: string, accessToken?: string) {
    return this.requestWithAuth(`/campaigns/${id}/pause`, {
      method: 'POST',
    }, accessToken)
  }

  async resumeCampaign(id: string, accessToken?: string) {
    return this.requestWithAuth(`/campaigns/${id}/resume`, {
      method: 'POST',
    }, accessToken)
  }

  async cancelCampaign(id: string, accessToken?: string) {
    return this.requestWithAuth(`/campaigns/${id}/cancel`, {
      method: 'POST',
    }, accessToken)
  }

  async duplicateCampaign(id: string, name: string, accessToken?: string) {
    return this.requestWithAuth(`/campaigns/${id}/duplicate`, {
      method: 'POST',
      body: JSON.stringify({ name }),
    }, accessToken)
  }

  // Campaign Targets
  async addCampaignTarget(campaignId: string, target: {
    targetType: 'LIST' | 'SEGMENT';
    targetId: number;
  }, accessToken?: string) {
    return this.requestWithAuth(`/campaigns/${campaignId}/targets`, {
      method: 'POST',
      body: JSON.stringify(target),
    }, accessToken)
  }

  async getCampaignTargets(campaignId: string, accessToken?: string) {
    return this.requestWithAuth(`/campaigns/${campaignId}/targets`, {}, accessToken)
  }

  async removeCampaignTarget(campaignId: string, targetId: string, accessToken?: string) {
    return this.requestWithAuth(`/campaigns/${campaignId}/targets/${targetId}`, {
      method: 'DELETE',
    }, accessToken)
  }

  // Campaign Statistics
  async getCampaignStats(userId?: string, accessToken?: string) {
    const params = userId ? `?userId=${userId}` : '';
    return this.requestWithAuth(`/campaigns/stats${params}`, {}, accessToken);
  }

  // Campaign Health Check
  async campaignHealthCheck(accessToken?: string) {
    return this.requestWithAuth('/campaigns/health', {}, accessToken);
  }

  // Templates
  async getTemplates(params?: {
    userId?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
    search?: string;
    status?: string;
  }, accessToken?: string) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const query = queryParams.toString();
    return this.requestWithAuth(`/templates${query ? `?${query}` : ''}`, {}, accessToken);
  }

  async getTemplate(id: string, accessToken?: string) {
    return this.requestWithAuth(`/templates/${id}`, {}, accessToken)
  }

  async createTemplate(template: {
    name: string;
    description?: string;
    subject: string;
    htmlContent: string;
    textContent?: string;
    userId: number;
    type: 'EMAIL' | 'SMS';
    status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
    variables?: Record<string, any>;
  }, accessToken?: string) {
    return this.requestWithAuth('/templates', {
      method: 'POST',
      body: JSON.stringify(template),
    }, accessToken)
  }

  async updateTemplate(id: string, template: {
    name?: string;
    description?: string;
    subject?: string;
    htmlContent?: string;
    textContent?: string;
    type?: 'EMAIL' | 'SMS';
    status?: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
    variables?: Record<string, any>;
  }, accessToken?: string) {
    return this.requestWithAuth(`/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(template),
    }, accessToken)
  }

  async deleteTemplate(id: string, accessToken?: string) {
    return this.requestWithAuth(`/templates/${id}`, {
      method: 'DELETE',
    }, accessToken)
  }

  // Template State Management
  async activateTemplate(id: string, accessToken?: string) {
    return this.requestWithAuth(`/templates/${id}/activate`, {
      method: 'POST',
    }, accessToken)
  }

  async archiveTemplate(id: string, accessToken?: string) {
    return this.requestWithAuth(`/templates/${id}/archive`, {
      method: 'POST',
    }, accessToken)
  }

  async deactivateTemplate(id: string, accessToken?: string) {
    return this.requestWithAuth(`/templates/${id}/deactivate`, {
      method: 'POST',
    }, accessToken)
  }

  // Template Rendering
  async renderTemplate(id: string, data: Record<string, any>, accessToken?: string) {
    return this.requestWithAuth(`/templates/${id}/render`, {
      method: 'POST',
      body: JSON.stringify(data),
    }, accessToken)
  }

  async renderTemplateSubject(id: string, data: Record<string, any>, accessToken?: string) {
    return this.requestWithAuth(`/templates/${id}/render/subject`, {
      method: 'POST',
      body: JSON.stringify(data),
    }, accessToken)
  }

  async renderTemplateHtml(id: string, data: Record<string, any>, accessToken?: string) {
    return this.requestWithAuth(`/templates/${id}/render/html`, {
      method: 'POST',
      body: JSON.stringify(data),
    }, accessToken)
  }

  async previewTemplate(id: string, data: Record<string, any>, accessToken?: string) {
    return this.requestWithAuth(`/templates/${id}/preview`, {
      method: 'POST',
      body: JSON.stringify(data),
    }, accessToken)
  }

  // Template Variables
  async getTemplateVariables(id: string, accessToken?: string) {
    return this.requestWithAuth(`/templates/${id}/variables`, {}, accessToken)
  }

  async addTemplateVariable(id: string, variable: {
    name: string;
    displayName: string;
    variableType: 'TEXT' | 'NUMBER' | 'DATE' | 'BOOLEAN' | 'URL';
    defaultValue?: string;
    description?: string;
    isRequired: boolean;
  }, accessToken?: string) {
    return this.requestWithAuth(`/templates/${id}/variables`, {
      method: 'POST',
      body: JSON.stringify(variable),
    }, accessToken)
  }

  async removeTemplateVariable(templateId: string, variableId: string, accessToken?: string) {
    return this.requestWithAuth(`/templates/${templateId}/variables/${variableId}`, {
      method: 'DELETE',
    }, accessToken)
  }

  // Template Operations
  async duplicateTemplate(id: string, name: string, accessToken?: string) {
    return this.requestWithAuth(`/templates/${id}/duplicate`, {
      method: 'POST',
      body: JSON.stringify({ name }),
    }, accessToken)
  }

  async validateTemplate(id: string, accessToken?: string) {
    return this.requestWithAuth(`/templates/${id}/validate`, {}, accessToken)
  }

  async getActiveTemplates(userId?: string, accessToken?: string) {
    const params = userId ? `?userId=${userId}` : '';
    return this.requestWithAuth(`/templates/active${params}`, {}, accessToken);
  }

  // Template Statistics
  async getTemplateStats(userId?: string, accessToken?: string) {
    const params = userId ? `?userId=${userId}` : '';
    return this.requestWithAuth(`/templates/stats${params}`, {}, accessToken);
  }

  // Template Health Check
  async templateHealthCheck(accessToken?: string) {
    return this.requestWithAuth('/templates/health', {}, accessToken);
  }

  // Email Status
  async getEmailStatus(accessToken?: string) {
    return this.requestWithAuth('/emails/status', {}, accessToken)
  }

  async getEmailLogs(accessToken?: string) {
    return this.requestWithAuth('/emails/logs', {}, accessToken)
  }

  async getEmailMetrics(dateRange?: string, accessToken?: string) {
    const params = dateRange ? `?range=${dateRange}` : ''
    return this.requestWithAuth(`/emails/metrics${params}`, {}, accessToken)
  }

  async retryFailedEmails(emailIds: string[], accessToken?: string) {
    return this.requestWithAuth('/emails/retry', {
      method: 'POST',
      body: JSON.stringify({ emailIds }),
    }, accessToken)
  }

  // Health Check
  async healthCheck(accessToken?: string) {
    return this.requestWithAuth('/contacts/health', {}, accessToken);
  }

  // Dashboard Stats
  async getDashboardStats(accessToken?: string) {
    return this.requestWithAuth('/dashboard/stats', {}, accessToken);
  }
}

export const apiClient = new ApiClient(API_BASE_URL)