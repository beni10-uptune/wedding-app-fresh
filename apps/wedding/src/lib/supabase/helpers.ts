import { createClient } from './client'
import { createClient as createServerClient, createAdminClient } from './server'
import type { Database } from './types'

type Wedding = Database['public']['Tables']['weddings']['Row']
type Song = Database['public']['Tables']['songs']['Row']
type GuestSubmission = Database['public']['Tables']['guest_submissions']['Row']

// Client-side helpers (for components)
export const supabaseHelpers = {
  // Auth helpers
  async signUp(email: string, password: string, name?: string) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    })
    
    if (error) throw error
    
    // Create user profile
    if (data.user) {
      await supabase.from('users').insert({
        id: data.user.id,
        email: data.user.email!,
        name
      })
    }
    
    return data
  },

  async signIn(email: string, password: string) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  },

  async signOut() {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getUser() {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  // Wedding helpers
  async getWedding(id: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('weddings')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Wedding
  },

  async getWeddingBySlug(slug: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('weddings')
      .select('*')
      .eq('slug', slug)
      .single()
    
    if (error) throw error
    return data as Wedding
  },

  async createWedding(wedding: Partial<Database['public']['Tables']['weddings']['Insert']>) {
    const supabase = createClient()
    const user = await this.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('weddings')
      .insert({
        ...wedding,
        owner_id: user.id,
        guest_code: Math.random().toString(36).substring(2, 8).toUpperCase(),
        co_owner_code: Math.random().toString(36).substring(2, 8).toUpperCase()
      })
      .select()
      .single()
    
    if (error) throw error
    return data as Wedding
  },

  async updateWedding(id: string, updates: Partial<Database['public']['Tables']['weddings']['Update']>) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('weddings')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Wedding
  },

  async updateTimeline(weddingId: string, timeline: any) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('weddings')
      .update({ timeline })
      .eq('id', weddingId)
      .select()
      .single()
    
    if (error) throw error
    return data as Wedding
  },

  // Song helpers
  async searchSpotifySongs(query: string) {
    // This still goes to our API route which calls Spotify
    const response = await fetch('/api/search-songs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    })
    
    if (!response.ok) throw new Error('Search failed')
    return response.json()
  },

  async upsertSong(song: Database['public']['Tables']['songs']['Insert']) {
    const supabase = createClient()
    
    // Use the database function for upsert
    const { data, error } = await supabase.rpc('upsert_song', {
      p_id: song.id,
      p_title: song.title,
      p_artist: song.artist,
      p_album: song.album,
      p_album_art: song.album_art,
      p_preview_url: song.preview_url,
      p_spotify_uri: song.spotify_uri,
      p_duration: song.duration,
      p_energy: song.energy,
      p_genres: song.genres,
      p_explicit: song.explicit || false,
      p_spotify_data: song.spotify_data
    })
    
    if (error) throw error
    return data as Song
  },

  async getSongsByGenres(genres: string[], limit = 100) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .contains('genres', genres)
      .limit(limit)
    
    if (error) throw error
    return data as Song[]
  },

  async getSongsForMoment(moment: string, energy?: { min: number, max: number }) {
    const supabase = createClient()
    let query = supabase
      .from('songs')
      .select('*')
      .contains('moments', [moment])
    
    if (energy) {
      query = query.gte('energy', energy.min).lte('energy', energy.max)
    }
    
    const { data, error } = await query.limit(100)
    if (error) throw error
    return data as Song[]
  },

  // Guest submission helpers
  async submitGuestSong(submission: Database['public']['Tables']['guest_submissions']['Insert']) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('guest_submissions')
      .insert(submission)
      .select()
      .single()
    
    if (error) throw error
    return data as GuestSubmission
  },

  async getGuestSubmissions(weddingId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('guest_submissions')
      .select('*')
      .eq('wedding_id', weddingId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as GuestSubmission[]
  },

  async updateSubmissionStatus(id: string, status: 'approved' | 'rejected') {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('guest_submissions')
      .update({ status })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as GuestSubmission
  },

  // Real-time subscriptions
  subscribeToWeddingChanges(weddingId: string, callback: (wedding: Wedding) => void) {
    const supabase = createClient()
    
    return supabase
      .channel(`wedding-${weddingId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'weddings',
        filter: `id=eq.${weddingId}`
      }, (payload) => {
        callback(payload.new as Wedding)
      })
      .subscribe()
  },

  subscribeToGuestSubmissions(weddingId: string, callback: (submission: GuestSubmission) => void) {
    const supabase = createClient()
    
    return supabase
      .channel(`submissions-${weddingId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'guest_submissions',
        filter: `wedding_id=eq.${weddingId}`
      }, (payload) => {
        callback(payload.new as GuestSubmission)
      })
      .subscribe()
  }
}

// Server-side helpers (for API routes)
export const serverHelpers = {
  async getWedding(id: string) {
    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from('weddings')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Wedding
  },

  async updateWedding(id: string, updates: any) {
    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from('weddings')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Wedding
  },

  // Admin functions
  async adminUpdatePaymentStatus(weddingId: string, status: 'free' | 'paid', tier: string) {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('weddings')
      .update({ 
        payment_status: status,
        tier
      })
      .eq('id', weddingId)
      .select()
      .single()
    
    if (error) throw error
    return data as Wedding
  }
}