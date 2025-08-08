import { NextRequest, NextResponse } from 'next/server';
import { getMusicDatabase } from '@/lib/music-database-service';
import { getMultiAIOrchestration } from '@/lib/ai-orchestration-multi';
import { WeddingMoment, MasterSong } from '@/types/music-ai';

// Default timeline structure (using available WeddingMoment enum values)
const DEFAULT_TIMELINE_STRUCTURE = [
  { id: 'getting-ready', moment: WeddingMoment.PRELUDE, duration: 30, songCount: 7 },
  { id: 'ceremony', moment: WeddingMoment.PROCESSIONAL, duration: 20, songCount: 4 },
  { id: 'cocktails', moment: WeddingMoment.COCKTAIL, duration: 90, songCount: 25 },
  { id: 'dinner', moment: WeddingMoment.DINNER, duration: 90, songCount: 25 },
  { id: 'speeches', moment: WeddingMoment.CAKE_CUTTING, duration: 30, songCount: 8 },
  { id: 'first-dance', moment: WeddingMoment.FIRST_DANCE, duration: 5, songCount: 1 },
  { id: 'parent-dances', moment: WeddingMoment.PARENT_DANCE, duration: 10, songCount: 2 },
  { id: 'party-time', moment: WeddingMoment.PARTY_PEAK, duration: 180, songCount: 45 },
  { id: 'last-dance', moment: WeddingMoment.LAST_DANCE, duration: 5, songCount: 1 },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      region, 
      mustPlaySongs = [], 
      spotifyUrl, 
      customInstructions,
      genres = []
    } = body;

    const musicDb = getMusicDatabase();
    const aiOrchestration = getMultiAIOrchestration();
    
    // Build the timeline with real songs from database
    const timeline = [];
    
    for (const section of DEFAULT_TIMELINE_STRUCTURE) {
      // Get songs for this moment from database
      const momentSongs = await musicDb.getSongsForMoment(section.moment, {
        limit: section.songCount
      });
      
      // If we have regional preferences, prioritize regional songs
      let songs = momentSongs;
      if (region) {
        // Filter for regional preferences (this would be more sophisticated in production)
        const regionalSongs = momentSongs.filter(song => {
          if (region === 'north-england') {
            return song.artist.toLowerCase().includes('oasis') ||
                   song.artist.toLowerCase().includes('smiths') ||
                   song.title.toLowerCase().includes('wonderwall') ||
                   song.title.toLowerCase().includes('mr. brightside');
          }
          return false;
        });
        
        if (regionalSongs.length > 0) {
          // Mix regional songs with general songs
          songs = [...regionalSongs.slice(0, 3), ...momentSongs.slice(3)];
        }
      }
      
      // Handle first dance with must-play song
      if (section.id === 'first-dance' && mustPlaySongs[0]) {
        // Search for the must-play song in database
        const searchResults = await musicDb.searchSongs({}, 100);
        const filtered = searchResults.filter(song => 
          song.title.toLowerCase().includes(mustPlaySongs[0].toLowerCase()) ||
          song.artist.toLowerCase().includes(mustPlaySongs[0].toLowerCase())
        );
        if (filtered.length > 0) {
          songs = filtered.slice(0, 1);
        }
      }
      
      // Format songs for response
      const formattedSongs = songs.slice(0, Math.min(5, section.songCount)).map(song => ({
        id: song.spotify_id,
        title: song.title,
        artist: song.artist,
        album: song.album,
        previewUrl: song.preview_url,
        albumArt: song.album_art_url,
        duration: song.duration_ms,
        energy: song.audio_features?.energy,
        danceability: song.audio_features?.danceability
      }));
      
      timeline.push({
        id: section.id,
        moment: section.moment,
        duration: section.duration,
        songs: formattedSongs,
        totalSongs: section.songCount,
        moreCount: Math.max(0, section.songCount - formattedSongs.length)
      });
    }
    
    // If we have enough context, generate AI recommendations
    let aiEnhanced = false;
    if (customInstructions || spotifyUrl || genres.length > 0) {
      try {
        const aiPlaylist = await aiOrchestration.generatePlaylist({
          couple_names: [],
          wedding_vibe: region || 'classic',
          genre_preferences: genres,
          custom_instructions: customInstructions,
          must_play_songs: mustPlaySongs,
          timeline_moments: DEFAULT_TIMELINE_STRUCTURE.map(s => ({
            moment: s.moment,
            duration: s.duration
          }))
        });
        
        aiEnhanced = true;
        
        // Merge AI recommendations with timeline
        for (const section of timeline) {
          const aiMomentSongs = aiPlaylist.songs?.filter(s => 
            s.song.wedding_moments.includes(section.moment)
          ) || [];
          
          if (aiMomentSongs.length > 0) {
            // Replace some songs with AI recommendations
            const aiFormattedSongs = aiMomentSongs.slice(0, 3).map(s => ({
              id: s.song.spotify_id,
              title: s.song.title,
              artist: s.song.artist,
              album: s.song.album,
              previewUrl: s.song.preview_url,
              albumArt: s.song.album_art_url,
              aiRecommended: true,
              confidence: s.confidence_score
            }));
            
            section.songs = [...aiFormattedSongs as any, ...section.songs.slice(3)];
          }
        }
      } catch (error) {
        console.error('AI enhancement failed, using database songs only:', error);
      }
    }
    
    return NextResponse.json({
      success: true,
      timeline,
      totalSongs: timeline.reduce((sum, s) => sum + s.totalSongs, 0),
      totalDuration: timeline.reduce((sum, s) => sum + s.duration, 0),
      aiEnhanced,
      metadata: {
        source: 'database',
        songCount: 1677, // Total songs in database
        region,
        customized: mustPlaySongs.length > 0 || !!customInstructions
      }
    });
    
  } catch (error) {
    console.error('Timeline generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate timeline' },
      { status: 500 }
    );
  }
}