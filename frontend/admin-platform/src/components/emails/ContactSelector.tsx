'use client';

import { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon,
  UserIcon,
  UsersIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useHttpRequest } from '@/../../api_lib/useHttpRequest';

interface Contact {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
}

interface ContactList {
  id: string;
  name: string;
  contactCount: number;
  description?: string;
}

interface ContactSelectorProps {
  mode: 'single' | 'multiple';
  selectedContacts: Contact[];
  selectedLists: ContactList[];
  onContactsChange: (contacts: Contact[]) => void;
  onListsChange: (lists: ContactList[]) => void;
  selectionType: 'contacts' | 'lists';
  onSelectionTypeChange: (type: 'contacts' | 'lists') => void;
}

export default function ContactSelector({
  mode,
  selectedContacts,
  selectedLists,
  onContactsChange,
  onListsChange,
  selectionType,
  onSelectionTypeChange
}: ContactSelectorProps) {
  const httpRequest = useHttpRequest();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactLists, setContactLists] = useState<ContactList[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadContacts();
    if (mode === 'multiple') {
      loadContactLists();
    }
  }, [mode]);

  const loadContacts = async () => {
    setLoading(true);
    try {
      await httpRequest.getContacts({ page: 0, size: 100 }, (data: any) => {
        console.log('ContactSelector - Contacts response:', data);
        const contacts = Array.isArray(data) ? data : (data.content || []);
        const formattedContacts = contacts.map((contact: any) => ({
          id: contact.id.toString(),
          name: `${contact.firstName} ${contact.lastName}`,
          email: contact.email,
          company: contact.company,
          phone: contact.phone
        }));
        setContacts(formattedContacts);
      });
    } catch (error) {
      console.error('Error loading contacts:', error);
      // Fallback data
      setContacts([
        { id: '1', name: 'Juan Pérez', email: 'juan@empresa.com', company: 'Empresa ABC' },
        { id: '2', name: 'María García', email: 'maria@startup.com', company: 'Startup XYZ' },
        { id: '3', name: 'Carlos López', email: 'carlos@tech.com', company: 'Tech Corp' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadContactLists = async () => {
    try {
      await httpRequest.getContactLists({ page: 0, size: 50 }, (data: any) => {
        const formattedLists = data.content?.map((list: any) => ({
          id: list.id.toString(),
          name: list.name,
          contactCount: list.contactCount || 0,
          description: list.description
        })) || [];
        setContactLists(formattedLists);
      });
    } catch (error) {
      console.error('Error loading contact lists:', error);
      // Fallback data
      setContactLists([
        { id: '1', name: 'Clientes Premium', contactCount: 150, description: 'Clientes con suscripción premium' },
        { id: '2', name: 'Newsletter Suscriptores', contactCount: 1200, description: 'Suscriptores del newsletter' },
        { id: '3', name: 'Leads Calificados', contactCount: 85, description: 'Leads con alta probabilidad de conversión' },
      ]);
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contact.company && contact.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredLists = contactLists.filter(list =>
    list.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (list.description && list.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleContactToggle = (contact: Contact) => {
    if (mode === 'single') {
      onContactsChange([contact]);
    } else {
      const isSelected = selectedContacts.some(c => c.id === contact.id);
      if (isSelected) {
        onContactsChange(selectedContacts.filter(c => c.id !== contact.id));
      } else {
        onContactsChange([...selectedContacts, contact]);
      }
    }
  };

  const handleListToggle = (list: ContactList) => {
    const isSelected = selectedLists.some(l => l.id === list.id);
    if (isSelected) {
      onListsChange(selectedLists.filter(l => l.id !== list.id));
    } else {
      onListsChange([...selectedLists, list]);
    }
  };

  const getTotalRecipients = () => {
    if (selectionType === 'contacts') {
      return selectedContacts.length;
    } else {
      return selectedLists.reduce((total, list) => total + list.contactCount, 0);
    }
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
      {/* Selection Type Toggle (only for multiple mode) */}
      {mode === 'multiple' && (
        <div className="flex space-x-2">
          <button
            onClick={() => onSelectionTypeChange('contacts')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectionType === 'contacts'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <UserIcon className="h-4 w-4 inline mr-2" />
            Contactos Individuales
          </button>
          <button
            onClick={() => onSelectionTypeChange('lists')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectionType === 'lists'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <UsersIcon className="h-4 w-4 inline mr-2" />
            Por Lista
          </button>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder={`Buscar ${selectionType === 'contacts' ? 'contactos' : 'listas'}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      {/* Recipients Counter */}
      {getTotalRecipients() > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <strong>{getTotalRecipients()}</strong> destinatarios seleccionados
          </div>
        </div>
      )}

      {/* Contact/List Selection */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {selectionType === 'contacts' ? (
          // Contacts List
          filteredContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => handleContactToggle(contact)}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedContacts.some(c => c.id === contact.id)
                  ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-600'
                  : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                {mode === 'multiple' && (
                  <input
                    type="checkbox"
                    checked={selectedContacts.some(c => c.id === contact.id)}
                    onChange={() => handleContactToggle(contact)}
                    className="text-blue-600"
                  />
                )}
                <UserIcon className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {contact.name}
                    </div>
                    {mode === 'single' && selectedContacts.some(c => c.id === contact.id) && (
                      <CheckCircleIcon className="h-4 w-4 text-blue-500" />
                    )}
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
          ))
        ) : (
          // Contact Lists
          filteredLists.map((list) => (
            <div
              key={list.id}
              onClick={() => handleListToggle(list)}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedLists.some(l => l.id === list.id)
                  ? 'bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-600'
                  : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedLists.some(l => l.id === list.id)}
                  onChange={() => handleListToggle(list)}
                  className="text-green-600"
                />
                <UsersIcon className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {list.name}
                    </div>
                    {selectedLists.some(l => l.id === list.id) && (
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {list.contactCount} contactos
                  </div>
                  {list.description && (
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      {list.description}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Empty State */}
      {(selectionType === 'contacts' ? filteredContacts : filteredLists).length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          {selectionType === 'contacts' ? (
            <UserIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
          ) : (
            <UsersIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
          )}
          <p>
            No se encontraron {selectionType === 'contacts' ? 'contactos' : 'listas'}
            {searchTerm && ` que coincidan con "${searchTerm}"`}
          </p>
        </div>
      )}
    </div>
  );
}