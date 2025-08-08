#!/usr/bin/env node

/**
 * Test script to import a small batch of wedding songs from Spotify
 * This is a lighter version for testing the setup
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getSpotifyService } from '../src/lib/spotify-service.js';
import type { MasterSong } from '../src/types/music-ai.js';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

// Use NEXT_PUBLIC variables as fallback
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'weddings-uptune-d12fa';
const FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL || 'firebase-adminsdk-fbsvc@weddings-uptune-d12fa.iam.gserviceaccount.com';
const FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY;

console.log('🔧 Environment Check:');
console.log('  SPOTIFY_CLIENT_ID:', process.env.SPOTIFY_CLIENT_ID ? '✅ Set' : '❌ Missing');
console.log('  SPOTIFY_CLIENT_SECRET:', process.env.SPOTIFY_CLIENT_SECRET ? '✅ Set' : '❌ Missing');
console.log('  FIREBASE_PROJECT_ID:', FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing');
console.log('  FIREBASE_CLIENT_EMAIL:', FIREBASE_CLIENT_EMAIL ? '✅ Set' : '❌ Missing');
console.log('  FIREBASE_PRIVATE_KEY:', FIREBASE_PRIVATE_KEY ? '✅ Set' : '❌ Missing');

if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
  console.error('❌ Spotify credentials missing! Please check .env.local');
  process.exit(1);
}

if (!FIREBASE_PROJECT_ID) {
  console.error('❌ Firebase project ID missing! Please check .env.local');
  console.error('   Need either FIREBASE_PROJECT_ID or NEXT_PUBLIC_FIREBASE_PROJECT_ID');
  process.exit(1);
}

if (!FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
  console.error('⚠️  Firebase Admin credentials not found - will try with application default credentials');
  console.error('   For full functionality, add FIREBASE_CLIENT_EMAIL to .env.local');
  console.error('   You can get this from Firebase Console > Project Settings > Service Accounts');
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
} else {
  // Try with just project ID - this works if running with proper auth context
  firebaseAdmin = initializeApp({
    projectId: FIREBASE_PROJECT_ID,
  });
}

const db = getFirestore(firebaseAdmin);

// Test with just a few search terms
const TEST_SEARCH_TERMS = [
  'wedding 2025',
  'first dance songs',
  'wedding party'
];

async function testImport() {
  console.log('\n🎵 Starting TEST Spotify import...');
  console.log(`📋 Testing with ${TEST_SEARCH_TERMS.length} search terms`);
  
  const spotifyService = getSpotifyService();
  const uniqueSongs = new Map<string, MasterSong>();
  
  try {
    // Initialize Spotify
    await spotifyService.initializeClientCredentials();
    console.log('✅ Spotify authenticated successfully');
    
    // Process each search term
    for (const searchTerm of TEST_SEARCH_TERMS) {
      console.log(`\n🔍 Searching for: "${searchTerm}"`);
      
      // Search for playlists (limit to 2 for testing)
      const playlists = await spotifyService.searchPlaylists(searchTerm, { limit: 2 });
      console.log(`  Found ${playlists.length} playlists`);
      
      // Process first playlist only for testing
      if (playlists.length > 0) {
        const playlist = playlists[0];
        console.log(`  📀 Processing: "${playlist.name}"`);
        
        // Get tracks (limit to first 10 for testing)
        const allTracks = await spotifyService.getAllPlaylistTracks(playlist.id);
        const tracks = allTracks.slice(0, 10);
        console.log(`    Testing with first ${tracks.length} tracks`);
        
        // Get audio features
        const trackIds = tracks
          .filter(item => item.track && item.track.id)
          .map(item => item.track.id);
        
        if (trackIds.length > 0) {
          const audioFeatures = await spotifyService.getAudioFeatures(trackIds);
          console.log(`    Got audio features for ${audioFeatures.length} tracks`);
          
          // Convert first few tracks
          for (let i = 0; i < Math.min(3, tracks.length); i++) {
            const track = tracks[i].track;
            if (!track || !track.id) continue;
            
            const features = audioFeatures.find(f => f && f.id === track.id);
            const masterSong = spotifyService.convertToMasterSong(track, features);
            
            console.log(`      ✅ Converted: "${track.name}" by ${track.artists[0]?.name}`);
            uniqueSongs.set(track.id, masterSong as MasterSong);
          }
        }
      }
    }
    
    console.log(`\n📊 Test complete! Found ${uniqueSongs.size} unique songs`);
    
    if (uniqueSongs.size > 0) {
      // Save ONE song to Firestore as a test
      const firstSong = Array.from(uniqueSongs.values())[0];
      console.log(`\n💾 Testing Firestore save with: "${firstSong.title}"`);
      
      const docRef = db.collection('songs_master').doc(firstSong.spotify_id);
      await docRef.set(JSON.parse(JSON.stringify(firstSong)));
      
      console.log('✅ Successfully saved to Firestore!');
      
      // Try to read it back
      const savedDoc = await docRef.get();
      if (savedDoc.exists) {
        console.log('✅ Successfully read back from Firestore!');
      }
    }
    
    console.log('\n🎉 Test import completed successfully!');
    console.log('Ready to run full import with: npm run import:spotify');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testImport()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Test script failed:', error);
    process.exit(1);
  });