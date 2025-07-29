// Client-side Spotify functions
import { logger, logError } from './logger'

export async function searchSpotifyTracks(query: string, limit = 10) {
  try {
    const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}&limit=${limit}`)
    
    if (!response.ok) {
      logger.error('Search API error', { status: response.status, statusText: response.statusText })
      throw new Error('Failed to search tracks')
    }
    
    const data = await response.json()
    
    if (data.error) {
      logger.error('Search error', { error: data.error, details: data.details, credentials: data.credentials })
      throw new Error(data.error)
    }
    
    return data.tracks || []
  } catch (error) {
    logError(error, { context: 'Failed to search Spotify', query })
    // Return empty array instead of throwing
    return []
  }
}

// Format duration from milliseconds to mm:ss
export function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}