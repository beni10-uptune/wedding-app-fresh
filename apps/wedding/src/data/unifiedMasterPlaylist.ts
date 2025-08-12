/**
 * Unified Master Wedding Playlist System
 * 
 * This is the single source of truth for all wedding songs in the application.
 * It consolidates ALL available songs from various collections and provides
 * intelligent filtering and distribution across wedding moments.
 * 
 * Total Songs Available: 1,156+ unique tracks
 */

import { MasterSong } from './masterWeddingPlaylist';
import { Song } from '@/types/wedding-v2';
import { ALL_WEDDING_SONGS, SPOTIFY_WEDDING_SONGS } from './spotify-wedding-songs';
import { HIP_HOP_WEDDING_SONGS } from './genre-songs/hip-hop-wedding-songs';
import { COUNTRY_WEDDING_SONGS } from './genre-songs/country-wedding-songs';
import { RNB_WEDDING_SONGS } from './genre-songs/rnb-wedding-songs';
import { ROCK_WEDDING_SONGS } from './genre-songs/rock-wedding-songs';
import { INDIE_WEDDING_SONGS } from './genre-songs/indie-wedding-songs';
import { CURATED_SONGS } from './curatedSongs';
import { MASTER_WEDDING_SONGS } from './masterWeddingPlaylist';

/**
 * Convert any song format to our unified MasterSong format
 */
function unifyToMasterSong(song: any, sourceMoments?: string[], sourceGenres?: string[]): MasterSong | null {
  // Extract and validate Spotify ID
  let spotifyId = song.id || song.spotifyId;
  if (spotifyId?.startsWith('spotify:track:')) {
    spotifyId = spotifyId.replace('spotify:track:', '');
  }
  
  // Skip invalid IDs
  if (!spotifyId || (spotifyId.length !== 22 && !spotifyId.includes('-'))) {
    return null;
  }

  // Determine moments - use existing or infer from energy/context
  let moments = song.moments || sourceMoments || [];
  if (moments.length === 0) {
    const energy = song.energyLevel || Math.ceil((song.energy || 0.5) * 5);
    if (energy <= 2) {
      moments = ['ceremony', 'dinner', 'first-dance'];
    } else if (energy === 3) {
      moments = ['cocktails', 'dinner', 'getting-ready'];
    } else {
      moments = ['party', 'cocktails'];
    }
  }

  // Determine genres - use existing or provided defaults
  let genres = song.genres || sourceGenres || [];
  if (genres.length === 0 && song.genre) {
    genres = [song.genre];
  }
  
  // Normalize genres (e.g., rnb -> r&b)
  genres = genres.map((g: string) => {
    const normalized = g.toLowerCase();
    if (normalized === 'rnb' || normalized === 'r&b') return 'r&b';
    if (normalized === 'hip-hop' || normalized === 'hiphop') return 'hip-hop';
    return g.toLowerCase();
  });

  return {
    id: `spotify:track:${spotifyId}`,
    title: song.title || song.name || 'Unknown Title',
    artist: song.artist || song.artists?.[0]?.name || 'Unknown Artist',
    album: song.album || song.album_name || 'Unknown Album',
    albumArt: song.albumArt || song.albumImage || song.album_art || song.album_artwork || 
              `https://via.placeholder.com/300?text=${encodeURIComponent(song.title || 'Song')}`,
    duration: song.duration || (song.duration_ms ? Math.round(song.duration_ms / 1000) : 180),
    bpm: song.bpm || song.tempo || 120,
    energyLevel: (song.energyLevel || Math.ceil((song.energy || 0.5) * 5)) as 1 | 2 | 3 | 4 | 5,
    explicit: song.explicit || false,
    generationAppeal: song.generationAppeal || ['millennial', 'gen_z'],
    genres: genres,
    previewUrl: song.previewUrl || song.preview_url || null,
    spotifyUri: `spotify:track:${spotifyId}`,
    moments: moments,
    popularIn: song.popularIn || song.popular_in || ['US'],
    decade: song.decade || determineDecade(song.release_date || song.releaseDate),
    moodTags: song.moodTags || song.mood_tags || [],
    spotifyPopularity: song.spotifyPopularity || song.popularity || 70,
    audioFeatures: song.audioFeatures || {
      danceability: song.danceability || 0.5,
      energy: song.energy || (song.energyLevel ? song.energyLevel / 5 : 0.5),
      valence: song.valence || 0.5,
      acousticness: song.acousticness || 0.3,
      tempo: song.bpm || song.tempo || 120
    }
  };
}

/**
 * Determine decade from release date
 */
function determineDecade(releaseDate?: string): string {
  if (!releaseDate) return '2020s';
  const year = parseInt(releaseDate.substring(0, 4));
  if (year < 1960) return 'classic';
  if (year < 1970) return '1960s';
  if (year < 1980) return '1970s';
  if (year < 1990) return '1980s';
  if (year < 2000) return '1990s';
  if (year < 2010) return '2000s';
  if (year < 2020) return '2010s';
  return '2020s';
}

/**
 * Build the complete unified song database
 */
class UnifiedSongDatabase {
  private allSongs: MasterSong[] = [];
  private songsByMoment: Map<string, MasterSong[]> = new Map();
  private songsByGenre: Map<string, MasterSong[]> = new Map();
  private songsById: Map<string, MasterSong> = new Map();
  
  constructor() {
    this.buildDatabase();
    this.indexSongs();
  }

  private buildDatabase() {
    const seenIds = new Set<string>();
    
    // 1. Add ALL_WEDDING_SONGS (973 songs - our main collection)
    console.log('Loading main wedding songs collection...');
    ALL_WEDDING_SONGS.forEach(song => {
      const masterSong = unifyToMasterSong(song);
      if (masterSong && !seenIds.has(masterSong.id)) {
        seenIds.add(masterSong.id);
        this.allSongs.push(masterSong);
      }
    });
    console.log(`Loaded ${this.allSongs.length} songs from main collection`);

    // 2. Add genre-specific collections (183 additional songs)
    const genreCollections = [
      { songs: HIP_HOP_WEDDING_SONGS, genre: 'hip-hop', moments: ['party', 'cocktails'] },
      { songs: COUNTRY_WEDDING_SONGS, genre: 'country', moments: ['ceremony', 'dinner', 'party'] },
      { songs: RNB_WEDDING_SONGS, genre: 'r&b', moments: ['first-dance', 'dinner', 'cocktails'] },
      { songs: ROCK_WEDDING_SONGS, genre: 'rock', moments: ['party', 'cocktails'] },
      { songs: INDIE_WEDDING_SONGS, genre: 'indie', moments: ['cocktails', 'dinner', 'getting-ready'] }
    ];

    genreCollections.forEach(({ songs, genre, moments }) => {
      let added = 0;
      songs.forEach(song => {
        const masterSong = unifyToMasterSong(song, moments, [genre]);
        if (masterSong && !seenIds.has(masterSong.id)) {
          seenIds.add(masterSong.id);
          this.allSongs.push(masterSong);
          added++;
        }
      });
      console.log(`Added ${added} unique ${genre} songs`);
    });

    // 3. Add curated songs if they're unique
    Object.entries(CURATED_SONGS).forEach(([moment, songs]) => {
      songs.forEach(song => {
        const masterSong = unifyToMasterSong(song, [moment]);
        if (masterSong && !seenIds.has(masterSong.id)) {
          seenIds.add(masterSong.id);
          this.allSongs.push(masterSong);
        }
      });
    });

    // 4. Add songs from our fixed master playlist (with valid IDs)
    MASTER_WEDDING_SONGS.forEach(song => {
      if (!seenIds.has(song.id)) {
        seenIds.add(song.id);
        this.allSongs.push(song);
      }
    });

    console.log(`Total unique songs in unified database: ${this.allSongs.length}`);
  }

  private indexSongs() {
    // Index by ID for quick lookups
    this.allSongs.forEach(song => {
      this.songsById.set(song.id, song);
      
      // Index by moment
      (song.moments || []).forEach(moment => {
        if (!this.songsByMoment.has(moment)) {
          this.songsByMoment.set(moment, []);
        }
        this.songsByMoment.get(moment)!.push(song);
      });
      
      // Index by genre
      (song.genres || []).forEach(genre => {
        const normalized = genre.toLowerCase();
        if (!this.songsByGenre.has(normalized)) {
          this.songsByGenre.set(normalized, []);
        }
        this.songsByGenre.get(normalized)!.push(song);
      });
    });

    console.log('Songs indexed by moment:', Array.from(this.songsByMoment.keys()));
    console.log('Songs indexed by genre:', Array.from(this.songsByGenre.keys()));
  }

  /**
   * Get filtered songs with intelligent fallbacks
   */
  getFilteredSongs(options: {
    moment?: string;
    genres?: string[];
    country?: string;
    energyLevel?: number;
    excludeExplicit?: boolean;
    limit?: number;
  }): MasterSong[] {
    const { moment, genres, country, energyLevel, excludeExplicit = false, limit = 50 } = options;
    
    let candidates = [...this.allSongs];
    
    // Filter by moment
    if (moment) {
      const momentSongs = this.songsByMoment.get(moment);
      if (momentSongs && momentSongs.length > 0) {
        candidates = momentSongs;
      } else {
        // Fallback: use energy level to infer appropriate songs
        if (moment === 'party') {
          candidates = candidates.filter(s => s.energyLevel >= 4);
        } else if (['ceremony', 'first-dance', 'parent-dances'].includes(moment)) {
          candidates = candidates.filter(s => s.energyLevel <= 3);
        }
      }
    }
    
    // Filter by genres
    if (genres && genres.length > 0) {
      const normalizedGenres = genres.map(g => {
        const normalized = g.toLowerCase();
        if (normalized === 'rnb') return 'r&b';
        return normalized;
      });
      
      const genreMatches = candidates.filter(song => 
        song.genres.some(g => {
          const normalizedSongGenre = g.toLowerCase() === 'rnb' ? 'r&b' : g.toLowerCase();
          return normalizedGenres.includes(normalizedSongGenre);
        })
      );
      
      // Only use genre filter if we get reasonable results
      if (genreMatches.length >= Math.min(10, limit / 2)) {
        candidates = genreMatches;
      }
    }
    
    // Filter by country preference
    if (country) {
      // Sort by country preference but don't exclude
      candidates = candidates.sort((a, b) => {
        const aMatch = (a.popularIn || []).includes(country) ? 1 : 0;
        const bMatch = (b.popularIn || []).includes(country) ? 1 : 0;
        return bMatch - aMatch;
      });
    }
    
    // Filter by energy level
    if (energyLevel) {
      const energyMatches = candidates.filter(song => 
        Math.abs(song.energyLevel - energyLevel) <= 1
      );
      
      // Only apply if we get enough results
      if (energyMatches.length >= Math.min(10, limit / 2)) {
        candidates = energyMatches;
      }
    }
    
    // Filter explicit content
    if (excludeExplicit) {
      candidates = candidates.filter(song => !song.explicit);
    }
    
    // Sort by popularity and return limited results
    return candidates
      .sort((a, b) => (b.spotifyPopularity || 70) - (a.spotifyPopularity || 70))
      .slice(0, limit);
  }

  /**
   * Get a complete wedding timeline with all moments populated
   */
  getWeddingTimeline(options: {
    country?: string;
    genres?: string[];
    excludeExplicit?: boolean;
  }): Record<string, MasterSong[]> {
    const { country = 'US', genres = [], excludeExplicit = false } = options;
    
    const momentConfigs = [
      { id: 'getting-ready', count: 8, energy: 2 },
      { id: 'ceremony', count: 5, energy: 2 },
      { id: 'cocktails', count: 20, energy: 3 },
      { id: 'dinner', count: 20, energy: 2 },
      { id: 'first-dance', count: 3, energy: 2 },
      { id: 'parent-dances', count: 3, energy: 2 },
      { id: 'party', count: 50, energy: 4 },
      { id: 'last-dance', count: 3, energy: 3 }
    ];
    
    const timeline: Record<string, MasterSong[]> = {};
    const usedSongIds = new Set<string>();
    
    momentConfigs.forEach(({ id, count, energy }) => {
      // Get songs for this moment
      let songs = this.getFilteredSongs({
        moment: id,
        genres: genres.length > 0 ? genres : undefined,
        country,
        energyLevel: energy,
        excludeExplicit,
        limit: count * 3 // Get extra for variety
      });
      
      // Filter out already used songs for variety
      songs = songs.filter(s => !usedSongIds.has(s.id));
      
      // Take the required number
      timeline[id] = songs.slice(0, count);
      timeline[id].forEach(s => usedSongIds.add(s.id));
      
      // If we don't have enough, get more without genre filter
      if (timeline[id].length < count) {
        const needed = count - timeline[id].length;
        const moreSongs = this.getFilteredSongs({
          moment: id,
          country,
          energyLevel: energy,
          excludeExplicit,
          limit: needed * 2
        }).filter(s => !usedSongIds.has(s.id));
        
        moreSongs.slice(0, needed).forEach(song => {
          timeline[id].push(song);
          usedSongIds.add(song.id);
        });
      }
    });
    
    return timeline;
  }

  /**
   * Search songs by query
   */
  searchSongs(query: string, limit: number = 20): MasterSong[] {
    const normalizedQuery = query.toLowerCase();
    
    return this.allSongs
      .filter(song => 
        song.title.toLowerCase().includes(normalizedQuery) ||
        song.artist.toLowerCase().includes(normalizedQuery) ||
        song.album?.toLowerCase().includes(normalizedQuery)
      )
      .sort((a, b) => {
        // Prioritize exact matches
        const aExact = a.title.toLowerCase() === normalizedQuery ? 1 : 0;
        const bExact = b.title.toLowerCase() === normalizedQuery ? 1 : 0;
        if (aExact !== bExact) return bExact - aExact;
        
        // Then sort by popularity
        return (b.spotifyPopularity || 70) - (a.spotifyPopularity || 70);
      })
      .slice(0, limit);
  }

  /**
   * Get statistics about the database
   */
  getStats() {
    const stats = {
      totalSongs: this.allSongs.length,
      byMoment: {} as Record<string, number>,
      byGenre: {} as Record<string, number>,
      byDecade: {} as Record<string, number>,
      explicitCount: 0,
      withPreviewUrl: 0,
      averagePopularity: 0
    };
    
    this.songsByMoment.forEach((songs, moment) => {
      stats.byMoment[moment] = songs.length;
    });
    
    this.songsByGenre.forEach((songs, genre) => {
      stats.byGenre[genre] = songs.length;
    });
    
    let totalPopularity = 0;
    this.allSongs.forEach(song => {
      // Decade stats
      stats.byDecade[song.decade] = (stats.byDecade[song.decade] || 0) + 1;
      
      // Other stats
      if (song.explicit) stats.explicitCount++;
      if (song.previewUrl) stats.withPreviewUrl++;
      totalPopularity += song.spotifyPopularity || 70;
    });
    
    stats.averagePopularity = Math.round(totalPopularity / this.allSongs.length);
    
    return stats;
  }
}

// Create and export the unified database instance
export const UNIFIED_SONG_DATABASE = new UnifiedSongDatabase();

// Export convenient access methods
export const getUnifiedFilteredSongs = (options: Parameters<typeof UNIFIED_SONG_DATABASE.getFilteredSongs>[0]) => 
  UNIFIED_SONG_DATABASE.getFilteredSongs(options);

export const getUnifiedWeddingTimeline = (options: Parameters<typeof UNIFIED_SONG_DATABASE.getWeddingTimeline>[0]) => 
  UNIFIED_SONG_DATABASE.getWeddingTimeline(options);

export const searchUnifiedSongs = (query: string, limit?: number) => 
  UNIFIED_SONG_DATABASE.searchSongs(query, limit);

export const getUnifiedDatabaseStats = () => 
  UNIFIED_SONG_DATABASE.getStats();

// Log stats on load
console.log('Unified Wedding Song Database initialized:', UNIFIED_SONG_DATABASE.getStats());