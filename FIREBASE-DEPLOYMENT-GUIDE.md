# Complete Firebase Deployment Guide

## Prerequisites

1. **Node.js** installed (v16 or higher)
2. **Firebase project** created in Firebase Console
3. **Git** installed

## Step 1: Install Firebase CLI

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Verify installation
firebase --version
```

## Step 2: Login to Firebase

```bash
# Login to your Firebase account
firebase login

# This will open a browser window for authentication
# After successful login, you'll see:
# ✔  Success! Logged in as your@email.com
```

## Step 3: Initialize Firebase in Your Project

```bash
# Navigate to your project directory
cd /Users/bensmith/Desktop/wedding-app-fresh

# Initialize Firebase
firebase init

# You'll see the Firebase CLI menu
# Select the following options using SPACE key:
# ◯ Firestore: Configure security rules and indexes files
# ◯ Functions: Configure a Cloud Functions directory
# ◯ Hosting: Configure files for Firebase Hosting
# (Press SPACE to select, then ENTER to confirm)
```

### During Firebase Init:

1. **Select/Create Project**:
   - Use an existing project → Select your project from the list
   - OR Create a new project

2. **Firestore Setup**:
   - What file should be used for Firestore Rules? `firestore.rules` (press Enter to accept)
   - What file should be used for Firestore indexes? `firestore.indexes.json` (press Enter to accept)

3. **Hosting Setup** (if selected):
   - What do you want to use as your public directory? `out` (for Next.js static export)
   - Configure as a single-page app? `No`
   - Set up automatic builds with GitHub? `No` (Vercel handles this)

## Step 4: Deploy Firestore Rules (CRITICAL - DO THIS NOW!)

```bash
# Deploy only Firestore rules to fix the permissions error
firebase deploy --only firestore:rules

# You should see:
# ✔  Deploy complete!
# ✔  firestore: released rules firestore.rules
```

## Step 5: Deploy Firestore Indexes (if needed)

```bash
# Deploy Firestore indexes
firebase deploy --only firestore:indexes
```

## Step 6: Full Deployment (All Services)

```bash
# Deploy everything
firebase deploy

# Or deploy specific services:
firebase deploy --only firestore
firebase deploy --only functions
firebase deploy --only hosting
```

## Step 7: Verify Deployment

1. **Check Firestore Rules**:
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Select your project
   - Navigate to Firestore Database → Rules
   - Verify the rules match your `firestore.rules` file

2. **Test the App**:
   - Try creating a new account
   - Complete the wedding creation flow
   - Verify no "missing permissions" errors

## Common Commands

```bash
# View current project
firebase projects:list

# Switch between projects
firebase use <project-id>

# Deploy specific files
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes

# Deploy with debugging
firebase deploy --debug

# See what will be deployed (dry run)
firebase deploy --only firestore:rules --dry-run
```

## Troubleshooting

### "Permission Denied" Errors
- Make sure you've deployed the latest `firestore.rules`
- Check that your user is authenticated
- Verify the rules syntax in Firebase Console

### "Project Not Found"
```bash
# List available projects
firebase projects:list

# Select correct project
firebase use --add
```

### "Not in a Firebase app directory"
- Make sure you're in the project root directory
- Run `firebase init` if needed

## Project-Specific Notes

Your `firestore.rules` file includes:
- User document creation/update rules
- Wedding document ownership rules
- Playlist subcollection rules (newly added)
- Guest submission rules
- Public invitation rules

**IMPORTANT**: The recent fix added missing rules for:
- `/weddings/{weddingId}/playlists/{playlistId}`
- `/weddings/{weddingId}/invitations/{invitationId}`
- `/weddings/{weddingId}/suggestions/{suggestionId}`
- `/weddings/{weddingId}/votes/{voteId}`

These were causing the "missing permissions" error during wedding creation.

## Quick Start (Do This Now!)

```bash
# 1. Install Firebase CLI (if not already installed)
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Deploy the rules to fix permissions
firebase deploy --only firestore:rules

# That's it! The permissions error should be fixed.
```

## Environment Variables

Make sure your `.env.local` file has these Firebase config values:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

These should match your Firebase project configuration.