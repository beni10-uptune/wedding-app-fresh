#!/usr/bin/env node

/**
 * Spotify import without authentication
 * IMPORTANT: This requires temporarily updating Firestore rules to allow unauthenticated writes
 * 
 * Before running this script:
 * 1. Update Firestore rules for songs_master to: allow write: if true;
 * 2. Run the import
 * 3. Revert the rules back to: allow write: if request.auth != null;
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  writeBatch,
  Timestamp 
} from 'firebase/firestore';
import { getSpotifyService } from '../src/lib/spotify-service.js';
import type { MasterSong } from '../src/types/music-ai.js';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'weddings-uptune-d12fa',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

console.log('🔧 Environment Check:');
console.log('  SPOTIFY_CLIENT_ID:', process.env.SPOTIFY_CLIENT_ID ? '✅ Set' : '❌ Missing');
console.log('  SPOTIFY_CLIENT_SECRET:', process.env.SPOTIFY_CLIENT_SECRET ? '✅ Set' : '❌ Missing');
console.log('  Firebase Project:', firebaseConfig.projectId);

if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
  console.error('❌ Spotify credentials missing! Please check .env.local');
  process.exit(1);
}

console.log('\n⚠️  IMPORTANT: This script requires temporary Firestore rule changes!');
console.log('   Please ensure you have updated the songs_master rules to allow unauthenticated writes.');
console.log('   After the import, remember to revert the rules for security.\n');

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Limited search terms for initial import
const SEARCH_TERMS = [
  'wedding 2025',
  'first dance songs',
  'wedding party',
  'wedding reception',
  'father daughter dance'
];

async function importSongs() {
  console.log('\n🎵 Starting Spotify import to Firestore (No Auth)...');
  console.log(`📋 Search terms: ${SEARCH_TERMS.length}`);
  
  const spotifyService = getSpotifyService();
  const uniqueSongs = new Map<string, MasterSong>();
  const errors: string[] = [];
  let playlistsProcessed = 0;
  
  try {
    // Initialize Spotify
    await spotifyService.initializeClientCredentials();
    console.log('✅ Spotify authenticated successfully');
    
    // Process each search term
    for (const searchTerm of SEARCH_TERMS) {
      console.log(`\n🔍 Searching for: "${searchTerm}"`);
      
      try {
        // Search for playlists (limit to 3 per search)
        const playlists = await spotifyService.searchPlaylists(searchTerm, { limit: 3 });
        console.log(`  Found ${playlists.length} playlists`);
        
        // Process each playlist
        for (const playlist of playlists) {
          // Skip playlists with very few followers (but handle null followers)
          if (playlist.followers?.total !== undefined && playlist.followers.total < 10) {
            console.log(`  ⏭️ Skipping "${playlist.name}" (only ${playlist.followers.total} followers)`);
            continue;
          }
          
          console.log(`  📀 Processing: "${playlist.name}" (${playlist.followers?.total || 0} followers)`);
          playlistsProcessed++;
          
          try {
            // Get tracks (limit to first 50 for testing)
            const allTracks = await spotifyService.getAllPlaylistTracks(playlist.id);
            const tracks = allTracks.slice(0, 50);
            console.log(`    Processing ${tracks.length} tracks...`);
            
            // Get track IDs
            const trackIds = tracks
              .filter(item => item.track && item.track.id)
              .map(item => item.track.id);
            
            if (trackIds.length > 0) {
              // Audio features are not available with Client Credentials flow
              console.log(`    ⚠️ Note: Audio features require user auth (skipping)`)
              const audioFeatures: any[] = [];
              
              // Convert tracks
              for (const track of tracks) {
                if (!track.track || !track.track.id) continue;
                
                // Skip if we already have this song
                if (uniqueSongs.has(track.track.id)) continue;
                
                const features = audioFeatures.find(f => f && f.id === track.track.id);
                const masterSong = spotifyService.convertToMasterSong(track.track, features);
                
                if (masterSong.spotify_id) {
                  uniqueSongs.set(track.track.id, masterSong as MasterSong);
                }
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
    
    if (uniqueSongs.size > 0) {
      // Save to Firestore in batches
      console.log('\n💾 Saving to Firestore (no auth)...');
      const songs = Array.from(uniqueSongs.values());
      const batchSize = 500; // Firestore batch limit
      let savedCount = 0;
      
      for (let i = 0; i < songs.length; i += batchSize) {
        const batch = writeBatch(db);
        const batchSongs = songs.slice(i, Math.min(i + batchSize, songs.length));
        
        for (const song of batchSongs) {
          const docRef = doc(collection(db, 'songs_master'), song.spotify_id);
          
          // Convert dates to Firestore Timestamps
          const songData = {
            ...song,
            created_at: Timestamp.fromDate(song.created_at as Date),
            updated_at: Timestamp.fromDate(song.updated_at as Date),
            ai_metadata: song.ai_metadata ? {
              ...song.ai_metadata,
              last_analyzed: Timestamp.fromDate(song.ai_metadata.last_analyzed as Date)
            } : undefined
          };
          
          batch.set(docRef, JSON.parse(JSON.stringify(songData)));
        }
        
        try {
          await batch.commit();
          savedCount += batchSongs.length;
          console.log(`  ✅ Saved batch: ${savedCount}/${songs.length} songs`);
        } catch (error: any) {
          if (error.code === 'permission-denied') {
            console.error('\n❌ Firestore Permission Denied!');
            console.error('   Please update your Firestore rules temporarily:');
            console.error('   1. Go to Firebase Console > Firestore > Rules');
            console.error('   2. Change songs_master rules to: allow write: if true;');
            console.error('   3. Save and wait for deployment');
            console.error('   4. Run this script again');
            console.error('   5. After import, revert to: allow write: if request.auth != null;');
            process.exit(1);
          }
          throw error;
        }
      }
      
      console.log(`✅ Successfully saved ${savedCount} songs to Firestore!`);
    }
    
    // Print summary
    console.log('\n📈 Import Summary:');
    console.log(`  Total songs imported: ${uniqueSongs.size}`);
    console.log(`  Playlists processed: ${playlistsProcessed}`);
    console.log(`  Search terms used: ${SEARCH_TERMS.length}`);
    
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
    
    if (errors.length > 0) {
      console.log(`\n⚠️  Errors encountered (${errors.length}):`);
      errors.slice(0, 5).forEach(error => console.log(`  - ${error}`));
    }
    
    console.log('\n✅ Import completed successfully!');
    console.log('\n⚠️  REMEMBER TO REVERT FIRESTORE RULES!');
    console.log('   Change back from: allow write: if true;');
    console.log('   To: allow write: if request.auth != null;');
    console.log('\n📱 Check Firebase Console to verify the data');
    console.log('   https://console.firebase.google.com/project/weddings-uptune-d12fa/firestore/data/~2Fsongs_master');
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the import
importSongs()
  .then(() => {
    console.log('\n🎉 All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Import failed:', error);
    process.exit(1);
  });