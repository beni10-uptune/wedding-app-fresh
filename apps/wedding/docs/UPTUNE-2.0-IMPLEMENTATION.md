# UpTune 2.0 Implementation Roadmap

## Quick Start: What to Build First

### Week 1: Core AI Magic ✨
**Goal**: Get the "wow" moment working - AI generates full playlist in 60 seconds

#### Day 1-2: AI Prompt Engineering
```typescript
// Core prompt structure
const generatePlaylistPrompt = (context: WeddingContext) => `
You are an expert wedding DJ with 20 years experience.
Create a complete wedding playlist with these requirements:

Wedding Details:
- Date: ${context.date} (consider season)
- Venue: ${context.venueType}
- Guests: ${context.guestCount}
- Vibe: ${context.style}
- Ages: ${context.demographics}

Rules:
1. Include 120-150 songs total
2. Each song needs Spotify ID (search real songs)
3. Explain why each song was chosen
4. Consider energy flow throughout the night
5. Mix genres appropriately for demographics

Structure:
- Prelude (30 min): 8-10 songs for guest arrival
- Ceremony (20 min): 5-6 songs including processional
- Cocktail (60 min): 15-18 upbeat social songs
- Dinner (90 min): 20-25 background songs
- First Dances (15 min): 3-4 special songs
- Party (180 min): 50-60 dance floor hits
- Send-off (5 min): 1-2 closing songs

Format each song as:
{
  title: "Song Name",
  artist: "Artist Name", 
  spotifyId: "spotify:track:xxxx",
  moment: "cocktail",
  energy: 1-10,
  bpm: number,
  reasoning: "Chosen because..."
}
`;
```

#### Day 3-4: Streamlined Onboarding
```typescript
// New onboarding flow - just 5 screens
const OnboardingFlow = () => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<WeddingContext>({});

  // Screen components
  const screens = [
    <WelcomeScreen />,        // "Hi! I'm your AI DJ"
    <BasicsScreen />,         // Date, venue, guests
    <VibeScreen />,          // Style selection
    <DemographicsScreen />,   // Guest ages/preferences  
    <SpecialTouchesScreen />, // Optional additions
    <AIGeneratingScreen />    // Magic happening
  ];

  return <AnimatePresence>{screens[step]}</AnimatePresence>;
};
```

#### Day 5: The Reveal Experience
```typescript
// Stunning reveal of generated playlist
const PlaylistReveal = ({ playlist }: { playlist: GeneratedPlaylist }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center">
        <motion.h1 
          className="text-4xl font-bold"
          animate={{ scale: [0.9, 1.1, 1] }}
        >
          ✨ Your Perfect Wedding Soundtrack is Ready!
        </motion.h1>
        <p className="text-xl mt-4">
          {playlist.songs.length} songs • {formatDuration(playlist.totalDuration)} of music
        </p>
      </div>

      <TimelineVisualization moments={playlist.moments} />
      
      <div className="grid gap-6">
        {playlist.moments.map(moment => (
          <MomentCard
            key={moment.id}
            moment={moment}
            songs={moment.songs}
            onExpand={() => showDetails(moment)}
          />
        ))}
      </div>

      <UpsellBanner />
    </motion.div>
  );
};
```

### Week 2: AI Chat & Basic Customization

#### Day 6-7: AI DJ Chat Interface
```typescript
// Conversational refinement
const AIDJChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: "I've created your perfect playlist! Want to make any changes?",
      suggestions: [
        "Make dinner music more jazzy",
        "Add more 90s hits",
        "Include more [artist]",
        "Increase party energy"
      ]
    }
  ]);

  const handleUserMessage = async (message: string) => {
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    
    // Stream AI response
    const response = await streamAIResponse(message, currentPlaylist);
    
    // Update playlist based on AI suggestions
    await updatePlaylist(response.changes);
  };

  return (
    <div className="chat-interface">
      <MessageList messages={messages} />
      <ChatInput 
        onSend={handleUserMessage}
        suggestions={getCurrentSuggestions()}
      />
    </div>
  );
};
```

#### Day 8-9: Smart Customization Tools
```typescript
// Energy flow editor
const EnergyFlowEditor = ({ playlist }) => {
  const [energyProfile, setEnergyProfile] = useState(playlist.energyProfile);

  const handleEnergyChange = async (momentId: string, newEnergy: number) => {
    // Update energy profile
    const updated = { ...energyProfile, [momentId]: newEnergy };
    setEnergyProfile(updated);
    
    // AI rebalances songs to match new energy
    const newSongs = await rebalanceSongs(momentId, newEnergy);
    updateMomentSongs(momentId, newSongs);
  };

  return (
    <div className="energy-editor">
      <canvas ref={chartRef} /> {/* Beautiful energy visualization */}
      {playlist.moments.map(moment => (
        <EnergySlider
          key={moment.id}
          moment={moment}
          value={energyProfile[moment.id]}
          onChange={(val) => handleEnergyChange(moment.id, val)}
        />
      ))}
    </div>
  );
};
```

#### Day 10: Export Features
```typescript
// One-click Spotify export
const exportToSpotify = async (playlist: GeneratedPlaylist) => {
  // Create playlist in user's Spotify
  const spotifyPlaylist = await spotify.createPlaylist({
    name: `${coupleNames} Wedding - ${moment}`,
    description: 'Created with UpTune AI Wedding DJ',
    public: false
  });

  // Add tracks in batches
  const trackUris = playlist.songs.map(s => s.spotifyId);
  await spotify.addTracksToPlaylist(spotifyPlaylist.id, trackUris);

  // Set custom playlist image
  await spotify.uploadPlaylistCover(spotifyPlaylist.id, customCover);

  return spotifyPlaylist.external_urls.spotify;
};
```

### Week 3: Guest Features & Polish

#### Day 11-12: Guest Request System
```typescript
// Guest request portal
const GuestRequestPortal = ({ weddingId }: { weddingId: string }) => {
  const wedding = useWedding(weddingId);
  
  return (
    <div className="guest-portal">
      <Header couple={wedding.coupleNames} date={wedding.date} />
      
      <div className="request-section">
        <h2>Help us build the perfect playlist!</h2>
        <p>Choose up to 3 songs you'd love to hear:</p>
        
        {/* AI suggests songs based on wedding style */}
        <SuggestedSongs 
          suggestions={getGuestSuggestions(wedding.style)}
          onSelect={handleSongSelect}
        />
        
        {/* Or search for specific songs */}
        <SongSearch 
          placeholder="Or search for a specific song..."
          onSelect={handleSongSelect}
        />
        
        <SelectedSongs songs={selectedSongs} />
        <SubmitButton onClick={submitRequests} />
      </div>
    </div>
  );
};
```

#### Day 13-14: Cultural Intelligence
```typescript
// Cultural music integration
const CulturalMusicEngine = {
  indian: {
    moments: ['baraat', 'sangeet', 'reception'],
    songs: {
      baraat: ['dhol', 'bhangra', 'upbeat'],
      sangeet: ['bollywood', 'garba', 'mixed'],
      reception: ['modern', 'fusion', 'classics']
    }
  },
  jewish: {
    moments: ['processional', 'hora', 'celebration'],
    songs: {
      hora: ['hava_nagila', 'traditional', 'israeli_pop'],
      processional: ['classical', 'meaningful'],
      celebration: ['klezmer', 'modern', 'mixed']
    }
  },
  // ... more cultures
};

const addCulturalMoments = (playlist, culture, preferences) => {
  const culturalData = CulturalMusicEngine[culture];
  
  // Insert cultural moments at appropriate times
  culturalData.moments.forEach(moment => {
    const songs = generateCulturalSongs(moment, preferences);
    insertMoment(playlist, moment, songs);
  });
  
  return playlist;
};
```

#### Day 15: Beautiful Visualizations
```typescript
// Timeline visualization component
const TimelineVisualization = ({ moments }) => {
  return (
    <div className="timeline-container">
      <svg className="timeline" viewBox="0 0 1000 100">
        {moments.map((moment, idx) => {
          const startX = calculateStartPosition(moment);
          const width = calculateWidth(moment.duration);
          
          return (
            <g key={moment.id}>
              <rect
                x={startX}
                y="30"
                width={width}
                height="40"
                fill={getGradientForMoment(moment.type)}
                className="cursor-pointer hover:opacity-80"
                onClick={() => scrollToMoment(moment.id)}
              />
              <text
                x={startX + width/2}
                y="50"
                textAnchor="middle"
                className="text-xs fill-white"
              >
                {moment.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
```

---

## Database Schema Updates

```typescript
// New Firestore collections needed

// ai_playlists collection
interface AIPlaylist {
  id: string;
  weddingId: string;
  userId: string;
  version: number;
  
  // Generation context
  context: {
    date: Date;
    venueType: string;
    guestCount: number;
    style: string;
    demographics: string[];
    culturalBackground?: string[];
    mustPlay?: string[];
    neverPlay?: string[];
  };
  
  // Generated content
  songs: {
    id: string;
    spotifyId: string;
    title: string;
    artist: string;
    moment: string;
    position: number;
    energy: number;
    bpm: number;
    key: string;
    reasoning: string;
    alternatives?: string[];
  }[];
  
  // Metadata
  stats: {
    totalDuration: number;
    totalSongs: number;
    energyProfile: number[];
    genreBreakdown: Record<string, number>;
    generationTime: number;
  };
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ai_conversations collection
interface AIConversation {
  id: string;
  playlistId: string;
  messages: {
    role: 'user' | 'ai';
    content: string;
    timestamp: Timestamp;
    changes?: PlaylistChange[];
  }[];
}

// guest_requests collection  
interface GuestRequest {
  id: string;
  weddingId: string;
  guestName: string;
  songs: {
    spotifyId: string;
    title: string;
    artist: string;
    reason?: string;
  }[];
  submittedAt: Timestamp;
  approved?: boolean;
}
```

---

## API Design

```typescript
// New API endpoints needed

// POST /api/ai/generate
export async function POST(req: Request) {
  const { context } = await req.json();
  
  // Rate limiting
  const rateLimitOk = await checkRateLimit(req);
  if (!rateLimitOk) return new Response('Too many requests', { status: 429 });
  
  // Generate with AI
  const prompt = generatePlaylistPrompt(context);
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [{ role: 'system', content: prompt }],
    temperature: 0.7,
    max_tokens: 4000,
    stream: true
  });
  
  // Stream response back
  return new Response(response.body, {
    headers: { 'Content-Type': 'text/event-stream' }
  });
}

// POST /api/ai/refine
export async function POST(req: Request) {
  const { playlistId, message } = await req.json();
  
  // Get current playlist
  const playlist = await getPlaylist(playlistId);
  
  // Generate refinement
  const refinedPlaylist = await refinePlaylist(playlist, message);
  
  // Save changes
  await updatePlaylist(playlistId, refinedPlaylist);
  
  return Response.json({ success: true, playlist: refinedPlaylist });
}

// POST /api/export/spotify
export async function POST(req: Request) {
  const { playlistId, accessToken } = await req.json();
  
  const playlist = await getPlaylist(playlistId);
  const spotifyUrl = await exportToSpotify(playlist, accessToken);
  
  return Response.json({ spotifyUrl });
}
```

---

## Landing Page Copy

```html
<!-- Hero Section -->
<section class="hero">
  <h1 class="text-6xl font-bold">
    Your AI Wedding DJ
  </h1>
  <p class="text-2xl mt-4">
    Creates your perfect playlist in 60 seconds
  </p>
  <p class="text-lg mt-2 text-gray-600">
    Personalized • Culturally Aware • Guest Approved • DJ Ready
  </p>
  <button class="cta-button mt-8">
    Create My Wedding Playlist - Free
  </button>
  <p class="text-sm mt-2">
    No credit card required • 10 songs free
  </p>
</section>

<!-- Social Proof -->
<section class="social-proof">
  <div class="stats">
    <div>
      <h3>10,000+</h3>
      <p>Weddings Powered</p>
    </div>
    <div>
      <h3>60 sec</h3>
      <p>To Perfect Playlist</p>
    </div>
    <div>
      <h3>4.9★</h3>
      <p>Couple Rating</p>
    </div>
  </div>
</section>

<!-- How It Works -->
<section class="how-it-works">
  <h2>From Stressed to Impressed in 3 Steps</h2>
  
  <div class="steps">
    <div class="step">
      <div class="number">1</div>
      <h3>Answer 5 Questions</h3>
      <p>Tell us about your wedding vibe (30 seconds)</p>
    </div>
    
    <div class="step">
      <div class="number">2</div>
      <h3>AI Creates Magic</h3>
      <p>Get a complete, personalized playlist instantly</p>
    </div>
    
    <div class="step">
      <div class="number">3</div>
      <h3>Perfect & Share</h3>
      <p>Refine with AI, export to Spotify, done!</p>
    </div>
  </div>
</section>

<!-- Value Props -->
<section class="value-props">
  <h2>Why Couples Choose UpTune</h2>
  
  <div class="grid">
    <div class="prop">
      <h3>🤖 Smarter Than Generic Playlists</h3>
      <p>Our AI considers your venue, guests, culture, and vibe</p>
    </div>
    
    <div class="prop">
      <h3>💰 95% Cheaper Than a DJ</h3>
      <p>Professional results for £29 vs £1,500+</p>
    </div>
    
    <div class="prop">
      <h3>👥 Guest Requests That Work</h3>
      <p>AI filters suggestions to match your vibe</p>
    </div>
    
    <div class="prop">
      <h3>🎧 Ready for Any DJ</h3>
      <p>Export with BPM, keys, and mixing notes</p>
    </div>
  </div>
</section>
```

---

## Marketing Angles

### TikTok/Reels Content Ideas:
1. "POV: You asked AI to DJ your wedding" (show generation)
2. "Wedding playlist speedrun - 60 seconds" (screen record)
3. "AI DJ reads the room better than humans" (energy visualization)
4. "Rating AI's wedding playlist choices" (reaction content)
5. "Cultural wedding music AI actually gets right" (showcase)

### SEO Target Keywords:
- "AI wedding DJ" (low competition, high intent)
- "wedding playlist generator" (growing searches)
- "create wedding playlist AI" (long tail)
- "wedding music AI" (emerging term)
- "[Culture] wedding playlist generator" (targeted)

### Influencer Partnerships:
- Wedding planners on Instagram
- DJ TikTokers (show them the tool)
- Cultural wedding accounts
- Budget wedding communities

---

## Monetization Experiments

### Pricing Tests:
- A: £29 one-time (control)
- B: £19 early bird
- C: £39 with extras
- D: £9.99/month until wedding

### Upsell Opportunities:
1. Multiple playlists (ceremony, reception, after-party)
2. Printed materials for venue
3. "DJ Handoff Package" - professional notes
4. Guest app access
5. Playlist updates until wedding day

---

## Success Metrics Week by Week

### Week 1:
- [ ] 100 playlists generated
- [ ] <60 second generation time
- [ ] 80% complete onboarding
- [ ] 10% try customization

### Week 2:
- [ ] 500 playlists generated
- [ ] 15% conversion rate
- [ ] 30% use AI chat
- [ ] 4.0+ satisfaction

### Week 3:
- [ ] 1000 playlists generated
- [ ] 20% conversion rate
- [ ] 50% share with guests
- [ ] First viral moment

### Month 1:
- [ ] 5000 playlists
- [ ] £5k revenue
- [ ] 100+ reviews
- [ ] Media coverage