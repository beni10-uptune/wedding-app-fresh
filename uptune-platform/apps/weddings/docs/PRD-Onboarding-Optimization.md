# Product Requirements Document: Onboarding Flow Optimization

## Executive Summary

The current onboarding flow has critical technical issues and UX friction points that prevent users from successfully creating their wedding and converting to paid customers. This PRD outlines a complete redesign of the onboarding experience to maximize signups, minimize drop-offs, and drive paid conversions.

## Problem Statement

### Current Pain Points:
1. **Technical Failures**: Users cannot complete onboarding due to Firebase permissions error
2. **Authentication Issues**: Users must re-login after signup, breaking the flow
3. **Redundant Data Entry**: Names collected twice, creating frustration
4. **Poor Error Handling**: Generic alerts instead of helpful guidance
5. **Unclear Value Proposition**: Users don't understand why they should pay
6. **No Progress Indication**: Users don't know how many steps remain
7. **Scroll Position Issues**: Page doesn't reset to top between steps

### Business Impact:
- **Lost Conversions**: Users abandon at critical "create wedding" step
- **Poor First Impression**: Technical errors damage trust
- **Reduced Word-of-Mouth**: Frustrated users won't recommend the product

## Goals & Success Metrics

### Primary Goals:
1. **Increase Signup Completion Rate** from current (unknown) to 80%+
2. **Increase Free-to-Paid Conversion** from current (unknown) to 15%+
3. **Reduce Time-to-Value** from signup to first playlist < 3 minutes
4. **Achieve NPS Score** of 40+ for onboarding experience

### Key Metrics:
- Signup start → completion rate
- Time to complete onboarding
- Drop-off rate per step
- Error rate during onboarding
- Free trial → paid conversion rate
- User activation rate (first song added)

## User Personas & Jobs-to-be-Done

### Primary Persona: "The Engaged Couple"
- **Demographics**: 25-35 years old, planning wedding 6-12 months out
- **Tech Savvy**: Comfortable with Spotify, streaming services
- **Pain Points**: Overwhelmed by wedding planning, want music to be perfect
- **JTBD**: "I want to easily collaborate with my partner and guests to create the perfect wedding playlist that represents us"

### Secondary Persona: "The Co-Planner"
- **Demographics**: Partner, parent, or wedding planner helping with music
- **Pain Points**: Need easy way to contribute without taking over
- **JTBD**: "I want to help select music while respecting the couple's vision"

## Proposed Solution: Streamlined 3-Step Onboarding

### Design Principles:
1. **Show Value Immediately**: Demo the product before requiring signup
2. **Progressive Disclosure**: Only ask for essential info upfront
3. **Smart Defaults**: Pre-fill and suggest where possible
4. **Error Prevention**: Validate in real-time, guide users to success
5. **Mobile-First**: Optimize for phone usage during venue visits

### New Flow Architecture:

```
Landing Page → Interactive Demo → Signup → Create Wedding → First Playlist → Success
     ↓              ↓                ↓           ↓              ↓            ↓
  (Value Prop)  (Try Before Buy) (Minimal)  (Essential)   (Quick Win)  (Upsell)
```

## Detailed Requirements

### 1. Pre-Signup Experience

#### Interactive Demo (NEW)
- **What**: Let users search songs and build a mini-playlist before signup
- **Why**: Demonstrate value, create investment before asking for commitment
- **Requirements**:
  - Search up to 5 songs using Spotify API
  - See how songs look in a wedding timeline
  - "Save your playlist" → triggers signup
  - Demo playlist carries over post-signup

### 2. Simplified Signup (REVISED)

#### Single-Screen Signup
- **Fields** (only essentials):
  - Email
  - Password
  - "Creating wedding for: [Your Name] & [Partner Name]" (single field)
- **Options**:
  - Continue with Google (one-click)
  - Continue with Spotify (pre-authorize music access)
- **Post-Signup**:
  - NO redirect/re-login required
  - Seamless transition to wedding creation
  - Auto-save progress to localStorage

### 3. Smart Wedding Creation (REVISED)

#### Step 1: The Basics (Consolidated)
- **Wedding Date** (with smart suggestions: "Next Saturday in June")
- **Venue Type** (Quick select: Outdoor/Indoor/Beach/Church/Other)
- **Guest Count** (Slider: <50, 50-100, 100-200, 200+)
- **Skip Available**: "I'll add details later"

#### Step 2: Your Music Vision (NEW - Value-Focused)
- **Visual Style Selector**: Grid of wedding vibes with music samples
  - "Classic Elegance" (preview: Etta James, Frank Sinatra)
  - "Modern Romance" (preview: Ed Sheeran, John Legend)
  - "Party Celebration" (preview: Bruno Mars, Beyoncé)
  - "Indie & Unique" (preview: First Dance songs)
- **Auto-generates**: Starter playlist based on selection

#### Step 3: Quick Win Moment (NEW)
- **Immediate Value**: "Here's your starter playlist!"
- Show 10-15 pre-selected songs based on their style
- **Actions**:
  - ✓ Keep these songs
  - + Add more songs
  - 👥 Invite partner/guests
  - 🎵 Connect Spotify (if not already)

### 4. Post-Onboarding Success State

#### Celebration Screen
- Confetti animation
- "Your wedding playlist is ready!"
- Clear next steps:
  1. Add your must-have songs
  2. Invite your partner (if not added)
  3. Share with guests for suggestions
- **Soft Upsell**: "Unlock all features for £25" (not blocking)

### 5. Technical Implementation Requirements

#### Authentication Flow
- Use Firebase Auth session persistence
- Store partial progress in localStorage
- Implement proper loading states
- Handle auth errors gracefully

#### Data Management
- Create user document immediately after auth
- Pre-populate from signup data
- Use optimistic UI updates
- Implement proper error boundaries

#### Permissions Fix
- Deploy updated Firestore rules
- Add error handling for permission denied
- Implement retry logic with backoff
- Provide clear error messages

### 6. Error Handling & Edge Cases

#### Smart Error Recovery
- **Network Issues**: Auto-save and retry
- **Validation Errors**: Inline guidance, not alerts
- **Permission Errors**: Clear explanation + support link
- **Duplicate Account**: Offer to login or merge

#### Progressive Enhancement
- Works without JavaScript (basic form)
- Offline support for started sessions
- Browser back button doesn't break flow
- Autosave every field change

## Conversion Optimization Strategy

### 1. Value Communication
- **Hero Message**: "Create Your Perfect Wedding Playlist in 3 Minutes"
- **Social Proof**: "Join 10,000+ couples who transformed their wedding music"
- **Trust Signals**: Spotify partnership, testimonials, security badges

### 2. Reduce Friction
- **Guest Mode**: Explore without signup
- **Magic Link**: Email-only signup option
- **Social Login**: Google, Spotify, Apple
- **Progress Bar**: Show steps remaining

### 3. Activation Triggers
- **Quick Wins**: Pre-built playlists
- **Collaboration**: Easy partner invite
- **Gamification**: "Complete your first moment"
- **Nudges**: Email/push for incomplete setups

### 4. Pricing Psychology
- **Try-First**: Full features during setup
- **Value Anchoring**: "Save 10+ hours of playlist creation"
- **Social Proof**: "Most couples upgrade for unlimited songs"
- **Urgency**: "Lock in your playlist before prices increase"

## Technical Action Plan

### Phase 1: Critical Fixes (Week 1)
1. **Deploy Firestore Rules**
   ```bash
   firebase deploy --only firestore:rules
   ```

2. **Fix Authentication Flow**
   - Remove redirect after signup
   - Implement session persistence
   - Add proper loading states

3. **Data Flow Optimization**
   - Pass signup data to wedding creation
   - Remove redundant name fields
   - Add localStorage backup

4. **Error Handling**
   - Replace alerts with toast notifications
   - Add helpful error messages
   - Implement retry mechanisms

### Phase 2: UX Improvements (Week 2)
1. **Visual Progress Indicator**
   - Step counter
   - Progress bar
   - Skip options

2. **Form Optimizations**
   - Auto-focus next field
   - Smart defaults
   - Inline validation

3. **Mobile Responsiveness**
   - Touch-friendly inputs
   - Proper keyboard handling
   - Scroll position management

### Phase 3: Conversion Features (Week 3-4)
1. **Interactive Demo**
   - Pre-signup playlist builder
   - Spotify API integration
   - Demo-to-account transfer

2. **Smart Recommendations**
   - Style-based playlists
   - AI suggestions
   - Trending songs

3. **Activation Campaigns**
   - Onboarding emails
   - Partner invites
   - Progress reminders

### Phase 4: Analytics & Optimization (Ongoing)
1. **Instrumentation**
   - Track every step
   - Error logging
   - User feedback

2. **A/B Testing**
   - Signup methods
   - Form layouts
   - Value propositions

3. **Continuous Improvement**
   - Weekly metrics review
   - User interview insights
   - Iterative updates

## Success Criteria

### Week 1 Success:
- Zero "permission denied" errors
- 90%+ signup completion rate
- < 30 second average time to wedding creation

### Month 1 Success:
- 80%+ onboarding completion
- 50%+ add first song
- 15%+ free-to-paid conversion

### Month 3 Success:
- 40+ NPS for onboarding
- 25%+ free-to-paid conversion
- 70%+ 7-day retention

## Risk Mitigation

### Technical Risks:
- **Firebase Limits**: Implement rate limiting
- **Spotify API**: Cache responses, handle failures
- **Browser Support**: Progressive enhancement

### Business Risks:
- **Low Conversion**: A/B test pricing/messaging
- **High Churn**: Improve activation/retention
- **Competition**: Unique features/experience

## Conclusion

This redesigned onboarding flow addresses all critical issues while optimizing for both user experience and business metrics. By focusing on immediate value demonstration, reducing friction, and fixing technical issues, we can transform the onboarding from a barrier into a conversion driver.

The phased approach allows for quick wins (fixing critical bugs) while building toward a best-in-class onboarding experience that sets UpTune apart in the wedding planning space.