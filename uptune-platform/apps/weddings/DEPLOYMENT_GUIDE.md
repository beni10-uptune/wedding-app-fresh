# Deployment Guide for UpTune Wedding App

## Option 1: Deploy to Vercel (Recommended)

This is the easiest option since your app uses Next.js API routes.

### Steps:

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set Environment Variables**
   After deployment, go to your Vercel dashboard and add these environment variables:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `SPOTIFY_CLIENT_ID`
   - `SPOTIFY_CLIENT_SECRET`
   - `NEXT_PUBLIC_APP_URL` (your production URL)
   - `NEXT_PUBLIC_SPOTIFY_CLIENT_ID`

5. **Update Spotify App Settings**
   - Go to https://developer.spotify.com/dashboard
   - Add your production callback URL: `https://your-app.vercel.app/api/spotify/callback`

6. **Configure Stripe Webhook**
   - Go to Stripe Dashboard > Webhooks
   - Add endpoint: `https://your-app.vercel.app/api/stripe-webhook`
   - Select events: `payment_intent.succeeded`

## Option 2: Deploy to Firebase Hosting with Cloud Functions

This requires converting API routes to Cloud Functions.

### Steps:

1. **Install Firebase Tools**
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize Functions**
   ```bash
   firebase init functions
   ```

3. **Move API routes to Cloud Functions**
   (This would require refactoring your API routes)

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Deploy**
   ```bash
   firebase deploy
   ```

## Option 3: Quick Test Deployment (Development Only)

For quick testing, you can use ngrok to expose your local server:

1. **Install ngrok**
   ```bash
   npm install -g ngrok
   ```

2. **Start your dev server**
   ```bash
   npm run dev
   ```

3. **In another terminal, expose it**
   ```bash
   ngrok http 3000
   ```

4. **Update your .env.local**
   ```
   NEXT_PUBLIC_APP_URL=https://your-ngrok-url.ngrok.io
   ```

## Current Recommendation

Since you want to test quickly, I recommend **Option 1 (Vercel)** because:
- No code changes needed
- API routes work out of the box
- Free tier is generous
- Automatic HTTPS
- Easy environment variable management
- Automatic deployments from Git

Would you like me to help you deploy to Vercel, or would you prefer to set up Firebase Functions for a full Firebase deployment?