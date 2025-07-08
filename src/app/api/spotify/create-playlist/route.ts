import { NextRequest, NextResponse } from 'next/server'
import { SpotifyApi } from '@spotify/web-api-ts-sdk'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function POST(request: NextRequest) {
  try {
    const { userId, weddingId, playlistName, description, trackUris } = await request.json()

    // Get user's Spotify tokens
    const userDoc = await getDoc(doc(db, 'users', userId))
    if (!userDoc.exists()) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userData = userDoc.data()
    if (!userData.spotifyTokens) {
      return NextResponse.json({ error: 'Spotify not connected' }, { status: 401 })
    }

    // Check if token is expired and refresh if needed
    let accessToken = userData.spotifyTokens.access_token
    if (userData.spotifyTokens.expires_at < Date.now()) {
      const refreshResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString('base64')
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: userData.spotifyTokens.refresh_token
        })
      })

      if (!refreshResponse.ok) {
        return NextResponse.json({ error: 'Failed to refresh token' }, { status: 401 })
      }

      const refreshData = await refreshResponse.json()
      accessToken = refreshData.access_token

      // Update stored tokens
      await updateDoc(doc(db, 'users', userId), {
        'spotifyTokens.access_token': accessToken,
        'spotifyTokens.expires_at': Date.now() + (refreshData.expires_in * 1000)
      })
    }

    // Create Spotify client with user's access token
    const spotifyClient = SpotifyApi.withAccessToken(
      process.env.SPOTIFY_CLIENT_ID!,
      accessToken
    )

    // Get user's Spotify profile
    const profile = await spotifyClient.currentUser.profile()

    // Create playlist
    const playlist = await spotifyClient.playlists.create(
      profile.id,
      {
        name: playlistName,
        description: description,
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