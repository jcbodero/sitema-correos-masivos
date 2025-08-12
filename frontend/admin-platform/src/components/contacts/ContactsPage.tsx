'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  PlusIcon, 
  CloudArrowUpIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  TrashIcon,
  PencilIcon
} from '@heroicons/react/24/outline'
import { useAuthenticatedApi } from '@/lib/useAuthenticatedApi'
import { Contact } from '@/types'
import ContactTable from './ContactTable'
import ContactFilters from './ContactFilters'
import ContactForm from './ContactForm'

export default function ContactsPage() {
  const { api, hasToken, isLoading: authLoading } = useAuthenticatedApi()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)

  useEffect(() => {
    if (hasToken && api && !authLoading) {
      loadContacts()
    }
  }, [hasToken, api, authLoading])

  const loadContacts = async () => {
    if (!api) return
    
    try {
      const response = await api.getContacts({
        userId: '1', // TODO: Get from auth context
        page: 0,
        size: 100,
        sortBy: 'createdAt',
        sortDir: 'desc'
      });
      setContacts(response.content || response);
    } catch (error) {
      console.error('Error loading contacts:', error);
      // Fallback to mock data if API fails
      const mockContacts = [
        {
          id: '1',
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perez@example.com',
          phone: '+34 123 456 789',
          company: 'Empresa ABC',
          tags: ['cliente', 'vip'],
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-25T15:45:00Z',
          unsubscribed: false
        },
        {
          id: '2',
          firstName: 'María',
          lastName: 'García',
          email: 'maria.garcia@example.com',
          phone: '+34 987 654 321',
          company: 'Empresa XYZ',
          tags: ['prospecto'],
          createdAt: '2024-01-20T14:20:00Z',
          updatedAt: '2024-01-22T09:15:00Z',
          unsubscribed: false
        }
      ];
      setContacts(mockContacts);
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteSelected = async () => {
    if (selectedContacts.length === 0 || !api) return
    
    if (confirm(`¿Eliminar ${selectedContacts.length} contacto(s)?`)) {
      try {
        // Implementar eliminación masiva
        await Promise.all(selectedContacts.map(id => api.deleteContact(id)))
        setContacts(contacts.filter(c => !selectedContacts.includes(c.id)))
        setSelectedContacts([])
      } catch (error) {
        console.error('Error deleting contacts:', error)
      }
    }
  }

  const handleSaveContact = async (contactData: Partial<Contact>) => {
    if (!api) return
    
    try {
      if (editingContact) {
        // Actualizar contacto existente
        const updatedContact = await api.updateContact(editingContact.id, {
          ...contactData,
          userId: '1' // TODO: Get from auth context
        });
        setContacts(contacts.map(c => 
          c.id === editingContact.id ? updatedContact : c
        ));
      } else {
        // Crear nuevo contacto
        const newContact = await api.createContact({
          ...contactData,
          userId: '1', // TODO: Get from auth context
          email: contactData.email!,
          firstName: contactData.firstName!,
          lastName: contactData.lastName!
        });
        setContacts([newContact, ...contacts]);
      }
      
      setShowContactForm(false);
      setEditingContact(null);
    } catch (error) {
      console.error('Error saving contact:', error);
      alert('Error al guardar el contacto. Por favor, intenta de nuevo.');
    }
  }

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact)
    setShowContactForm(true)
  }

  const handleNewContact = () => {
    setEditingContact(null)
    setShowContactForm(true)
  }

  const filteredContacts = contacts.filter(contact =>
    contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Contactos</h2>
          <p className="text-white/70">
            Gestiona tu base de datos de contactos
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Link
            href="/dashboard/contacts/import"
            className="btn-secondary flex items-center space-x-2"
          >
            <CloudArrowUpIcon className="h-4 w-4" />
            <span>Importar</span>
          </Link>
          
          <button 
            onClick={handleNewContact}
            className="btn-primary flex items-center space-x-2"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Nuevo Contacto</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card-glass p-4 rounded-lg">
          <div className="text-white/70 text-sm">Total Contactos</div>
          <div className="text-2xl font-bold text-white">{contacts.length}</div>
        </div>
        <div className="card-glass p-4 rounded-lg">
          <div className="text-white/70 text-sm">Activos</div>
          <div className="text-2xl font-bold text-green-400">
            {contacts.filter(c => !c.unsubscribed).length}
          </div>
        </div>
        <div className="card-glass p-4 rounded-lg">
          <div className="text-white/70 text-sm">Listas</div>
          <div className="text-2xl font-bold text-blue-400">5</div>
        </div>
        <div className="card-glass p-4 rounded-lg">
          <div className="text-white/70 text-sm">Segmentos</div>
          <div className="text-2xl font-bold text-purple-400">3</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card-glass p-4 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
              <input
                type="text"
                placeholder="Buscar contactos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center space-x-2"
            >
              <FunnelIcon className="h-4 w-4" />
              <span>Filtros</span>
            </button>
          </div>

          {selectedContacts.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-white/70 text-sm">
                {selectedContacts.length} seleccionados
              </span>
              <button
                onClick={handleDeleteSelected}
                className="btn-secondary text-red-400 hover:bg-red-500/20"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {showFilters && (
          <ContactFilters onFiltersChange={(filters) => console.log(filters)} />
        )}
      </div>

      {/* Contacts Table */}
      <div className="card-glass rounded-lg overflow-hidden">
        <ContactTable
          contacts={filteredContacts}
          loading={loading}
          selectedContacts={selectedContacts}
          onSelectionChange={setSelectedContacts}
          onContactUpdate={loadContacts}
          onEditContact={handleEditContact}
        />
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <ContactForm
          contact={editingContact}
          onSave={handleSaveContact}
          onCancel={() => {
            setShowContactForm(false)
            setEditingContact(null)
          }}
        />
      )}
    </div>
  )
}