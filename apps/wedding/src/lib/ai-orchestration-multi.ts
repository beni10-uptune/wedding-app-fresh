/**
 * Multi-Model AI Orchestration Service for Uptune 3.0
 * Intelligently routes between Claude, GPT-4, and Gemini for optimal results
 */

import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
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

// Initialize AI clients lazily
let anthropic: Anthropic | null = null;
let openai: OpenAI | null = null;
let gemini: GoogleGenerativeAI | null = null;

function getAnthropicClient(): Anthropic | null {
  if (!anthropic && process.env.ANTHROPIC_API_KEY) {
    anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return anthropic;
}

function getOpenAIClient(): OpenAI | null {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

function getGeminiClient(): GoogleGenerativeAI | null {
  if (!gemini && process.env.GOOGLE_AI_API_KEY) {
    gemini = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
  }
  return gemini;
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

interface AIResponse {
  provider: AIProvider;
  moments: Record<string, any>;
  overall_theme: string;
  special_notes: string[];
  confidence: number;
}

export class MultiModelAIOrchestrationService {
  private musicDb = getMusicDatabase();
  
  /**
   * Generate a playlist using the best available AI model
   */
  async generatePlaylist(request: PlaylistGenerationRequest): Promise<AIGeneratedPlaylist> {
    console.log('🤖 Starting multi-model AI playlist generation...');
    
    const context = this.buildContext(request);
    
    // Try AI models in order of preference
    let aiResponse: AIResponse | null = null;
    
    // Try GPT-5 first (most advanced model)
    aiResponse = await this.tryGPTGeneration(context);
    
    // Fallback to Claude if GPT-5 fails (excellent for creative tasks)
    if (!aiResponse || aiResponse.confidence < 0.8) {
      console.log('Falling back to Claude...');
      const claudeResponse = await this.tryClaudeGeneration(context);
      if (claudeResponse && (!aiResponse || claudeResponse.confidence > aiResponse.confidence)) {
        aiResponse = claudeResponse;
      }
    }
    
    // Fallback to Gemini if both fail
    if (!aiResponse || aiResponse.confidence < 0.5) {
      console.log('Falling back to Gemini...');
      const geminiResponse = await this.tryGeminiGeneration(context);
      if (geminiResponse && (!aiResponse || geminiResponse.confidence > aiResponse.confidence)) {
        aiResponse = geminiResponse;
      }
    }
    
    // Ultimate fallback to rule-based system
    if (!aiResponse) {
      console.log('All AI models failed, using rule-based fallback...');
      aiResponse = this.getRuleBasedRecommendations(context);
    }
    
    // Search database for matching songs
    const candidateSongs = await this.findCandidateSongs(aiResponse, context);
    
    // Score and rank songs using ensemble scoring
    const rankedSongs = await this.ensembleRankSongs(candidateSongs, context, aiResponse);
    
    // Build timeline-based playlist
    const playlist = await this.buildPlaylist(rankedSongs, context);
    
    // Optimize flow and transitions
    const optimizedPlaylist = await this.optimizePlaylistFlow(playlist);
    
    // Generate metadata and insights
    const metadata = await this.generatePlaylistMetadata(optimizedPlaylist, context, aiResponse);
    
    return {
      ...optimizedPlaylist,
      ...metadata,
      name: optimizedPlaylist.name || 'Wedding Playlist',
      description: optimizedPlaylist.description || 'AI-Generated Wedding Playlist',
      songs: optimizedPlaylist.songs || [],
      moment_breakdown: optimizedPlaylist.moment_breakdown || {},
      total_duration_ms: optimizedPlaylist.total_duration_ms || 0,
      song_count: optimizedPlaylist.song_count || 0,
      generated_by: aiResponse.provider,
      generation_timestamp: new Date(),
      request_id: this.generateRequestId(),
      ai_confidence: aiResponse.confidence
    } as AIGeneratedPlaylist;
  }
  
  /**
   * Try generating with Claude (Anthropic)
   */
  private async tryClaudeGeneration(context: PlaylistContext): Promise<AIResponse | null> {
    const client = getAnthropicClient();
    if (!client) return null;
    
    try {
      const prompt = this.buildUniversalPrompt(context, 'claude');
      
      const response = await client.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 2000,
        temperature: 0.7,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });
      
      const parsed = this.parseAIResponse(response.content, 'claude');
      return {
        ...parsed,
        provider: AIProvider.CLAUDE,
        confidence: 0.9 // Claude typically gives best results for creative tasks
      };
    } catch (error) {
      console.error('Claude generation failed:', error);
      return null;
    }
  }
  
  /**
   * Try generating with GPT-5 (OpenAI)
   */
  private async tryGPTGeneration(context: PlaylistContext): Promise<AIResponse | null> {
    const client = getOpenAIClient();
    if (!client) return null;
    
    try {
      const prompt = this.buildUniversalPrompt(context, 'gpt');
      
      const response = await client.chat.completions.create({
        model: 'gpt-5', // Using the latest GPT-5 model
        messages: [{
          role: 'system',
          content: 'You are an expert wedding DJ and music curator with deep knowledge of all music genres and wedding traditions. Use your advanced reasoning capabilities to create the perfect wedding playlist.'
        }, {
          role: 'user',
          content: prompt
        }],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: 'json_object' }
      });
      
      const content = response.choices[0]?.message?.content;
      if (!content) return null;
      
      const parsed = JSON.parse(content);
      return {
        ...parsed,
        provider: AIProvider.GPT5,
        confidence: 0.95 // GPT-5 has even better performance than GPT-4
      };
    } catch (error) {
      console.error('GPT-5 generation failed:', error);
      // Fallback to GPT-4 if GPT-5 fails
      try {
        const response = await client.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [{
            role: 'system',
            content: 'You are an expert wedding DJ and music curator with deep knowledge of all music genres and wedding traditions.'
          }, {
            role: 'user',
            content: prompt
          }],
          temperature: 0.7,
          max_tokens: 2000,
          response_format: { type: 'json_object' }
        });
        
        const content = response.choices[0]?.message?.content;
        if (!content) return null;
        
        const parsed = JSON.parse(content);
        return {
          ...parsed,
          provider: AIProvider.GPT,
          confidence: 0.85
        };
      } catch (fallbackError) {
        console.error('GPT-4 fallback also failed:', fallbackError);
        return null;
      }
    }
  }
  
  /**
   * Try generating with Gemini (Google)
   */
  private async tryGeminiGeneration(context: PlaylistContext): Promise<AIResponse | null> {
    const client = getGeminiClient();
    if (!client) return null;
    
    try {
      const model = client.getGenerativeModel({ model: 'gemini-pro' });
      const prompt = this.buildUniversalPrompt(context, 'gemini');
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const parsed = this.parseAIResponse(text, 'gemini');
      return {
        ...parsed,
        provider: AIProvider.GEMINI,
        confidence: 0.8
      };
    } catch (error) {
      console.error('Gemini generation failed:', error);
      return null;
    }
  }
  
  /**
   * Build a universal prompt that works across all AI models
   */
  private buildUniversalPrompt(context: PlaylistContext, model: 'claude' | 'gpt' | 'gemini'): string {
    const base = `Create a perfect wedding playlist based on this context:

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
5. Ensure appropriate energy levels`;

    if (model === 'gpt') {
      return base + '\n\nRespond with valid JSON only.';
    }
    
    return base + `

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
   * Parse AI response based on model type
   */
  private parseAIResponse(content: any, model: string): any {
    try {
      if (model === 'claude') {
        // Claude returns content in a specific format
        const text = typeof content === 'string' ? content : content[0]?.text || '';
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } else if (model === 'gemini') {
        // Gemini returns plain text
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      }
    } catch (error) {
      console.error(`Failed to parse ${model} response:`, error);
    }
    
    return {
      moments: {},
      overall_theme: 'Classic wedding celebration',
      special_notes: []
    };
  }
  
  /**
   * Ensemble ranking using multiple scoring methods
   */
  private async ensembleRankSongs(
    songs: MasterSong[], 
    context: PlaylistContext,
    aiResponse: AIResponse
  ): Promise<SongSelection[]> {
    const rankedSongs: SongSelection[] = [];
    
    for (const song of songs) {
      // Base score from database
      let score = song.wedding_score || 50;
      
      // AI recommendation boost (weighted by AI confidence)
      const isRecommended = this.isInRecommendations(song, aiResponse);
      if (isRecommended) {
        score += 30 * aiResponse.confidence;
      }
      
      // Must-play songs get maximum score
      const isMustPlay = context.preferences.mustPlaySongs.some(
        mp => mp.toLowerCase().includes(song.title.toLowerCase()) ||
              mp.toLowerCase().includes(song.artist.toLowerCase())
      );
      if (isMustPlay) score = 100;
      
      // Explicit content penalty (unless allowed)
      if (song.explicit && !context.preferences.customInstructions?.includes('explicit ok')) {
        score -= 30;
      }
      
      // Genre matching bonus
      if (context.preferences.genres.length > 0) {
        const genreMatch = song.wedding_genres.some(
          g => context.preferences.genres.includes(g)
        );
        if (genreMatch) score += 15;
      }
      
      // Popularity bonus (but not too much)
      score += (song.popularity / 100) * 10;
      
      // Audio feature matching for mood
      if (song.audio_features) {
        const moodScore = this.calculateMoodMatch(song.audio_features, context);
        score += moodScore * 20;
      }
      
      rankedSongs.push({
        song,
        confidence_score: Math.min(100, Math.max(0, score)) / 100,
        selection_reason: this.getSelectionReason(song, score, context, aiResponse),
        ai_notes: isRecommended ? `Recommended by ${aiResponse.provider}` : undefined
      });
    }
    
    return rankedSongs.sort((a, b) => b.confidence_score - a.confidence_score);
  }
  
  /**
   * Calculate mood match based on audio features
   */
  private calculateMoodMatch(features: any, context: PlaylistContext): number {
    let score = 0;
    const vibe = context.couple.vibe?.toLowerCase() || '';
    
    if (vibe.includes('romantic') || vibe.includes('elegant')) {
      // Lower energy, higher valence for romantic/elegant
      score += (1 - features.energy) * 0.5;
      score += features.valence * 0.5;
    } else if (vibe.includes('party') || vibe.includes('fun')) {
      // Higher energy and danceability for party
      score += features.energy * 0.4;
      score += features.danceability * 0.6;
    } else if (vibe.includes('classic') || vibe.includes('traditional')) {
      // Balanced features for classic
      score += Math.abs(0.5 - features.energy) * -1 + 1; // Prefer medium energy
      score += features.acousticness * 0.3;
    }
    
    return Math.max(0, Math.min(1, score));
  }
  
  /**
   * Get detailed selection reason
   */
  private getSelectionReason(
    song: MasterSong, 
    score: number, 
    context: PlaylistContext,
    aiResponse: AIResponse
  ): string {
    const reasons = [];
    
    if (score >= 90) reasons.push('Perfect wedding fit');
    if (aiResponse.provider) reasons.push(`${aiResponse.provider} recommended`);
    if (song.wedding_moments.length > 2) reasons.push('Versatile across moments');
    if (song.popularity > 70) reasons.push('Crowd favorite');
    if (song.wedding_moods.includes(WeddingMood.ROMANTIC)) reasons.push('Romantic atmosphere');
    if (song.wedding_moods.includes(WeddingMood.CELEBRATORY)) reasons.push('Celebratory energy');
    if (song.audio_features?.danceability > 0.7) reasons.push('Great for dancing');
    
    return reasons.join(', ') || 'Good wedding song';
  }
  
  /**
   * Rule-based fallback when all AI fails
   */
  private getRuleBasedRecommendations(context: PlaylistContext): AIResponse {
    return {
      provider: AIProvider.CLAUDE, // Default fallback
      moments: {
        [WeddingMoment.FIRST_DANCE]: {
          songs: [
            { title: "Perfect", artist: "Ed Sheeran", reason: "Modern classic", energy: "low", mood: "romantic" },
            { title: "All of Me", artist: "John Legend", reason: "Emotional favorite", energy: "low", mood: "romantic" },
            { title: "At Last", artist: "Etta James", reason: "Timeless romance", energy: "low", mood: "romantic" }
          ]
        },
        [WeddingMoment.PARTY_PEAK]: {
          songs: [
            { title: "Uptown Funk", artist: "Mark Ronson", reason: "Dance floor filler", energy: "high", mood: "party" },
            { title: "I Wanna Dance with Somebody", artist: "Whitney Houston", reason: "Classic party", energy: "high", mood: "party" },
            { title: "Shut Up and Dance", artist: "Walk the Moon", reason: "Modern anthem", energy: "high", mood: "party" }
          ]
        }
      },
      overall_theme: "Classic wedding celebration with modern touches",
      special_notes: ["Using curated fallback playlist"],
      confidence: 0.5
    };
  }
  
  // Reuse helper methods from original service
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
  
  private async findCandidateSongs(
    aiResponse: AIResponse, 
    context: PlaylistContext
  ): Promise<MasterSong[]> {
    const allSongs: MasterSong[] = [];
    
    // Search for AI recommended songs
    for (const moment in aiResponse.moments) {
      const momentRecs = aiResponse.moments[moment];
      
      for (const rec of momentRecs.songs || []) {
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
      allSongs.push(...momentSongs);
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
      const targetDuration = timelineItem.duration * 60 * 1000;
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
      
      playlist.songs!.push(...momentSongs);
      playlist.moment_breakdown![timelineItem.moment] = {
        songs: momentSongs.map(s => s.song.spotify_id),
        duration_ms: currentDuration,
        song_count: momentSongs.length
      };
    }
    
    // Remove duplicates
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
  
  private async optimizePlaylistFlow(
    playlist: Partial<AIGeneratedPlaylist>
  ): Promise<Partial<AIGeneratedPlaylist>> {
    const optimized = { ...playlist };
    
    // Group songs by moment and sort by energy within each moment
    for (const moment in optimized.moment_breakdown) {
      const momentSongIds = optimized.moment_breakdown[moment].songs;
      const momentSongs = optimized.songs!.filter(
        s => momentSongIds.includes(s.song.spotify_id)
      );
      
      // Sort by wedding score and energy
      momentSongs.sort((a, b) => {
        if (moment === WeddingMoment.DINNER || moment === WeddingMoment.COCKTAIL) {
          return a.song.wedding_score - b.song.wedding_score;
        }
        if (moment === WeddingMoment.PARTY_PEAK) {
          return b.song.wedding_score - a.song.wedding_score;
        }
        return b.confidence_score - a.confidence_score;
      });
    }
    
    return optimized;
  }
  
  private async generatePlaylistMetadata(
    playlist: Partial<AIGeneratedPlaylist>,
    context: PlaylistContext,
    aiResponse: AIResponse
  ): Promise<Partial<AIGeneratedPlaylist>> {
    const genres = new Set<string>();
    const moods = new Set<WeddingMood>();
    const decades = new Set<string>();
    
    for (const selection of playlist.songs || []) {
      selection.song.wedding_genres.forEach(g => genres.add(g));
      selection.song.wedding_moods.forEach(m => moods.add(m));
      
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
          `Generated using ${aiResponse.provider} AI with ${Math.round(aiResponse.confidence * 100)}% confidence`,
          `Includes ${playlist.song_count} carefully selected songs`,
          `Covers ${context.timeline.length} key wedding moments`,
          `Features music from ${decades.size} different decades`,
          `Balances ${genres.size} musical genres`
        ],
        suggestions: [
          'Review and customize based on your specific preferences',
          'Test key transitions during rehearsal',
          'Have backup options for special dances'
        ],
        confidence: aiResponse.confidence
      }
    };
  }
  
  private isInRecommendations(song: MasterSong, aiResponse: AIResponse): boolean {
    for (const moment in aiResponse.moments) {
      const songs = aiResponse.moments[moment].songs || [];
      const found = songs.some((rec: any) => 
        rec.title?.toLowerCase().includes(song.title.toLowerCase()) ||
        song.title.toLowerCase().includes(rec.title?.toLowerCase())
      );
      if (found) return true;
    }
    return false;
  }
  
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
  
  private calculateEnergyCurve(songs: SongSelection[]): number[] {
    return songs.map((s, index) => {
      const position = index / songs.length;
      const baseEnergy = s.song.wedding_score / 100;
      
      if (position < 0.2) return baseEnergy * 0.6;
      if (position < 0.4) return baseEnergy * 0.8;
      if (position < 0.7) return baseEnergy;
      if (position < 0.9) return baseEnergy * 0.9;
      return baseEnergy * 0.7;
    });
  }
  
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
  
  private generateRequestId(): string {
    return `playlist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Singleton instance
let multiOrchestrationInstance: MultiModelAIOrchestrationService | null = null;

export function getMultiAIOrchestration(): MultiModelAIOrchestrationService {
  if (!multiOrchestrationInstance) {
    multiOrchestrationInstance = new MultiModelAIOrchestrationService();
  }
  return multiOrchestrationInstance;
}