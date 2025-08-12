'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import { Campaign, CampaignStats } from '@/types'
import { useAuthenticatedApi } from '@/lib/useAuthenticatedApi'
import { useUser } from '@auth0/nextjs-auth0/client'

export default function CampaignsPage() {
  const { user } = useUser()
  const { api, hasToken, isLoading: authLoading } = useAuthenticatedApi()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [campaignStats, setCampaignStats] = useState<CampaignStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    if (hasToken && api && !authLoading && user) {
      loadCampaigns()
      loadCampaignStats()
    }
  }, [hasToken, api, authLoading, user, currentPage, searchTerm, statusFilter])

  const loadCampaigns = async () => {
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
      
      const response = await api.getCampaigns(params)
      setCampaigns(response.content || [])
      setTotalPages(response.totalPages || 0)
    } catch (error) {
      console.error('Error loading campaigns:', error)
      // Fallback to empty array on error
      setCampaigns([])
    } finally {
      setLoading(false)
    }
  }

  const loadCampaignStats = async () => {
    if (!api || !user) return
    
    try {
      const stats = await api.getCampaignStats('1') // TODO: Get from user context
      setCampaignStats(stats)
    } catch (error) {
      console.error('Error loading campaign stats:', error)
    }
  }

  const handleStatusChange = async (campaignId: string, action: 'start' | 'pause' | 'resume' | 'cancel' | 'schedule') => {
    if (!api) return
    
    try {
      switch (action) {
        case 'start':
          await api.startCampaign(campaignId)
          break
        case 'pause':
          await api.pauseCampaign(campaignId)
          break
        case 'resume':
          await api.resumeCampaign(campaignId)
          break
        case 'cancel':
          await api.cancelCampaign(campaignId)
          break
        case 'schedule':
          // This would need a date picker - for now just schedule for tomorrow
          const tomorrow = new Date()
          tomorrow.setDate(tomorrow.getDate() + 1)
          await api.scheduleCampaign(campaignId, tomorrow.toISOString())
          break
      }
      
      // Reload campaigns to get updated status
      await loadCampaigns()
    } catch (error) {
      console.error('Error updating campaign status:', error)
    }
  }

  const handleDeleteCampaign = async (campaignId: string) => {
    if (!api || !confirm('¿Estás seguro de eliminar esta campaña?')) return
    
    try {
      await api.deleteCampaign(campaignId)
      await loadCampaigns() // Reload campaigns after deletion
    } catch (error) {
      console.error('Error deleting campaign:', error)
    }
  }

  const handleDuplicateCampaign = async (campaignId: string, originalName: string) => {
    if (!api) return
    
    try {
      const newName = `${originalName} - Copia`
      await api.duplicateCampaign(campaignId, newName)
      await loadCampaigns() // Reload campaigns after duplication
    } catch (error) {
      console.error('Error duplicating campaign:', error)
    }
  }

  const getStatusBadge = (status: Campaign['status']) => {
    const statusConfig = {
      DRAFT: { color: 'bg-gray-500/20 text-gray-400', text: 'Borrador' },
      SCHEDULED: { color: 'bg-blue-500/20 text-blue-400', text: 'Programada' },
      SENDING: { color: 'bg-yellow-500/20 text-yellow-400', text: 'Enviando' },
      SENT: { color: 'bg-green-500/20 text-green-400', text: 'Enviada' },
      PAUSED: { color: 'bg-orange-500/20 text-orange-400', text: 'Pausada' },
      CANCELLED: { color: 'bg-red-500/20 text-red-400', text: 'Cancelada' }
    }
    
    const config = statusConfig[status] || statusConfig.DRAFT
    return (
      <span className={`px-2 py-1 rounded text-xs ${config.color}`}>
        {config.text}
      </span>
    )
  }

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || campaign.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalStats = campaigns.reduce((acc, campaign) => ({
    sent: acc.sent + (campaign.stats?.sent || 0),
    delivered: acc.delivered + (campaign.stats?.delivered || 0),
    opened: acc.opened + (campaign.stats?.opened || 0),
    clicked: acc.clicked + (campaign.stats?.clicked || 0)
  }), { sent: 0, delivered: 0, opened: 0, clicked: 0 })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Campañas</h2>
          <p className="text-white/70">
            Gestiona tus campañas de correo masivo
          </p>
        </div>
        
        <Link
          href="/dashboard/campaigns/new"
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Nueva Campaña</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card-glass p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white/70 text-sm">Total Campañas</div>
              <div className="text-2xl font-bold text-white">{campaignStats?.totalCampaigns || campaigns.length}</div>
            </div>
            <ChartBarIcon className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        
        <div className="card-glass p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white/70 text-sm">Borradores</div>
              <div className="text-2xl font-bold text-white">{campaignStats?.draftCampaigns || 0}</div>
            </div>
            <ChartBarIcon className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        
        <div className="card-glass p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white/70 text-sm">Programadas</div>
              <div className="text-2xl font-bold text-white">{campaignStats?.scheduledCampaigns || 0}</div>
            </div>
            <ChartBarIcon className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        
        <div className="card-glass p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white/70 text-sm">Enviadas</div>
              <div className="text-2xl font-bold text-white">{campaignStats?.sentCampaigns || 0}</div>
            </div>
            <ChartBarIcon className="h-8 w-8 text-green-400" />
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
              placeholder="Buscar campañas..."
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
            <option value="DRAFT">Borrador</option>
            <option value="SCHEDULED">Programada</option>
            <option value="SENDING">Enviando</option>
            <option value="SENT">Enviada</option>
            <option value="PAUSED">Pausada</option>
            <option value="CANCELLED">Cancelada</option>
          </select>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="card-glass rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="text-white">Cargando campañas...</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="p-4 text-left text-white">Campaña</th>
                  <th className="p-4 text-left text-white">Estado</th>
                  <th className="p-4 text-left text-white">Enviados</th>
                  <th className="p-4 text-left text-white">Abiertos</th>
                  <th className="p-4 text-left text-white">Clics</th>
                  <th className="p-4 text-left text-white">Fecha</th>
                  <th className="p-4 text-left text-white">Acciones</th>
                </tr>
              </thead>
              
              <tbody>
                {filteredCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="border-t border-white/10 hover:bg-white/5">
                    <td className="p-4">
                      <div>
                        <div className="text-white font-medium">{campaign.name}</div>
                        <div className="text-white/70 text-sm">{campaign.subject}</div>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      {getStatusBadge(campaign.status)}
                    </td>
                    
                    <td className="p-4">
                      <div className="text-white">{campaign.stats?.sent?.toLocaleString() || '0'}</div>
                    </td>
                    
                    <td className="p-4">
                      <div className="text-white">
                        {campaign.stats?.opened?.toLocaleString() || '0'}
                        {campaign.stats?.sent && campaign.stats.sent > 0 && (
                          <span className="text-white/60 text-sm ml-1">
                            ({Math.round((campaign.stats.opened / campaign.stats.sent) * 100)}%)
                          </span>
                        )}
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="text-white">
                        {campaign.stats?.clicked?.toLocaleString() || '0'}
                        {campaign.stats?.sent && campaign.stats.sent > 0 && (
                          <span className="text-white/60 text-sm ml-1">
                            ({Math.round((campaign.stats.clicked / campaign.stats.sent) * 100)}%)
                          </span>
                        )}
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="text-white/80 text-sm">
                        {campaign.sentAt 
                          ? new Date(campaign.sentAt).toLocaleDateString('es-ES')
                          : campaign.scheduledAt
                          ? new Date(campaign.scheduledAt).toLocaleDateString('es-ES')
                          : new Date(campaign.updatedAt).toLocaleDateString('es-ES')
                        }
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        {/* Status Actions */}
                        {campaign.status === 'DRAFT' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(campaign.id, 'schedule')}
                              className="p-1 text-blue-400 hover:text-blue-300"
                              title="Programar"
                            >
                              <PlayIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleStatusChange(campaign.id, 'start')}
                              className="p-1 text-green-400 hover:text-green-300"
                              title="Enviar ahora"
                            >
                              <PlayIcon className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        
                        {campaign.status === 'SENDING' && (
                          <button
                            onClick={() => handleStatusChange(campaign.id, 'pause')}
                            className="p-1 text-yellow-400 hover:text-yellow-300"
                            title="Pausar"
                          >
                            <PauseIcon className="h-4 w-4" />
                          </button>
                        )}
                        
                        {campaign.status === 'PAUSED' && (
                          <button
                            onClick={() => handleStatusChange(campaign.id, 'resume')}
                            className="p-1 text-green-400 hover:text-green-300"
                            title="Reanudar"
                          >
                            <PlayIcon className="h-4 w-4" />
                          </button>
                        )}
                        
                        {(campaign.status === 'SCHEDULED' || campaign.status === 'SENDING' || campaign.status === 'PAUSED') && (
                          <button
                            onClick={() => handleStatusChange(campaign.id, 'cancel')}
                            className="p-1 text-red-400 hover:text-red-300"
                            title="Cancelar"
                          >
                            <StopIcon className="h-4 w-4" />
                          </button>
                        )}
                        
                        {/* Standard Actions */}
                        <Link
                          href={`/dashboard/campaigns/${campaign.id}`}
                          className="p-1 text-white/60 hover:text-white"
                          title="Ver detalle"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Link>
                        
                        {campaign.status === 'DRAFT' && (
                          <Link
                            href={`/dashboard/campaigns/${campaign.id}/edit`}
                            className="p-1 text-white/60 hover:text-white"
                            title="Editar"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Link>
                        )}
                        
                        <button
                          onClick={() => handleDuplicateCampaign(campaign.id, campaign.name)}
                          className="p-1 text-white/60 hover:text-white"
                          title="Duplicar"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDeleteCampaign(campaign.id)}
                          className="p-1 text-red-400 hover:text-red-300"
                          title="Eliminar"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}