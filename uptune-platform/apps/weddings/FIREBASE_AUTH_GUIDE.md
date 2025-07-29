# Firebase Authentication & Deployment Guide

## Option 1: Browser-Based Authentication (Recommended)

Since you're having issues with CLI authentication, let's use the browser-based flow:

```bash
# Navigate to your project directory
cd /Users/bensmith/Desktop/wedding-app-fresh

# Use npx to run firebase commands without global install
npx firebase login --interactive

# This will open your browser for authentication
# After logging in, return to terminal
```

## Option 2: Use Firebase Hosting Deploy Button

1. Go to Firebase Console: https://console.firebase.google.com/project/weddings-uptune-d12fa/firestore/rules
2. You can paste the rules directly in the console editor
3. Click "Publish" to deploy the rules

For indexes:
1. Go to: https://console.firebase.google.com/project/weddings-uptune-d12fa/firestore/indexes
2. Click "Create Index" and manually add each index from firestore.indexes.json

## Option 3: Generate CI Token

If the interactive login doesn't work, generate a CI token:

```bash
# Generate a CI token (this will open browser)
npx firebase login:ci

# Copy the token that's displayed
# Then use it for deployment
FIREBASE_TOKEN=your-token-here npx firebase deploy --only firestore
```

## Option 4: Direct Console Deployment (Fastest)

### Deploy Rules via Console:
1. Open: https://console.firebase.google.com/project/weddings-uptune-d12fa/firestore/rules
2. Copy the entire contents of your `firestore.rules` file
3. Paste in the editor
4. Click "Publish"

### Deploy Indexes via Console:
1. Open: https://console.firebase.google.com/project/weddings-uptune-d12fa/firestore/indexes
2. For each index in firestore.indexes.json, click "Create Index" and fill in:
   - Collection ID
   - Fields to index
   - Click "Create"

## Current Files to Deploy

### firestore.rules
Located at: `/Users/bensmith/Desktop/wedding-app-fresh/firestore.rules`
- Simplified security rules
- Fixes "database not configured" errors

### firestore.indexes.json
Located at: `/Users/bensmith/Desktop/wedding-app-fresh/firestore.indexes.json`
Contains indexes for:
- weddings (userId, createdAt)
- weddings (userId, subscriptionTier, createdAt)
- weddings (partnerEmails, createdAt)
- songs (weddingId, approved)
- songs (weddingId, moments)
- songs (weddingId, mood)
- songs (weddingId, energy)
- songs (weddingId, approved, addedAt)
- guests (weddingId, createdAt)

## After Deployment

1. **Wait for Indexes** (5-10 minutes)
   - Check status at: https://console.firebase.google.com/project/weddings-uptune-d12fa/firestore/indexes
   - All should show "Enabled"

2. **Test Everything**
   - Try signup (email and Google)
   - Try login
   - Access dashboard
   - Create a test wedding

## Troubleshooting

### If you get "Permission Denied"
- Make sure you're logged into the correct Google account
- Check you have Editor/Owner access to weddings-uptune-d12fa

### If indexes take too long
- Small indexes: 2-5 minutes
- Large indexes: 10-20 minutes
- Check Firebase Console for progress

### If rules don't apply immediately
- Rules usually apply within 1 minute
- Try hard refresh (Cmd+Shift+R) in your app

## Quick Deploy Script

Once authenticated, you can use this script:

```bash
#!/bin/bash
echo "Deploying Firestore rules and indexes..."
npx firebase deploy --only firestore --project weddings-uptune-d12fa
echo "Deployment complete! Check indexes at:"
echo "https://console.firebase.google.com/project/weddings-uptune-d12fa/firestore/indexes"
```

Save as `deploy-firestore.sh` and run with `bash deploy-firestore.sh`