import { NextRequest, NextResponse } from 'next/server'
import { getAccessToken } from '@auth0/nextjs-auth0'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { accessToken } = await getAccessToken()
    
    const response = await fetch(`${BACKEND_URL}/api/templates/${params.id}/activate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`)
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Template activate error:', error)
    return NextResponse.json(
      { error: 'Failed to activate template' },
      { status: 500 }
    )
  }
}