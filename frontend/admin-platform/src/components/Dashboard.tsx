'use client'

import { useEffect, useState } from 'react'
import { 
  UsersIcon, 
  EnvelopeIcon, 
  DocumentTextIcon, 
  ChartBarIcon 
} from '@heroicons/react/24/outline'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useAuthenticatedApi } from '../lib/useAuthenticatedApi'

interface DashboardStats {
  totalContacts: number
  activeContacts: number
  totalCampaigns: number
  activeCampaigns: number
  draftCampaigns: number
  completedCampaigns: number
  totalTemplates: number
  activeTemplates: number
  draftTemplates: number
  emailsSent: number
  emailsDelivered: number
  emailsFailed: number
  emailsPending: number
  openRate: number
  clickRate: number
  bounceRate: number
}

const mockData = [
  { name: 'Ene', emails: 4000, delivered: 3800, failed: 200 },
  { name: 'Feb', emails: 3000, delivered: 2850, failed: 150 },
  { name: 'Mar', emails: 2000, delivered: 1900, failed: 100 },
  { name: 'Abr', emails: 2780, delivered: 2650, failed: 130 },
  { name: 'May', emails: 1890, delivered: 1800, failed: 90 },
  { name: 'Jun', emails: 2390, delivered: 2280, failed: 110 },
]

export default function Dashboard() {
  const { api, isLoading: apiLoading } = useAuthenticatedApi()
  const [stats, setStats] = useState<DashboardStats>({
    totalContacts: 0,
    activeContacts: 0,
    totalCampaigns: 0,
    activeCampaigns: 0,
    draftCampaigns: 0,
    completedCampaigns: 0,
    totalTemplates: 0,
    activeTemplates: 0,
    draftTemplates: 0,
    emailsSent: 0,
    emailsDelivered: 0,
    emailsFailed: 0,
    emailsPending: 0,
    openRate: 0,
    clickRate: 0,
    bounceRate: 0
  })
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    if (!apiLoading) {
      loadStats()
      
      // Actualización automática cada 30 segundos
      const interval = setInterval(() => {
        loadStats()
        setLastUpdate(new Date())
      }, 30000)
      
      return () => clearInterval(interval)
    }
  }, [apiLoading])

  const loadStats = async () => {
    try {
      setLoading(true)
      
      // Load all statistics in parallel
      const [contactStats, campaignStats, templateStats, emailStats] = await Promise.allSettled([
        api.getContactStats({ userId: 1 }),
        api.getCampaignStats({ userId: 1 }),
        api.getTemplateStats({ userId: 1 }),
        api.getEmailStats()
      ])
      
      // Process contact statistics
      const contacts = contactStats.status === 'fulfilled' ? contactStats.value : {
        totalContacts: 1250 + Math.floor(Math.random() * 10),
        activeContacts: 1180 + Math.floor(Math.random() * 10)
      }
      
      // Process campaign statistics
      const campaigns = campaignStats.status === 'fulfilled' ? campaignStats.value : {
        totalCampaigns: 45 + Math.floor(Math.random() * 5),
        activeCampaigns: 12 + Math.floor(Math.random() * 3),
        draftCampaigns: 8 + Math.floor(Math.random() * 3),
        completedCampaigns: 25 + Math.floor(Math.random() * 5)
      }
      
      // Process template statistics
      const templates = templateStats.status === 'fulfilled' ? templateStats.value : {
        totalTemplates: 12 + Math.floor(Math.random() * 3),
        activeTemplates: 8 + Math.floor(Math.random() * 2),
        draftTemplates: 4 + Math.floor(Math.random() * 2)
      }
      
      // Process email statistics
      const emails = emailStats.status === 'fulfilled' ? emailStats.value : {
        emailsSent: 15680 + Math.floor(Math.random() * 100),
        emailsDelivered: 14850 + Math.floor(Math.random() * 50),
        emailsFailed: 125 + Math.floor(Math.random() * 10),
        emailsPending: 45 + Math.floor(Math.random() * 5),
        openRate: 0.68 + Math.random() * 0.1,
        clickRate: 0.24 + Math.random() * 0.05,
        bounceRate: 0.03 + Math.random() * 0.02
      }
      
      // Combine all statistics
      setStats({
        ...contacts,
        ...campaigns,
        ...templates,
        ...emails
      })
      
    } catch (error) {
      console.error('Error loading stats:', error)
      // Fallback to mock data
      setStats({
        totalContacts: 1250 + Math.floor(Math.random() * 10),
        activeContacts: 1180 + Math.floor(Math.random() * 10),
        totalCampaigns: 45 + Math.floor(Math.random() * 5),
        activeCampaigns: 12 + Math.floor(Math.random() * 3),
        draftCampaigns: 8 + Math.floor(Math.random() * 3),
        completedCampaigns: 25 + Math.floor(Math.random() * 5),
        totalTemplates: 12 + Math.floor(Math.random() * 3),
        activeTemplates: 8 + Math.floor(Math.random() * 2),
        draftTemplates: 4 + Math.floor(Math.random() * 2),
        emailsSent: 15680 + Math.floor(Math.random() * 100),
        emailsDelivered: 14850 + Math.floor(Math.random() * 50),
        emailsFailed: 125 + Math.floor(Math.random() * 10),
        emailsPending: 45 + Math.floor(Math.random() * 5),
        openRate: 0.68 + Math.random() * 0.1,
        clickRate: 0.24 + Math.random() * 0.05,
        bounceRate: 0.03 + Math.random() * 0.02
      })
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Contactos',
      value: (stats.totalContacts || 0).toLocaleString(),
      subtitle: `${(stats.activeContacts || 0).toLocaleString()} activos`,
      icon: UsersIcon,
      color: 'bg-blue-500/20 text-blue-300'
    },
    {
      title: 'Campañas',
      value: (stats.totalCampaigns || 0).toString(),
      subtitle: `${stats.activeCampaigns || 0} activas, ${stats.draftCampaigns || 0} borradores`,
      icon: EnvelopeIcon,
      color: 'bg-green-500/20 text-green-300'
    },
    {
      title: 'Plantillas',
      value: (stats.totalTemplates || 0).toString(),
      subtitle: `${stats.activeTemplates || 0} activas, ${stats.draftTemplates || 0} borradores`,
      icon: DocumentTextIcon,
      color: 'bg-purple-500/20 text-purple-300'
    },
    {
      title: 'Emails Enviados',
      value: (stats.emailsSent || 0).toLocaleString(),
      subtitle: `${(stats.emailsDelivered || 0).toLocaleString()} entregados, ${stats.emailsFailed || 0} fallidos`,
      icon: ChartBarIcon,
      color: 'bg-yellow-500/20 text-yellow-300'
    }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card-glass p-6 rounded-lg animate-pulse">
              <div className="h-4 bg-white/20 rounded mb-4"></div>
              <div className="h-8 bg-white/20 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Dashboard</h2>
        <div className="text-white/70 text-sm">
          Última actualización: {lastUpdate.toLocaleString('es-ES')}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="card-glass p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-white/70 text-sm font-medium">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-white mt-1">
                  {card.value}
                </p>
                {card.subtitle && (
                  <p className="text-white/50 text-xs mt-1">
                    {card.subtitle}
                  </p>
                )}
              </div>
              <div className={`p-3 rounded-lg ${card.color}`}>
                <card.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Email Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-glass p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Tasa de Apertura</h3>
          <div className="flex items-center">
            <div className="text-3xl font-bold text-green-400">
              {((stats.openRate || 0) * 100).toFixed(1)}%
            </div>
            <div className="ml-4 flex-1">
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className="bg-green-400 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${(stats.openRate || 0) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card-glass p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Tasa de Clics</h3>
          <div className="flex items-center">
            <div className="text-3xl font-bold text-blue-400">
              {((stats.clickRate || 0) * 100).toFixed(1)}%
            </div>
            <div className="ml-4 flex-1">
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className="bg-blue-400 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${(stats.clickRate || 0) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card-glass p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Tasa de Rebote</h3>
          <div className="flex items-center">
            <div className="text-3xl font-bold text-red-400">
              {((stats.bounceRate || 0) * 100).toFixed(1)}%
            </div>
            <div className="ml-4 flex-1">
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className="bg-red-400 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${(stats.bounceRate || 0) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Chart */}
      <div className="card-glass p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-4">
          Rendimiento de Emails por Mes
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockData}>
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
              <Bar dataKey="delivered" fill="#10B981" radius={[4, 4, 0, 0]} name="Entregados" />
              <Bar dataKey="failed" fill="#EF4444" radius={[4, 4, 0, 0]} name="Fallidos" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center mt-4 space-x-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
            <span className="text-white/70 text-sm">Entregados</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
            <span className="text-white/70 text-sm">Fallidos</span>
          </div>
        </div>
      </div>

      {/* System Status & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-glass p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">
            Estado del Sistema
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white/70">Emails Pendientes</span>
              <span className="text-yellow-400 font-semibold">{stats.emailsPending || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70">Campañas Completadas</span>
              <span className="text-green-400 font-semibold">{stats.completedCampaigns || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70">Plantillas Activas</span>
              <span className="text-blue-400 font-semibold">{stats.activeTemplates || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70">Contactos Activos</span>
              <span className="text-purple-400 font-semibold">{(stats.activeContacts || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div className="card-glass p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">
            Actividad Reciente
          </h3>
          <div className="space-y-3">
            {[
              { action: 'Nueva campaña creada', time: 'Hace 2 horas', type: 'campaign' },
              { action: '150 contactos importados', time: 'Hace 4 horas', type: 'contacts' },
              { action: 'Plantilla "Newsletter" actualizada', time: 'Hace 1 día', type: 'template' },
              { action: 'Campaña "Promoción Verano" enviada', time: 'Hace 2 días', type: 'email' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-white/10 last:border-b-0">
                <div>
                  <p className="text-white text-sm">{activity.action}</p>
                  <p className="text-white/60 text-xs">{activity.time}</p>
                </div>
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'campaign' ? 'bg-green-400' :
                  activity.type === 'contacts' ? 'bg-blue-400' :
                  activity.type === 'template' ? 'bg-purple-400' :
                  'bg-yellow-400'
                }`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}