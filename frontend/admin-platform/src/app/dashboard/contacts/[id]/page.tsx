'use client'

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client'
import ContactDetailPage from '@/components/contacts/ContactDetailPage'

export default withPageAuthRequired(function ContactDetail({ params }: { params: { id: string } }) {
  return <ContactDetailPage contactId={params.id} />
})