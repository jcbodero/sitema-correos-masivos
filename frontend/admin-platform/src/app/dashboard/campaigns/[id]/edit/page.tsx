'use client'

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client'
import CampaignWizard from '@/components/campaigns/CampaignWizard'

export default withPageAuthRequired(function EditCampaign({ params }: { params: { id: string } }) {
  return <CampaignWizard campaignId={params.id} />
})