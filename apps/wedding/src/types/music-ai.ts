/**
 * Music AI and Database Types for Uptune 3.0
 */

// ============================================
// Core Song Types with Spotify Integration
// ============================================

export interface SpotifyAudioFeatures {
  // Identifiers
  id: string;                    // Spotify track ID
  uri: string;                   // Spotify URI (spotify:track:xxx)
  
  // Core audio features (0-1 scale unless noted)
  acousticness: number;          // 0-1: Confidence measure of whether the track is acoustic
  danceability: number;          // 0-1: How suitable for dancing (tempo, rhythm, beat)
  energy: number;                // 0-1: Perceptual measure of intensity and activity
  instrumentalness: number;      // 0-1: Predicts whether a track contains no vocals
  liveness: number;              // 0-1: Detects presence of audience in recording
  speechiness: number;           // 0-1: Detects presence of spoken words
  valence: number;               // 0-1: Musical positivity/happiness
  
  // Musical characteristics
  key: number;                   // 0-11: Pitch class notation (0=C, 1=C#, 2=D, etc.)
  mode: number;                  // 0 or 1: Major (1) or Minor (0)
  tempo: number;                 // BPM: Beats per minute
  time_signature: number;        // 3-7: Time signature (3/4 to 7/4)
  loudness: number;              // dB: Average loudness (-60 to 0)
  duration_ms: number;           // Track length in milliseconds
}

export interface MasterSong {
  // Spotify Core Data
  spotify_id: string;            // Primary identifier
  title: string;
  artist: string;
  artists?: string[];            // All artists if multiple
  album: string;
  album_art_url?: string;
  preview_url?: string;          // 30-second preview
  external_urls?: {
    spotify?: string;
  };
  
  // Basic metadata
  duration_ms: number;
  explicit: boolean;
  popularity: number;            // 0-100: Spotify popularity score
  release_date?: string;
  isrc?: string;                 // International Standard Recording Code
  
  // Audio Features from Spotify
  audio_features: SpotifyAudioFeatures;
  
  // Wedding-Specific Classification
  wedding_moments: WeddingMoment[];
  wedding_score: number;         // 0-100: How good for weddings
  wedding_genres: string[];
  wedding_moods: WeddingMood[];
  
  // Cultural and demographic fit
  cultural_fit: CulturalContext[];
  age_appeal: AgeGroup[];
  inappropriate_flags: string[]; // Reasons it might not work
  
  // DJ Information
  mixing_data: {
    intro_beats: number;         // Beats before vocals
    outro_beats: number;         // Beats after vocals end
    mix_in_point_ms: number;     // Optimal mix in point
    mix_out_point_ms: number;    // Optimal mix out point
    harmonic_keys: string[];     // Compatible keys (Camelot notation)
    bpm_range: [number, number]; // Min/max BPM for beatmatching (±7%)
  };
  
  // AI Enhancement
  ai_metadata: {
    embeddings?: number[];       // Vector for similarity search
    lyrical_themes: string[];    // AI-analyzed themes
    emotional_arc: EmotionalArc;
    confidence_score: number;    // How confident in classification
    last_analyzed: Date;
    analyzed_by_models: string[];
  };
  
  // Usage Analytics
  analytics: {
    play_count: number;          // Times used in app
    success_rate: number;        // % kept in final playlist
    skip_rate: number;           // % skipped when played
    user_ratings: number[];      // User ratings
    dj_rating?: number;          // Professional rating
    last_used?: Date;
  };
  
  // Metadata
  created_at: Date;
  updated_at: Date;
  data_version: string;          // Schema version
  source: DataSource;            // Where this data came from
}

// ============================================
// Wedding-Specific Enums and Types
// ============================================

export enum AIProvider {
  CLAUDE = 'claude',
  GPT = 'gpt',
  GEMINI = 'gemini',
  LLAMA = 'llama',
  MIXTRAL = 'mixtral'
}

export enum WeddingMoment {
  PRELUDE = 'prelude',                    // Guest arrival (30 min)
  PROCESSIONAL = 'processional',          // Walking down aisle (5 min)
  RECESSIONAL = 'recessional',            // Exit ceremony (5 min)
  COCKTAIL = 'cocktail',                  // Cocktail hour (60-90 min)
  ENTRANCE = 'entrance',                  // Grand entrance (5 min)
  DINNER = 'dinner',                      // Dinner service (60 min)
  FIRST_DANCE = 'first_dance',            // Couple's first dance (5 min)
  PARENT_DANCE = 'parent_dance',          // Parent dances (10 min)
  FATHER_DAUGHTER = 'father_daughter',    // Father-daughter dance (5 min)
  MOTHER_SON = 'mother_son',              // Mother-son dance (5 min)
  PARTY_WARMUP = 'party_warmup',          // Getting people dancing (30 min)
  PARTY_PEAK = 'party_peak',              // Peak energy dancing (120 min)
  PARTY_CLASSIC = 'party_classic',        // Crowd pleasers (30 min)
  SLOW_DANCE = 'slow_dance',              // Romantic moments (10 min)
  CULTURAL = 'cultural',                  // Cultural specific (varies)
  LAST_DANCE = 'last_dance',              // Final song (5 min)
  AFTER_PARTY = 'after_party',            // Late night (60+ min)
  CAKE_CUTTING = 'cake_cutting',          // Cake cutting ceremony (5 min)
  BOUQUET_GARTER = 'bouquet_garter',      // Bouquet/garter toss (10 min)
  GENERAL = 'general'                     // General/unspecified moment
}

export enum WeddingMood {
  ROMANTIC = 'romantic',
  CELEBRATORY = 'celebratory',
  NOSTALGIC = 'nostalgic',
  UPLIFTING = 'uplifting',
  ELEGANT = 'elegant',
  PARTY = 'party',
  EMOTIONAL = 'emotional',
  FUN = 'fun',
  SOPHISTICATED = 'sophisticated',
  ENERGETIC = 'energetic',
  CHILL = 'chill',
  CLASSIC = 'classic'
}

export enum CulturalContext {
  WESTERN = 'western',
  INDIAN = 'indian',
  JEWISH = 'jewish',
  LATIN = 'latin',
  AFRICAN = 'african',
  ASIAN = 'asian',
  MIDDLE_EASTERN = 'middle_eastern',
  CARIBBEAN = 'caribbean',
  EUROPEAN = 'european',
  MULTICULTURAL = 'multicultural'
}

export enum AgeGroup {
  GEN_Z = 'gen_z',           // 18-25
  MILLENNIAL = 'millennial', // 26-40
  GEN_X = 'gen_x',           // 41-55
  BOOMER = 'boomer',         // 56-75
  SILENT = 'silent',         // 76+
  UNIVERSAL = 'universal'     // All ages
}

export enum EmotionalArc {
  BUILDING = 'building',      // Energy increasing
  STEADY = 'steady',         // Maintaining energy
  PEAK = 'peak',            // Maximum energy
  COOLING = 'cooling',      // Energy decreasing
  VARIABLE = 'variable'     // Mixed energy
}

export enum DataSource {
  SPOTIFY = 'spotify',
  USER_UPLOAD = 'user_upload',
  AI_GENERATED = 'ai_generated',
  CURATED = 'curated',
  COMMUNITY = 'community'
}

// ============================================
// AI Generation Types
// ============================================

export interface UserMusicContext {
  // User inputs
  must_play_songs: string[];
  avoid_songs?: string[];
  genres: string[];
  custom_instructions: string;
  wedding_type: string;
  country: string;
  venue_type?: string;
  guest_count?: number;
  wedding_date?: Date;
  
  // Spotify integration
  spotify_playlists?: string[];
  spotify_top_artists?: string[];
  
  // Cultural context
  cultural_backgrounds?: string[];
  religious_considerations?: string[];
  languages?: string[];
  
  // Preferences
  energy_preference?: 'high' | 'medium' | 'low' | 'mixed';
  explicit_ok?: boolean;
  instrumental_preference?: number; // 0-1
  decade_preferences?: string[];
}

export interface EnrichedContext extends UserMusicContext {
  // Added by AI enrichment
  cultural_insights: {
    traditions: string[];
    music_styles: string[];
    avoid_themes: string[];
    important_songs: string[];
  };
  
  regional_preferences: {
    popular_genres: string[];
    local_favorites: string[];
    trending_songs: string[];
  };
  
  demographic_analysis: {
    age_distribution: Record<AgeGroup, number>;
    likely_preferences: string[];
  };
  
  venue_acoustics?: {
    recommended_energy: number;
    recommended_tempo_range: [number, number];
  };
}

export interface MusicalDNA {
  // Spotify-derived preferences
  audio_profile: {
    preferred_energy: number;
    preferred_valence: number;
    preferred_danceability: number;
    preferred_tempo: number;
    preferred_acousticness: number;
  };
  
  genre_weights: Record<string, number>;
  artist_affinities: Array<{
    artist: string;
    weight: number;
  }>;
  
  decade_distribution: Record<string, number>;
  mood_preferences: Record<WeddingMood, number>;
  
  avoidance_patterns: {
    themes_to_avoid: string[];
    energy_to_avoid: [number, number];
    explicit_content: boolean;
  };
}

// Note: AIGeneratedPlaylist is defined later with full implementation

export interface PlaylistMoment {
  moment: WeddingMoment;
  start_time: string;           // "4:00 PM"
  duration_minutes: number;
  target_energy: number;
  songs: PlaylistSong[];
  description: string;
  tips?: string;
}

export interface PlaylistSong {
  // Song reference
  spotify_id: string;
  master_song?: MasterSong;     // Full song data if available
  
  // Basic info (fallback if master_song not found)
  title: string;
  artist: string;
  
  // Playlist-specific metadata
  position: number;
  reason: string;                // Why this song was chosen
  alternatives?: string[];       // Alternative spotify_ids
  confidence: number;            // How confident in this choice
  
  // Mixing info
  transition_notes?: string;     // How to mix into next song
  crossfade_duration_ms?: number;
}

// ============================================
// Service Types
// ============================================

export interface SpotifyImportOptions {
  search_terms: string[];
  min_followers?: number;        // Minimum playlist followers
  market?: string;               // Country code
  limit?: number;                // Max playlists to import
  include_audio_features?: boolean;
  include_artist_genres?: boolean;
}

export interface SpotifyImportResult {
  tracks_imported: number;
  playlists_processed: number;
  errors: string[];
  duration_ms: number;
  rate_limit_hits: number;
}

export interface AIGenerationOptions {
  model_preference?: 'fast' | 'balanced' | 'quality';
  use_cache?: boolean;
  include_alternatives?: boolean;
  max_songs_per_moment?: number;
  strict_cultural_filter?: boolean;
}

export interface SongSearchFilters {
  wedding_moments?: WeddingMoment[];
  min_energy?: number;
  max_energy?: number;
  min_tempo?: number;
  max_tempo?: number;
  min_valence?: number;
  max_valence?: number;
  genres?: string[];
  decades?: string[];
  explicit?: boolean;
  instrumental?: boolean;
  cultural_fit?: CulturalContext[];
  exclude_ids?: string[];
}

export interface VectorSearchOptions {
  embedding: number[];
  limit: number;
  filters?: SongSearchFilters;
  threshold?: number;             // Minimum similarity score
}

// ============================================
// Cache Types
// ============================================

export interface CachedPlaylist {
  key: string;                    // Cache key
  playlist: AIGeneratedPlaylist;
  created_at: Date;
  expires_at: Date;
  hit_count: number;
}

export interface CachedSong {
  spotify_id: string;
  song: MasterSong;
  cached_at: Date;
  expires_at: Date;
}

// ============================================
// Request/Response Types for API
// ============================================

export interface PlaylistGenerationRequest {
  // User identification
  user_id?: string;
  wedding_id?: string;
  request_source?: string;
  
  // Couple information
  couple_names?: string[];
  wedding_date?: string;
  wedding_vibe?: string;
  relationship_story?: string;
  
  // Music preferences
  must_play_songs?: string[];
  do_not_play?: string[];
  genre_preferences?: string[];
  era_preferences?: string[];
  
  // Event details
  guest_count?: number;
  venue_type?: string;
  wedding_theme?: string;
  cultural_backgrounds?: string[];
  
  // Timeline
  timeline_moments?: Array<{
    moment: WeddingMoment;
    duration: number;
    mood?: WeddingMood;
  }>;
  
  // Custom instructions
  custom_instructions?: string;
}

export interface SongSelection {
  song: MasterSong;
  confidence_score: number;
  selection_reason: string;
  ai_notes?: string;
}

// Updated AIGeneratedPlaylist to match what we use
export interface AIGeneratedPlaylist {
  playlist_id?: string;
  name: string;
  description: string;
  songs: SongSelection[];
  moment_breakdown: Record<string, {
    songs: string[];
    duration_ms: number;
    song_count: number;
  }>;
  total_duration_ms: number;
  song_count: number;
  
  // Optional metadata
  genre_distribution?: Record<string, number>;
  mood_progression?: WeddingMood[];
  energy_curve?: number[];
  ai_insights?: {
    strengths: string[];
    suggestions: string[];
    confidence: number;
  };
  
  // System metadata
  generated_by?: AIProvider;
  generation_timestamp?: Date;
  request_id?: string;
  user_id?: string;
  is_public?: boolean;
}

// ============================================
// Analytics Types
// ============================================

export interface PlaylistAnalytics {
  playlist_id: string;
  wedding_id?: string;
  
  // Usage metrics
  views: number;
  exports: number;
  shares: number;
  saves: number;
  
  // Song metrics
  songs_kept: number;
  songs_removed: number;
  songs_added: number;
  songs_reordered: number;
  
  // Quality metrics
  user_rating?: number;
  completion_rate: number;       // % of playlist actually used
  
  // Spotify metrics
  spotify_exports: number;
  spotify_plays?: number;
}

export interface SongAnalytics {
  spotify_id: string;
  
  // Usage across all playlists
  total_playlist_inclusions: number;
  total_plays: number;
  total_skips: number;
  
  // By moment
  moment_usage: Record<WeddingMoment, number>;
  
  // Ratings
  average_rating: number;
  rating_count: number;
  
  // Success metrics
  retention_rate: number;        // % kept in final playlist
  recommendation_score: number;   // How often we should recommend
}