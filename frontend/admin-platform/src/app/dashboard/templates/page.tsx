'use client'

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client'
import TemplatesPage from '@/components/templates/TemplatesPage'

export default withPageAuthRequired(function Templates() {
  return <TemplatesPage />
})