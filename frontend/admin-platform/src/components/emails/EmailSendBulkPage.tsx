'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  UsersIcon,
  DocumentTextIcon,
  EyeIcon,
  PaperAirplaneIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useHttpRequest } from '@/../../api_lib/useHttpRequest';

interface Contact {
  id: string;
  name: string;
  email: string;
  company?: string;
}

interface ContactList {
  id: string;
  name: string;
  contactCount: number;
}

interface Template {
  id: string;
  name: string;
  subject: string;
  content: string;
}

export default function EmailSendBulkPage() {
  const httpRequest = useHttpRequest();
  
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      case 'info':
        toast(message, { icon: '📧' });
        break;
    }
  };
  const [selectionType, setSelectionType] = useState<'contacts' | 'lists' | 'segments'>('contacts');
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [selectedLists, setSelectedLists] = useState<ContactList[]>([]);
  const [useTemplate, setUseTemplate] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactLists, setContactLists] = useState<ContactList[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadContacts();
    loadContactLists();
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
        { id: '4', name: 'Ana Martínez', email: 'ana@digital.com', company: 'Digital Inc' },
        { id: '5', name: 'Luis Rodríguez', email: 'luis@innovation.com', company: 'Innovation Lab' },
      ]);
    }
  };

  const loadContactLists = async () => {
    try {
      await httpRequest.getContactLists({ page: 0, size: 50 }, (data: any) => {
        const formattedLists = data.content?.map((list: any) => ({
          id: list.id.toString(),
          name: list.name,
          contactCount: list.contactCount || 0
        })) || [];
        setContactLists(formattedLists);
      });
    } catch (error) {
      console.error('Error loading contact lists:', error);
      setContactLists([
        { id: '1', name: 'Clientes Premium', contactCount: 150 },
        { id: '2', name: 'Newsletter Suscriptores', contactCount: 1200 },
        { id: '3', name: 'Leads Calificados', contactCount: 85 },
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
          name: 'Newsletter Mensual', 
          subject: 'Newsletter - Novedades',
          content: '<h1>Newsletter</h1><p>Hola {{nombre}}, aquí tienes las novedades del mes.</p>'
        },
        { 
          id: '2', 
          name: 'Promoción Especial', 
          subject: 'Oferta Especial para {{nombre}}',
          content: '<h1>¡Oferta Especial!</h1><p>Hola {{nombre}}, tenemos una oferta especial para ti.</p>'
        },
      ]);
    }
  };

  const getTotalRecipients = () => {
    if (selectionType === 'contacts') {
      return selectedContacts.length;
    } else if (selectionType === 'lists') {
      return selectedLists.reduce((total, list) => total + list.contactCount, 0);
    }
    return 0;
  };

  const handleContactToggle = (contact: Contact) => {
    setSelectedContacts(prev => {
      const exists = prev.find(c => c.id === contact.id);
      if (exists) {
        return prev.filter(c => c.id !== contact.id);
      } else {
        return [...prev, contact];
      }
    });
  };

  const handleListToggle = (list: ContactList) => {
    setSelectedLists(prev => {
      const exists = prev.find(l => l.id === list.id);
      if (exists) {
        return prev.filter(l => l.id !== list.id);
      } else {
        return [...prev, list];
      }
    });
  };

  const handleTemplateSelect = async (template: Template) => {
    setSelectedTemplate(template);
    setSubject(template.subject);
    setContent(template.content);
    
    // Preview with sample data
    try {
      const sampleData = {
        nombre: 'Usuario Demo',
        email: 'demo@ejemplo.com',
        empresa: 'Empresa Demo'
      };
      
      await httpRequest.previewTemplate(template.id, sampleData, (preview: any) => {
        if (preview.subject) setSubject(preview.subject);
        if (preview.htmlContent) setContent(preview.htmlContent);
      });
    } catch (error) {
      console.error('Error previewing template:', error);
    }
  };

  const handleSend = () => {
    const totalRecipients = getTotalRecipients();
    if (totalRecipients === 0 || !subject || !content) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }
    
    if (totalRecipients > 100) {
      setShowConfirmation(true);
    } else {
      confirmSend();
    }
  };

  const confirmSend = async () => {
    setSending(true);
    try {
      // Prepare recipients list
      let recipients: any[] = [];
      
      if (selectionType === 'contacts') {
        recipients = selectedContacts.map(contact => ({
          email: contact.email,
          recipientId: parseInt(contact.id),
          personalizations: {
            name: contact.name,
            email: contact.email,
            company: contact.company || ''
          }
        }));
      } else if (selectionType === 'lists') {
        // For lists, we need to get all contacts from selected lists first
        // For now, create mock recipients from list data
        for (const list of selectedLists) {
          try {
            await httpRequest.getContactsByListId(list.id, {}, (contacts: any[]) => {
              const listRecipients = contacts.map(contact => ({
                email: contact.email,
                recipientId: contact.id,
                personalizations: {
                  name: `${contact.firstName} ${contact.lastName}`,
                  email: contact.email,
                  company: contact.company || ''
                }
              }));
              recipients.push(...listRecipients);
            });
          } catch (error) {
            console.error(`Error loading contacts from list ${list.name}:`, error);
          }
        }
      }

      // Show initial toast
      showToast(`Se enviará correo a ${recipients.length} destinatarios`, 'info');

      // Create bulk email request
      const bulkEmailData = {
        recipients,
        from: 'noreply@correos-masivos.com',
        fromName: 'Correos Masivos',
        subject,
        htmlContent: content,
        textContent: content.replace(/<[^>]*>/g, ''), // Strip HTML for text version
        globalPersonalizations: {},
        trackOpens: true,
        trackClicks: true,
        campaignId: null // Will be created automatically
      };

      await httpRequest.sendBulkEmails(bulkEmailData, (response: any) => {
        const { totalEmails, successfulEmails, failedEmails } = response;
        showToast(`Envío finalizado: ${successfulEmails} exitosos, ${failedEmails} fallidos`, 'success');
        
        // Reset form
        setSelectedContacts([]);
        setSelectedLists([]);
        setSubject('');
        setContent('');
        setSelectedTemplate(null);
        setUseTemplate(false);
        setShowConfirmation(false);
      });
    } catch (error) {
      console.error('Error sending bulk email:', error);
      showToast('Error al enviar el lote de correos', 'error');
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
            Envío Masivo
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Envía correos a múltiples contactos simultáneamente
          </p>
        </div>
        
        {getTotalRecipients() > 0 && (
          <div className="bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-lg">
            <span className="text-blue-700 dark:text-blue-300 font-medium">
              {getTotalRecipients()} destinatarios seleccionados
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel Izquierdo - Selección de Destinatarios */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tipo de Selección */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              1. Seleccionar Destinatarios
            </h3>
            
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setSelectionType('contacts')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectionType === 'contacts'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Contactos Individuales
              </button>
              <button
                onClick={() => setSelectionType('lists')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectionType === 'lists'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Por Lista
              </button>
              <button
                onClick={() => setSelectionType('segments')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectionType === 'segments'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Por Segmento
              </button>
            </div>

            {/* Selección de Contactos */}
            {selectionType === 'contacts' && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <input
                      type="checkbox"
                      checked={selectedContacts.some(c => c.id === contact.id)}
                      onChange={() => handleContactToggle(contact)}
                      className="text-blue-600"
                    />
                    <div className="flex-1">
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
                ))}
              </div>
            )}

            {/* Selección de Listas */}
            {selectionType === 'lists' && (
              <div className="space-y-2">
                {contactLists.map((list) => (
                  <div
                    key={list.id}
                    className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <input
                      type="checkbox"
                      checked={selectedLists.some(l => l.id === list.id)}
                      onChange={() => handleListToggle(list)}
                      className="text-blue-600"
                    />
                    <UsersIcon className="h-5 w-5 text-gray-400" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {list.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {list.contactCount} contactos
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Selección por Segmento */}
            {selectionType === 'segments' && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <UsersIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Funcionalidad de segmentos próximamente</p>
              </div>
            )}
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
                <span className="text-gray-900 dark:text-white">Correo normal</span>
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
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Usa {'{'}nombre{'}'}, {'{'}email{'}'}, {'{'}empresa{'}'} para personalizar
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Panel Derecho - Preview y Acciones */}
        <div className="space-y-6">
          {/* Resumen */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Resumen del Envío
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Destinatarios:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {getTotalRecipients()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tipo:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {useTemplate ? 'Con plantilla' : 'Correo normal'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Estado:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  Borrador
                </span>
              </div>
            </div>

            {getTotalRecipients() > 100 && (
              <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-600 rounded-lg">
                <div className="flex items-center space-x-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-sm text-yellow-700 dark:text-yellow-300">
                    Envío masivo grande ({getTotalRecipients()} destinatarios)
                  </span>
                </div>
              </div>
            )}
          </div>

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
                    <strong>Asunto:</strong> {subject || 'Sin asunto'}
                  </div>
                </div>
                <div 
                  className="prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            )}
          </div>

          {/* Botón de Envío */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <button
              onClick={handleSend}
              disabled={getTotalRecipients() === 0 || !subject || !content || sending}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
              <span>{sending ? 'Enviando...' : `Enviar a ${getTotalRecipients()} destinatarios`}</span>
            </button>
            
            {(getTotalRecipients() === 0 || !subject || !content) && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                Completa todos los campos para enviar
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Confirmación */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <ExclamationTriangleIcon className="h-8 w-8 text-yellow-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Confirmar Envío Masivo
              </h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Estás a punto de enviar un correo a <strong>{getTotalRecipients()} destinatarios</strong>. 
              Esta acción no se puede deshacer. ¿Deseas continuar?
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={confirmSend}
                disabled={sending}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg"
              >
                {sending ? 'Enviando...' : 'Confirmar Envío'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}