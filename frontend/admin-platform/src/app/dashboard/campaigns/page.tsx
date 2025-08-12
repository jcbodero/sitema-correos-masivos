'use client'

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client'
import CampaignsPage from '@/components/campaigns/CampaignsPage'

export default withPageAuthRequired(function Campaigns() {
  return <CampaignsPage />
})