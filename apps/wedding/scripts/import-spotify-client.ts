#!/usr/bin/env node

/**
 * Spotify import script using Firebase Client SDK
 * This version works without Firebase Admin credentials
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { getSpotifyService } from '../src/lib/spotify-service.js';
import type { MasterSong } from '../src/types/music-ai.js';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

console.log('🔧 Environment Check:');
console.log('  SPOTIFY_CLIENT_ID:', process.env.SPOTIFY_CLIENT_ID ? '✅ Set' : '❌ Missing');
console.log('  SPOTIFY_CLIENT_SECRET:', process.env.SPOTIFY_CLIENT_SECRET ? '✅ Set' : '❌ Missing');

if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
  console.error('❌ Spotify credentials missing! Please check .env.local');
  process.exit(1);
}

// Wedding-specific search terms
const SEARCH_TERMS = [
  'wedding 2025',
  'first dance songs',
  'wedding party',
  'wedding reception',
  'wedding ceremony',
  'wedding cocktail hour',
  'father daughter dance',
  'mother son dance',
  'wedding entrance',
  'wedding dinner music'
];

async function importSongs() {
  console.log('\n🎵 Starting Spotify wedding songs import...');
  console.log(`📋 Will search for ${SEARCH_TERMS.length} different terms`);
  
  const spotifyService = getSpotifyService();
  const uniqueSongs = new Map<string, MasterSong>();
  const errors: string[] = [];
  
  try {
    // Initialize Spotify
    await spotifyService.initializeClientCredentials();
    console.log('✅ Spotify authenticated successfully');
    
    // Process each search term
    for (const searchTerm of SEARCH_TERMS) {
      console.log(`\n🔍 Searching for: "${searchTerm}"`);
      
      try {
        // Search for playlists
        const playlists = await spotifyService.searchPlaylists(searchTerm, { limit: 5 });
        console.log(`  Found ${playlists.length} playlists`);
        
        // Process each playlist
        for (const playlist of playlists) {
          // Skip playlists with few followers
          if (playlist.followers && playlist.followers.total < 50) {
            continue;
          }
          
          console.log(`  📀 Processing: "${playlist.name}" (${playlist.followers?.total || 0} followers)`);
          
          try {
            // Get tracks
            const tracks = await spotifyService.getAllPlaylistTracks(playlist.id);
            console.log(`    Found ${tracks.length} tracks`);
            
            // Get audio features
            const trackIds = tracks
              .filter(item => item.track && item.track.id)
              .map(item => item.track.id);
            
            if (trackIds.length > 0) {
              const audioFeatures = await spotifyService.getAudioFeatures(trackIds);
              
              // Convert tracks
              for (const track of tracks) {
                if (!track.track || !track.track.id) continue;
                
                // Skip if we already have this song
                if (uniqueSongs.has(track.track.id)) continue;
                
                const features = audioFeatures.find(f => f && f.id === track.track.id);
                const masterSong = spotifyService.convertToMasterSong(track.track, features);
                
                uniqueSongs.set(track.track.id, masterSong as MasterSong);
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
    
    // Instead of saving to Firestore, let's save to a JSON file for now
    console.log('\n💾 Saving to JSON file...');
    
    const fs = await import('fs/promises');
    const outputPath = resolve(process.cwd(), 'spotify-songs-import.json');
    
    const exportData = {
      metadata: {
        importDate: new Date().toISOString(),
        totalSongs: uniqueSongs.size,
        searchTerms: SEARCH_TERMS
      },
      songs: Array.from(uniqueSongs.values())
    };
    
    await fs.writeFile(outputPath, JSON.stringify(exportData, null, 2));
    console.log(`✅ Saved ${uniqueSongs.size} songs to spotify-songs-import.json`);
    
    // Print summary
    console.log('\n📈 Import Summary:');
    console.log(`  Total songs imported: ${uniqueSongs.size}`);
    console.log(`  Search terms processed: ${SEARCH_TERMS.length}`);
    
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
    
    console.log('\n📝 Next Steps:');
    console.log('  1. Review the songs in spotify-songs-import.json');
    console.log('  2. Use the upload-songs-to-firestore script to save to database');
    console.log('  3. Or manually import through an API route');
    
    if (errors.length > 0) {
      console.log(`\n⚠️  Errors encountered (${errors.length}):`);
      errors.slice(0, 5).forEach(error => console.log(`  - ${error}`));
    }
    
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