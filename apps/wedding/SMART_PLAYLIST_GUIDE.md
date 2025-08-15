# Smart Playlist Generation System

## Overview
The smart playlist generation system intelligently creates wedding playlists based on:
- Selected music genres (pop, rock, R&B, hip-hop, country, indie, etc.)
- Wedding moment requirements (ceremony, cocktails, dinner, party, etc.)
- Time allocations and song quotas for each section
- Energy levels and mood matching

## Key Features

### 1. Genre-Based Filtering
- **14+ genres available**: Pop, Rock, R&B, Hip-Hop, Country, Indie, Electronic, Jazz, Soul, Classical, Acoustic, Latin, Reggae, Funk
- **Multi-genre support**: Select multiple genres for a mixed playlist
- **Smart distribution**: Songs are intelligently distributed across wedding moments based on genre suitability

### 2. Time-Based Quotas
Each wedding moment has specific song quotas to match the recommended duration:

| Moment | Duration | Song Count | Energy Level |
|--------|----------|------------|--------------|
| Getting Ready | 30 min | 8-12 songs | Medium (2-3) |
| Ceremony | 20 min | 5-8 songs | Low (1-3) |
| Cocktails | 90 min | 22-30 songs | Medium (2-4) |
| Dinner | 90 min | 22-30 songs | Low-Medium (2-3) |
| First Dance | 5 min | 1-2 songs | Variable (2-4) |
| Parent Dances | 10 min | 2-4 songs | Medium (2-3) |
| Party Time | 180 min | 45-60 songs | High (3-5) |
| Last Dance | 10 min | 2-4 songs | High (3-5) |

### 3. Smart Song Selection Algorithm
The algorithm scores each song based on:
- **Genre Match (40%)**: How well the song's genre fits the selected filters
- **Energy Level (30%)**: How well the song's energy matches the moment
- **Moment Suitability (20%)**: Whether the song is tagged for that moment
- **Popularity (10%)**: Spotify popularity score

## How to Use

### In the Builder UI
1. Navigate to the wedding builder
2. Click the "Genres" tab in the left panel
3. Select one or more genres you want for your wedding
4. Click "Apply Filters" to generate a smart playlist
5. The timeline will be automatically populated with appropriate songs for each moment

### Database Seeding
To populate the songs database with genre-tagged songs:

```bash
cd apps/wedding
npx tsx src/scripts/seed-smart-songs-database.ts
```

This will:
- Import 1,000+ curated wedding songs
- Tag them with appropriate genres and moments
- Create searchable keywords
- Set up metadata for quick filtering

## Technical Implementation

### Core Files
- `/src/lib/smart-playlist-generator.ts` - Smart selection algorithm
- `/src/hooks/useSmartPlaylist.ts` - React hook for playlist management
- `/src/app/wedding/[id]/builder/components/GenreFilter.tsx` - UI component
- `/src/scripts/seed-smart-songs-database.ts` - Database seeding script

### Data Flow
1. User selects genres in the UI
2. Hook loads songs from Firestore or local data
3. Algorithm scores and filters songs for each moment
4. Timeline is generated with proper quotas
5. Builder UI updates with new playlist

## Genre Suitability Matrix

The system uses a weighted matrix to determine which genres work best for each moment:

### Best Genres by Moment
- **Ceremony**: Classical, Acoustic, Indie
- **Cocktails**: Jazz, Soul, R&B
- **Dinner**: Jazz, Soul, Acoustic
- **First Dance**: R&B, Pop, Country
- **Parent Dances**: Country, Soul, Pop
- **Party**: Pop, Hip-Hop, Electronic
- **Last Dance**: Pop, Rock, R&B

## API Integration

The system integrates with:
- **Firestore**: For storing and retrieving song data
- **Spotify API**: For track information and preview URLs
- **Firebase Auth**: For user authentication and permissions

## Future Enhancements
- AI-powered mood detection
- Guest preference integration
- Real-time collaborative filtering
- Automated BPM progression
- Cultural and regional preferences