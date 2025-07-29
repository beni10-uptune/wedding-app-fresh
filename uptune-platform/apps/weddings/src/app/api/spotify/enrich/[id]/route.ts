import { NextRequest, NextResponse } from 'next/server'
import { logger, logError } from '@/lib/logger'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: spotifyId } = await params

  if (!spotifyId) {
    return NextResponse.json({ error: 'Song ID required' }, { status: 400 })
  }

  // Check if credentials are available
  if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
    logger.warn('Spotify credentials not configured for enrichment')
    return NextResponse.json({ 
      error: 'Spotify credentials not configured',
      audioFeatures: null,
      popularity: null,
      releaseDate: null,
      genres: []
    })
  }

  try {
    // Get access token
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
      throw new Error(`Failed to get Spotify token: ${tokenResponse.status}`)
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Fetch track details
    const trackResponse = await fetch(
      `https://api.spotify.com/v1/tracks/${spotifyId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    )

    if (!trackResponse.ok) {
      logger.error('Failed to fetch track details', { status: trackResponse.status })
      return NextResponse.json({ 
        error: 'Track not found',
        audioFeatures: null,
        popularity: null,
        releaseDate: null,
        genres: []
      })
    }

    const trackData = await trackResponse.json()

    // Try to fetch audio features (may fail with 403)
    let audioFeatures = null
    try {
      const featuresResponse = await fetch(
        `https://api.spotify.com/v1/audio-features/${spotifyId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      )

      if (featuresResponse.ok) {
        const featuresData = await featuresResponse.json()
        audioFeatures = {
          tempo: featuresData.tempo,
          energy: featuresData.energy,
          danceability: featuresData.danceability,
          valence: featuresData.valence,
          acousticness: featuresData.acousticness,
          instrumentalness: featuresData.instrumentalness,
          speechiness: featuresData.speechiness,
          liveness: featuresData.liveness
        }
      }
    } catch (error) {
      logger.warn('Could not fetch audio features', { error })
    }

    // Try to fetch artist genres
    let genres: string[] = []
    if (trackData.artists && trackData.artists.length > 0) {
      try {
        const artistResponse = await fetch(
          `https://api.spotify.com/v1/artists/${trackData.artists[0].id}`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          }
        )

        if (artistResponse.ok) {
          const artistData = await artistResponse.json()
          genres = artistData.genres || []
        }
      } catch (error) {
        logger.warn('Could not fetch artist genres', { error })
      }
    }

    // Return enrichment data
    return NextResponse.json({
      audioFeatures,
      popularity: trackData.popularity,
      releaseDate: trackData.album.release_date,
      genres,
      albumImages: trackData.album.images,
      artistNames: trackData.artists.map((a: any) => a.name),
      explicit: trackData.explicit,
      markets: trackData.available_markets
    })
  } catch (error) {
    logError(error, { context: 'Spotify enrichment failed', spotifyId })
    return NextResponse.json(
      { 
        error: 'Failed to enrich song data',
        audioFeatures: null,
        popularity: null,
        releaseDate: null,
        genres: []
      },
      { status: 500 }
    )
  }
}