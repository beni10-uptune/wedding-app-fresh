/**
 * Smart Playlist Hook
 * Manages genre-based playlist generation and filtering
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Song, Timeline } from '@/types/wedding-v2';
import { 
  generateSmartPlaylist, 
  extractAvailableGenres,
  calculateTimelineStats,
  MOMENT_SONG_QUOTAS
} from '@/lib/smart-playlist-generator';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface UseSmartPlaylistOptions {
  initialTimeline?: Timeline;
  autoLoad?: boolean;
}

interface UseSmartPlaylistReturn {
  // State
  selectedGenres: string[];
  availableGenres: string[];
  availableSongs: Song[];
  isLoading: boolean;
  error: string | null;
  timeline: Timeline | null;
  stats: {
    totalSongs: number;
    totalDuration: number;
    genreCounts: Record<string, number>;
  } | null;
  
  // Actions
  toggleGenre: (genre: string) => void;
  clearGenres: () => void;
  regeneratePlaylist: () => Promise<void>;
  loadSongsFromFirestore: () => Promise<void>;
  applySmartSelection: () => Timeline | undefined;
}

export function useSmartPlaylist(options: UseSmartPlaylistOptions = {}): UseSmartPlaylistReturn {
  const { initialTimeline, autoLoad = true } = options;
  
  // State
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [availableGenres, setAvailableGenres] = useState<string[]>([]);
  const [availableSongs, setAvailableSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<Timeline | null>(initialTimeline || null);
  
  // Load songs from Firestore
  const loadSongsFromFirestore = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Always load from local data for now - it's more complete
      // In production, we'd check Firestore first
      console.log('Loading songs from local data...');
      await loadLocalSongs();
      
      // Optional: Try Firestore as well to see if there are additional songs
      try {
        const songsRef = collection(db, 'songs');
        const songsSnapshot = await getDocs(query(songsRef, limit(100)));
        
        if (!songsSnapshot.empty) {
          console.log(`Found ${songsSnapshot.size} songs in Firestore (limited query)`);
        }
      } catch (firestoreErr) {
        console.log('Firestore not available, using local data only');
      }
    } catch (err) {
      console.error('Error loading songs:', err);
      setError('Failed to load song data. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Load songs from local data files
  const loadLocalSongs = useCallback(async () => {
    try {
      // Dynamically import song data
      const [
        { getUnifiedFilteredSongs },
        { HIP_HOP_WEDDING_SONGS },
        { COUNTRY_WEDDING_SONGS },
        { RNB_WEDDING_SONGS },
        { ROCK_WEDDING_SONGS },
        { INDIE_WEDDING_SONGS }
      ] = await Promise.all([
        import('@/data/unifiedMasterPlaylist'),
        import('@/data/genre-songs/hip-hop-wedding-songs'),
        import('@/data/genre-songs/country-wedding-songs'),
        import('@/data/genre-songs/rnb-wedding-songs'),
        import('@/data/genre-songs/rock-wedding-songs'),
        import('@/data/genre-songs/indie-wedding-songs')
      ]);
      
      // Get all songs from unified database
      const unifiedSongs = getUnifiedFilteredSongs({});
      
      // Combine all songs
      const allSongs = [
        ...unifiedSongs,
        ...HIP_HOP_WEDDING_SONGS,
        ...COUNTRY_WEDDING_SONGS,
        ...RNB_WEDDING_SONGS,
        ...ROCK_WEDDING_SONGS,
        ...INDIE_WEDDING_SONGS
      ];
      
      // Deduplicate by ID
      const uniqueSongs = Array.from(
        new Map(allSongs.map(song => [song.id, song])).values()
      );
      
      setAvailableSongs(uniqueSongs);
      const genres = extractAvailableGenres(uniqueSongs);
      setAvailableGenres(genres);
      
      console.log(`Loaded ${uniqueSongs.length} songs with ${genres.length} genres from local data`);
    } catch (err) {
      console.error('Error loading local songs:', err);
      setError('Failed to load song data');
    }
  }, []);
  
  // Toggle genre selection
  const toggleGenre = useCallback((genre: string) => {
    setSelectedGenres(prev => {
      if (prev.includes(genre)) {
        return prev.filter(g => g !== genre);
      } else {
        return [...prev, genre];
      }
    });
  }, []);
  
  // Clear all genre selections
  const clearGenres = useCallback(() => {
    setSelectedGenres([]);
  }, []);
  
  // Apply smart selection to generate/update timeline
  const applySmartSelection = useCallback(() => {
    if (availableSongs.length === 0) {
      setError('No songs available. Please load songs first.');
      return;
    }
    
    const newTimeline = generateSmartPlaylist(
      availableSongs,
      selectedGenres,
      timeline || undefined
    );
    
    setTimeline(newTimeline);
    return newTimeline;
  }, [availableSongs, selectedGenres, timeline]);
  
  // Regenerate playlist from scratch
  const regeneratePlaylist = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Ensure songs are loaded
      if (availableSongs.length === 0) {
        await loadSongsFromFirestore();
      }
      
      // Generate new timeline
      const newTimeline = generateSmartPlaylist(
        availableSongs,
        selectedGenres
      );
      
      setTimeline(newTimeline);
    } catch (err) {
      console.error('Error regenerating playlist:', err);
      setError('Failed to regenerate playlist');
    } finally {
      setIsLoading(false);
    }
  }, [availableSongs, selectedGenres, loadSongsFromFirestore]);
  
  // Calculate timeline statistics
  const stats = useMemo(() => {
    if (!timeline) return null;
    return calculateTimelineStats(timeline);
  }, [timeline]);
  
  // Auto-load songs on mount if requested
  useEffect(() => {
    if (autoLoad && availableSongs.length === 0) {
      loadSongsFromFirestore();
    }
  }, [autoLoad, availableSongs.length, loadSongsFromFirestore]);
  
  // Auto-apply smart selection when genres change - removed to prevent automatic updates
  // User must explicitly click Apply Filters button
  
  return {
    // State
    selectedGenres,
    availableGenres,
    availableSongs,
    isLoading,
    error,
    timeline,
    stats,
    
    // Actions
    toggleGenre,
    clearGenres,
    regeneratePlaylist,
    loadSongsFromFirestore,
    applySmartSelection
  };
}

/**
 * Get moment-specific recommendations
 */
export function useMomentRecommendations(
  momentId: string,
  availableSongs: Song[],
  selectedGenres: string[]
): Song[] {
  return useMemo(() => {
    if (!availableSongs.length) return [];
    
    // Filter songs suitable for this moment
    const momentSongs = availableSongs.filter(song => {
      // Check if song is tagged for this moment
      if (song.moments && song.moments.includes(momentId)) {
        return true;
      }
      
      // Check if song matches selected genres
      if (selectedGenres.length > 0 && song.genres) {
        const hasMatchingGenre = song.genres.some(g => 
          selectedGenres.includes(g.toLowerCase())
        );
        if (hasMatchingGenre) return true;
      }
      
      return false;
    });
    
    // Sort by popularity and energy appropriateness
    const quota = MOMENT_SONG_QUOTAS[momentId];
    return momentSongs.slice(0, quota?.max || 10);
  }, [momentId, availableSongs, selectedGenres]);
}