'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@auth0/nextjs-auth0/client'
import { 
  EyeIcon, 
  CodeBracketIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { useAuthenticatedApi } from '@/lib/useAuthenticatedApi'
import { CreateTemplateRequest, UpdateTemplateRequest } from '@/types'

interface TemplateEditorProps {
  templateId?: string
}

export default function TemplateEditor({ templateId }: TemplateEditorProps) {
  const router = useRouter()
  const { user } = useUser()
  const { api, hasToken, isLoading: authLoading } = useAuthenticatedApi()
  const [template, setTemplate] = useState({
    name: '',
    description: '',
    subject: '',
    htmlContent: '',
    textContent: '',
    type: 'EMAIL' as 'EMAIL' | 'SMS',
    status: 'DRAFT' as 'DRAFT' | 'ACTIVE' | 'ARCHIVED',
    variables: {} as Record<string, any>
  })
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'editor' | 'preview'>('editor')
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [newVariable, setNewVariable] = useState('')

  useEffect(() => {
    if (templateId && hasToken && api && !authLoading) {
      loadTemplate()
    } else if (!templateId) {
      // Plantilla base para nuevas plantillas
      setTemplate({
        name: '',
        description: '',
        subject: '',
        htmlContent: `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{subject}}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; }
        .header { text-align: center; margin-bottom: 30px; }
        .content { line-height: 1.6; color: #333; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
        .button { display: inline-block; padding: 12px 24px; background-color: #6F1EAB; color: white; text-decoration: none; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>¡Hola {{firstName}}!</h1>
        </div>
        <div class="content">
            <p>Este es el contenido de tu plantilla de correo electrónico.</p>
            <p>Puedes personalizar este contenido y usar variables como {{firstName}}, {{company}}, etc.</p>
            <p style="text-align: center;">
                <a href="{{actionUrl}}" class="button">Botón de Acción</a>
            </p>
        </div>
        <div class="footer">
            <p>Si no deseas recibir más correos, puedes <a href="{{unsubscribeUrl}}">darte de baja aquí</a>.</p>
        </div>
    </div>
</body>
</html>`,
        textContent: '',
        type: 'EMAIL',
        status: 'DRAFT',
        variables: { theme: 'default', category: 'general' }
      })
    }
  }, [templateId, hasToken, api, authLoading])

  const loadTemplate = async () => {
    if (!api || !templateId) return
    
    try {
      setLoading(true)
      const templateData = await api.getTemplate(templateId)
      setTemplate({
        name: templateData.name,
        description: templateData.description || '',
        subject: templateData.subject,
        htmlContent: templateData.htmlContent,
        textContent: templateData.textContent || '',
        type: templateData.type,
        status: templateData.status,
        variables: templateData.variables || {}
      })
    } catch (error) {
      console.error('Error loading template:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!api || !user) return
    
    try {
      setLoading(true)
      
      if (templateId) {
        const updateRequest: UpdateTemplateRequest = {
          name: template.name,
          description: template.description,
          subject: template.subject,
          htmlContent: template.htmlContent,
          textContent: template.textContent,
          type: template.type,
          status: template.status,
          variables: template.variables
        }
        await api.updateTemplate(templateId, updateRequest)
      } else {
        const createRequest: CreateTemplateRequest = {
          name: template.name,
          description: template.description,
          subject: template.subject,
          htmlContent: template.htmlContent,
          textContent: template.textContent,
          userId: 1, // TODO: Get from user context
          type: template.type,
          status: template.status,
          variables: template.variables
        }
        await api.createTemplate(createRequest)
      }
      
      router.push('/dashboard/templates')
    } catch (error) {
      console.error('Error saving template:', error)
    } finally {
      setLoading(false)
    }
  }

  const addVariable = () => {
    if (newVariable && !Object.keys(template.variables).includes(newVariable)) {
      setTemplate({
        ...template,
        variables: { ...template.variables, [newVariable]: '' }
      })
      setNewVariable('')
    }
  }

  const removeVariable = (variable: string) => {
    const newVariables = { ...template.variables }
    delete newVariables[variable]
    setTemplate({
      ...template,
      variables: newVariables
    })
  }

  const insertVariable = (variable: string) => {
    const textarea = document.getElementById('htmlContent') as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const text = textarea.value
      const before = text.substring(0, start)
      const after = text.substring(end, text.length)
      const newText = before + `{{${variable}}}` + after
      
      setTemplate({
        ...template,
        htmlContent: newText
      })
      
      // Restaurar posición del cursor
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + variable.length + 4, start + variable.length + 4)
      }, 0)
    }
  }

  const renderPreview = () => {
    const sampleData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      company: 'Empresa ABC',
      month: 'Febrero',
      actionUrl: '#',
      unsubscribeUrl: '#'
    }

    let previewContent = template.htmlContent
    Object.keys(template.variables).forEach(variable => {
      const value = sampleData[variable as keyof typeof sampleData] || `[${variable}]`
      previewContent = previewContent.replace(new RegExp(`{{${variable}}}`, 'g'), value)
    })

    return (
      <div className={`mx-auto bg-white ${
        previewDevice === 'desktop' ? 'max-w-2xl' : 'max-w-sm'
      }`}>
        <div dangerouslySetInnerHTML={{ __html: previewContent }} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            {templateId ? 'Editar Plantilla' : 'Nueva Plantilla'}
          </h2>
          <p className="text-white/70">
            Crea y personaliza plantillas de correo electrónico
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-white/10 rounded-lg p-1">
            <button
              onClick={() => setViewMode('editor')}
              className={`px-3 py-2 rounded text-sm transition-colors ${
                viewMode === 'editor'
                  ? 'bg-accent text-primary font-medium'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <CodeBracketIcon className="h-4 w-4 inline mr-1" />
              Editor
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-2 rounded text-sm transition-colors ${
                viewMode === 'preview'
                  ? 'bg-accent text-primary font-medium'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <EyeIcon className="h-4 w-4 inline mr-1" />
              Preview
            </button>
          </div>
          
          {viewMode === 'preview' && (
            <div className="flex items-center bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`p-2 rounded transition-colors ${
                  previewDevice === 'desktop'
                    ? 'bg-accent text-primary'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <ComputerDesktopIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`p-2 rounded transition-colors ${
                  previewDevice === 'mobile'
                    ? 'bg-accent text-primary'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <DevicePhoneMobileIcon className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {viewMode === 'editor' ? (
            <div className="card-glass p-6 rounded-lg space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">
                    Nombre de la Plantilla *
                  </label>
                  <input
                    type="text"
                    value={template.name}
                    onChange={(e) => setTemplate({...template, name: e.target.value})}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Ej: Newsletter Mensual"
                  />
                </div>
                
                <div>
                  <label className="block text-white/70 text-sm mb-2">
                    Estado
                  </label>
                  <select
                    value={template.status}
                    onChange={(e) => setTemplate({...template, status: e.target.value as any})}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="DRAFT">Borrador</option>
                    <option value="ACTIVE">Activa</option>
                    <option value="ARCHIVED">Archivada</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-white/70 text-sm mb-2">
                  Descripción
                </label>
                <input
                  type="text"
                  value={template.description}
                  onChange={(e) => setTemplate({...template, description: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Descripción de la plantilla"
                />
              </div>
              
              <div>
                <label className="block text-white/70 text-sm mb-2">
                  Asunto del Email
                </label>
                <input
                  type="text"
                  value={template.subject}
                  onChange={(e) => setTemplate({...template, subject: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Ej: Newsletter {{month}} - {{company}}"
                />
              </div>

              {/* HTML Content */}
              <div>
                <label className="block text-white/70 text-sm mb-2">
                  Contenido HTML
                </label>
                <textarea
                  id="htmlContent"
                  value={template.htmlContent}
                  onChange={(e) => setTemplate({...template, htmlContent: e.target.value})}
                  rows={20}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent font-mono text-sm"
                  placeholder="Contenido HTML de la plantilla..."
                />
              </div>

              {/* Text Content */}
              <div>
                <label className="block text-white/70 text-sm mb-2">
                  Contenido de Texto (Opcional)
                </label>
                <textarea
                  value={template.textContent}
                  onChange={(e) => setTemplate({...template, textContent: e.target.value})}
                  rows={8}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Versión de texto plano del email..."
                />
              </div>
            </div>
          ) : (
            <div className="card-glass p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4">
                Vista Previa - {previewDevice === 'desktop' ? 'Escritorio' : 'Móvil'}
              </h3>
              <div className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-[600px]">
                {renderPreview()}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Variables */}
          <div className="card-glass p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Variables</h3>
            
            <div className="space-y-3 mb-4">
              {Object.keys(template.variables).map((variable) => (
                <div key={variable} className="flex items-center justify-between bg-white/5 p-2 rounded">
                  <button
                    onClick={() => insertVariable(variable)}
                    className="text-accent hover:text-accent/80 text-sm font-mono"
                  >
                    {`{{${variable}}}`}
                  </button>
                  <button
                    onClick={() => removeVariable(variable)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <input
                type="text"
                value={newVariable}
                onChange={(e) => setNewVariable(e.target.value)}
                placeholder="Nueva variable"
                className="flex-1 px-2 py-1 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-accent text-sm"
                onKeyPress={(e) => e.key === 'Enter' && addVariable()}
              />
              <button
                onClick={addVariable}
                className="p-1 bg-accent text-primary rounded hover:bg-accent/90"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="card-glass p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Acciones</h3>
            
            <div className="space-y-3">
              <button
                onClick={handleSave}
                disabled={loading || !template.name || !template.subject}
                className="w-full btn-primary disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline mr-2"></div>
                    Guardando...
                  </>
                ) : (
                  `${templateId ? 'Actualizar' : 'Guardar'} Plantilla`
                )}
              </button>
              
              <button
                onClick={() => router.push('/dashboard/templates')}
                className="w-full btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </div>

          {/* Template Info */}
          <div className="card-glass p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Información</h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/70">Variables:</span>
                <span className="text-white">{Object.keys(template.variables).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Caracteres:</span>
                <span className="text-white">{template.htmlContent.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Estado:</span>
                <span className="text-white capitalize">{template.status}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}