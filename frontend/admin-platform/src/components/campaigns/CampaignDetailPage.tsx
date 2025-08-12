'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  EyeIcon,
  ChartBarIcon,
  UsersIcon,
  EnvelopeIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'
import { Campaign } from '@/types'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface CampaignDetailPageProps {
  campaignId: string
}

export default function CampaignDetailPage({ campaignId }: CampaignDetailPageProps) {
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCampaign()
  }, [campaignId])

  const loadCampaign = async () => {
    try {
      // Simular carga de campaña
      await new Promise(resolve => setTimeout(resolve, 1000))
      setCampaign({
        id: campaignId,
        name: 'Newsletter Enero 2024',
        subject: 'Novedades del mes de enero',
        status: 'sent',
        templateId: 'template-1',
        contactListIds: ['list-1', 'list-2'],
        sentAt: '2024-01-25T10:00:00Z',
        stats: {
          sent: 1250,
          delivered: 1200,
          opened: 480,
          clicked: 120,
          bounced: 50
        },
        createdAt: '2024-01-20T09:00:00Z',
        updatedAt: '2024-01-25T10:00:00Z'
      })
    } catch (error) {
      console.error('Error loading campaign:', error)
    } finally {
      setLoading(false)
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

  if (!campaign) {
    return (
      <div className="text-center py-12">
        <div className="text-white text-xl">Campaña no encontrada</div>
      </div>
    )
  }

  const getStatusBadge = (status: Campaign['status']) => {
    const statusConfig = {
      draft: { color: 'bg-gray-500/20 text-gray-400', text: 'Borrador' },
      scheduled: { color: 'bg-blue-500/20 text-blue-400', text: 'Programada' },
      sending: { color: 'bg-yellow-500/20 text-yellow-400', text: 'Enviando' },
      sent: { color: 'bg-green-500/20 text-green-400', text: 'Enviada' },
      paused: { color: 'bg-orange-500/20 text-orange-400', text: 'Pausada' }
    }
    
    const config = statusConfig[status] || statusConfig.draft
    return (
      <span className={`px-3 py-1 rounded-full text-sm ${config.color}`}>
        {config.text}
      </span>
    )
  }

  const chartData = [
    { name: 'Enviados', value: campaign.stats.sent, color: '#3B82F6' },
    { name: 'Entregados', value: campaign.stats.delivered, color: '#10B981' },
    { name: 'Abiertos', value: campaign.stats.opened, color: '#8B5CF6' },
    { name: 'Clics', value: campaign.stats.clicked, color: '#F59E0B' },
    { name: 'Rebotes', value: campaign.stats.bounced, color: '#EF4444' }
  ]

  const pieData = [
    { name: 'Abiertos', value: campaign.stats.opened, color: '#8B5CF6' },
    { name: 'No Abiertos', value: campaign.stats.delivered - campaign.stats.opened, color: '#6B7280' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/campaigns"
            className="p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/10"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          
          <div>
            <h2 className="text-2xl font-bold text-white">{campaign.name}</h2>
            <p className="text-white/70">{campaign.subject}</p>
          </div>
          
          {getStatusBadge(campaign.status)}
        </div>
        
        <div className="flex items-center space-x-3">
          {campaign.status === 'draft' && (
            <Link
              href={`/dashboard/campaigns/${campaign.id}/edit`}
              className="btn-secondary flex items-center space-x-2"
            >
              <PencilIcon className="h-4 w-4" />
              <span>Editar</span>
            </Link>
          )}
          
          <button className="btn-secondary text-red-400 hover:bg-red-500/20">
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="card-glass p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white/70 text-sm">Enviados</div>
              <div className="text-2xl font-bold text-white">{campaign.stats.sent.toLocaleString()}</div>
            </div>
            <EnvelopeIcon className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        
        <div className="card-glass p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white/70 text-sm">Entregados</div>
              <div className="text-2xl font-bold text-white">{campaign.stats.delivered.toLocaleString()}</div>
              <div className="text-xs text-green-400">
                {campaign.stats.sent > 0 ? Math.round((campaign.stats.delivered / campaign.stats.sent) * 100) : 0}%
              </div>
            </div>
            <ChartBarIcon className="h-8 w-8 text-green-400" />
          </div>
        </div>
        
        <div className="card-glass p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white/70 text-sm">Abiertos</div>
              <div className="text-2xl font-bold text-white">{campaign.stats.opened.toLocaleString()}</div>
              <div className="text-xs text-purple-400">
                {campaign.stats.sent > 0 ? Math.round((campaign.stats.opened / campaign.stats.sent) * 100) : 0}%
              </div>
            </div>
            <EyeIcon className="h-8 w-8 text-purple-400" />
          </div>
        </div>
        
        <div className="card-glass p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white/70 text-sm">Clics</div>
              <div className="text-2xl font-bold text-white">{campaign.stats.clicked.toLocaleString()}</div>
              <div className="text-xs text-yellow-400">
                {campaign.stats.sent > 0 ? Math.round((campaign.stats.clicked / campaign.stats.sent) * 100) : 0}%
              </div>
            </div>
            <UsersIcon className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
        
        <div className="card-glass p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white/70 text-sm">Rebotes</div>
              <div className="text-2xl font-bold text-white">{campaign.stats.bounced.toLocaleString()}</div>
              <div className="text-xs text-red-400">
                {campaign.stats.sent > 0 ? Math.round((campaign.stats.bounced / campaign.stats.sent) * 100) : 0}%
              </div>
            </div>
            <ChartBarIcon className="h-8 w-8 text-red-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <div className="card-glass p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">
            Rendimiento de la Campaña
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#FFFFFF" />
                <YAxis stroke="#FFFFFF" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: '#FFFFFF'
                  }}
                />
                <Bar dataKey="value" fill="#FFD700" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Open Rate Pie Chart */}
        <div className="card-glass p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">
            Tasa de Apertura
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: '#FFFFFF'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-white/80 text-sm">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Campaign Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign Info */}
        <div className="card-glass p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">
            Información de la Campaña
          </h3>
          
          <div className="space-y-4">
            <div>
              <div className="text-white/70 text-sm">Fecha de Creación</div>
              <div className="text-white">
                {new Date(campaign.createdAt).toLocaleDateString('es-ES')}
              </div>
            </div>
            
            <div>
              <div className="text-white/70 text-sm">Fecha de Envío</div>
              <div className="text-white">
                {campaign.sentAt 
                  ? new Date(campaign.sentAt).toLocaleDateString('es-ES')
                  : 'No enviada'
                }
              </div>
            </div>
            
            <div>
              <div className="text-white/70 text-sm">Plantilla</div>
              <div className="text-white">{campaign.templateId}</div>
            </div>
            
            <div>
              <div className="text-white/70 text-sm">Listas de Contactos</div>
              <div className="text-white">{campaign.contactListIds.length} listas</div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="card-glass p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">
            Métricas de Rendimiento
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-white/70">Tasa de Entrega</span>
              <span className="text-green-400 font-medium">
                {campaign.stats.sent > 0 ? Math.round((campaign.stats.delivered / campaign.stats.sent) * 100) : 0}%
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-white/70">Tasa de Apertura</span>
              <span className="text-purple-400 font-medium">
                {campaign.stats.sent > 0 ? Math.round((campaign.stats.opened / campaign.stats.sent) * 100) : 0}%
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-white/70">Tasa de Clic</span>
              <span className="text-yellow-400 font-medium">
                {campaign.stats.sent > 0 ? Math.round((campaign.stats.clicked / campaign.stats.sent) * 100) : 0}%
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-white/70">Tasa de Rebote</span>
              <span className="text-red-400 font-medium">
                {campaign.stats.sent > 0 ? Math.round((campaign.stats.bounced / campaign.stats.sent) * 100) : 0}%
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-white/70">CTR (Click-through Rate)</span>
              <span className="text-blue-400 font-medium">
                {campaign.stats.opened > 0 ? Math.round((campaign.stats.clicked / campaign.stats.opened) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="card-glass p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">
            Acciones
          </h3>
          
          <div className="space-y-3">
            <button className="w-full btn-secondary flex items-center justify-center space-x-2">
              <EyeIcon className="h-4 w-4" />
              <span>Vista Previa</span>
            </button>
            
            <button className="w-full btn-secondary flex items-center justify-center space-x-2">
              <ChartBarIcon className="h-4 w-4" />
              <span>Exportar Reporte</span>
            </button>
            
            <button className="w-full btn-secondary flex items-center justify-center space-x-2">
              <UsersIcon className="h-4 w-4" />
              <span>Ver Destinatarios</span>
            </button>
            
            {campaign.status === 'sent' && (
              <button className="w-full btn-primary flex items-center justify-center space-x-2">
                <EnvelopeIcon className="h-4 w-4" />
                <span>Duplicar Campaña</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}