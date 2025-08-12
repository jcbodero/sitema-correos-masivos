'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useUser } from '@auth0/nextjs-auth0/client'
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  CheckIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline'
import { Template, TemplateStats } from '@/types'
import { useAuthenticatedApi } from '@/lib/useAuthenticatedApi'

export default function TemplatesPage() {
  const { user } = useUser()
  const { api, hasToken, isLoading: authLoading } = useAuthenticatedApi()
  const [templates, setTemplates] = useState<Template[]>([])
  const [templateStats, setTemplateStats] = useState<TemplateStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(0)

  useEffect(() => {
    if (hasToken && api && !authLoading && user) {
      loadTemplates()
      loadTemplateStats()
    }
  }, [hasToken, api, authLoading, user, currentPage, searchTerm, statusFilter])

  const loadTemplates = async () => {
    if (!api || !user) return
    
    try {
      setLoading(true)
      const params = {
        userId: '1', // TODO: Get from user context
        page: currentPage,
        size: 20,
        sortBy: 'createdAt',
        sortDir: 'desc',
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter })
      }
      
      const response = await api.getTemplates(params)
      setTemplates(response.content || [])
    } catch (error) {
      console.error('Error loading templates:', error)
      setTemplates([])
    } finally {
      setLoading(false)
    }
  }

  const loadTemplateStats = async () => {
    if (!api || !user) return
    
    try {
      const stats = await api.getTemplateStats('1') // TODO: Get from user context
      setTemplateStats(stats)
    } catch (error) {
      console.error('Error loading template stats:', error)
    }
  }

  const handleDuplicate = async (templateId: string, templateName: string) => {
    if (!api) return
    
    try {
      const newName = `${templateName} - Copia`
      await api.duplicateTemplate(templateId, newName)
      await loadTemplates()
    } catch (error) {
      console.error('Error duplicating template:', error)
    }
  }

  const handleDelete = async (templateId: string) => {
    if (!api || !confirm('¿Estás seguro de eliminar esta plantilla?')) return
    
    try {
      await api.deleteTemplate(templateId)
      await loadTemplates()
    } catch (error) {
      console.error('Error deleting template:', error)
    }
  }

  const handleStatusChange = async (templateId: string, action: 'activate' | 'archive' | 'deactivate') => {
    if (!api) return
    
    try {
      switch (action) {
        case 'activate':
          await api.activateTemplate(templateId)
          break
        case 'archive':
          await api.archiveTemplate(templateId)
          break
        case 'deactivate':
          await api.deactivateTemplate(templateId)
          break
      }
      
      await loadTemplates()
    } catch (error) {
      console.error('Error updating template status:', error)
    }
  }

  const getStatusBadge = (status: Template['status']) => {
    const statusConfig = {
      DRAFT: { color: 'bg-gray-500/20 text-gray-400', text: 'Borrador' },
      ACTIVE: { color: 'bg-green-500/20 text-green-400', text: 'Activa' },
      ARCHIVED: { color: 'bg-orange-500/20 text-orange-400', text: 'Archivada' }
    }
    
    const config = statusConfig[status] || statusConfig.DRAFT
    return (
      <span className={`px-2 py-1 rounded text-xs ${config.color}`}>
        {config.text}
      </span>
    )
  }

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || template.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Plantillas</h2>
          <p className="text-white/70">
            Gestiona tus plantillas de correo electrónico
          </p>
        </div>
        
        <Link
          href="/dashboard/templates/new"
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Nueva Plantilla</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card-glass p-6 rounded-lg">
          <div className="text-white/70 text-sm">Total Plantillas</div>
          <div className="text-2xl font-bold text-white">{templateStats?.totalTemplates || templates.length}</div>
        </div>
        <div className="card-glass p-6 rounded-lg">
          <div className="text-white/70 text-sm">Activas</div>
          <div className="text-2xl font-bold text-green-400">
            {templateStats?.activeTemplates || templates.filter(t => t.status === 'ACTIVE').length}
          </div>
        </div>
        <div className="card-glass p-6 rounded-lg">
          <div className="text-white/70 text-sm">Borradores</div>
          <div className="text-2xl font-bold text-gray-400">
            {templateStats?.draftTemplates || templates.filter(t => t.status === 'DRAFT').length}
          </div>
        </div>
        <div className="card-glass p-6 rounded-lg">
          <div className="text-white/70 text-sm">Archivadas</div>
          <div className="text-2xl font-bold text-orange-400">
            {templateStats?.archivedTemplates || templates.filter(t => t.status === 'ARCHIVED').length}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card-glass p-4 rounded-lg">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
            <input
              type="text"
              placeholder="Buscar plantillas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="">Todos los estados</option>
            <option value="ACTIVE">Activa</option>
            <option value="DRAFT">Borrador</option>
            <option value="ARCHIVED">Archivada</option>
          </select>
        </div>
      </div>

      {/* Templates Grid */}
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
          {filteredTemplates.map((template) => (
            <div key={template.id} className="card-glass p-6 rounded-lg hover:bg-white/10 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {template.name}
                  </h3>
                  <p className="text-white/70 text-sm mb-3">
                    {template.subject}
                  </p>
                  {getStatusBadge(template.status)}
                </div>
              </div>
              
              {template.description && (
                <div className="mb-4">
                  <div className="text-white/70 text-xs mb-1">Descripción:</div>
                  <div className="text-white/80 text-sm">{template.description}</div>
                </div>
              )}
              
              <div className="mb-4">
                <div className="text-white/70 text-xs mb-2">Tipo:</div>
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                  {template.type}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-white/50 text-xs">
                  {new Date(template.updatedAt).toLocaleDateString('es-ES')}
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Status Actions */}
                  {template.status === 'DRAFT' && (
                    <button
                      onClick={() => handleStatusChange(template.id, 'activate')}
                      className="p-1 text-green-400 hover:text-green-300"
                      title="Activar"
                    >
                      <CheckIcon className="h-4 w-4" />
                    </button>
                  )}
                  
                  {template.status === 'ACTIVE' && (
                    <button
                      onClick={() => handleStatusChange(template.id, 'archive')}
                      className="p-1 text-orange-400 hover:text-orange-300"
                      title="Archivar"
                    >
                      <ArchiveBoxIcon className="h-4 w-4" />
                    </button>
                  )}
                  
                  {/* Standard Actions */}
                  <Link
                    href={`/dashboard/templates/${template.id}`}
                    className="p-1 text-white/60 hover:text-white"
                    title="Ver detalle"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </Link>
                  
                  <Link
                    href={`/dashboard/templates/${template.id}/edit`}
                    className="p-1 text-white/60 hover:text-white"
                    title="Editar"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Link>
                  
                  <button
                    onClick={() => handleDuplicate(template.id, template.name)}
                    className="p-1 text-white/60 hover:text-white"
                    title="Duplicar"
                  >
                    <DocumentDuplicateIcon className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="p-1 text-red-400 hover:text-red-300"
                    title="Eliminar"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}