'use client'

import { useState } from 'react'
import { XMarkIcon, DevicePhoneMobileIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline'

interface CampaignPreviewProps {
  campaign: any
  onClose: () => void
}

export default function CampaignPreview({ campaign, onClose }: CampaignPreviewProps) {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop')

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Vista Previa: {campaign.name}
            </h3>
            <p className="text-gray-600 text-sm">{campaign.subject}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('desktop')}
                className={`p-2 rounded ${
                  viewMode === 'desktop' 
                    ? 'bg-primary text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ComputerDesktopIcon className="h-5 w-5" />
              </button>
              
              <button
                onClick={() => setViewMode('mobile')}
                className={`p-2 rounded ${
                  viewMode === 'mobile' 
                    ? 'bg-primary text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <DevicePhoneMobileIcon className="h-5 w-5" />
              </button>
            </div>
            
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="p-4 bg-gray-50 overflow-y-auto" style={{ height: 'calc(90vh - 80px)' }}>
          <div className={`mx-auto bg-white shadow-lg ${
            viewMode === 'desktop' ? 'max-w-2xl' : 'max-w-sm'
          }`}>
            {/* Email Header */}
            <div className="border-b p-4">
              <div className="text-sm text-gray-600 mb-2">
                De: {campaign.fromName || 'Remitente'} &lt;{campaign.fromEmail || 'email@ejemplo.com'}&gt;
              </div>
              <div className="text-sm text-gray-600 mb-2">
                Para: usuario@ejemplo.com
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {campaign.subject || 'Asunto del email'}
              </div>
            </div>

            {/* Email Body */}
            <div className="p-6">
              {campaign.content ? (
                <div dangerouslySetInnerHTML={{ __html: campaign.content }} />
              ) : (
                <div className="space-y-4">
                  <h1 className="text-2xl font-bold text-gray-900">
                    ¡Hola {{firstName}}!
                  </h1>
                  
                  <p className="text-gray-700">
                    Este es el contenido de tu campaña de correo. Aquí puedes incluir 
                    información relevante para tus suscriptores.
                  </p>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold text-blue-900 mb-2">
                      Contenido Destacado
                    </h2>
                    <p className="text-blue-800">
                      Información importante que quieres resaltar en tu newsletter.
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <a 
                      href="#" 
                      className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90"
                    >
                      Botón de Acción
                    </a>
                  </div>
                  
                  <div className="border-t pt-4 text-sm text-gray-600">
                    <p>
                      Si no deseas recibir más correos, puedes{' '}
                      <a href="#" className="text-blue-600 hover:underline">
                        darte de baja aquí
                      </a>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            Vista previa generada el {new Date().toLocaleDateString('es-ES')}
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 text-gray-600 hover:text-gray-900">
              Enviar Prueba
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}