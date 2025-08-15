/**
 * Smart Playlist Generator
 * Intelligently selects songs based on genre, moment, and quotas
 */

import { Song, Timeline, TimelineSong } from '@/types/wedding-v2';
import { WeddingMoment } from '@/types/wedding-v2';
import { WEDDING_MOMENTS_V2, MOMENT_ENERGY_PROFILES } from '@/data/weddingMomentsV2';
import { Timestamp } from 'firebase/firestore';

// Time allocations (average song is 3.5 minutes)
export const MOMENT_SONG_QUOTAS: Record<string, { min: number; ideal: number; max: number }> = {
  'getting-ready': { min: 8, ideal: 10, max: 12 },
  'ceremony': { min: 5, ideal: 6, max: 8 },
  'cocktails': { min: 22, ideal: 25, max: 30 },
  'dinner': { min: 22, ideal: 25, max: 30 },
  'first-dance': { min: 1, ideal: 2, max: 2 },
  'parent-dances': { min: 2, ideal: 3, max: 4 },
  'party': { min: 45, ideal: 50, max: 60 },
  'last-dance': { min: 2, ideal: 3, max: 4 }
};

// Genre weights for each moment (how suitable each genre is)
export const MOMENT_GENRE_WEIGHTS: Record<string, Record<string, number>> = {
  'getting-ready': {
    'pop': 0.9,
    'r&b': 0.8,
    'indie': 0.7,
    'rock': 0.5,
    'country': 0.6,
    'hip-hop': 0.6,
    'electronic': 0.7,
    'jazz': 0.8,
    'soul': 0.8,
    'acoustic': 0.9
  },
  'ceremony': {
    'classical': 1.0,
    'acoustic': 0.9,
    'indie': 0.6,
    'jazz': 0.7,
    'soul': 0.6,
    'pop': 0.5,
    'r&b': 0.5,
    'country': 0.4,
    'rock': 0.3,
    'hip-hop': 0.2,
    'electronic': 0.3
  },
  'cocktails': {
    'jazz': 1.0,
    'soul': 0.9,
    'r&b': 0.8,
    'indie': 0.7,
    'pop': 0.7,
    'acoustic': 0.7,
    'electronic': 0.6,
    'country': 0.5,
    'rock': 0.5,
    'hip-hop': 0.4,
    'classical': 0.6
  },
  'dinner': {
    'jazz': 1.0,
    'soul': 0.9,
    'acoustic': 0.9,
    'r&b': 0.8,
    'indie': 0.8,
    'pop': 0.6,
    'country': 0.5,
    'classical': 0.7,
    'electronic': 0.4,
    'rock': 0.4,
    'hip-hop': 0.3
  },
  'first-dance': {
    'r&b': 0.9,
    'pop': 0.9,
    'country': 0.8,
    'soul': 0.9,
    'indie': 0.7,
    'acoustic': 0.8,
    'jazz': 0.6,
    'rock': 0.5,
    'hip-hop': 0.4,
    'electronic': 0.3,
    'classical': 0.5
  },
  'parent-dances': {
    'pop': 0.8,
    'country': 0.9,
    'soul': 0.9,
    'r&b': 0.7,
    'acoustic': 0.8,
    'jazz': 0.7,
    'indie': 0.5,
    'rock': 0.5,
    'classical': 0.6,
    'hip-hop': 0.3,
    'electronic': 0.2
  },
  'party': {
    'pop': 1.0,
    'hip-hop': 0.9,
    'r&b': 0.9,
    'rock': 0.8,
    'electronic': 0.9,
    'country': 0.7,
    'soul': 0.7,
    'indie': 0.6,
    'jazz': 0.4,
    'acoustic': 0.3,
    'classical': 0.1
  },
  'last-dance': {
    'pop': 0.9,
    'rock': 0.8,
    'country': 0.7,
    'r&b': 0.8,
    'soul': 0.8,
    'indie': 0.7,
    'hip-hop': 0.6,
    'electronic': 0.5,
    'acoustic': 0.6,
    'jazz': 0.4,
    'classical': 0.3
  }
};

interface SongWithScore extends Song {
  score: number;
  spotifyPopularity?: number;
}

/**
 * Generate a smart playlist based on selected genres and moment requirements
 */
export function generateSmartPlaylist(
  availableSongs: Song[],
  selectedGenres: string[],
  existingTimeline?: Timeline,
  forceRegenerate: boolean = false
): Timeline {
  console.log(`[Smart Playlist] Generating with ${availableSongs.length} songs, genres: ${selectedGenres.join(', ')}, force: ${forceRegenerate}`);
  
  const timeline: Timeline = {};
  const usedSongIds = new Set<string>();
  
  // Create a pool of all songs, shuffled for variety
  const songPool = [...availableSongs].sort(() => Math.random() - 0.5);
  
  // For each wedding moment
  WEDDING_MOMENTS_V2.forEach(moment => {
    const momentId = moment.id;
    const quota = MOMENT_SONG_QUOTAS[momentId];
    const energyProfile = MOMENT_ENERGY_PROFILES[momentId];
    
    // Score and filter songs for this moment
    const scoredSongs = songPool
      .filter(song => !usedSongIds.has(song.id)) // Don't reuse songs
      .map(song => {
        const songWithScore = song as SongWithScore;
        songWithScore.score = calculateSongScore(
          song,
          momentId,
          selectedGenres,
          energyProfile
        );
        return songWithScore;
      })
      .filter(song => song.score > 0.05) // Very low threshold to get more songs
      .sort((a, b) => b.score - a.score);
    
    // Always ensure we have enough songs
    let songsToSelect = scoredSongs;
    
    // If we don't have enough scored songs, add more based on energy alone
    if (songsToSelect.length < quota.ideal * 2) {  // Get 2x ideal for better selection
      const additionalSongs = songPool
        .filter(song => !usedSongIds.has(song.id) && !scoredSongs.find(s => s.id === song.id))
        .filter(song => {
          const energy = song.energyLevel || 3;
          // More lenient energy matching
          return energy >= Math.max(1, energyProfile.min - 1) && 
                 energy <= Math.min(5, energyProfile.max + 1);
        })
        .map(song => {
          const songWithScore = song as SongWithScore;
          songWithScore.score = 0.3; // Give them a moderate score
          return songWithScore;
        })
        .slice(0, quota.ideal * 2);  // Limit additional songs
      
      songsToSelect = [...scoredSongs, ...additionalSongs];
    }
    
    // If still not enough, just grab any songs we haven't used
    if (songsToSelect.length < quota.ideal) {
      const desperateSongs = songPool
        .filter(song => !usedSongIds.has(song.id) && !songsToSelect.find(s => s.id === song.id))
        .map(song => {
          const songWithScore = song as SongWithScore;
          songWithScore.score = 0.1;
          return songWithScore;
        })
        .slice(0, quota.ideal - songsToSelect.length);
      
      songsToSelect = [...songsToSelect, ...desperateSongs];
    }
    
    // Select songs up to the ideal quota
    const selectedSongs = selectOptimalSongs(
      songsToSelect,
      quota.ideal,
      moment.duration
    );
    
    console.log(`[Smart Playlist] ${momentId}: Selected ${selectedSongs.length} songs (quota: ${quota.ideal})`);
    
    // Mark songs as used
    selectedSongs.forEach(song => usedSongIds.add(song.id));
    
    // Convert to TimelineSong format
    timeline[momentId] = {
      id: momentId,
      name: moment.name,
      order: moment.order,
      duration: moment.duration,
      songs: selectedSongs.map(song => songToTimelineSong(song))
    };
  });
  
  // If we have an existing timeline and not forcing regeneration, merge intelligently
  if (existingTimeline && !forceRegenerate) {
    console.log('[Smart Playlist] Merging with existing timeline');
    return mergeTimelines(timeline, existingTimeline);
  }
  
  return timeline;
}

/**
 * Calculate a score for how well a song fits a moment and genre selection
 */
function calculateSongScore(
  song: Song,
  momentId: string,
  selectedGenres: string[],
  energyProfile: { min: number; max: number; ideal: number }
): number {
  let score = 0;
  
  // 1. Energy level matching (40% weight) - Most important since genres are often empty
  const songEnergy = song.energyLevel || 3;
  const energyDiff = Math.abs(songEnergy - energyProfile.ideal);
  const energyScore = Math.max(0, 1 - (energyDiff / 5));
  score += energyScore * 0.4;
  
  // 2. Moment suitability (30% weight)
  if (song.moments && song.moments.length > 0) {
    if (song.moments.includes(momentId)) {
      score += 0.3;
    } else {
      // Check if any of the song's moments are similar
      const similarMoments = getSimilarMoments(momentId);
      const hasSimilar = song.moments.some(m => similarMoments.includes(m));
      if (hasSimilar) {
        score += 0.15;
      } else {
        // Give a small score if the energy level is appropriate
        if (songEnergy >= energyProfile.min && songEnergy <= energyProfile.max) {
          score += 0.1;
        }
      }
    }
  } else {
    // No moment tags - use energy level as guide
    if (songEnergy >= energyProfile.min && songEnergy <= energyProfile.max) {
      score += 0.2;
    }
  }
  
  // 3. Genre matching (20% weight) - Lower weight since many songs have empty genres
  const genreWeights = MOMENT_GENRE_WEIGHTS[momentId] || {};
  let genreScore = 0;
  
  if (selectedGenres.length === 0 || !song.genres || song.genres.length === 0) {
    // No genre data or filter - give neutral score
    genreScore = 0.5;
  } else {
    // Calculate genre match
    const songGenres = song.genres || [];
    for (const genre of songGenres) {
      const normalizedGenre = normalizeGenre(genre);
      if (selectedGenres.includes(normalizedGenre)) {
        genreScore += genreWeights[normalizedGenre] || 0.5;
      }
    }
    genreScore = genreScore / Math.max(songGenres.length, 1);
  }
  score += genreScore * 0.2;
  
  // 4. Popularity boost (10% weight)
  const popularity = (song as any).popularity || (song as any).spotifyPopularity || 70;
  score += (popularity / 100) * 0.1;
  
  // 5. Explicit content penalty for certain moments
  if (song.explicit) {
    if (['ceremony', 'parent-dances'].includes(momentId)) {
      score *= 0.3; // Heavy penalty
    } else if (['dinner', 'cocktails', 'getting-ready'].includes(momentId)) {
      score *= 0.7; // Moderate penalty
    } else if (['party', 'last-dance'].includes(momentId)) {
      score *= 0.9; // Light penalty - more acceptable
    }
  }
  
  return score;
}

/**
 * Select optimal songs based on scores and duration requirements
 */
function selectOptimalSongs(
  scoredSongs: SongWithScore[],
  targetCount: number,
  targetDuration: number
): Song[] {
  const selected: Song[] = [];
  let currentDuration = 0;
  const targetSeconds = targetDuration * 60;
  
  // First pass: Add songs that fit within duration
  for (const song of scoredSongs) {
    if (selected.length >= targetCount) break;
    
    const songDuration = song.duration || 210; // Default 3.5 minutes
    if (currentDuration + songDuration <= targetSeconds * 1.5) { // Allow 50% overflow
      selected.push(song);
      currentDuration += songDuration;
    }
  }
  
  // Second pass: If we don't have enough songs, add more regardless of duration
  if (selected.length < targetCount) {
    const remaining = scoredSongs
      .filter(s => !selected.includes(s))
      .slice(0, targetCount - selected.length);
    selected.push(...remaining);
  }
  
  // Ensure we always return at least the minimum quota
  const minimumCount = Math.max(2, Math.floor(targetCount * 0.5));
  if (selected.length < minimumCount && scoredSongs.length > selected.length) {
    const additionalNeeded = minimumCount - selected.length;
    const additionalSongs = scoredSongs
      .filter(s => !selected.includes(s))
      .slice(0, additionalNeeded);
    selected.push(...additionalSongs);
  }
  
  return selected;
}

/**
 * Convert Song to TimelineSong
 */
function songToTimelineSong(song: Song): TimelineSong {
  return {
    id: song.id,
    spotifyId: song.id.replace('spotify:track:', ''),
    title: song.title,
    artist: song.artist,
    album: song.album || '',
    albumArt: song.albumArt || song.albumImage || '',
    previewUrl: song.previewUrl,
    duration: song.duration || 210,
    addedBy: 'couple',
    addedAt: Timestamp.now(),
    energy: song.energyLevel || 3,
    explicit: song.explicit || false
  };
}

/**
 * Merge new timeline with existing one intelligently
 */
function mergeTimelines(newTimeline: Timeline, existingTimeline: Timeline): Timeline {
  const merged: Timeline = {};
  
  WEDDING_MOMENTS_V2.forEach(moment => {
    const momentId = moment.id;
    const existing = existingTimeline[momentId];
    const generated = newTimeline[momentId];
    
    if (!existing || !existing.songs || existing.songs.length === 0) {
      // Use generated if no existing songs
      merged[momentId] = generated;
    } else if (existing.songs.length < MOMENT_SONG_QUOTAS[momentId].min) {
      // Supplement existing with generated
      const existingIds = new Set(existing.songs.map(s => s.id));
      const additional = generated.songs.filter(s => !existingIds.has(s.id));
      merged[momentId] = {
        id: momentId,
        name: moment.name,
        order: moment.order,
        duration: moment.duration,
        songs: [...existing.songs, ...additional.slice(0, MOMENT_SONG_QUOTAS[momentId].ideal - existing.songs.length)]
      };
    } else {
      // Keep existing
      merged[momentId] = existing;
    }
  });
  
  return merged;
}

/**
 * Get similar moments for fallback matching
 */
function getSimilarMoments(momentId: string): string[] {
  const similarityMap: Record<string, string[]> = {
    'getting-ready': ['cocktails', 'dinner'],
    'ceremony': ['first-dance', 'parent-dances'],
    'cocktails': ['dinner', 'getting-ready'],
    'dinner': ['cocktails', 'getting-ready'],
    'first-dance': ['parent-dances', 'ceremony'],
    'parent-dances': ['first-dance', 'ceremony'],
    'party': ['last-dance'],
    'last-dance': ['party']
  };
  
  return similarityMap[momentId] || [];
}

/**
 * Normalize genre strings for consistency
 */
function normalizeGenre(genre: string): string {
  const normalized = genre.toLowerCase().trim();
  const mappings: Record<string, string> = {
    'rnb': 'r&b',
    'r & b': 'r&b',
    'hiphop': 'hip-hop',
    'hip hop': 'hip-hop',
    'electronic dance': 'electronic',
    'edm': 'electronic',
    'country pop': 'country',
    'indie rock': 'indie',
    'indie pop': 'indie',
    'classic rock': 'rock'
  };
  
  return mappings[normalized] || normalized;
}

/**
 * Get available genres from song collection
 */
export function extractAvailableGenres(songs: Song[]): string[] {
  const genreSet = new Set<string>();
  
  songs.forEach(song => {
    (song.genres || []).forEach(genre => {
      genreSet.add(normalizeGenre(genre));
    });
  });
  
  return Array.from(genreSet).sort();
}

/**
 * Calculate statistics for a timeline
 */
export function calculateTimelineStats(timeline: Timeline) {
  let totalSongs = 0;
  let totalDuration = 0;
  const genreCounts: Record<string, number> = {};
  
  Object.values(timeline).forEach(moment => {
    moment.songs.forEach(song => {
      totalSongs++;
      totalDuration += song.duration || 0;
      
      // Track genres (if we had them on TimelineSong)
    });
  });
  
  return {
    totalSongs,
    totalDuration,
    averageSongLength: totalDuration / totalSongs,
    genreCounts
  };
}