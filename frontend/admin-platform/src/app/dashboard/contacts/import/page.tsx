'use client'

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client'
import ContactImportPage from '@/components/contacts/ContactImportPage'

export default withPageAuthRequired(function ContactImport() {
  return <ContactImportPage />
})