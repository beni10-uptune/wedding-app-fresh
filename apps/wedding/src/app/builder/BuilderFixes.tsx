'use client';

import { useEffect, useState } from 'react';
import { getMusicDatabase } from '@/lib/music-database-service';
import { WeddingMoment } from '@/types/music-ai';

// Realistic song counts for each moment based on duration
export const MOMENT_SONG_COUNTS = {
  'getting-ready': 8,  // 30 min
  'ceremony': 5,       // 20 min
  'cocktails': 20,     // 90 min
  'dinner': 20,        // 90 min
  'first-dance': 1,    // 5 min
  'parent-dances': 3,  // 10 min
  'party': 50,         // 3 hours (180 min)
  'last-dance': 3      // 10 min
};

// Load songs from database for each moment
export async function loadMomentSongs(momentId: string, genres?: string[], country?: string): Promise<any[]> {
  const db = getMusicDatabase();
  
  // Map moment IDs to WeddingMoment enum values
  const momentMap: { [key: string]: WeddingMoment } = {
    'getting-ready': WeddingMoment.PRELUDE,
    'ceremony': WeddingMoment.PROCESSIONAL,
    'cocktails': WeddingMoment.COCKTAIL,
    'dinner': WeddingMoment.DINNER,
    'first-dance': WeddingMoment.FIRST_DANCE,
    'parent-dances': WeddingMoment.PARENT_DANCE,
    'party': WeddingMoment.PARTY_PEAK,
    'last-dance': WeddingMoment.LAST_DANCE
  };

  const weddingMoment = momentMap[momentId];
  if (!weddingMoment) {
    console.warn(`Unknown moment: ${momentId}`);
    return [];
  }

  try {
    // Get songs for this moment from the database
    const songs = await db.getSongsForMoment(
      weddingMoment,
      { 
        limit: MOMENT_SONG_COUNTS[momentId as keyof typeof MOMENT_SONG_COUNTS] || 10,
        excludeExplicit: false
      }
    );

    // Convert to the format used by the builder
    return songs.map(song => ({
      id: song.spotify_id || `${momentId}-${Math.random()}`,
      title: song.title,
      artist: song.artist,
      bpm: song.audio_features?.tempo ? Math.round(song.audio_features.tempo) : undefined,
      duration: song.duration_ms ? Math.round(song.duration_ms / 1000) : undefined,
      previewUrl: song.preview_url,
      spotifyId: song.spotify_id,
      albumArt: song.album_art_url,
      features: song.audio_features
    }));
  } catch (error) {
    console.error(`Error loading songs for ${momentId}:`, error);
    return [];
  }
}

// Hook to load initial timeline with database songs
export function useTimelineWithDatabaseSongs(selectedGenres: string[], selectedCountry: string) {
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTimeline = async () => {
      setLoading(true);
      
      const moments = [
        { id: 'getting-ready', time: '2:00 PM', duration: '30 min', title: 'Getting Ready', emoji: '💄' },
        { id: 'ceremony', time: '3:00 PM', duration: '20 min', title: 'Ceremony', emoji: '💒' },
        { id: 'cocktails', time: '3:30 PM', duration: '90 min', title: 'Cocktails', emoji: '🥂' },
        { id: 'dinner', time: '5:00 PM', duration: '90 min', title: 'Dinner', emoji: '🍽️' },
        { id: 'first-dance', time: '7:00 PM', duration: '5 min', title: 'First Dance', emoji: '💕' },
        { id: 'parent-dances', time: '7:05 PM', duration: '10 min', title: 'Parent Dances', emoji: '👨‍👩‍👧' },
        { id: 'party', time: '7:15 PM', duration: '3 hours', title: 'Party Time', emoji: '🎉' },
        { id: 'last-dance', time: '10:15 PM', duration: '10 min', title: 'Last Dance', emoji: '✨' }
      ];

      const timelineWithSongs = await Promise.all(
        moments.map(async (moment) => {
          const songs = await loadMomentSongs(
            moment.id, 
            selectedGenres.length > 0 ? selectedGenres : undefined,
            selectedCountry || undefined
          );
          
          return {
            ...moment,
            songs: songs.slice(0, MOMENT_SONG_COUNTS[moment.id as keyof typeof MOMENT_SONG_COUNTS] || 10)
          };
        })
      );

      setTimeline(timelineWithSongs);
      setLoading(false);
    };

    loadTimeline();
  }, [selectedGenres, selectedCountry]);

  return { timeline, loading };
}

// Search songs from database instead of direct Spotify
export async function searchDatabaseSongs(query: string): Promise<any[]> {
  try {
    const response = await fetch(`/api/search-songs?q=${encodeURIComponent(query)}&limit=20`);
    if (!response.ok) throw new Error('Search failed');
    
    const data = await response.json();
    return data.songs || [];
  } catch (error) {
    console.error('Error searching database:', error);
    // Fallback to Spotify search if database fails
    return searchSpotifySongs(query);
  }
}

// Fallback Spotify search
async function searchSpotifySongs(query: string): Promise<any[]> {
  try {
    const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}&limit=10`);
    if (!response.ok) throw new Error('Spotify search failed');
    
    const data = await response.json();
    return data.tracks || [];
  } catch (error) {
    console.error('Error searching Spotify:', error);
    return [];
  }
}

// Add song to database when user adds a new song
export async function addSongToDatabase(song: any): Promise<void> {
  try {
    // First enrich the song with Spotify data if we have a Spotify ID
    if (song.spotifyId) {
      const enrichResponse = await fetch(`/api/spotify/enrich/${song.spotifyId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ song })
      });
      
      if (enrichResponse.ok) {
        const enrichedSong = await enrichResponse.json();
        song = { ...song, ...enrichedSong };
      }
    }

    // Add to database
    const db = getMusicDatabase();
    await db.saveSong(song);
  } catch (error) {
    console.error('Error adding song to database:', error);
  }
}

// Check if user has access to a feature
export function useFeatureAccess(feature: string) {
  const [hasAccess, setHasAccess] = useState(false);
  const [tier, setTier] = useState<string>('free');
  
  useEffect(() => {
    const checkAccess = async () => {
      try {
        const response = await fetch('/api/check-tier-limits');
        if (response.ok) {
          const data = await response.json();
          setTier(data.tier || 'free');
          
          // Define feature access by tier
          const paidFeatures = ['share', 'partner', 'export', 'unlimited-songs', 'ai-suggestions'];
          const isPaidFeature = paidFeatures.includes(feature);
          
          setHasAccess(!isPaidFeature || data.tier !== 'free');
        }
      } catch (error) {
        console.error('Error checking feature access:', error);
        setHasAccess(false);
      }
    };
    
    checkAccess();
  }, [feature]);
  
  return { hasAccess, tier };
}