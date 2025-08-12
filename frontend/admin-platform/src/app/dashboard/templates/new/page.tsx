'use client'

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client'
import TemplateEditor from '@/components/templates/TemplateEditor'

export default withPageAuthRequired(function NewTemplate() {
  return <TemplateEditor />
})