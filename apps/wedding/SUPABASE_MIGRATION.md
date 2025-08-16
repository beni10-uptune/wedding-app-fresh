# Supabase Migration Guide

## Overview
The wedding app has been architected to be part of the larger Uptune ecosystem using a single Supabase project with multi-app support. This guide explains the new structure and how to complete the migration.

## Multi-App Architecture

The Uptune platform will consist of:
- **Wedding App** (weddings.uptune.xyz) - Wedding playlist builder
- **Uptune Main** (uptune.xyz) - Games, social playlists
- **Funeral App** (funerals.uptune.xyz) - Memorial playlists
- **Events App** - General event playlists

All apps share:
- User profiles and authentication
- Songs database
- Playlists
- Social features (follows, activity feed)

## What's Been Completed ✅

### 1. Database Schema (`/supabase/schema-multi-app.sql`)
- Shared tables: profiles, songs, playlists, social_follows, activity_feed
- Wedding-specific tables with `wedding_` prefix
- Proper indexes and RLS policies
- Functions for app usage tracking

### 2. Supabase Integration
- Auth provider (`/src/components/providers/SupabaseAuthProvider.tsx`)
- Client/server helpers (`/src/lib/supabase/`)
- Wedding-specific helpers (`/src/lib/supabase/wedding-helpers.ts`)
- Multi-app tracking in auth callback

### 3. New Components
- `/src/app/builder-new/page.tsx` - New wedding creation page
- `/src/app/auth/login/supabase-page.tsx` - Supabase login
- `/src/app/auth/signup/supabase-page.tsx` - Supabase signup

### 4. Migration Scripts
- `/src/scripts/migrate-firebase-to-supabase.ts` - Complete migration script
- Handles users, weddings, timelines, and guest submissions

### 5. Updated Webhooks
- `/src/app/api/stripe/webhook-supabase/route.ts` - Stripe integration for Supabase

## Setup Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Save your project URL and keys

### 2. Configure Environment Variables

Add to `.env.local`:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Keep existing keys
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=xxx
SPOTIFY_CLIENT_SECRET=xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=xxx
STRIPE_SECRET_KEY=xxx
STRIPE_WEBHOOK_SECRET=xxx
```

### 3. Run Database Schema

1. Go to Supabase Dashboard > SQL Editor
2. Create new query
3. Copy entire contents of `/supabase/schema-multi-app.sql`
4. Run the query

### 4. Configure Authentication

#### Enable Providers:
1. Go to Authentication > Providers
2. Enable:
   - Email (default)
   - Spotify (use your existing Spotify OAuth credentials)
   - Google
   - Apple (optional)

#### Configure URLs:
1. Go to Authentication > Settings
2. Site URL: `https://weddings.uptune.xyz`
3. Redirect URLs:
   - `https://weddings.uptune.xyz/auth/callback`
   - `http://localhost:3000/auth/callback`

### 5. Migrate Existing Data

Run the migration script:
```bash
npx tsx src/scripts/migrate-firebase-to-supabase.ts
```

This will migrate:
- All Firebase users to Supabase Auth
- Wedding data with proper namespacing
- Timelines and songs
- Guest submissions

### 6. Update Stripe Webhook

In Stripe Dashboard:
1. Update webhook endpoint to: `https://weddings.uptune.xyz/api/stripe/webhook-supabase`
2. Keep the same webhook secret

### 7. Test the Migration

1. Start dev server: `npm run dev`
2. Test flows:
   - Sign up with email
   - Login with Spotify/Google
   - Create a wedding at `/builder-new`
   - Generate smart playlist
   - Save timeline

## Remaining Tasks

### High Priority
- [ ] Update main layout to use Supabase auth provider
- [ ] Replace all Firebase imports in existing components
- [ ] Update guest submission flow
- [ ] Test Spotify playlist export with Supabase

### Medium Priority
- [ ] Migrate blog posts to Supabase
- [ ] Update analytics to track multi-app usage
- [ ] Implement real-time features (live timeline updates)

### Low Priority
- [ ] Add user profile pages
- [ ] Implement social features (following, activity feed)
- [ ] Add cross-app playlist sharing

## Benefits of New Architecture

1. **Unified User Base**: Users can access all Uptune apps with one account
2. **Shared Music Library**: Songs added in any app are available everywhere
3. **Cross-App Features**: Playlists can be shared between wedding/funeral/events
4. **Better Performance**: PostgreSQL with proper indexes
5. **Real-time Updates**: Built-in WebSocket support
6. **Row-Level Security**: Better data isolation and security
7. **Future-Proof**: Ready for social features, games, and more apps

## Deployment Checklist

Before going live:
- [ ] Run full migration script on production data
- [ ] Update Vercel environment variables
- [ ] Test all OAuth providers
- [ ] Verify Stripe webhooks
- [ ] Test guest submission flow
- [ ] Verify RLS policies are working
- [ ] Monitor for any Firebase dependencies

## Support

For issues or questions about the migration:
1. Check Supabase logs in Dashboard > Logs
2. Review RLS policies if getting permission errors
3. Ensure all environment variables are set correctly

## Next Steps

After migration is complete:
1. Monitor usage and performance
2. Implement remaining social features
3. Begin work on other Uptune apps (funeral, events)
4. Add cross-app discovery features