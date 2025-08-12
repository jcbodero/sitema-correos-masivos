'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  PaperAirplaneIcon, 
  UserIcon, 
  UsersIcon,
  ClockIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

export default function EmailSendPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Envío de Correos
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Selecciona el tipo de envío que deseas realizar
          </p>
        </div>
      </div>

      {/* Opciones de Envío */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Envío Individual */}
        <Link href="/dashboard/emails/send/single">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200 cursor-pointer group">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                <UserIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Envío Individual
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Envía un correo a un contacto específico
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
              Comenzar envío
              <PaperAirplaneIcon className="ml-2 h-4 w-4" />
            </div>
          </div>
        </Link>

        {/* Envío Masivo */}
        <Link href="/dashboard/emails/send/bulk">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200 cursor-pointer group">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                <UsersIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Envío Masivo
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Envía correos a múltiples contactos
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
              Comenzar envío
              <PaperAirplaneIcon className="ml-2 h-4 w-4" />
            </div>
          </div>
        </Link>

        {/* Historial */}
        <Link href="/dashboard/emails/history">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200 cursor-pointer group">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                <ClockIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Historial de Envíos
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Revisa tus envíos anteriores
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-purple-600 dark:text-purple-400 text-sm font-medium">
              Ver historial
              <DocumentTextIcon className="ml-2 h-4 w-4" />
            </div>
          </div>
        </Link>
      </div>

      {/* Estadísticas Rápidas */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Estadísticas de Hoy
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">24</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Enviados</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">22</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Entregados</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">18</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Abiertos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">12</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Clics</div>
          </div>
        </div>
      </div>
    </div>
  );
}