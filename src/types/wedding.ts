import { Timestamp } from 'firebase/firestore'

// User types
export interface User {
  id: string
  email: string
  displayName: string
  photoURL?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

// Wedding types
export interface Wedding {
  id: string
  title: string
  coupleNames: string[]
  weddingDate: Timestamp
  venue?: string
  owners: string[] // User IDs of the couple
  collaborators: string[] // User IDs of guests who can suggest songs
  status: 'planning' | 'active' | 'completed'
  paymentStatus: 'pending' | 'paid' | 'refunded'
  paymentId?: string
  slug?: string // Custom URL slug for the wedding
  createdAt: Timestamp
  updatedAt: Timestamp
}

// Music library types
export interface Song {
  id: string
  title: string
  artist: string
  album?: string
  year?: number
  duration?: number // in seconds
  genre: string
  weddingMoment: WeddingMoment
  mood: string[]
  popularity: number // 1-100 scale
  spotifyId?: string
  previewUrl?: string
  imageUrl?: string
  tags: string[]
  createdAt: Timestamp
}

export type WeddingMoment = 
  | 'processional'
  | 'recessional'
  | 'cocktail'
  | 'dinner'
  | 'first-dance'
  | 'parent-dance'
  | 'party'
  | 'last-dance'
  | 'ceremony'
  | 'reception'

// Playlist types
export interface Playlist {
  id: string
  weddingId: string
  name: string
  description?: string
  weddingMoment: WeddingMoment
  songs: PlaylistSong[]
  isPublic: boolean
  createdBy: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface PlaylistSong {
  songId: string
  order: number
  notes?: string
  timing?: string // e.g., "During cake cutting"
  isRequired: boolean
  addedBy: string
  addedAt: Timestamp
}

// Song suggestion types
export interface SongSuggestion {
  id: string
  weddingId: string
  songId?: string // If from curated library
  customSong?: CustomSong // If user-suggested
  spotifyId?: string // Spotify track ID
  suggestedBy: string
  suggestedFor: WeddingMoment
  message?: string
  status: 'pending' | 'approved' | 'rejected'
  votes: number
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface CustomSong {
  title: string
  artist: string
  album?: string
  year?: number
  notes?: string
}

// Vote types
export interface Vote {
  id: string
  suggestionId: string
  userId: string
  value: 1 | -1 // upvote or downvote
  createdAt: Timestamp
}

// Invitation types
export interface Invitation {
  id: string
  weddingId: string
  email: string
  role: 'partner' | 'guest' | 'family' | 'friend' | 'wedding-party'
  type?: 'guest' | 'co-owner' // Type of invitation for tier limit checking
  inviteCode: string
  invitedBy: string
  invitedAt: Timestamp
  expiresAt: Timestamp
  status: 'pending' | 'accepted' | 'declined' | 'expired'
  userId?: string // Populated when invitation is accepted
  personalizedPrompt?: string // Custom song request prompt
  songQuestions?: SongQuestion[] // Specific song requests
}

export interface SongQuestion {
  id: string
  question: string
  moment?: WeddingMoment
  count?: number // How many songs to suggest
  genre?: string // Specific genre request
}

// Collaboration types
export interface Collaborator {
  id: string
  weddingId: string
  userId: string
  role: 'guest' | 'family' | 'friend' | 'wedding-party'
  permissions: CollaboratorPermissions
  invitedBy: string
  invitedAt: Timestamp
  joinedAt?: Timestamp
  status: 'invited' | 'joined' | 'declined'
}

export interface CollaboratorPermissions {
  canSuggestSongs: boolean
  canVote: boolean
  canComment: boolean
  canViewAllPlaylists: boolean
}

// Payment types
export interface Payment {
  id: string
  userId: string
  weddingId: string
  amount: number
  currency: 'GBP'
  status: 'pending' | 'succeeded' | 'failed' | 'refunded'
  stripePaymentIntentId: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

// DJ Export types
export interface DJExport {
  id: string
  weddingId: string
  format: 'spotify' | 'csv' | 'pdf' | 'json'
  playlists: string[] // Playlist IDs
  includeNotes: boolean
  includeTiming: boolean
  includeDoNotPlay: boolean
  exportedBy: string
  exportedAt: Timestamp
  downloadUrl?: string
}

// Notification types
export interface Notification {
  id: string
  userId: string
  weddingId: string
  type: 'song_suggestion' | 'vote' | 'playlist_update' | 'collaboration_invite'
  title: string
  message: string
  isRead: boolean
  createdAt: Timestamp
} 