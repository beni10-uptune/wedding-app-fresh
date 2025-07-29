# Firebase Setup Guide for UpTune for Weddings

## 🔥 Why Firebase is Perfect for This Project

Firebase provides everything we need for UpTune for Weddings:

- **Authentication**: Easy social logins for couples and guests
- **Firestore**: Real-time database perfect for collaborative playlist building
- **Storage**: File uploads for wedding photos and music
- **Hosting**: Fast, global CDN for our static site
- **Analytics**: Track user engagement and conversion
- **Functions**: Serverless backend for payments and DJ exports

## 📋 Setup Steps

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name it: `uptune-weddings` (or your preferred name)
4. Enable Google Analytics (recommended)
5. Choose your Analytics account

### 2. Enable Required Services

#### Authentication
1. Go to Authentication → Sign-in method
2. Enable these providers:
   - **Email/Password** (for couples)
   - **Google** (easy guest login)
   - **Facebook** (optional, popular for weddings)

#### Firestore Database
1. Go to Firestore Database
2. Click "Create database"
3. Start in **test mode** (we'll deploy security rules later)
4. Choose your region (Europe for UK users)

#### Storage
1. Go to Storage
2. Click "Get started"
3. Start in **test mode**
4. Choose same region as Firestore

#### Hosting
1. Go to Hosting
2. Click "Get started"
3. We'll deploy via CLI later

### 3. Configure Environment Variables

1. Go to Project Settings → General
2. Scroll to "Your apps" section
3. Click "Add app" → Web app
4. Register app name: `uptune-weddings-web`
5. Copy the configuration object

Create `.env.local` in your project root:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id

# Stripe Configuration (for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Other Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Firebase CLI Setup

```bash
# Login to Firebase
npx firebase login

# Initialize Firebase in your project
npx firebase init

# Select these features:
# - Firestore: Configure security rules and indexes
# - Storage: Configure security rules
# - Hosting: Configure files for Firebase Hosting
# - Emulators: Set up local emulators

# When prompted:
# - Use existing project: uptune-weddings
# - Firestore rules file: firestore.rules (already exists)
# - Firestore indexes file: firestore.indexes.json (already exists)
# - Public directory: out
# - Single-page app: Yes
# - Automatic builds: No
# - Storage rules file: storage.rules (already exists)
# - Emulators: Auth, Firestore, Storage
```

### 5. Deploy Security Rules

```bash
# Deploy Firestore rules
npx firebase deploy --only firestore:rules

# Deploy Storage rules
npx firebase deploy --only storage:rules

# Deploy indexes
npx firebase deploy --only firestore:indexes
```

### 6. Test with Emulators

```bash
# Start Firebase emulators
npm run firebase:emulators

# This will start:
# - Auth Emulator: http://localhost:9099
# - Firestore Emulator: http://localhost:8080
# - Storage Emulator: http://localhost:9199
# - Emulator UI: http://localhost:4000
```

### 7. Deploy to Production

```bash
# Build and deploy
npm run firebase:deploy

# Or deploy individually:
npx firebase deploy --only hosting
npx firebase deploy --only firestore
npx firebase deploy --only storage
```

## 🏗 Database Structure

Our Firestore database will have these collections:

### `/users/{userId}`
```typescript
{
  id: string
  email: string
  displayName: string
  photoURL?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### `/weddings/{weddingId}`
```typescript
{
  id: string
  title: string
  coupleNames: string[]
  weddingDate: Timestamp
  venue?: string
  owners: string[] // User IDs of the couple
  collaborators: string[] // User IDs of guests
  status: 'planning' | 'active' | 'completed'
  paymentStatus: 'pending' | 'paid' | 'refunded'
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### `/musicLibrary/{songId}`
```typescript
{
  id: string
  title: string
  artist: string
  genre: string
  weddingMoment: 'ceremony' | 'cocktail' | 'dinner' | 'dancing'
  mood: string[]
  popularity: number
  spotifyId?: string
  previewUrl?: string
  imageUrl?: string
  tags: string[]
}
```

### `/weddings/{weddingId}/suggestions/{suggestionId}`
```typescript
{
  id: string
  songId?: string
  customSong?: CustomSong
  suggestedBy: string
  suggestedFor: WeddingMoment
  message?: string
  status: 'pending' | 'approved' | 'rejected'
  votes: number
  createdAt: Timestamp
}
```

### `/weddings/{weddingId}/playlists/{playlistId}`
```typescript
{
  id: string
  name: string
  weddingMoment: WeddingMoment
  songs: PlaylistSong[]
  isPublic: boolean
  createdBy: string
  createdAt: Timestamp
}
```

## 🔐 Security Rules

Our security rules ensure:
- Users can only access their own data
- Wedding owners can manage their weddings
- Guests can suggest songs and vote
- Music library is read-only for authenticated users
- Payment records are private

## 🚀 Next Steps

1. **Set up authentication UI** - Login/signup components
2. **Create wedding creation flow** - Let couples create their wedding
3. **Build music library** - Curated song database
4. **Implement collaboration** - Guest invitations and suggestions
5. **Add payment integration** - Stripe for £25 payments
6. **Build DJ export** - Export playlists for DJs

## 📊 Analytics & Monitoring

Firebase provides built-in analytics to track:
- User engagement
- Popular songs
- Conversion rates
- Wedding completion rates
- Payment success rates

## 💰 Cost Estimation

Firebase pricing is very favorable for this project:

**Free Tier Includes:**
- 50,000 reads/day
- 20,000 writes/day
- 1GB storage
- 10GB hosting transfer/month

**Estimated Monthly Cost (1000 active weddings):**
- Firestore: ~£10-20/month
- Storage: ~£5-10/month
- Hosting: Free (under 10GB)
- Authentication: Free
- **Total: £15-30/month**

This scales perfectly with your £25 per wedding model!

## 🎯 Benefits for Wedding Use Case

1. **Real-time Collaboration**: Perfect for couples and guests working together
2. **Offline Support**: Works even with poor wedding venue WiFi
3. **Scalable**: Handles peak wedding season traffic
4. **Secure**: Built-in authentication and security rules
5. **Fast**: Global CDN for quick loading
6. **Cost-effective**: Pay only for what you use

Firebase is the perfect choice for UpTune for Weddings! 🎵💕 