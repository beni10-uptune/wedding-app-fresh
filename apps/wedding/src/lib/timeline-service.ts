/**
 * Timeline Service
 * 
 * Handles all timeline operations including initialization,
 * filtering, and updates. Guarantees a populated timeline.
 */

import { WeddingV2, Timeline, TimelineSong } from '@/types/wedding-v2';
import { WEDDING_MOMENTS_V2 as WEDDING_MOMENTS } from '@/data/weddingMomentsV2';
import { 
  MASTER_WEDDING_SONGS, 
  getDefaultWeddingTimeline,
  getFilteredSongs,
  MasterSong 
} from '@/data/masterWeddingPlaylist';
import { Timestamp } from 'firebase/firestore';

/**
 * Convert MasterSong to TimelineSong
 */
function masterSongToTimelineSong(song: MasterSong, momentId: string): TimelineSong {
  return {
    id: `${momentId}_${song.id}_${Date.now()}`,
    spotifyId: song.id,
    title: song.title,
    artist: song.artist,
    album: song.album || '',
    albumArt: song.albumArt || `https://source.unsplash.com/300x300/?music,wedding`,
    previewUrl: song.previewUrl || null,
    duration: song.duration,
    addedBy: 'couple',
    addedAt: Timestamp.now(),
    energy: song.energyLevel,
    explicit: song.explicit || false
  };
}

/**
 * Initialize a complete timeline with default songs
 * This ALWAYS returns a fully populated timeline
 */
export function initializeTimeline(
  country: string = 'US',
  genres: string[] = [],
  existingTimeline?: Timeline
): Timeline {
  const timeline: Timeline = {};
  
  // Get default songs for each moment
  const defaultSongs = getDefaultWeddingTimeline(country, genres);
  
  WEDDING_MOMENTS.forEach(moment => {
    // Check if we have existing songs for this moment
    const existingSongs = existingTimeline?.[moment.id]?.songs || [];
    
    // Get recommended songs for this moment
    const recommendedSongs = defaultSongs[moment.id] || [];
    
    // Use existing songs if available, otherwise use recommended
    let songs: TimelineSong[] = [];
    
    if (existingSongs.length > 0) {
      // Keep existing songs
      songs = existingSongs;
    } else if (recommendedSongs.length > 0) {
      // Convert recommended songs to timeline format
      songs = recommendedSongs.map(song => 
        masterSongToTimelineSong(song, moment.id)
      );
    } else {
      // Fallback: get ANY songs that fit this moment
      const fallbackSongs = getFilteredSongs(moment.id).slice(0, 3);
      songs = fallbackSongs.map(song => 
        masterSongToTimelineSong(song, moment.id)
      );
    }
    
    timeline[moment.id] = {
      id: moment.id,
      name: moment.name,
      order: moment.order,
      duration: moment.duration,
      songs
    };
  });
  
  return timeline;
}

/**
 * Update timeline based on filter changes
 * Preserves manually added songs, updates suggestions
 */
export function updateTimelineWithFilters(
  currentTimeline: Timeline,
  country?: string,
  genres?: string[],
  preserveManualSongs: boolean = true
): Timeline {
  const updatedTimeline: Timeline = {};
  
  WEDDING_MOMENTS.forEach(moment => {
    const currentMoment = currentTimeline[moment.id];
    const currentSongs = currentMoment?.songs || [];
    
    if (preserveManualSongs && currentSongs.length > 0) {
      // Keep existing songs if preserving manual additions
      updatedTimeline[moment.id] = currentMoment;
    } else {
      // Get new filtered songs
      const filteredSongs = getFilteredSongs(moment.id, country, genres);
      
      // Determine how many songs to add based on moment
      const songCount = getSongCountForMoment(moment.id);
      
      const newSongs = filteredSongs
        .slice(0, songCount)
        .map(song => masterSongToTimelineSong(song, moment.id));
      
      updatedTimeline[moment.id] = {
        id: moment.id,
        name: moment.name,
        order: moment.order,
        duration: moment.duration,
        songs: newSongs
      };
    }
  });
  
  return updatedTimeline;
}

/**
 * Get recommended song count for each moment
 */
function getSongCountForMoment(momentId: string): number {
  const counts: Record<string, number> = {
    'getting-ready': 5,
    'ceremony': 3,
    'cocktails': 10,
    'dinner': 8,
    'first-dance': 1,
    'parent-dances': 2,
    'party': 20,
    'last-dance': 2
  };
  
  return counts[momentId] || 3;
}

/**
 * Add smart suggestions based on current selections
 */
export function getSmartSuggestions(
  timeline: Timeline,
  momentId: string,
  count: number = 5
): MasterSong[] {
  // Analyze current timeline for patterns
  const allSongs: TimelineSong[] = [];
  Object.values(timeline).forEach(moment => {
    allSongs.push(...(moment.songs || []));
  });
  
  // Extract common genres from current selection
  const genreCounts: Record<string, number> = {};
  const artistCounts: Record<string, number> = {};
  
  allSongs.forEach(song => {
    // Track artists (we'd need to store this in TimelineSong)
    artistCounts[song.artist] = (artistCounts[song.artist] || 0) + 1;
  });
  
  // Get songs for the specific moment
  let suggestions = getFilteredSongs(momentId);
  
  // Filter out songs already in timeline
  const existingIds = new Set(allSongs.map(s => s.spotifyId));
  suggestions = suggestions.filter(s => !existingIds.has(s.id));
  
  // Sort by relevance (could be enhanced with ML)
  suggestions.sort((a, b) => {
    // Prioritize by popularity
    const popDiff = (b.spotifyPopularity || 0) - (a.spotifyPopularity || 0);
    if (popDiff !== 0) return popDiff;
    
    // Then by energy match
    const avgEnergy = allSongs.reduce((sum, s) => sum + (s.energy || 3), 0) / allSongs.length;
    const aEnergyDiff = Math.abs(a.energyLevel - avgEnergy);
    const bEnergyDiff = Math.abs(b.energyLevel - avgEnergy);
    
    return aEnergyDiff - bEnergyDiff;
  });
  
  return suggestions.slice(0, count);
}

/**
 * Validate and fix timeline
 * Ensures every moment has at least some songs
 */
export function validateAndFixTimeline(timeline: Timeline): Timeline {
  const fixed: Timeline = {};
  
  WEDDING_MOMENTS.forEach(moment => {
    const existing = timeline[moment.id];
    
    if (!existing || !existing.songs || existing.songs.length === 0) {
      // Get default songs for this moment
      const defaultSongs = getFilteredSongs(moment.id);
      const songCount = Math.min(3, defaultSongs.length);
      
      fixed[moment.id] = {
        id: moment.id,
        name: moment.name,
        order: moment.order,
        duration: moment.duration,
        songs: defaultSongs
          .slice(0, songCount)
          .map(song => masterSongToTimelineSong(song, moment.id))
      };
    } else {
      // Keep existing moment
      fixed[moment.id] = existing;
    }
  });
  
  return fixed;
}

/**
 * Calculate timeline statistics
 */
export function getTimelineStats(timeline: Timeline) {
  let totalSongs = 0;
  let totalDuration = 0;
  const genres = new Set<string>();
  const decades = new Set<string>();
  
  Object.values(timeline).forEach(moment => {
    if (moment.songs) {
      totalSongs += moment.songs.length;
      moment.songs.forEach(song => {
        totalDuration += song.duration || 0;
      });
    }
  });
  
  return {
    totalSongs,
    totalDuration: Math.round(totalDuration / 60), // in minutes
    uniqueGenres: genres.size,
    uniqueDecades: decades.size,
    averageSongsPerMoment: Math.round(totalSongs / Object.keys(timeline).length)
  };
}