# User Journeys Documentation

## Overview
This document outlines all possible user states and journeys in the UpTune wedding app to ensure proper handling of edge cases.

## User States & Journeys

### 1. **Unauthenticated User**
- **State**: No Firebase auth session
- **Behavior**: Redirected to `/auth/login`
- **Entry Points**: Any protected route

### 2. **New User - Just Signed Up**
- **State**: Authenticated, no user document in Firestore
- **Behavior**: 
  - Dashboard shows "Welcome" screen
  - Prompted to "Start Your Musical Journey"
  - Redirected to `/create-wedding`

### 3. **Existing User - No Wedding**
- **State**: Authenticated, has user document, no weddings in collection
- **Behavior**: 
  - Dashboard shows "Welcome" screen with template showcase
  - CTA: "Start Your Musical Journey"
  - Shows template options to entice creation

### 4. **User with Unpaid Wedding**
- **State**: Has wedding with `paymentStatus: 'pending'` or missing
- **Behavior**:
  - Dashboard shows payment required banner
  - Can see wedding details (preview)
  - Features locked behind paywall
  - CTA: "Unlock Full Access - £25"
  - Redirects to `/wedding/[id]/payment`

### 5. **User with Paid Wedding**
- **State**: Has wedding with `paymentStatus: 'paid'`
- **Behavior**:
  - Full dashboard access
  - Shows wedding countdown
  - Music builder access
  - Guest management
  - Export features
  - All premium features unlocked

### 6. **User with Multiple Weddings**
- **State**: Multiple weddings in collection
- **Behavior**:
  - Dashboard shows most recent paid wedding first
  - If no paid weddings, shows most recent unpaid
  - TODO: Add wedding switcher in header

### 7. **Co-owner Invited**
- **State**: Added to wedding's `owners` array but hasn't joined
- **Behavior**:
  - Can access wedding if authenticated
  - Full access same as primary owner
  - Shows in dashboard automatically

### 8. **Guest with Link**
- **State**: Has invitation code or direct wedding ID
- **Entry Point**: `/join/[code]`
- **Behavior**:
  - Can view wedding details
  - Can suggest songs
  - Cannot edit wedding settings
  - Anonymous auth created

## Edge Cases & Handling

### Database Issues
1. **Missing Composite Index**
   - Error: `failed-precondition`
   - Solution: Show error message, log details
   - User sees: "Database not configured properly"

2. **Network Timeout**
   - Error: `unavailable`
   - Solution: Retry mechanism
   - User sees: "Service temporarily unavailable"

3. **Permission Denied**
   - Error: `permission-denied`
   - Solution: Check auth state
   - User sees: "You don't have permission"

### Data Integrity
1. **Missing Required Fields**
   - `owners` array missing/corrupted
   - `paymentStatus` undefined
   - `weddingDate` invalid
   - Solution: Default values, validation

2. **Orphaned Documents**
   - Wedding exists but user not in owners
   - User document missing
   - Solution: Graceful fallback

### Payment Edge Cases
1. **Payment Processing**
   - Status between 'pending' and 'paid'
   - Webhook delays
   - Solution: Show processing state

2. **Failed Payment**
   - Payment failed but status not updated
   - Solution: Check Stripe status

## Implementation Checklist

✅ Error boundary component
✅ Retry mechanism for failed queries  
✅ Loading states for each section
✅ Error messages for users
✅ Logging for debugging
✅ Data validation
✅ Default values for missing fields
❌ Wedding switcher for multiple weddings
❌ Payment status real-time updates
❌ Offline support

## Testing Scenarios

1. **New User Flow**
   ```
   Sign Up → Dashboard (empty) → Create Wedding → Payment → Full Access
   ```

2. **Returning User Flow**
   ```
   Login → Dashboard (loading) → Show Wedding → Full Features
   ```

3. **Error Recovery Flow**
   ```
   Login → Query Fails → Error Screen → Retry → Success
   ```

4. **Guest Flow**
   ```
   Join Link → Guest Form → Song Suggestions → Success
   ```

## Firestore Indexes Required

1. **Weddings Collection**
   - `owners` (Array) + `updatedAt` (Descending)
   - `owners` (Array) + `paymentStatus` (Ascending)

2. **Guest Submissions**
   - `weddingId` + `submittedAt` (Descending)

## Monitoring

Key metrics to track:
- Dashboard load failures
- Query timeouts
- Index errors
- User drop-off points
- Payment conversion rate