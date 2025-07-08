import { NextResponse } from 'next/server'

// Cache token in memory with expiration
let tokenCache: { access_token: string; expires_at: number } | null = null

export async function GET() {
  try {
    // Check if we have a valid cached token
    if (tokenCache && tokenCache.expires_at > Date.now()) {
      return NextResponse.json({ 
        access_token: tokenCache.access_token,
        client_id: process.env.SPOTIFY_CLIENT_ID 
      })
    }

    // Get new token using client credentials flow
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString('base64')
      },
      body: 'grant_type=client_credentials'
    })

    if (!response.ok) {
      throw new Error('Failed to get Spotify token')
    }

    const data = await response.json()
    
    // Cache the token with expiration
    tokenCache = {
      access_token: data.access_token,
      expires_at: Date.now() + (data.expires_in * 1000) - 60000 // Subtract 1 minute for safety
    }

    return NextResponse.json({ 
      access_token: data.access_token,
      client_id: process.env.SPOTIFY_CLIENT_ID 
    })
  } catch (error) {
    console.error('Spotify token error:', error)
    return NextResponse.json(
      { error: 'Failed to get Spotify access token' },
      { status: 500 }
    )
  }
}