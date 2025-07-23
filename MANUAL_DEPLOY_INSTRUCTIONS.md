# 🚨 Manual Firebase Deployment Instructions

Since CLI authentication is having issues, here's how to deploy manually through the Firebase Console:

## Step 1: Deploy Firestore Rules (1 minute)

1. **Open Firebase Console Rules Editor:**
   https://console.firebase.google.com/project/weddings-uptune-d12fa/firestore/rules

2. **Copy these rules and paste them in the editor:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null 
        && request.auth.uid == userId
        && request.resource.data.uid == userId;
      allow update: if request.auth != null 
        && request.auth.uid == userId
        && request.resource.data.uid == resource.data.uid;
    }
    
    // Weddings collection
    match /weddings/{weddingId} {
      allow read: if request.auth != null && (
        request.auth.uid == resource.data.userId ||
        request.auth.email in resource.data.partnerEmails ||
        request.auth.email in resource.data.guestEmails
      );
      
      allow create: if request.auth != null;
      
      allow update: if request.auth != null && (
        request.auth.uid == resource.data.userId ||
        request.auth.email in resource.data.partnerEmails
      );
      
      allow delete: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Songs subcollection
    match /weddings/{weddingId}/songs/{songId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if request.auth != null && (
        request.auth.uid == get(/databases/$(database)/documents/weddings/$(weddingId)).data.userId ||
        request.auth.email in get(/databases/$(database)/documents/weddings/$(weddingId)).data.partnerEmails
      );
    }
    
    // Guests subcollection
    match /weddings/{weddingId}/guests/{guestId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && (
        request.auth.uid == get(/databases/$(database)/documents/weddings/$(weddingId)).data.userId ||
        request.auth.email in get(/databases/$(database)/documents/weddings/$(weddingId)).data.partnerEmails
      );
      allow update: if request.auth != null && (
        request.auth.uid == get(/databases/$(database)/documents/weddings/$(weddingId)).data.userId ||
        request.auth.email in get(/databases/$(database)/documents/weddings/$(weddingId)).data.partnerEmails
      );
      allow delete: if request.auth != null && (
        request.auth.uid == get(/databases/$(database)/documents/weddings/$(weddingId)).data.userId ||
        request.auth.email in get(/databases/$(database)/documents/weddings/$(weddingId)).data.partnerEmails
      );
    }
    
    // Invitations collection
    match /invitations/{inviteId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if request.auth != null;
    }
  }
}
```

3. **Click "Publish"** button

## Step 2: Deploy Firestore Indexes (5 minutes)

1. **Open Firebase Console Indexes:**
   https://console.firebase.google.com/project/weddings-uptune-d12fa/firestore/indexes

2. **Create these indexes one by one:**

### Index 1: Weddings by User
- Collection: `weddings`
- Fields:
  - `userId` (Ascending)
  - `createdAt` (Descending)
- Query scope: Collection

### Index 2: Weddings by User and Tier
- Collection: `weddings`
- Fields:
  - `userId` (Ascending)
  - `subscriptionTier` (Ascending)
  - `createdAt` (Descending)
- Query scope: Collection

### Index 3: Weddings by Partner
- Collection: `weddings`
- Fields:
  - `partnerEmails` (Arrays)
  - `createdAt` (Descending)
- Query scope: Collection

### Index 4: Songs by Wedding
- Collection: `songs`
- Fields:
  - `weddingId` (Ascending)
  - `approved` (Ascending)
- Query scope: Collection group

### Index 5: Songs by Moments
- Collection: `songs`
- Fields:
  - `weddingId` (Ascending)
  - `moments` (Arrays)
- Query scope: Collection group

### Index 6: Songs by Mood
- Collection: `songs`
- Fields:
  - `weddingId` (Ascending)
  - `mood` (Ascending)
- Query scope: Collection group

### Index 7: Songs by Energy
- Collection: `songs`
- Fields:
  - `weddingId` (Ascending)
  - `energy` (Ascending)
- Query scope: Collection group

### Index 8: Songs Full Query
- Collection: `songs`
- Fields:
  - `weddingId` (Ascending)
  - `approved` (Ascending)
  - `addedAt` (Descending)
- Query scope: Collection group

### Index 9: Guests by Wedding
- Collection: `guests`
- Fields:
  - `weddingId` (Ascending)
  - `createdAt` (Descending)
- Query scope: Collection group

## Step 3: Wait for Indexes to Build

- Small indexes: 2-5 minutes
- Large indexes: 5-10 minutes
- Refresh the page to see status updates
- All indexes should show "Enabled" when ready

## Step 4: Test Your App

Once all indexes show "Enabled":

1. Test signup (email and Google)
2. Test login
3. Test dashboard access
4. Test creating a wedding
5. Test on mobile

## Alternative: Use the Deployment Script

After manual authentication in your browser:

```bash
# Navigate to project
cd /Users/bensmith/Desktop/wedding-app-fresh

# Run the deployment script
./deploy-firestore.sh
```

## If You Still Have Issues

The manual console method is the most reliable. If you need help:
1. Make sure you're logged into the correct Google account
2. Verify you have Editor/Owner access to the project
3. Check the browser console for specific errors