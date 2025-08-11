/**
 * API Route: Generate AI-powered wedding playlist
 * POST /api/generate-playlist
 */

import { NextRequest, NextResponse } from 'next/server';
// Import both single and multi-model orchestration
import { getAIOrchestration } from '@/lib/ai-orchestration-service';
import { getMultiAIOrchestration } from '@/lib/ai-orchestration-multi';
import { getMusicDatabase } from '@/lib/music-database-service';
import { 
  PlaylistGenerationRequest, 
  WeddingMoment,
  WeddingMood 
} from '@/types/music-ai';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Extract auth token (optional for now, but recommended for production)
    const authHeader = request.headers.get('authorization');
    let userId: string | null = null;
    
    if (authHeader?.startsWith('Bearer ') && adminAuth) {
      const token = authHeader.substring(7);
      try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        userId = decodedToken.uid;
      } catch (error) {
        // Auth verification failed, continuing as anonymous
      }
    }
    
    // For preview mode, return quick response without full AI generation
    if (body.preview) {
      const fallbackPlaylist = await getFallbackPlaylist();
      return NextResponse.json({
        success: true,
        playlist: {
          ...fallbackPlaylist,
          name: `${body.vibe || 'Wedding'} Playlist`,
          songCount: 150,
          duration: 360,
          previewSongs: fallbackPlaylist.timeline?.slice(0, 3).flatMap((m: any) => 
            m.songs.slice(0, 2).map((s: any) => ({
              ...s,
              moment: m.title
            }))
          )
        },
        metadata: {
          generatedBy: 'preview',
          generatedAt: new Date().toISOString()
        }
      });
    }
    
    // Build generation request
    const generationRequest: PlaylistGenerationRequest = {
      // Couple info
      couple_names: body.coupleNames || ['Partner 1', 'Partner 2'],
      wedding_date: body.weddingDate,
      wedding_vibe: body.vibe || 'romantic and fun',
      
      // Preferences
      must_play_songs: body.mustPlaySongs || [],
      do_not_play: body.doNotPlay || [],
      genre_preferences: body.genres || [],
      era_preferences: body.eras || [],
      
      // Event details
      guest_count: body.guestCount,
      venue_type: body.venueType,
      wedding_theme: body.theme,
      cultural_backgrounds: body.cultures || [],
      
      // Timeline
      timeline_moments: body.timeline || getDefaultTimeline(),
      
      // Custom
      custom_instructions: body.customInstructions,
      relationship_story: body.story,
      
      // Metadata
      user_id: userId || undefined,
      wedding_id: body.weddingId,
      request_source: 'web-v3'
    };
    
    // Use multi-model orchestration if available, otherwise fallback to single
    const useMultiModel = process.env.OPENAI_API_KEY || process.env.GOOGLE_AI_API_KEY;
    const orchestration = useMultiModel ? getMultiAIOrchestration() : getAIOrchestration();
    
    // Using multi-model or single-model AI orchestration based on API keys
    
    // Set a timeout for the generation
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Generation timeout')), 25000)
    );
    
    let playlist;
    try {
      playlist = await Promise.race([
        orchestration.generatePlaylist(generationRequest),
        timeoutPromise
      ]) as any;
    } catch (timeoutError) {
      // Return fallback on timeout
      const fallback = await getFallbackPlaylist();
      return NextResponse.json({
        success: true,
        playlist: fallback,
        metadata: {
          generatedBy: 'fallback',
          generatedAt: new Date().toISOString(),
          note: 'Used fallback due to timeout'
        }
      });
    }
    
    // Return simplified response for frontend
    const response = {
      success: true,
      playlist: {
        id: playlist.playlist_id,
        name: playlist.name,
        description: playlist.description,
        songCount: playlist.song_count,
        duration: Math.round(playlist.total_duration_ms / 60000), // Convert to minutes
        songs: playlist.songs.map((selection: any) => ({
          id: selection.song.spotify_id,
          title: selection.song.title,
          artist: selection.song.artist,
          album: selection.song.album,
          duration: selection.song.duration_ms,
          previewUrl: selection.song.preview_url,
          albumArt: selection.song.album_art_url,
          spotifyUrl: selection.song.external_urls?.spotify,
          moment: selection.song.wedding_moments[0],
          mood: selection.song.wedding_moods[0],
          confidence: selection.confidence_score,
          reason: selection.selection_reason
        })),
        moments: playlist.moment_breakdown,
        insights: playlist.ai_insights,
        genres: playlist.genre_distribution,
        moods: playlist.mood_progression,
        energyCurve: playlist.energy_curve,
        timeline: formatTimeline(playlist),
        previewSongs: playlist.songs.slice(0, 5).map((selection: any) => ({
          id: selection.song.spotify_id,
          title: selection.song.title,
          artist: selection.song.artist,
          previewUrl: selection.song.preview_url
        }))
      },
      metadata: {
        generatedAt: playlist.generation_timestamp,
        generatedBy: playlist.generated_by,
        requestId: playlist.request_id,
        confidence: playlist.ai_confidence
      }
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Playlist generation error:', error);
    
    // Return graceful error with fallback suggestions
    return NextResponse.json({
      success: false,
      error: 'Failed to generate playlist',
      fallback: await getFallbackPlaylist(),
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    message: 'AI Playlist Generation API',
    usage: 'POST /api/generate-playlist with wedding details',
    requiredFields: {
      vibe: 'string (romantic, party, modern, rustic)',
      preview: 'boolean (true for quick preview)'
    },
    optionalFields: {
      coupleNames: ['string', 'string'],
      mustPlaySongs: ['array of song names'],
      genres: ['array of genre preferences'],
      guestCount: 'number',
      customInstructions: 'string',
      timeline: 'array of moment objects'
    }
  });
}

// Helper: Get default timeline
function getDefaultTimeline() {
  return [
    { moment: WeddingMoment.COCKTAIL, duration: 60, mood: WeddingMood.SOPHISTICATED },
    { moment: WeddingMoment.DINNER, duration: 90, mood: WeddingMood.ELEGANT },
    { moment: WeddingMoment.FIRST_DANCE, duration: 5, mood: WeddingMood.ROMANTIC },
    { moment: WeddingMoment.PARTY_WARMUP, duration: 30, mood: WeddingMood.FUN },
    { moment: WeddingMoment.PARTY_PEAK, duration: 120, mood: WeddingMood.ENERGETIC },
    { moment: WeddingMoment.LAST_DANCE, duration: 5, mood: WeddingMood.EMOTIONAL }
  ];
}

// Helper: Format timeline for frontend
function formatTimeline(playlist: any) {
  const moments = [
    { id: 'cocktail', time: '5:00 PM', duration: '60 min', title: 'Cocktail Hour', emoji: '🥂' },
    { id: 'dinner', time: '6:00 PM', duration: '90 min', title: 'Dinner', emoji: '🍽️' },
    { id: 'firstdance', time: '7:30 PM', duration: '5 min', title: 'First Dance', emoji: '💕' },
    { id: 'party', time: '8:00 PM', duration: '150 min', title: 'Party Time', emoji: '🎉' }
  ];
  
  return moments.map(moment => {
    const songs = playlist.songs
      .filter((s: any) => s.song.wedding_moments.includes(moment.id.toUpperCase()))
      .slice(0, 5);
    
    return {
      ...moment,
      description: `${songs.length} songs selected`,
      songs: songs.map((s: any) => ({
        id: s.song.spotify_id,
        title: s.song.title,
        artist: s.song.artist,
        bpm: s.song.audio_features?.tempo
      })),
      insight: getInsightForMoment(moment.id),
      bpmRange: getBpmRangeForMoment(moment.id)
    };
  });
}

// Helper: Get insight for moment
function getInsightForMoment(momentId: string): string {
  const insights: Record<string, string> = {
    cocktail: 'We start at 110 BPM with jazz and soul to create sophisticated ambiance. Notice how we alternate modern hits with classics every 3 songs to engage all generations.',
    dinner: 'During dinner, we keep the energy low but positive, allowing conversation while maintaining the celebratory atmosphere.',
    firstdance: 'This is your special moment. The song should reflect your relationship and set the romantic tone for the evening.',
    party: 'Party section gradually builds from 118 to 128 BPM, with strategic throwbacks every 4th song to keep all ages dancing.'
  };
  
  return insights[momentId] || '';
}

// Helper: Get BPM range for moment
function getBpmRangeForMoment(momentId: string): string {
  const ranges: Record<string, string> = {
    cocktail: '110-120 BPM',
    dinner: '95-110 BPM',
    firstdance: '60-80 BPM',
    party: '118-128 BPM'
  };
  
  return ranges[momentId] || '';
}

// Helper: Get fallback playlist when AI fails
async function getFallbackPlaylist() {
  const musicDb = getMusicDatabase();
  
  // Get top-rated songs for each moment
  const moments = [
    WeddingMoment.FIRST_DANCE,
    WeddingMoment.PARTY_PEAK,
    WeddingMoment.DINNER,
    WeddingMoment.LAST_DANCE
  ];
  
  const songs = [];
  
  for (const moment of moments) {
    const momentSongs = await musicDb.getSongsForMoment(moment, { limit: 5 });
    songs.push(...momentSongs.map(song => ({
      id: song.spotify_id,
      title: song.title,
      artist: song.artist,
      album: song.album,
      duration: song.duration_ms,
      previewUrl: song.preview_url,
      albumArt: song.album_art_url,
      spotifyUrl: song.external_urls?.spotify,
      moment: moment,
      mood: song.wedding_moods[0],
      confidence: 0.7,
      reason: 'Popular wedding choice'
    })));
  }
  
  const timeline = [
    {
      id: 'cocktail',
      time: '5:00 PM',
      duration: '60 min',
      title: 'Cocktail Hour',
      emoji: '🥂',
      description: 'Sophisticated mingling music',
      bpmRange: '110-120 BPM',
      insight: 'We start at 110 BPM with jazz and soul to create sophisticated ambiance.',
      songs: songs.filter(s => s.moment === WeddingMoment.COCKTAIL || s.moment === WeddingMoment.DINNER).slice(0, 3)
    },
    {
      id: 'dinner',
      time: '6:00 PM',
      duration: '90 min',
      title: 'Dinner',
      emoji: '🍽️',
      description: 'Background music for conversation',
      bpmRange: '95-110 BPM',
      insight: 'During dinner, we keep the energy low but positive.',
      songs: songs.filter(s => s.moment === WeddingMoment.DINNER).slice(0, 3)
    },
    {
      id: 'firstdance',
      time: '7:30 PM',
      duration: '5 min',
      title: 'First Dance',
      emoji: '💕',
      description: 'Your special moment',
      songs: songs.filter(s => s.moment === WeddingMoment.FIRST_DANCE).slice(0, 1)
    },
    {
      id: 'party',
      time: '8:00 PM',
      duration: '150 min',
      title: 'Party Time',
      emoji: '🎉',
      description: 'Dance floor hits',
      bpmRange: '118-128 BPM',
      insight: 'Party section gradually builds from 118 to 128 BPM.',
      songs: songs.filter(s => s.moment === WeddingMoment.PARTY_PEAK).slice(0, 4)
    }
  ];
  
  return {
    name: 'Classic Wedding Playlist',
    description: 'A curated selection of wedding favorites',
    songCount: songs.length,
    duration: songs.reduce((sum, s) => sum + (s.duration || 180000), 0) / 60000,
    songs,
    timeline,
    insights: {
      strengths: ['Classic crowd-pleasers', 'Tested wedding songs'],
      suggestions: ['Customize based on your preferences'],
      confidence: 0.6
    }
  };
}