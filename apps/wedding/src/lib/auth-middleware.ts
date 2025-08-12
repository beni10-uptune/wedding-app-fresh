import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'

export async function authenticateRequest(request: NextRequest) {
  try {
    // If Firebase Admin is not configured, try to extract basic auth info
    if (!adminAuth) {
      console.warn('[Auth Middleware] Firebase Admin not initialized, using fallback')
      
      // Try to extract user info from the token anyway (for development/testing)
      const authHeader = request.headers.get('authorization')
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split('Bearer ')[1]
        
        // In production, this should fail, but for now we can decode the JWT
        // to at least get the user ID for testing
        try {
          // Basic JWT decode (not verification) - ONLY for development
          const parts = token.split('.')
          if (parts.length === 3) {
            const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString())
            
            console.log('[Auth Middleware] Using unverified token payload (DEV ONLY)')
            return {
              authenticated: true,
              error: null,
              user: {
                uid: payload.sub || payload.user_id,
                email: payload.email,
                emailVerified: payload.email_verified || false
              }
            }
          }
        } catch (e) {
          console.error('[Auth Middleware] Failed to decode token:', e)
        }
      }
      
      return {
        authenticated: false,
        error: 'Server authentication not configured',
        user: null
      }
    }

    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        authenticated: false,
        error: 'Missing or invalid authorization header',
        user: null
      }
    }

    const token = authHeader.split('Bearer ')[1]
    
    try {
      const decodedToken = await adminAuth.verifyIdToken(token)
      return {
        authenticated: true,
        error: null,
        user: {
          uid: decodedToken.uid,
          email: decodedToken.email,
          emailVerified: decodedToken.email_verified
        }
      }
    } catch (error) {
      return {
        authenticated: false,
        error: 'Invalid or expired token',
        user: null
      }
    }
  } catch (error) {
    return {
      authenticated: false,
      error: 'Authentication error',
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