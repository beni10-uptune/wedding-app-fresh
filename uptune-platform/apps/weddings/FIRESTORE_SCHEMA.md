# Firestore Database Schema

## Collections Structure

### 1. `users` Collection
```typescript
interface User {
  // Identity
  uid: string                    // Firebase Auth UID
  email: string                  // User email
  displayName: string            // User's display name
  photoURL?: string             // Profile photo (from Google)
  
  // Profile
  partnerName?: string          // Partner's name (for couples)
  role: 'couple' | 'vendor'     // User role
  
  // Onboarding & Status
  onboardingCompleted: boolean  // NEW: Has user created first wedding?
  
  // Timestamps
  createdAt: Timestamp          // Account creation
  updatedAt?: Timestamp         // NEW: Last update
  lastLoginAt?: Timestamp       // NEW: Last login time
}
```

### 2. `weddings` Collection
```typescript
interface Wedding {
  // Identity
  id: string                    // Auto-generated
  title?: string                // Wedding title
  
  // Couple Info
  coupleNames: string[]         // Both names
  coupleName1?: string          // DEPRECATED - use coupleNames
  coupleName2?: string          // DEPRECATED - use coupleNames
  
  // Wedding Details
  weddingDate: Timestamp        // Wedding date
  venue: string                 // Venue name
  city?: string                 // City location
  guestCount?: number           // Expected guests
  
  // Access Control
  owners: string[]              // User UIDs with full access
  inviteCode?: string           // General invite code
  
  // Payment & Subscription
  paymentStatus: 'pending' | 'paid' | 'refunded'  // Payment status
  paymentIntentId?: string      // Stripe payment intent
  
  // Music Data
  timeline: Timeline            // NEW: All music organized by moment
  playlistCount?: number        // DEPRECATED
  songCount?: number            // Total songs (computed)
  totalDuration?: number        // Total duration in seconds
  
  // Counters (NEW)
  counters?: {
    totalSongs: number          // Total songs across all moments
    totalGuests: number         // Total guest invitations sent
    guestSubmissions: number    // Total guest song submissions
    lastUpdated: Timestamp      // When counters were last updated
  }
  
  // Timestamps
  createdAt: Timestamp
  updatedAt: Timestamp
}

interface Timeline {
  [momentId: string]: {
    songs: Song[]
    duration: number  // Target duration in minutes
  }
}

interface Song {
  id: string                    // Unique ID
  spotifyId: string             // Spotify track ID
  title: string                 // Song title
  artist: string                // Artist name
  album?: string                // Album name
  duration: number              // Duration in seconds
  energy?: number               // 1-5 energy level
  explicit?: boolean            // Explicit content
  addedBy: string               // 'couple' | 'guest' | email
  addedAt: Timestamp            // When added
  imageUrl?: string             // Album art
}
```

### 3. `invitations` Collection
```typescript
interface Invitation {
  // Identity
  id: string                    // Auto-generated
  inviteCode: string            // Unique 6-8 char code
  
  // Wedding Reference
  weddingId: string             // Wedding this belongs to
  
  // Invitation Details
  recipientEmail?: string       // Email sent to
  recipientName?: string        // Guest name
  personalizedPrompt?: string   // Custom message for this guest
  
  // Usage
  used: boolean                 // Has been used?
  usedBy?: string              // User ID who used it
  usedAt?: Timestamp           // When used
  
  // Metadata
  createdAt: Timestamp
  expiresAt?: Timestamp        // Optional expiration
}
```

### 4. `weddings/{weddingId}/guestSubmissions` Subcollection
```typescript
interface GuestSubmission {
  // Guest Info
  guestName: string
  guestEmail?: string
  guestId?: string              // If guest created account
  
  // Song Info
  songSpotifyId: string
  songTitle: string
  songArtist: string
  songAlbum?: string
  duration: number              // Seconds
  previewUrl?: string
  
  // Submission Details
  suggestedFor: string          // Moment ID
  note?: string                 // Guest's note
  
  // Status
  status: 'pending' | 'approved' | 'rejected'
  reviewedBy?: string           // Who reviewed
  reviewedAt?: Timestamp
  
  // Voting
  votes: number                 // Vote count
  voters?: string[]             // Who voted
  
  // Timestamps
  submittedAt: Timestamp
}
```

### 5. `weddings/{weddingId}/guests` Subcollection
```typescript
interface Guest {
  // Identity
  id: string                    // Auto-generated
  name: string                  // Guest name
  email?: string                // Guest email
  userId?: string               // If guest has account
  
  // Invitation
  inviteCode?: string           // Code used to join
  invitedBy?: string            // Who sent invite
  
  // Activity
  songsSubmitted: number        // Count of submissions
  lastActiveAt?: Timestamp      // Last activity
  
  // Timestamps
  joinedAt: Timestamp
}
```

### 6. `weddings/{weddingId}/playlists` Subcollection (DEPRECATED)
**Note: This is being phased out in favor of the timeline field**

## Indexes Required

### Composite Indexes
1. **weddings**
   - `owners` (Array) + `updatedAt` (Descending)
   - `owners` (Array) + `paymentStatus` (Ascending)
   - `paymentStatus` (Ascending) + `createdAt` (Descending)

2. **invitations**
   - `inviteCode` (Ascending) + `used` (Ascending)
   - `weddingId` (Ascending) + `createdAt` (Descending)

3. **guestSubmissions**
   - `status` (Ascending) + `submittedAt` (Descending)
   - `guestEmail` (Ascending) + `submittedAt` (Descending)

## Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own document
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId
        && !request.resource.data.diff(resource.data).affectedKeys().hasAny(['uid', 'createdAt']);
    }
    
    // Weddings - owners have full access
    match /weddings/{weddingId} {
      allow read: if request.auth != null && 
        (request.auth.uid in resource.data.owners || isGuest(weddingId));
      allow create: if request.auth != null;
      allow update: if request.auth != null && request.auth.uid in resource.data.owners
        && !request.resource.data.diff(resource.data).affectedKeys().hasAny(['paymentStatus']) 
        || isPaymentWebhook();
      allow delete: if request.auth != null && request.auth.uid in resource.data.owners;
      
      // Subcollections
      match /guestSubmissions/{submissionId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null;
        allow update: if request.auth != null && 
          (request.auth.uid in get(/databases/$(database)/documents/weddings/$(weddingId)).data.owners
          || request.auth.uid == resource.data.guestId);
      }
      
      match /guests/{guestId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null;
        allow update: if request.auth != null && request.auth.uid == resource.data.userId;
      }
    }
    
    // Invitations
    match /invitations/{invitationId} {
      allow read: if true; // Public for invite codes
      allow create: if request.auth != null && isWeddingOwner(request.resource.data.weddingId);
      allow update: if request.auth != null && 
        (isWeddingOwner(resource.data.weddingId) || 
         request.resource.data.keys().hasAll(['used', 'usedBy', 'usedAt']));
    }
    
    // Helper functions
    function isWeddingOwner(weddingId) {
      return request.auth.uid in get(/databases/$(database)/documents/weddings/$(weddingId)).data.owners;
    }
    
    function isGuest(weddingId) {
      return exists(/databases/$(database)/documents/weddings/$(weddingId)/guests/$(request.auth.uid));
    }
    
    function isPaymentWebhook() {
      // Implement webhook authentication
      return false;
    }
  }
}
```

## Migration Notes

### From Old to New Schema

1. **Users Collection**
   - Add `onboardingCompleted: true` to all existing users
   - Add `updatedAt` field with current timestamp

2. **Weddings Collection**
   - Migrate `playlists` subcollection to `timeline` field
   - Add `counters` object with calculated values
   - Ensure `coupleNames` array exists

3. **Payment Status**
   - Ensure all weddings have valid `paymentStatus`
   - Default old weddings to 'paid' if they have songs

## Best Practices

1. **Always use serverTimestamp()** for timestamp fields
2. **Use transactions** when updating counters
3. **Validate data structure** before writes
4. **Use security rules** to enforce data integrity
5. **Create indexes** before deploying