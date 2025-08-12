'use client'

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client'
import ContactListsPage from '@/components/contacts/ContactListsPage'

export default withPageAuthRequired(function ContactLists() {
  return <ContactListsPage />
})