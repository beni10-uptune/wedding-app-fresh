#!/usr/bin/env node

/**
 * Script to import wedding songs from Spotify and populate Firestore
 * Usage: npm run import-spotify-songs
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getSpotifyService } from '../src/lib/spotify-service';
import { MasterSong, SpotifyImportOptions } from '../src/types/music-ai';

// Load environment variables from the wedding app
config({ path: resolve(__dirname, '../.env.local') });

// Use NEXT_PUBLIC variables as fallback
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL;
const FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY;

if (!FIREBASE_PROJECT_ID) {
  console.error('❌ Firebase project ID missing!');
  console.error('   Set either FIREBASE_PROJECT_ID or NEXT_PUBLIC_FIREBASE_PROJECT_ID in .env.local');
  process.exit(1);
}

// Initialize Firebase Admin
let firebaseAdmin;
if (FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY) {
  firebaseAdmin = initializeApp({
    credential: cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
  console.log('✅ Using Firebase Admin with service account credentials');
} else {
  // Try with just project ID
  firebaseAdmin = initializeApp({
    projectId: FIREBASE_PROJECT_ID,
  });
  console.log('⚠️  Using Firebase Admin with project ID only - may have limited permissions');
  console.log('   For full access, add FIREBASE_CLIENT_EMAIL to .env.local');
}

const db = getFirestore(firebaseAdmin);

// Wedding-specific search terms for comprehensive coverage
const WEDDING_SEARCH_TERMS = [
  // General wedding
  'wedding',
  'wedding 2025',
  'wedding 2024',
  'wedding reception',
  'wedding playlist',
  'wedding songs',
  
  // Specific moments
  'first dance',
  'first dance songs',
  'father daughter dance',
  'mother son dance',
  'wedding processional',
  'wedding recessional',
  'wedding ceremony',
  'wedding entrance',
  'bridal party entrance',
  'wedding dinner music',
  'wedding cocktail hour',
  'wedding party songs',
  
  // Genres
  'wedding country',
  'wedding rock',
  'wedding pop',
  'wedding r&b',
  'wedding hip hop',
  'wedding classical',
  'wedding jazz',
  'wedding indie',
  'wedding electronic',
  
  // Cultural
  'indian wedding',
  'jewish wedding',
  'latin wedding',
  'african wedding',
  'irish wedding',
  'italian wedding',
  
  // Moods and themes
  'romantic songs',
  'love songs',
  'celebration songs',
  'party classics',
  'wedding slow songs',
  'upbeat wedding songs',
];

async function importSongs() {
  console.log('🎵 Starting Spotify wedding songs import...');
  console.log(`📋 Will search for ${WEDDING_SEARCH_TERMS.length} different terms`);
  
  const spotifyService = getSpotifyService();
  const uniqueSongs = new Map<string, MasterSong>();
  const errors: string[] = [];
  
  try {
    // Initialize Spotify client credentials
    await spotifyService.initializeClientCredentials();
    console.log('✅ Spotify authenticated successfully');
    
    // Process each search term
    for (const searchTerm of WEDDING_SEARCH_TERMS) {
      console.log(`\n🔍 Searching for: "${searchTerm}"`);
      
      try {
        // Search for playlists
        const playlists = await spotifyService.searchPlaylists(searchTerm, { limit: 10 });
        console.log(`  Found ${playlists.length} playlists`);
        
        // Process each playlist
        for (const playlist of playlists) {
          // Skip playlists with very few followers (likely low quality)
          if (playlist.followers && playlist.followers.total < 50) {
            console.log(`  ⏭️  Skipping "${playlist.name}" (only ${playlist.followers.total} followers)`);
            continue;
          }
          
          console.log(`  📀 Processing playlist: "${playlist.name}" (${playlist.followers?.total || 0} followers)`);
          
          try {
            // Get all tracks from playlist
            const tracks = await spotifyService.getAllPlaylistTracks(playlist.id);
            console.log(`    Found ${tracks.length} tracks`);
            
            // Get audio features for tracks (in batches)
            const trackIds = tracks
              .filter(item => item.track && item.track.id)
              .map(item => item.track.id);
            
            if (trackIds.length > 0) {
              const audioFeatures = await spotifyService.getAudioFeatures(trackIds);
              
              // Convert and store each track
              for (let i = 0; i < tracks.length; i++) {
                const track = tracks[i].track;
                if (!track || !track.id) continue;
                
                // Skip if we already have this song
                if (uniqueSongs.has(track.id)) {
                  const existing = uniqueSongs.get(track.id)!;
                  // Update playlist context
                  if (!existing.ai_metadata.analyzed_by_models.includes(searchTerm)) {
                    existing.ai_metadata.analyzed_by_models.push(searchTerm);
                  }
                  continue;
                }
                
                // Find corresponding audio features
                const features = audioFeatures.find(f => f && f.id === track.id);
                
                // Convert to MasterSong format
                const masterSong = spotifyService.convertToMasterSong(track, features);
                
                // Add search context
                if (masterSong.ai_metadata) {
                  masterSong.ai_metadata.analyzed_by_models = [searchTerm];
                }
                
                uniqueSongs.set(track.id, masterSong as MasterSong);
              }
            }
          } catch (error) {
            errors.push(`Failed to process playlist "${playlist.name}": ${error}`);
            console.error(`    ❌ Error: ${error}`);
          }
        }
      } catch (error) {
        errors.push(`Failed to search for "${searchTerm}": ${error}`);
        console.error(`  ❌ Error searching: ${error}`);
      }
    }
    
    console.log(`\n📊 Import complete! Found ${uniqueSongs.size} unique songs`);
    
    // Save to Firestore in batches
    console.log('\n💾 Saving to Firestore...');
    const songs = Array.from(uniqueSongs.values());
    const batchSize = 500; // Firestore batch limit
    
    for (let i = 0; i < songs.length; i += batchSize) {
      const batch = db.batch();
      const batchSongs = songs.slice(i, Math.min(i + batchSize, songs.length));
      
      for (const song of batchSongs) {
        const docRef = db.collection('songs_master').doc(song.spotify_id);
        batch.set(docRef, JSON.parse(JSON.stringify(song))); // Convert to plain object
      }
      
      await batch.commit();
      console.log(`  Saved batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(songs.length / batchSize)}`);
    }
    
    console.log('✅ All songs saved to Firestore!');
    
    // Print summary
    console.log('\n📈 Import Summary:');
    console.log(`  Total songs imported: ${uniqueSongs.size}`);
    console.log(`  Search terms processed: ${WEDDING_SEARCH_TERMS.length}`);
    
    if (errors.length > 0) {
      console.log(`\n⚠️  Errors encountered (${errors.length}):`);
      errors.slice(0, 5).forEach(error => console.log(`  - ${error}`));
      if (errors.length > 5) {
        console.log(`  ... and ${errors.length - 5} more`);
      }
    }
    
    // Analyze imported songs
    console.log('\n🎵 Song Analysis:');
    const moments = new Map<string, number>();
    const moods = new Map<string, number>();
    
    for (const song of uniqueSongs.values()) {
      // Count moments
      for (const moment of song.wedding_moments) {
        moments.set(moment, (moments.get(moment) || 0) + 1);
      }
      
      // Count moods
      for (const mood of song.wedding_moods) {
        moods.set(mood, (moods.get(mood) || 0) + 1);
      }
    }
    
    console.log('\n  Top Wedding Moments:');
    Array.from(moments.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .forEach(([moment, count]) => {
        console.log(`    ${moment}: ${count} songs`);
      });
    
    console.log('\n  Top Wedding Moods:');
    Array.from(moods.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .forEach(([mood, count]) => {
        console.log(`    ${mood}: ${count} songs`);
      });
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the import
importSongs()
  .then(() => {
    console.log('\n🎉 Import script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Import script failed:', error);
    process.exit(1);
  });