import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0'
import { NextRequest, NextResponse } from 'next/server'

export const GET = withApiAuthRequired(async function handler(req: NextRequest, res: NextResponse) {
  try {
    const { accessToken } = await getAccessToken(req, res)
    return NextResponse.json({ accessToken })
  } catch (error) {
    console.error('Error getting access token:', error)
    return NextResponse.json({ error: 'Failed to get access token' }, { status: 500 })
  }
})