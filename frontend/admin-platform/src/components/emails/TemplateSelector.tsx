'use client';

import { useState, useEffect } from 'react';
import { 
  DocumentTextIcon,
  EyeIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useHttpRequest } from '@/../../api_lib/useHttpRequest';

interface Template {
  id: string;
  name: string;
  subject: string;
  content: string;
  description?: string;
  status: string;
}

interface TemplateSelectorProps {
  selectedTemplate: Template | null;
  onTemplateSelect: (template: Template) => void;
  contactData?: any;
}

export default function TemplateSelector({ 
  selectedTemplate, 
  onTemplateSelect, 
  contactData 
}: TemplateSelectorProps) {
  const httpRequest = useHttpRequest();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [previewContent, setPreviewContent] = useState('');

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      await httpRequest.getTemplates({ status: 'ACTIVE' }, (data: any) => {
        console.log('TemplateSelector - Templates response:', data);
        const templates = Array.isArray(data) ? data : (data.content || []);
        const formattedTemplates = templates.map((template: any) => ({
          id: template.id.toString(),
          name: template.name,
          subject: template.subject,
          content: template.htmlContent,
          description: template.description,
          status: template.status
        }));
        setTemplates(formattedTemplates);
      });
    } catch (error) {
      console.error('Error loading templates:', error);
      // Fallback templates
      setTemplates([
        {
          id: '1',
          name: 'Bienvenida',
          subject: '¡Bienvenido {{nombre}} a {{empresa}}!',
          content: '<h1>¡Hola {{nombre}}!</h1><p>Bienvenido a nuestra plataforma.</p>',
          description: 'Plantilla de bienvenida para nuevos usuarios',
          status: 'ACTIVE'
        },
        {
          id: '2',
          name: 'Newsletter',
          subject: 'Newsletter Mensual - {{empresa}}',
          content: '<h1>Newsletter</h1><p>Hola {{nombre}}, aquí tienes las novedades del mes.</p>',
          description: 'Plantilla para newsletter mensual',
          status: 'ACTIVE'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async (template: Template) => {
    setPreviewTemplate(template);
    
    if (contactData) {
      try {
        await httpRequest.previewTemplate(template.id, contactData, (preview: any) => {
          setPreviewContent(preview.htmlContent || template.content);
        });
      } catch (error) {
        console.error('Error previewing template:', error);
        setPreviewContent(template.content);
      }
    } else {
      setPreviewContent(template.content);
    }
  };

  const handleSelect = (template: Template) => {
    onTemplateSelect(template);
    setPreviewTemplate(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`p-4 rounded-lg border transition-all cursor-pointer ${
              selectedTemplate?.id === template.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
            onClick={() => handleSelect(template)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <DocumentTextIcon className="h-5 w-5 text-gray-400 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {template.name}
                    </h4>
                    {selectedTemplate?.id === template.id && (
                      <CheckCircleIcon className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {template.subject}
                  </p>
                  {template.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {template.description}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePreview(template);
                }}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <EyeIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {templates.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <DocumentTextIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No hay plantillas activas disponibles</p>
        </div>
      )}

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Vista Previa: {previewTemplate.name}
                </h3>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                <strong>Asunto:</strong> {previewTemplate.subject}
              </p>
            </div>
            <div className="p-6 overflow-y-auto max-h-96">
              <div 
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: previewContent }}
              />
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cerrar
              </button>
              <button
                onClick={() => handleSelect(previewTemplate)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Usar esta plantilla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}