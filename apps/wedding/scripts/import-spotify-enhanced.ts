#!/usr/bin/env node

/**
 * Enhanced Spotify import that merges with existing data
 * - Checks for existing songs and enhances them
 * - Preserves user-generated data (ratings, play counts)
 * - Adds new songs without duplicates
 * - Enriches metadata where possible
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc,
  setDoc,
  updateDoc,
  getDocs,
  Timestamp 
} from 'firebase/firestore';
import SpotifyWebApi from 'spotify-web-api-node';
import { MasterSong, WeddingMoment, WeddingMood, DataSource } from '../src/types/music-ai.js';

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
const db = getFirestore(app);

// Initialize Spotify
const spotify = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

// Comprehensive search terms for wedding music
const SEARCH_TERMS = [
  // Traditional wedding moments
  'wedding 2025',
  'wedding 2024',
  'first dance wedding',
  'father daughter dance',
  'mother son dance',
  'wedding processional',
  'wedding recessional',
  'bridal party entrance',
  
  // Reception phases
  'wedding cocktail hour',
  'wedding dinner music',
  'wedding reception 2025',
  'wedding party songs',
  'wedding dance floor',
  
  // Genre-specific
  'country wedding songs',
  'pop wedding playlist',
  'rock wedding songs',
  'r&b wedding music',
  'classic wedding songs',
  'modern wedding hits',
  'indie wedding',
  'jazz wedding',
  
  // Mood-based
  'romantic wedding songs',
  'upbeat wedding music',
  'emotional wedding songs',
  'fun wedding playlist'
];

// Helper to infer wedding moments from track and context
function inferWeddingMoments(trackName: string, playlistName: string, existingMoments: WeddingMoment[] = []): WeddingMoment[] {
  const moments = new Set<WeddingMoment>(existingMoments);
  const lowerTrack = trackName.toLowerCase();
  const lowerPlaylist = playlistName.toLowerCase();
  
  // Check for specific moment keywords
  if (lowerPlaylist.includes('first dance') || lowerTrack.includes('first dance')) {
    moments.add(WeddingMoment.FIRST_DANCE);
  }
  if (lowerPlaylist.includes('processional') || lowerPlaylist.includes('aisle') || 
      lowerPlaylist.includes('entrance') || lowerPlaylist.includes('walk down')) {
    moments.add(WeddingMoment.PROCESSIONAL);
  }
  if (lowerPlaylist.includes('recessional') || lowerPlaylist.includes('exit')) {
    moments.add(WeddingMoment.RECESSIONAL);
  }
  if (lowerPlaylist.includes('father') && lowerPlaylist.includes('daughter')) {
    moments.add(WeddingMoment.FATHER_DAUGHTER);
  }
  if (lowerPlaylist.includes('mother') && lowerPlaylist.includes('son')) {
    moments.add(WeddingMoment.MOTHER_SON);
  }
  if (lowerPlaylist.includes('dinner') || lowerPlaylist.includes('meal')) {
    moments.add(WeddingMoment.DINNER);
  }
  if (lowerPlaylist.includes('cocktail')) {
    moments.add(WeddingMoment.COCKTAIL);
  }
  if (lowerPlaylist.includes('party') || lowerPlaylist.includes('dance floor') || 
      lowerPlaylist.includes('reception')) {
    moments.add(WeddingMoment.PARTY_PEAK);
  }
  if (lowerPlaylist.includes('cake cutting')) {
    moments.add(WeddingMoment.CAKE_CUTTING);
  }
  if (lowerPlaylist.includes('bouquet') || lowerPlaylist.includes('garter')) {
    moments.add(WeddingMoment.BOUQUET_GARTER);
  }
  
  // Infer from song characteristics
  if (lowerTrack.includes('love') || lowerTrack.includes('forever') || 
      lowerTrack.includes('marry') || lowerTrack.includes('wedding')) {
    moments.add(WeddingMoment.GENERAL);
  }
  
  // Default if no specific moment found
  if (moments.size === 0) {
    moments.add(WeddingMoment.GENERAL);
  }
  
  return Array.from(moments);
}

// Helper to infer wedding moods
function inferWeddingMoods(trackName: string, artistName: string, existingMoods: WeddingMood[] = []): WeddingMood[] {
  const moods = new Set<WeddingMood>(existingMoods);
  const lowerTrack = trackName.toLowerCase();
  const lowerArtist = artistName.toLowerCase();
  
  // Romantic keywords
  if (lowerTrack.includes('love') || lowerTrack.includes('heart') || 
      lowerTrack.includes('kiss') || lowerTrack.includes('forever')) {
    moods.add(WeddingMood.ROMANTIC);
  }
  
  // Party/energetic keywords
  if (lowerTrack.includes('dance') || lowerTrack.includes('party') || 
      lowerTrack.includes('celebrate') || lowerTrack.includes('shake')) {
    moods.add(WeddingMood.PARTY);
    moods.add(WeddingMood.ENERGETIC);
  }
  
  // Happy/celebratory keywords
  if (lowerTrack.includes('happy') || lowerTrack.includes('joy') || 
      lowerTrack.includes('celebration')) {
    moods.add(WeddingMood.CELEBRATORY);
  }
  
  // Emotional keywords
  if (lowerTrack.includes('cry') || lowerTrack.includes('tears') || 
      lowerTrack.includes('emotional')) {
    moods.add(WeddingMood.EMOTIONAL);
  }
  
  // Nostalgic based on artist era
  const classicArtists = ['frank sinatra', 'elvis', 'beatles', 'aretha'];
  if (classicArtists.some(artist => lowerArtist.includes(artist))) {
    moods.add(WeddingMood.NOSTALGIC);
  }
  
  // Default mood
  if (moods.size === 0) {
    moods.add(WeddingMood.UPLIFTING);
  }
  
  return Array.from(moods);
}

// Helper to calculate enhanced wedding score
function calculateWeddingScore(
  track: any, 
  moments: WeddingMoment[], 
  moods: WeddingMood[],
  existingScore?: number
): number {
  let score = existingScore || 50; // Start with existing or base score
  
  // Popularity boost (0-100 popularity -> 0-25 points)
  if (track.popularity) {
    score = Math.max(score, 50 + (track.popularity / 4));
  }
  
  // Moment specificity boost
  if (moments.includes(WeddingMoment.FIRST_DANCE)) score = Math.max(score, 85);
  if (moments.includes(WeddingMoment.FATHER_DAUGHTER)) score = Math.max(score, 85);
  if (moments.includes(WeddingMoment.MOTHER_SON)) score = Math.max(score, 85);
  if (moments.includes(WeddingMoment.PROCESSIONAL)) score = Math.max(score, 80);
  
  // Mood boost
  if (moods.includes(WeddingMood.ROMANTIC)) score += 5;
  if (moods.includes(WeddingMood.CELEBRATORY)) score += 5;
  
  // Explicit content penalty
  if (track.explicit) score -= 20;
  
  return Math.max(0, Math.min(100, score));
}

// Merge function for songs
function mergeSongData(existing: any, newData: Partial<MasterSong>): MasterSong {
  // Preserve user-generated data
  const preserved = {
    analytics: existing.analytics || newData.analytics,
    play_count: existing.play_count || 0,
    success_rate: existing.success_rate || 0,
    user_ratings: existing.user_ratings || [],
    custom_tags: existing.custom_tags || [],
    notes: existing.notes || ''
  };
  
  // Merge arrays without duplicates
  const mergedMoments = [
    ...new Set([
      ...(existing.wedding_moments || []),
      ...(newData.wedding_moments || [])
    ])
  ];
  
  const mergedMoods = [
    ...new Set([
      ...(existing.wedding_moods || []),
      ...(newData.wedding_moods || [])
    ])
  ];
  
  const mergedGenres = [
    ...new Set([
      ...(existing.wedding_genres || []),
      ...(newData.wedding_genres || [])
    ])
  ];
  
  // Use better score
  const mergedScore = Math.max(
    existing.wedding_score || 0,
    newData.wedding_score || 0
  );
  
  return {
    ...existing,
    ...newData,
    ...preserved,
    wedding_moments: mergedMoments,
    wedding_moods: mergedMoods,
    wedding_genres: mergedGenres,
    wedding_score: mergedScore,
    updated_at: new Date(),
    data_version: '2.0.0' // Mark as enhanced
  } as MasterSong;
}

async function importSongs() {
  console.log('\n🎵 Starting enhanced Spotify import with merge capabilities...');
  console.log(`📋 Search terms: ${SEARCH_TERMS.length}`);
  
  const stats = {
    existing: 0,
    enhanced: 0,
    new: 0,
    failed: 0,
    playlists: 0
  };
  
  try {
    // First, load existing songs
    console.log('\n📚 Loading existing songs from database...');
    const existingSongs = new Map<string, any>();
    const existingSnapshot = await getDocs(collection(db, 'songs_master'));
    
    existingSnapshot.forEach(doc => {
      existingSongs.set(doc.id, { id: doc.id, ...doc.data() });
    });
    
    console.log(`  Found ${existingSongs.size} existing songs in database`);
    stats.existing = existingSongs.size;
    
    // Get Spotify access token
    const data = await spotify.clientCredentialsGrant();
    spotify.setAccessToken(data.body.access_token);
    console.log('✅ Spotify authenticated successfully');
    
    // Track new songs found
    const newSongs = new Map<string, MasterSong>();
    const errors: string[] = [];
    
    // Process each search term
    for (const searchTerm of SEARCH_TERMS) {
      console.log(`\n🔍 Searching for: "${searchTerm}"`);
      
      try {
        // Search for playlists
        const result = await spotify.searchPlaylists(searchTerm, { limit: 3 });
        const playlists = result.body.playlists?.items || [];
        console.log(`  Found ${playlists.length} playlists`);
        
        // Process each playlist
        for (const playlist of playlists) {
          if (!playlist || !playlist.id) continue;
          
          console.log(`  📀 Processing: "${playlist.name}"`);
          stats.playlists++;
          
          try {
            // Get playlist tracks
            const tracksResult = await spotify.getPlaylistTracks(playlist.id, { 
              limit: 50, // Get more tracks for better coverage
              fields: 'items(track(id,name,artists,album,duration_ms,explicit,preview_url,popularity,external_urls,uri))'
            });
            
            const tracks = tracksResult.body.items;
            console.log(`    Analyzing ${tracks.length} tracks...`);
            
            let enhanced = 0;
            let added = 0;
            
            // Process each track
            for (const item of tracks) {
              if (!item.track || !item.track.id || !item.track.name) continue;
              
              const track = item.track;
              
              // Check if song exists
              const existing = existingSongs.get(track.id) || newSongs.get(track.id);
              
              if (existing) {
                // Enhance existing song
                const enhancedMoments = inferWeddingMoments(track.name, playlist.name, existing.wedding_moments);
                const enhancedMoods = inferWeddingMoods(track.name, track.artists[0]?.name || '', existing.wedding_moods);
                const enhancedScore = calculateWeddingScore(track, enhancedMoments, enhancedMoods, existing.wedding_score);
                
                // Only update if we're adding new information
                if (enhancedMoments.length > (existing.wedding_moments?.length || 0) ||
                    enhancedMoods.length > (existing.wedding_moods?.length || 0) ||
                    enhancedScore > (existing.wedding_score || 0)) {
                  
                  const merged = mergeSongData(existing, {
                    wedding_moments: enhancedMoments,
                    wedding_moods: enhancedMoods,
                    wedding_score: enhancedScore,
                    popularity: track.popularity || existing.popularity
                  });
                  
                  newSongs.set(track.id, merged);
                  enhanced++;
                }
              } else {
                // Create new song
                const masterSong: MasterSong = {
                  spotify_id: track.id,
                  title: track.name,
                  artist: track.artists[0]?.name || 'Unknown Artist',
                  artists: track.artists?.map((a: any) => a.name) || [],
                  album: track.album?.name || 'Unknown Album',
                  album_art_url: track.album?.images?.[0]?.url,
                  preview_url: track.preview_url,
                  external_urls: track.external_urls,
                  spotify_uri: track.uri,
                  duration_ms: track.duration_ms,
                  explicit: track.explicit || false,
                  popularity: track.popularity || 0,
                  release_date: track.album?.release_date,
                  
                  // Wedding-specific data
                  wedding_moments: inferWeddingMoments(track.name, playlist.name),
                  wedding_moods: inferWeddingMoods(track.name, track.artists[0]?.name || ''),
                  wedding_genres: [], // Will be enriched later
                  wedding_score: calculateWeddingScore(
                    track,
                    inferWeddingMoments(track.name, playlist.name),
                    inferWeddingMoods(track.name, track.artists[0]?.name || '')
                  ),
                  
                  // Metadata
                  cultural_fit: [],
                  age_appeal: [],
                  inappropriate_flags: track.explicit ? ['explicit'] : [],
                  source: DataSource.SPOTIFY,
                  created_at: new Date(),
                  updated_at: new Date(),
                  data_version: '2.0.0',
                  
                  // Analytics
                  analytics: {
                    play_count: 0,
                    success_rate: 0,
                    skip_rate: 0,
                    user_ratings: []
                  },
                  
                  // Placeholder for audio features
                  audio_features: null as any
                };
                
                newSongs.set(track.id, masterSong);
                added++;
              }
            }
            
            if (enhanced > 0 || added > 0) {
              console.log(`    ✅ Enhanced: ${enhanced}, New: ${added}`);
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
    
    console.log(`\n📊 Import complete! Found ${newSongs.size} songs to add/update`);
    
    if (newSongs.size > 0) {
      // Save to Firestore
      console.log('\n💾 Saving to Firestore...');
      const songs = Array.from(newSongs.values());
      let savedCount = 0;
      let enhancedCount = 0;
      let newCount = 0;
      
      for (const song of songs) {
        try {
          const docRef = doc(collection(db, 'songs_master'), song.spotify_id);
          
          // Check if this is an update or new
          const isUpdate = existingSongs.has(song.spotify_id);
          
          // Convert dates to Firestore Timestamps
          const songData = {
            ...song,
            created_at: isUpdate ? 
              (existingSongs.get(song.spotify_id).created_at || Timestamp.now()) : 
              Timestamp.fromDate(song.created_at as Date),
            updated_at: Timestamp.fromDate(song.updated_at as Date)
          };
          
          // Clean undefined values
          const cleanData = JSON.parse(JSON.stringify(songData));
          
          if (isUpdate) {
            await updateDoc(docRef, cleanData);
            enhancedCount++;
          } else {
            await setDoc(docRef, cleanData);
            newCount++;
          }
          
          savedCount++;
          
          // Progress indicator
          if (savedCount % 10 === 0) {
            console.log(`  Progress: ${savedCount}/${songs.length} songs processed`);
          }
        } catch (error) {
          stats.failed++;
          if (stats.failed === 1) {
            console.error(`  ❌ Failed to save song: ${error}`);
            errors.push(`Save failed: ${error}`);
          }
        }
      }
      
      stats.enhanced = enhancedCount;
      stats.new = newCount;
      
      console.log(`✅ Import complete!`);
      console.log(`  📝 Enhanced: ${enhancedCount} existing songs`);
      console.log(`  ✨ Added: ${newCount} new songs`);
      console.log(`  💾 Total saved: ${savedCount}/${songs.length}`);
    }
    
    // Print final summary
    console.log('\n📈 Final Database Summary:');
    console.log(`  📚 Previously in database: ${stats.existing} songs`);
    console.log(`  📝 Enhanced with new data: ${stats.enhanced} songs`);
    console.log(`  ✨ New songs added: ${stats.new} songs`);
    console.log(`  📊 Total songs now: ${stats.existing + stats.new} songs`);
    console.log(`  📀 Playlists processed: ${stats.playlists}`);
    console.log(`  🔍 Search terms used: ${SEARCH_TERMS.length}`);
    
    // Sample enhanced songs
    if (newSongs.size > 0) {
      console.log('\n🎵 Sample Enhanced/New Songs:');
      const samples = Array.from(newSongs.values())
        .sort((a, b) => b.wedding_score - a.wedding_score)
        .slice(0, 5);
      
      samples.forEach(song => {
        const isNew = !existingSongs.has(song.spotify_id);
        console.log(`  ${isNew ? '✨' : '📝'} "${song.title}" by ${song.artist}`);
        console.log(`     Score: ${song.wedding_score}/100`);
        console.log(`     Moments: ${song.wedding_moments.join(', ')}`);
        console.log(`     Moods: ${song.wedding_moods.join(', ')}`);
      });
    }
    
    if (errors.length > 0) {
      console.log(`\n⚠️  Some errors occurred (${errors.length}):`)
      errors.slice(0, 3).forEach(error => console.log(`  - ${error}`));
    }
    
    console.log('\n✅ Enhanced import completed successfully!');
    console.log('📱 Check Firebase Console to verify the data:');
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