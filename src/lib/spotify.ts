import { SpotifyApi } from '@spotify/web-api-ts-sdk'

// Client credentials flow for public data (searching, previews)
let spotifyClient: SpotifyApi | null = null

export async function getSpotifyClient() {
  if (spotifyClient) return spotifyClient

  try {
    // For client credentials flow (server-side)
    const response = await fetch('/api/spotify/token')
    const data = await response.json()
    
    if (data.access_token) {
      // Use the client ID from the response or environment variable
      const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || data.client_id || 'your-spotify-client-id'
      
      spotifyClient = SpotifyApi.withAccessToken(
        clientId,
        data.access_token
      )
      return spotifyClient
    }
  } catch (error) {
    console.error('Failed to initialize Spotify client:', error)
  }
  
  return null
}

// Search for tracks
export async function searchSpotifyTracks(query: string, limit = 10) {
  const client = await getSpotifyClient()
  if (!client) return []

  try {
    const results = await client.search(query, ['track'], 'US', limit as 10)
    return results.tracks.items.map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists.map(a => a.name).join(', '),
      album: track.album.name,
      duration_ms: track.duration_ms,
      preview_url: track.preview_url,
      external_urls: track.external_urls,
      uri: track.uri,
      image: track.album.images[0]?.url
    }))
  } catch (error) {
    console.error('Spotify search error:', error)
    return []
  }
}

// Get track by ID
export async function getSpotifyTrack(trackId: string) {
  const client = await getSpotifyClient()
  if (!client) return null

  try {
    const track = await client.tracks.get(trackId)
    return {
      id: track.id,
      name: track.name,
      artist: track.artists.map(a => a.name).join(', '),
      album: track.album.name,
      duration_ms: track.duration_ms,
      preview_url: track.preview_url,
      external_urls: track.external_urls,
      uri: track.uri,
      image: track.album.images[0]?.url
    }
  } catch (error) {
    console.error('Spotify track fetch error:', error)
    return null
  }
}

// Authorization URL for user authentication (needed for playlist creation)
export function getSpotifyAuthUrl(state: string) {
  const scopes = [
    'playlist-modify-public',
    'playlist-modify-private',
    'user-read-private',
    'user-read-email'
  ]

  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!,
    response_type: 'code',
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/spotify/callback`,
    state: state,
    scope: scopes.join(' ')
  })

  return `https://accounts.spotify.com/authorize?${params.toString()}`
}

// Format duration from milliseconds to mm:ss
export function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}