import type { Metadata } from 'next'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Toaster } from 'react-hot-toast'
import './globals.css'

export const metadata: Metadata = {
  title: 'SIMAC - Admin Platform',
  description: 'Sistema Masivo de correos - Plataforma administrativa',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <UserProvider>
          <ThemeProvider>
            {children}
            <Toaster position="top-right" />
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  )
}