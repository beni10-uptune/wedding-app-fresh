# 🚀 Deployment Checklist

## ✅ Completed
1. **Firebase Rules Deployed** - Simplified rules to fix database errors
2. **Firebase Indexes Deployed** - All compound query indexes created
3. **Build Passes** - Production build completes successfully
4. **TypeScript Checks Pass** - No type errors
5. **Fixed Critical Issues**:
   - Fixed "database not configured" errors
   - Added retry logic to all Firestore operations
   - Fixed user document creation reliability
   - Fixed Firebase Admin SDK initialization

## ⚠️ Environment Variables Needed

Before pushing to production, you need to configure these in Vercel:

### Required for Basic Functionality:
```
# Already configured (Firebase public keys are in code)
✅ NEXT_PUBLIC_FIREBASE_API_KEY
✅ NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
✅ NEXT_PUBLIC_FIREBASE_PROJECT_ID
✅ NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
✅ NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
✅ NEXT_PUBLIC_FIREBASE_APP_ID
✅ NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
```

### Required for Payments (CRITICAL):
```
❌ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (currently placeholder)
❌ STRIPE_SECRET_KEY (currently placeholder)
❌ STRIPE_PRODUCT_ID (currently placeholder)
```

### Optional but Recommended:
```
❌ RESEND_API_KEY (for email invitations)
❌ SPOTIFY_CLIENT_ID (for Spotify integration)
❌ SPOTIFY_CLIENT_SECRET (for Spotify integration)
❌ NEXT_PUBLIC_SPOTIFY_CLIENT_ID (for Spotify integration)
```

### Optional for Advanced Features:
```
❌ FIREBASE_PROJECT_ID (for Firebase Admin SDK)
❌ FIREBASE_CLIENT_EMAIL (for Firebase Admin SDK)
❌ FIREBASE_PRIVATE_KEY (for Firebase Admin SDK)
❌ UPSTASH_REDIS_REST_URL (for rate limiting)
❌ UPSTASH_REDIS_REST_TOKEN (for rate limiting)
```

## 🔧 Vercel Environment Setup

1. Go to: https://vercel.com/your-team/wedding-app-fresh/settings/environment-variables
2. Add each required variable
3. For FIREBASE_PRIVATE_KEY, make sure to keep the \n characters

## 📝 Final Steps Before Going Live

1. **Configure Stripe**:
   - Get your live Stripe keys from https://dashboard.stripe.com
   - Create a product in Stripe for £25 wedding package
   - Update STRIPE_PRODUCT_ID with the live product ID

2. **Configure Email (Optional)**:
   - Sign up for Resend.com
   - Get API key and add domain verification
   - Add RESEND_API_KEY to Vercel

3. **Configure Spotify (Optional)**:
   - Create app at https://developer.spotify.com
   - Add redirect URI: https://your-domain.com/api/spotify/callback
   - Add client ID and secret to Vercel

## 🚦 Ready to Deploy?

Once you've configured the required environment variables in Vercel, the app will automatically deploy when you push to main.