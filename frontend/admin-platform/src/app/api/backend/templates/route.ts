import { NextRequest, NextResponse } from 'next/server'
import { getAccessToken } from '@auth0/nextjs-auth0'
import axios from 'axios'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080'

export async function GET(request: NextRequest) {
  try {
    const { accessToken } = await getAccessToken()
    const { searchParams } = new URL(request.url)
    
    const params = new URLSearchParams()
    searchParams.forEach((value, key) => {
      params.append(key, value)
    })
    
    const response = await axios.get(`${BACKEND_URL}/api/templates?${params}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Template API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await getAccessToken()
    const body = await request.json()
    
    const response = await axios.post(`${BACKEND_URL}/api/templates`, body, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Template creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    )
  }
}