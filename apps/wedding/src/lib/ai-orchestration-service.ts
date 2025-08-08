/**
 * AI Orchestration Service for Uptune 3.0
 * Coordinates multiple AI models to generate intelligent wedding playlists
 */

import Anthropic from '@anthropic-ai/sdk';
import { 
  MasterSong, 
  AIGeneratedPlaylist, 
  PlaylistGenerationRequest,
  WeddingMoment,
  WeddingMood,
  SongSelection,
  AIProvider
} from '@/types/music-ai';
import { getMusicDatabase } from './music-database-service';
import { getSpotifyService } from './spotify-service';

// Initialize AI clients lazily
let anthropic: Anthropic | null = null;

function getAnthropicClient(): Anthropic {
  if (!anthropic) {
    anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || 'placeholder-key',
    });
  }
  return anthropic;
}

interface PlaylistContext {
  couple: {
    names: string[];
    story?: string;
    vibe?: string;
  };
  event: {
    date?: string;
    venue?: string;
    guestCount?: number;
    theme?: string;
  };
  preferences: {
    mustPlaySongs: string[];
    doNotPlaySongs: string[];
    genres: string[];
    eras: string[];
    customInstructions?: string;
  };
  timeline: {
    moment: WeddingMoment;
    duration: number;
    mood?: WeddingMood;
  }[];
}

export class AIOrchestrationService {
  private musicDb = getMusicDatabase();
  private spotify = getSpotifyService();
  
  /**
   * Generate a complete wedding playlist using AI orchestration
   */
  async generatePlaylist(request: PlaylistGenerationRequest): Promise<AIGeneratedPlaylist> {
    console.log('🤖 Starting AI playlist generation...');
    
    // Step 1: Build context from request
    const context = this.buildContext(request);
    
    // Step 2: Get Claude's recommendations
    const claudeRecommendations = await this.getClaudeRecommendations(context);
    
    // Step 3: Search database for matching songs
    const candidateSongs = await this.findCandidateSongs(claudeRecommendations, context);
    
    // Step 4: Score and rank songs
    const rankedSongs = await this.rankSongs(candidateSongs, context, claudeRecommendations);
    
    // Step 5: Build timeline-based playlist
    const playlist = await this.buildPlaylist(rankedSongs, context);
    
    // Step 6: Optimize flow and transitions
    const optimizedPlaylist = await this.optimizePlaylistFlow(playlist);
    
    // Step 7: Generate metadata and insights
    const metadata = await this.generatePlaylistMetadata(optimizedPlaylist, context);
    
    return {
      ...optimizedPlaylist,
      ...metadata,
      name: optimizedPlaylist.name || 'Wedding Playlist',
      description: optimizedPlaylist.description || 'AI-Generated Wedding Playlist',
      songs: optimizedPlaylist.songs || [],
      moment_breakdown: optimizedPlaylist.moment_breakdown || {},
      total_duration_ms: optimizedPlaylist.total_duration_ms || 0,
      song_count: optimizedPlaylist.song_count || 0,
      generated_by: AIProvider.CLAUDE,
      generation_timestamp: new Date(),
      request_id: this.generateRequestId()
    } as AIGeneratedPlaylist;
  }
  
  /**
   * Build context object from request
   */
  private buildContext(request: PlaylistGenerationRequest): PlaylistContext {
    return {
      couple: {
        names: request.couple_names || [],
        story: request.relationship_story,
        vibe: request.wedding_vibe
      },
      event: {
        date: request.wedding_date,
        venue: request.venue_type,
        guestCount: request.guest_count,
        theme: request.wedding_theme
      },
      preferences: {
        mustPlaySongs: request.must_play_songs || [],
        doNotPlaySongs: request.do_not_play || [],
        genres: request.genre_preferences || [],
        eras: request.era_preferences || [],
        customInstructions: request.custom_instructions
      },
      timeline: request.timeline_moments || this.getDefaultTimeline()
    };
  }
  
  /**
   * Get recommendations from Claude
   */
  private async getClaudeRecommendations(context: PlaylistContext): Promise<any> {
    const prompt = this.buildClaudePrompt(context);
    
    try {
      const response = await getAnthropicClient().messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 2000,
        temperature: 0.7,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });
      
      // Parse Claude's response
      return this.parseClaudeResponse(response.content);
    } catch (error) {
      console.error('Claude API error:', error);
      // Fallback to rule-based recommendations
      return this.getFallbackRecommendations(context);
    }
  }
  
  /**
   * Build prompt for Claude
   */
  private buildClaudePrompt(context: PlaylistContext): string {
    return `You are an expert wedding DJ and music curator. Create a perfect wedding playlist based on this context:

COUPLE INFORMATION:
- Names: ${context.couple.names.join(' & ')}
- Vibe: ${context.couple.vibe || 'Classic and elegant'}
${context.couple.story ? `- Their story: ${context.couple.story}` : ''}

EVENT DETAILS:
- Guest count: ${context.event.guestCount || 'Unknown'}
- Theme: ${context.event.theme || 'Traditional'}
${context.event.venue ? `- Venue: ${context.event.venue}` : ''}

MUSIC PREFERENCES:
- Must play: ${context.preferences.mustPlaySongs.join(', ') || 'None specified'}
- Avoid: ${context.preferences.doNotPlaySongs.join(', ') || 'None specified'}
- Preferred genres: ${context.preferences.genres.join(', ') || 'All genres'}
- Preferred eras: ${context.preferences.eras.join(', ') || 'All eras'}
${context.preferences.customInstructions ? `- Special instructions: ${context.preferences.customInstructions}` : ''}

TIMELINE NEEDED:
${context.timeline.map(t => `- ${t.moment}: ${t.duration} minutes (${t.mood || 'varied mood'})`).join('\n')}

Please provide:
1. Song recommendations for each moment (10-15 songs per moment)
2. Explain why each song fits
3. Consider flow between moments
4. Include a mix of classics and modern hits
5. Ensure appropriate energy levels

Format your response as JSON with this structure:
{
  "moments": {
    "[moment_name]": {
      "songs": [
        {
          "title": "Song Title",
          "artist": "Artist Name",
          "reason": "Why this fits",
          "energy": "low/medium/high",
          "mood": "romantic/celebratory/emotional/etc"
        }
      ],
      "transition_note": "How to transition to next moment"
    }
  },
  "overall_theme": "Description of the playlist vibe",
  "special_notes": ["Any important considerations"]
}`;
  }
  
  /**
   * Parse Claude's response
   */
  private parseClaudeResponse(content: any): any {
    try {
      // Extract JSON from Claude's response
      const jsonMatch = content[0].text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Failed to parse Claude response:', error);
    }
    
    // Return structured fallback
    return {
      moments: {},
      overall_theme: 'Classic wedding celebration',
      special_notes: []
    };
  }
  
  /**
   * Find candidate songs from database
   */
  private async findCandidateSongs(
    recommendations: any, 
    context: PlaylistContext
  ): Promise<MasterSong[]> {
    const allSongs: MasterSong[] = [];
    
    // Search for recommended songs
    for (const moment in recommendations.moments) {
      const momentRecs = recommendations.moments[moment];
      
      for (const rec of momentRecs.songs || []) {
        // Search by title and artist - get all and filter
        const dbSongs = await this.musicDb.searchSongs({}, 100);
        const results = dbSongs
          .filter(song => 
            song.title.toLowerCase().includes(rec.title.toLowerCase()) ||
            song.artist.toLowerCase().includes(rec.artist.toLowerCase())
          )
          .slice(0, 5);
        
        allSongs.push(...results);
      }
    }
    
    // Add songs for each moment type
    for (const timelineItem of context.timeline) {
      const momentSongs = await this.musicDb.getSongsForMoment(timelineItem.moment, { limit: 50 });
      allSongs.push(...momentSongs.slice(0, 50)); // Limit per moment
    }
    
    // Add must-play songs
    for (const songQuery of context.preferences.mustPlaySongs) {
      const dbSongs = await this.musicDb.searchSongs({}, 100);
      const query = songQuery.toLowerCase();
      const results = dbSongs
        .filter(song => 
          song.title.toLowerCase().includes(query) ||
          song.artist.toLowerCase().includes(query)
        )
        .slice(0, 3);
      allSongs.push(...results);
    }
    
    // Remove duplicates
    const uniqueSongs = new Map<string, MasterSong>();
    for (const song of allSongs) {
      if (!uniqueSongs.has(song.spotify_id)) {
        uniqueSongs.set(song.spotify_id, song);
      }
    }
    
    return Array.from(uniqueSongs.values());
  }
  
  /**
   * Rank songs based on context and AI recommendations
   */
  private async rankSongs(
    songs: MasterSong[], 
    context: PlaylistContext,
    recommendations: any
  ): Promise<SongSelection[]> {
    const rankedSongs: SongSelection[] = [];
    
    for (const song of songs) {
      // Calculate relevance score
      let score = song.wedding_score || 50;
      
      // Boost for AI recommendations
      const isRecommended = this.isInRecommendations(song, recommendations);
      if (isRecommended) score += 30;
      
      // Boost for must-play songs
      const isMustPlay = context.preferences.mustPlaySongs.some(
        mp => mp.toLowerCase().includes(song.title.toLowerCase()) ||
              mp.toLowerCase().includes(song.artist.toLowerCase())
      );
      if (isMustPlay) score = 100;
      
      // Penalty for explicit content (unless specified)
      if (song.explicit && !context.preferences.customInstructions?.includes('explicit ok')) {
        score -= 30;
      }
      
      // Genre matching
      if (context.preferences.genres.length > 0) {
        const genreMatch = song.wedding_genres.some(
          g => context.preferences.genres.includes(g)
        );
        if (genreMatch) score += 10;
      }
      
      // Create selection object
      rankedSongs.push({
        song,
        confidence_score: Math.min(100, score) / 100,
        selection_reason: this.getSelectionReason(song, score, context),
        ai_notes: isRecommended ? 'Claude recommended' : undefined
      });
    }
    
    // Sort by score
    return rankedSongs.sort((a, b) => b.confidence_score - a.confidence_score);
  }
  
  /**
   * Build playlist from ranked songs
   */
  private async buildPlaylist(
    rankedSongs: SongSelection[],
    context: PlaylistContext
  ): Promise<Partial<AIGeneratedPlaylist>> {
    const playlist: Partial<AIGeneratedPlaylist> = {
      name: `${context.couple.names.join(' & ')}'s Wedding`,
      description: `AI-curated wedding playlist for ${context.couple.names.join(' & ')}`,
      songs: [],
      moment_breakdown: {},
      total_duration_ms: 0,
      song_count: 0
    };
    
    // Allocate songs to moments
    for (const timelineItem of context.timeline) {
      const momentSongs: SongSelection[] = [];
      const targetDuration = timelineItem.duration * 60 * 1000; // Convert to ms
      let currentDuration = 0;
      
      // Find songs for this moment
      for (const selection of rankedSongs) {
        if (currentDuration >= targetDuration) break;
        
        if (selection.song.wedding_moments.includes(timelineItem.moment)) {
          momentSongs.push(selection);
          currentDuration += selection.song.duration_ms;
        }
      }
      
      // If not enough moment-specific songs, add high-scoring general songs
      if (currentDuration < targetDuration * 0.7) {
        for (const selection of rankedSongs) {
          if (currentDuration >= targetDuration) break;
          
          if (!momentSongs.find(ms => ms.song.spotify_id === selection.song.spotify_id) &&
              selection.confidence_score > 0.6) {
            momentSongs.push(selection);
            currentDuration += selection.song.duration_ms;
          }
        }
      }
      
      // Add to playlist
      playlist.songs!.push(...momentSongs);
      playlist.moment_breakdown![timelineItem.moment] = {
        songs: momentSongs.map(s => s.song.spotify_id),
        duration_ms: currentDuration,
        song_count: momentSongs.length
      };
    }
    
    // Remove duplicates and calculate totals
    const uniqueSongMap = new Map<string, SongSelection>();
    for (const selection of playlist.songs!) {
      uniqueSongMap.set(selection.song.spotify_id, selection);
    }
    
    playlist.songs = Array.from(uniqueSongMap.values());
    playlist.song_count = playlist.songs.length;
    playlist.total_duration_ms = playlist.songs.reduce(
      (sum, s) => sum + s.song.duration_ms, 
      0
    );
    
    return playlist;
  }
  
  /**
   * Optimize playlist flow and transitions
   */
  private async optimizePlaylistFlow(
    playlist: Partial<AIGeneratedPlaylist>
  ): Promise<Partial<AIGeneratedPlaylist>> {
    // This would ideally use audio features for harmonic mixing
    // For now, we'll organize by energy levels
    
    const optimized = { ...playlist };
    
    // Group songs by moment and sort by energy within each moment
    for (const moment in optimized.moment_breakdown) {
      const momentSongIds = optimized.moment_breakdown[moment].songs;
      const momentSongs = optimized.songs!.filter(
        s => momentSongIds.includes(s.song.spotify_id)
      );
      
      // Sort by wedding score and energy (if available)
      momentSongs.sort((a, b) => {
        // Start with lower energy, build up
        if (moment === WeddingMoment.DINNER || moment === WeddingMoment.COCKTAIL) {
          return a.song.wedding_score - b.song.wedding_score;
        }
        // Party moments: high energy
        if (moment === WeddingMoment.PARTY_PEAK) {
          return b.song.wedding_score - a.song.wedding_score;
        }
        // Default: balanced
        return b.confidence_score - a.confidence_score;
      });
    }
    
    return optimized;
  }
  
  /**
   * Generate playlist metadata and insights
   */
  private async generatePlaylistMetadata(
    playlist: Partial<AIGeneratedPlaylist>,
    context: PlaylistContext
  ): Promise<Partial<AIGeneratedPlaylist>> {
    const genres = new Set<string>();
    const moods = new Set<WeddingMood>();
    const decades = new Set<string>();
    
    for (const selection of playlist.songs || []) {
      selection.song.wedding_genres.forEach(g => genres.add(g));
      selection.song.wedding_moods.forEach(m => moods.add(m));
      
      // Extract decade from release date
      if (selection.song.release_date) {
        const year = parseInt(selection.song.release_date.substring(0, 4));
        const decade = `${Math.floor(year / 10) * 10}s`;
        decades.add(decade);
      }
    }
    
    return {
      ...playlist,
      genre_distribution: this.calculateDistribution(Array.from(genres), playlist.songs!),
      mood_progression: Array.from(moods),
      energy_curve: this.calculateEnergyCurve(playlist.songs!),
      ai_insights: {
        strengths: [
          `Includes ${playlist.song_count} carefully selected songs`,
          `Covers ${context.timeline.length} key wedding moments`,
          `Features music from ${decades.size} different decades`,
          `Balances ${genres.size} musical genres`
        ],
        suggestions: [
          'Consider guest demographics when finalizing',
          'Test key transitions during rehearsal',
          'Have backup options for special dances'
        ],
        confidence: 0.85
      }
    };
  }
  
  /**
   * Helper: Check if song is in AI recommendations
   */
  private isInRecommendations(song: MasterSong, recommendations: any): boolean {
    for (const moment in recommendations.moments) {
      const songs = recommendations.moments[moment].songs || [];
      const found = songs.some((rec: any) => 
        rec.title?.toLowerCase().includes(song.title.toLowerCase()) ||
        song.title.toLowerCase().includes(rec.title?.toLowerCase())
      );
      if (found) return true;
    }
    return false;
  }
  
  /**
   * Helper: Get selection reason
   */
  private getSelectionReason(
    song: MasterSong, 
    score: number, 
    context: PlaylistContext
  ): string {
    const reasons = [];
    
    if (score >= 90) reasons.push('Perfect wedding fit');
    if (song.wedding_moments.length > 2) reasons.push('Versatile across moments');
    if (song.popularity > 70) reasons.push('Crowd favorite');
    if (song.wedding_moods.includes(WeddingMood.ROMANTIC)) reasons.push('Romantic atmosphere');
    if (song.wedding_moods.includes(WeddingMood.CELEBRATORY)) reasons.push('Celebratory energy');
    
    return reasons.join(', ') || 'Good wedding song';
  }
  
  /**
   * Helper: Calculate genre distribution
   */
  private calculateDistribution(
    genres: string[], 
    songs: SongSelection[]
  ): Record<string, number> {
    const distribution: Record<string, number> = {};
    
    for (const genre of genres) {
      const count = songs.filter(s => 
        s.song.wedding_genres.includes(genre)
      ).length;
      distribution[genre] = count;
    }
    
    return distribution;
  }
  
  /**
   * Helper: Calculate energy curve
   */
  private calculateEnergyCurve(songs: SongSelection[]): number[] {
    // Simplified energy calculation based on position and score
    return songs.map((s, index) => {
      const position = index / songs.length;
      const baseEnergy = s.song.wedding_score / 100;
      
      // Adjust based on typical wedding flow
      if (position < 0.2) return baseEnergy * 0.6; // Start gentle
      if (position < 0.4) return baseEnergy * 0.8; // Build up
      if (position < 0.7) return baseEnergy; // Peak party
      if (position < 0.9) return baseEnergy * 0.9; // Maintain energy
      return baseEnergy * 0.7; // Wind down
    });
  }
  
  /**
   * Helper: Get default timeline
   */
  private getDefaultTimeline() {
    return [
      { moment: WeddingMoment.PROCESSIONAL, duration: 10, mood: WeddingMood.ELEGANT },
      { moment: WeddingMoment.COCKTAIL, duration: 60, mood: WeddingMood.SOPHISTICATED },
      { moment: WeddingMoment.DINNER, duration: 90, mood: WeddingMood.ELEGANT },
      { moment: WeddingMoment.FIRST_DANCE, duration: 5, mood: WeddingMood.ROMANTIC },
      { moment: WeddingMoment.PARTY_WARMUP, duration: 30, mood: WeddingMood.FUN },
      { moment: WeddingMoment.PARTY_PEAK, duration: 120, mood: WeddingMood.ENERGETIC },
      { moment: WeddingMoment.LAST_DANCE, duration: 5, mood: WeddingMood.EMOTIONAL }
    ];
  }
  
  /**
   * Helper: Get fallback recommendations
   */
  private getFallbackRecommendations(context: PlaylistContext) {
    // Rule-based fallback when AI is unavailable
    return {
      moments: {
        [WeddingMoment.FIRST_DANCE]: {
          songs: [
            { title: "Perfect", artist: "Ed Sheeran", reason: "Modern classic", energy: "low", mood: "romantic" },
            { title: "Thinking Out Loud", artist: "Ed Sheeran", reason: "Popular choice", energy: "low", mood: "romantic" },
            { title: "All of Me", artist: "John Legend", reason: "Emotional favorite", energy: "low", mood: "romantic" }
          ]
        },
        [WeddingMoment.PARTY_PEAK]: {
          songs: [
            { title: "Uptown Funk", artist: "Mark Ronson", reason: "Guaranteed dance floor filler", energy: "high", mood: "party" },
            { title: "Shut Up and Dance", artist: "Walk the Moon", reason: "Modern party anthem", energy: "high", mood: "party" },
            { title: "I Wanna Dance with Somebody", artist: "Whitney Houston", reason: "Classic party song", energy: "high", mood: "party" }
          ]
        }
      },
      overall_theme: "Classic wedding celebration with modern touches",
      special_notes: ["Using popular wedding songs as fallback"]
    };
  }
  
  /**
   * Helper: Generate request ID
   */
  private generateRequestId(): string {
    return `playlist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Singleton instance
let orchestrationInstance: AIOrchestrationService | null = null;

export function getAIOrchestration(): AIOrchestrationService {
  if (!orchestrationInstance) {
    orchestrationInstance = new AIOrchestrationService();
  }
  return orchestrationInstance;
}