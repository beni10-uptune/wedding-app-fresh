import { NextRequest, NextResponse } from 'next/server'
import { logger, logError } from '@/lib/logger'
import { ALL_WEDDING_SONGS } from '@/data/spotify-wedding-songs'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')
  const limit = parseInt(searchParams.get('limit') || '10')

  if (!query) {
    return NextResponse.json({ error: 'Query parameter required' }, { status: 400 })
  }
  
  // First, search in our local database
  const queryLower = query.toLowerCase()
  const localResults = (ALL_WEDDING_SONGS || []).filter(song => {
    return song.title.toLowerCase().includes(queryLower) ||
           song.artist.toLowerCase().includes(queryLower) ||
           song.album?.toLowerCase().includes(queryLower)
  }).slice(0, limit).map(song => ({
    id: song.id,
    name: song.title,
    artist: song.artist,
    album: song.album || '',
    duration_ms: (song.duration || 0) * 1000,
    preview_url: song.previewUrl || null,
    image: song.albumImage || song.albumArt || null,
    explicit: song.explicit || false,
    fromLocal: true
  }))
  
  // If we have enough local results, return them immediately
  if (localResults.length >= limit) {
    return NextResponse.json({ tracks: localResults, source: 'local' })
  }

  // Check if credentials are available
  if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
    logger.warn('Spotify credentials not configured')
    return NextResponse.json({ 
      tracks: [],
      demo: true,
      message: 'Spotify credentials not configured' 
    })
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
      logger.error('Spotify token error', { status: tokenResponse.status, error: errorText })
      throw new Error(`Failed to get Spotify token: ${tokenResponse.status}`)
    }

    const tokenData = await tokenResponse.json()

    if (!tokenData.access_token) {
      logger.error('No access token in response', { response: tokenData })
      throw new Error('Failed to get Spotify access token')
    }


    // Search for tracks using direct API call instead of SDK
    const searchResponse = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}&market=US`,
      {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`
        }
      }
    )

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text()
      logger.error('Spotify search API error', { status: searchResponse.status, error: errorText })
      throw new Error(`Spotify search failed: ${searchResponse.status}`)
    }

    const searchData = await searchResponse.json()
    
    const tracks = searchData.tracks.items.map((track: any) => ({
      id: track.id,
      name: track.name,
      artist: track.artists.map((a: any) => a.name).join(', '),
      album: track.album.name,
      duration_ms: track.duration_ms,
      preview_url: track.preview_url,
      image: track.album.images[0]?.url,
      explicit: track.explicit
    }))

    // Combine local and Spotify results, avoiding duplicates
    const spotifyTrackIds = new Set(tracks.map((t: any) => t.id))
    const combinedTracks = [
      ...localResults.filter(t => !spotifyTrackIds.has(t.id)),
      ...tracks
    ].slice(0, limit)
    
    return NextResponse.json({ tracks: combinedTracks, source: 'combined' })
  } catch (error) {
    logError(error, { context: 'Spotify search failed', query })
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { 
        error: 'Failed to search Spotify',
        details: errorMessage,
        credentials: {
          hasClientId: !!process.env.SPOTIFY_CLIENT_ID,
          hasClientSecret: !!process.env.SPOTIFY_CLIENT_SECRET
        }
      },
      { status: 500 }
    )
  }
}