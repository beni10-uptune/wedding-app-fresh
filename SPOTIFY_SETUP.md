# Spotify Integration Setup

## Getting Your Spotify Credentials

1. **Create a Spotify App**
   - Go to https://developer.spotify.com/dashboard
   - Log in with your Spotify account (or create one)
   - Click "Create app"
   - Fill in the app details:
     - App name: "UpTune Wedding App" (or your choice)
     - App description: "Wedding music playlist builder"
     - Website: Your app URL
     - Redirect URI: `https://your-app.vercel.app/api/spotify/callback`
   - Check "Web API" under "Which API/SDKs are you planning to use?"
   - Agree to the terms and click "Save"

2. **Get Your Credentials**
   - In your app dashboard, you'll see:
     - **Client ID**: A long string (public)
     - **Client Secret**: Click "View client secret" (keep this private!)

3. **Update .env.local**
   ```
   SPOTIFY_CLIENT_ID=your_client_id_here
   SPOTIFY_CLIENT_SECRET=your_client_secret_here
   NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_client_id_here
   ```

4. **Update Vercel Environment Variables**
   - Go to your Vercel project settings
   - Add the same three environment variables
   - Redeploy for changes to take effect

## Features Enabled

With Spotify integration, you can:
- Search Spotify's entire music catalog
- Preview 30-second clips of songs
- Get album artwork and song metadata
- Create Spotify playlists (requires user authentication)
- Export wedding playlists to Spotify

## Troubleshooting

- **"Failed to search Spotify"**: Check that your credentials are correct
- **No search results**: Ensure you have a valid Spotify account
- **Preview not playing**: Some songs don't have preview URLs available