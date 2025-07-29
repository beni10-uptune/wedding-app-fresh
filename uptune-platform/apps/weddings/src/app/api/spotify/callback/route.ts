import { NextRequest, NextResponse } from 'next/server'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state') // Contains userId and weddingId
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/wedding/${state}?spotify_error=${error}`
    )
  }

  if (!code || !state) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}?error=invalid_callback`
    )
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString('base64')
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/spotify/callback`
      })
    })

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token')
    }

    const tokenData = await tokenResponse.json()
    
    // Parse state - could be base64 encoded JSON or simple string
    let stateData: { userId?: string; weddingId?: string; action?: string; moments?: string[] } = {}
    try {
      // Try to decode as base64 JSON first
      const decoded = Buffer.from(state, 'base64').toString('utf-8')
      stateData = JSON.parse(decoded)
    } catch {
      // Fall back to simple string parsing
      const [userId, weddingId] = state.split(':')
      stateData = { userId, weddingId }
    }

    // If we have a userId, store the tokens
    if (stateData.userId) {
      await updateDoc(doc(db, 'users', stateData.userId), {
        spotifyTokens: {
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          expires_at: Date.now() + (tokenData.expires_in * 1000),
          scope: tokenData.scope
        },
        spotifyConnected: true,
        updatedAt: new Date()
      })
    }

    // Handle different actions based on state
    if (stateData.action === 'export') {
      // For export action, redirect back to builder with token in URL
      const redirectUrl = new URL(`${process.env.NEXT_PUBLIC_APP_URL}/wedding/${stateData.weddingId}/builder`)
      redirectUrl.searchParams.set('spotify_token', tokenData.access_token)
      redirectUrl.searchParams.set('export_moments', JSON.stringify(stateData.moments || []))
      return NextResponse.redirect(redirectUrl.toString())
    } else {
      // Default redirect to wedding page
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/wedding/${stateData.weddingId || state}?spotify_connected=true`
      )
    }
  } catch (error) {
    console.error('Spotify callback error:', error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/wedding/${state}?spotify_error=auth_failed`
    )
  }
}