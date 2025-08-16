/**
 * Wedding App Specific Supabase Helpers
 * These helpers are specific to the wedding app but use the shared Uptune database
 */

import { createClient } from './client'
import { createClient as createServerClient, createAdminClient } from './server'
import type { Database } from './types'

// Wedding-specific types
type Wedding = Database['public']['Tables']['wedding_weddings']['Row']
type GuestSubmission = Database['public']['Tables']['wedding_guest_submissions']['Row']
type WeddingTimeline = Database['public']['Tables']['wedding_timeline']['Row']
type WeddingVendor = Database['public']['Tables']['wedding_vendors']['Row']

export const weddingHelpers = {
  // ==========================================
  // Wedding Management
  // ==========================================
  
  async createWedding(data: {
    couple_names: string
    partner1_name?: string
    partner2_name?: string
    wedding_date?: string
    venue_type?: string
    guest_count?: number
  }) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Track app usage
    await supabase.rpc('track_app_usage', { p_app_name: 'wedding' })

    // Generate unique codes
    const generateCode = () => Math.random().toString(36).substring(2, 8).toUpperCase()
    
    // Create wedding with unique slug
    const slug = data.couple_names.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') + '-' + Date.now().toString(36)

    const { data: wedding, error } = await supabase
      .from('wedding_weddings')
      .insert({
        slug,
        couple_names: data.couple_names,
        partner1_name: data.partner1_name,
        partner2_name: data.partner2_name,
        wedding_date: data.wedding_date,
        venue_type: data.venue_type,
        guest_count: data.guest_count,
        owner_id: user.id,
        guest_code: generateCode(),
        co_owner_code: generateCode(),
        vendor_code: generateCode()
      })
      .select()
      .single()

    if (error) throw error

    // Create associated playlist
    const { data: playlist } = await supabase
      .from('playlists')
      .insert({
        owner_id: user.id,
        name: `${data.couple_names} Wedding Playlist`,
        description: `Wedding playlist for ${data.couple_names}`,
        source_app: 'wedding',
        source_id: wedding.id,
        playlist_type: 'wedding_timeline',
        is_public: false
      })
      .select()
      .single()

    // Update wedding with playlist ID
    if (playlist) {
      await supabase
        .from('wedding_weddings')
        .update({ main_playlist_id: playlist.id })
        .eq('id', wedding.id)
    }

    // Create activity
    await supabase.rpc('create_activity', {
      p_app_name: 'wedding',
      p_activity_type: 'wedding_created',
      p_title: `Created wedding planning for ${data.couple_names}`,
      p_reference_type: 'wedding',
      p_reference_id: wedding.id,
      p_is_public: false
    })

    return wedding as Wedding
  },

  async getWedding(id: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('wedding_weddings')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Wedding
  },

  async getWeddingBySlug(slug: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('wedding_weddings')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) throw error
    return data as Wedding
  },

  async getMyWeddings() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('wedding_weddings')
      .select('*')
      .or(`owner_id.eq.${user.id},co_owner_id.eq.${user.id}`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Wedding[]
  },

  async updateWedding(id: string, updates: Partial<Wedding>) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('wedding_weddings')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Wedding
  },

  // ==========================================
  // Timeline Management
  // ==========================================

  async getTimeline(weddingId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('wedding_timeline')
      .select('*')
      .eq('wedding_id', weddingId)
      .order('moment_order')

    if (error) throw error
    return data as WeddingTimeline[]
  },

  async updateTimelineMoment(
    weddingId: string,
    momentId: string,
    songIds: string[]
  ) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('wedding_timeline')
      .upsert({
        wedding_id: weddingId,
        moment_id: momentId,
        moment_name: momentId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        moment_order: getMomentOrder(momentId),
        song_ids: songIds
      }, {
        onConflict: 'wedding_id,moment_id'
      })
      .select()
      .single()

    if (error) throw error

    // Update main playlist with all songs
    await this.syncMainPlaylist(weddingId)

    return data as WeddingTimeline
  },

  async syncMainPlaylist(weddingId: string) {
    const supabase = createClient()
    
    // Get wedding and timeline
    const { data: wedding } = await supabase
      .from('wedding_weddings')
      .select('main_playlist_id')
      .eq('id', weddingId)
      .single()

    if (!wedding?.main_playlist_id) return

    const { data: timeline } = await supabase
      .from('wedding_timeline')
      .select('song_ids, moment_order')
      .eq('wedding_id', weddingId)
      .order('moment_order')

    if (!timeline) return

    // Flatten all songs in order
    const allSongIds = timeline.flatMap(t => t.song_ids || [])
    
    // Clear and rebuild playlist
    await supabase
      .from('playlist_songs')
      .delete()
      .eq('playlist_id', wedding.main_playlist_id)

    // Add songs in order
    const playlistSongs = allSongIds.map((songId, index) => ({
      playlist_id: wedding.main_playlist_id,
      song_id: songId,
      position: index + 1
    }))

    if (playlistSongs.length > 0) {
      await supabase
        .from('playlist_songs')
        .insert(playlistSongs)
    }

    // Update playlist stats
    await supabase
      .from('playlists')
      .update({ 
        song_count: allSongIds.length,
        updated_at: new Date().toISOString()
      })
      .eq('id', wedding.main_playlist_id)
  },

  // ==========================================
  // Guest Submissions
  // ==========================================

  async submitGuestSong(data: {
    wedding_id: string
    guest_name: string
    guest_email?: string
    table_number?: string
    song_id?: string
    song_title: string
    song_artist: string
    spotify_id?: string
    moment_suggestion?: string
    dedication?: string
    special_memory?: string
  }) {
    const supabase = createClient()
    
    const { data: submission, error } = await supabase
      .from('wedding_guest_submissions')
      .insert(data)
      .select()
      .single()

    if (error) throw error

    // Update wedding stats
    await supabase.rpc('increment', {
      table_name: 'wedding_weddings',
      column_name: 'guest_submissions',
      row_id: data.wedding_id
    })

    return submission as GuestSubmission
  },

  async getGuestSubmissions(weddingId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('wedding_guest_submissions')
      .select('*')
      .eq('wedding_id', weddingId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as GuestSubmission[]
  },

  async updateSubmissionStatus(
    id: string,
    status: 'approved' | 'rejected',
    rejectionReason?: string
  ) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    const { data, error } = await supabase
      .from('wedding_guest_submissions')
      .update({
        status,
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString(),
        rejection_reason: rejectionReason
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as GuestSubmission
  },

  // ==========================================
  // Vendor Management
  // ==========================================

  async inviteVendor(data: {
    wedding_id: string
    vendor_email: string
    vendor_name?: string
    vendor_type: string
    permissions?: {
      can_view_timeline?: boolean
      can_edit_timeline?: boolean
      can_export_playlist?: boolean
    }
  }) {
    const supabase = createClient()
    
    const { data: vendor, error } = await supabase
      .from('wedding_vendors')
      .insert({
        wedding_id: data.wedding_id,
        vendor_email: data.vendor_email,
        vendor_name: data.vendor_name,
        vendor_type: data.vendor_type,
        ...data.permissions
      })
      .select()
      .single()

    if (error) throw error

    // TODO: Send email invitation

    return vendor as WeddingVendor
  },

  // ==========================================
  // Real-time Subscriptions
  // ==========================================

  subscribeToWedding(weddingId: string, callback: (wedding: Wedding) => void) {
    const supabase = createClient()
    
    return supabase
      .channel(`wedding-${weddingId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'wedding_weddings',
        filter: `id=eq.${weddingId}`
      }, (payload) => {
        callback(payload.new as Wedding)
      })
      .subscribe()
  },

  subscribeToSubmissions(weddingId: string, callback: (submission: GuestSubmission) => void) {
    const supabase = createClient()
    
    return supabase
      .channel(`submissions-${weddingId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'wedding_guest_submissions',
        filter: `wedding_id=eq.${weddingId}`
      }, (payload) => {
        callback(payload.new as GuestSubmission)
      })
      .subscribe()
  },

  subscribeToTimeline(weddingId: string, callback: (timeline: WeddingTimeline[]) => void) {
    const supabase = createClient()
    
    return supabase
      .channel(`timeline-${weddingId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'wedding_timeline',
        filter: `wedding_id=eq.${weddingId}`
      }, async () => {
        // Fetch fresh timeline data
        const timeline = await this.getTimeline(weddingId)
        callback(timeline)
      })
      .subscribe()
  }
}

// Helper function to get moment order
function getMomentOrder(momentId: string): number {
  const orderMap: Record<string, number> = {
    'getting-ready': 1,
    'ceremony': 2,
    'cocktails': 3,
    'dinner': 4,
    'first-dance': 5,
    'parent-dances': 6,
    'party': 7,
    'last-dance': 8
  }
  return orderMap[momentId] || 99
}