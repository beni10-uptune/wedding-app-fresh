import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/firebase-admin'

export async function authenticateRequest(request: NextRequest) {
  try {
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
      const decodedToken = await auth.verifyIdToken(token)
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