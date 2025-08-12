'use client'

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client'
import CampaignDetailPage from '@/components/campaigns/CampaignDetailPage'

export default withPageAuthRequired(function CampaignDetail({ params }: { params: { id: string } }) {
  return <CampaignDetailPage campaignId={params.id} />
})