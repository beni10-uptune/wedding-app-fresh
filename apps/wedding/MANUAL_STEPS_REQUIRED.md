# Manual Steps Required to Complete Spotify Import

## Current Status
✅ Spotify import script is ready and has found 172 songs
❌ Cannot save to Firestore due to permissions

## Required Steps

### Option 1: Deploy Temporary Rules (Recommended)

1. **Go to Firebase Console**: 
   https://console.firebase.google.com/project/weddings-uptune-d12fa/firestore/rules

2. **Find the `songs_master` rule** (around line 176) and temporarily change:
   ```javascript
   // FROM:
   allow create: if request.auth != null;
   
   // TO:
   allow create: if true;
   ```

3. **Click "Publish" to deploy the rules**

4. **Run the import script**:
   ```bash
   npx tsx scripts/import-spotify-simple.ts
   ```

5. **IMPORTANT: Revert the rules** back to:
   ```javascript
   allow create: if request.auth != null;
   ```

6. **Publish again to secure the database**

### Option 2: Re-authenticate Firebase CLI

1. **Re-authenticate Firebase CLI**:
   ```bash
   firebase login --reauth
   ```

2. **Deploy the rules**:
   ```bash
   firebase deploy --only firestore:rules
   ```

3. **Run the import**:
   ```bash
   npx tsx scripts/import-spotify-simple.ts
   ```

4. **Revert and deploy secure rules**

### Option 3: Enable Anonymous Auth

1. **Go to Firebase Console Authentication**:
   https://console.firebase.google.com/project/weddings-uptune-d12fa/authentication/providers

2. **Enable Anonymous Sign-in**

3. **Run the authenticated import**:
   ```bash
   npx tsx scripts/import-spotify-auth.ts
   ```

## What Happens Next

Once you complete any of the above options, the script will:
- Import 172+ wedding songs from Spotify
- Save them to the `songs_master` collection
- Each song includes:
  - Title, artist, album info
  - Wedding moments (first dance, party, etc.)
  - Wedding moods (romantic, celebratory, etc.)
  - Spotify IDs for future API calls
  - Preview URLs for playing samples

## Verify Success

Check the imported data at:
https://console.firebase.google.com/project/weddings-uptune-d12fa/firestore/data/~2Fsongs_master

## Next Steps After Import

Once the songs are imported, we'll:
1. Implement AI orchestration service with Claude
2. Create API routes for playlist generation
3. Update v3 page to use real AI/database