import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function authenticateSupabaseRequest(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Get the session from Supabase
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      // Try to get the token from Authorization header as fallback
      const authHeader = request.headers.get('authorization')
      
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split('Bearer ')[1]
        
        // Set the session with the token
        const { data: { user: headerUser }, error: headerError } = await supabase.auth.getUser(token)
        
        if (!headerError && headerUser) {
          return {
            authenticated: true,
            error: null,
            user: {
              uid: headerUser.id,
              id: headerUser.id,
              email: headerUser.email || '',
              emailVerified: headerUser.email_confirmed_at !== null
            }
          }
        }
      }
      
      return {
        authenticated: false,
        error: error?.message || 'No authenticated user found',
        user: null
      }
    }
    
    return {
      authenticated: true,
      error: null,
      user: {
        uid: user.id, // Keep uid for backwards compatibility
        id: user.id,
        email: user.email || '',
        emailVerified: user.email_confirmed_at !== null
      }
    }
  } catch (error) {
    console.error('[Supabase Auth Middleware] Error:', error)
    return {
      authenticated: false,
      error: error instanceof Error ? error.message : 'Authentication error',
      user: null
    }
  }
}

export function createAuthResponse(message: string, status: number) {
  return NextResponse.json(
    { error: message },
    { 
      status,
      headers: {
        'WWW-Authenticate': 'Bearer realm="api"'
      }
    }
  )
}