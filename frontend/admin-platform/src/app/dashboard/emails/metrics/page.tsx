'use client'

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client'
import EmailMetricsPage from '@/components/emails/EmailMetricsPage'

export default withPageAuthRequired(function EmailMetrics() {
  return <EmailMetricsPage />
})