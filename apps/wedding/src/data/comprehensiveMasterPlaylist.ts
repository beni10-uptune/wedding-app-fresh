/**
 * Comprehensive Master Wedding Playlist
 * 
 * This file aggregates songs from all our collections to create a complete
 * wedding music database with proper Spotify IDs and rich metadata.
 */

import { MasterSong } from './masterWeddingPlaylist';
import { CURATED_SONGS } from './curatedSongs';
import { HIP_HOP_WEDDING_SONGS } from './genre-songs/hip-hop-wedding-songs';
import { COUNTRY_WEDDING_SONGS } from './genre-songs/country-wedding-songs';
import { RNB_WEDDING_SONGS } from './genre-songs/rnb-wedding-songs';
import { ROCK_WEDDING_SONGS } from './genre-songs/rock-wedding-songs';
import { INDIE_WEDDING_SONGS } from './genre-songs/indie-wedding-songs';
import { SPOTIFY_WEDDING_SONGS } from './spotify-wedding-songs';

/**
 * Convert various song formats to MasterSong format
 */
function convertToMasterSong(song: any, defaultMoments: string[] = []): MasterSong | null {
  // Extract Spotify ID from various formats
  let spotifyId = song.id;
  if (spotifyId?.startsWith('spotify:track:')) {
    spotifyId = spotifyId.replace('spotify:track:', '');
  }
  
  // Ensure we have a valid 22-character Spotify ID
  if (!spotifyId || spotifyId.length !== 22) {
    return null;
  }

  return {
    id: `spotify:track:${spotifyId}`,
    title: song.title || song.name,
    artist: song.artist || song.artists?.[0]?.name || 'Unknown Artist',
    album: song.album || 'Unknown Album',
    albumArt: song.albumArt || song.albumImage || song.album_art || `https://via.placeholder.com/300`,
    duration: song.duration || song.duration_ms ? Math.round(song.duration_ms / 1000) : 180,
    bpm: song.bpm || song.tempo || 120,
    energyLevel: song.energyLevel || Math.ceil((song.energy || 0.5) * 5) as 1 | 2 | 3 | 4 | 5,
    explicit: song.explicit || false,
    generationAppeal: song.generationAppeal || ['millennial', 'gen_z'],
    genres: song.genres || [],
    previewUrl: song.previewUrl || song.preview_url || null,
    spotifyUri: `spotify:track:${spotifyId}`,
    moments: song.moments || defaultMoments,
    popularIn: song.popularIn || ['US'],
    decade: song.decade || '2020s',
    moodTags: song.moodTags || [],
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
 * Map wedding moments from curated songs to our moment IDs
 */
const momentMapping: Record<string, string[]> = {
  'prelude': ['getting-ready'],
  'processional': ['ceremony'],
  'recessional': ['ceremony'],
  'cocktail': ['cocktails'],
  'dinner': ['dinner'],
  'firstDance': ['first-dance'],
  'parentDance': ['parent-dances'],
  'party': ['party'],
  'lastDance': ['last-dance']
};

/**
 * Build comprehensive song list from all sources
 */
function buildComprehensiveSongList(): MasterSong[] {
  const allSongs: MasterSong[] = [];
  const seenIds = new Set<string>();

  // 1. Add curated songs (high quality, manually selected)
  Object.entries(CURATED_SONGS).forEach(([moment, songs]) => {
    const mappedMoments = momentMapping[moment] || [moment];
    songs.forEach(song => {
      const masterSong = convertToMasterSong(song, mappedMoments);
      if (masterSong && !seenIds.has(masterSong.id)) {
        seenIds.add(masterSong.id);
        allSongs.push(masterSong);
      }
    });
  });

  // 2. Add genre-specific songs
  const genreSongCollections = [
    { songs: HIP_HOP_WEDDING_SONGS, genre: 'hip-hop', moments: ['party', 'cocktails'] },
    { songs: COUNTRY_WEDDING_SONGS, genre: 'country', moments: ['ceremony', 'dinner', 'party'] },
    { songs: RNB_WEDDING_SONGS, genre: 'r&b', moments: ['first-dance', 'dinner', 'cocktails'] },
    { songs: ROCK_WEDDING_SONGS, genre: 'rock', moments: ['party', 'cocktails'] },
    { songs: INDIE_WEDDING_SONGS, genre: 'indie', moments: ['cocktails', 'dinner', 'getting-ready'] }
  ];

  genreSongCollections.forEach(({ songs, genre, moments }) => {
    songs.forEach(song => {
      const masterSong = convertToMasterSong({
        ...song,
        genres: song.genres?.length ? song.genres : [genre]
      }, moments);
      
      if (masterSong && !seenIds.has(masterSong.id)) {
        seenIds.add(masterSong.id);
        allSongs.push(masterSong);
      }
    });
  });

  // 3. Add popular Spotify wedding songs (for variety and coverage)
  // Take songs from each category to ensure variety
  Object.entries(SPOTIFY_WEDDING_SONGS).forEach(([category, songs]) => {
    // Map category to our moment IDs
    const categoryToMoments: Record<string, string[]> = {
      'processional': ['ceremony'],
      'firstDance': ['first-dance'],
      'parentDance': ['parent-dances'],
      'party': ['party'],
      'dinner': ['dinner'],
      'cocktails': ['cocktails'],
      'lastDance': ['last-dance']
    };
    
    const moments = categoryToMoments[category] || ['party'];
    
    // Take first 20 songs from each category
    songs.slice(0, 20).forEach(song => {
      const masterSong = convertToMasterSong(song, moments);
      if (masterSong && !seenIds.has(masterSong.id)) {
        seenIds.add(masterSong.id);
        allSongs.push(masterSong);
      }
    });
  });

  return allSongs.filter((song): song is MasterSong => song !== null);
}

// Build and export the comprehensive playlist
export const COMPREHENSIVE_MASTER_SONGS = buildComprehensiveSongList();

/**
 * Enhanced filtering function that works with the comprehensive playlist
 */
export function getFilteredComprehensiveSongs(
  moment?: string,
  country?: string,
  genres?: string[],
  energyLevel?: number,
  excludeExplicit: boolean = false,
  limit: number = 50
): MasterSong[] {
  let filtered = [...COMPREHENSIVE_MASTER_SONGS];

  // Filter by moment
  if (moment) {
    filtered = filtered.filter(song => 
      song.moments && song.moments.includes(moment)
    );
  }

  // Filter by genres (normalize r&b/rnb)
  if (genres && genres.length > 0) {
    const normalizedGenres = genres.map(g => 
      g.toLowerCase() === 'rnb' ? 'r&b' : g.toLowerCase()
    );
    
    filtered = filtered.filter(song => 
      song.genres.some(g => {
        const normalizedSongGenre = g.toLowerCase() === 'rnb' ? 'r&b' : g.toLowerCase();
        return normalizedGenres.includes(normalizedSongGenre);
      })
    );
  }

  // Filter by country/region
  if (country) {
    // First, get songs popular in that country
    const popularInCountry = filtered.filter(song => 
      song.popularIn && song.popularIn.includes(country)
    );
    
    // If we have enough songs popular in that country, use those
    // Otherwise, use all songs but prioritize country-popular ones
    if (popularInCountry.length >= limit / 2) {
      filtered = popularInCountry;
    } else {
      // Sort to prioritize country-popular songs
      filtered = filtered.sort((a, b) => {
        const aPopular = a.popularIn?.includes(country) ? 1 : 0;
        const bPopular = b.popularIn?.includes(country) ? 1 : 0;
        return bPopular - aPopular;
      });
    }
  }

  // Filter by energy level (with tolerance)
  if (energyLevel) {
    filtered = filtered.filter(song => 
      Math.abs(song.energyLevel - energyLevel) <= 1
    );
  }

  // Exclude explicit if requested
  if (excludeExplicit) {
    filtered = filtered.filter(song => !song.explicit);
  }

  // Sort by popularity for better results
  filtered = filtered.sort((a, b) => 
    (b.spotifyPopularity || 70) - (a.spotifyPopularity || 70)
  );

  // Return limited results
  return filtered.slice(0, limit);
}

/**
 * Get songs for all wedding moments with proper distribution
 */
export function getComprehensiveWeddingTimeline(
  country: string = 'US',
  genres: string[] = [],
  excludeExplicit: boolean = false
): Record<string, MasterSong[]> {
  const timeline: Record<string, MasterSong[]> = {};
  
  // Define moments with their characteristics
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

  momentConfigs.forEach(({ id, count, energy }) => {
    const songs = getFilteredComprehensiveSongs(
      id,
      country,
      genres,
      energy,
      excludeExplicit,
      count * 2 // Get extra to ensure variety
    );
    
    // Ensure we have the right number of songs
    timeline[id] = songs.slice(0, count);
    
    // If we don't have enough filtered songs, get more without filters
    if (timeline[id].length < count) {
      const additionalSongs = getFilteredComprehensiveSongs(
        id,
        undefined, // No country filter
        undefined, // No genre filter
        energy,
        excludeExplicit,
        count - timeline[id].length
      );
      
      // Add songs that aren't already in the timeline
      const existingIds = new Set(timeline[id].map(s => s.id));
      additionalSongs.forEach(song => {
        if (!existingIds.has(song.id) && timeline[id].length < count) {
          timeline[id].push(song);
        }
      });
    }
  });

  return timeline;
}

// Export stats for debugging
export const COMPREHENSIVE_STATS = {
  totalSongs: COMPREHENSIVE_MASTER_SONGS.length,
  byGenre: COMPREHENSIVE_MASTER_SONGS.reduce((acc, song) => {
    song.genres.forEach(genre => {
      acc[genre] = (acc[genre] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>),
  byMoment: COMPREHENSIVE_MASTER_SONGS.reduce((acc, song) => {
    (song.moments || []).forEach(moment => {
      acc[moment] = (acc[moment] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>),
  explicitCount: COMPREHENSIVE_MASTER_SONGS.filter(s => s.explicit).length,
  withPreviewUrl: COMPREHENSIVE_MASTER_SONGS.filter(s => s.previewUrl).length
};

console.log('Comprehensive Master Playlist loaded:', COMPREHENSIVE_STATS);