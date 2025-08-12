'use client'

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client'
import ContactsPage from '@/components/contacts/ContactsPage'

export default withPageAuthRequired(function Contacts() {
  return <ContactsPage />
})