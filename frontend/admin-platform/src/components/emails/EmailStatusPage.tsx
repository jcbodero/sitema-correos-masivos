'use client'

import { useState, useEffect } from 'react'
import { 
  EnvelopeIcon,
  CheckCircleIcon,
  EyeIcon,
  CursorArrowRaysIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ClockIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useHttpRequest } from '@/../../api_lib/useHttpRequest'

interface EmailStatus {
  id: string;
  recipient: string;
  subject: string;
  status: 'pending' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed';
  sentAt?: string;
  deliveredAt?: string;
  openedAt?: string;
  clickedAt?: string;
  campaignId?: string;
  campaignName?: string;
  provider?: string;
  bounceReason?: string;
  errorMessage?: string;
}

export default function EmailStatusPage() {
  const httpRequest = useHttpRequest();
  const [emails, setEmails] = useState<EmailStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    loadEmails()
    
    // Actualización automática cada 30 segundos
    const interval = setInterval(() => {
      loadEmails()
      setLastUpdate(new Date())
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const loadEmails = async () => {
    try {
      setLoading(true);
      
      const params: any = {
        page: 0,
        size: 100,
        sortBy: 'createdAt',
        sortDir: 'desc'
      };
      
      if (statusFilter) {
        params.status = statusFilter.toUpperCase();
      }
      
      await httpRequest.getEmailLogs(params, (data: any) => {
        const formattedEmails: EmailStatus[] = data.content?.map((email: any) => ({
          id: email.id.toString(),
          recipient: email.to,
          subject: email.subject,
          status: email.status.toLowerCase(),
          sentAt: email.sentAt,
          deliveredAt: email.deliveredAt,
          openedAt: email.openedAt,
          clickedAt: email.clickedAt,
          campaignId: email.campaignId?.toString(),
          campaignName: email.campaignName,
          provider: email.provider || 'SendGrid',
          bounceReason: email.bounceReason,
          errorMessage: email.errorMessage
        })) || [];
        
        setEmails(formattedEmails);
      });
    } catch (error) {
      console.error('Error loading emails:', error);
      // Fallback to mock data on error
      const mockEmails: EmailStatus[] = [
        {
          id: '1',
          recipient: 'juan.perez@example.com',
          subject: 'Newsletter Enero 2024',
          status: 'delivered',
          sentAt: '2024-02-01T10:30:00Z',
          deliveredAt: '2024-02-01T10:31:15Z',
          openedAt: '2024-02-01T14:22:30Z',
          clickedAt: '2024-02-01T14:25:10Z',
          campaignId: '1',
          campaignName: 'Newsletter Enero',
          provider: 'SendGrid'
        },
        {
          id: '2',
          recipient: 'maria.garcia@example.com',
          subject: 'Promoción San Valentín',
          status: 'opened',
          sentAt: '2024-02-01T11:00:00Z',
          deliveredAt: '2024-02-01T11:01:20Z',
          openedAt: '2024-02-01T15:45:00Z',
          campaignId: '2',
          campaignName: 'Promoción San Valentín',
          provider: 'SendGrid'
        },
        {
          id: '3',
          recipient: 'carlos.lopez@example.com',
          subject: 'Encuesta de Satisfacción',
          status: 'sent',
          sentAt: '2024-02-01T12:15:00Z',
          campaignId: '3',
          campaignName: 'Encuesta Satisfacción',
          provider: 'MailHog'
        }
      ];
      setEmails(mockEmails);
    } finally {
      setLoading(false);
    }
  }

  const getStatusBadge = (status: EmailStatus['status']) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-500/20 text-yellow-400', text: 'Pendiente', icon: ClockIcon },
      sent: { color: 'bg-blue-500/20 text-blue-400', text: 'Enviado', icon: EnvelopeIcon },
      delivered: { color: 'bg-green-500/20 text-green-400', text: 'Entregado', icon: CheckCircleIcon },
      opened: { color: 'bg-green-400/20 text-green-300', text: 'Abierto', icon: EyeIcon },
      clicked: { color: 'bg-green-600/20 text-green-200', text: 'Clic', icon: CursorArrowRaysIcon },
      bounced: { color: 'bg-orange-500/20 text-orange-400', text: 'Rebotado', icon: ExclamationTriangleIcon },
      failed: { color: 'bg-red-500/20 text-red-400', text: 'Fallido', icon: XCircleIcon }
    }
    
    const config = statusConfig[status] || statusConfig.pending
    const IconComponent = config.icon
    
    return (
      <span className={`px-2 py-1 rounded text-xs flex items-center space-x-1 ${config.color}`}>
        <IconComponent className="h-3 w-3" />
        <span>{config.text}</span>
      </span>
    )
  }

  // Filter emails based on search term (status filter is applied in API call)
  const filteredEmails = emails.filter(email => {
    const matchesSearch = email.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.subject.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })
  
  // Reload emails when status filter changes
  useEffect(() => {
    loadEmails()
  }, [statusFilter])

  const statusCounts = emails.reduce((acc, email) => {
    acc[email.status] = (acc[email.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const chartData = [
    { name: 'Pendiente', value: statusCounts.pending || 0, color: '#EAB308' },
    { name: 'Enviado', value: statusCounts.sent || 0, color: '#3B82F6' },
    { name: 'Entregado', value: statusCounts.delivered || 0, color: '#10B981' },
    { name: 'Abierto', value: statusCounts.opened || 0, color: '#34D399' },
    { name: 'Clic', value: statusCounts.clicked || 0, color: '#059669' },
    { name: 'Rebotado', value: statusCounts.bounced || 0, color: '#F59E0B' },
    { name: 'Fallido', value: statusCounts.failed || 0, color: '#EF4444' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Estado de Correos</h2>
          <p className="text-white/70">
            Monitoreo en tiempo real del estado de envíos
          </p>
        </div>
        
        <div className="text-white/70 text-sm">
          Última actualización: {lastUpdate.toLocaleTimeString('es-ES')}
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {chartData.map((item) => (
          <div key={item.name} className="card-glass p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-white mb-1">{item.value}</div>
            <div className="text-xs text-white/70">{item.name}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-glass p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">
            Distribución por Estado
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#FFFFFF" fontSize={12} />
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

        <div className="card-glass p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">
            Estados Activos
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.filter(item => item.value > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.filter(item => item.value > 0).map((entry, index) => (
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
        </div>
      </div>

      {/* Filters */}
      <div className="card-glass p-4 rounded-lg">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
            <input
              type="text"
              placeholder="Buscar por email o asunto..."
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
            <option value="pending">Pendiente</option>
            <option value="sent">Enviado</option>
            <option value="delivered">Entregado</option>
            <option value="opened">Abierto</option>
            <option value="clicked">Clic</option>
            <option value="bounced">Rebotado</option>
            <option value="failed">Fallido</option>
          </select>
        </div>
      </div>

      {/* Email Status Table */}
      <div className="card-glass rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="text-white">Cargando estados de correo...</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="p-4 text-left text-white">Destinatario</th>
                  <th className="p-4 text-left text-white">Asunto</th>
                  <th className="p-4 text-left text-white">Estado</th>
                  <th className="p-4 text-left text-white">Campaña</th>
                  <th className="p-4 text-left text-white">Proveedor</th>
                  <th className="p-4 text-left text-white">Fecha Envío</th>
                  <th className="p-4 text-left text-white">Detalles</th>
                </tr>
              </thead>
              
              <tbody>
                {filteredEmails.map((email) => (
                  <tr key={email.id} className="border-t border-white/10 hover:bg-white/5">
                    <td className="p-4">
                      <div className="text-white font-medium">{email.recipient}</div>
                    </td>
                    
                    <td className="p-4">
                      <div className="text-white/80 text-sm">{email.subject}</div>
                    </td>
                    
                    <td className="p-4">
                      {getStatusBadge(email.status)}
                    </td>
                    
                    <td className="p-4">
                      <div className="text-white/80 text-sm">{email.campaignName}</div>
                    </td>
                    
                    <td className="p-4">
                      <div className="text-white/80 text-sm">{email.provider}</div>
                    </td>
                    
                    <td className="p-4">
                      <div className="text-white/80 text-sm">
                        {email.sentAt 
                          ? new Date(email.sentAt).toLocaleString('es-ES')
                          : 'No enviado'
                        }
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="text-xs text-white/60">
                        {email.status === 'delivered' && email.deliveredAt && (
                          <div>Entregado: {new Date(email.deliveredAt).toLocaleTimeString('es-ES')}</div>
                        )}
                        {email.status === 'opened' && email.openedAt && (
                          <div>Abierto: {new Date(email.openedAt).toLocaleTimeString('es-ES')}</div>
                        )}
                        {email.status === 'clicked' && email.clickedAt && (
                          <div>Clic: {new Date(email.clickedAt).toLocaleTimeString('es-ES')}</div>
                        )}
                        {email.status === 'bounced' && email.bounceReason && (
                          <div className="text-orange-400">Razón: {email.bounceReason}</div>
                        )}
                        {email.status === 'failed' && email.errorMessage && (
                          <div className="text-red-400">Error: {email.errorMessage}</div>
                        )}
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