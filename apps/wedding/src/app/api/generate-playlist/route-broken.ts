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
        console.log('Auth verification failed, continuing as anonymous:', error);
      }
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
    
    // For preview mode, use a simpler, faster generation
    if (body.preview) {
      // Return a quick preview without full AI generation
      const fallbackPlaylist = await getFallbackPlaylist();
      return NextResponse.json({
        success: true,
        playlist: {
          ...fallbackPlaylist,
          name: `${body.vibe || 'Wedding'} Playlist`,
          songCount: 150,
          duration: 360
        },
        metadata: {
          generatedBy: 'preview',
          generatedAt: new Date().toISOString()
        }
      });
    }
    
    } catch (timeoutError) {
      console.error('Playlist generation timed out:', timeoutError);
      // Return fallback on timeout
      return NextResponse.json({
        success: true,
        playlist: await getFallbackPlaylist(),
        metadata: {
          generatedBy: 'fallback',
          generatedAt: new Date().toISOString(),
          note: 'Used fallback due to timeout'
        }
      });
    }
    // Use multi-model orchestration if available, otherwise fallback to single
    const useMultiModel = process.env.OPENAI_API_KEY || process.env.GOOGLE_AI_API_KEY;
    const orchestration = useMultiModel ? getMultiAIOrchestration() : getAIOrchestration();
    
    console.log(`Using ${useMultiModel ? 'multi-model' : 'single-model'} AI orchestration`);
    
    // Set a timeout for the generation
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Generation timeout')), 25000)
    );
    
      const playlist = await Promise.race([
        orchestration.generatePlaylist(generationRequest),
        timeoutPromise
      ]) as any;
    
      // Save playlist to database if user is authenticated
    // TODO: Implement saveGeneratedPlaylist method in MusicDatabaseService
    // if (userId && playlist) {
    //   const musicDb = getMusicDatabase();
    //   await musicDb.saveGeneratedPlaylist({
    //     ...playlist,
    //     user_id: userId,
    //     is_public: false
    //   });
    // }
    
    // Return simplified response for frontend
    const response = {
      success: true,
      playlist: {
        id: playlist.playlist_id,
        name: playlist.name,
        description: playlist.description,
        songCount: playlist.song_count,
        duration: Math.round(playlist.total_duration_ms / 60000), // Convert to minutes
        songs: playlist.songs.map(selection => ({
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
        energyCurve: playlist.energy_curve
      },
      metadata: {
        generatedAt: playlist.generation_timestamp,
        generatedBy: playlist.generated_by,
        requestId: playlist.request_id
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
      coupleNames: ['string', 'string'],
      vibe: 'string (romantic, party, elegant, etc.)'
    },
    optionalFields: {
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
  
  return {
    name: 'Classic Wedding Playlist',
    description: 'A curated selection of wedding favorites',
    songCount: songs.length,
    duration: songs.reduce((sum, s) => sum + s.duration, 0) / 60000,
    songs,
    insights: {
      strengths: ['Classic crowd-pleasers', 'Tested wedding songs'],
      suggestions: ['Customize based on your preferences'],
      confidence: 0.6
    }
  };
}