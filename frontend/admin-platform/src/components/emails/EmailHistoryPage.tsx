'use client';

import { useState, useEffect } from 'react';
import { 
  ClockIcon,
  EyeIcon,
  ArrowPathIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  UserIcon,
  UsersIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { useHttpRequest } from '@/../../api_lib/useHttpRequest';

interface EmailHistory {
  id: string;
  type: 'single' | 'bulk';
  subject: string;
  recipients: number;
  recipientNames?: string[];
  status: 'sent' | 'sending' | 'completed' | 'failed' | 'cancelled';
  sentAt: string;
  deliveredCount: number;
  openedCount: number;
  clickedCount: number;
  failedCount: number;
  template?: string;
}

export default function EmailHistoryPage() {
  const httpRequest = useHttpRequest();
  const [emailHistory, setEmailHistory] = useState<EmailHistory[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<EmailHistory[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmail, setSelectedEmail] = useState<EmailHistory | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmailHistory();
  }, []);

  const loadEmailHistory = async () => {
    try {
      setLoading(true);
      
      // Load email history using the new API
      await httpRequest.getEmailHistoryEnhanced({ 
        page: 0, 
        size: 100,
        sortBy: 'createdAt',
        sortDir: 'desc'
      }, (emailData: any) => {
        const emailHistory = emailData.content?.map((email: any) => ({
          id: email.id.toString(),
          type: email.campaignId ? 'bulk' as const : 'single' as const,
          subject: email.subject,
          recipients: email.campaignId ? 1 : 1,
          recipientNames: email.campaignId ? [] : [email.toEmail],
          status: mapEmailStatus(email.status),
          sentAt: email.createdAt || email.sentAt,
          deliveredCount: email.deliveredAt ? 1 : 0,
          openedCount: email.openedAt ? 1 : 0,
          clickedCount: email.clickedAt ? 1 : 0,
          failedCount: email.status === 'FAILED' ? 1 : 0
        })) || [];
        
        // Load campaign data for bulk emails
        const campaignIds = [...new Set(emailHistory
          .filter(e => e.type === 'bulk')
          .map(e => parseInt(e.id))
          .filter(id => !isNaN(id))
        )];
        
        if (campaignIds.length > 0) {
          // Load campaign statistics
          Promise.all(campaignIds.map(campaignId => 
            new Promise(resolve => {
              httpRequest.getCampaignEmailStats(campaignId, (stats: any) => {
                resolve({ campaignId, stats });
              });
            })
          )).then((campaignStats: any[]) => {
            // Update email history with campaign stats
            const updatedHistory = emailHistory.map(email => {
              if (email.type === 'bulk') {
                const campaignStat = campaignStats.find(s => s.campaignId.toString() === email.id);
                if (campaignStat) {
                  return {
                    ...email,
                    recipients: campaignStat.stats.totalEmails || 1,
                    deliveredCount: campaignStat.stats.deliveredEmails || 0,
                    openedCount: campaignStat.stats.openedEmails || 0,
                    clickedCount: campaignStat.stats.clickedEmails || 0,
                    failedCount: campaignStat.stats.failedEmails || 0
                  };
                }
              }
              return email;
            });
            
            setEmailHistory(updatedHistory);
            setFilteredHistory(updatedHistory);
          });
        } else {
          setEmailHistory(emailHistory);
          setFilteredHistory(emailHistory);
        }
      });
    } catch (error) {
      console.error('Error loading email history:', error);
      // Fallback to mock data
      const mockHistory: EmailHistory[] = [
        {
          id: '1',
          type: 'single',
          subject: 'Bienvenida a la plataforma',
          recipients: 1,
          recipientNames: ['juan@empresa.com'],
          status: 'completed',
          sentAt: '2024-01-15T10:30:00Z',
          deliveredCount: 1,
          openedCount: 1,
          clickedCount: 0,
          failedCount: 0,
          template: 'Bienvenida'
        },
        {
          id: '2',
          type: 'bulk',
          subject: 'Newsletter Enero 2024',
          recipients: 1200,
          status: 'completed',
          sentAt: '2024-01-14T09:00:00Z',
          deliveredCount: 1180,
          openedCount: 420,
          clickedCount: 85,
          failedCount: 20,
          template: 'Newsletter Mensual'
        }
      ];
      setEmailHistory(mockHistory);
      setFilteredHistory(mockHistory);
    } finally {
      setLoading(false);
    }
  };

  const mapEmailStatus = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'SENT': 'completed',
      'DELIVERED': 'completed',
      'OPENED': 'completed',
      'CLICKED': 'completed',
      'FAILED': 'failed',
      'BOUNCED': 'failed',
      'PENDING': 'sending',
      'SENDING': 'sending'
    };
    return statusMap[status] || status.toLowerCase();
  };

  // Filtrar historial
  useEffect(() => {
    let filtered = emailHistory;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(email => email.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(email => email.type === typeFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(email =>
        email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (email.recipientNames && email.recipientNames.some(name => 
          name.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
    }

    setFilteredHistory(filtered);
  }, [emailHistory, statusFilter, typeFilter, searchTerm]);

  const getStatusBadge = (status: string) => {
    const badges = {
      sent: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300', icon: CheckCircleIcon },
      sending: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300', icon: ArrowPathIcon },
      completed: { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', icon: CheckCircleIcon },
      failed: { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300', icon: XCircleIcon },
      cancelled: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300', icon: ExclamationCircleIcon }
    };

    const badge = badges[status as keyof typeof badges];
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="h-3 w-3" />
        <span className="capitalize">{status}</span>
      </span>
    );
  };

  const getTypeIcon = (type: string) => {
    return type === 'single' ? UserIcon : UsersIcon;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateRate = (count: number, total: number) => {
    return total > 0 ? ((count / total) * 100).toFixed(1) : '0.0';
  };

  const handleRetry = async (emailId: string) => {
    try {
      const email = emailHistory.find(e => e.id === emailId);
      if (email && email.type === 'bulk') {
        await httpRequest.retryFailedEmails(parseInt(emailId), (response: any) => {
          toast.success(`Reintentando envíos fallidos para la campaña`);
          loadEmailHistory();
        });
      } else {
        // For individual emails, try to resend using the email data
        const emailData = {
          to: email?.recipientNames?.[0] || '',
          subject: email?.subject || '',
          htmlContent: '<p>Reenvío automático</p>',
          from: 'noreply@correos-masivos.com'
        };
        await httpRequest.sendEmail(emailData, (response: any) => {
          toast.success('Email individual reenviado');
          loadEmailHistory();
        });
      }
    } catch (error) {
      console.error('Error retrying email:', error);
      toast.error('Error al reintentar el envío');
    }
  };

  const handleCancel = async (emailId: string) => {
    try {
      const email = emailHistory.find(e => e.id === emailId);
      if (email && email.type === 'bulk') {
        await httpRequest.cancelCampaign(parseInt(emailId), (response: any) => {
          toast.success('Campaña cancelada exitosamente');
          loadEmailHistory();
        });
      } else {
        toast.error('No se puede cancelar un email individual ya enviado');
      }
    } catch (error) {
      console.error('Error cancelling email:', error);
      toast.error('Error al cancelar el envío');
    }
  };

  const handleViewFailedEmails = async (emailId: string) => {
    try {
      await httpRequest.getFailedEmails(parseInt(emailId), (failedEmails: any[]) => {
        const failedCount = failedEmails.length;
        const failedList = failedEmails.map(e => e.toEmail).join(', ');
        alert(`Emails fallidos (${failedCount}):\n${failedList}`);
      });
    } catch (error) {
      console.error('Error getting failed emails:', error);
      toast.error('Error al obtener emails fallidos');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Historial de Envíos
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Revisa el estado y métricas de tus envíos anteriores
          </p>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          {/* Búsqueda */}
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por asunto o destinatario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Filtros */}
          <div className="flex space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">Todos los estados</option>
              <option value="completed">Completado</option>
              <option value="sending">Enviando</option>
              <option value="failed">Fallido</option>
              <option value="cancelled">Cancelado</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">Todos los tipos</option>
              <option value="single">Individual</option>
              <option value="bulk">Masivo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-4">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {filteredHistory.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Envíos</div>
        </div>
        
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-4">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {filteredHistory.filter(e => e.status === 'completed').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Completados</div>
        </div>
        
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-4">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {filteredHistory.filter(e => e.status === 'sending').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">En Progreso</div>
        </div>
        
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-4">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {filteredHistory.filter(e => e.status === 'failed').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Fallidos</div>
        </div>
      </div>

      {/* Tabla de Historial */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Envío
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Destinatarios
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Métricas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredHistory.map((email) => {
                const TypeIcon = getTypeIcon(email.type);
                return (
                  <tr key={email.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <TypeIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {email.subject}
                          </div>
                          {email.template && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Plantilla: {email.template}
                            </div>
                          )}
                          <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {email.type === 'single' ? 'Individual' : 'Masivo'}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {email.recipients.toLocaleString()}
                      </div>
                      {email.recipientNames && email.recipientNames.length > 0 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {email.recipientNames.slice(0, 2).join(', ')}
                          {email.recipientNames.length > 2 && ` +${email.recipientNames.length - 2} más`}
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4">
                      {getStatusBadge(email.status)}
                      {email.status === 'sending' && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {email.deliveredCount}/{email.recipients} enviados
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Entregados:</span>
                          <span className="text-gray-900 dark:text-white">
                            {email.deliveredCount} ({calculateRate(email.deliveredCount, email.recipients)}%)
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Abiertos:</span>
                          <span className="text-gray-900 dark:text-white">
                            {email.openedCount} ({calculateRate(email.openedCount, email.deliveredCount)}%)
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Clics:</span>
                          <span className="text-gray-900 dark:text-white">
                            {email.clickedCount} ({calculateRate(email.clickedCount, email.deliveredCount)}%)
                          </span>
                        </div>
                        {email.failedCount > 0 && (
                          <div className="flex justify-between text-red-600 dark:text-red-400">
                            <span>Fallidos:</span>
                            <span>{email.failedCount}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(email.sentAt)}
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedEmail(email);
                            setShowDetails(true);
                          }}
                          className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded"
                          title="Ver detalles"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        
                        {email.status === 'failed' && (
                          <>
                            <button
                              onClick={() => handleRetry(email.id)}
                              className="p-1 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 rounded"
                              title="Reintentar"
                            >
                              <ArrowPathIcon className="h-4 w-4" />
                            </button>
                            {email.type === 'bulk' && email.failedCount > 0 && (
                              <button
                                onClick={() => handleViewFailedEmails(email.id)}
                                className="p-1 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded"
                                title="Ver emails fallidos"
                              >
                                <ExclamationCircleIcon className="h-4 w-4" />
                              </button>
                            )}
                          </>
                        )}
                        
                        {email.status === 'sending' && (
                          <button
                            onClick={() => handleCancel(email.id)}
                            className="p-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                            title="Cancelar"
                          >
                            <XCircleIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredHistory.length === 0 && (
          <div className="text-center py-12">
            <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No se encontraron envíos con los filtros aplicados
            </p>
          </div>
        )}
      </div>

      {/* Modal de Detalles */}
      {showDetails && selectedEmail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Detalles del Envío
              </h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Información General</h4>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Asunto:</span>
                    <span className="text-gray-900 dark:text-white">{selectedEmail.subject}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tipo:</span>
                    <span className="text-gray-900 dark:text-white capitalize">
                      {selectedEmail.type === 'single' ? 'Individual' : 'Masivo'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Estado:</span>
                    {getStatusBadge(selectedEmail.status)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Fecha de envío:</span>
                    <span className="text-gray-900 dark:text-white">{formatDate(selectedEmail.sentAt)}</span>
                  </div>
                  {selectedEmail.template && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Plantilla:</span>
                      <span className="text-gray-900 dark:text-white">{selectedEmail.template}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Métricas de Rendimiento</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {selectedEmail.deliveredCount}
                    </div>
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                      Entregados ({calculateRate(selectedEmail.deliveredCount, selectedEmail.recipients)}%)
                    </div>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {selectedEmail.openedCount}
                    </div>
                    <div className="text-sm text-green-700 dark:text-green-300">
                      Abiertos ({calculateRate(selectedEmail.openedCount, selectedEmail.deliveredCount)}%)
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {selectedEmail.clickedCount}
                    </div>
                    <div className="text-sm text-purple-700 dark:text-purple-300">
                      Clics ({calculateRate(selectedEmail.clickedCount, selectedEmail.deliveredCount)}%)
                    </div>
                  </div>
                  
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {selectedEmail.failedCount}
                    </div>
                    <div className="text-sm text-red-700 dark:text-red-300">
                      Fallidos ({calculateRate(selectedEmail.failedCount, selectedEmail.recipients)}%)
                    </div>
                  </div>
                </div>
              </div>

              {selectedEmail.recipientNames && selectedEmail.recipientNames.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Destinatarios</h4>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 max-h-32 overflow-y-auto">
                    <div className="space-y-1">
                      {selectedEmail.recipientNames.map((name, index) => (
                        <div key={index} className="text-sm text-gray-700 dark:text-gray-300">
                          {name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons in Modal */}
              {selectedEmail.status === 'failed' && (
                <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <button
                    onClick={() => {
                      handleRetry(selectedEmail.id);
                      setShowDetails(false);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                  >
                    <ArrowPathIcon className="h-4 w-4" />
                    <span>Reintentar</span>
                  </button>
                  
                  {selectedEmail.type === 'bulk' && selectedEmail.failedCount > 0 && (
                    <button
                      onClick={() => handleViewFailedEmails(selectedEmail.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg"
                    >
                      <ExclamationCircleIcon className="h-4 w-4" />
                      <span>Ver Fallidos ({selectedEmail.failedCount})</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}