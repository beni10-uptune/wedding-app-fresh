# Authentication Flows PRD
## Wedding Playlist Builder App

### Executive Summary
This PRD defines the complete authentication strategy for the Wedding Playlist Builder app, focusing on maximizing conversion while providing a seamless user experience. The key principle is allowing users to build and experience the product value before requiring authentication.

### Core Principles
1. **Anonymous First**: Users can build playlists without signing in
2. **Progressive Authentication**: Only require auth when saving/sharing/advanced features
3. **Simple Auth Options**: Email and Google only (no Spotify/Apple)
4. **Clear Value Proposition**: Show users why they should create an account
5. **Seamless Experience**: Never block core functionality with auth walls

## User Personas

### 1. Anonymous Builder (60% of users)
- Wants to quickly try the builder
- Not ready to commit to creating an account
- May share link with partner/friends
- Converts when they want to save progress

### 2. Engaged Couple (30% of users)
- Ready to create their wedding playlist
- Wants to save and collaborate
- Needs Spotify integration
- Will pay for premium features

### 3. Guest Contributor (10% of users)
- Invited by couple to suggest songs
- Minimal commitment needed
- May not need full account

## Authentication Triggers & Flows

### 1. Anonymous Building Flow
**Entry Points:**
- Landing page "Start Building" button
- Direct link to /builder

**Experience:**
- Full access to playlist builder
- Can add/remove/reorder songs
- Can preview songs
- Can explore all wedding moments
- Progress saved in localStorage

**Auth Trigger Points:**
- Click "Save Playlist" → Email capture modal → Auth modal
- Click "Share with Partner" → Auth modal
- Click "Connect Spotify" → Auth modal
- Click "Upgrade to Premium" → Auth modal
- After 10+ songs added → Gentle prompt to save

### 2. Sign Up Flow
**Entry Points:**
- Header "Sign Up" button
- Auth modal from builder
- Landing page CTAs
- Pricing page

**User Journey:**
```
Sign Up Clicked → Sign Up Page
├── Google Sign Up (1-click)
│   └→ Complete Profile → Builder/Dashboard
└── Email Sign Up
    ├→ Enter Name, Email, Password
    ├→ Email Verification Sent
    └→ Verify Email → Complete Profile → Builder/Dashboard
```

**Key Improvements:**
- Remove Spotify/Apple options
- Cleaner email form with better UX
- Clear value props on sign up page
- Auto-redirect to intended destination

### 3. Sign In Flow
**Entry Points:**
- Header "Sign In" button
- Auth modal "Already have account?" link
- Sign up page link

**User Journey:**
```
Sign In Clicked → Sign In Page
├── Google Sign In (1-click)
│   └→ Dashboard/Builder
└── Email Sign In
    ├→ Enter Email, Password
    ├→ Success → Dashboard/Builder
    └→ Forgot Password → Reset Flow
```

**Magic Link Option:**
- Available for users who forgot password
- One-click sign in from email

### 4. Guest Contribution Flow
**Entry Points:**
- Shared link with guest token
- "Suggest Songs" button on couple's page

**Experience:**
- Can view couple's playlist
- Can suggest songs (limited number)
- Optional: Create account for more features

## Component Architecture

### 1. Auth Context (Supabase)
```typescript
interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  isAnonymous: boolean
  localProgress: LocalProgress | null
}

interface AuthActions {
  signInWithGoogle(): Promise<void>
  signInWithEmail(email, password): Promise<void>
  signUpWithEmail(email, password, name): Promise<void>
  signOut(): Promise<void>
  mergeAnonymousProgress(): Promise<void>
}
```

### 2. Protected Routes
```typescript
// Routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/wedding/[slug]/edit',
  '/settings',
  '/billing'
]

// Routes that work for anonymous users
const PUBLIC_ROUTES = [
  '/builder',
  '/wedding/[slug]', // View only
  '/blog',
  '/'
]
```

### 3. Auth Modal Component
```typescript
interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'sign-in' | 'sign-up'
  redirectTo?: string
  message?: string // "Save your playlist", "Connect Spotify", etc.
}
```

### 4. Email Capture Modal
```typescript
interface EmailCaptureProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (email: string) => void
  title: string
  description: string
}
```

## UI/UX Improvements

### 1. Sign Up Page Redesign
- **Hero Section**: "Create Your Perfect Wedding Playlist"
- **Value Props**: 
  - ✓ Save unlimited playlists
  - ✓ Collaborate with your partner
  - ✓ Connect to Spotify
  - ✓ Guest song requests
- **Social Proof**: "Join 10,000+ couples"
- **Auth Options**:
  - Google (prominent, one-click)
  - Email (clean form design)
- **Remove**: Spotify and Apple buttons

### 2. Email Auth Form Improvements
```jsx
// Current (Poor UX)
<input type="email" placeholder="Email address" />
<input type="password" placeholder="Password" />

// Improved (Better UX)
<div className="space-y-4">
  <div className="relative group">
    <input 
      type="email" 
      className="peer w-full px-4 py-3 rounded-xl border-2 
                 border-purple-200 focus:border-purple-500
                 transition-all duration-200"
      placeholder=" "
    />
    <label className="absolute left-4 top-3 text-gray-500 
                      peer-focus:text-xs peer-focus:-top-2 
                      peer-focus:bg-white peer-focus:px-2
                      peer-[:not(:placeholder-shown)]:text-xs 
                      peer-[:not(:placeholder-shown)]:-top-2
                      transition-all duration-200">
      Email address
    </label>
  </div>
  
  <div className="relative group">
    <input 
      type="password" 
      className="peer w-full px-4 py-3 rounded-xl border-2 
                 border-purple-200 focus:border-purple-500"
      placeholder=" "
    />
    <label className="absolute left-4 top-3 text-gray-500 
                      peer-focus:text-xs peer-focus:-top-2 
                      peer-focus:bg-white peer-focus:px-2
                      transition-all duration-200">
      Password
    </label>
    <button className="absolute right-3 top-3 text-gray-400">
      <Eye className="w-5 h-5" />
    </button>
  </div>
  
  <div className="flex items-center justify-between text-sm">
    <label className="flex items-center gap-2">
      <input type="checkbox" className="rounded" />
      <span>Remember me</span>
    </label>
    <button className="text-purple-600 hover:underline">
      Forgot password?
    </button>
  </div>
</div>
```

### 3. Auth Modal in Builder
- **Trigger Message**: Contextual based on action
  - "Save your playlist" 
  - "Share with your partner"
  - "Connect to Spotify"
- **Options**: Google + Email only
- **Skip Option**: "Continue without account" (if applicable)

## Implementation Phases

### Phase 1: Core Auth Infrastructure (Week 1)
- [x] Analyze current implementation
- [ ] Remove Spotify/Apple auth providers
- [ ] Fix anonymous building capability
- [ ] Improve email auth UI components
- [ ] Create unified auth context

### Phase 2: User Flows (Week 2)
- [ ] Implement progressive auth triggers
- [ ] Build auth modal component
- [ ] Create email capture flow
- [ ] Add localStorage progress tracking
- [ ] Implement progress merging on sign up

### Phase 3: UI Polish (Week 3)
- [ ] Redesign sign up/sign in pages
- [ ] Add contextual auth prompts
- [ ] Implement "Continue as Guest" options
- [ ] Add social proof elements
- [ ] Create onboarding flow for new users

### Phase 4: Testing & Optimization (Week 4)
- [ ] A/B test auth trigger points
- [ ] Measure conversion rates
- [ ] Fix edge cases
- [ ] Optimize for mobile
- [ ] Add analytics tracking

## Success Metrics

### Primary KPIs
- **Anonymous → Registered**: >30% conversion rate
- **Sign Up Completion**: >80% completion rate
- **Time to First Save**: <5 minutes
- **Auth Drop-off Rate**: <20%

### Secondary Metrics
- Google vs Email sign up ratio
- Average songs before sign up
- Guest contribution rate
- Mobile vs Desktop conversion

## Technical Considerations

### 1. Session Management
- Use Supabase for auth state
- localStorage for anonymous progress
- Sync on authentication
- Handle session expiry gracefully

### 2. Security
- CSRF protection
- Rate limiting on auth endpoints
- Secure password requirements
- Email verification required

### 3. Performance
- Lazy load auth components
- Optimistic UI updates
- Cache user data appropriately
- Minimize auth check waterfalls

### 4. Migration Path
- Support existing Firebase users
- Migrate data to Supabase
- Maintain backward compatibility
- Provide data export options

## Edge Cases & Error Handling

### 1. Duplicate Accounts
- Check email before sign up
- Offer to sign in instead
- Merge anonymous progress

### 2. Failed Auth
- Clear error messages
- Retry mechanisms
- Fallback to magic link
- Support contact option

### 3. Network Issues
- Offline mode for builder
- Queue auth attempts
- Sync when reconnected
- Show connection status

### 4. Browser Compatibility
- Support password managers
- Handle autofill properly
- Work with browser back button
- Support incognito mode

## Future Enhancements

### V2 Features
- Social login (Facebook, X)
- Two-factor authentication
- Team accounts for vendors
- SSO for enterprise
- Passwordless auth by default

### V3 Features
- Biometric authentication
- Web3 wallet connection
- Multi-device sync
- Family accounts
- API key management

## Appendix

### A. Current Issues to Fix
1. ✅ Firebase/Supabase mismatch
2. ⏳ Anonymous building blocked
3. ⏳ Too many auth providers
4. ⏳ Poor email form UX
5. ⏳ Confusing auth triggers
6. ⏳ No clear value proposition

### B. Competitor Analysis
- **The Knot**: Email-first, progressive
- **Zola**: Social + Email, immediate value
- **Joy**: Simple email, great onboarding
- **Spotify**: OAuth leader, seamless flow

### C. User Feedback
- "I just wanted to try it first"
- "Too many login options confused me"
- "Why do I need Spotify to sign up?"
- "I lost my playlist when I signed up"
- "The email form looked sketchy"

---

*Last Updated: January 2025*
*Author: Wedding App Team*
*Status: In Implementation*