/**
 * Spotify Service for Uptune 3.0
 * Handles all Spotify API interactions including auth, search, and audio features
 */

import SpotifyWebApi from 'spotify-web-api-node';
import { 
  MasterSong, 
  SpotifyAudioFeatures, 
  WeddingMoment,
  SpotifyImportOptions,
  SpotifyImportResult,
  DataSource,
  EmotionalArc,
  WeddingMood
} from '@/types/music-ai';

// Rate limiter to respect Spotify's limits
class RateLimiter {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private requestsPerSecond = 3;
  private lastRequestTime = 0;

  async throttle<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      
      if (!this.processing) {
        this.process();
      }
    });
  }

  private async process() {
    if (this.queue.length === 0) {
      this.processing = false;
      return;
    }

    this.processing = true;
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    const minInterval = 1000 / this.requestsPerSecond;

    if (timeSinceLastRequest < minInterval) {
      await this.sleep(minInterval - timeSinceLastRequest);
    }

    const task = this.queue.shift();
    if (task) {
      this.lastRequestTime = Date.now();
      await task();
    }

    // Process next task
    setTimeout(() => this.process(), 0);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export class SpotifyService {
  private spotify: SpotifyWebApi;
  private rateLimiter: RateLimiter;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor() {
    this.spotify = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      redirectUri: process.env.SPOTIFY_REDIRECT_URI || `${process.env.NEXT_PUBLIC_URL}/api/spotify/callback`
    });
    
    this.rateLimiter = new RateLimiter();
  }

  /**
   * Initialize client credentials (for non-user specific operations)
   */
  async initializeClientCredentials(): Promise<void> {
    // Check if token is still valid
    if (this.accessToken && this.tokenExpiry && this.tokenExpiry > new Date()) {
      return;
    }

    try {
      const data = await this.spotify.clientCredentialsGrant();
      this.accessToken = data.body.access_token;
      this.tokenExpiry = new Date(Date.now() + data.body.expires_in * 1000);
      this.spotify.setAccessToken(this.accessToken);
    } catch (error) {
      console.error('Failed to get Spotify access token:', error);
      throw new Error('Spotify authentication failed');
    }
  }

  /**
   * Search for playlists by keyword
   */
  async searchPlaylists(query: string, options?: { limit?: number; offset?: number }) {
    await this.initializeClientCredentials();
    
    return this.rateLimiter.throttle(async () => {
      const result = await this.spotify.searchPlaylists(query, {
        limit: options?.limit || 50,
        offset: options?.offset || 0
      });
      
      return result.body.playlists?.items || [];
    });
  }

  /**
   * Get all tracks from a playlist (handles pagination)
   */
  async getAllPlaylistTracks(playlistId: string): Promise<any[]> {
    await this.initializeClientCredentials();
    
    const tracks: any[] = [];
    let offset = 0;
    const limit = 100;
    let hasMore = true;

    while (hasMore) {
      const batch = await this.rateLimiter.throttle(async () => {
        return await this.spotify.getPlaylistTracks(playlistId, {
          limit,
          offset,
          fields: 'items(track(id,name,artists,album,duration_ms,explicit,preview_url,popularity,external_urls))'
        });
      });

      if (batch.body.items.length > 0) {
        tracks.push(...batch.body.items);
        offset += limit;
        hasMore = batch.body.items.length === limit;
      } else {
        hasMore = false;
      }
    }

    return tracks;
  }

  /**
   * Get audio features for multiple tracks (max 100 at once)
   * Note: This requires user authentication, not available with Client Credentials
   */
  async getAudioFeatures(trackIds: string[]): Promise<SpotifyAudioFeatures[]> {
    await this.initializeClientCredentials();
    
    const features: SpotifyAudioFeatures[] = [];
    const chunks = this.chunkArray(trackIds, 100);

    for (const chunk of chunks) {
      try {
        const batch = await this.rateLimiter.throttle(async () => {
          return await this.spotify.getAudioFeaturesForTracks(chunk);
        });

        if (batch.body.audio_features) {
          features.push(...batch.body.audio_features.filter(f => f !== null));
        }
      } catch (error: any) {
        // Audio features endpoint returns 403 with Client Credentials
        // This is expected - we need user auth for this endpoint
        if (error.statusCode === 403) {
          console.log('⚠️ Audio features require user authentication (not available with Client Credentials)');
          // Return empty features - the import will continue without them
          return [];
        }
        throw error; // Re-throw other errors
      }
    }

    return features;
  }

  /**
   * Import wedding-relevant songs from Spotify
   */
  async importWeddingSongs(options: SpotifyImportOptions): Promise<SpotifyImportResult> {
    const startTime = Date.now();
    const errors: string[] = [];
    let tracksImported = 0;
    let playlistsProcessed = 0;
    let rateLimitHits = 0;

    const uniqueTracks = new Map<string, any>();

    try {
      await this.initializeClientCredentials();

      // Search for playlists
      for (const searchTerm of options.search_terms) {
        try {
          const playlists = await this.searchPlaylists(searchTerm, {
            limit: options.limit || 50
          });

          for (const playlist of playlists) {
            // Skip playlists with few followers (likely low quality)
            if ((playlist as any).followers && (playlist as any).followers.total < (options.min_followers || 100)) {
              continue;
            }

            try {
              // Get all tracks from playlist
              const tracks = await this.getAllPlaylistTracks(playlist.id);
              playlistsProcessed++;

              for (const item of tracks) {
                if (item.track && !uniqueTracks.has(item.track.id)) {
                  uniqueTracks.set(item.track.id, {
                    ...item.track,
                    found_in_playlist: playlist.name,
                    playlist_context: searchTerm
                  });
                }
              }
            } catch (error) {
              errors.push(`Failed to process playlist ${playlist.name}: ${error}`);
            }
          }
        } catch (error) {
          if ((error as any).statusCode === 429) {
            rateLimitHits++;
            // Wait and retry
            await this.sleep(5000);
          } else {
            errors.push(`Search failed for ${searchTerm}: ${error}`);
          }
        }
      }

      // Get audio features if requested
      if (options.include_audio_features) {
        const trackIds = Array.from(uniqueTracks.keys());
        try {
          const audioFeatures = await this.getAudioFeatures(trackIds);
          
          // Merge audio features with tracks
          for (const features of audioFeatures) {
            if (uniqueTracks.has(features.id)) {
              uniqueTracks.get(features.id).audio_features = features;
            }
          }
        } catch (error) {
          errors.push(`Failed to get audio features: ${error}`);
        }
      }

      tracksImported = uniqueTracks.size;

    } catch (error) {
      errors.push(`Import failed: ${error}`);
    }

    return {
      tracks_imported: tracksImported,
      playlists_processed: playlistsProcessed,
      errors,
      duration_ms: Date.now() - startTime,
      rate_limit_hits: rateLimitHits
    };
  }

  /**
   * Convert Spotify track to MasterSong format
   */
  convertToMasterSong(spotifyTrack: any, audioFeatures?: SpotifyAudioFeatures): Partial<MasterSong> {
    const song: Partial<MasterSong> = {
      spotify_id: spotifyTrack.id,
      title: spotifyTrack.name,
      artist: spotifyTrack.artists[0]?.name || 'Unknown Artist',
      artists: spotifyTrack.artists?.map((a: any) => a.name),
      album: spotifyTrack.album?.name || 'Unknown Album',
      album_art_url: spotifyTrack.album?.images?.[0]?.url,
      preview_url: spotifyTrack.preview_url,
      external_urls: spotifyTrack.external_urls,
      duration_ms: spotifyTrack.duration_ms,
      explicit: spotifyTrack.explicit || false,
      popularity: spotifyTrack.popularity || 0,
      release_date: spotifyTrack.album?.release_date,
      
      // Initialize arrays
      wedding_moments: [],
      wedding_genres: [],
      wedding_moods: [],
      cultural_fit: [],
      age_appeal: [],
      inappropriate_flags: [],
      
      // Set defaults
      wedding_score: 50,
      source: DataSource.SPOTIFY,
      created_at: new Date(),
      updated_at: new Date(),
      data_version: '1.0.0',
      
      // Initialize analytics
      analytics: {
        play_count: 0,
        success_rate: 0,
        skip_rate: 0,
        user_ratings: []
      }
    };

    // Add audio features if available
    if (audioFeatures) {
      song.audio_features = audioFeatures;
      
      // Infer wedding moments based on audio features
      song.wedding_moments = this.inferWeddingMoments(audioFeatures);
      
      // Calculate wedding score
      song.wedding_score = this.calculateWeddingScore(audioFeatures);
      
      // Infer moods
      song.wedding_moods = this.inferMoods(audioFeatures);
      
      // Set emotional arc
      if (!song.ai_metadata) {
        song.ai_metadata = {
          lyrical_themes: [],
          emotional_arc: this.inferEmotionalArc(audioFeatures),
          confidence_score: 0.7,
          last_analyzed: new Date(),
          analyzed_by_models: ['spotify-analysis']
        };
      }
      
      // Calculate mixing data
      song.mixing_data = {
        intro_beats: 32, // Default, would need actual analysis
        outro_beats: 32,
        mix_in_point_ms: 0,
        mix_out_point_ms: (song.duration_ms || 180000) - 10000,
        harmonic_keys: this.getHarmonicKeys(audioFeatures.key, audioFeatures.mode),
        bpm_range: [
          audioFeatures.tempo * 0.93,
          audioFeatures.tempo * 1.07
        ] as [number, number]
      };
    }

    return song;
  }

  /**
   * Infer wedding moments based on audio features
   */
  private inferWeddingMoments(features: SpotifyAudioFeatures): WeddingMoment[] {
    const moments: WeddingMoment[] = [];

    // Processional: Slow, elegant, emotional
    if (features.tempo < 80 && features.energy < 0.4 && features.valence > 0.4) {
      moments.push(WeddingMoment.PROCESSIONAL);
    }

    // First Dance: Romantic, moderate tempo
    if (features.tempo >= 60 && features.tempo <= 100 && 
        features.energy < 0.6 && features.valence > 0.5 &&
        features.acousticness > 0.2) {
      moments.push(WeddingMoment.FIRST_DANCE);
    }

    // Dinner: Low energy, background music
    if (features.energy < 0.5 && features.speechiness < 0.1 &&
        features.loudness > -20) {
      moments.push(WeddingMoment.DINNER);
    }

    // Cocktail Hour: Medium energy, sophisticated
    if (features.energy >= 0.3 && features.energy <= 0.6 &&
        features.valence > 0.5 && features.danceability < 0.7) {
      moments.push(WeddingMoment.COCKTAIL);
    }

    // Party Peak: High energy, danceable
    if (features.energy > 0.7 && features.danceability > 0.7 &&
        features.tempo > 110 && features.valence > 0.6) {
      moments.push(WeddingMoment.PARTY_PEAK);
    }

    // Party Warmup: Building energy
    if (features.energy >= 0.5 && features.energy <= 0.7 &&
        features.danceability > 0.6 && features.tempo >= 100) {
      moments.push(WeddingMoment.PARTY_WARMUP);
    }

    // Slow Dance: Romantic, slow
    if (features.tempo < 90 && features.energy < 0.5 &&
        features.valence > 0.4 && features.danceability > 0.4) {
      moments.push(WeddingMoment.SLOW_DANCE);
    }

    // Last Dance: Memorable, emotional
    if (features.valence > 0.6 && features.energy >= 0.4 &&
        features.energy <= 0.7) {
      moments.push(WeddingMoment.LAST_DANCE);
    }

    return moments;
  }

  /**
   * Calculate wedding suitability score
   */
  private calculateWeddingScore(features: SpotifyAudioFeatures): number {
    let score = 50; // Base score

    // Positive factors
    if (features.valence > 0.6) score += 10; // Happy songs
    if (features.danceability > 0.6) score += 10; // Danceable
    if (features.energy > 0.5 && features.energy < 0.8) score += 10; // Good energy
    if (features.tempo >= 100 && features.tempo <= 130) score += 5; // Good tempo range
    
    // Negative factors
    if (features.speechiness > 0.3) score -= 10; // Too much talking
    if (features.instrumentalness > 0.8) score -= 5; // Purely instrumental (can be good for some moments)
    if (features.valence < 0.3) score -= 15; // Too sad
    if (features.energy < 0.2) score -= 10; // Too low energy (except for specific moments)

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Infer moods from audio features
   */
  private inferMoods(features: SpotifyAudioFeatures): WeddingMood[] {
    const moods: WeddingMood[] = [];

    if (features.valence > 0.7 && features.energy > 0.6) {
      moods.push(WeddingMood.CELEBRATORY);
    }
    
    if (features.valence > 0.5 && features.energy < 0.5 && features.acousticness > 0.5) {
      moods.push(WeddingMood.ROMANTIC);
    }
    
    if (features.valence > 0.6 && features.energy > 0.5) {
      moods.push(WeddingMood.UPLIFTING);
    }
    
    if (features.energy > 0.7 && features.danceability > 0.7) {
      moods.push(WeddingMood.PARTY);
      moods.push(WeddingMood.ENERGETIC);
    }
    
    if (features.energy < 0.4 && features.acousticness > 0.6) {
      moods.push(WeddingMood.ELEGANT);
    }
    
    if (features.valence > 0.5 && features.danceability > 0.6) {
      moods.push(WeddingMood.FUN);
    }

    return moods;
  }

  /**
   * Infer emotional arc from audio features
   */
  private inferEmotionalArc(features: SpotifyAudioFeatures): EmotionalArc {
    if (features.energy > 0.7) return EmotionalArc.PEAK;
    if (features.energy > 0.5 && features.valence > 0.6) return EmotionalArc.BUILDING;
    if (features.energy < 0.4) return EmotionalArc.COOLING;
    if (features.energy >= 0.4 && features.energy <= 0.6) return EmotionalArc.STEADY;
    return EmotionalArc.VARIABLE;
  }

  /**
   * Get harmonic keys for mixing (Camelot Wheel)
   */
  private getHarmonicKeys(key: number, mode: number): string[] {
    // Simplified Camelot Wheel mapping
    const camelotMap: Record<string, string> = {
      '0-1': '8B',  // C Major
      '0-0': '5A',  // C Minor
      '1-1': '3B',  // C# Major
      '1-0': '12A', // C# Minor
      '2-1': '10B', // D Major
      '2-0': '7A',  // D Minor
      '3-1': '5B',  // Eb Major
      '3-0': '2A',  // Eb Minor
      '4-1': '12B', // E Major
      '4-0': '9A',  // E Minor
      '5-1': '7B',  // F Major
      '5-0': '4A',  // F Minor
      '6-1': '2B',  // F# Major
      '6-0': '11A', // F# Minor
      '7-1': '9B',  // G Major
      '7-0': '6A',  // G Minor
      '8-1': '4B',  // Ab Major
      '8-0': '1A',  // Ab Minor
      '9-1': '11B', // A Major
      '9-0': '8A',  // A Minor
      '10-1': '6B', // Bb Major
      '10-0': '3A', // Bb Minor
      '11-1': '1B', // B Major
      '11-0': '10A' // B Minor
    };

    const currentKey = camelotMap[`${key}-${mode}`] || '8B';
    const compatible: string[] = [currentKey];

    // Add adjacent keys (simplified)
    const keyNumber = parseInt(currentKey);
    const keyLetter = currentKey.slice(-1);
    
    // Same number, different letter
    compatible.push(`${keyNumber}${keyLetter === 'A' ? 'B' : 'A'}`);
    
    // Adjacent numbers
    const prevNum = keyNumber === 1 ? 12 : keyNumber - 1;
    const nextNum = keyNumber === 12 ? 1 : keyNumber + 1;
    compatible.push(`${prevNum}${keyLetter}`);
    compatible.push(`${nextNum}${keyLetter}`);

    return compatible;
  }

  /**
   * Helper function to chunk arrays
   */
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * Helper function to sleep
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get authorization URL for user authentication
   */
  getAuthorizationUrl(state: string): string {
    const scopes = [
      'playlist-read-private',
      'playlist-read-collaborative',
      'playlist-modify-public',
      'playlist-modify-private',
      'user-top-read',
      'user-read-recently-played'
    ];

    return this.spotify.createAuthorizeURL(scopes, state);
  }

  /**
   * Exchange authorization code for access token
   */
  async handleAuthCallback(code: string): Promise<{ access_token: string; refresh_token: string }> {
    const data = await this.spotify.authorizationCodeGrant(code);
    
    this.spotify.setAccessToken(data.body.access_token);
    this.spotify.setRefreshToken(data.body.refresh_token);
    
    return {
      access_token: data.body.access_token,
      refresh_token: data.body.refresh_token
    };
  }

  /**
   * Create a playlist for the user
   */
  async createPlaylist(
    userId: string,
    name: string,
    description: string,
    trackIds: string[],
    accessToken: string
  ): Promise<string> {
    this.spotify.setAccessToken(accessToken);

    // Create playlist
    const playlist = await this.spotify.createPlaylist(name, {
      description,
      public: false
    });

    // Add tracks in batches
    const uris = trackIds.map(id => `spotify:track:${id}`);
    const chunks = this.chunkArray(uris, 100);

    for (const chunk of chunks) {
      await this.spotify.addTracksToPlaylist(playlist.body.id, chunk);
    }

    return playlist.body.external_urls.spotify;
  }
}

// Singleton instance
let spotifyServiceInstance: SpotifyService | null = null;

export function getSpotifyService(): SpotifyService {
  if (!spotifyServiceInstance) {
    spotifyServiceInstance = new SpotifyService();
  }
  return spotifyServiceInstance;
}