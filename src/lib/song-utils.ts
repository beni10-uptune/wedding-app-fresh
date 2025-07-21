import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export interface SongData {
  spotify_id: string
  title: string
  artist: string
  album?: string
  duration_ms?: number
  preview_url?: string | null
  image?: string
}

/**
 * Check if a song already exists in a playlist
 */
export async function checkDuplicateSong(
  weddingId: string, 
  playlistId: string, 
  spotifyId: string
): Promise<boolean> {
  try {
    const songsRef = collection(db, 'weddings', weddingId, 'playlists', playlistId, 'songs')
    const q = query(songsRef, where('spotify_id', '==', spotifyId))
    const snapshot = await getDocs(q)
    
    return !snapshot.empty
  } catch (error) {
    console.error('Error checking duplicate song:', error)
    return false
  }
}

/**
 * Format song duration from milliseconds to MM:SS
 */
export function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

/**
 * Calculate total playlist duration
 */
export function calculatePlaylistDuration(songs: SongData[]): {
  totalMs: number
  formatted: string
} {
  const totalMs = songs.reduce((acc, song) => acc + (song.duration_ms || 0), 0)
  const hours = Math.floor(totalMs / 3600000)
  const minutes = Math.floor((totalMs % 3600000) / 60000)
  
  let formatted = ''
  if (hours > 0) {
    formatted = `${hours}h ${minutes}m`
  } else {
    formatted = `${minutes}m`
  }
  
  return { totalMs, formatted }
}

/**
 * Validate song data before adding
 */
export function validateSongData(song: Partial<SongData>): string | null {
  if (!song.spotify_id) {
    return 'Song ID is required'
  }
  
  if (!song.title || song.title.trim().length === 0) {
    return 'Song title is required'
  }
  
  if (!song.artist || song.artist.trim().length === 0) {
    return 'Artist name is required'
  }
  
  if (song.duration_ms && (song.duration_ms < 0 || song.duration_ms > 3600000)) {
    return 'Invalid song duration'
  }
  
  return null
}