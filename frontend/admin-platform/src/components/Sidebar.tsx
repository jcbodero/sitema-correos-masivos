'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  HomeIcon,
  UsersIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { 
    name: 'Contactos', 
    href: '/dashboard/contacts', 
    icon: UsersIcon,
    subItems: [
      { name: 'Todos los Contactos', href: '/dashboard/contacts' },
      { name: 'Importar', href: '/dashboard/contacts/import' },
      { name: 'Listas', href: '/dashboard/contacts/lists' }
    ]
  },
  { 
    name: 'Campañas', 
    href: '/dashboard/campaigns', 
    icon: EnvelopeIcon,
    subItems: [
      { name: 'Todas las Campañas', href: '/dashboard/campaigns' },
      { name: 'Nueva Campaña', href: '/dashboard/campaigns/new' }
    ]
  },
  { 
    name: 'Plantillas', 
    href: '/dashboard/templates', 
    icon: DocumentTextIcon,
    subItems: [
      { name: 'Todas las Plantillas', href: '/dashboard/templates' },
      { name: 'Nueva Plantilla', href: '/dashboard/templates/new' }
    ]
  },
  { 
    name: 'Envío de Correos', 
    href: '/dashboard/emails/send', 
    icon: PaperAirplaneIcon,
    subItems: [
      { name: 'Envío Individual', href: '/dashboard/emails/send/single' },
      { name: 'Envío Masivo', href: '/dashboard/emails/send/bulk' },
      { name: 'Historial', href: '/dashboard/emails/history' }
    ]
  },

]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-black/20 backdrop-blur-sm border-r border-white/10 min-h-screen">
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.subItems && item.subItems.some(sub => pathname === sub.href))
          return (
            <div key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-accent text-primary font-medium'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
              
              {item.subItems && isActive && (
                <div className="ml-8 mt-2 space-y-1">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.name}
                      href={subItem.href}
                      className={`block px-4 py-2 text-sm rounded-lg transition-colors ${
                        pathname === subItem.href
                          ? 'bg-accent/20 text-accent'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}