import { NextRequest, NextResponse } from 'next/server';
import { getMusicDatabase } from '@/lib/music-database-service';
import { WeddingMoment } from '@/types/music-ai';
import { aiService } from '@/lib/ai-providers';

// Enhanced AI response generation with better fallback
async function generateAIResponse(message: string, context?: any) {
  const db = getMusicDatabase();
  const lowerMessage = message.toLowerCase();
  
  // Create a comprehensive response based on patterns
  const response = {
    message: '',
    suggestions: [] as string[],
    songs: [] as any[]
  };

  // Check for specific song queries
  if (lowerMessage.includes('song') || lowerMessage.includes('music') || lowerMessage.includes('play')) {
    // Search for relevant songs based on keywords
    const searchTerms = extractSearchTerms(lowerMessage);
    
    if (searchTerms.moment) {
      // Get songs for specific moment
      const momentSongs = await getMomentSongs(searchTerms.moment);
      response.songs = momentSongs.slice(0, 5);
      response.message = `Here are some perfect ${searchTerms.moment} songs for your wedding! Each one has been carefully selected based on energy, mood, and popularity.`;
    } else if (searchTerms.genre) {
      // Get songs by genre
      const genreSongs = await db.searchSongs({ genres: [searchTerms.genre] }, 5);
      response.songs = genreSongs.map(formatSong);
      response.message = `Great choice! Here are some amazing ${searchTerms.genre} songs that work perfectly for weddings.`;
    } else {
      // Get popular wedding songs
      const popularSongs = await db.getPopularSongs({ limit: 5 });
      response.songs = popularSongs.map(formatSong);
      response.message = "Here are some of the most popular wedding songs right now! These are guaranteed crowd-pleasers.";
    }
    
    response.suggestions = [
      "Show me first dance songs",
      "I need party music",
      "Suggest dinner music",
      "More like these"
    ];
  } else {
    // Use pattern-based responses for general queries
    return generatePatternResponse(message, context);
  }
  
  return response;
}

// Helper function to extract search terms
function extractSearchTerms(message: string) {
  const terms: any = {};
  
  // Check for moments
  if (message.includes('first dance')) terms.moment = 'first-dance';
  else if (message.includes('ceremony')) terms.moment = 'ceremony';
  else if (message.includes('party') || message.includes('dance')) terms.moment = 'party';
  else if (message.includes('dinner')) terms.moment = 'dinner';
  else if (message.includes('cocktail')) terms.moment = 'cocktails';
  
  // Check for genres
  if (message.includes('pop')) terms.genre = 'pop';
  else if (message.includes('rock')) terms.genre = 'rock';
  else if (message.includes('r&b') || message.includes('rnb')) terms.genre = 'r&b';
  else if (message.includes('country')) terms.genre = 'country';
  else if (message.includes('indie')) terms.genre = 'indie';
  
  return terms;
}

// Helper to get songs for specific moments
async function getMomentSongs(momentId: string) {
  const db = getMusicDatabase();
  const momentMap: { [key: string]: WeddingMoment } = {
    'first-dance': WeddingMoment.FIRST_DANCE,
    'ceremony': WeddingMoment.PROCESSIONAL,
    'party': WeddingMoment.PARTY_PEAK,
    'dinner': WeddingMoment.DINNER,
    'cocktails': WeddingMoment.COCKTAIL
  };
  
  const moment = momentMap[momentId] || WeddingMoment.PARTY_PEAK;
  const songs = await db.getSongsForMoment(moment, { limit: 5 });
  return songs.map(formatSong);
}

// Helper to format songs consistently
function formatSong(song: any) {
  return {
    id: song.spotify_id || song.id,
    title: song.title,
    artist: song.artist,
    album: song.album,
    previewUrl: song.preview_url,
    albumArt: song.album_art_url || song.albumArt,
    duration: song.duration_ms ? Math.round(song.duration_ms / 1000) : undefined
  };
}

// Pattern-based response generation
async function generatePatternResponse(message: string, context?: any) {
  const lowerMessage = message.toLowerCase();
  
  // Pattern matching for common queries
  const patterns = {
    greeting: /^(hi|hello|hey|howdy)/i,
    firstDance: /(first dance|romantic|slow|couple)/i,
    party: /(party|dance|upbeat|energetic|fun)/i,
    dinner: /(dinner|background|ambient|conversation)/i,
    ceremony: /(ceremony|processional|walk|aisle)/i,
    genre: /(pop|rock|country|r&b|rnb|hip hop|indie|electronic|jazz|classical)/i,
    help: /(help|what can you|how do|suggest|recommend)/i,
    thanks: /(thank|thanks|perfect|great|awesome)/i,
    budget: /(budget|cost|price|expensive|cheap|afford)/i,
    timeline: /(timeline|schedule|when|timing|order)/i
  };

  const response = {
    message: '',
    suggestions: [] as string[],
    songs: [] as any[]
  };

  // Handle different query types
  if (patterns.greeting.test(lowerMessage)) {
    response.message = "Hello! I'm excited to help you create the perfect wedding playlist. Are you looking for suggestions for a specific moment, or would you like me to help build your entire timeline?";
    response.suggestions = [
      "Help me with first dance songs",
      "I need party music",
      "Build my complete timeline",
      "Show me trending wedding songs"
    ];
  } 
  else if (patterns.firstDance.test(lowerMessage)) {
    response.message = "First dance songs are so special! I can suggest romantic classics, modern love songs, or something unique to your story. What style resonates with you?";
    response.suggestions = [
      "Classic romantic songs",
      "Modern pop love songs",
      "Indie and alternative",
      "R&B and soul"
    ];
    
    // Get first dance songs from database
    const db = getMusicDatabase();
    const songs = await db.getSongsForMoment(WeddingMoment.FIRST_DANCE, { limit: 5 });
    response.songs = songs.map(s => ({
      id: s.spotify_id,
      title: s.title,
      artist: s.artist,
      previewUrl: s.preview_url,
      albumArt: s.album_art_url
    }));
  }
  else if (patterns.party.test(lowerMessage)) {
    response.message = "Let's get this party started! 🎉 I'll find songs that'll pack the dance floor. What gets your crowd moving?";
    response.suggestions = [
      "Current hits and chart toppers",
      "Classic party anthems",
      "Hip hop and R&B bangers",
      "Mixed decades party mix"
    ];
    
    const db = getMusicDatabase();
    const songs = await db.getSongsForMoment(WeddingMoment.PARTY_PEAK, { limit: 5 });
    response.songs = songs.map(s => ({
      id: s.spotify_id,
      title: s.title,
      artist: s.artist,
      previewUrl: s.preview_url,
      albumArt: s.album_art_url
    }));
  }
  else if (patterns.dinner.test(lowerMessage)) {
    response.message = "Dinner music sets the perfect ambiance for conversation and celebration. I'll suggest songs that enhance the atmosphere without overwhelming. What's your venue like?";
    response.suggestions = [
      "Elegant jazz and standards",
      "Acoustic and indie folk",
      "Soft pop and soul",
      "Instrumental background"
    ];
    
    const db = getMusicDatabase();
    const songs = await db.getSongsForMoment(WeddingMoment.DINNER, { limit: 5 });
    response.songs = songs.map(s => ({
      id: s.spotify_id,
      title: s.title,
      artist: s.artist,
      previewUrl: s.preview_url,
      albumArt: s.album_art_url
    }));
  }
  else if (patterns.ceremony.test(lowerMessage)) {
    response.message = "Ceremony music creates those unforgettable moments. I can help with processional, bride's entrance, and recessional songs. Which part of the ceremony are you planning?";
    response.suggestions = [
      "Processional (wedding party)",
      "Bride's entrance",
      "Unity ceremony",
      "Recessional (exit)"
    ];
    
    const db = getMusicDatabase();
    const songs = await db.getSongsForMoment(WeddingMoment.PROCESSIONAL, { limit: 5 });
    response.songs = songs.map(s => ({
      id: s.spotify_id,
      title: s.title,
      artist: s.artist,
      previewUrl: s.preview_url,
      albumArt: s.album_art_url
    }));
  }
  else if (patterns.timeline.test(lowerMessage)) {
    response.message = "A well-planned timeline keeps your reception flowing perfectly! Typically, you'll want music for: getting ready (30min), ceremony (20min), cocktails (90min), dinner (90min), first dance (5min), parent dances (10min), and party time (3+ hours). Which part should we start with?";
    response.suggestions = [
      "Start from the beginning",
      "Focus on reception music",
      "Just the must-have moments",
      "Help me with timing"
    ];
  }
  else if (patterns.budget.test(lowerMessage)) {
    response.message = "Great news! Partner collaboration is now FREE, and our Premium features are just £25 (one-time payment). This includes unlimited songs, Spotify export, and full DJ handoff materials. The free tier gives you 10 songs to get started. Ready to explore?";
    response.suggestions = [
      "Show me what's included",
      "Start with free features",
      "Tell me about Premium",
      "Continue building playlist"
    ];
  }
  else if (patterns.thanks.test(lowerMessage)) {
    response.message = "You're so welcome! I'm here whenever you need help. Remember, your perfect wedding playlist is just a few songs away. Is there anything else you'd like to explore?";
    response.suggestions = [
      "Review my timeline",
      "Add more songs",
      "Get guest suggestions",
      "Export to Spotify"
    ];
  }
  else if (patterns.help.test(lowerMessage)) {
    response.message = "I can help you with:\n• Finding perfect songs for each wedding moment\n• Building a complete timeline\n• Managing energy flow throughout your reception\n• Getting guest song requests\n• Exporting to Spotify\n• Creating DJ handoff materials\n\nWhat would you like to tackle first?";
    response.suggestions = [
      "Build my timeline",
      "Find specific songs",
      "Get song recommendations",
      "Learn about features"
    ];
  }
  else {
    // Default response with genre detection
    if (patterns.genre.test(lowerMessage)) {
      const genre = lowerMessage.match(patterns.genre)?.[0] || 'pop';
      response.message = `I love ${genre} music for weddings! Let me find some amazing ${genre} songs that work perfectly for different wedding moments. What part of your wedding are you planning?`;
      response.suggestions = [
        `Best ${genre} first dance songs`,
        `${genre} party hits`,
        `${genre} dinner music`,
        `All ${genre} suggestions`
      ];
    } else {
      response.message = "I'd love to help you with that! Could you tell me more about what you're looking for? I can suggest songs for specific moments, help with your timeline, or find music that matches your style.";
      response.suggestions = [
        "Help me find songs",
        "Build my timeline",
        "What can you do?",
        "Surprise me with suggestions"
      ];
    }
  }

  return response;
}

export async function POST(request: NextRequest) {
  try {
    const { message, weddingId, history } = await request.json();
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Generate AI response
    const aiResponse = await generateAIResponse(message, { weddingId, history });
    
    return NextResponse.json(aiResponse);
    
  } catch (error) {
    console.error('DJ Harmony chat error:', error);
    return NextResponse.json(
      { 
        message: "I'm having a moment! Let me recalibrate... Please try again.",
        suggestions: ["Try again", "Ask something else"]
      },
      { status: 500 }
    );
  }
}