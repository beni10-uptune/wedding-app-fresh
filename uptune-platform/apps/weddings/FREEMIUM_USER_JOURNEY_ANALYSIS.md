# Freemium User Journey Analysis

## Overview
This document analyzes every user journey and edge case in the freemium model to ensure a coherent, compelling experience.

## 1. NEW USER JOURNEY (First Time Experience)

### A. Landing → Signup
**Current Flow:**
1. Land on homepage → See value props focused on outcomes
2. Click "Try It Free" → Signup page
3. Enter name, partner name (optional), email, password
4. Create account → Redirected to create-wedding

**Issues Found:**
- ✅ Good: Clear freemium messaging on homepage
- ❌ Issue: Signup page mentions "£25 when ready to export" - should emphasize free start more
- ❌ Issue: No onboarding tooltips or progress indicators

**Recommendations:**
1. Update signup page copy to emphasize "Start free, upgrade anytime"
2. Add progress bar showing: Signup → Create Wedding → Add Songs → Invite Guests
3. Add welcome email explaining the free tier benefits

### B. Create Wedding Flow
**Current Flow:**
1. Multi-step form: Basic Info → Style → Moments → Template
2. Creates wedding with `paymentStatus: 'pending'`
3. Redirects to dashboard

**Issues Found:**
- ✅ Good: Smooth multi-step process
- ❌ Issue: No mention of free tier limits during creation
- ❌ Issue: User doesn't know they get 25 free songs

**Recommendations:**
1. Add "You're on the Free Plan" indicator with benefits
2. Show "25 songs included free" during template selection
3. Add optional onboarding tour on first dashboard visit

### C. First Dashboard Experience
**Current Flow:**
1. Shows "Start Your Musical Journey" for new wedding
2. Quick stats all show 0
3. Primary CTA is "Start Building"

**Issues Found:**
- ✅ Good: Clear next steps
- ❌ Issue: No indication of free tier status/limits
- ❌ Issue: Missing "what's included" messaging

**Recommendations:**
1. Add free tier banner: "Free Plan: 25 songs, 5 guests included"
2. Add progress indicator: "0/25 songs used"
3. Include "Upgrade anytime" as secondary CTA

## 2. FREE USER ONGOING EXPERIENCE

### A. Building Music (Under Limit)
**Current Flow:**
1. Add songs via builder/search
2. No restrictions until 25 songs

**Issues Found:**
- ✅ Good: Full functionality while under limit
- ❌ Issue: No warning as approaching limit (e.g., at 20 songs)
- ❌ Issue: Song counter not visible

**Recommendations:**
1. Add persistent song counter: "18/25 songs"
2. Show gentle warning at 20 songs: "5 songs left on free plan"
3. Make upgrade CTA more prominent as limit approaches

### B. Hitting Free Tier Limits
**Current Flow:**
1. At 25 songs → Upgrade modal appears
2. At 5 guests → Upgrade modal appears
3. Export/Library/Co-owner → Upgrade modal

**Issues Found:**
- ✅ Good: Clear upgrade modals implemented
- ❌ Issue: Abrupt - no warning before hitting limit
- ❌ Issue: Can't preview what they're missing

**Recommendations:**
1. Add "soft limits" - warnings at 80% usage
2. Allow "preview" of premium features (view-only)
3. Show value: "Unlock 175+ more songs for just £25"

### C. Guest Experience (Free Wedding)
**Current Flow:**
1. Guest receives link → Can suggest songs
2. No indication host is on free plan
3. After 5 guests, host can't invite more

**Issues Found:**
- ✅ Good: Guests don't see limitations
- ❌ Issue: Guest might wonder why their suggestion wasn't added
- ❌ Issue: No messaging about helping couple upgrade

**Recommendations:**
1. Add subtle "Help [Couple] unlock unlimited songs" prompt
2. Show song count to guests: "15/25 songs added so far"
3. Social proof: "23 guests have contributed"

## 3. UPGRADE JOURNEY

### A. Decision to Upgrade
**Triggers:**
- Hit 25 song limit
- Need to invite 6th guest  
- Want to export
- Want co-owner access
- Want curated library

**Issues Found:**
- ✅ Good: Multiple natural upgrade points
- ❌ Issue: No "value stacking" - showing all benefits together
- ❌ Issue: No urgency or incentive

**Recommendations:**
1. Create upgrade page showing ALL benefits unlocked
2. Add testimonial: "Best £25 we spent on our wedding"
3. Show comparison: "£25 vs £500+ for a wedding DJ consultation"

### B. Payment Flow
**Current Flow:**
1. Click upgrade → Payment page
2. Enter card details → Process payment
3. Wedding updated to `paymentStatus: 'paid'`
4. Redirect to dashboard

**Issues Found:**
- ✅ Good: Simple one-time payment
- ❌ Issue: No immediate "thank you" or onboarding to new features
- ❌ Issue: No email confirmation

**Recommendations:**
1. Add success page: "Welcome to Premium! Here's what's new..."
2. Send email with premium feature guide
3. Add confetti animation on first premium dashboard visit

### C. Post-Upgrade Experience
**Current Flow:**
1. All limits removed
2. Can access all features
3. No special recognition

**Issues Found:**
- ❌ Issue: No celebration of upgrade
- ❌ Issue: No guidance on using new features
- ❌ Issue: No way to track they're getting value

**Recommendations:**
1. Add "Premium" badge on dashboard
2. Create "Premium Features Tour"
3. Show metrics: "You've added 67 songs (saved 2 hours)"

## 4. EDGE CASES & ISSUES

### A. Account/Access Edge Cases
1. **Multiple weddings**: User creates wedding, then tries to create another
   - Current: Redirects to existing wedding ✅
   - Issue: No way to manage multiple weddings
   - Fix: Add wedding switcher for premium users

2. **Co-owner invites self**: User tries to add own email as co-owner
   - Current: Would create duplicate access
   - Fix: Validate email != current user email

3. **Deleted wedding recovery**: User accidentally deletes wedding
   - Current: No recovery option
   - Fix: Add 30-day soft delete for premium users

### B. Payment Edge Cases
1. **Payment fails but Stripe succeeds**
   - Current: Wedding stuck in pending
   - Fix: Add webhook retry logic
   - Fix: Manual payment verification endpoint

2. **User upgrades after hitting limit**
   - Current: Works correctly ✅
   - Enhancement: Auto-save attempted action after upgrade

3. **Refund requests**
   - Current: No self-service option
   - Fix: Add refund policy page
   - Fix: Contact form for refund requests

### C. Data Consistency Issues
1. **Song count mismatch**
   - Issue: `songCount` on wedding vs actual timeline count
   - Fix: Add periodic sync job
   - Fix: Calculate dynamically when displaying

2. **Guest count accuracy**
   - Issue: Invitations vs actual guests mismatch
   - Fix: Track both metrics separately
   - Fix: Show "Invitations sent: 5, Guests joined: 3"

3. **Timeline data structure**
   - Issue: Legacy `playlists` vs new `timeline`
   - Fix: Add migration script
   - Fix: Support both in read operations

## 5. BACKEND CONSIDERATIONS

### A. Database Schema Updates Needed
```typescript
// users collection
{
  onboardingCompleted: boolean // ✅ Already added
  lastSeenAt: Timestamp // ❌ Need to add
  hasSeenPremiumTour: boolean // ❌ Need to add
  referralSource?: string // ❌ Need to add
}

// weddings collection
{
  paymentStatus: 'pending' | 'paid' | 'refunded' // ✅ 
  freeUsage: { // ❌ Need to add
    songsAdded: number
    guestsInvited: number
    lastWarningShown?: Timestamp
  }
  premiumActivatedAt?: Timestamp // ❌ Need to add
}
```

### B. Security Rules Updates
```javascript
// Ensure free tier limits in security rules
allow create: if request.auth != null
  && (resource.data.paymentStatus == 'paid' 
      || size(resource.data.timeline.songs) <= 25);
```

### C. Analytics & Monitoring
1. Track conversion funnel:
   - Signup → Create Wedding (onboarding_completed)
   - Add First Song (first_song_added)
   - Hit Free Limit (free_limit_reached)
   - View Upgrade Modal (upgrade_modal_viewed)
   - Complete Payment (payment_completed)

2. Monitor key metrics:
   - Free → Paid conversion rate
   - Average songs before upgrade
   - Most common upgrade trigger
   - Time to upgrade from signup

## 6. IMMEDIATE ACTION ITEMS

### High Priority
1. ✅ Add song counter to builder UI
2. ✅ Add warning at 80% of limits
3. ✅ Create premium success page
4. ✅ Add email confirmation for upgrade
5. ✅ Fix data consistency issues

### Medium Priority
1. Add wedding switcher UI
2. Create premium feature tour
3. Add soft delete functionality
4. Implement usage analytics

### Low Priority
1. Add referral system
2. Create admin dashboard
3. Add A/B testing framework

## 7. SUCCESS METRICS

### Conversion Metrics
- Target: 10-15% free → paid conversion
- Measure: Time to upgrade (target: <7 days)
- Track: Upgrade trigger distribution

### Engagement Metrics
- Free users: Add 15+ songs average
- Free users: Invite 3+ guests average
- Premium users: Export within 30 days

### Satisfaction Metrics
- NPS score > 8 for premium users
- Support tickets < 5% of users
- Refund rate < 2%

## CONCLUSION

The freemium model is well-implemented but needs polish:
1. Better limit communication (warnings, counters)
2. Smoother upgrade experience (celebration, onboarding)
3. Edge case handling (multiple weddings, data sync)
4. Analytics to optimize conversion

With these improvements, users will have a delightful journey from free trial to happy premium customer, focused on creating their perfect wedding day.