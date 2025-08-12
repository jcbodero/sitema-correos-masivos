'use client'

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client'
import TemplateDetailPage from '@/components/templates/TemplateDetailPage'

export default withPageAuthRequired(function TemplateDetail({ params }: { params: { id: string } }) {
  return <TemplateDetailPage templateId={params.id} />
})