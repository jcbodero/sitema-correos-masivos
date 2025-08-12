'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@auth0/nextjs-auth0/client'
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  CheckIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { useAuthenticatedApi } from '@/lib/useAuthenticatedApi'
import { CreateCampaignRequest, Contact, ContactList, Template } from '@/types'

interface CampaignWizardProps {
  campaignId?: string
}

export default function CampaignWizard({ campaignId }: CampaignWizardProps) {
  const router = useRouter()
  const { user } = useUser()
  const { api, hasToken, isLoading: authLoading } = useAuthenticatedApi()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [campaignData, setCampaignData] = useState({
    name: '',
    subject: '',
    description: '',
    templateId: 1,
    sendType: 'IMMEDIATE' as 'IMMEDIATE' | 'SCHEDULED',
    scheduledAt: '',
    sendNow: true,
    selectedContacts: [] as string[],
    selectedLists: [] as string[]
  })
  const [contacts, setContacts] = useState<Contact[]>([])
  const [contactLists, setContactLists] = useState<ContactList[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [loadingData, setLoadingData] = useState(false)

  const steps = [
    { id: 1, name: 'Información Básica', description: 'Nombre y configuración' },
    { id: 2, name: 'Destinatarios', description: 'Seleccionar contactos' },
    { id: 3, name: 'Contenido', description: 'Plantilla y mensaje' },
    { id: 4, name: 'Programación', description: 'Cuándo enviar' },
    { id: 5, name: 'Revisión', description: 'Confirmar y enviar' }
  ]

  useEffect(() => {
    if (hasToken && api && !authLoading) {
      loadInitialData()
      if (campaignId) {
        loadCampaign()
      }
    }
  }, [campaignId, hasToken, api, authLoading])

  const loadInitialData = async () => {
    if (!api || !user) return
    
    try {
      setLoadingData(true)
      const [contactsRes, listsRes, templatesRes] = await Promise.all([
        api.getContacts({ userId: '1', size: 100 }),
        api.getContactLists({ userId: '1', size: 50 }),
        api.getTemplates({ userId: '1', status: 'ACTIVE', size: 50 })
      ])
      
      setContacts(contactsRes.content || [])
      setContactLists(listsRes.content || [])
      setTemplates(templatesRes.content || [])
    } catch (error) {
      console.error('Error loading initial data:', error)
    } finally {
      setLoadingData(false)
    }
  }

  const loadCampaign = async () => {
    if (!api || !campaignId) return
    
    try {
      setLoading(true)
      const campaign = await api.getCampaign(campaignId) as any
      setCampaignData({
        name: campaign.name,
        subject: campaign.subject,
        description: campaign.description || '',
        templateId: campaign.templateId,
        sendType: campaign.sendType,
        scheduledAt: campaign.scheduledAt || '',
        sendNow: campaign.sendType === 'IMMEDIATE'
      })
    } catch (error) {
      console.error('Error loading campaign:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSave = async () => {
    if (!api || !user) return
    
    try {
      setLoading(true)
      
      const campaignRequest: CreateCampaignRequest = {
        name: campaignData.name,
        subject: campaignData.subject,
        description: campaignData.description,
        templateId: campaignData.templateId,
        userId: 1, // TODO: Get from user context
        sendType: campaignData.sendNow ? 'IMMEDIATE' : 'SCHEDULED',
        ...(campaignData.scheduledAt && { scheduledAt: campaignData.scheduledAt })
      }
      
      let createdCampaignId = campaignId;
      
      if (campaignId) {
        await api.updateCampaign(campaignId, campaignRequest)
      } else {
        const createdCampaign = await api.createCampaign(campaignRequest)
        createdCampaignId = createdCampaign.id
      }
      
      // Add campaign targets after creating/updating campaign
      if (createdCampaignId) {
        // Add contact lists as targets
        for (const listId of campaignData.selectedLists || []) {
          await api.addCampaignTarget(createdCampaignId, {
            targetType: 'LIST',
            targetId: parseInt(listId)
          })
        }
        
        // Add individual contacts as targets (if backend supports it)
        for (const contactId of campaignData.selectedContacts || []) {
          await api.addCampaignTarget(createdCampaignId, {
            targetType: 'CONTACT',
            targetId: parseInt(contactId)
          })
        }
      }
      
      router.push('/dashboard/campaigns')
    } catch (error) {
      console.error('Error saving campaign:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep data={campaignData} onChange={setCampaignData} />
      case 2:
        return <RecipientsStep data={campaignData} onChange={setCampaignData} contacts={contacts} contactLists={contactLists} loading={loadingData} />
      case 3:
        return <ContentStep data={campaignData} onChange={setCampaignData} templates={templates} loading={loadingData} />
      case 4:
        return <SchedulingStep data={campaignData} onChange={setCampaignData} />
      case 5:
        return <ReviewStep data={campaignData} contacts={contacts} contactLists={contactLists} templates={templates} />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">
          {campaignId ? 'Editar Campaña' : 'Nueva Campaña'}
        </h2>
        <p className="text-white/70">
          Sigue los pasos para crear tu campaña de correo
        </p>
      </div>

      {/* Progress Steps */}
      <div className="card-glass p-6 rounded-lg">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.id
                  ? 'bg-accent border-accent text-primary'
                  : 'border-white/30 text-white/60'
              }`}>
                {currentStep > step.id ? (
                  <CheckIcon className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>
              
              <div className="ml-3">
                <div className={`text-sm font-medium ${
                  currentStep >= step.id ? 'text-white' : 'text-white/60'
                }`}>
                  {step.name}
                </div>
                <div className="text-xs text-white/50">{step.description}</div>
              </div>
              
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  currentStep > step.id ? 'bg-accent' : 'bg-white/20'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="card-glass p-6 rounded-lg min-h-[400px]">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="btn-secondary flex items-center space-x-2 disabled:opacity-50"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          <span>Anterior</span>
        </button>

        {currentStep < steps.length ? (
          <button
            onClick={handleNext}
            disabled={loading}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50"
          >
            <span>Siguiente</span>
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handleSave}
            disabled={loading || !campaignData.name || !campaignData.subject}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <CheckIcon className="h-4 w-4" />
                <span>{campaignId ? 'Actualizar' : 'Crear'} Campaña</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

// Step Components
function BasicInfoStep({ data, onChange }: any) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white mb-4">Información Básica</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-white/70 text-sm mb-2">
            Nombre de la Campaña *
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => onChange({...data, name: e.target.value})}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Ej: Newsletter Febrero 2024"
          />
        </div>
        
        <div>
          <label className="block text-white/70 text-sm mb-2">
            Asunto del Email *
          </label>
          <input
            type="text"
            value={data.subject}
            onChange={(e) => onChange({...data, subject: e.target.value})}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Ej: Novedades y ofertas especiales"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-white/70 text-sm mb-2">
            Descripción
          </label>
          <textarea
            value={data.description}
            onChange={(e) => onChange({...data, description: e.target.value})}
            rows={3}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Descripción opcional de la campaña"
          />
        </div>
        

      </div>
    </div>
  )
}

function RecipientsStep({ data, onChange, contacts, contactLists, loading }: any) {
  const [activeTab, setActiveTab] = useState<'contacts' | 'lists'>('lists')
  
  const handleContactToggle = (contactId: string) => {
    const selectedContacts = data.selectedContacts || []
    const newSelection = selectedContacts.includes(contactId)
      ? selectedContacts.filter((id: string) => id !== contactId)
      : [...selectedContacts, contactId]
    onChange({ ...data, selectedContacts: newSelection })
  }
  
  const handleListToggle = (listId: string) => {
    const selectedLists = data.selectedLists || []
    const newSelection = selectedLists.includes(listId)
      ? selectedLists.filter((id: string) => id !== listId)
      : [...selectedLists, listId]
    onChange({ ...data, selectedLists: newSelection })
  }
  
  if (loading) {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-white mb-4">Seleccionar Destinatarios</h3>
        <div className="text-center py-8">
          <div className="text-white">Cargando contactos y listas...</div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white mb-4">Seleccionar Destinatarios</h3>
      
      {/* Tabs */}
      <div className="flex space-x-1 bg-white/10 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('lists')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'lists'
              ? 'bg-accent text-primary'
              : 'text-white/70 hover:text-white'
          }`}
        >
          Listas de Contactos ({contactLists.length})
        </button>
        <button
          onClick={() => setActiveTab('contacts')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'contacts'
              ? 'bg-accent text-primary'
              : 'text-white/70 hover:text-white'
          }`}
        >
          Contactos Individuales ({contacts.length})
        </button>
      </div>
      
      {/* Content */}
      <div className="max-h-96 overflow-y-auto">
        {activeTab === 'lists' ? (
          <div className="space-y-3">
            {contactLists.length === 0 ? (
              <div className="text-center py-8 text-white/60">
                No hay listas de contactos disponibles
              </div>
            ) : (
              contactLists.map((list: any) => (
                <div key={list.id} className="flex items-center p-3 bg-white/5 rounded-lg hover:bg-white/10">
                  <input
                    type="checkbox"
                    checked={data.selectedLists?.includes(list.id) || false}
                    onChange={() => handleListToggle(list.id)}
                    className="mr-3 text-accent focus:ring-accent"
                  />
                  <div className="flex-1">
                    <div className="text-white font-medium">{list.name}</div>
                    <div className="text-white/60 text-sm">
                      {list.contactCount} contactos
                      {list.description && ` • ${list.description}`}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {contacts.length === 0 ? (
              <div className="text-center py-8 text-white/60">
                No hay contactos disponibles
              </div>
            ) : (
              contacts.map((contact: Contact) => (
                <div key={contact.id} className="flex items-center p-3 bg-white/5 rounded-lg hover:bg-white/10">
                  <input
                    type="checkbox"
                    checked={data.selectedContacts?.includes(contact.id) || false}
                    onChange={() => handleContactToggle(contact.id)}
                    className="mr-3 text-accent focus:ring-accent"
                  />
                  <div className="flex-1">
                    <div className="text-white font-medium">
                      {contact.firstName} {contact.lastName}
                    </div>
                    <div className="text-white/60 text-sm">
                      {contact.email}
                      {contact.company && ` • ${contact.company}`}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      
      {/* Summary */}
      <div className="bg-blue-500/20 p-4 rounded-lg">
        <div className="text-blue-400 font-medium mb-2">📊 Resumen de Selección</div>
        <div className="text-white/80 text-sm space-y-1">
          <div>Listas seleccionadas: {data.selectedLists?.length || 0}</div>
          <div>Contactos individuales: {data.selectedContacts?.length || 0}</div>
        </div>
      </div>
    </div>
  )
}

function ContentStep({ data, onChange, templates, loading }: any) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  
  useEffect(() => {
    if (templates.length > 0 && data.templateId) {
      const template = templates.find((t: Template) => t.id === data.templateId.toString())
      setSelectedTemplate(template || null)
    }
  }, [templates, data.templateId])
  
  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template)
    onChange({ ...data, templateId: parseInt(template.id) })
  }
  
  if (loading) {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-white mb-4">Seleccionar Plantilla</h3>
        <div className="text-center py-8">
          <div className="text-white">Cargando plantillas...</div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white mb-4">Seleccionar Plantilla</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        {templates.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-white/60">
            No hay plantillas activas disponibles
          </div>
        ) : (
          templates.map((template: Template) => (
            <div
              key={template.id}
              onClick={() => handleTemplateSelect(template)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedTemplate?.id === template.id
                  ? 'border-accent bg-accent/20'
                  : 'border-white/20 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="text-white font-medium">{template.name}</div>
                <div className={`px-2 py-1 rounded text-xs ${
                  template.status === 'ACTIVE'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {template.status}
                </div>
              </div>
              
              <div className="text-white/60 text-sm mb-3">
                {template.description || 'Sin descripción'}
              </div>
              
              <div className="text-white/80 text-sm">
                <div className="font-medium mb-1">Asunto:</div>
                <div className="text-white/60">{template.subject}</div>
              </div>
              
              <div className="mt-3 flex items-center justify-between text-xs text-white/50">
                <span>Tipo: {template.type}</span>
                <span>{new Date(template.updatedAt).toLocaleDateString('es-ES')}</span>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Selected Template Preview */}
      {selectedTemplate && (
        <div className="bg-green-500/20 p-4 rounded-lg">
          <div className="text-green-400 font-medium mb-2">✓ Plantilla Seleccionada</div>
          <div className="text-white/80 text-sm space-y-1">
            <div><strong>Nombre:</strong> {selectedTemplate.name}</div>
            <div><strong>Asunto:</strong> {selectedTemplate.subject}</div>
            <div><strong>Tipo:</strong> {selectedTemplate.type}</div>
            {selectedTemplate.description && (
              <div><strong>Descripción:</strong> {selectedTemplate.description}</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function SchedulingStep({ data, onChange }: any) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white mb-4">Programación de Envío</h3>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <input
            type="radio"
            id="sendNow"
            checked={data.sendNow}
            onChange={() => onChange({...data, sendNow: true, scheduledAt: ''})}
            className="text-accent focus:ring-accent"
          />
          <label htmlFor="sendNow" className="text-white">
            Enviar ahora
          </label>
        </div>
        
        <div className="flex items-center space-x-3">
          <input
            type="radio"
            id="schedule"
            checked={!data.sendNow}
            onChange={() => onChange({...data, sendNow: false})}
            className="text-accent focus:ring-accent"
          />
          <label htmlFor="schedule" className="text-white">
            Programar para más tarde
          </label>
        </div>
        
        {!data.sendNow && (
          <div className="ml-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/70 text-sm mb-2">
                Fecha
              </label>
              <input
                type="date"
                value={data.scheduledAt.split('T')[0] || ''}
                onChange={(e) => onChange({...data, scheduledAt: e.target.value + 'T09:00:00Z'})}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            
            <div>
              <label className="block text-white/70 text-sm mb-2">
                Hora
              </label>
              <input
                type="time"
                value={data.scheduledAt.split('T')[1]?.split(':').slice(0,2).join(':') || '09:00'}
                onChange={(e) => {
                  const date = data.scheduledAt.split('T')[0] || new Date().toISOString().split('T')[0]
                  onChange({...data, scheduledAt: `${date}T${e.target.value}:00Z`})
                }}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ReviewStep({ data, contacts, contactLists, templates }: any) {
  const selectedTemplate = templates.find((t: Template) => t.id === data.templateId.toString())
  const selectedContactsData = contacts.filter((c: Contact) => data.selectedContacts?.includes(c.id))
  const selectedListsData = contactLists.filter((l: any) => data.selectedLists?.includes(l.id))
  
  const totalRecipients = selectedContactsData.length + 
    selectedListsData.reduce((sum: number, list: any) => sum + (list.contactCount || 0), 0)
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white mb-4">Revisión Final</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <div className="text-white/70 text-sm">Nombre de la Campaña</div>
            <div className="text-white font-medium">{data.name || 'Sin nombre'}</div>
          </div>
          
          <div>
            <div className="text-white/70 text-sm">Asunto</div>
            <div className="text-white font-medium">{data.subject || 'Sin asunto'}</div>
          </div>
          
          <div>
            <div className="text-white/70 text-sm">Descripción</div>
            <div className="text-white font-medium">{data.description || 'Sin descripción'}</div>
          </div>
          
          <div>
            <div className="text-white/70 text-sm">Total de Destinatarios</div>
            <div className="text-white font-medium text-lg">{totalRecipients.toLocaleString()}</div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="text-white/70 text-sm">Plantilla Seleccionada</div>
            <div className="text-white font-medium">
              {selectedTemplate ? selectedTemplate.name : `ID: ${data.templateId}`}
            </div>
          </div>
          
          <div>
            <div className="text-white/70 text-sm">Tipo de Envío</div>
            <div className="text-white font-medium">{data.sendNow ? 'Inmediato' : 'Programado'}</div>
          </div>
          
          <div>
            <div className="text-white/70 text-sm">Programación</div>
            <div className="text-white font-medium">
              {data.sendNow ? 'Enviar ahora' : `Programado para ${data.scheduledAt}`}
            </div>
          </div>
        </div>
      </div>
      
      {/* Recipients Summary */}
      <div className="bg-blue-500/20 p-4 rounded-lg">
        <div className="text-blue-400 font-medium mb-3">📋 Resumen de Destinatarios</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-white/70 text-sm mb-2">Listas Seleccionadas ({selectedListsData.length})</div>
            {selectedListsData.length === 0 ? (
              <div className="text-white/50 text-sm">Ninguna lista seleccionada</div>
            ) : (
              <div className="space-y-1">
                {selectedListsData.map((list: any) => (
                  <div key={list.id} className="text-white/80 text-sm">
                    • {list.name} ({list.contactCount} contactos)
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div>
            <div className="text-white/70 text-sm mb-2">Contactos Individuales ({selectedContactsData.length})</div>
            {selectedContactsData.length === 0 ? (
              <div className="text-white/50 text-sm">Ningún contacto individual</div>
            ) : (
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {selectedContactsData.map((contact: Contact) => (
                  <div key={contact.id} className="text-white/80 text-sm">
                    • {contact.firstName} {contact.lastName} ({contact.email})
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-yellow-500/20 p-4 rounded-lg">
        <div className="text-yellow-400 font-medium mb-2">⚠️ Importante</div>
        <div className="text-white/80 text-sm">
          Revisa cuidadosamente toda la información antes de crear la campaña. 
          Una vez enviada, no podrás modificar el contenido.
        </div>
      </div>
    </div>
  )
}