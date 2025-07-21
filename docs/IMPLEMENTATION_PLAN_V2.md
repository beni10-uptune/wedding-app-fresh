# Uptune Weddings v2.0 Implementation Plan

## Overview
This document outlines the implementation strategy for transforming the current wedding playlist app into the comprehensive three-panel system described in PRD v2.0.

## Phase 1: Database & Core Infrastructure (Week 1)

### 1.1 Database Schema Updates

#### New Collections
```typescript
// Firestore Collections

// Curated Song Collections
collections/{collectionId}
{
  id: string;
  name: string;
  icon: string;
  description: string;
  moment: WeddingMoment;
  songIds: string[];
  stats: {
    totalSongs: number;
    avgRating: number;
    timesUsed: number;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Song Library (Curated)
songs/{songId}
{
  id: string; // Spotify ID
  title: string;
  artist: string;
  album?: string;
  duration: number; // seconds
  bpm?: number;
  energyLevel: 1-5;
  explicit: boolean;
  generationAppeal: string[]; // ['boomer', 'gen_x', 'millennial', 'gen_z']
  genres: string[];
  previewUrl?: string;
  spotifyUri: string;
  audioFeatures?: {
    danceability: number;
    energy: number;
    valence: number; // happiness
    acousticness: number;
  };
}

// Guest Submissions
weddings/{weddingId}/guestSubmissions/{submissionId}
{
  id: string;
  guestEmail: string;
  guestName?: string;
  songSpotifyId: string;
  songTitle: string;
  songArtist: string;
  message?: string;
  submittedAt: Timestamp;
  status: 'pending' | 'approved' | 'rejected';
  votes?: number;
}

// Wedding Timeline (Updated)
weddings/{weddingId}/timeline/{momentId}
{
  id: string;
  name: string;
  order: number;
  duration: number; // minutes
  songs: Array<{
    id: string;
    spotifyId: string;
    title: string;
    artist: string;
    duration: number;
    addedBy: 'couple' | 'guest' | 'ai';
    addedAt: Timestamp;
  }>;
}

// Guest Invitations
weddings/{weddingId}/invitations/{invitationId}
{
  id: string;
  email: string;
  name?: string;
  token: string; // Unique access token
  sentAt: Timestamp;
  firstViewedAt?: Timestamp;
  submittedAt?: Timestamp;
  customMessage?: string;
}
```

### 1.2 Wedding Moments Configuration
```typescript
export const WEDDING_MOMENTS = [
  { id: 'prelude', name: 'Prelude', duration: 30, icon: '🎵', description: 'Guest arrival music' },
  { id: 'processional', name: 'Processional', duration: 5, icon: '💐', description: 'Wedding party entrance' },
  { id: 'ceremony', name: 'Ceremony', duration: 20, icon: '💍', description: 'Vows and rings' },
  { id: 'recessional', name: 'Recessional', duration: 5, icon: '🎉', description: 'Exit celebration' },
  { id: 'cocktail', name: 'Cocktail Hour', duration: 60, icon: '🥂', description: 'Mingling music' },
  { id: 'entrance', name: 'Grand Entrance', duration: 5, icon: '🌟', description: 'Reception start' },
  { id: 'dinner', name: 'Dinner', duration: 60, icon: '🍽️', description: 'Meal service' },
  { id: 'firstDance', name: 'First Dance', duration: 4, icon: '❤️', description: "Couple's dance" },
  { id: 'parentDances', name: 'Parent Dances', duration: 8, icon: '👨‍👩‍👧‍👦', description: 'Traditional dances' },
  { id: 'danceFloor', name: 'Dance Floor', duration: 120, icon: '🕺', description: 'Party time' },
  { id: 'lastDance', name: 'Last Dance', duration: 5, icon: '✨', description: 'Send-off' }
];
```

## Phase 2: Three-Panel Dashboard UI (Week 2)

### 2.1 New Component Structure
```
src/app/wedding/[id]/builder/
├── page.tsx                    # Main three-panel layout
├── components/
│   ├── LeftPanel/
│   │   ├── SongSearch.tsx      # Spotify search
│   │   ├── SearchFilters.tsx   # Genre, era, energy filters
│   │   └── SearchResults.tsx   # Search results list
│   ├── CenterPanel/
│   │   ├── PanelTabs.tsx       # Curated/Guests toggle
│   │   ├── CuratedView/
│   │   │   ├── CollectionGrid.tsx
│   │   │   ├── CollectionCard.tsx
│   │   │   └── AIAssistant.tsx
│   │   └── GuestView/
│   │       ├── SubmissionList.tsx
│   │       ├── SubmissionCard.tsx
│   │       └── SubmissionStats.tsx
│   └── RightPanel/
│       ├── Timeline.tsx         # Main timeline
│       ├── MomentSection.tsx    # Individual moment
│       ├── SongCard.tsx         # Draggable song
│       └── ExportActions.tsx   # Export buttons
```

### 2.2 State Management
```typescript
// Using Zustand for state management
interface BuilderState {
  // Wedding data
  wedding: Wedding;
  
  // Timeline state
  timeline: {
    [momentId: string]: TimelineSong[];
  };
  
  // UI state
  activePanel: 'curated' | 'guests';
  selectedMoment: string | null;
  searchQuery: string;
  searchFilters: {
    genre?: string;
    era?: string;
    energy?: number;
    explicit?: boolean;
  };
  
  // Guest submissions
  submissions: {
    pending: GuestSubmission[];
    approved: GuestSubmission[];
    rejected: GuestSubmission[];
  };
  
  // Actions
  addSongToTimeline: (momentId: string, song: Song) => void;
  removeSongFromTimeline: (momentId: string, songId: string) => void;
  reorderSongs: (momentId: string, fromIndex: number, toIndex: number) => void;
  approveSubmission: (submissionId: string) => void;
  rejectSubmission: (submissionId: string) => void;
}
```

## Phase 3: Core Features Implementation

### 3.1 Curated Collections (Week 3)
- Seed database with 500+ curated songs
- Create collection categories for each moment
- Implement collection browsing UI
- Add drag-and-drop from collections to timeline

### 3.2 Guest Collaboration System (Week 3-4)
- Email invitation system
- Unique token generation for guest access
- Guest submission page (no auth required)
- Submission review interface
- Vote aggregation system

### 3.3 Spotify Integration (Week 4)
- Implement Spotify Web API
- Song search with debouncing
- Audio preview player
- Add to timeline from search

### 3.4 Timeline Builder (Week 4-5)
- Drag-and-drop interface (react-beautiful-dnd)
- Real-time duration calculation
- Energy flow visualization
- Duplicate detection
- Auto-save functionality

## Phase 4: Advanced Features

### 4.1 AI Assistant (Week 5-6)
- OpenAI integration for suggestions
- Energy flow analysis
- Guest preference insights
- Smart mix generation

### 4.2 Export System (Week 6)
- Spotify playlist creation
- PDF generation for DJs
- CSV export
- Timeline visualization

## Technical Considerations

### Performance Optimizations
1. Lazy load song collections
2. Virtual scrolling for large lists
3. Debounced search (300ms)
4. Optimistic UI updates
5. Service worker for offline capability

### Security
1. Row-level security for guest submissions
2. Token-based guest access (no auth required)
3. Rate limiting on API endpoints
4. Input sanitization

### Analytics Events
```typescript
// Key events to track
- 'Builder Opened'
- 'Collection Viewed'
- 'Song Added to Timeline'
- 'Guest Invite Sent'
- 'Submission Approved/Rejected'
- 'Timeline Exported'
- 'AI Suggestion Applied'
```

## Migration Strategy

### For Existing Users
1. Preserve existing playlists
2. Map to new timeline structure
3. Send email about new features
4. Offer tutorial on first login

### Database Migration
1. Create new collections in parallel
2. Migrate existing songs to timeline format
3. Preserve all user data
4. Run migration script

## Testing Plan

### Unit Tests
- Timeline calculations
- Drag-and-drop logic
- Filter functions
- Export formatting

### Integration Tests
- Spotify API integration
- Guest submission flow
- Email sending
- Export generation

### E2E Tests
- Complete wedding setup flow
- Guest submission journey
- Export to Spotify
- Mobile responsiveness

## Rollout Plan

### Week 1-2: Infrastructure
- Database schema updates
- Core API endpoints
- Authentication updates

### Week 3-4: UI Implementation
- Three-panel layout
- Basic timeline functionality
- Search integration

### Week 5-6: Features
- Guest collaboration
- AI assistant
- Export system

### Week 7: Testing & Polish
- Bug fixes
- Performance optimization
- User testing

### Week 8: Launch
- Gradual rollout (10% → 50% → 100%)
- Monitor metrics
- Gather feedback