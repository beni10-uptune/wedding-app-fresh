/**
 * Song helpers for Supabase
 * Handles adding songs from Spotify searches to our database
 */

import { createClient } from './client'
import type { Database } from './types'

type Song = Database['public']['Tables']['songs']['Row']

export const songHelpers = {
  /**
   * Add a song to the database when a user finds it via Spotify search
   * This ensures all songs users interact with are cached in our database
   */
  async upsertSong(songData: {
    id: string // Spotify track ID
    title: string
    artist: string
    album?: string
    albumArt?: string
    previewUrl?: string
    spotifyUri?: string
    duration?: number // in seconds
    explicit?: boolean
    popularity?: number
    genres?: string[]
  }) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('songs')
      .upsert({
        id: songData.id,
        title: songData.title,
        artist: songData.artist,
        album: songData.album || null,
        album_art: songData.albumArt || null,
        preview_url: songData.previewUrl || null,
        spotify_uri: songData.spotifyUri || `spotify:track:${songData.id}`,
        duration: songData.duration || null,
        explicit: songData.explicit || false,
        popularity: songData.popularity || 50,
        genres: songData.genres || [],
        contexts: ['wedding'], // Mark as wedding context since added via wedding app
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id',
        ignoreDuplicates: false // Update if exists
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error upserting song:', error)
      return null
    }
    
    return data as Song
  },

  /**
   * Add multiple songs at once (e.g., from a Spotify playlist import)
   */
  async upsertSongs(songs: Array<{
    id: string
    title: string
    artist: string
    album?: string
    albumArt?: string
    previewUrl?: string
    spotifyUri?: string
    duration?: number
    explicit?: boolean
    popularity?: number
    genres?: string[]
  }>) {
    const supabase = createClient()
    
    const songsToInsert = songs.map(song => ({
      id: song.id,
      title: song.title,
      artist: song.artist,
      album: song.album || null,
      album_art: song.albumArt || null,
      preview_url: song.previewUrl || null,
      spotify_uri: song.spotifyUri || `spotify:track:${song.id}`,
      duration: song.duration || null,
      explicit: song.explicit || false,
      popularity: song.popularity || 50,
      genres: song.genres || [],
      contexts: ['wedding'],
      updated_at: new Date().toISOString()
    }))
    
    const { data, error } = await supabase
      .from('songs')
      .upsert(songsToInsert, {
        onConflict: 'id',
        ignoreDuplicates: false
      })
      .select()
    
    if (error) {
      console.error('Error upserting songs:', error)
      return []
    }
    
    return data as Song[]
  },

  /**
   * Search songs in our database
   */
  async searchSongs(query: string, limit: number = 20) {
    const supabase = createClient()
    
    // Use PostgreSQL full-text search
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .or(`title.ilike.%${query}%,artist.ilike.%${query}%,album.ilike.%${query}%`)
      .limit(limit)
      .order('popularity', { ascending: false })
    
    if (error) {
      console.error('Error searching songs:', error)
      return []
    }
    
    return data as Song[]
  },

  /**
   * Get songs by genre
   */
  async getSongsByGenre(genres: string[], limit: number = 50) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .contains('genres', genres)
      .limit(limit)
      .order('popularity', { ascending: false })
    
    if (error) {
      console.error('Error getting songs by genre:', error)
      return []
    }
    
    return data as Song[]
  },

  /**
   * Get a specific song by ID
   */
  async getSong(id: string) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error getting song:', error)
      return null
    }
    
    return data as Song
  },

  /**
   * Track when a song is added to a wedding
   * Increments the playlist_count for analytics
   */
  async trackSongUsage(songId: string) {
    const supabase = createClient()
    
    // Increment playlist_count
    const { error } = await supabase.rpc('increment', {
      table_name: 'songs',
      column_name: 'playlist_count',
      row_id: songId
    })
    
    if (error) {
      console.error('Error tracking song usage:', error)
    }
  }
}