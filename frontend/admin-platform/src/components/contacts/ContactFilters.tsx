'use client'

import { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface ContactFiltersProps {
  onFiltersChange: (filters: any) => void
}

export default function ContactFilters({ onFiltersChange }: ContactFiltersProps) {
  const [filters, setFilters] = useState({
    status: '',
    tags: [],
    dateRange: '',
    company: ''
  })

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    const emptyFilters = {
      status: '',
      tags: [],
      dateRange: '',
      company: ''
    }
    setFilters(emptyFilters)
    onFiltersChange(emptyFilters)
  }

  return (
    <div className="border-t border-white/10 pt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-medium">Filtros Avanzados</h3>
        <button
          onClick={clearFilters}
          className="text-white/60 hover:text-white text-sm flex items-center space-x-1"
        >
          <XMarkIcon className="h-4 w-4" />
          <span>Limpiar</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Estado */}
        <div>
          <label className="block text-white/70 text-sm mb-2">Estado</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="">Todos</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>

        {/* Rango de Fechas */}
        <div>
          <label className="block text-white/70 text-sm mb-2">Fecha de Registro</label>
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="">Cualquier fecha</option>
            <option value="today">Hoy</option>
            <option value="week">Última semana</option>
            <option value="month">Último mes</option>
            <option value="year">Último año</option>
          </select>
        </div>

        {/* Empresa */}
        <div>
          <label className="block text-white/70 text-sm mb-2">Empresa</label>
          <input
            type="text"
            placeholder="Filtrar por empresa..."
            value={filters.company}
            onChange={(e) => handleFilterChange('company', e.target.value)}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-white/70 text-sm mb-2">Tags</label>
          <select
            multiple
            value={filters.tags}
            onChange={(e) => handleFilterChange('tags', Array.from(e.target.selectedOptions, option => option.value))}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="cliente">Cliente</option>
            <option value="prospecto">Prospecto</option>
            <option value="vip">VIP</option>
            <option value="newsletter">Newsletter</option>
          </select>
        </div>
      </div>

      {/* Active Filters */}
      <div className="flex flex-wrap gap-2 mt-4">
        {filters.status && (
          <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm flex items-center space-x-1">
            <span>Estado: {filters.status}</span>
            <button onClick={() => handleFilterChange('status', '')}>
              <XMarkIcon className="h-3 w-3" />
            </button>
          </span>
        )}
        
        {filters.dateRange && (
          <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm flex items-center space-x-1">
            <span>Fecha: {filters.dateRange}</span>
            <button onClick={() => handleFilterChange('dateRange', '')}>
              <XMarkIcon className="h-3 w-3" />
            </button>
          </span>
        )}
        
        {filters.company && (
          <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm flex items-center space-x-1">
            <span>Empresa: {filters.company}</span>
            <button onClick={() => handleFilterChange('company', '')}>
              <XMarkIcon className="h-3 w-3" />
            </button>
          </span>
        )}
        
        {filters.tags.map((tag) => (
          <span key={tag} className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm flex items-center space-x-1">
            <span>Tag: {tag}</span>
            <button onClick={() => handleFilterChange('tags', filters.tags.filter(t => t !== tag))}>
              <XMarkIcon className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  )
}