/**
 * Script to seed the songs_master collection with wedding songs
 * Run with: npx tsx src/scripts/seed-songs-database.ts
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { ALL_WEDDING_SONGS } from '../data/spotify-wedding-songs';
import { WeddingMoment } from '../types/music-ai';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Initialize Firebase Admin
const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || ''
  })
};

initializeApp(firebaseAdminConfig);
const db = getFirestore();

// Map moment strings to WeddingMoment enum values
const momentMap: Record<string, WeddingMoment> = {
  'prelude': WeddingMoment.PRELUDE,
  'processional': WeddingMoment.PROCESSIONAL,
  'recessional': WeddingMoment.RECESSIONAL,
  'cocktail': WeddingMoment.COCKTAIL,
  'dinner': WeddingMoment.DINNER,
  'first-dance': WeddingMoment.FIRST_DANCE,
  'parent-dance': WeddingMoment.PARENT_DANCE,
  'party': WeddingMoment.PARTY_PEAK,
  'last-dance': WeddingMoment.LAST_DANCE,
  'getting-ready': WeddingMoment.PRELUDE,
  'ceremony': WeddingMoment.PROCESSIONAL,
  'cocktails': WeddingMoment.COCKTAIL,
  'parent-dances': WeddingMoment.PARENT_DANCE,
};

async function seedSongs() {
  console.log('Starting database seed with', ALL_WEDDING_SONGS.length, 'songs');
  
  const batch = db.batch();
  let count = 0;
  
  for (const song of ALL_WEDDING_SONGS) {
    // Convert song to database format
    const dbSong = {
      // Core Spotify data
      spotify_id: (song as any).spotifyId || song.id,
      title: song.title,
      artist: song.artist,
      artists: [song.artist],
      album: song.album || '',
      album_art_url: (song as any).albumArt || (song as any).albumImage || null,
      preview_url: song.previewUrl || null,
      external_urls: {
        spotify: `https://open.spotify.com/track/${(song as any).spotifyId || song.id}`
      },
      
      // Basic metadata
      duration_ms: (song as any).durationMs || (song.duration ? song.duration * 1000 : 180000),
      explicit: song.explicit || false,
      popularity: song.popularity || 50,
      release_date: (song as any).releaseDate || null,
      
      // Audio features (use defaults if not available)
      audio_features: {
        id: (song as any).spotifyId || song.id,
        uri: `spotify:track:${(song as any).spotifyId || song.id}`,
        acousticness: 0.5,
        danceability: (song as any).features?.danceability || 0.7,
        energy: (song as any).features?.energy || 0.6,
        instrumentalness: 0,
        liveness: 0.1,
        speechiness: 0.05,
        valence: (song as any).features?.valence || 0.6,
        key: 0,
        mode: 1,
        tempo: (song as any).bpm || (song as any).features?.tempo || 120,
        time_signature: 4,
        loudness: -10,
        duration_ms: (song as any).durationMs || 180000
      },
      
      // Wedding-specific data
      wedding_moments: (song as any).moments?.map((m: string) => momentMap[m] || WeddingMoment.GENERAL).filter(Boolean) || [WeddingMoment.GENERAL],
      wedding_score: 80,
      wedding_genres: song.genres || ['pop'],
      wedding_moods: ['romantic', 'celebratory'],
      
      // Cultural and demographic
      cultural_fit: (song as any).popularIn || ['western'],
      age_appeal: song.generationAppeal || ['universal'],
      inappropriate_flags: [],
      
      // DJ data
      mixing_data: {
        intro_beats: 16,
        outro_beats: 16,
        mix_in_point_ms: 0,
        mix_out_point_ms: (song as any).durationMs || 180000,
        harmonic_keys: [],
        bpm_range: [
          Math.round(((song as any).bpm || 120) * 0.93),
          Math.round(((song as any).bpm || 120) * 1.07)
        ]
      },
      
      // AI metadata
      ai_metadata: {
        lyrical_themes: [],
        emotional_arc: 'steady',
        confidence_score: 0.8,
        last_analyzed: new Date(),
        analyzed_by_models: ['manual']
      },
      
      // Analytics
      analytics: {
        play_count: 0,
        success_rate: 0.8,
        skip_rate: 0.2,
        user_ratings: [],
        dj_rating: 4
      },
      
      // Metadata
      created_at: new Date(),
      updated_at: new Date(),
      data_version: '1.0.0',
      source: 'seed_script'
    };
    
    // Add to batch
    const docRef = db.collection('songs_master').doc((song as any).spotifyId || song.id);
    batch.set(docRef, dbSong);
    
    count++;
    
    // Commit batch every 500 documents (Firestore limit)
    if (count % 500 === 0) {
      await batch.commit();
      console.log(`Committed ${count} songs...`);
    }
  }
  
  // Commit remaining documents
  if (count % 500 !== 0) {
    await batch.commit();
  }
  
  console.log(`✅ Successfully seeded ${count} songs to the database`);
  
  // Verify the seed worked
  const snapshot = await db.collection('songs_master').limit(5).get();
  console.log(`\n📊 Verification: Found ${snapshot.size} songs in database`);
  console.log('Sample songs:');
  snapshot.forEach(doc => {
    const song = doc.data();
    console.log(`  - ${song.title} by ${song.artist}`);
  });
}

// Run the seed
seedSongs()
  .then(() => {
    console.log('\n🎉 Database seeding complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  });