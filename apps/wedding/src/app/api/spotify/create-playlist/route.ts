import { NextRequest, NextResponse } from 'next/server'
import { SpotifyApi } from '@spotify/web-api-ts-sdk'

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing authorization token' }, { status: 401 })
    }

    const accessToken = authHeader.substring(7)
    const { name, description, trackUris, weddingId, momentId } = await request.json()

    // Validate required fields
    if (!name || !trackUris || trackUris.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create Spotify client with user's access token
    const spotifyClient = SpotifyApi.withAccessToken(
      process.env.SPOTIFY_CLIENT_ID!,
      {
        access_token: accessToken,
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: ''
      } as any
    )

    // Get user's Spotify profile
    const profile = await spotifyClient.currentUser.profile()

    // Create playlist
    const playlist = await spotifyClient.playlists.createPlaylist(
      profile.id,
      {
        name: name,
        description: description || `Created with UpTune`,
        public: false
      }
    )

    // Add tracks to playlist (Spotify limits to 100 tracks per request)
    if (trackUris.length > 0) {
      const chunks = []
      for (let i = 0; i < trackUris.length; i += 100) {
        chunks.push(trackUris.slice(i, i + 100))
      }

      for (const chunk of chunks) {
        await spotifyClient.playlists.addItemsToPlaylist(
          playlist.id,
          chunk
        )
      }
    }

    return NextResponse.json({
      success: true,
      playlistId: playlist.id,
      playlistUrl: playlist.external_urls.spotify,
      totalTracks: trackUris.length
    })
  } catch (error: any) {
    console.error('Create playlist error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create playlist' },
      { status: 500 }
    )
  }
}