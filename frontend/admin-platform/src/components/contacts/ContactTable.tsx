'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  EyeIcon, 
  PencilIcon, 
  TrashIcon,
  ChevronUpDownIcon 
} from '@heroicons/react/24/outline'
import { Contact } from '@/types'

interface ContactTableProps {
  contacts: Contact[]
  loading: boolean
  selectedContacts: string[]
  onSelectionChange: (selected: string[]) => void
  onContactUpdate: () => void
  onEditContact: (contact: Contact) => void
}

export default function ContactTable({
  contacts,
  loading,
  selectedContacts,
  onSelectionChange,
  onContactUpdate,
  onEditContact
}: ContactTableProps) {
  const [sortField, setSortField] = useState<keyof Contact>('firstName')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const handleSort = (field: keyof Contact) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(contacts.map(c => c.id))
    } else {
      onSelectionChange([])
    }
  }

  const handleSelectContact = (contactId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedContacts, contactId])
    } else {
      onSelectionChange(selectedContacts.filter(id => id !== contactId))
    }
  }

  const sortedContacts = [...contacts].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }
    
    return 0
  })

  const paginatedContacts = sortedContacts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(contacts.length / itemsPerPage)

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="text-white">Cargando contactos...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="p-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedContacts.length === contacts.length && contacts.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-white/20 bg-white/10 text-accent focus:ring-accent"
                />
              </th>
              
              <th className="p-4 text-left">
                <button
                  onClick={() => handleSort('firstName')}
                  className="flex items-center space-x-1 text-white hover:text-accent"
                >
                  <span>Nombre</span>
                  <ChevronUpDownIcon className="h-4 w-4" />
                </button>
              </th>
              
              <th className="p-4 text-left">
                <button
                  onClick={() => handleSort('email')}
                  className="flex items-center space-x-1 text-white hover:text-accent"
                >
                  <span>Email</span>
                  <ChevronUpDownIcon className="h-4 w-4" />
                </button>
              </th>
              
              <th className="p-4 text-left text-white">Teléfono</th>
              <th className="p-4 text-left text-white">Empresa</th>
              <th className="p-4 text-left text-white">Tags</th>
              <th className="p-4 text-left text-white">Estado</th>
              <th className="p-4 text-left text-white">Acciones</th>
            </tr>
          </thead>
          
          <tbody>
            {paginatedContacts.map((contact) => (
              <tr key={contact.id} className="border-t border-white/10 hover:bg-white/5">
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedContacts.includes(contact.id)}
                    onChange={(e) => handleSelectContact(contact.id, e.target.checked)}
                    className="rounded border-white/20 bg-white/10 text-accent focus:ring-accent"
                  />
                </td>
                
                <td className="p-4">
                  <div className="text-white font-medium">
                    {contact.firstName} {contact.lastName}
                  </div>
                </td>
                
                <td className="p-4">
                  <div className="text-white/80">{contact.email}</div>
                </td>
                
                <td className="p-4">
                  <div className="text-white/80">{contact.phone || '-'}</div>
                </td>
                
                <td className="p-4">
                  <div className="text-white/80">{contact.company || '-'}</div>
                </td>
                
                <td className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {contact.tags?.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-accent/20 text-accent text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {contact.tags && contact.tags.length > 2 && (
                      <span className="text-white/60 text-xs">
                        +{contact.tags.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    contact.unsubscribed 
                      ? 'bg-red-500/20 text-red-400' 
                      : 'bg-green-500/20 text-green-400'
                  }`}>
                    {contact.unsubscribed ? 'Inactivo' : 'Activo'}
                  </span>
                </td>
                
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/dashboard/contacts/${contact.id}`}
                      className="p-1 text-white/60 hover:text-white"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Link>
                    
                    <button 
                      onClick={() => onEditContact(contact)}
                      className="p-1 text-white/60 hover:text-white"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    
                    <button className="p-1 text-red-400 hover:text-red-300">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t border-white/10">
          <div className="text-white/70 text-sm">
            Mostrando {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, contacts.length)} de {contacts.length} contactos
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-white/10 text-white rounded disabled:opacity-50"
            >
              Anterior
            </button>
            
            <span className="text-white">
              {currentPage} de {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-white/10 text-white rounded disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  )
}