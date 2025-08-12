'use client'

import { useState, useEffect } from 'react'
import { 
  MagnifyingGlassIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

interface EmailLog {
  id: string
  timestamp: string
  level: 'info' | 'warning' | 'error' | 'success'
  message: string
  details?: string
  emailId?: string
  campaignId?: string
}

export default function EmailLogsPage() {
  const [logs, setLogs] = useState<EmailLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [levelFilter, setLevelFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')

  useEffect(() => {
    loadLogs()
    
    // Actualización automática cada 10 segundos
    const interval = setInterval(() => {
      loadLogs()
    }, 10000)
    
    return () => clearInterval(interval)
  }, [])

  const loadLogs = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const mockLogs: EmailLog[] = [
        {
          id: '1',
          timestamp: new Date().toISOString(),
          level: 'success',
          message: 'Email enviado exitosamente',
          details: 'Email enviado a juan.perez@example.com - Campaign: Newsletter Enero',
          emailId: '1',
          campaignId: '1'
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 60000).toISOString(),
          level: 'info',
          message: 'Procesando lote de emails',
          details: 'Procesando 50 emails de la campaña Promoción San Valentín',
          campaignId: '2'
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 120000).toISOString(),
          level: 'warning',
          message: 'Email rebotado - reintentando',
          details: 'Email a maria.garcia@example.com rebotó (mailbox full), programado para reintento',
          emailId: '2',
          campaignId: '2'
        },
        {
          id: '4',
          timestamp: new Date(Date.now() - 180000).toISOString(),
          level: 'error',
          message: 'Fallo en envío de email',
          details: 'Error SMTP: Invalid email address - pedro.rodriguez@invalid-domain.com',
          emailId: '5',
          campaignId: '1'
        },
        {
          id: '5',
          timestamp: new Date(Date.now() - 240000).toISOString(),
          level: 'info',
          message: 'Webhook recibido de SendGrid',
          details: 'Evento: delivered - Email ID: 1 - Timestamp: 2024-02-01T10:31:15Z',
          emailId: '1'
        },
        {
          id: '6',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          level: 'success',
          message: 'Campaña iniciada',
          details: 'Campaña "Webinar Tecnología" iniciada - 150 destinatarios',
          campaignId: '4'
        }
      ]
      
      setLogs(mockLogs)
    } catch (error) {
      console.error('Error loading logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const getLevelIcon = (level: EmailLog['level']) => {
    const levelConfig = {
      info: { icon: InformationCircleIcon, color: 'text-blue-400' },
      success: { icon: CheckCircleIcon, color: 'text-green-400' },
      warning: { icon: ExclamationTriangleIcon, color: 'text-yellow-400' },
      error: { icon: XCircleIcon, color: 'text-red-400' }
    }
    
    const config = levelConfig[level]
    const IconComponent = config.icon
    
    return <IconComponent className={`h-5 w-5 ${config.color}`} />
  }

  const getLevelBadge = (level: EmailLog['level']) => {
    const levelConfig = {
      info: { color: 'bg-blue-500/20 text-blue-400', text: 'Info' },
      success: { color: 'bg-green-500/20 text-green-400', text: 'Éxito' },
      warning: { color: 'bg-yellow-500/20 text-yellow-400', text: 'Advertencia' },
      error: { color: 'bg-red-500/20 text-red-400', text: 'Error' }
    }
    
    const config = levelConfig[level]
    return (
      <span className={`px-2 py-1 rounded text-xs ${config.color}`}>
        {config.text}
      </span>
    )
  }

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesLevel = !levelFilter || log.level === levelFilter
    const matchesDate = !dateFilter || log.timestamp.startsWith(dateFilter)
    return matchesSearch && matchesLevel && matchesDate
  })

  const levelCounts = logs.reduce((acc, log) => {
    acc[log.level] = (acc[log.level] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Logs de Envío</h2>
          <p className="text-white/70">
            Registro detallado de actividad del sistema
          </p>
        </div>
        
        <div className="text-white/70 text-sm">
          Actualización automática cada 10 segundos
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="card-glass p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <InformationCircleIcon className="h-5 w-5 text-blue-400" />
            <div>
              <div className="text-white/70 text-sm">Info</div>
              <div className="text-xl font-bold text-white">{levelCounts.info || 0}</div>
            </div>
          </div>
        </div>
        
        <div className="card-glass p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="h-5 w-5 text-green-400" />
            <div>
              <div className="text-white/70 text-sm">Éxito</div>
              <div className="text-xl font-bold text-white">{levelCounts.success || 0}</div>
            </div>
          </div>
        </div>
        
        <div className="card-glass p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
            <div>
              <div className="text-white/70 text-sm">Advertencias</div>
              <div className="text-xl font-bold text-white">{levelCounts.warning || 0}</div>
            </div>
          </div>
        </div>
        
        <div className="card-glass p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <XCircleIcon className="h-5 w-5 text-red-400" />
            <div>
              <div className="text-white/70 text-sm">Errores</div>
              <div className="text-xl font-bold text-white">{levelCounts.error || 0}</div>
            </div>
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
              placeholder="Buscar en logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="">Todos los niveles</option>
            <option value="info">Info</option>
            <option value="success">Éxito</option>
            <option value="warning">Advertencia</option>
            <option value="error">Error</option>
          </select>
          
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="card-glass rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="text-white">Cargando logs...</div>
          </div>
        ) : (
          <div className="max-h-[600px] overflow-y-auto">
            <div className="space-y-2 p-4">
              {filteredLogs.map((log) => (
                <div key={log.id} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getLevelIcon(log.level)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getLevelBadge(log.level)}
                          <span className="text-white/70 text-xs">
                            {new Date(log.timestamp).toLocaleString('es-ES')}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-xs text-white/50">
                          {log.emailId && (
                            <span>Email: {log.emailId}</span>
                          )}
                          {log.campaignId && (
                            <span>Campaña: {log.campaignId}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-white font-medium mb-1">
                        {log.message}
                      </div>
                      
                      {log.details && (
                        <div className="text-white/70 text-sm">
                          {log.details}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}