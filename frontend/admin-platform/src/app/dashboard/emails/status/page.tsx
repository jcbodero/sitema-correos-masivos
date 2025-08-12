'use client'

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client'
import EmailStatusPage from '@/components/emails/EmailStatusPage'

export default withPageAuthRequired(function EmailStatus() {
  return <EmailStatusPage />
})