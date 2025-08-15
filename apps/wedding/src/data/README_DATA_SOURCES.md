# Data Sources Guide

## ✅ ACTIVE - Production Data Sources

### 1. Firestore Collections
- **`songs`** - Primary song database (use this for all song operations)
- **`weddings`** - Wedding data including timelines
- **`users`** - User accounts
- **`invitations`** - Guest invitations
- **`blogPosts`** - Blog content

### 2. Local Song Data (Loaded into Firestore)
- **`spotify-wedding-songs.ts`** - 1,949 real Spotify songs with full metadata
- **`genre-songs/*.ts`** - Genre-specific collections (Hip-Hop, Country, R&B, Rock, Indie)
- These are the SOURCE data that gets seeded into Firestore

## ⚠️ DEPRECATED - Do Not Use

### Mock/Placeholder Data
- **`curatedPlaylists.ts`** - Uses PLACEHOLDER IDs (1, 2, 3) - DO NOT USE
- **`curatedCollections.ts`** - References non-existent songs - DO NOT USE
- **`curatedSongs.ts`** - Mock song data - DO NOT USE

These files contain placeholder data and should be replaced with real Spotify data from the `songs` collection.

## 🎵 How to Work with Songs

### Loading Songs
```typescript
// Use the smart playlist hook
import { useSmartPlaylist } from '@/hooks/useSmartPlaylist'

const { loadSongsFromFirestore, availableSongs } = useSmartPlaylist()
```

### Adding New Songs
1. Add to the appropriate data file in `/src/data/genre-songs/`
2. Run the seeding script: `npx tsx src/scripts/seed-smart-songs-database.ts`
3. Songs will be added to Firestore `songs` collection

### Smart Playlist Generation
The system automatically:
- Loads songs from Firestore or falls back to local data
- Filters by genre preferences
- Distributes songs across wedding moments
- Respects time quotas for each section

## 📊 Database Statistics
- **Total Songs Available**: 1,949+
- **Genres**: 14+ (Pop, Rock, R&B, Hip-Hop, Country, Indie, etc.)
- **Wedding Moments**: 8 (Getting Ready, Ceremony, Cocktails, Dinner, First Dance, Parent Dances, Party, Last Dance)
- **Average Songs per Moment**: 8-50 depending on duration

## 🚨 Important Notes
1. ALWAYS use real Spotify track IDs (22 characters)
2. NEVER create mock or placeholder data
3. Use the `songs` Firestore collection as the source of truth
4. The smart playlist generator handles all song distribution logic