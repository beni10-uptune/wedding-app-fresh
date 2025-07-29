import { useAuth } from '@/contexts/AuthContext'
import { auth } from '@/lib/firebase'

interface FetchOptions extends RequestInit {
  requireAuth?: boolean
}

export function useAuthenticatedFetch() {
  const { user } = useAuth()

  const authenticatedFetch = async (url: string, options: FetchOptions = {}) => {
    const { requireAuth = true, ...fetchOptions } = options

    // Get the current user's ID token
    let headers = fetchOptions.headers || {}
    
    if (requireAuth && user) {
      try {
        const token = await auth.currentUser?.getIdToken()
        if (token) {
          headers = {
            ...headers,
            'Authorization': `Bearer ${token}`
          }
        }
      } catch (error) {
        console.error('Error getting auth token:', error)
      }
    }

    const response = await fetch(url, {
      ...fetchOptions,
      headers
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  return { authenticatedFetch }
}