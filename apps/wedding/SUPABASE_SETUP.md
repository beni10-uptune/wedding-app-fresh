# Supabase Setup Instructions

## 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Save your project URL and keys

## 2. Environment Variables

Add these to your `.env.local` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Keep your existing Spotify and Stripe keys
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-key
STRIPE_SECRET_KEY=your-stripe-secret
STRIPE_WEBHOOK_SECRET=your-webhook-secret
```

## 3. Run Database Schema

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Create a new query
4. Copy and paste the entire contents of `/supabase/schema.sql`
5. Click "Run"

## 4. Configure Authentication Providers

### Enable Email Auth:
1. Go to Authentication → Providers
2. Email should be enabled by default
3. Configure email templates if desired

### Enable Spotify OAuth:
1. Go to Authentication → Providers
2. Find Spotify and click "Enable"
3. Add your Spotify OAuth credentials:
   - Client ID: (same as your NEXT_PUBLIC_SPOTIFY_CLIENT_ID)
   - Client Secret: (same as your SPOTIFY_CLIENT_SECRET)
   - Redirect URL: Copy the URL shown and add it to your Spotify app settings

### Enable Google OAuth:
1. Go to Authentication → Providers
2. Find Google and click "Enable"
3. Follow the instructions to set up Google OAuth
4. Add the redirect URL to your Google Cloud Console

### Enable Apple OAuth (optional):
1. Go to Authentication → Providers
2. Find Apple and click "Enable"
3. Follow Apple's setup instructions

## 5. Configure Auth Settings

1. Go to Authentication → Settings
2. Set Site URL: `https://weddings.uptune.xyz` (or your domain)
3. Add Redirect URLs:
   - `https://weddings.uptune.xyz/auth/callback`
   - `http://localhost:3000/auth/callback` (for development)

## 6. Import Songs Database

Run the migration script to import your enriched songs:

```bash
npx tsx src/scripts/migrate-songs-to-supabase.ts
```

## 7. Enable Realtime (Optional)

1. Go to Database → Replication
2. Enable replication for tables:
   - `weddings` (for live timeline updates)
   - `guest_submissions` (for live guest songs)

## 8. Set Row Level Security

The schema already includes RLS policies, but verify they're enabled:

1. Go to Authentication → Policies
2. Check that RLS is enabled for all tables
3. Review the policies to ensure they match your needs

## 9. Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Test authentication:
   - Try signing up with email
   - Try logging in with Spotify
   - Try logging in with Google

3. Test database operations:
   - Create a wedding
   - Search for songs
   - Add songs to timeline

## Common Issues

### "Invalid API key"
- Double-check your environment variables
- Make sure you're using the anon key for public operations

### OAuth redirect not working
- Ensure redirect URLs are properly configured in both Supabase and provider settings
- Check that your domain is correctly set in Site URL

### RLS errors
- Make sure the user is properly authenticated
- Check that RLS policies are correctly configured

## Next Steps

After setup is complete:

1. Update all Firebase imports to use Supabase
2. Test all auth flows
3. Migrate existing user data if needed
4. Update Stripe webhooks to work with Supabase
5. Deploy to production