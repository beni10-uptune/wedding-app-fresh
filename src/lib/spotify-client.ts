// Client-side Spotify functions

export async function searchSpotifyTracks(query: string, limit = 10) {
  try {
    const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}&limit=${limit}`)
    
    if (!response.ok) {
      console.error('Search API error:', response.status, response.statusText)
      throw new Error('Failed to search tracks')
    }
    
    const data = await response.json()
    
    if (data.error) {
      console.error('Search error:', data.error)
      throw new Error(data.error)
    }
    
    return data.tracks || []
  } catch (error) {
    console.error('Failed to search Spotify:', error)
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