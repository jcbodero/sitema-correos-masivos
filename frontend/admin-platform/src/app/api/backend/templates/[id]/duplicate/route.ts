import { NextRequest, NextResponse } from 'next/server'
import { getAccessToken } from '@auth0/nextjs-auth0'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { accessToken } = await getAccessToken()
    const body = await request.json()
    
    const response = await fetch(`${BACKEND_URL}/api/templates/${params.id}/duplicate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    
    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`)
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Template duplicate error:', error)
    return NextResponse.json(
      { error: 'Failed to duplicate template' },
      { status: 500 }
    )
  }
}