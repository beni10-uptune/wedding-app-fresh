// Wedding V2 Types - Three Panel System

import { Timestamp } from 'firebase/firestore';

// Wedding Moments
export interface WeddingMoment {
  id: string;
  name: string;
  duration: number; // minutes
  icon: string;
  description: string;
  order: number;
}

// Song Types
export interface Song {
  id: string; // Spotify ID
  title: string;
  artist: string;
  album?: string;
  albumArt?: string; // Album artwork URL
  duration: number; // seconds
  bpm?: number;
  energyLevel: 1 | 2 | 3 | 4 | 5;
  explicit: boolean;
  generationAppeal: ('boomer' | 'gen_x' | 'millennial' | 'gen_z')[];
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

// Timeline Song (song in a specific moment)
export interface TimelineSong {
  id: string;
  spotifyId: string;
  title: string;
  artist: string;
  album?: string;
  albumArt?: string;
  previewUrl?: string;
  duration: number;
  addedBy: 'couple' | 'guest' | 'ai';
  addedAt: Timestamp;
  energy?: number;
  explicit?: boolean;
}

// Curated Collection
export interface SongCollection {
  id: string;
  name: string;
  icon: string;
  description: string;
  moment: string; // moment ID
  songIds: string[];
  stats: {
    totalSongs: number;
    avgRating: number;
    timesUsed: number;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Guest Submission
export interface GuestSubmission {
  id: string;
  weddingId: string;
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

// Guest Invitation
export interface GuestInvitation {
  id: string;
  email: string;
  name?: string;
  token: string;
  sentAt: Timestamp;
  firstViewedAt?: Timestamp;
  submittedAt?: Timestamp;
  customMessage?: string;
}

// Timeline (all moments with songs)
export interface Timeline {
  [momentId: string]: {
    id: string;
    name: string;
    order: number;
    duration: number; // target duration in minutes
    songs: TimelineSong[];
  };
}

// Extended Wedding Type for V2
export interface WeddingV2 {
  id: string;
  coupleNames: string[];
  weddingDate: Timestamp;
  venueType?: 'indoor' | 'outdoor' | 'beach' | 'garden' | 'ballroom' | 'other';
  guestCount?: number;
  owners: string[];
  paymentStatus: 'pending' | 'paid' | 'refunded';
  timeline: Timeline;
  preferences?: {
    avoidExplicit: boolean;
    genres: string[];
    eras: string[];
    energyProfile: 'relaxed' | 'balanced' | 'high-energy';
  };
  stats?: {
    totalSongs: number;
    totalDuration: number; // minutes
    guestSubmissions: number;
    lastUpdated: Timestamp;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// UI State Types
export interface SearchFilters {
  genre?: string;
  era?: string;
  energyLevel?: number;
  explicit?: boolean;
}

export interface BuilderUIState {
  activePanel: 'curated' | 'guests';
  selectedMoment: string | null;
  searchQuery: string;
  searchFilters: SearchFilters;
  isDragging: boolean;
}

// Analytics Events
export interface AnalyticsEvent {
  name: string;
  properties: Record<string, any>;
  timestamp: Timestamp;
}

// Export Types
export interface ExportOptions {
  format: 'spotify' | 'pdf' | 'csv';
  includeDoNotPlay?: boolean;
  includeGuestAnalytics?: boolean;
  groupByMoment?: boolean;
}