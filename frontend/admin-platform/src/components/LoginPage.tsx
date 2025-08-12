'use client'

import { useUser } from '@auth0/nextjs-auth0/client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginPage() {
  const { user, isLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    )
  }

  if (user) {
    return null
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center">
      <div className="card-glass p-8 rounded-lg max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Correos Masivos
          </h1>
          <p className="text-white/80">
            Plataforma Administrativa
          </p>
        </div>
        
        <div className="space-y-4">
          <p className="text-white/90 text-center">
            Accede a tu cuenta para gestionar campañas de correo masivo
          </p>
          
          <a
            href="/api/auth/login"
            className="btn-primary w-full text-center block"
          >
            Iniciar Sesión
          </a>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-white/60 text-sm">
            Powered by Auth0
          </p>
        </div>
      </div>
    </div>
  )
}