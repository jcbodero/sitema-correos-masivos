'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  DocumentDuplicateIcon,
  CodeBracketIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline'
import { Template } from '@/types'

interface TemplateDetailPageProps {
  templateId: string
}

export default function TemplateDetailPage({ templateId }: TemplateDetailPageProps) {
  const [template, setTemplate] = useState<Template | null>(null)
  const [loading, setLoading] = useState(true)
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [showCode, setShowCode] = useState(false)

  useEffect(() => {
    loadTemplate()
  }, [templateId])

  const loadTemplate = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setTemplate({
        id: templateId,
        name: 'Newsletter Básico',
        subject: 'Newsletter {{month}} - {{company}}',
        htmlContent: `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Newsletter</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; }
        .header { text-align: center; margin-bottom: 30px; color: #6F1EAB; }
        .content { line-height: 1.6; color: #333; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
        .button { display: inline-block; padding: 12px 24px; background-color: #6F1EAB; color: white; text-decoration: none; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>¡Hola {{firstName}}!</h1>
            <p>Newsletter de {{month}} - {{company}}</p>
        </div>
        <div class="content">
            <h2>Novedades del Mes</h2>
            <p>Querido {{firstName}}, te presentamos las novedades más importantes de {{company}} durante el mes de {{month}}.</p>
            
            <h3>Destacados</h3>
            <ul>
                <li>Nueva funcionalidad en nuestra plataforma</li>
                <li>Mejoras en el rendimiento del sistema</li>
                <li>Próximos eventos y webinars</li>
            </ul>
            
            <p style="text-align: center; margin: 30px 0;">
                <a href="{{actionUrl}}" class="button">Ver Más Detalles</a>
            </p>
            
            <p>¡Gracias por ser parte de nuestra comunidad!</p>
        </div>
        <div class="footer">
            <p>Si no deseas recibir más correos, puedes <a href="{{unsubscribeUrl}}">darte de baja aquí</a>.</p>
            <p>© 2024 {{company}}. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>`,
        textContent: 'Hola {{firstName}}\n\nNewsletter de {{month}} - {{company}}\n\nNovedades del Mes...',
        variables: ['firstName', 'month', 'company', 'actionUrl', 'unsubscribeUrl'],
        status: 'active',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-20T15:30:00Z'
      })
    } catch (error) {
      console.error('Error loading template:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: Template['status']) => {
    const statusConfig = {
      draft: { color: 'bg-gray-500/20 text-gray-400', text: 'Borrador' },
      active: { color: 'bg-green-500/20 text-green-400', text: 'Activa' },
      archived: { color: 'bg-orange-500/20 text-orange-400', text: 'Archivada' }
    }
    
    const config = statusConfig[status] || statusConfig.draft
    return (
      <span className={`px-3 py-1 rounded-full text-sm ${config.color}`}>
        {config.text}
      </span>
    )
  }

  const renderPreview = () => {
    if (!template) return null

    const sampleData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      company: 'Empresa ABC',
      month: 'Febrero',
      actionUrl: '#',
      unsubscribeUrl: '#'
    }

    let previewContent = template.htmlContent
    template.variables.forEach(variable => {
      const value = sampleData[variable as keyof typeof sampleData] || `[${variable}]`
      previewContent = previewContent.replace(new RegExp(`{{${variable}}}`, 'g'), value)
    })

    return (
      <div className={`mx-auto bg-white shadow-lg ${
        previewDevice === 'desktop' ? 'max-w-2xl' : 'max-w-sm'
      }`}>
        <div dangerouslySetInnerHTML={{ __html: previewContent }} />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="h-8 w-8 bg-white/20 rounded animate-pulse"></div>
          <div className="h-8 w-48 bg-white/20 rounded animate-pulse"></div>
        </div>
        <div className="card-glass p-6 rounded-lg">
          <div className="h-6 bg-white/20 rounded mb-4 animate-pulse"></div>
          <div className="h-4 bg-white/20 rounded mb-2 animate-pulse"></div>
          <div className="h-4 bg-white/20 rounded w-2/3 animate-pulse"></div>
        </div>
      </div>
    )
  }

  if (!template) {
    return (
      <div className="text-center py-12">
        <div className="text-white text-xl">Plantilla no encontrada</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/templates"
            className="p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/10"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          
          <div>
            <h2 className="text-2xl font-bold text-white">{template.name}</h2>
            <p className="text-white/70">{template.subject}</p>
          </div>
          
          {getStatusBadge(template.status)}
        </div>
        
        <div className="flex items-center space-x-3">
          <Link
            href={`/dashboard/templates/${template.id}/edit`}
            className="btn-secondary flex items-center space-x-2"
          >
            <PencilIcon className="h-4 w-4" />
            <span>Editar</span>
          </Link>
          
          <button className="btn-secondary text-red-400 hover:bg-red-500/20">
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Template Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-glass p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Información</h3>
          <div className="space-y-3">
            <div>
              <div className="text-white/70 text-sm">Creada</div>
              <div className="text-white">
                {new Date(template.createdAt).toLocaleDateString('es-ES')}
              </div>
            </div>
            <div>
              <div className="text-white/70 text-sm">Última actualización</div>
              <div className="text-white">
                {new Date(template.updatedAt).toLocaleDateString('es-ES')}
              </div>
            </div>
            <div>
              <div className="text-white/70 text-sm">Variables</div>
              <div className="text-white">{template.variables.length}</div>
            </div>
          </div>
        </div>

        <div className="card-glass p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Variables Disponibles</h3>
          <div className="flex flex-wrap gap-2">
            {template.variables.map((variable) => (
              <span
                key={variable}
                className="px-2 py-1 bg-accent/20 text-accent text-xs rounded font-mono"
              >
                {`{{${variable}}}`}
              </span>
            ))}
          </div>
        </div>

        <div className="card-glass p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Acciones</h3>
          <div className="space-y-3">
            <button className="w-full btn-secondary flex items-center justify-center space-x-2">
              <DocumentDuplicateIcon className="h-4 w-4" />
              <span>Duplicar</span>
            </button>
            <button className="w-full btn-secondary flex items-center justify-center space-x-2">
              <EyeIcon className="h-4 w-4" />
              <span>Enviar Prueba</span>
            </button>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="card-glass p-6 rounded-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Vista Previa</h3>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setShowCode(false)}
                className={`px-3 py-2 rounded text-sm transition-colors ${
                  !showCode
                    ? 'bg-accent text-primary font-medium'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <EyeIcon className="h-4 w-4 inline mr-1" />
                Preview
              </button>
              <button
                onClick={() => setShowCode(true)}
                className={`px-3 py-2 rounded text-sm transition-colors ${
                  showCode
                    ? 'bg-accent text-primary font-medium'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <CodeBracketIcon className="h-4 w-4 inline mr-1" />
                Código
              </button>
            </div>
            
            {!showCode && (
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

        <div className="bg-gray-100 p-6 rounded-lg overflow-auto max-h-[600px]">
          {showCode ? (
            <pre className="text-sm text-gray-800 whitespace-pre-wrap">
              <code>{template.htmlContent}</code>
            </pre>
          ) : (
            renderPreview()
          )}
        </div>
      </div>

      {/* Text Version */}
      {template.textContent && (
        <div className="card-glass p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Versión de Texto</h3>
          <div className="bg-gray-100 p-4 rounded-lg">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap">
              {template.textContent}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}