import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getMusicDatabase } from '@/lib/music-database-service';
import { WeddingMoment } from '@/types/music-ai';
import { 
  getExpertiseForMoment, 
  getBPMForTime, 
  getGenreExpertise,
  getCulturalTradition,
  generateExpertResponse,
  WEDDING_MOMENT_EXPERTISE,
  IDEAL_BPM_PROGRESSION,
  SONG_SUCCESS_METRICS
} from '@/data/wedding-music-expertise';

// Enhanced AI response with wedding expertise
async function generateEnhancedAIResponse(
  message: string, 
  weddingContext?: any,
  sessionHistory?: any[]
) {
  const db = getMusicDatabase();
  const supabase = await createClient();
  const lowerMessage = message.toLowerCase();
  
  // Get wedding details from Supabase if we have a wedding ID
  let weddingData = null;
  let weddingPreferences = null;
  
  if (weddingContext?.weddingId) {
    try {
      const { data: wedding } = await supabase
        .from('weddings')
        .select('*')
        .eq('id', weddingContext.weddingId)
        .single();
      
      weddingData = wedding;
      
      // Try to get learned preferences (table might not exist yet)
      const { data: prefs } = await supabase
        .from('wedding_preferences_learned')
        .select('*')
        .eq('wedding_id', weddingContext.weddingId)
        .single();
      
      weddingPreferences = prefs;
    } catch (error) {
      console.log('Could not fetch wedding data:', error);
    }
  }
  
  // Build comprehensive context
  const fullContext = {
    wedding: weddingData,
    preferences: weddingPreferences,
    currentTimeline: weddingData?.timeline,
    musicStyle: weddingData?.music_preferences,
    venue: weddingData?.venue_name,
    guestCount: weddingData?.guest_count,
    weddingDate: weddingData?.wedding_date,
    history: sessionHistory
  };
  
  // Detect intent and get relevant expertise
  const intent = detectIntent(lowerMessage);
  const expertise = gatherExpertise(lowerMessage, intent);
  
  // Generate response based on intent
  let response = {
    message: '',
    suggestions: [] as string[],
    songs: [] as any[],
    expertise: expertise,
    context: fullContext
  };
  
  switch (intent) {
    case 'moment_planning':
      response = await handleMomentPlanning(message, fullContext, expertise);
      break;
    
    case 'bpm_energy':
      response = await handleBPMEnergy(message, fullContext, expertise);
      break;
    
    case 'song_search':
      response = await handleSongSearch(message, fullContext, db);
      break;
    
    case 'timeline_generation':
      response = await handleTimelineGeneration(fullContext, db);
      break;
    
    case 'cultural_music':
      response = await handleCulturalMusic(message, fullContext, expertise);
      break;
    
    case 'technical_advice':
      response = await handleTechnicalAdvice(message, expertise);
      break;
    
    case 'general_advice':
    default:
      response = await handleGeneralAdvice(message, fullContext, expertise);
  }
  
  // Track interaction for learning
  if (weddingContext?.weddingId) {
    await trackInteraction(
      supabase,
      weddingContext.weddingId,
      message,
      response,
      intent
    );
  }
  
  return response;
}

// Intent detection
function detectIntent(message: string): string {
  const lower = message.toLowerCase();
  
  if (lower.includes('timeline') || lower.includes('schedule') || lower.includes('order')) {
    return 'timeline_generation';
  }
  if (lower.includes('bpm') || lower.includes('tempo') || lower.includes('energy')) {
    return 'bpm_energy';
  }
  if (lower.includes('ceremony') || lower.includes('cocktail') || lower.includes('dinner') || 
      lower.includes('first dance') || lower.includes('party')) {
    return 'moment_planning';
  }
  if (lower.includes('song') || lower.includes('music') || lower.includes('play')) {
    return 'song_search';
  }
  if (lower.includes('jewish') || lower.includes('indian') || lower.includes('latino') || 
      lower.includes('cultural') || lower.includes('tradition')) {
    return 'cultural_music';
  }
  if (lower.includes('speaker') || lower.includes('sound') || lower.includes('equipment') || 
      lower.includes('technical')) {
    return 'technical_advice';
  }
  
  return 'general_advice';
}

// Gather relevant expertise
function gatherExpertise(message: string, intent: string): any {
  const expertise: any = {
    moments: [],
    bpm: [],
    genres: [],
    cultural: [],
    technical: []
  };
  
  // Get moment expertise
  WEDDING_MOMENT_EXPERTISE.forEach(moment => {
    if (message.toLowerCase().includes(moment.moment.replace('-', ' '))) {
      expertise.moments.push(moment);
    }
  });
  
  // Get BPM progression if relevant
  if (intent === 'bpm_energy' || intent === 'timeline_generation') {
    expertise.bpm = IDEAL_BPM_PROGRESSION;
  }
  
  // Get cultural expertise if mentioned
  const cultures = ['jewish', 'irish', 'greek', 'italian', 'latino', 'indian', 'african'];
  cultures.forEach(culture => {
    if (message.toLowerCase().includes(culture)) {
      expertise.cultural.push(getCulturalTradition(culture));
    }
  });
  
  return expertise;
}

// Handle moment-specific planning
async function handleMomentPlanning(
  message: string, 
  context: any, 
  expertise: any
): Promise<any> {
  const db = getMusicDatabase();
  const momentExpertise = expertise.moments[0];
  
  if (!momentExpertise) {
    return {
      message: "I can help you plan any moment of your wedding! Which part would you like to focus on?",
      suggestions: [
        "Help with ceremony music",
        "Cocktail hour playlist",
        "First dance suggestions",
        "Party music that works"
      ]
    };
  }
  
  // Get songs for this moment
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
  
  const weddingMoment = momentMap[momentExpertise.moment];
  const songs = await db.getSongsForMoment(weddingMoment, { 
    limit: 10,
    genres: context.musicStyle?.genres,
    country: context.musicStyle?.location
  });
  
  // Build expert response
  let expertAdvice = `For your ${momentExpertise.moment.replace('-', ' ')}, here's my expert advice:\n\n`;
  expertAdvice += `**Duration:** ${momentExpertise.duration}\n`;
  expertAdvice += `**Energy Level:** ${momentExpertise.energy_level}/10\n`;
  expertAdvice += `**BPM Range:** ${momentExpertise.bpm_range[0]}-${momentExpertise.bpm_range[1]} BPM\n\n`;
  expertAdvice += `**Key Points:**\n`;
  momentExpertise.key_characteristics.forEach((point: string) => {
    expertAdvice += `• ${point}\n`;
  });
  expertAdvice += `\n**Pro Tips:**\n`;
  momentExpertise.pro_tips.slice(0, 3).forEach((tip: string) => {
    expertAdvice += `• ${tip}\n`;
  });
  
  return {
    message: expertAdvice,
    songs: songs.map(s => ({
      id: s.spotify_id,
      title: s.title,
      artist: s.artist,
      previewUrl: s.preview_url,
      albumArt: s.album_art_url,
      bpm: s.audio_features?.tempo,
      energy: s.audio_features?.energy
    })),
    suggestions: [
      `More ${momentExpertise.moment} songs`,
      "What to avoid for this moment",
      "Transition to next moment",
      "Cultural variations"
    ],
    expertise: momentExpertise
  };
}

// Handle BPM and energy queries
async function handleBPMEnergy(
  message: string, 
  context: any, 
  expertise: any
): Promise<any> {
  const currentTime = context.wedding?.ceremony_time || "7:00 PM";
  const relevantProgression = IDEAL_BPM_PROGRESSION.find(p => 
    p.time.includes(currentTime.split(' ')[0])
  ) || IDEAL_BPM_PROGRESSION[5]; // Default to peak party
  
  let response = `Here's the ideal BPM and energy progression for your wedding:\n\n`;
  
  // Show current phase
  response += `**Current Phase: ${relevantProgression.phase}**\n`;
  response += `• Target BPM: ${relevantProgression.target_bpm[0]}-${relevantProgression.target_bpm[1]}\n`;
  response += `• Energy Level: ${relevantProgression.energy}/10\n`;
  response += `• Mixing: ${relevantProgression.mixing_technique}\n`;
  response += `• Crowd Psychology: ${relevantProgression.crowd_psychology}\n\n`;
  
  // Show full progression
  response += `**Full Day Energy Arc:**\n`;
  IDEAL_BPM_PROGRESSION.slice(0, 5).forEach(phase => {
    response += `${phase.time}: ${phase.phase} (${phase.target_bpm[0]}-${phase.target_bpm[1]} BPM, Energy: ${phase.energy}/10)\n`;
  });
  
  return {
    message: response,
    suggestions: [
      "Show mixing techniques",
      "Energy management tips",
      "How to read the crowd",
      "Transition strategies"
    ],
    expertise: expertise.bpm
  };
}

// Handle song searches with expertise
async function handleSongSearch(
  message: string, 
  context: any, 
  db: any
): Promise<any> {
  // Extract search terms
  const searchTerms = extractSearchTerms(message);
  let songs = [];
  
  if (searchTerms.moment) {
    songs = await db.getSongsForMoment(searchTerms.moment, { 
      limit: 10,
      genres: context.musicStyle?.genres
    });
  } else if (searchTerms.genre) {
    songs = await db.searchSongs({ 
      genres: [searchTerms.genre],
      limit: 10 
    });
  } else {
    // General search - get top wedding songs
    songs = SONG_SUCCESS_METRICS.guaranteed_floor_fillers.slice(0, 10).map(s => {
      const [title, artist] = s.song.split(' - ');
      return {
        id: `spotify:${title.toLowerCase().replace(/\s+/g, '-')}`,
        title,
        artist,
        success_rate: s.success_rate,
        best_time: s.best_time
      };
    });
  }
  
  const response = context.preferences?.prefers_familiar 
    ? "Based on your preference for familiar songs, here are crowd-tested favorites:"
    : "Here are some perfect songs for your wedding:";
  
  return {
    message: response,
    songs: songs.slice(0, 10),
    suggestions: [
      "More like these",
      "Different genre",
      "Higher energy songs",
      "Slower tempo songs"
    ]
  };
}

// Generate complete timeline
async function handleTimelineGeneration(context: any, db: any): Promise<any> {
  const timeline = [];
  
  for (const moment of WEDDING_MOMENT_EXPERTISE) {
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
    
    const weddingMoment = momentMap[moment.moment];
    if (!weddingMoment) continue;
    
    const songs = await db.getSongsForMoment(weddingMoment, {
      limit: 5,
      genres: context.musicStyle?.genres
    });
    
    timeline.push({
      moment: moment.moment,
      duration: moment.duration,
      energy: moment.energy_level,
      bpm_range: moment.bpm_range,
      songs: songs.map((s: any) => s.title + ' - ' + s.artist)
    });
  }
  
  return {
    message: "I've created a complete wedding timeline based on proven expertise. Each moment is optimized for energy flow and crowd engagement:",
    timeline,
    suggestions: [
      "Customize for my venue",
      "Add cultural traditions",
      "Adjust for guest demographics",
      "Export full playlist"
    ]
  };
}

// Handle cultural music requests
async function handleCulturalMusic(
  message: string, 
  context: any, 
  expertise: any
): Promise<any> {
  const cultural = expertise.cultural[0];
  
  if (!cultural) {
    return {
      message: "I can help with music for many cultural wedding traditions! Which culture's traditions are you incorporating?",
      suggestions: [
        "Jewish wedding music",
        "Indian wedding songs",
        "Latino celebration music",
        "Irish wedding traditions"
      ]
    };
  }
  
  let response = `Here's expert guidance for ${cultural.name || 'cultural'} wedding music:\n\n`;
  response += `**Essential Songs:**\n`;
  cultural.essential_songs?.forEach((song: string) => {
    response += `• ${song}\n`;
  });
  response += `\n**Key Moments:**\n`;
  cultural.key_moments?.forEach((moment: string) => {
    response += `• ${moment}\n`;
  });
  response += `\n**Timing:** ${cultural.timing}\n`;
  response += `\n**Pro Tip:** ${cultural.tips}`;
  
  return {
    message: response,
    suggestions: [
      "Find these songs",
      "Modern alternatives",
      "How to mix with other music",
      "Venue requirements"
    ],
    expertise: cultural
  };
}

// Handle technical advice
async function handleTechnicalAdvice(message: string, expertise: any): Promise<any> {
  return {
    message: "Here's technical expertise for your wedding music setup. Proper equipment and settings are crucial for success!",
    suggestions: [
      "Sound level guidelines",
      "Speaker placement tips",
      "Backup requirements",
      "Venue acoustics help"
    ],
    expertise: expertise.technical
  };
}

// Handle general advice with expertise
async function handleGeneralAdvice(
  message: string, 
  context: any, 
  expertise: any
): Promise<any> {
  const db = getMusicDatabase();
  
  // Provide contextual advice based on wedding details
  let advice = "I'm DJ Harmony, your expert wedding music advisor! ";
  
  if (context.wedding?.wedding_date) {
    const daysUntil = Math.floor((new Date(context.wedding.wedding_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (daysUntil > 0 && daysUntil < 30) {
      advice += `With your wedding just ${daysUntil} days away, let's finalize your music! `;
    }
  }
  
  if (context.wedding?.guest_count) {
    if (context.wedding.guest_count > 150) {
      advice += "For your large celebration, we'll need high-energy crowd pleasers. ";
    } else if (context.wedding.guest_count < 50) {
      advice += "For your intimate gathering, we can be more adventurous with song choices. ";
    }
  }
  
  advice += "\n\nI have expertise in:\n";
  advice += "• Complete timeline planning with optimal BPM progression\n";
  advice += "• Song selection for every wedding moment\n";
  advice += "• Cultural music traditions and integration\n";
  advice += "• Professional mixing techniques\n";
  advice += "• Crowd psychology and energy management\n";
  advice += "\nWhat aspect of your wedding music would you like expert help with?";
  
  return {
    message: advice,
    suggestions: [
      "Build my complete timeline",
      "Help with first dance",
      "Party music that works",
      "Review my current playlist"
    ]
  };
}

// Extract search terms
function extractSearchTerms(message: string) {
  const terms: any = {};
  const lower = message.toLowerCase();
  
  // Check for moments
  if (lower.includes('first dance')) terms.moment = WeddingMoment.FIRST_DANCE;
  else if (lower.includes('ceremony')) terms.moment = WeddingMoment.PROCESSIONAL;
  else if (lower.includes('party') || lower.includes('dance')) terms.moment = WeddingMoment.PARTY_PEAK;
  else if (lower.includes('dinner')) terms.moment = WeddingMoment.DINNER;
  else if (lower.includes('cocktail')) terms.moment = WeddingMoment.COCKTAIL;
  
  // Check for genres
  if (lower.includes('pop')) terms.genre = 'pop';
  else if (lower.includes('rock')) terms.genre = 'rock';
  else if (lower.includes('r&b') || lower.includes('rnb')) terms.genre = 'r&b';
  else if (lower.includes('country')) terms.genre = 'country';
  else if (lower.includes('indie')) terms.genre = 'indie';
  
  return terms;
}

// Track interaction for learning (when table exists)
async function trackInteraction(
  supabase: any,
  weddingId: string,
  query: string,
  response: any,
  intent: string
) {
  try {
    // Only try to track if we have the table
    await supabase.from('ai_interactions').insert({
      wedding_id: weddingId,
      user_query: query,
      query_intent: intent,
      ai_response: response.message,
      songs_suggested: response.songs?.map((s: any) => s.id) || [],
      wedding_context: {
        has_timeline: !!response.context?.currentTimeline,
        has_preferences: !!response.context?.preferences,
        venue: response.context?.venue
      }
    });
  } catch (error) {
    // Silently fail if table doesn't exist
    console.log('Could not track interaction (table may not exist)');
  }
}

// Main API handler
export async function POST(request: NextRequest) {
  try {
    const { message, weddingId, history } = await request.json();
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }
    
    // Generate enhanced AI response with expertise
    const aiResponse = await generateEnhancedAIResponse(
      message, 
      { weddingId }, 
      history
    );
    
    return NextResponse.json(aiResponse);
    
  } catch (error) {
    console.error('DJ Harmony enhanced chat error:', error);
    return NextResponse.json(
      { 
        message: "I'm having a moment! Let me recalibrate my expertise... Please try again.",
        suggestions: ["Try again", "Ask something else"]
      },
      { status: 500 }
    );
  }
}