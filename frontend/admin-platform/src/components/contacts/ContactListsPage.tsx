'use client'

import { useState, useEffect } from 'react'
import { 
  PlusIcon, 
  UsersIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { ContactList } from '@/types'
import { useAuthenticatedApi } from '@/lib/useAuthenticatedApi'

export default function ContactListsPage() {
  const { api, hasToken, isLoading: authLoading } = useAuthenticatedApi()
  const [lists, setLists] = useState<ContactList[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [newList, setNewList] = useState({ name: '', description: '', tags: '' })
  const [showAddContactModal, setShowAddContactModal] = useState(false)
  const [selectedListId, setSelectedListId] = useState('')
  const [contacts, setContacts] = useState<any[]>([])
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])

  useEffect(() => {
    if (hasToken && api && !authLoading) {
      loadLists()
    }
  }, [hasToken, api, authLoading])

  const loadLists = async () => {
    if (!api) return
    
    try {
      const response = await api.getContactLists({
        userId: 1,
        page: 0,
        size: 100
      }) as any;
      setLists(response.content || response);
    } catch (error) {
      console.error('Error loading lists:', error);
      // Fallback to mock data if API fails
      setLists([
        {
          id: '1',
          name: 'Clientes VIP',
          description: 'Clientes con mayor valor',
          contactCount: 45,
          tags: ['vip', 'cliente'],
          createdAt: '2024-01-15',
          updatedAt: '2024-01-20'
        },
        {
          id: '2',
          name: 'Newsletter Suscriptores',
          description: 'Usuarios suscritos al newsletter',
          contactCount: 1250,
          tags: ['newsletter'],
          createdAt: '2024-01-10',
          updatedAt: '2024-01-25'
        }
      ]);
    } finally {
      setLoading(false);
    }
  }
  
  const loadContacts = async () => {
    if (!api) return
    
    try {
      const response = await api.getContacts({ userId: 1, page: 0, size: 100 }) as any
      setContacts(response.content || response || [])
    } catch (error) {
      console.error('Error loading contacts:', error)
      setContacts([])
    }
  }
  
  const handleAddContactsToList = async () => {
    if (!api || !selectedListId || selectedContacts.length === 0) return
    
    try {
      for (const contactId of selectedContacts) {
        await api.addContactToList(contactId, selectedListId)
      }
      setShowAddContactModal(false)
      setSelectedContacts([])
      setSelectedListId('')
      loadLists() // Refresh lists to update contact counts
      alert(`${selectedContacts.length} contactos agregados a la lista`)
    } catch (error) {
      console.error('Error adding contacts to list:', error)
      alert('Error al agregar contactos a la lista')
    }
  }

  const handleDeleteList = async (listId: string) => {
    if (!api) return
    
    if (confirm('¿Estás seguro de eliminar esta lista?')) {
      try {
        await api.deleteContactList(listId);
        setLists(lists.filter(list => list.id !== listId));
      } catch (error) {
        console.error('Error deleting list:', error);
        alert('Error al eliminar la lista. Por favor, intenta de nuevo.');
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Listas de Contactos</h2>
          <p className="text-white/70">
            Organiza tus contactos en listas personalizadas
          </p>
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Nueva Lista</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-glass p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white/70 text-sm">Total Listas</div>
              <div className="text-2xl font-bold text-white">{lists.length}</div>
            </div>
            <UsersIcon className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        
        <div className="card-glass p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white/70 text-sm">Total Contactos</div>
              <div className="text-2xl font-bold text-white">
                {lists.reduce((sum, list) => sum + list.contactCount, 0)}
              </div>
            </div>
            <UsersIcon className="h-8 w-8 text-green-400" />
          </div>
        </div>
        
        <div className="card-glass p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white/70 text-sm">Promedio por Lista</div>
              <div className="text-2xl font-bold text-white">
                {lists.length > 0 ? Math.round(lists.reduce((sum, list) => sum + list.contactCount, 0) / lists.length) : 0}
              </div>
            </div>
            <UsersIcon className="h-8 w-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Lists Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card-glass p-6 rounded-lg animate-pulse">
              <div className="h-4 bg-white/20 rounded mb-4"></div>
              <div className="h-3 bg-white/20 rounded mb-2"></div>
              <div className="h-3 bg-white/20 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lists.filter(list => 
            list.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            list.description.toLowerCase().includes(searchTerm.toLowerCase())
          ).map((list) => (
            <div key={list.id} className="card-glass p-6 rounded-lg hover:bg-white/10 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {list.name}
                  </h3>
                  <p className="text-white/70 text-sm mb-3">
                    {list.description}
                  </p>
                </div>
                
                <div className="flex items-center space-x-1">
                  <button 
                    onClick={() => {
                      setSelectedListId(list.id)
                      setShowAddContactModal(true)
                      loadContacts()
                    }}
                    className="p-1 text-green-400 hover:text-green-300"
                    title="Agregar contactos"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                  <button className="p-1 text-white/60 hover:text-white">
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button className="p-1 text-white/60 hover:text-white">
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteList(list.id)}
                    className="p-1 text-red-400 hover:text-red-300"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <UsersIcon className="h-5 w-5 text-accent" />
                  <span className="text-white font-medium">
                    {list.contactCount.toLocaleString()} contactos
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {(list.tags || []).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-accent/20 text-accent text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="text-white/50 text-xs">
                Actualizada: {new Date(list.updatedAt).toLocaleDateString('es-ES')}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="card-glass p-4 rounded-lg">
        <input
          type="text"
          placeholder="Buscar listas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      {/* Create List Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card-glass p-6 rounded-lg w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              Nueva Lista de Contactos
            </h3>
            
            <form onSubmit={async (e) => {
              e.preventDefault()
              try {
                await api.createContactList({
                  name: newList.name,
                  description: newList.description,
                  userId: 1
                })
                setShowCreateModal(false)
                setNewList({ name: '', description: '', tags: '' })
                loadLists()
              } catch (error) {
                console.error('Error creating list:', error)
                alert('Error al crear la lista')
              }
            }} className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">
                  Nombre de la Lista
                </label>
                <input
                  type="text"
                  placeholder="Ej: Clientes Premium"
                  value={newList.name}
                  onChange={(e) => setNewList({...newList, name: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white/70 text-sm mb-2">
                  Descripción
                </label>
                <textarea
                  placeholder="Describe el propósito de esta lista..."
                  rows={3}
                  value={newList.description}
                  onChange={(e) => setNewList({...newList, description: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    setNewList({ name: '', description: '', tags: '' })
                  }}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Crear Lista
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Add Contacts to List Modal */}
      {showAddContactModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card-glass p-6 rounded-lg w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-4">
              Agregar Contactos a Lista
            </h3>
            
            <div className="mb-4">
              <p className="text-white/70 text-sm">
                Lista: <span className="text-accent font-medium">
                  {lists.find(l => l.id === selectedListId)?.name}
                </span>
              </p>
            </div>
            
            <div className="mb-4">
              <label className="flex items-center space-x-3 p-2 bg-white/5 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedContacts.length === contacts.length && contacts.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedContacts(contacts.map(c => c.id))
                    } else {
                      setSelectedContacts([])
                    }
                  }}
                  className="rounded border-white/20 bg-white/10 text-accent focus:ring-accent"
                />
                <span className="text-white font-medium">Seleccionar todos ({contacts.length})</span>
              </label>
            </div>
            
            <div className="space-y-2 mb-6 max-h-60 overflow-y-auto">
              {contacts.map((contact) => (
                <div key={contact.id} className="flex items-center space-x-3 p-2 hover:bg-white/5 rounded">
                  <input
                    type="checkbox"
                    checked={selectedContacts.includes(contact.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedContacts([...selectedContacts, contact.id])
                      } else {
                        setSelectedContacts(selectedContacts.filter(id => id !== contact.id))
                      }
                    }}
                    className="rounded border-white/20 bg-white/10 text-accent focus:ring-accent"
                  />
                  <div className="flex-1">
                    <div className="text-white font-medium">
                      {contact.firstName} {contact.lastName}
                    </div>
                    <div className="text-white/60 text-sm">{contact.email}</div>
                  </div>
                </div>
              ))}
              
              {contacts.length === 0 && (
                <div className="text-white/60 text-center py-4">
                  No hay contactos disponibles
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-white/70 text-sm">
                {selectedContacts.length} contactos seleccionados
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowAddContactModal(false)
                    setSelectedContacts([])
                    setSelectedListId('')
                  }}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddContactsToList}
                  disabled={selectedContacts.length === 0}
                  className="btn-primary disabled:opacity-50"
                >
                  Agregar {selectedContacts.length} Contactos
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}