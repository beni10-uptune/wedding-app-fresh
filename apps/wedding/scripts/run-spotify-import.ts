#!/usr/bin/env node

/**
 * Script to trigger Spotify import via API route
 * This avoids Firebase Admin credential issues by using the server-side API
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

const API_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
const IMPORT_SECRET = process.env.IMPORT_SECRET || 'uptune-import-2025';

// Search terms for comprehensive wedding music coverage
const SEARCH_TERMS = [
  // General wedding
  'wedding 2025',
  'wedding songs',
  'wedding playlist',
  
  // Specific moments
  'first dance',
  'father daughter dance',
  'mother son dance',
  'wedding processional',
  'wedding recessional',
  'wedding entrance',
  
  // Reception
  'wedding party',
  'wedding reception',
  'wedding cocktail hour',
  'wedding dinner music',
  
  // Genres
  'wedding country',
  'wedding pop',
  'wedding rock',
  'wedding r&b'
];

async function runImport() {
  console.log('🎵 Starting Spotify import via API...');
  console.log(`📍 API URL: ${API_URL}`);
  console.log(`📋 Search terms: ${SEARCH_TERMS.length}`);
  
  try {
    const response = await fetch(`${API_URL}/api/import-spotify-songs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: IMPORT_SECRET,
        searchTerms: SEARCH_TERMS,
        limit: 5 // Max playlists per search term
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API error: ${response.status} - ${error}`);
    }

    const result = await response.json();

    if (result.success) {
      console.log('\n✅ Import successful!');
      console.log('\n📊 Summary:');
      console.log(`  Songs imported: ${result.summary.totalSongsImported}`);
      console.log(`  Playlists processed: ${result.summary.playlistsProcessed}`);
      console.log(`  Search terms used: ${result.summary.searchTermsUsed}`);
      console.log(`  Errors: ${result.summary.errors}`);

      if (result.summary.analysis) {
        console.log('\n🎵 Song Analysis:');
        
        if (result.summary.analysis.moments) {
          console.log('\n  Top Wedding Moments:');
          const moments = Object.entries(result.summary.analysis.moments)
            .sort((a: any, b: any) => b[1] - a[1])
            .slice(0, 5);
          
          for (const [moment, count] of moments) {
            console.log(`    ${moment}: ${count} songs`);
          }
        }

        if (result.summary.analysis.moods) {
          console.log('\n  Top Wedding Moods:');
          const moods = Object.entries(result.summary.analysis.moods)
            .sort((a: any, b: any) => b[1] - a[1])
            .slice(0, 5);
          
          for (const [mood, count] of moods) {
            console.log(`    ${mood}: ${count} songs`);
          }
        }
      }

      if (result.details.errors && result.details.errors.length > 0) {
        console.log('\n⚠️  Some errors occurred:');
        result.details.errors.forEach((error: string) => {
          console.log(`  - ${error}`);
        });
      }

    } else {
      console.error('❌ Import failed:', result.error);
    }

  } catch (error) {
    console.error('❌ Failed to run import:', error);
    console.log('\n💡 Make sure the Next.js dev server is running:');
    console.log('   npm run dev');
  }
}

// Run the import
runImport()
  .then(() => {
    console.log('\n🎉 Import process completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Import failed:', error);
    process.exit(1);
  });