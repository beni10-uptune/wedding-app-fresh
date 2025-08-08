# Firebase Admin Setup for Spotify Import

## Quick Setup Guide

To run the Spotify import script, you need a Firebase service account. Here's how to get it:

### Step 1: Get Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **wedding-app-426623**
3. Click the gear icon ⚙️ → **Project Settings**
4. Go to **Service Accounts** tab
5. Click **Generate new private key**
6. Save the downloaded JSON file

### Step 2: Extract Required Values

Open the downloaded JSON file and find these values:

```json
{
  "type": "service_account",
  "project_id": "wedding-app-426623",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@wedding-app-426623.iam.gserviceaccount.com",
  ...
}
```

### Step 3: Add to .env.local

Add this line to your `.env.local`:

```bash
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@wedding-app-426623.iam.gserviceaccount.com
```

(Use the actual `client_email` value from your JSON file)

### Step 4: Verify Setup

Your `.env.local` should now have:
- ✅ `SPOTIFY_CLIENT_ID`
- ✅ `SPOTIFY_CLIENT_SECRET`
- ✅ `FIREBASE_PRIVATE_KEY`
- ✅ `FIREBASE_CLIENT_EMAIL` (newly added)
- ✅ `NEXT_PUBLIC_FIREBASE_PROJECT_ID`

### Step 5: Run the Import

```bash
# Test with a small batch first
npx tsx scripts/test-spotify-import.ts

# If successful, run the full import
npm run import:spotify
```

## Alternative: Use Existing Admin Setup

If you already have Firebase Admin working elsewhere in your app, you can check:

1. Look for existing service account usage in:
   - `/src/lib/firebase-admin.ts`
   - Any API routes using admin SDK
   - Scripts that already work with Firestore

2. The client email format is always:
   ```
   firebase-adminsdk-[unique-id]@[project-id].iam.gserviceaccount.com
   ```
   
   For your project it would be something like:
   ```
   firebase-adminsdk-xxxxx@wedding-app-426623.iam.gserviceaccount.com
   ```

## Security Note

⚠️ **Never commit the service account JSON or private key to git!**

The `.env.local` file is already in `.gitignore`, so your secrets are safe there.

## Troubleshooting

If you get permission errors:
1. Make sure the service account has the right roles (should have by default)
2. Try deploying the Firestore rules first:
   ```bash
   firebase deploy --only firestore:rules
   ```

## Next Steps

Once you have the `FIREBASE_CLIENT_EMAIL` added:
1. Run the test import to verify everything works
2. Run the full import to populate your database
3. Check Firebase Console to see the imported songs