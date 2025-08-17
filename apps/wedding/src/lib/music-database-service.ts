/**
 * Music Database Service for Uptune 3.0
 * Manages song data in Firestore with caching and search capabilities
 */

import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc,
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  writeBatch,
  QueryConstraint,
  documentId
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  MasterSong, 
  WeddingMoment, 
  SongSearchFilters,
  AIGeneratedPlaylist,
  PlaylistAnalytics,
  SongAnalytics,
  CachedSong,
  CachedPlaylist
} from '@/types/music-ai';
import { mapCountryToCulture } from '@/lib/country-culture-mapping';

// Collection names
const COLLECTIONS = {
  SONGS_MASTER: 'songs', // Changed from 'songs_master' to match seeding script
  AI_PLAYLISTS: 'ai_playlists',
  USER_PREFERENCES: 'user_preferences',
  SONG_ANALYTICS: 'song_analytics',
  PLAYLIST_ANALYTICS: 'playlist_analytics',
  CACHE_SONGS: 'cache_songs',
  CACHE_PLAYLISTS: 'cache_playlists'
};

export class MusicDatabaseService {
  private songCache: Map<string, MasterSong>;
  private cacheTimeout = 3600000; // 1 hour

  constructor() {
    this.songCache = new Map();
  }

  /**
   * Get a song by Spotify ID
   */
  async getSong(spotifyId: string): Promise<MasterSong | null> {
    // Check memory cache first
    if (this.songCache.has(spotifyId)) {
      return this.songCache.get(spotifyId)!;
    }

    try {
      // Check Firestore cache
      const cacheDoc = await getDoc(doc(db, COLLECTIONS.CACHE_SONGS, spotifyId));
      if (cacheDoc.exists()) {
        const cached = cacheDoc.data() as CachedSong;
        const age = Date.now() - cached.cached_at.getTime();
        
        if (age < this.cacheTimeout) {
          this.songCache.set(spotifyId, cached.song);
          return cached.song;
        }
      }

      // Get from main collection
      const songDoc = await getDoc(doc(db, COLLECTIONS.SONGS_MASTER, spotifyId));
      if (songDoc.exists()) {
        const song = this.docToSong(songDoc);
        
        // Update caches
        this.songCache.set(spotifyId, song);
        await this.cacheSong(song);
        
        return song;
      }

      return null;
    } catch (error) {
      // Error getting song
      return null;
    }
  }

  /**
   * Get multiple songs by Spotify IDs
   */
  async getSongs(spotifyIds: string[]): Promise<MasterSong[]> {
    const songs: MasterSong[] = [];
    const missingIds: string[] = [];

    // Check cache for each ID
    for (const id of spotifyIds) {
      if (this.songCache.has(id)) {
        songs.push(this.songCache.get(id)!);
      } else {
        missingIds.push(id);
      }
    }

    // Fetch missing songs from Firestore in batches
    if (missingIds.length > 0) {
      const batches = this.chunkArray(missingIds, 10); // Firestore 'in' query limit
      
      for (const batch of batches) {
        const q = query(
          collection(db, COLLECTIONS.SONGS_MASTER),
          where(documentId(), 'in', batch)
        );
        
        const snapshot = await getDocs(q);
        snapshot.forEach(doc => {
          const song = this.docToSong(doc);
          songs.push(song);
          this.songCache.set(song.spotify_id, song);
        });
      }
    }

    return songs;
  }

  /**
   * Save a song to the database
   */
  async saveSong(song: MasterSong): Promise<void> {
    try {
      const songData = this.songToDoc(song);
      await setDoc(doc(db, COLLECTIONS.SONGS_MASTER, song.spotify_id), songData);
      
      // Update cache
      this.songCache.set(song.spotify_id, song);
      await this.cacheSong(song);
    } catch (error) {
      // Error saving song
      throw error;
    }
  }

  /**
   * Bulk save songs (more efficient for large imports)
   */
  async bulkSaveSongs(songs: MasterSong[]): Promise<void> {
    const batches = this.chunkArray(songs, 500); // Firestore batch limit
    
    for (const batchSongs of batches) {
      const batch = writeBatch(db);
      
      for (const song of batchSongs) {
        const songData = this.songToDoc(song);
        const songRef = doc(db, COLLECTIONS.SONGS_MASTER, song.spotify_id);
        batch.set(songRef, songData);
        
        // Update memory cache
        this.songCache.set(song.spotify_id, song);
      }
      
      await batch.commit();
    }
  }

  /**
   * Search songs with filters
   */
  async searchSongs(filters: SongSearchFilters, maxResults = 50): Promise<MasterSong[]> {
    try {
      const constraints: QueryConstraint[] = [];

      // Build query constraints
      if (filters.wedding_moments && filters.wedding_moments.length > 0) {
        constraints.push(where('wedding_moments', 'array-contains-any', filters.wedding_moments));
      }

      if (filters.min_energy !== undefined) {
        constraints.push(where('audio_features.energy', '>=', filters.min_energy));
      }

      if (filters.max_energy !== undefined) {
        constraints.push(where('audio_features.energy', '<=', filters.max_energy));
      }

      if (filters.min_tempo !== undefined) {
        constraints.push(where('audio_features.tempo', '>=', filters.min_tempo));
      }

      if (filters.max_tempo !== undefined) {
        constraints.push(where('audio_features.tempo', '<=', filters.max_tempo));
      }

      if (filters.explicit !== undefined) {
        constraints.push(where('explicit', '==', filters.explicit));
      }

      // Add ordering and limit
      constraints.push(orderBy('wedding_score', 'desc'));
      constraints.push(limit(maxResults));

      const q = query(collection(db, COLLECTIONS.SONGS_MASTER), ...constraints);
      const snapshot = await getDocs(q);
      
      const songs: MasterSong[] = [];
      snapshot.forEach(doc => {
        const song = this.docToSong(doc);
        
        // Additional filtering that can't be done in Firestore
        if (this.passesAdditionalFilters(song, filters)) {
          songs.push(song);
        }
      });

      return songs;
    } catch (error) {
      // Error searching songs
      return [];
    }
  }

  /**
   * Get songs for a specific wedding moment
   */
  async getSongsForMoment(
    moment: WeddingMoment, 
    options?: { 
      limit?: number; 
      minScore?: number;
      excludeExplicit?: boolean;
      genres?: string[];
      country?: string;
    }
  ): Promise<MasterSong[]> {
    const filters: SongSearchFilters = {
      wedding_moments: [moment],
      explicit: options?.excludeExplicit === true ? false : undefined,
      genres: options?.genres,
      cultural_fit: options?.country ? mapCountryToCulture(options.country) : undefined
    };

    const songs = await this.searchSongs(filters, options?.limit || 20);
    
    // Filter by minimum score if specified
    if (options?.minScore !== undefined && options.minScore !== null) {
      const minScore = options.minScore;
      return songs.filter(s => s.wedding_score >= minScore);
    }

    return songs;
  }

  /**
   * Save an AI-generated playlist
   */
  async saveAIPlaylist(playlist: AIGeneratedPlaylist): Promise<string> {
    try {
      const playlistRef = doc(collection(db, COLLECTIONS.AI_PLAYLISTS));
      const playlistData = {
        ...playlist,
        id: playlistRef.id,
        created_at: Timestamp.fromDate(playlist.generation_timestamp || new Date())
      };
      
      await setDoc(playlistRef, playlistData);
      
      // Cache the playlist
      await this.cachePlaylist(playlistRef.id, playlist);
      
      return playlistRef.id;
    } catch (error) {
      // Error saving AI playlist
      throw error;
    }
  }

  /**
   * Get an AI-generated playlist
   */
  async getAIPlaylist(playlistId: string): Promise<AIGeneratedPlaylist | null> {
    try {
      // Check cache first
      const cached = await this.getCachedPlaylist(playlistId);
      if (cached) {
        return cached;
      }

      const playlistDoc = await getDoc(doc(db, COLLECTIONS.AI_PLAYLISTS, playlistId));
      if (playlistDoc.exists()) {
        const playlistData = playlistDoc.data();
        const playlist = {
          ...playlistData,
          generation_timestamp: (playlistData.created_at as any)?.toDate() || new Date()
        } as AIGeneratedPlaylist;
        
        // Cache for future use
        await this.cachePlaylist(playlistId, playlist);
        
        return playlist;
      }

      return null;
    } catch (error) {
      // Error getting AI playlist
      return null;
    }
  }

  /**
   * Update song analytics
   */
  async updateSongAnalytics(spotifyId: string, update: Partial<SongAnalytics>): Promise<void> {
    try {
      const analyticsRef = doc(db, COLLECTIONS.SONG_ANALYTICS, spotifyId);
      const analyticsDoc = await getDoc(analyticsRef);
      
      if (analyticsDoc.exists()) {
        await updateDoc(analyticsRef, update);
      } else {
        await setDoc(analyticsRef, {
          spotify_id: spotifyId,
          total_playlist_inclusions: 0,
          total_plays: 0,
          total_skips: 0,
          moment_usage: {},
          average_rating: 0,
          rating_count: 0,
          retention_rate: 0,
          recommendation_score: 50,
          ...update
        });
      }
    } catch (error) {
      // Error updating song analytics
    }
  }

  /**
   * Update playlist analytics
   */
  async updatePlaylistAnalytics(playlistId: string, update: Partial<PlaylistAnalytics>): Promise<void> {
    try {
      const analyticsRef = doc(db, COLLECTIONS.PLAYLIST_ANALYTICS, playlistId);
      const analyticsDoc = await getDoc(analyticsRef);
      
      if (analyticsDoc.exists()) {
        await updateDoc(analyticsRef, update);
      } else {
        await setDoc(analyticsRef, {
          playlist_id: playlistId,
          views: 0,
          exports: 0,
          shares: 0,
          saves: 0,
          songs_kept: 0,
          songs_removed: 0,
          songs_added: 0,
          songs_reordered: 0,
          completion_rate: 0,
          spotify_exports: 0,
          ...update
        });
      }
    } catch (error) {
      // Error updating playlist analytics
    }
  }

  /**
   * Get popular songs (by analytics)
   */
  async getPopularSongs(options?: { limit?: number; moment?: WeddingMoment }): Promise<MasterSong[]> {
    try {
      let q = query(
        collection(db, COLLECTIONS.SONGS_MASTER),
        orderBy('analytics.play_count', 'desc'),
        limit(options?.limit || 50)
      );

      if (options?.moment) {
        q = query(
          collection(db, COLLECTIONS.SONGS_MASTER),
          where('wedding_moments', 'array-contains', options.moment),
          orderBy('analytics.play_count', 'desc'),
          limit(options.limit || 50)
        );
      }

      const snapshot = await getDocs(q);
      const songs: MasterSong[] = [];
      
      snapshot.forEach(doc => {
        songs.push(this.docToSong(doc));
      });

      return songs;
    } catch (error) {
      // Error getting popular songs
      return [];
    }
  }

  // ============================================
  // Helper Methods
  // ============================================

  /**
   * Convert Firestore document to MasterSong
   */
  private docToSong(doc: any): MasterSong {
    const data = doc.data();
    return {
      ...data,
      created_at: data.created_at?.toDate() || new Date(),
      updated_at: data.updated_at?.toDate() || new Date(),
      ai_metadata: {
        ...data.ai_metadata,
        last_analyzed: data.ai_metadata?.last_analyzed?.toDate() || new Date()
      },
      analytics: {
        ...data.analytics,
        last_used: data.analytics?.last_used?.toDate()
      }
    };
  }

  /**
   * Convert MasterSong to Firestore document
   */
  private songToDoc(song: MasterSong): any {
    return {
      ...song,
      created_at: Timestamp.fromDate(song.created_at),
      updated_at: Timestamp.fromDate(song.updated_at),
      ai_metadata: {
        ...song.ai_metadata,
        last_analyzed: Timestamp.fromDate(song.ai_metadata.last_analyzed)
      },
      analytics: {
        ...song.analytics,
        last_used: song.analytics.last_used ? Timestamp.fromDate(song.analytics.last_used) : null
      }
    };
  }

  /**
   * Additional filtering that can't be done in Firestore queries
   */
  private passesAdditionalFilters(song: MasterSong, filters: SongSearchFilters): boolean {
    if (filters.genres && filters.genres.length > 0) {
      const hasGenre = filters.genres.some(g => song.wedding_genres.includes(g));
      if (!hasGenre) return false;
    }

    if (filters.min_valence !== undefined && song.audio_features.valence < filters.min_valence) {
      return false;
    }

    if (filters.max_valence !== undefined && song.audio_features.valence > filters.max_valence) {
      return false;
    }

    if (filters.cultural_fit && filters.cultural_fit.length > 0) {
      const hasCulture = filters.cultural_fit.some(c => song.cultural_fit.includes(c));
      if (!hasCulture) return false;
    }

    if (filters.exclude_ids && filters.exclude_ids.includes(song.spotify_id)) {
      return false;
    }

    return true;
  }

  /**
   * Cache a song
   */
  private async cacheSong(song: MasterSong): Promise<void> {
    try {
      const cacheData: CachedSong = {
        spotify_id: song.spotify_id,
        song,
        cached_at: new Date(),
        expires_at: new Date(Date.now() + this.cacheTimeout)
      };
      
      await setDoc(doc(db, COLLECTIONS.CACHE_SONGS, song.spotify_id), cacheData);
    } catch (error) {
      // Error caching song
    }
  }

  /**
   * Cache a playlist
   */
  private async cachePlaylist(playlistId: string, playlist: AIGeneratedPlaylist): Promise<void> {
    try {
      const cacheData: CachedPlaylist = {
        key: playlistId,
        playlist,
        created_at: new Date(),
        expires_at: new Date(Date.now() + this.cacheTimeout),
        hit_count: 0
      };
      
      await setDoc(doc(db, COLLECTIONS.CACHE_PLAYLISTS, playlistId), cacheData);
    } catch (error) {
      // Error caching playlist
    }
  }

  /**
   * Get cached playlist
   */
  private async getCachedPlaylist(playlistId: string): Promise<AIGeneratedPlaylist | null> {
    try {
      const cacheDoc = await getDoc(doc(db, COLLECTIONS.CACHE_PLAYLISTS, playlistId));
      if (cacheDoc.exists()) {
        const cached = cacheDoc.data() as CachedPlaylist;
        const age = Date.now() - cached.created_at.getTime();
        
        if (age < this.cacheTimeout) {
          // Update hit count
          await updateDoc(doc(db, COLLECTIONS.CACHE_PLAYLISTS, playlistId), {
            hit_count: cached.hit_count + 1
          });
          
          return cached.playlist;
        }
      }
      
      return null;
    } catch (error) {
      // Error getting cached playlist
      return null;
    }
  }

  /**
   * Chunk array for batch operations
   */
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * Clear all caches
   */
  async clearCaches(): Promise<void> {
    this.songCache.clear();
    // Could also clear Firestore cache collections if needed
  }
}

// Singleton instance
let musicDatabaseInstance: MusicDatabaseService | null = null;

export function getMusicDatabase(): MusicDatabaseService {
  if (!musicDatabaseInstance) {
    musicDatabaseInstance = new MusicDatabaseService();
  }
  return musicDatabaseInstance;
}