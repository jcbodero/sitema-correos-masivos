import { useUser, useAccessToken } from '@auth0/nextjs-auth0/client'
import { useCallback } from 'react'
import axios from 'axios'

const API_BASE_URL = '/api/backend'

export function useApi() {
  const { user, isLoading } = useUser()
  const { accessToken, isLoading: tokenLoading } = useAccessToken()

  const apiCall = useCallback(async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    if (isLoading || tokenLoading) {
      throw new Error('Authentication is loading')
    }

    const url = `${API_BASE_URL}${endpoint}`
    
    const config: any = {
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await axios(url, {
        ...config,
        withCredentials: false
      })
      
      return response.data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }, [accessToken, isLoading, tokenLoading])

  return { apiCall, user, isLoading: isLoading || tokenLoading, accessToken }
}