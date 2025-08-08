#!/usr/bin/env node

/**
 * Simplified Spotify import - just gets basic track data without audio features
 * This avoids the API errors and focuses on getting songs into the database
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  writeBatch,
  Timestamp 
} from 'firebase/firestore';
import SpotifyWebApi from 'spotify-web-api-node';
import { MasterSong, WeddingMoment, WeddingMood, DataSource } from '../src/types/music-ai.js';

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Spotify
const spotify = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

// Search terms for comprehensive wedding music coverage
const SEARCH_TERMS = [
  'wedding 2025',
  'first dance wedding',
  'wedding reception songs',
  'wedding ceremony music',
  'wedding party hits',
  'romantic wedding songs',
  'classic wedding songs',
  'modern wedding playlist'
];

// Helper to infer wedding moments from track name and playlist context
function inferWeddingMoments(trackName: string, playlistName: string): WeddingMoment[] {
  const moments: WeddingMoment[] = [];
  const lowerTrack = trackName.toLowerCase();
  const lowerPlaylist = playlistName.toLowerCase();
  
  if (lowerPlaylist.includes('first dance') || lowerTrack.includes('first dance')) {
    moments.push(WeddingMoment.FIRST_DANCE);
  }
  if (lowerPlaylist.includes('processional') || lowerPlaylist.includes('aisle') || lowerPlaylist.includes('entrance')) {
    moments.push(WeddingMoment.PROCESSIONAL);
  }
  if (lowerPlaylist.includes('recessional') || lowerPlaylist.includes('exit')) {
    moments.push(WeddingMoment.RECESSIONAL);
  }
  if (lowerPlaylist.includes('father') || lowerPlaylist.includes('daughter')) {
    moments.push(WeddingMoment.FATHER_DAUGHTER);
  }
  if (lowerPlaylist.includes('mother') || lowerPlaylist.includes('son')) {
    moments.push(WeddingMoment.MOTHER_SON);
  }
  if (lowerPlaylist.includes('dinner') || lowerPlaylist.includes('meal')) {
    moments.push(WeddingMoment.DINNER);
  }
  if (lowerPlaylist.includes('cocktail')) {
    moments.push(WeddingMoment.COCKTAIL);
  }
  if (lowerPlaylist.includes('party') || lowerPlaylist.includes('dance floor') || lowerPlaylist.includes('reception')) {
    moments.push(WeddingMoment.PARTY_PEAK);
  }
  
  // Default to general if no specific moment found
  if (moments.length === 0) {
    moments.push(WeddingMoment.GENERAL);
  }
  
  return moments;
}

// Helper to infer wedding moods from track info
function inferWeddingMoods(trackName: string, artistName: string): WeddingMood[] {
  const moods: WeddingMood[] = [];
  const lowerTrack = trackName.toLowerCase();
  
  if (lowerTrack.includes('love') || lowerTrack.includes('heart') || lowerTrack.includes('kiss')) {
    moods.push(WeddingMood.ROMANTIC);
  }
  if (lowerTrack.includes('dance') || lowerTrack.includes('party') || lowerTrack.includes('celebrate')) {
    moods.push(WeddingMood.PARTY);
  }
  if (lowerTrack.includes('happy') || lowerTrack.includes('joy')) {
    moods.push(WeddingMood.CELEBRATORY);
  }
  
  // Default mood
  if (moods.length === 0) {
    moods.push(WeddingMood.UPLIFTING);
  }
  
  return moods;
}

async function importSongs() {
  console.log('\n🎵 Starting simplified Spotify import...');
  console.log(`📋 Search terms: ${SEARCH_TERMS.length}`);
  
  const uniqueSongs = new Map<string, MasterSong>();
  const errors: string[] = [];
  let playlistsProcessed = 0;
  
  try {
    // Get Spotify access token
    const data = await spotify.clientCredentialsGrant();
    spotify.setAccessToken(data.body.access_token);
    console.log('✅ Spotify authenticated successfully');
    
    // Process each search term
    for (const searchTerm of SEARCH_TERMS) {
      console.log(`\n🔍 Searching for: "${searchTerm}"`);
      
      try {
        // Search for playlists
        const result = await spotify.searchPlaylists(searchTerm, { limit: 2 });
        const playlists = result.body.playlists?.items || [];
        console.log(`  Found ${playlists.length} playlists`);
        
        // Process each playlist
        for (const playlist of playlists) {
          console.log(`  📀 Processing: "${playlist.name}"`);
          playlistsProcessed++;
          
          try {
            // Get playlist tracks (just first 20 for this simplified version)
            const tracksResult = await spotify.getPlaylistTracks(playlist.id, { 
              limit: 20,
              fields: 'items(track(id,name,artists,album,duration_ms,explicit,preview_url,popularity,external_urls))'
            });
            
            const tracks = tracksResult.body.items;
            console.log(`    Processing ${tracks.length} tracks...`);
            
            // Process each track
            for (const item of tracks) {
              if (!item.track || !item.track.id || !item.track.name) continue;
              
              const track = item.track;
              
              // Skip if we already have this song
              if (uniqueSongs.has(track.id)) continue;
              
              // Create MasterSong object
              const masterSong: MasterSong = {
                spotify_id: track.id,
                title: track.name,
                artist: track.artists[0]?.name || 'Unknown Artist',
                artists: track.artists?.map((a: any) => a.name) || [],
                album: track.album?.name || 'Unknown Album',
                album_art_url: track.album?.images?.[0]?.url,
                preview_url: track.preview_url,
                external_urls: track.external_urls,
                duration_ms: track.duration_ms,
                explicit: track.explicit || false,
                popularity: track.popularity || 0,
                release_date: track.album?.release_date,
                
                // Infer wedding data based on context
                wedding_moments: inferWeddingMoments(track.name, playlist.name),
                wedding_moods: inferWeddingMoods(track.name, track.artists[0]?.name || ''),
                wedding_genres: [], // Will be enriched later
                wedding_score: 50 + (track.popularity ? track.popularity / 2 : 0), // Base score + popularity
                
                // Empty arrays for now
                cultural_fit: [],
                age_appeal: [],
                inappropriate_flags: track.explicit ? ['explicit'] : [],
                
                // Metadata
                source: DataSource.SPOTIFY,
                created_at: new Date(),
                updated_at: new Date(),
                data_version: '1.0.0',
                
                // Analytics placeholder
                analytics: {
                  play_count: 0,
                  success_rate: 0,
                  skip_rate: 0,
                  user_ratings: []
                },
                
                // Audio features will be null for now
                audio_features: null as any
              };
              
              uniqueSongs.set(track.id, masterSong);
            }
            
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
            
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
      // Save to Firestore individually (avoiding batch for permission issues)
      console.log('\n💾 Saving to Firestore...');
      const songs = Array.from(uniqueSongs.values());
      let savedCount = 0;
      let failedCount = 0;
      
      for (const song of songs) {
        try {
          const docRef = doc(collection(db, 'songs_master'), song.spotify_id);
          
          // Convert dates to Firestore Timestamps
          const songData = {
            ...song,
            created_at: Timestamp.fromDate(song.created_at as Date),
            updated_at: Timestamp.fromDate(song.updated_at as Date)
          };
          
          // Remove undefined fields
          const cleanData = JSON.parse(JSON.stringify(songData));
          
          await setDoc(docRef, cleanData);
          savedCount++;
          
          // Progress indicator
          if (savedCount % 10 === 0) {
            console.log(`  Progress: ${savedCount}/${songs.length} songs saved`);
          }
        } catch (error) {
          failedCount++;
          if (failedCount === 1) {
            console.error(`  ❌ Failed to save song: ${error}`);
            errors.push(`Save failed: ${error}`);
          }
        }
      }
      
      console.log(`✅ Successfully saved ${savedCount}/${songs.length} songs to Firestore!`);
    }
    
    // Print summary
    console.log('\n📈 Import Summary:');
    console.log(`  Total songs imported: ${uniqueSongs.size}`);
    console.log(`  Playlists processed: ${playlistsProcessed}`);
    console.log(`  Search terms used: ${SEARCH_TERMS.length}`);
    
    // Sample analysis
    if (uniqueSongs.size > 0) {
      console.log('\n🎵 Sample Songs:');
      const samples = Array.from(uniqueSongs.values()).slice(0, 5);
      samples.forEach(song => {
        console.log(`  - "${song.title}" by ${song.artist}`);
        console.log(`    Moments: ${song.wedding_moments.join(', ')}`);
        console.log(`    Moods: ${song.wedding_moods.join(', ')}`);
      });
    }
    
    if (errors.length > 0) {
      console.log(`\n⚠️  Errors encountered (${errors.length}):`)
      errors.slice(0, 5).forEach(error => console.log(`  - ${error}`));
    }
    
    console.log('\n✅ Import completed successfully!');
    console.log('📱 Check Firebase Console to verify the data');
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