'use client'

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client'
import Dashboard from '@/components/Dashboard'

export default withPageAuthRequired(function DashboardPage() {
  return <Dashboard />
})