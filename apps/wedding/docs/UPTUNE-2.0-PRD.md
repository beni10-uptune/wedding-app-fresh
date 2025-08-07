# UpTune 2.0 Product Requirements Document

## Product Overview

### Vision
The world's simplest wedding music solution. Push button, get perfect playlist, done.

### Product Philosophy
"So simple that drunk bridesmaids can use it at 2 AM"

### Success Criteria
- 5 seconds to first music preview
- 25% email capture rate
- 7% visitor-to-paid conversion
- 30-second complete flow
- 4.5+ star average rating

---

## User Personas

### Primary: "Modern Molly" (60% of users)
- 28-35 years old, tech-savvy professional
- Planning wedding while working full-time
- Values efficiency and modern solutions
- Trusts AI, uses ChatGPT regularly
- Budget: £15,000-30,000 total wedding

### Secondary: "Budget Ben" (25% of users)
- 25-32 years old, DIY approach
- Total wedding budget under £10,000
- Can't afford professional DJ
- Needs professional results on a budget
- Very price sensitive

### Tertiary: "Cultural Priya" (15% of users)
- 26-35 years old, planning fusion wedding
- Needs to blend multiple cultures
- Family expectations are important
- Wants modern + traditional
- Specific music requirements

---

## User Journey Map

### 1. Discovery
**Entry Points:**
- Google: "wedding playlist generator", "wedding music AI"
- Social: TikTok/Instagram wedding content
- Referral: Friend shared their playlist

**Landing Page Hook:**
"What's your wedding vibe?"
[4 BIG BUTTONS - INSTANT START]

### 2. Instant Flow (Target: <30 seconds)

#### Screen 1: Vibe Selection (3 seconds)
```
"What's your wedding vibe?"

[Romantic & Classic] [Modern & Fun]
[Rustic & Chill] [Party All Night]

*Click = Instant music preview starts*
```

#### Screen 2: Quick Preferences (10 seconds)
```
"Perfect! What music do you love?"

Tap your favorites:
[Pop] [Rock] [Country] [Hip-Hop] [R&B]
[Indie] [Electronic] [Classic] [Latin]

Got a playlist? (optional)
[Paste Spotify URL _______]

[Generate My Playlist →]
```

#### Screen 3: Your Vibe (10 seconds)
```
What's your wedding style?

[Classic & Elegant] ✨
"Timeless, sophisticated, romantic"

[Modern & Fun] 🎉
"Current hits, high energy, dance focus"

[Rustic & Relaxed] 🌿
"Acoustic, indie, laid-back vibes"

[Cultural Fusion] 🌍
"Blend traditions with modern"

[Next]
```

#### Screen 4: Guest Demographics (10 seconds)
```
Tell me about your guests:

Age Range:
[20s-30s] [Mixed Ages] [40s+]

They'll Love:
[✓] Current Hits
[✓] Classic Bangers
[✓] Cultural Music
[✓] Indie Vibes

[Next]
```

#### Screen 5: Special Touches (10 seconds)
```
Any must-haves? (Optional)

🎵 Your Song: [________________]
🚫 Never Play: [________________]
🌍 Cultural Background: [________________]
💭 Other Notes: [________________]

[Create My Playlist!]
```

#### Screen 3: Instant Preview (immediate)
```
"Here's a taste of your wedding..."

🎵 First Dance: "Perfect" - Ed Sheeran [▶️]
🥂 Cocktail: "Uptown Funk" - Bruno Mars [▶️]
🍽️ Dinner: "Thinking Out Loud" - Ed Sheeran [▶️]
💃 Party: "Mr. Brightside" - The Killers [▶️]
🌙 Last Dance: "Closing Time" - Semisonic [▶️]

[See All 150 Songs FREE →]
```

### 3. Email Capture (Strategic Gate)

```
"Get your complete wedding playlist"

[Email: ___________]
[See My Full Playlist]

✓ All 150 songs instantly
✓ 30-second previews
✓ Share with partner
✓ No credit card required
```

### 4. Full Reveal with Education

```
"Your Complete Wedding Playlist ✨"

[Beautiful timeline with all songs visible]

🎵 Ceremony (20 min)
"We start with calming instrumentals at 60 BPM for
processional, building to emotional peak for vows..."
[5 songs with previews]

🥂 Cocktail Hour (60 min) 
"Here we blend generations - 60s classics to today's
hits, keeping energy upbeat but not overwhelming..."
[18 songs with previews]

🍽️ Dinner (90 min)
"BPM drops to 100-110 for conversation. We've woven
in 3 songs from your playlist marked with 💕..."
[25 songs with previews]

💃 Party (3 hours)
"Starting at 115 BPM, building to 128 at peak. 
Strategic throwbacks every 4 songs to keep all ages dancing..."
[60 songs with previews]

[Customize Everything - $39]
```

### 4. AI DJ Chat Interface

```
Your AI DJ 🎵
"I've created your perfect wedding playlist! 
Want to make any changes? Just tell me."

Suggestions:
- "Make dinner music more jazzy"
- "Add some 90s throwbacks"
- "More [Artist Name]"
- "Less electronic music"

[Type your request...]
```

Example Interactions:
```
User: "Can you add more Bollywood for my Indian relatives?"
AI DJ: "Absolutely! I'll add some crowd-pleasing Bollywood hits 
during cocktail hour and create a special 20-minute Bollywood 
dance set during the party. Here are my suggestions..."

User: "The party section needs more energy"
AI DJ: "Let's amp it up! I'm adding more high-energy bangers 
and creating better build-ups. Check out the new flow..."
```

### 5. Customization Tools

#### Energy Flow Visualizer
```
[Visual graph showing energy levels throughout the night]
- Drag to adjust energy levels
- AI rebalances songs automatically
```

#### Moment Editor
```
Cocktail Hour (60 minutes)
⚡ Energy: [Slider: Chill ----o--- Upbeat]
🎵 Genre Mix:
  - Pop: 40% [Adjust]
  - Jazz: 30% [Adjust]
  - Classics: 30% [Adjust]

[Regenerate This Section]
```

#### Guest Requests Portal
```
Share this link with guests:
uptune.wedding/emma-james-2024

Guests see:
"Help Emma & James build their playlist!
Pick 3 songs you'd love to hear:"

[Curated suggestions based on wedding style]
[Search for specific songs]
[Submit]
```

---

## Core Features

### 1. AI Playlist Generation

#### Technical Requirements:
- Complete playlist in <10 seconds
- Minimum 100 songs for full wedding
- Each song includes explanation
- Spotify track IDs required
- BPM and key information

#### AI Prompt Framework:
```
Wedding Context:
- Date: {date} (season awareness)
- Venue: {type} (acoustic considerations)  
- Guest Count: {size} (energy needs)
- Style: {vibe} (genre preferences)
- Demographics: {ages} (song selection)
- Cultural: {background} (special additions)
- Must Play: {songs} (incorporate naturally)
- Never Play: {artists/songs} (strict filter)

Generate complete wedding playlist with:
1. Proper moment structure
2. Energy flow progression
3. Genre variety
4. Generational appeal
5. Cultural sensitivity
6. Mix compatibility (BPM/key)
```

### 2. Smart Moment Structure

#### Default Timeline:
- **Prelude** (30 min): Guest arrival
- **Ceremony** (20 min): Processional to recessional
- **Cocktail** (60 min): Mingling music
- **Dinner** (90 min): Background ambiance
- **Special Dances** (15 min): First dance, parent dances
- **Party** (3 hours): Dance floor hits
- **Last Dance** (5 min): Send-off song

#### Customizable Options:
- Add/remove moments
- Adjust durations
- Cultural additions (Hora, Sangeet, etc.)
- Special segments (Anniversary dance, etc.)

### 3. Cultural Intelligence

#### Supported Cultures (Launch):
- American (by region)
- British/Irish
- Indian (North/South)
- Jewish
- Latino/Hispanic
- African American
- East Asian

#### Cultural Features:
- Traditional song suggestions
- Moment customization
- Language preferences
- Religious considerations
- Family-friendly filters

### 4. Guest Participation

#### Guest Request Flow:
1. Couple shares unique link
2. Guests see curated options
3. Can search for specific songs
4. Vote on others' suggestions
5. Couple has final approval

#### Smart Filtering:
- Age-appropriate suggestions
- Energy level matching
- Explicit content filtering
- Duplicate prevention

### 5. Export Capabilities

#### Spotify Export:
- One-click playlist creation
- Proper track ordering
- Crossfade settings
- Collaborative playlist option

#### DJ Handoff:
- PDF with all songs, BPM, key
- Mixing notes and transitions
- Energy flow visualization
- Alternative song options

#### Other Formats:
- Apple Music (coming soon)
- CSV download
- Printed song lists
- QR codes for sharing

---

## Design System

### Visual Identity:
- **Primary**: Purple gradient (#8B5CF6 → #EC4899)
- **Secondary**: Deep purple (#1F2937)
- **Accent**: Gold (#FCD34D)
- **Success**: Green (#10B981)

### UI Components:

#### Magic Moments:
- Particle animations during AI generation
- Smooth transitions between sections
- Celebratory animations on completion
- Musical note floating animations

#### Cards:
```
Song Card:
┌─────────────────────────┐
│ 🎵 Song Title           │
│ Artist Name             │
│ ─────────────────────── │
│ Why chosen: Perfect     │
│ tempo for...            │
│ BPM: 120 | Key: C      │
└─────────────────────────┘
```

#### Progress Indicators:
- Stepped progress for onboarding
- Circular progress for AI generation
- Timeline scrubber for playlist

---

## Technical Architecture

### Frontend:
- Next.js 15 (existing)
- Framer Motion for animations
- Real-time updates with AI streaming

### AI Integration:
```typescript
interface AIRequest {
  weddingContext: WeddingContext
  preferences: UserPreferences
  constraints: PlaylistConstraints
}

interface AIResponse {
  playlist: Song[]
  reasoning: Map<string, string>
  alternates: Map<string, Song[]>
  stats: PlaylistStatistics
}
```

### Database Schema:
```typescript
// New collections needed
interface GeneratedPlaylist {
  id: string
  userId: string
  weddingId: string
  context: WeddingContext
  songs: PlaylistSong[]
  aiVersion: string
  createdAt: Timestamp
  stats: {
    totalDuration: number
    energyProfile: number[]
    genreDistribution: Record<string, number>
  }
}

interface PlaylistSong {
  spotifyId: string
  position: number
  moment: WeddingMoment
  reasoning: string
  energy: number
  bpm: number
  key: string
  alternatives: string[]
}
```

### API Endpoints:
- `POST /api/ai/generate-playlist` - Initial generation
- `POST /api/ai/refine-playlist` - Chat refinements
- `GET /api/ai/suggestions` - Smart suggestions
- `POST /api/playlist/export` - Export functions

---

## Analytics & Tracking

### Key Events:
- `ai_generation_started`
- `ai_generation_completed`
- `playlist_customized`
- `ai_chat_interaction`
- `playlist_exported`
- `guest_request_submitted`

### Conversion Funnel:
1. Landing page view
2. Started onboarding
3. Completed questions
4. Viewed generated playlist
5. Interacted with playlist
6. Converted to paid

---

## Launch Strategy

### MVP Features (Week 1-2):
- 5-question onboarding
- Basic AI generation
- Spotify export
- Simple customization

### V2 Features (Week 3-4):
- AI chat interface
- Guest requests
- Cultural options
- Energy visualization

### V3 Features (Week 5-6):
- Advanced customization
- Multiple playlist types
- DJ handoff features
- Social sharing

---

## Success Metrics

### Week 1 Goals:
- 100 playlists generated
- 60-second average generation
- 10% conversion rate

### Month 1 Goals:
- 1,000 playlists generated
- 15% conversion rate
- 4.0+ user rating
- 50% week-1 retention

### Month 3 Goals:
- 10,000 playlists generated
- 20% conversion rate
- 4.5+ user rating
- Viral coefficient >1.2

---

## Risk Management

### Technical Risks:
- **Spotify API limits**: Cache popular songs
- **AI response time**: Pre-generate common patterns
- **Cost per generation**: Optimize prompts, use caching

### User Experience Risks:
- **"Too generic"**: Deep personalization, show reasoning
- **"Don't trust AI"**: Expert positioning, social proof
- **Choice paralysis**: Guided customization, smart defaults

### Business Risks:
- **Low conversion**: Test pricing, improve value prop
- **High churn**: Focus on wedding date retention
- **Competitor copying**: Build moat with data, UX

---

## Appendix: Example AI Outputs

### Sample Ceremony Playlist:
```
1. Prelude: "River Flows in You" - Yiruma
   Why: Calming, sets romantic mood, 4 mins perfect for seating

2. Processional: "Canon in D" - Pachelbel
   Why: Classic choice, perfect tempo, recognizable

3. Bride Entrance: "A Thousand Years" - Christina Perri
   Why: Modern classic, emotional, requested by 73% of brides

4. Unity Ceremony: "Marry Me" - Train
   Why: Meaningful lyrics, right duration, uplifting

5. Recessional: "Signed, Sealed, Delivered" - Stevie Wonder
   Why: Celebratory, upbeat, great transition to cocktails
```

### Sample Energy Flow:
```
Prelude:     ▁▁▂▂ (Calm, welcoming)
Ceremony:    ▁▁▁▂ (Romantic, emotional)
Cocktail:    ▃▄▄▅ (Social, upbeat)
Dinner:      ▃▃▂▂ (Background, pleasant)
First Dance: ▂▃▃▂ (Romantic spotlight)
Party:       ▅▆▇█ (Building energy)
Peak Party:  ████ (Maximum energy)
Wind Down:   ▆▅▃▂ (Cool down)
Last Dance:  ▃▄▃▁ (Emotional finale)
```