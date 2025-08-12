'use client'

import { useState, useEffect } from 'react'
import { 
  CalendarIcon,
  ChartBarIcon,
  TrendingUpIcon,
  TrendingDownIcon
} from '@heroicons/react/24/outline'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts'

export default function EmailMetricsPage() {
  const [metrics, setMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('7d')

  useEffect(() => {
    loadMetrics()
  }, [dateRange])

  const loadMetrics = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockMetrics = {
        summary: {
          totalSent: 15680,
          totalDelivered: 14920,
          totalOpened: 5968,
          totalClicked: 1194,
          deliveryRate: 95.2,
          openRate: 38.1,
          clickRate: 7.6,
          bounceRate: 4.8
        },
        trends: {
          sent: { value: 15680, change: 12.5, trend: 'up' },
          delivered: { value: 14920, change: 8.3, trend: 'up' },
          opened: { value: 5968, change: -2.1, trend: 'down' },
          clicked: { value: 1194, change: 15.7, trend: 'up' }
        },
        dailyStats: [
          { date: '2024-01-25', sent: 2100, delivered: 2010, opened: 804, clicked: 161 },
          { date: '2024-01-26', sent: 2300, delivered: 2185, opened: 874, clicked: 175 },
          { date: '2024-01-27', sent: 1800, delivered: 1710, opened: 684, clicked: 137 },
          { date: '2024-01-28', sent: 2500, delivered: 2375, opened: 950, clicked: 190 },
          { date: '2024-01-29', sent: 2200, delivered: 2090, opened: 836, clicked: 167 },
          { date: '2024-01-30', sent: 2400, delivered: 2280, opened: 912, clicked: 182 },
          { date: '2024-01-31', sent: 2380, delivered: 2270, opened: 908, clicked: 182 }
        ],
        hourlyStats: [
          { hour: '00:00', sent: 45, delivered: 43, opened: 12, clicked: 2 },
          { hour: '01:00', sent: 32, delivered: 30, opened: 8, clicked: 1 },
          { hour: '02:00', sent: 28, delivered: 26, opened: 6, clicked: 1 },
          { hour: '03:00', sent: 25, delivered: 24, opened: 5, clicked: 0 },
          { hour: '04:00', sent: 30, delivered: 28, opened: 7, clicked: 1 },
          { hour: '05:00', sent: 40, delivered: 38, opened: 10, clicked: 2 },
          { hour: '06:00', sent: 85, delivered: 81, opened: 24, clicked: 5 },
          { hour: '07:00', sent: 120, delivered: 114, opened: 38, clicked: 8 },
          { hour: '08:00', sent: 180, delivered: 171, opened: 65, clicked: 13 },
          { hour: '09:00', sent: 220, delivered: 209, opened: 84, clicked: 17 },
          { hour: '10:00', sent: 250, delivered: 238, opened: 95, clicked: 19 },
          { hour: '11:00', sent: 240, delivered: 228, opened: 91, clicked: 18 },
          { hour: '12:00', sent: 200, delivered: 190, opened: 76, clicked: 15 },
          { hour: '13:00', sent: 180, delivered: 171, opened: 68, clicked: 14 },
          { hour: '14:00', sent: 190, delivered: 181, opened: 72, clicked: 14 },
          { hour: '15:00', sent: 210, delivered: 200, opened: 80, clicked: 16 },
          { hour: '16:00', sent: 195, delivered: 185, opened: 74, clicked: 15 },
          { hour: '17:00', sent: 170, delivered: 162, opened: 65, clicked: 13 },
          { hour: '18:00', sent: 140, delivered: 133, opened: 53, clicked: 11 },
          { hour: '19:00', sent: 110, delivered: 105, opened: 42, clicked: 8 },
          { hour: '20:00', sent: 90, delivered: 86, opened: 34, clicked: 7 },
          { hour: '21:00', sent: 75, delivered: 71, opened: 28, clicked: 6 },
          { hour: '22:00', sent: 60, delivered: 57, opened: 23, clicked: 5 },
          { hour: '23:00', sent: 50, delivered: 48, opened: 19, clicked: 4 }
        ],
        providerStats: [
          { provider: 'SendGrid', sent: 12544, delivered: 11917, rate: 95.0 },
          { provider: 'MailHog', sent: 2136, delivered: 2003, rate: 93.8 },
          { provider: 'Gmail SMTP', sent: 1000, delivered: 1000, rate: 100.0 }
        ]
      }
      
      setMetrics(mockMetrics)
    } catch (error) {
      console.error('Error loading metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-white/20 rounded animate-pulse"></div>
        <div className="grid grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card-glass p-6 rounded-lg animate-pulse">
              <div className="h-4 bg-white/20 rounded mb-2"></div>
              <div className="h-8 bg-white/20 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!metrics) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Métricas de Entrega</h2>
          <p className="text-white/70">
            Análisis detallado del rendimiento de envíos
          </p>
        </div>
        
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="1d">Último día</option>
          <option value="7d">Últimos 7 días</option>
          <option value="30d">Últimos 30 días</option>
          <option value="90d">Últimos 90 días</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="card-glass p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white/70 text-sm">Enviados</div>
              <div className="text-2xl font-bold text-white">
                {metrics.summary.totalSent.toLocaleString()}
              </div>
              <div className="flex items-center space-x-1 mt-1">
                {metrics.trends.sent.trend === 'up' ? (
                  <TrendingUpIcon className="h-4 w-4 text-green-400" />
                ) : (
                  <TrendingDownIcon className="h-4 w-4 text-red-400" />
                )}
                <span className={`text-xs ${
                  metrics.trends.sent.trend === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {metrics.trends.sent.change}%
                </span>
              </div>
            </div>
            <ChartBarIcon className="h-8 w-8 text-blue-400" />
          </div>
        </div>

        <div className="card-glass p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white/70 text-sm">Tasa de Entrega</div>
              <div className="text-2xl font-bold text-white">
                {metrics.summary.deliveryRate}%
              </div>
              <div className="flex items-center space-x-1 mt-1">
                {metrics.trends.delivered.trend === 'up' ? (
                  <TrendingUpIcon className="h-4 w-4 text-green-400" />
                ) : (
                  <TrendingDownIcon className="h-4 w-4 text-red-400" />
                )}
                <span className={`text-xs ${
                  metrics.trends.delivered.trend === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {metrics.trends.delivered.change}%
                </span>
              </div>
            </div>
            <ChartBarIcon className="h-8 w-8 text-green-400" />
          </div>
        </div>

        <div className="card-glass p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white/70 text-sm">Tasa de Apertura</div>
              <div className="text-2xl font-bold text-white">
                {metrics.summary.openRate}%
              </div>
              <div className="flex items-center space-x-1 mt-1">
                {metrics.trends.opened.trend === 'up' ? (
                  <TrendingUpIcon className="h-4 w-4 text-green-400" />
                ) : (
                  <TrendingDownIcon className="h-4 w-4 text-red-400" />
                )}
                <span className={`text-xs ${
                  metrics.trends.opened.trend === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {Math.abs(metrics.trends.opened.change)}%
                </span>
              </div>
            </div>
            <ChartBarIcon className="h-8 w-8 text-purple-400" />
          </div>
        </div>

        <div className="card-glass p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white/70 text-sm">Tasa de Clic</div>
              <div className="text-2xl font-bold text-white">
                {metrics.summary.clickRate}%
              </div>
              <div className="flex items-center space-x-1 mt-1">
                {metrics.trends.clicked.trend === 'up' ? (
                  <TrendingUpIcon className="h-4 w-4 text-green-400" />
                ) : (
                  <TrendingDownIcon className="h-4 w-4 text-red-400" />
                )}
                <span className={`text-xs ${
                  metrics.trends.clicked.trend === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {metrics.trends.clicked.change}%
                </span>
              </div>
            </div>
            <ChartBarIcon className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Trends */}
        <div className="card-glass p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">
            Tendencias Diarias
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.dailyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="#FFFFFF" fontSize={12} />
                <YAxis stroke="#FFFFFF" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: '#FFFFFF'
                  }}
                />
                <Area type="monotone" dataKey="sent" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                <Area type="monotone" dataKey="delivered" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                <Area type="monotone" dataKey="opened" stackId="3" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                <Area type="monotone" dataKey="clicked" stackId="4" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly Distribution */}
        <div className="card-glass p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">
            Distribución por Hora
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.hourlyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="hour" stroke="#FFFFFF" fontSize={10} />
                <YAxis stroke="#FFFFFF" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: '#FFFFFF'
                  }}
                />
                <Line type="monotone" dataKey="sent" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="delivered" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="opened" stroke="#8B5CF6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Provider Performance */}
      <div className="card-glass p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-4">
          Rendimiento por Proveedor
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metrics.providerStats.map((provider: any) => (
            <div key={provider.provider} className="bg-white/5 p-4 rounded-lg">
              <div className="text-white font-medium mb-2">{provider.provider}</div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Enviados:</span>
                  <span className="text-white">{provider.sent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Entregados:</span>
                  <span className="text-white">{provider.delivered.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Tasa:</span>
                  <span className={`font-medium ${
                    provider.rate >= 95 ? 'text-green-400' : 
                    provider.rate >= 90 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {provider.rate}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}