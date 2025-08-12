'use client';

import { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon,
  DocumentTextIcon,
  EyeIcon,
  PaperAirplaneIcon,
  UserIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { useHttpRequest } from '@/../../api_lib/useHttpRequest';

interface Contact {
  id: string;
  name: string;
  email: string;
  company?: string;
}

interface Template {
  id: string;
  name: string;
  subject: string;
  content: string;
}

export default function EmailSendSinglePage() {
  const httpRequest = useHttpRequest();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [useTemplate, setUseTemplate] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [contactSearch, setContactSearch] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadContacts();
    loadTemplates();
  }, []);

  const loadContacts = async () => {
    try {
      await httpRequest.getContacts({ page: 0, size: 100 }, (data: any) => {
        console.log('Contacts response:', data);
        const contacts = Array.isArray(data) ? data : (data.content || []);
        const formattedContacts = contacts.map((contact: any) => ({
          id: contact.id.toString(),
          name: `${contact.firstName} ${contact.lastName}`,
          email: contact.email,
          company: contact.company
        }));
        setContacts(formattedContacts);
      });
    } catch (error) {
      console.error('Error loading contacts:', error);
      setContacts([
        { id: '1', name: 'Juan Pérez', email: 'juan@empresa.com', company: 'Empresa ABC' },
        { id: '2', name: 'María García', email: 'maria@startup.com', company: 'Startup XYZ' },
        { id: '3', name: 'Carlos López', email: 'carlos@tech.com', company: 'Tech Corp' },
      ]);
    }
  };

  const loadTemplates = async () => {
    try {
      await httpRequest.getTemplates({ status: 'ACTIVE' }, (data: any) => {
        console.log('Templates response:', data);
        const templates = Array.isArray(data) ? data : (data.content || []);
        const formattedTemplates = templates.map((template: any) => ({
          id: template.id.toString(),
          name: template.name,
          subject: template.subject,
          content: template.htmlContent
        }));
        setTemplates(formattedTemplates);
      });
    } catch (error) {
      console.error('Error loading templates:', error);
      setTemplates([
        { 
          id: '1', 
          name: 'Bienvenida', 
          subject: 'Bienvenido {{nombre}}',
          content: '<h1>¡Hola {{nombre}}!</h1><p>Bienvenido a nuestra plataforma.</p>'
        },
        { 
          id: '2', 
          name: 'Newsletter', 
          subject: 'Newsletter Mensual',
          content: '<h1>Newsletter</h1><p>Hola {{nombre}}, aquí tienes las novedades del mes.</p>'
        },
      ]);
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
    contact.email.toLowerCase().includes(contactSearch.toLowerCase())
  );

  const handleTemplateSelect = async (template: Template) => {
    setSelectedTemplate(template);
    setSubject(template.subject);
    setContent(template.content);
    
    // If we have a selected contact, render the template with their data
    if (selectedContact) {
      try {
        const renderData = {
          nombre: selectedContact.name,
          email: selectedContact.email,
          empresa: selectedContact.company || ''
        };
        
        await httpRequest.renderTemplate(template.id, renderData, (rendered: any) => {
          if (rendered.subject) setSubject(rendered.subject);
          if (rendered.htmlContent) setContent(rendered.htmlContent);
        });
      } catch (error) {
        console.error('Error rendering template:', error);
      }
    }
  };

  const renderPreview = () => {
    if (!selectedContact) return content;
    
    return content
      .replace(/{{nombre}}/g, selectedContact.name)
      .replace(/{{name}}/g, selectedContact.name)
      .replace(/{{email}}/g, selectedContact.email)
      .replace(/{{empresa}}/g, selectedContact.company || '')
      .replace(/{{company}}/g, selectedContact.company || '');
  };

  const handleSend = async () => {
    if (!selectedContact || !subject || !content) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }
    
    setSending(true);
    try {
      const emailData = {
        to: selectedContact.email,
        from: 'noreply@correos-masivos.com',
        fromName: 'Correos Masivos',
        subject: subject.replace(/{{nombre}}/g, selectedContact.name)
                       .replace(/{{name}}/g, selectedContact.name)
                       .replace(/{{email}}/g, selectedContact.email)
                       .replace(/{{empresa}}/g, selectedContact.company || '')
                       .replace(/{{company}}/g, selectedContact.company || ''),
        htmlContent: renderPreview(),
        textContent: content.replace(/<[^>]*>/g, ''), // Strip HTML for text version
        personalizations: {
          name: selectedContact.name,
          email: selectedContact.email,
          company: selectedContact.company || ''
        },
        recipientId: parseInt(selectedContact.id),
        campaignId: null // Single emails don't belong to campaigns
      };

      await httpRequest.sendEmail(emailData, (response: any) => {
        alert(`Correo enviado exitosamente a ${selectedContact.email}`);
        // Reset form
        setSelectedContact(null);
        setSubject('');
        setContent('');
        setSelectedTemplate(null);
        setUseTemplate(false);
      });
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Error al enviar el correo. Por favor intenta nuevamente.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Envío Individual
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Envía un correo personalizado a un contacto específico
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel Izquierdo - Configuración */}
        <div className="space-y-6">
          {/* Selector de Contacto */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              1. Seleccionar Contacto
            </h3>
            
            <div className="relative mb-4">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar contacto por nombre o email..."
                value={contactSearch}
                onChange={(e) => setContactSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedContact?.id === contact.id
                      ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-600'
                      : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {contact.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {contact.email}
                      </div>
                      {contact.company && (
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                          {contact.company}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tipo de Correo */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              2. Tipo de Correo
            </h3>
            
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="emailType"
                  checked={!useTemplate}
                  onChange={() => setUseTemplate(false)}
                  className="text-blue-600"
                />
                <span className="text-gray-900 dark:text-white">Correo normal (editor libre)</span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="emailType"
                  checked={useTemplate}
                  onChange={() => setUseTemplate(true)}
                  className="text-blue-600"
                />
                <span className="text-gray-900 dark:text-white">Usar plantilla</span>
              </label>
            </div>

            {useTemplate && (
              <div className="mt-4 space-y-2">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedTemplate?.id === template.id
                        ? 'bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-600'
                        : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {template.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {template.subject}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contenido del Correo */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              3. Contenido del Correo
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Asunto
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Ingresa el asunto del correo"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contenido
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Escribe el contenido del correo..."
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                {useTemplate && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Usa {'{'}nombre{'}'}, {'{'}email{'}'}, {'{'}empresa{'}'} para personalizar
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Panel Derecho - Preview y Acciones */}
        <div className="space-y-6">
          {/* Preview */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Vista Previa
              </h3>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center space-x-2 px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50"
              >
                <EyeIcon className="h-4 w-4" />
                <span>{showPreview ? 'Ocultar' : 'Mostrar'}</span>
              </button>
            </div>

            {showPreview && (
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-700">
                <div className="border-b border-gray-200 dark:border-gray-600 pb-3 mb-3">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Para:</strong> {selectedContact?.email || 'Selecciona un contacto'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Asunto:</strong> {subject || 'Sin asunto'}
                  </div>
                </div>
                <div 
                  className="prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderPreview() }}
                />
              </div>
            )}
          </div>

          {/* Información del Contacto */}
          {selectedContact && (
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Destinatario
              </h3>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <UserIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {selectedContact.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedContact.email}
                  </div>
                  {selectedContact.company && (
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      {selectedContact.company}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Botón de Envío */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <button
              onClick={handleSend}
              disabled={!selectedContact || !subject || !content || sending}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
              <span>{sending ? 'Enviando...' : 'Enviar Correo'}</span>
            </button>
            
            {(!selectedContact || !subject || !content) && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                Completa todos los campos para enviar
              </p>
            )}
            {sending && (
              <p className="text-xs text-blue-500 dark:text-blue-400 mt-2 text-center">
                Enviando correo...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}