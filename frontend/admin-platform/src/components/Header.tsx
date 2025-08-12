'use client'

import { useUser } from '@auth0/nextjs-auth0/client'
import { useTheme } from './ThemeProvider'
import { SunIcon, MoonIcon, UserCircleIcon } from '@heroicons/react/24/outline'

export default function Header() {
  const { user } = useUser()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="bg-primary/90 backdrop-blur-sm border-b border-white/10 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white" title="Sistema Masivo de correos">
            SIMAC
          </h1>
          <p className="text-white/70 text-sm">
            Panel Administrativo
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {theme === 'light' ? (
              <MoonIcon className="h-5 w-5 text-white" />
            ) : (
              <SunIcon className="h-5 w-5 text-white" />
            )}
          </button>
          
          <div className="flex items-center space-x-2">
            {user?.picture ? (
              <img
                src={user.picture}
                alt={user.name || 'Usuario'}
                className="h-8 w-8 rounded-full"
              />
            ) : (
              <UserCircleIcon className="h-8 w-8 text-white" />
            )}
            <div className="text-white">
              <p className="text-sm font-medium">
                {user?.name || 'Usuario'}
              </p>
              <p className="text-xs text-white/70">
                {user?.email}
              </p>
            </div>
          </div>
          
          <a
            href="/api/auth/logout"
            className="btn-secondary text-sm"
          >
            Cerrar Sesión
          </a>
        </div>
      </div>
    </header>
  )
}