import { NextResponse } from 'next/server'

export async function GET() {
  // Check if credentials are available
  const hasClientId = !!process.env.SPOTIFY_CLIENT_ID
  const hasClientSecret = !!process.env.SPOTIFY_CLIENT_SECRET
  
  if (!hasClientId || !hasClientSecret) {
    return NextResponse.json({ 
      error: 'Spotify credentials not configured',
      hasClientId,
      hasClientSecret
    }, { status: 500 })
  }

  try {
    // Get access token using client credentials
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString('base64')
      },
      body: 'grant_type=client_credentials'
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      return NextResponse.json({ 
        error: 'Failed to get Spotify token',
        status: tokenResponse.status,
        details: errorText
      }, { status: 500 })
    }

    const tokenData = await tokenResponse.json()

    // Test search
    const searchResponse = await fetch(
      `https://api.spotify.com/v1/search?q=perfect&type=track&limit=1&market=US`,
      {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`
        }
      }
    )

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text()
      return NextResponse.json({ 
        error: 'Search failed',
        status: searchResponse.status,
        details: errorText
      }, { status: 500 })
    }

    const searchData = await searchResponse.json()
    
    return NextResponse.json({ 
      success: true,
      tokenReceived: !!tokenData.access_token,
      searchResultCount: searchData.tracks?.items?.length || 0,
      firstTrack: searchData.tracks?.items?.[0] ? {
        name: searchData.tracks.items[0].name,
        artist: searchData.tracks.items[0].artists[0]?.name
      } : null
    })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}