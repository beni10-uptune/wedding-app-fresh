# Uptune 2.0 Technical Implementation Guide

## 🎯 Implementation Priority & Timeline

### Week 1: Core MVP (Must Have)
- AI DJ persona integration
- Couple's song capture
- Real-time preview system
- Basic AI generation
- Timeline visualization

### Week 2: Enhanced Experience
- Progressive value reveal
- Guest demographics
- Venue intelligence
- Chat refinements

### Week 3: Conversion Optimization  
- Pricing strategy
- Export features
- Analytics tracking
- A/B testing framework

---

## 🏗️ Technical Architecture Updates

### New Data Models

```typescript
// types/wedding-ai.ts

interface DJPersona {
  name: 'DJ Harmony' | 'Spin Doctor' | 'Mix Master Mo' | 'Beatrix';
  avatar: string;
  personality: {
    greeting: string;
    style: 'friendly' | 'professional' | 'quirky';
    catchphrases: string[];
  };
}

interface OnboardingSession {
  id: string;
  startedAt: Date;
  completedAt?: Date;
  currentStep: number;
  
  // Captured data
  coupleNames: {
    partner1: string;
    partner2?: string;
  };
  
  couplesSong?: {
    spotifyId: string;
    title: string;
    artist: string;
    usage: 'first_dance' | 'last_song' | 'both';
  };
  
  vibe: 'classic' | 'modern' | 'rustic' | 'cultural';
  
  venue: {
    type: 'beach' | 'garden' | 'ballroom' | 'barn' | 'other';
    customDescription?: string;
    acousticConsiderations: string[];
  };
  
  guests: {
    count: number;
    ageRange: 'young' | 'mixed' | 'mature';
    musicPreferences: string[];
  };
  
  // Real-time previews shown
  previewsPlayed: {
    songId: string;
    timestamp: Date;
    reaction?: 'love' | 'skip';
  }[];
  
  // Conversion tracking
  valuePointsDelivered: string[];
  conversionEvents: {
    event: string;
    timestamp: Date;
  }[];
}

interface AIGenerationContext {
  sessionId: string;
  coupleNames: string;
  couplesSong?: SongDetails;
  vibe: string;
  venue: VenueDetails;
  guests: GuestDemographics;
  culturalElements?: string[];
  mustPlay?: string[];
  neverPlay?: string[];
  
  // New: Progressive generation
  generationMode: 'full' | 'preview' | 'refinement';
  previousVersionId?: string;
}

interface GeneratedPlaylist {
  id: string;
  sessionId: string;
  version: number;
  
  // Core playlist data
  songs: PlaylistSong[];
  moments: WeddingMoment[];
  
  // New: Value tracking
  valueMetrics: {
    personalizedElements: number;
    culturalMatches: number;
    guestAppropriateness: number;
    venueOptimization: number;
    energyBalance: number;
  };
  
  // New: DJ personality
  djCommentary: {
    [momentId: string]: string;
  };
  
  stats: {
    totalDuration: number;
    totalSongs: number;
    genreDistribution: Record<string, number>;
    energyProfile: number[];
    generationTimeMs: number;
  };
}
```

---

## 🎨 Component Implementation

### 1. DJ Persona Component

```typescript
// components/ai-dj/DJPersona.tsx

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface DJPersonaProps {
  message?: string;
  isThinking?: boolean;
  mood?: 'excited' | 'thoughtful' | 'celebrating';
}

export function DJPersona({ message, isThinking, mood = 'excited' }: DJPersonaProps) {
  const [displayText, setDisplayText] = useState('');
  
  // Typewriter effect for messages
  useEffect(() => {
    if (!message) return;
    
    let index = 0;
    const timer = setInterval(() => {
      setDisplayText(message.slice(0, index));
      index++;
      if (index > message.length) clearInterval(timer);
    }, 30);
    
    return () => clearInterval(timer);
  }, [message]);
  
  return (
    <div className="flex items-start gap-4 p-4">
      <motion.div
        className="relative"
        animate={{
          y: isThinking ? [0, -5, 0] : 0,
        }}
        transition={{
          repeat: isThinking ? Infinity : 0,
          duration: 1.5,
        }}
      >
        <img 
          src="/dj-harmony-avatar.svg" 
          alt="DJ Harmony"
          className="w-16 h-16 rounded-full"
        />
        {isThinking && (
          <div className="absolute -bottom-1 -right-1">
            <div className="flex gap-1">
              {[0, 0.2, 0.4].map((delay, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-purple-500 rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1,
                    delay,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </motion.div>
      
      <div className="flex-1">
        <div className="font-semibold text-purple-600 mb-1">
          DJ Harmony 🎧
        </div>
        <motion.div 
          className="bg-purple-50 rounded-2xl rounded-tl-sm px-4 py-3"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <p className="text-gray-800">{displayText}</p>
        </motion.div>
      </div>
    </div>
  );
}
```

### 2. Couple's Song Input

```typescript
// components/onboarding/CouplesSongInput.tsx

import { useState, useCallback } from 'react';
import { SpotifySearch } from '@/components/spotify/SpotifySearch';
import { motion, AnimatePresence } from 'framer-motion';

interface CouplesSongInputProps {
  onSelect: (song: any, usage: string[]) => void;
  onSkip: () => void;
}

export function CouplesSongInput({ onSelect, onSkip }: CouplesSongInputProps) {
  const [selectedSong, setSelectedSong] = useState<any>(null);
  const [usage, setUsage] = useState<string[]>(['first_dance']);
  
  const handleSongSelect = useCallback((song: any) => {
    setSelectedSong(song);
    
    // Auto-play preview
    if (song.preview_url) {
      const audio = new Audio(song.preview_url);
      audio.volume = 0.3;
      audio.play();
      
      // Cleanup
      return () => audio.pause();
    }
  }, []);
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">
          Every great love story has a song.
        </h2>
        <p className="text-xl text-gray-600">What's yours?</p>
      </div>
      
      <div className="max-w-lg mx-auto">
        <SpotifySearch
          placeholder="Search for your special song..."
          onSelect={handleSongSelect}
          showAlbumArt
          autoFocus
        />
      </div>
      
      <AnimatePresence>
        {selectedSong && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6"
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src={selectedSong.album.images[0]?.url}
                alt={selectedSong.album.name}
                className="w-20 h-20 rounded-lg shadow-lg"
              />
              <div>
                <h3 className="font-bold text-lg">{selectedSong.name}</h3>
                <p className="text-gray-600">{selectedSong.artists[0].name}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="font-medium text-gray-700">
                Beautiful choice! I see this going perfectly as your...
              </p>
              <label className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer hover:bg-purple-50 transition">
                <input
                  type="checkbox"
                  checked={usage.includes('first_dance')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setUsage([...usage, 'first_dance']);
                    } else {
                      setUsage(usage.filter(u => u !== 'first_dance'));
                    }
                  }}
                  className="w-5 h-5 text-purple-600"
                />
                <span>First Dance 💕</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer hover:bg-purple-50 transition">
                <input
                  type="checkbox"
                  checked={usage.includes('last_song')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setUsage([...usage, 'last_song']);
                    } else {
                      setUsage(usage.filter(u => u !== 'last_song'));
                    }
                  }}
                  className="w-5 h-5 text-purple-600"
                />
                <span>Last Song of the Night 🌙</span>
              </label>
            </div>
            
            <button
              onClick={() => onSelect(selectedSong, usage)}
              className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition"
            >
              Continue →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {!selectedSong && (
        <button
          onClick={onSkip}
          className="text-gray-500 underline text-sm"
        >
          Skip for now
        </button>
      )}
    </div>
  );
}
```

### 3. Real-Time Preview System

```typescript
// components/onboarding/VibeSelector.tsx

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface VibeSelectorProps {
  onSelect: (vibe: string) => void;
  onPreviewReaction: (song: any, reaction: string) => void;
}

const VIBE_OPTIONS = [
  {
    id: 'classic',
    label: 'Elegant & Classic',
    description: 'Timeless',
    previewSongs: [
      { id: '1', title: 'Perfect', artist: 'Ed Sheeran' },
      { id: '2', title: 'At Last', artist: 'Etta James' },
      { id: '3', title: 'Make You Feel My Love', artist: 'Adele' },
    ],
  },
  {
    id: 'modern',
    label: 'Modern & Fun',
    description: 'Trendsetting',
    previewSongs: [
      { id: '4', title: 'Good 4 U', artist: 'Olivia Rodrigo' },
      { id: '5', title: 'Levitating', artist: 'Dua Lipa' },
      { id: '6', title: 'Flowers', artist: 'Miley Cyrus' },
    ],
  },
  // ... more vibes
];

export function VibeSelector({ onSelect, onPreviewReaction }: VibeSelectorProps) {
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  const [currentPreview, setCurrentPreview] = useState<any>(null);
  const [previewIndex, setPreviewIndex] = useState(0);
  
  useEffect(() => {
    if (!selectedVibe) return;
    
    const vibe = VIBE_OPTIONS.find(v => v.id === selectedVibe);
    if (!vibe) return;
    
    // Start playing previews
    const timer = setInterval(() => {
      const song = vibe.previewSongs[previewIndex];
      setCurrentPreview(song);
      setPreviewIndex((prev) => (prev + 1) % vibe.previewSongs.length);
    }, 3000);
    
    return () => clearInterval(timer);
  }, [selectedVibe, previewIndex]);
  
  const handleVibeClick = (vibeId: string) => {
    setSelectedVibe(vibeId);
    setPreviewIndex(0);
    
    // Immediately show feedback
    setTimeout(() => {
      const vibe = VIBE_OPTIONS.find(v => v.id === vibeId);
      if (vibe) {
        setCurrentPreview(vibe.previewSongs[0]);
      }
    }, 100);
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">
          What's the vibe for your big day?
        </h2>
      </div>
      
      <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
        {VIBE_OPTIONS.map((vibe) => (
          <motion.button
            key={vibe.id}
            onClick={() => handleVibeClick(vibe.id)}
            className={`p-6 rounded-xl border-2 transition-all ${
              selectedVibe === vibe.id
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-purple-300'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-xl font-bold mb-1">{vibe.label}</div>
            <div className="text-sm text-gray-600">{vibe.description}</div>
          </motion.button>
        ))}
      </div>
      
      {selectedVibe && currentPreview && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">
                Here's a taste of what I'm thinking...
              </p>
              <div className="flex items-center gap-2">
                <span className="text-2xl">♪</span>
                <div>
                  <div className="font-bold">{currentPreview.title}</div>
                  <div className="text-sm text-gray-600">{currentPreview.artist}</div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onPreviewReaction(currentPreview, 'love')}
                className="p-2 bg-white rounded-lg hover:bg-green-50"
              >
                ❤️
              </button>
              <button
                onClick={() => onPreviewReaction(currentPreview, 'skip')}
                className="p-2 bg-white rounded-lg hover:bg-red-50"
              >
                👎
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm text-gray-600">Coming up:</div>
            {VIBE_OPTIONS.find(v => v.id === selectedVibe)?.previewSongs
              .slice(previewIndex + 1, previewIndex + 3)
              .map((song, i) => (
                <div key={song.id} className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">♪</span>
                  <span>{song.title} - {song.artist}</span>
                </div>
              ))}
          </div>
          
          <button
            onClick={() => onSelect(selectedVibe)}
            className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold"
          >
            Love it! Continue →
          </button>
        </motion.div>
      )}
    </div>
  );
}
```

### 4. Progressive Value Reveal

```typescript
// components/onboarding/ProgressiveValueReveal.tsx

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ValuePoint {
  id: string;
  icon: string;
  title: string;
  description: string;
  triggerStep: number;
}

const VALUE_POINTS: ValuePoint[] = [
  {
    id: 'personal',
    icon: '💕',
    title: 'Personalized for You',
    description: 'Every song chosen for YOUR wedding',
    triggerStep: 1,
  },
  {
    id: 'instant',
    icon: '⚡',
    title: 'Instant Results',
    description: 'Full playlist in 60 seconds',
    triggerStep: 2,
  },
  {
    id: 'expert',
    icon: '🎧',
    title: 'DJ Expertise',
    description: '10,000+ weddings of experience',
    triggerStep: 3,
  },
  {
    id: 'guests',
    icon: '👥',
    title: 'Guest Approved',
    description: 'Music everyone will love',
    triggerStep: 4,
  },
  {
    id: 'perfect',
    icon: '✨',
    title: 'Perfectly Timed',
    description: 'Every moment planned',
    triggerStep: 5,
  },
];

export function ProgressiveValueReveal({ currentStep }: { currentStep: number }) {
  const [shownValues, setShownValues] = useState<string[]>([]);
  
  useEffect(() => {
    const newValues = VALUE_POINTS
      .filter(v => v.triggerStep <= currentStep)
      .map(v => v.id);
    setShownValues(newValues);
  }, [currentStep]);
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {VALUE_POINTS.filter(v => shownValues.includes(v.id)).map((value, index) => (
          <motion.div
            key={value.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              x: 0, 
              scale: 1,
              transition: { delay: index * 0.1 }
            }}
            exit={{ opacity: 0, x: 100 }}
            className="bg-white shadow-lg rounded-lg p-3 mb-2 flex items-center gap-3"
          >
            <span className="text-2xl">{value.icon}</span>
            <div>
              <div className="font-semibold text-sm">{value.title}</div>
              <div className="text-xs text-gray-600">{value.description}</div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
```

---

## 🔥 AI Prompt Engineering

### Enhanced Playlist Generation Prompt

```typescript
// lib/ai/prompts.ts

export function generateEnhancedPlaylistPrompt(context: AIGenerationContext): string {
  return `
You are DJ Harmony, an expert AI Wedding DJ with experience from 10,000+ weddings.
You're friendly, knowledgeable, and genuinely excited about creating the perfect soundtrack.

COUPLE INFORMATION:
- Names: ${context.coupleNames}
- Their Special Song: "${context.couplesSong?.title}" by ${context.couplesSong?.artist}
  * Use for: ${context.couplesSong?.usage.join(' and ')}
- Wedding Vibe: ${context.vibe}
- Venue: ${context.venue.type} (${context.venue.acousticConsiderations.join(', ')})
- Guest Count: ${context.guests.count}
- Guest Ages: ${context.guests.ageRange}
- Music Preferences: ${context.guests.musicPreferences.join(', ')}

GENERATION REQUIREMENTS:

1. STRUCTURE (Follow exactly):
   - Prelude (30 min): 8-10 songs for guest arrival
   - Ceremony (20 min): 5-6 songs including processional
   - Cocktail Hour (60 min): 15-18 upbeat social songs
   - Dinner (90 min): 20-25 background songs
   - Special Dances (15 min): Include couple's song + parent dances
   - Party - Building (60 min): 15-20 songs building energy
   - Party - Peak (90 min): 25-30 maximum energy songs
   - Party - Wind Down (30 min): 8-10 cooling down songs
   - Last Dance (5 min): 1-2 closing songs (consider couple's song here too)

2. SONG SELECTION CRITERIA:
   - Venue Appropriate: ${context.venue.type === 'garden' ? 'Songs that sound great outdoors, avoid heavy bass' : 'Full range appropriate'}
   - Guest Appropriate: Mix songs for ${context.guests.ageRange} crowd
   - Energy Flow: Smooth transitions, natural build-ups
   - Cultural Sensitivity: Family-friendly versions when needed
   - Mix Compatibility: Consider BPM and key for DJ mixing

3. FOR EACH SONG PROVIDE:
{
  "spotifyId": "spotify:track:xxxxx",
  "title": "Song Name",
  "artist": "Artist Name",
  "moment": "cocktail",
  "energy": 1-10,
  "bpm": number,
  "key": "C major",
  "reasoning": "Chosen because...",
  "djNote": "Mix well from previous song using..."
}

4. DJ PERSONALITY NOTES:
   - Add personal commentary for key moments
   - Explain why certain songs work for THIS couple
   - Point out special touches and thoughtful choices
   - Be enthusiastic but professional

5. SPECIAL INSTRUCTIONS:
   - The couple's song "${context.couplesSong?.title}" MUST appear in: ${context.couplesSong?.usage.join(' and ')}
   - Include songs from these genres: ${context.guests.musicPreferences.join(', ')}
   - Energy should match ${context.vibe} vibe throughout
   - Consider ${context.venue.type} venue acoustics

Return as JSON with this structure:
{
  "playlist": [array of songs],
  "moments": {
    "prelude": { "songs": [], "djCommentary": "..." },
    "ceremony": { "songs": [], "djCommentary": "..." },
    // ... etc
  },
  "stats": {
    "totalSongs": number,
    "totalDuration": minutes,
    "averageEnergy": number,
    "genreBreakdown": {}
  },
  "djMessage": "Personal message to the couple about their playlist"
}
`;
}
```

---

## 📊 Analytics Implementation

### Event Tracking

```typescript
// lib/analytics/events.ts

export const OnboardingEvents = {
  // Funnel tracking
  ONBOARDING_STARTED: 'onboarding_started',
  STEP_COMPLETED: 'onboarding_step_completed',
  COUPLE_SONG_ADDED: 'couple_song_added',
  VIBE_SELECTED: 'vibe_selected',
  PREVIEW_PLAYED: 'preview_song_played',
  PREVIEW_REACTION: 'preview_song_reaction',
  GENERATION_STARTED: 'playlist_generation_started',
  GENERATION_COMPLETED: 'playlist_generation_completed',
  
  // Value delivery tracking
  VALUE_POINT_SHOWN: 'value_point_shown',
  VALUE_POINT_ACKNOWLEDGED: 'value_point_acknowledged',
  
  // Engagement tracking
  PLAYLIST_VIEWED: 'playlist_viewed',
  SONG_PLAYED: 'song_played',
  CHAT_OPENED: 'ai_chat_opened',
  CHAT_MESSAGE_SENT: 'ai_chat_message_sent',
  CUSTOMIZATION_MADE: 'playlist_customized',
  
  // Conversion tracking
  PRICING_VIEWED: 'pricing_viewed',
  PLAN_SELECTED: 'plan_selected',
  CONVERSION_COMPLETED: 'conversion_completed',
  
  // Quality metrics
  TIME_TO_WOW: 'time_to_wow_moment',
  SONGS_KEPT_RATIO: 'ai_songs_kept_ratio',
};

export function trackOnboardingStep(step: number, data: any) {
  // Google Analytics 4
  gtag('event', OnboardingEvents.STEP_COMPLETED, {
    step_number: step,
    step_name: getStepName(step),
    time_on_step: data.timeSpent,
    ...data,
  });
  
  // Amplitude or Mixpanel
  amplitude.track(OnboardingEvents.STEP_COMPLETED, {
    step,
    ...data,
  });
  
  // Internal metrics
  saveMetrics({
    event: OnboardingEvents.STEP_COMPLETED,
    step,
    timestamp: new Date(),
    sessionId: getSessionId(),
    data,
  });
}
```

---

## 🚀 Deployment Strategy

### Phase 1: Internal Testing (Week 1)
- Deploy to staging environment
- Test with team members
- Collect initial feedback
- Fix critical bugs

### Phase 2: Beta Launch (Week 2)
- 10% of traffic sees new flow
- A/B test DJ names
- Monitor conversion metrics
- Iterate based on data

### Phase 3: Full Rollout (Week 3)
- 100% traffic on new flow
- Launch marketing campaign
- Monitor all metrics
- Continuous optimization

---

## 🎯 Success Metrics & KPIs

### Target Metrics (Month 1)
- **Onboarding Completion**: 80% (from 60%)
- **Time to Playlist**: <60 seconds
- **Free to Paid Conversion**: 25% (from 15%)
- **Songs Kept**: 70%+ of AI suggestions
- **Return Rate**: 40% within 48 hours
- **NPS Score**: 8.5+

### A/B Tests to Run
1. DJ Name variants
2. Pricing: £29 vs £39 vs £49
3. Free songs: 10 vs 20 vs 30
4. Couple's song: Required vs Optional
5. Preview songs: Auto-play vs Manual
6. Price reveal: After playlist vs During exploration

---

## 🔧 Technical Checklist

### Before Launch
- [ ] Implement DJ Harmony persona across app
- [ ] Add couple's song to onboarding
- [ ] Build real-time preview system
- [ ] Create value reveal animations
- [ ] Implement progressive playlist generation
- [ ] Add analytics tracking
- [ ] Set up A/B testing framework
- [ ] Create fallback for AI failures
- [ ] Load test AI generation
- [ ] Optimize for mobile
- [ ] Add progress saving
- [ ] Implement chat system
- [ ] Build export features
- [ ] Add social sharing
- [ ] Create email sequences

---

*"Ship fast, measure everything, iterate based on data."*