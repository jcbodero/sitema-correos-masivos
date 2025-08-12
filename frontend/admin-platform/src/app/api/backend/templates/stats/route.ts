import { NextRequest, NextResponse } from 'next/server'
import { getAccessToken } from '@auth0/nextjs-auth0'
import axios from 'axios'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080'

export async function GET(request: NextRequest) {
  try {
    const { accessToken } = await getAccessToken(request)
    const { searchParams } = new URL(request.url)
    
    const params = new URLSearchParams()
    searchParams.forEach((value, key) => {
      params.append(key, value)
    })
    
    const response = await axios.get(`${BACKEND_URL}/api/templates/stats?${params}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Template stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch template statistics' },
      { status: 500 }
    )
  }
}