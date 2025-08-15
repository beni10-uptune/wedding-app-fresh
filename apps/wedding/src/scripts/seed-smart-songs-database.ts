/**
 * Seed Smart Songs Database
 * Populates Firestore with comprehensive song data with proper genre tagging
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

// Import all song collections
import { getUnifiedFilteredSongs } from '../data/unifiedMasterPlaylist';
import { HIP_HOP_WEDDING_SONGS } from '../data/genre-songs/hip-hop-wedding-songs';
import { COUNTRY_WEDDING_SONGS } from '../data/genre-songs/country-wedding-songs';
import { RNB_WEDDING_SONGS } from '../data/genre-songs/rnb-wedding-songs';
import { ROCK_WEDDING_SONGS } from '../data/genre-songs/rock-wedding-songs';
import { INDIE_WEDDING_SONGS } from '../data/genre-songs/indie-wedding-songs';

// Initialize Firebase Admin
if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
  console.error('Missing Firebase Admin SDK credentials in environment variables');
  process.exit(1);
}

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
});

const db = getFirestore(app);

interface FirestoreSong {
  id: string;
  spotifyId: string;
  title: string;
  artist: string;
  album: string;
  albumArt: string;
  duration: number; // in seconds
  bpm?: number;
  energyLevel: number; // 1-5
  explicit: boolean;
  genres: string[];
  moments: string[]; // wedding moments this song is suitable for
  generationAppeal: string[];
  popularIn: string[];
  decade: string;
  moodTags: string[];
  spotifyPopularity: number;
  previewUrl?: string;
  spotifyUri: string;
  audioFeatures?: {
    danceability: number;
    energy: number;
    valence: number;
    acousticness: number;
    tempo: number;
  };
  addedAt: Timestamp;
  lastUpdated: Timestamp;
  searchKeywords: string[]; // For better search
}

/**
 * Normalize and enhance song data for Firestore
 */
function prepareSongForFirestore(song: any, defaultGenre?: string): FirestoreSong | null {
  // Extract Spotify ID
  let spotifyId = song.id || song.spotifyId;
  if (spotifyId?.startsWith('spotify:track:')) {
    spotifyId = spotifyId.replace('spotify:track:', '');
  }
  
  // Skip invalid songs
  if (!spotifyId || !song.title || !song.artist) {
    return null;
  }
  
  // Determine genres
  let genres = song.genres || [];
  if (genres.length === 0 && defaultGenre) {
    genres = [defaultGenre];
  }
  genres = genres.map((g: string) => normalizeGenre(g));
  
  // Determine suitable moments based on energy and genres
  let moments = song.moments || [];
  if (moments.length === 0) {
    moments = inferMoments(song.energyLevel || 3, genres);
  }
  
  // Create search keywords for better search functionality
  const searchKeywords = [
    song.title.toLowerCase(),
    song.artist.toLowerCase(),
    ...(song.album ? [song.album.toLowerCase()] : []),
    ...genres,
    ...moments,
    song.decade || '2020s'
  ].filter(Boolean);
  
  return {
    id: spotifyId,
    spotifyId: spotifyId,
    title: song.title,
    artist: song.artist,
    album: song.album || 'Unknown Album',
    albumArt: song.albumArt || song.albumImage || '',
    duration: song.duration || 210, // Default 3.5 minutes
    bpm: song.bpm || song.tempo,
    energyLevel: song.energyLevel || 3,
    explicit: song.explicit || false,
    genres: genres,
    moments: moments,
    generationAppeal: song.generationAppeal || ['millennial', 'gen_z'],
    popularIn: song.popularIn || ['universal'],
    decade: song.decade || determineDecade(song.releaseDate),
    moodTags: song.moodTags || inferMoodTags(song.energyLevel, genres),
    spotifyPopularity: song.spotifyPopularity || song.popularity || 70,
    previewUrl: song.previewUrl,
    spotifyUri: `spotify:track:${spotifyId}`,
    audioFeatures: song.audioFeatures || {
      danceability: song.danceability || 0.5,
      energy: song.energy || (song.energyLevel ? song.energyLevel / 5 : 0.5),
      valence: song.valence || 0.5,
      acousticness: song.acousticness || 0.3,
      tempo: song.bpm || song.tempo || 120
    },
    addedAt: Timestamp.now(),
    lastUpdated: Timestamp.now(),
    searchKeywords: searchKeywords
  };
}

/**
 * Normalize genre strings
 */
function normalizeGenre(genre: string): string {
  const normalized = genre.toLowerCase().trim();
  const mappings: Record<string, string> = {
    'rnb': 'r&b',
    'r & b': 'r&b',
    'r and b': 'r&b',
    'hiphop': 'hip-hop',
    'hip hop': 'hip-hop',
    'electronic dance': 'electronic',
    'edm': 'electronic',
    'country pop': 'country',
    'indie rock': 'indie',
    'indie pop': 'indie',
    'classic rock': 'rock',
    'soft rock': 'rock',
    'hard rock': 'rock',
    'alternative rock': 'rock',
    'modern rock': 'rock'
  };
  
  return mappings[normalized] || normalized;
}

/**
 * Infer suitable wedding moments based on energy and genres
 */
function inferMoments(energyLevel: number, genres: string[]): string[] {
  const moments: string[] = [];
  
  // Low energy (1-2)
  if (energyLevel <= 2) {
    moments.push('ceremony', 'dinner');
    if (genres.includes('acoustic') || genres.includes('indie')) {
      moments.push('getting-ready');
    }
  }
  
  // Medium energy (3)
  if (energyLevel === 3) {
    moments.push('cocktails', 'dinner');
    if (genres.includes('pop') || genres.includes('r&b')) {
      moments.push('first-dance');
    }
    if (genres.includes('country') || genres.includes('soul')) {
      moments.push('parent-dances');
    }
  }
  
  // High energy (4-5)
  if (energyLevel >= 4) {
    moments.push('party');
    if (energyLevel === 5) {
      moments.push('last-dance');
    }
    if (genres.includes('pop') || genres.includes('rock')) {
      moments.push('cocktails');
    }
  }
  
  // Genre-specific additions
  if (genres.includes('classical') || genres.includes('acoustic')) {
    moments.push('ceremony');
  }
  if (genres.includes('jazz') || genres.includes('soul')) {
    moments.push('cocktails', 'dinner');
  }
  
  // Remove duplicates
  return [...new Set(moments)];
}

/**
 * Infer mood tags based on energy and genres
 */
function inferMoodTags(energyLevel: number, genres: string[]): string[] {
  const tags: string[] = [];
  
  if (energyLevel <= 2) {
    tags.push('romantic', 'mellow', 'intimate');
  } else if (energyLevel === 3) {
    tags.push('upbeat', 'feel-good', 'cheerful');
  } else {
    tags.push('energetic', 'party', 'celebration');
  }
  
  // Genre-specific tags
  if (genres.includes('r&b') || genres.includes('soul')) {
    tags.push('soulful', 'smooth');
  }
  if (genres.includes('hip-hop')) {
    tags.push('urban', 'groovy');
  }
  if (genres.includes('country')) {
    tags.push('heartfelt', 'rustic');
  }
  if (genres.includes('electronic')) {
    tags.push('modern', 'danceable');
  }
  
  return tags;
}

/**
 * Determine decade from release date
 */
function determineDecade(releaseDate?: string): string {
  if (!releaseDate) return '2020s';
  const year = parseInt(releaseDate.substring(0, 4));
  if (year < 1960) return 'classic';
  if (year < 1970) return '1960s';
  if (year < 1980) return '1970s';
  if (year < 1990) return '1980s';
  if (year < 2000) return '1990s';
  if (year < 2010) return '2000s';
  if (year < 2020) return '2010s';
  return '2020s';
}

/**
 * Main seeding function
 */
async function seedDatabase() {
  console.log('🎵 Starting smart song database seeding...\n');
  
  const songsCollection = db.collection('songs');
  const batch = db.batch();
  const processedIds = new Set<string>();
  let totalProcessed = 0;
  let skipped = 0;
  
  // Get unified songs
  const unifiedSongs = getUnifiedFilteredSongs({});
  
  // Process all song collections
  const collections = [
    { songs: HIP_HOP_WEDDING_SONGS, genre: 'hip-hop', name: 'Hip Hop' },
    { songs: COUNTRY_WEDDING_SONGS, genre: 'country', name: 'Country' },
    { songs: RNB_WEDDING_SONGS, genre: 'r&b', name: 'R&B' },
    { songs: ROCK_WEDDING_SONGS, genre: 'rock', name: 'Rock' },
    { songs: INDIE_WEDDING_SONGS, genre: 'indie', name: 'Indie' },
    { songs: unifiedSongs, genre: null, name: 'Master Playlist' }
  ];
  
  for (const collection of collections) {
    console.log(`\n📀 Processing ${collection.name} collection...`);
    let collectionCount = 0;
    
    for (const song of collection.songs) {
      const preparedSong = prepareSongForFirestore(song, collection.genre || undefined);
      
      if (!preparedSong) {
        skipped++;
        continue;
      }
      
      // Skip duplicates
      if (processedIds.has(preparedSong.id)) {
        continue;
      }
      
      processedIds.add(preparedSong.id);
      
      // Add to batch
      const docRef = songsCollection.doc(preparedSong.id);
      batch.set(docRef, preparedSong, { merge: true });
      
      collectionCount++;
      totalProcessed++;
      
      // Commit batch every 400 documents (Firestore limit is 500)
      if (totalProcessed % 400 === 0) {
        await batch.commit();
        console.log(`  ✓ Committed batch (${totalProcessed} songs processed)`);
      }
    }
    
    console.log(`  ✓ Added ${collectionCount} songs from ${collection.name}`);
  }
  
  // Commit final batch
  if (totalProcessed % 400 !== 0) {
    await batch.commit();
  }
  
  // Create indexes for better query performance
  console.log('\n📑 Creating collection metadata...');
  
  const metadataDoc = {
    totalSongs: totalProcessed,
    genres: Array.from(new Set(
      Array.from(processedIds).map(id => collections.find(c => 
        c.songs.some(s => s.id === id))?.genre
      ).filter(Boolean)
    )),
    moments: ['getting-ready', 'ceremony', 'cocktails', 'dinner', 'first-dance', 'parent-dances', 'party', 'last-dance'],
    lastUpdated: Timestamp.now(),
    version: '2.0'
  };
  
  const genresArray = Array.from(new Set(
    collections
      .filter(c => c.genre)
      .map(c => c.genre!)
  ));
  
  const metadataDocClean = {
    ...metadataDoc,
    genres: genresArray
  };
  
  await db.collection('metadata').doc('songs').set(metadataDocClean);
  
  console.log('\n✅ Database seeding complete!');
  console.log(`   Total songs added: ${totalProcessed}`);
  console.log(`   Songs skipped: ${skipped}`);
  console.log(`   Unique genres: ${metadataDoc.genres.join(', ')}`);
}

// Run the seeding
seedDatabase()
  .then(() => {
    console.log('\n🎉 All done! Your smart song database is ready.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error seeding database:', error);
    process.exit(1);
  });