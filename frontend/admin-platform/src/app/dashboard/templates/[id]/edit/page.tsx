'use client'

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client'
import { use } from 'react'
import TemplateEditor from '@/components/templates/TemplateEditor'

export default withPageAuthRequired(function EditTemplate({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return <TemplateEditor templateId={id} />
})