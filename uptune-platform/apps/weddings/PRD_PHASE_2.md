# UpTune for Weddings - Development PRD Phase 2

## 📋 **Project Overview**

**Product**: UpTune for Weddings  
**Phase**: 2 - Core Features Development  
**Timeline**: 2-3 weeks  
**Status**: Ready to Begin  

## ✅ **Phase 1 Complete**
- Landing page with UpTune brand DNA
- Firebase integration and deployment
- Design system with wedding theme
- Environment configuration
- Brand essence documentation

## 🎯 **Phase 2 Objectives**

Build the core functionality that enables couples to create their musical wedding journey, collaborate with guests, and export professional playlists for DJs.

## 🚀 **Technical Requirements**

### **Tech Stack (Established)**
- Frontend: Next.js 14 + React 18 + TypeScript
- Styling: Tailwind CSS with wedding theme
- Database: Firebase Firestore
- Authentication: Firebase Auth
- Storage: Firebase Storage
- Deployment: Firebase Hosting
- Payment: Stripe (Phase 3)

### **Environment**
- Development: `http://localhost:3001`
- Production: `weddings.uptune.xyz`
- Firebase Project: `weddings-uptune-d12fa`

## 🎵 **Core Features to Build**

### **1. Authentication System**
**Priority**: Critical  
**User Stories**:
- As a couple, I want to sign up easily so I can start planning my wedding music
- As a guest, I want to join a wedding collaboration without complex registration
- As a user, I want to sign in with Google for convenience

**Requirements**:
- Email/password registration for couples
- Google OAuth for easy guest access
- Guest invitation system with simple join flow
- User profile management
- Session persistence

**Components to Build**:
- `/auth/signin` page
- `/auth/signup` page  
- `/auth/guest-join/[weddingId]` page
- `AuthProvider` context
- `useAuth` hook
- Profile management components

### **2. Wedding Creation Flow**
**Priority**: Critical  
**User Stories**:
- As a couple, I want to create our wedding project with basic details
- As a couple, I want to set our wedding date and venue
- As a couple, I want to invite my partner as co-owner
- As a couple, I want to customize our wedding moments (ceremony, cocktails, etc.)

**Requirements**:
- Step-by-step wedding setup wizard
- Partner invitation system
- Wedding moment customization
- Basic wedding details (date, venue, couple names)
- Payment integration (£25 one-time)

**Components to Build**:
- `/create-wedding` multi-step form
- `/wedding/[id]/settings` page
- Wedding creation wizard components
- Partner invitation system
- Payment integration with Stripe

### **3. Music Library & Discovery**
**Priority**: Critical  
**User Stories**:
- As a user, I want to browse 500+ curated wedding songs
- As a user, I want to filter songs by wedding moment (ceremony, reception, etc.)
- As a user, I want to search songs by artist, title, or mood
- As a user, I want to see why each song is recommended
- As a user, I want to preview songs before adding them

**Requirements**:
- Curated music database with 500+ songs
- Song categorization by wedding moments
- Search and filter functionality
- Song preview integration (Spotify)
- Cultural context and stories for songs
- Mood and genre tagging

**Components to Build**:
- `/music-library` page with filters
- `SongCard` component with preview
- `MusicSearch` component
- Song detail modals with context
- Filter and sort functionality
- Spotify preview integration

### **4. Collaborative Playlist Builder**
**Priority**: Critical  
**User Stories**:
- As a couple, I want to create playlists for different wedding moments
- As a couple, I want to collaborate with my partner in real-time
- As a guest, I want to suggest songs for the wedding
- As a guest, I want to vote on suggested songs
- As a user, I want to add personal notes to song suggestions

**Requirements**:
- Real-time collaborative editing
- Multiple playlists per wedding (ceremony, cocktails, dinner, dancing)
- Guest song suggestions with voting
- Personal notes and stories for songs
- Drag-and-drop playlist organization
- Real-time updates using Firestore

**Components to Build**:
- `/wedding/[id]/playlists` main dashboard
- `/wedding/[id]/playlist/[playlistId]` editor
- `PlaylistBuilder` component
- `SongSuggestion` component with voting
- Real-time collaboration hooks
- Guest invitation and participation flow

### **5. Guest Collaboration System**
**Priority**: High  
**User Stories**:
- As a couple, I want to invite guests to suggest songs
- As a guest, I want to easily join and suggest songs
- As a guest, I want to vote on other suggestions
- As a guest, I want to share why a song is meaningful
- As a couple, I want to approve/reject guest suggestions

**Requirements**:
- Guest invitation via email/link
- Simple guest onboarding flow
- Song suggestion interface
- Voting system for suggestions
- Approval workflow for couples
- Guest activity feed

**Components to Build**:
- `/guest/[weddingId]` guest interface
- Guest invitation system
- `GuestSuggestionForm` component
- Voting interface
- Activity feed component
- Guest management dashboard

## 🎨 **Design Requirements**

### **Brand Consistency**
- Maintain UpTune brand DNA: "Made with Love for Music"
- Use established color palette (pink/purple gradients)
- Warm, storytelling-focused copy
- Community-first feature presentation

### **User Experience**
- Mobile-first responsive design
- Intuitive navigation between features
- Real-time feedback and updates
- Gentle onboarding with helpful tooltips
- Accessibility compliance (WCAG 2.1)

### **Key Pages to Build**
1. `/auth/signin` - Sign in page
2. `/auth/signup` - Registration page  
3. `/create-wedding` - Wedding creation wizard
4. `/wedding/[id]` - Wedding dashboard
5. `/wedding/[id]/playlists` - Playlist management
6. `/wedding/[id]/music-library` - Music discovery
7. `/wedding/[id]/guests` - Guest management
8. `/guest/[weddingId]` - Guest collaboration interface

## 🔧 **Technical Implementation**

### **Database Schema (Firestore)**
```typescript
// Collections already defined in src/types/wedding.ts
- users/{userId}
- weddings/{weddingId}
- weddings/{weddingId}/playlists/{playlistId}
- weddings/{weddingId}/suggestions/{suggestionId}
- weddings/{weddingId}/votes/{voteId}
- musicLibrary/{songId}
```

### **Authentication Flow**
```typescript
// Firebase Auth integration
- Email/password for couples
- Google OAuth for guests
- Guest invitation tokens
- Role-based permissions (owner/guest)
```

### **Real-time Features**
```typescript
// Firestore real-time listeners
- Playlist collaboration
- Guest suggestions
- Voting updates
- Activity feeds
```

## 📱 **Component Architecture**

### **Core Components**
```typescript
// Authentication
- AuthProvider
- SignInForm
- SignUpForm
- GuestJoinForm

// Wedding Management
- WeddingCreationWizard
- WeddingDashboard
- WeddingSettings

// Music & Playlists
- MusicLibrary
- PlaylistBuilder
- SongCard
- SongSuggestionForm

// Collaboration
- GuestInvitation
- VotingInterface
- ActivityFeed
- RealTimeUpdates
```

### **Hooks & Utilities**
```typescript
// Custom hooks
- useAuth()
- useWedding()
- usePlaylist()
- useRealTimeUpdates()
- useMusicLibrary()

// Utilities
- Firebase helpers
- Spotify integration
- Real-time listeners
- Permission helpers
```

## 🎵 **Music Integration**

### **Spotify Web API**
- Song search and preview
- Track metadata retrieval
- 30-second preview playback
- Album artwork display

### **Curated Music Database**
- 500+ wedding songs pre-loaded
- Categorized by wedding moments
- Cultural context and stories
- Mood and genre tagging

## 🔒 **Security & Permissions**

### **Access Control**
- Wedding owners: Full access to their wedding
- Guests: Can suggest songs and vote
- Anonymous: Landing page only
- Firebase Security Rules already deployed

### **Data Validation**
- Client-side form validation
- Server-side security rules
- Input sanitization
- Rate limiting for suggestions

## 📊 **Success Metrics**

### **Phase 2 Goals**
- Couples can create and manage weddings
- Real-time collaboration works smoothly
- Guests can easily join and participate
- Music library is discoverable and engaging
- Core user journey is complete end-to-end

### **Key Metrics to Track**
- Wedding creation completion rate
- Guest participation rate
- Songs suggested per wedding
- Time spent in playlist builder
- User retention after first session

## 🚀 **Deployment Strategy**

### **Development Process**
1. Build features incrementally
2. Test with Firebase emulators
3. Deploy to staging environment
4. User testing with sample data
5. Production deployment

### **Feature Flags**
- Authentication system
- Playlist collaboration
- Guest invitations
- Music library
- Real-time updates

## 📋 **Acceptance Criteria**

### **Must Have (Phase 2)**
- ✅ User authentication works end-to-end
- ✅ Couples can create weddings and invite partners
- ✅ Music library is searchable and browsable
- ✅ Playlist creation and editing works
- ✅ Guest collaboration is functional
- ✅ Real-time updates work across devices
- ✅ Mobile responsive design

### **Nice to Have (Phase 3)**
- Payment integration
- DJ export functionality
- Advanced music recommendations
- Wedding moment templates
- Social sharing features

## 🎯 **Development Sequence**

### **Week 1: Foundation**
1. **Authentication System** (Days 1-3)
   - Build sign-in/sign-up pages with UpTune branding
   - Implement Firebase Auth integration
   - Create user context and hooks
   - Add Google OAuth for guests

2. **Wedding Creation Flow** (Days 4-5)
   - Multi-step wedding setup wizard
   - Basic wedding data structure
   - Partner invitation system

### **Week 2: Core Features**
3. **Music Library** (Days 1-3)
   - Populate with curated songs (start with 50, expand to 500)
   - Build search and filter interface
   - Integrate Spotify previews
   - Add song categorization by wedding moments

4. **Collaborative Playlists** (Days 4-5)
   - Real-time playlist builder
   - Basic playlist CRUD operations
   - Guest suggestion system

### **Week 3: Polish & Integration**
5. **Guest Collaboration** (Days 1-2)
   - Guest invitation and onboarding
   - Voting functionality
   - Activity feed

6. **Testing & Polish** (Days 3-5)
   - End-to-end user journey testing
   - Mobile responsiveness
   - Performance optimization
   - Bug fixes and UI polish

## 🔧 **Technical Setup Instructions**

### **Environment Variables**
Already configured in `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAUZkC78RsxmnLGVSFwP8OmQsjPJhsJ4u8
NEXT_PUBLIC_FIREBASE_PROJECT_ID=weddings-uptune-d12fa
# ... other Firebase config
```

### **Firebase Configuration**
- Project: `weddings-uptune-d12fa`
- Firestore rules and indexes deployed
- Authentication providers enabled
- Storage rules configured

### **Development Commands**
```bash
# Start development server
npm run dev

# Run Firebase emulators (for testing)
npm run firebase:emulators

# Deploy to Firebase
npm run firebase:deploy
```

## 🎵 **Sample Music Data Structure**

### **Initial Song Categories**
```typescript
// Wedding Moments
- ceremony: Processional, recessional, unity ceremony
- cocktail: Background music, mingling
- dinner: Ambient, conversation-friendly  
- dancing: High-energy, crowd favorites
- first-dance: Romantic, meaningful
- parent-dance: Traditional, emotional
```

### **Sample Songs to Include**
```typescript
// Ceremony Classics
- "Canon in D" - Pachelbel
- "A Thousand Years" - Christina Perri
- "All You Need Is Love" - The Beatles

// First Dance Favorites  
- "At Last" - Etta James
- "Perfect" - Ed Sheeran
- "Thinking Out Loud" - Ed Sheeran

// Reception Bangers
- "I Wanna Dance with Somebody" - Whitney Houston
- "Don't Stop Me Now" - Queen
- "September" - Earth, Wind & Fire
```

## 📱 **Mobile-First Design Principles**

### **Responsive Breakpoints**
- Mobile: 320px - 768px
- Tablet: 768px - 1024px  
- Desktop: 1024px+

### **Touch-Friendly Interactions**
- Minimum 44px touch targets
- Swipe gestures for playlist management
- Pull-to-refresh for activity feeds
- Haptic feedback for important actions

## 🎯 **Success Criteria**

### **User Journey Completion**
1. **Couple Onboarding**: Sign up → Create wedding → Invite partner
2. **Music Discovery**: Browse library → Preview songs → Add to playlist
3. **Guest Collaboration**: Invite guests → Guests suggest songs → Vote on suggestions
4. **Playlist Management**: Organize by moments → Add notes → Real-time collaboration

### **Performance Targets**
- Page load time: < 2 seconds
- Time to interactive: < 3 seconds
- Real-time updates: < 500ms latency
- Mobile lighthouse score: > 90

This PRD provides a comprehensive roadmap for building the core UpTune for Weddings functionality while maintaining the authentic brand DNA and ensuring a delightful user experience. 🎵💕 