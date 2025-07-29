# Critical User Flows Test Plan

## 🔍 Issues Fixed
1. **Create Wedding Button Not Working**
   - Fixed: Changed `new Date()` to `serverTimestamp()` for Firestore compatibility
   - Added validation for required fields
   - Added better error messages and console logging
   - Added missing fields like `userId` and `subscriptionTier`

2. **Dashboard Loading Issues**
   - Added fallback query when Firestore index isn't ready
   - Improved error handling for missing/malformed data
   - Better handling of users with no weddings

## ✅ Test Checklist

### 1. Email Signup Flow
- [ ] Go to `/auth/signup`
- [ ] Enter email and password
- [ ] Click "Create Account"
- [ ] Should redirect to `/create-wedding`
- [ ] User document should be created in Firestore

### 2. Create Wedding Flow
- [ ] Fill in Partner 1 name (required)
- [ ] Fill in Partner 2 name (required)
- [ ] Select wedding date (required)
- [ ] Click through steps 2-5 (venue, style, moments, template)
- [ ] Click "Create Wedding" on step 5
- [ ] Should see loading state
- [ ] Should redirect to `/dashboard`
- [ ] Wedding document should be created with:
  - `subscriptionTier: 'free'`
  - `paymentStatus: 'pending'`
  - Proper timestamps

### 3. Dashboard Access
- [ ] After creating wedding, dashboard should show:
  - Welcome message with user's name
  - Wedding card with couple names
  - Days until wedding
  - Free tier limits (25 songs, 5 guests)
  - "Upgrade to Premium" button
- [ ] No "database not configured" errors

### 4. Google Signup Flow
- [ ] Go to `/auth/signup`
- [ ] Click "Continue with Google"
- [ ] Complete Google auth
- [ ] Should redirect to `/create-wedding`
- [ ] Follow same flow as email signup

### 5. Login Flow (Existing User)
- [ ] Go to `/auth/login`
- [ ] Enter credentials
- [ ] Should redirect to:
  - `/dashboard` if user has wedding
  - `/create-wedding` if new user

### 6. Guest Invitation Flow
- [ ] From dashboard, click "Invite Guests"
- [ ] Enter guest email
- [ ] Send invitation
- [ ] Guest receives invite link
- [ ] Guest can submit songs (limited to 5 for free tier)

### 7. Payment/Upgrade Flow
- [ ] Click "Upgrade to Premium"
- [ ] Enter payment details
- [ ] Complete payment
- [ ] Should unlock:
  - Unlimited songs
  - Unlimited guests
  - All premium features

## 🐛 Known Issues to Monitor

1. **Firestore Indexes**
   - Some queries may fail until indexes are built
   - Dashboard has fallback queries to handle this

2. **Environment Variables**
   - Stripe keys need to be configured for payments
   - Resend API key needed for email invitations
   - Firebase Admin SDK optional but recommended

3. **Rate Limiting**
   - No rate limiting without Redis configuration
   - Monitor for abuse

## 🚀 Deployment Notes

- Changes are auto-deployed to Vercel on push to main
- Firebase rules and indexes are already deployed
- Monitor Vercel deployment logs for any build errors

## 📊 Success Metrics

- Users can complete signup → create wedding → dashboard flow
- No "database not configured" errors
- Free tier limits are enforced (25 songs, 5 guests)
- Users can upgrade to premium (when Stripe is configured)