# Vercel Deployment Step-by-Step Guide for UpTune Wedding App

## Prerequisites ✅
- You have a Vercel account (which you do!)
- Your code is in this directory
- You have your environment variables ready

## Step 1: Install Vercel CLI

Open your terminal and run:
```bash
npm install -g vercel
```

## Step 2: Login to Vercel

Run this command and follow the prompts:
```bash
vercel login
```

It will ask you to:
1. Choose your email
2. Open a browser to confirm
3. Click "Confirm" in the browser

## Step 3: Deploy Your App

Run this command in your project directory:
```bash
vercel
```

You'll be asked several questions:
1. **Set up and deploy "~/Desktop/wedding-app-fresh"?** → Type `Y` and press Enter
2. **Which scope do you want to deploy to?** → Select your personal account
3. **Link to existing project?** → Type `N` (for new project)
4. **What's your project's name?** → Type `uptune-wedding` (or any name you like)
5. **In which directory is your code located?** → Press Enter (current directory)
6. **Want to modify these settings?** → Type `N`

The deployment will start! 🚀

## Step 4: Set Up Environment Variables

After deployment, you'll get a URL. Now we need to add your environment variables:

1. Go to https://vercel.com/dashboard
2. Click on your project (uptune-wedding)
3. Click on "Settings" tab
4. Click on "Environment Variables" in the left sidebar
5. Add each of these variables:

### Firebase Variables:
- `NEXT_PUBLIC_FIREBASE_API_KEY` → (copy from your .env.local)
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` → (copy from your .env.local)
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` → (copy from your .env.local)
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` → (copy from your .env.local)
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` → (copy from your .env.local)
- `NEXT_PUBLIC_FIREBASE_APP_ID` → (copy from your .env.local)
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` → (copy from your .env.local)

### Stripe Variables:
- `STRIPE_SECRET_KEY` → Your Stripe secret key (starts with sk_)
- `STRIPE_WEBHOOK_SECRET` → We'll get this after deployment

### Spotify Variables:
- `SPOTIFY_CLIENT_ID` → 8d5b7f5747fe45debfad6a12ad4d5741
- `SPOTIFY_CLIENT_SECRET` → e7cdbbbb63b74762bc8e04f056be0a8c
- `NEXT_PUBLIC_SPOTIFY_CLIENT_ID` → 8d5b7f5747fe45debfad6a12ad4d5741

### App URL:
- `NEXT_PUBLIC_APP_URL` → Your Vercel URL (e.g., https://uptune-wedding.vercel.app)

## Step 5: Redeploy with Environment Variables

After adding all variables, redeploy:
```bash
vercel --prod
```

## Step 6: Update External Services

### Spotify:
1. Go to https://developer.spotify.com/dashboard
2. Click on your app
3. Click "Settings"
4. Add Redirect URI: `https://your-vercel-url.vercel.app/api/spotify/callback`
5. Save

### Stripe Webhook:
1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://your-vercel-url.vercel.app/api/stripe-webhook`
4. Select events: `payment_intent.succeeded`
5. Add endpoint
6. Copy the "Signing secret" that appears
7. Go back to Vercel Environment Variables
8. Add `STRIPE_WEBHOOK_SECRET` with the value you copied
9. Redeploy: `vercel --prod`

### Firebase:
1. Go to Firebase Console
2. Project Settings > General
3. Add your Vercel URL to "Authorized domains"

## Step 7: Test Your App! 🎉

1. Visit your Vercel URL
2. Try signing up
3. Create a wedding
4. Test the payment flow
5. Try the Spotify features

## Troubleshooting

If something doesn't work:

1. **Check the logs:**
   - Go to your Vercel dashboard
   - Click on your project
   - Click "Functions" tab
   - Check for errors

2. **Environment variables:**
   - Make sure all are added
   - No extra spaces or quotes
   - Correct values from .env.local

3. **Redeploy after changes:**
   ```bash
   vercel --prod
   ```

## Your Next Steps:

1. Share your Vercel URL with friends to test
2. Monitor usage in Vercel dashboard
3. Set up a custom domain (optional)

Need help? The Vercel dashboard has great documentation, or ask me!