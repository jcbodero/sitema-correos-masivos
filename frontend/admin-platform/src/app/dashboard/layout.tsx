'use client'

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'

export default withPageAuthRequired(function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-primary">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
})