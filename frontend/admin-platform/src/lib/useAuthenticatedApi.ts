import { useHttpRequest } from '../../api_lib/useHttpRequest'
import { useMemo } from 'react'

export function useAuthenticatedApi() {
  const HttpRequest = useHttpRequest()

  const api = useMemo(() => {
    return {
      // Users
      getUsers: (callback?: (data: any) => void) => HttpRequest.getUsers(callback),
      
      // Contacts
      getContacts: (params?: any, callback?: (data: any) => void) => HttpRequest.getContacts(params, callback),
      getContact: (id: string, callback?: (data: any) => void) => HttpRequest.getContact(id, callback),
      createContact: (contact: any, callback?: (data: any) => void) => HttpRequest.createContact(contact, callback),
      updateContact: (id: string, contact: any, callback?: (data: any) => void) => HttpRequest.updateContact(id, contact, callback),
      deleteContact: (id: string, callback?: (data: any) => void) => HttpRequest.deleteContact(id, callback),
      unsubscribeContact: (id: string, callback?: (data: any) => void) => HttpRequest.unsubscribeContact(id, callback),
      resubscribeContact: (id: string, callback?: (data: any) => void) => HttpRequest.resubscribeContact(id, callback),
      
      // Contact Lists
      getContactLists: (params?: any, callback?: (data: any) => void) => HttpRequest.getContactLists(params, callback),
      createContactList: (list: any, callback?: (data: any) => void) => HttpRequest.createContactList(list, callback),
      updateContactList: (id: string, list: any, callback?: (data: any) => void) => HttpRequest.updateContactList(id, list, callback),
      deleteContactList: (id: string, callback?: (data: any) => void) => HttpRequest.deleteContactList(id, callback),
      addContactToList: (contactId: string, listId: string, callback?: (data: any) => void) => HttpRequest.addContactToList(contactId, listId, callback),
      removeContactFromList: (contactId: string, listId: string, callback?: (data: any) => void) => HttpRequest.removeContactFromList(contactId, listId, callback),
      
      // Import
      previewImport: (file: FormData, callback?: (data: any) => void) => HttpRequest.previewImport(file, callback),
      importContacts: (file: FormData, callback?: (data: any) => void) => HttpRequest.importContacts(file, callback),
      getImportStatus: (importId: string, callback?: (data: any) => void) => HttpRequest.getImportStatus(importId, callback),
      
      // Statistics
      getContactStats: (params?: any, callback?: (data: any) => void) => HttpRequest.getContactStats(params, callback),
      
      // Campaigns
      getCampaigns: (params?: any, callback?: (data: any) => void) => HttpRequest.getCampaigns(params, callback),
      getCampaign: (id: string, callback?: (data: any) => void) => HttpRequest.getCampaign(id, callback),
      createCampaign: (campaign: any, callback?: (data: any) => void) => HttpRequest.createCampaign(campaign, callback),
      updateCampaign: (id: string, campaign: any, callback?: (data: any) => void) => HttpRequest.updateCampaign(id, campaign, callback),
      deleteCampaign: (id: string, callback?: (data: any) => void) => HttpRequest.deleteCampaign(id, callback),
      scheduleCampaign: (id: string, data: any, callback?: (data: any) => void) => HttpRequest.scheduleCampaign(id, data, callback),
      startCampaign: (id: string, callback?: (data: any) => void) => HttpRequest.startCampaign(id, callback),
      pauseCampaign: (id: string, callback?: (data: any) => void) => HttpRequest.pauseCampaign(id, callback),
      resumeCampaign: (id: string, callback?: (data: any) => void) => HttpRequest.resumeCampaign(id, callback),
      cancelCampaign: (id: string, callback?: (data: any) => void) => HttpRequest.cancelCampaign(id, callback),
      duplicateCampaign: (id: string, data: any, callback?: (data: any) => void) => HttpRequest.duplicateCampaign(id, data, callback),
      getCampaignStats: (params?: any, callback?: (data: any) => void) => HttpRequest.getCampaignStats(params, callback),
      
      // Campaign Targets
      addCampaignTarget: (campaignId: string, data: any, callback?: (data: any) => void) => HttpRequest.addCampaignTarget(campaignId, data, callback),
      getCampaignTargets: (campaignId: string, callback?: (data: any) => void) => HttpRequest.getCampaignTargets(campaignId, callback),
      removeCampaignTarget: (campaignId: string, targetId: string, callback?: (data: any) => void) => HttpRequest.removeCampaignTarget(campaignId, targetId, callback),
      
      // Templates
      getTemplates: (params?: any, callback?: (data: any) => void) => HttpRequest.getTemplates(params, callback),
      getTemplate: (id: string, callback?: (data: any) => void) => HttpRequest.getTemplate(id, callback),
      createTemplate: (template: any, callback?: (data: any) => void) => HttpRequest.createTemplate(template, callback),
      updateTemplate: (id: string, template: any, callback?: (data: any) => void) => HttpRequest.updateTemplate(id, template, callback),
      deleteTemplate: (id: string, callback?: (data: any) => void) => HttpRequest.deleteTemplate(id, callback),
      activateTemplate: (id: string, callback?: (data: any) => void) => HttpRequest.activateTemplate(id, callback),
      archiveTemplate: (id: string, callback?: (data: any) => void) => HttpRequest.archiveTemplate(id, callback),
      duplicateTemplate: (id: string, data: any, callback?: (data: any) => void) => HttpRequest.duplicateTemplate(id, data, callback),
      previewTemplate: (id: string, data: any, callback?: (data: any) => void) => HttpRequest.previewTemplate(id, data, callback),
      getTemplateStats: (params?: any, callback?: (data: any) => void) => HttpRequest.getTemplateStats(params, callback),
      
      // Email
      sendSingleEmail: (data: any, callback?: (data: any) => void) => HttpRequest.sendSingleEmail(data, callback),
      sendBulkEmail: (data: any, callback?: (data: any) => void) => HttpRequest.sendBulkEmail(data, callback),
      getEmailStatus: (params?: any, callback?: (data: any) => void) => HttpRequest.getEmailStatus(params, callback),
      getEmailLogs: (params?: any, callback?: (data: any) => void) => HttpRequest.getEmailLogs(params, callback),
      getEmailStats: (params?: any, callback?: (data: any) => void) => HttpRequest.getEmailStats(params, callback),
      getEmailMetrics: (params?: any, callback?: (data: any) => void) => HttpRequest.getEmailMetrics(params, callback),
      retryFailedEmails: (data: any, callback?: (data: any) => void) => HttpRequest.retryFailedEmails(data, callback),
      getEmailHistory: (params?: any, callback?: (data: any) => void) => HttpRequest.getEmailHistory(params, callback),
      
      // Health Check
      healthCheck: (service?: string, callback?: (data: any) => void) => HttpRequest.healthCheck(service, callback),
      
      // Dashboard
      getDashboardStats: (callback?: (data: any) => void) => HttpRequest.getDashboardStats(callback),
    }
  }, [HttpRequest])

  return { 
    api,
    isLoading: false,
    hasToken: true
  }
}