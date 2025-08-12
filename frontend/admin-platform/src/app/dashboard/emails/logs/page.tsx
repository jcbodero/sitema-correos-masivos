'use client'

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client'
import EmailLogsPage from '@/components/emails/EmailLogsPage'

export default withPageAuthRequired(function EmailLogs() {
  return <EmailLogsPage />
})