import { SpotifyApi } from '@spotify/web-api-ts-sdk'
import { logger, logError } from './logger'

// Client credentials flow for public data (searching, previews)
let spotifyClient: SpotifyApi | null = null

export async function getSpotifyClient() {
  // Always get a fresh client to avoid caching issues
  spotifyClient = null

  try {
    // For client credentials flow (server-side)
    const response = await fetch('/api/spotify/token')
    const data = await response.json()
    
    if (data.demo_mode) {
      logger.info('Running in Spotify demo mode')
      return null
    }
    
    if (data.access_token && data.access_token !== 'demo_token') {
      // Use the client ID from the response
      const clientId = data.client_id || 'your-spotify-client-id'
      
      spotifyClient = SpotifyApi.withAccessToken(
        clientId,
        data.access_token
      )
      return spotifyClient
    }
  } catch (error) {
    logError(error, { context: 'Failed to initialize Spotify client' })
  }
  
  return null
}

// Search for tracks
export async function searchSpotifyTracks(query: string, limit = 10) {
  try {
    const client = await getSpotifyClient()
    
    // Demo mode - return mock results
    if (!client) {
      logger.debug('No Spotify client available, using mock results')
      return getMockSearchResults(query, limit)
    }

    logger.debug('Searching Spotify', { query, limit })
    const results = await client.search(query, ['track'], 'US', limit as 10)
    logger.debug('Spotify search completed', { resultCount: results.tracks.items.length })
    
    return results.tracks.items.map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists.map(a => a.name).join(', '),
      album: track.album.name,
      duration_ms: track.duration_ms,
      preview_url: track.preview_url,
      external_urls: track.external_urls,
      uri: track.uri,
      image: track.album.images[0]?.url,
      explicit: track.explicit
    }))
  } catch (error) {
    logError(error, { context: 'Spotify search error', query })
    return getMockSearchResults(query, limit)
  }
}

// Mock search results for demo mode
function getMockSearchResults(query: string, limit: number) {
  const mockTracks = [
    {
      id: 'demo1',
      name: 'Perfect',
      artist: 'Ed Sheeran',
      album: '÷ (Divide)',
      duration_ms: 263000,
      preview_url: null,
      external_urls: { spotify: '#' },
      uri: 'spotify:track:demo1',
      image: '/api/placeholder/300/300',
      explicit: false
    },
    {
      id: 'demo2',
      name: 'Thinking Out Loud',
      artist: 'Ed Sheeran',
      album: 'x',
      duration_ms: 281000,
      preview_url: null,
      external_urls: { spotify: '#' },
      uri: 'spotify:track:demo2',
      image: '/api/placeholder/300/300',
      explicit: false
    },
    {
      id: 'demo3',
      name: 'All of Me',
      artist: 'John Legend',
      album: 'Love in the Future',
      duration_ms: 269000,
      preview_url: null,
      external_urls: { spotify: '#' },
      uri: 'spotify:track:demo3',
      image: '/api/placeholder/300/300',
      explicit: false
    },
    {
      id: 'demo4',
      name: 'A Thousand Years',
      artist: 'Christina Perri',
      album: 'The Twilight Saga',
      duration_ms: 295000,
      preview_url: null,
      external_urls: { spotify: '#' },
      uri: 'spotify:track:demo4',
      image: '/api/placeholder/300/300',
      explicit: false
    },
    {
      id: 'demo5',
      name: 'Marry You',
      artist: 'Bruno Mars',
      album: 'Doo-Wops & Hooligans',
      duration_ms: 230000,
      preview_url: null,
      external_urls: { spotify: '#' },
      uri: 'spotify:track:demo5',
      image: '/api/placeholder/300/300',
      explicit: false
    },
    {
      id: 'demo6',
      name: 'Can\'t Help Falling in Love',
      artist: 'Elvis Presley',
      album: 'Blue Hawaii',
      duration_ms: 181000,
      preview_url: null,
      external_urls: { spotify: '#' },
      uri: 'spotify:track:demo6',
      image: '/api/placeholder/300/300',
      explicit: false
    },
    {
      id: 'demo7',
      name: 'Uptown Funk',
      artist: 'Mark Ronson ft. Bruno Mars',
      album: 'Uptown Special',
      duration_ms: 270000,
      preview_url: null,
      external_urls: { spotify: '#' },
      uri: 'spotify:track:demo7',
      image: '/api/placeholder/300/300',
      explicit: false
    },
    {
      id: 'demo8',
      name: 'I Wanna Dance with Somebody',
      artist: 'Whitney Houston',
      album: 'Whitney',
      duration_ms: 295000,
      preview_url: null,
      external_urls: { spotify: '#' },
      uri: 'spotify:track:demo8',
      image: '/api/placeholder/300/300',
      explicit: false
    }
  ]

  // Simple search matching
  const filtered = mockTracks.filter(track => 
    track.name.toLowerCase().includes(query.toLowerCase()) ||
    track.artist.toLowerCase().includes(query.toLowerCase()) ||
    track.album.toLowerCase().includes(query.toLowerCase())
  )

  const results = filtered.length > 0 ? filtered : mockTracks

  return results.slice(0, limit)
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
    logError(error, { context: 'Spotify track fetch error', trackId })
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
    client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || '',
    response_type: 'code',
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/api/spotify/callback`,
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