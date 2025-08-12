'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  TagIcon
} from '@heroicons/react/24/outline'
import { Contact } from '@/types'

interface ContactDetailPageProps {
  contactId: string
}

export default function ContactDetailPage({ contactId }: ContactDetailPageProps) {
  const [contact, setContact] = useState<Contact | null>(null)
  const [loading, setLoading] = useState(true)
  const [emailHistory, setEmailHistory] = useState<any[]>([])

  useEffect(() => {
    loadContact()
    loadEmailHistory()
  }, [contactId])

  const loadContact = async () => {
    try {
      // Simular carga de contacto
      await new Promise(resolve => setTimeout(resolve, 1000))
      setContact({
        id: contactId,
        email: 'juan.perez@example.com',
        firstName: 'Juan',
        lastName: 'Pérez',
        phone: '+34 123 456 789',
        company: 'Empresa ABC',
        tags: ['cliente', 'vip', 'premium'],
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-25T15:45:00Z',
        unsubscribed: false,
        notes: 'Cliente muy importante, contactar preferiblemente por las mañanas.',
        address: 'Calle Principal 123, Madrid, España',
        lastActivity: '2024-01-25T15:45:00Z'
      })
    } catch (error) {
      console.error('Error loading contact:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadEmailHistory = async () => {
    try {
      // Simular historial de emails
      setEmailHistory([
        {
          id: '1',
          subject: 'Bienvenido a nuestro newsletter',
          sentAt: '2024-01-20T10:00:00Z',
          status: 'delivered',
          opened: true,
          clicked: false
        },
        {
          id: '2',
          subject: 'Oferta especial para clientes VIP',
          sentAt: '2024-01-18T14:30:00Z',
          status: 'delivered',
          opened: true,
          clicked: true
        },
        {
          id: '3',
          subject: 'Recordatorio de evento',
          sentAt: '2024-01-15T09:15:00Z',
          status: 'delivered',
          opened: false,
          clicked: false
        }
      ])
    } catch (error) {
      console.error('Error loading email history:', error)
    }
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

  if (!contact) {
    return (
      <div className="text-center py-12">
        <div className="text-white text-xl">Contacto no encontrado</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/contacts"
            className="p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/10"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          
          <div>
            <h2 className="text-2xl font-bold text-white">
              {contact.firstName} {contact.lastName}
            </h2>
            <p className="text-white/70">{contact.email}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="btn-secondary flex items-center space-x-2">
            <PencilIcon className="h-4 w-4" />
            <span>Editar</span>
          </button>
          
          <button className="btn-secondary text-red-400 hover:bg-red-500/20">
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="card-glass p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">
              Información de Contacto
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-accent" />
                <div>
                  <div className="text-white/70 text-sm">Email</div>
                  <div className="text-white">{contact.email}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <PhoneIcon className="h-5 w-5 text-accent" />
                <div>
                  <div className="text-white/70 text-sm">Teléfono</div>
                  <div className="text-white">{contact.phone || 'No especificado'}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <BuildingOfficeIcon className="h-5 w-5 text-accent" />
                <div>
                  <div className="text-white/70 text-sm">Empresa</div>
                  <div className="text-white">{contact.company || 'No especificada'}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <CalendarIcon className="h-5 w-5 text-accent" />
                <div>
                  <div className="text-white/70 text-sm">Registrado</div>
                  <div className="text-white">
                    {new Date(contact.createdAt).toLocaleDateString('es-ES')}
                  </div>
                </div>
              </div>
            </div>
            
            {contact.address && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="text-white/70 text-sm mb-1">Dirección</div>
                <div className="text-white">{contact.address}</div>
              </div>
            )}
          </div>

          {/* Email History */}
          <div className="card-glass p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">
              Historial de Emails
            </h3>
            
            <div className="space-y-3">
              {emailHistory.map((email) => (
                <div key={email.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex-1">
                    <div className="text-white font-medium">{email.subject}</div>
                    <div className="text-white/70 text-sm">
                      {new Date(email.sentAt).toLocaleDateString('es-ES')} - {new Date(email.sentAt).toLocaleTimeString('es-ES')}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      email.status === 'delivered' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {email.status === 'delivered' ? 'Entregado' : 'Fallido'}
                    </span>
                    
                    {email.opened && (
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                        Abierto
                      </span>
                    )}
                    
                    {email.clicked && (
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                        Clic
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="card-glass p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Estado</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/70">Suscrito</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  !contact.unsubscribed 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {!contact.unsubscribed ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-white/70">Última actividad</span>
                <span className="text-white text-sm">
                  {contact.lastActivity 
                    ? new Date(contact.lastActivity).toLocaleDateString('es-ES')
                    : 'Nunca'
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="card-glass p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Tags</h3>
              <button className="text-accent hover:text-accent/80">
                <TagIcon className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {contact.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="card-glass p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Notas</h3>
            
            <div className="text-white/80 text-sm">
              {contact.notes || 'Sin notas'}
            </div>
            
            <button className="mt-3 text-accent hover:text-accent/80 text-sm">
              Editar notas
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}