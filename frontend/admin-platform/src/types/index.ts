export interface User {
  id: string
  email: string
  name: string
  picture?: string
  roles: string[]
}

export interface Contact {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  company?: string
  tags: string[]
  createdAt: string
  updatedAt: string
  unsubscribed?: boolean
  notes?: string
  address?: string
  lastActivity?: string
}

export interface Campaign {
  id: string
  name: string
  subject: string
  description?: string
  status: 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'SENT' | 'PAUSED' | 'CANCELLED'
  templateId: number
  userId: number
  sendType: 'IMMEDIATE' | 'SCHEDULED'
  scheduledAt?: string
  sentAt?: string
  fromName?: string
  fromEmail?: string
  replyTo?: string
  stats?: {
    sent: number
    delivered: number
    opened: number
    clicked: number
    bounced: number
  }
  createdAt: string
  updatedAt: string
}

export interface CampaignTarget {
  id: string
  campaignId: string
  targetType: 'LIST' | 'SEGMENT'
  targetId: number
  createdAt: string
}

export interface CampaignStats {
  totalCampaigns: number
  draftCampaigns: number
  scheduledCampaigns: number
  sentCampaigns: number
  activeCampaigns: number
}

export interface CreateCampaignRequest {
  name: string
  subject: string
  description?: string
  templateId: number
  userId: number
  sendType: 'IMMEDIATE' | 'SCHEDULED'
  scheduledAt?: string
}

export interface UpdateCampaignRequest {
  name?: string
  subject?: string
  description?: string
  templateId?: number
  sendType?: 'IMMEDIATE' | 'SCHEDULED'
  scheduledAt?: string
}

export interface ScheduleCampaignRequest {
  scheduledAt: string
}

export interface DuplicateCampaignRequest {
  name: string
}

export interface Template {
  id: string
  name: string
  description?: string
  subject: string
  htmlContent: string
  textContent?: string
  userId: number
  type: 'EMAIL' | 'SMS'
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED'
  variables?: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface TemplateVariable {
  id: string
  templateId: string
  name: string
  displayName: string
  variableType: 'TEXT' | 'NUMBER' | 'DATE' | 'BOOLEAN' | 'URL'
  defaultValue?: string
  description?: string
  isRequired: boolean
  createdAt: string
}

export interface TemplateStats {
  totalTemplates: number
  activeTemplates: number
  draftTemplates: number
  archivedTemplates: number
}

export interface CreateTemplateRequest {
  name: string
  description?: string
  subject: string
  htmlContent: string
  textContent?: string
  userId: number
  type: 'EMAIL' | 'SMS'
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED'
  variables?: Record<string, any>
}

export interface UpdateTemplateRequest {
  name?: string
  description?: string
  subject?: string
  htmlContent?: string
  textContent?: string
  type?: 'EMAIL' | 'SMS'
  status?: 'DRAFT' | 'ACTIVE' | 'ARCHIVED'
  variables?: Record<string, any>
}

export interface RenderTemplateRequest {
  [key: string]: any
}

export interface DuplicateTemplateRequest {
  name: string
}

export interface EmailStatus {
  id: string
  recipient: string
  subject: string
  status: 'pending' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed'
  sentAt?: string
  deliveredAt?: string
  openedAt?: string
  clickedAt?: string
  bounceReason?: string
  errorMessage?: string
  campaignId: string
  campaignName: string
  provider: string
}

export interface ContactList {
  id: string
  name: string
  description?: string
  contactCount: number
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface DashboardStats {
  totalContacts: number
  totalCampaigns: number
  totalTemplates: number
  emailsSent: number
  deliveryRate: number
  openRate: number
  clickRate: number
}