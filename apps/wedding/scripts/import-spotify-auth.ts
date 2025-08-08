#!/usr/bin/env node

/**
 * Production-ready Spotify import with anonymous authentication
 * This is the recommended approach for importing songs
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  writeBatch,
  Timestamp 
} from 'firebase/firestore';
import { getSpotifyService } from '../src/lib/spotify-service.js';
import type { MasterSong } from '../src/types/music-ai.js';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

// Firebase configuration
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Comprehensive search terms for wedding music
const SEARCH_TERMS = [
  // General wedding
  'wedding 2025',
  'wedding songs 2024',
  'wedding playlist',
  
  // Specific moments
  'first dance wedding',
  'father daughter dance songs',
  'mother son dance wedding',
  'wedding processional music',
  'wedding recessional songs',
  'bridal entrance songs',
  
  // Reception phases
  'wedding cocktail hour',
  'wedding dinner music',
  'wedding party songs',
  'wedding dance floor hits',
  
  // Genres
  'country wedding songs',
  'pop wedding playlist',
  'rock wedding songs',
  'r&b wedding music',
  'classic wedding songs',
  'modern wedding hits'
];

async function importSongs() {
  console.log('\n🎵 Starting Spotify import with authentication...');
  console.log(`📋 Search terms: ${SEARCH_TERMS.length}`);
  
  try {
    // Authenticate anonymously
    console.log('\n🔐 Authenticating with Firebase...');
    await signInAnonymously(auth);
    console.log('✅ Firebase authenticated successfully');
    
    const spotifyService = getSpotifyService();
    const uniqueSongs = new Map<string, MasterSong>();
    const errors: string[] = [];
    let playlistsProcessed = 0;
    let tracksProcessed = 0;
    
    // Initialize Spotify
    await spotifyService.initializeClientCredentials();
    console.log('✅ Spotify authenticated successfully');
    
    // Process each search term
    for (const searchTerm of SEARCH_TERMS) {
      console.log(`\n🔍 Searching for: "${searchTerm}"`);
      
      try {
        // Search for playlists (limit to reduce API calls)
        const playlists = await spotifyService.searchPlaylists(searchTerm, { limit: 3 });
        console.log(`  Found ${playlists.length} playlists`);
        
        // Process each playlist
        for (const playlist of playlists) {
          // Skip playlists with very few followers (but handle null)
          if (playlist.followers?.total !== undefined && playlist.followers.total < 5) {
            console.log(`  ⏭️ Skipping "${playlist.name}" (only ${playlist.followers.total} followers)`);
            continue;
          }
          
          console.log(`  📀 Processing: "${playlist.name}" (${playlist.followers?.total || 'unknown'} followers)`);
          playlistsProcessed++;
          
          try {
            // Get tracks (limit for initial import)
            const allTracks = await spotifyService.getAllPlaylistTracks(playlist.id);
            const tracks = allTracks.slice(0, 30); // Process first 30 tracks per playlist
            console.log(`    Processing ${tracks.length} tracks...`);
            
            // Process tracks
            for (const item of tracks) {
              if (!item.track || !item.track.id) continue;
              
              // Skip if we already have this song
              if (uniqueSongs.has(item.track.id)) continue;
              
              const track = item.track;
              tracksProcessed++;
              
              // Get track IDs for audio features (handle gracefully if it fails)
              let audioFeatures = null;
              try {
                const features = await spotifyService.getAudioFeatures([track.id]);
                audioFeatures = features[0];
              } catch (audioError: any) {
                // Audio features require user auth, continue without them
                if (audioError.statusCode !== 403) {
                  console.log(`      ⚠️ Could not get audio features for "${track.name}"`);
                }
              }
              
              // Convert to MasterSong
              const masterSong = spotifyService.convertToMasterSong(track, audioFeatures);
              
              // Add playlist context
              (masterSong as any).found_in_playlist = playlist.name;
              (masterSong as any).playlist_context = searchTerm;
              
              if (masterSong.spotify_id) {
                uniqueSongs.set(track.id, masterSong as MasterSong);
              }
              
              // Small delay to avoid rate limiting
              if (tracksProcessed % 10 === 0) {
                await new Promise(resolve => setTimeout(resolve, 100));
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
      console.log('\n💾 Saving to Firestore...');
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
          
          // Clean undefined values
          const cleanData = JSON.parse(JSON.stringify(songData));
          
          batch.set(docRef, cleanData);
        }
        
        await batch.commit();
        savedCount += batchSongs.length;
        console.log(`  Saved batch: ${savedCount}/${songs.length} songs`);
      }
      
      console.log(`✅ Successfully saved ${savedCount} songs to Firestore!`);
    }
    
    // Print summary
    console.log('\n📈 Import Summary:');
    console.log(`  Total songs imported: ${uniqueSongs.size}`);
    console.log(`  Tracks processed: ${tracksProcessed}`);
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
    
    if (moments.size > 0) {
      console.log('\n  Top Wedding Moments:');
      Array.from(moments.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .forEach(([moment, count]) => {
          console.log(`    ${moment}: ${count} songs`);
        });
    }
    
    if (moods.size > 0) {
      console.log('\n  Top Wedding Moods:');
      Array.from(moods.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .forEach(([mood, count]) => {
          console.log(`    ${mood}: ${count} songs`);
        });
    }
    
    // Sample songs
    console.log('\n  Sample Songs:');
    const samples = Array.from(uniqueSongs.values()).slice(0, 3);
    samples.forEach(song => {
      console.log(`    - "${song.title}" by ${song.artist}`);
      console.log(`      Moments: ${song.wedding_moments.join(', ')}`);
      console.log(`      Score: ${song.wedding_score}/100`);
    });
    
    if (errors.length > 0) {
      console.log(`\n⚠️  Errors encountered (${errors.length}):`)
      errors.slice(0, 5).forEach(error => console.log(`  - ${error}`));
    }
    
    console.log('\n✅ Import completed successfully!');
    console.log('📱 Check Firebase Console to verify the data:');
    console.log('   https://console.firebase.google.com/project/weddings-uptune-d12fa/firestore/data/~2Fsongs_master');
    
    // Sign out
    await auth.signOut();
    console.log('🔓 Signed out from Firebase');
    
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