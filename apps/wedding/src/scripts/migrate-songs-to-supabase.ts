#!/usr/bin/env npx tsx
/**
 * Migrate Songs to Supabase
 * Imports all enriched songs into Supabase database
 * 
 * Usage: npx tsx src/scripts/migrate-songs-to-supabase.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

// Import enriched songs
import { ALL_WEDDING_SONGS_ENRICHED } from '../data/spotify-wedding-songs-enriched';

// Initialize Supabase admin client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function migrateSongs() {
  console.log('🎵 Starting Supabase song migration...\n');
  
  const songs = ALL_WEDDING_SONGS_ENRICHED;
  console.log(`📊 Processing ${songs.length} songs...\n`);
  
  let successCount = 0;
  let errorCount = 0;
  const errors: any[] = [];
  
  // Process in batches to avoid overwhelming the database
  const batchSize = 50;
  
  for (let i = 0; i < songs.length; i += batchSize) {
    const batch = songs.slice(i, i + batchSize);
    
    // Prepare songs for insertion
    const songsToInsert = batch.map(song => ({
      id: song.id,
      title: song.title,
      artist: song.artist,
      album: song.album || null,
      album_art: song.albumArt || song.albumImage || null,
      preview_url: song.previewUrl || null,
      spotify_uri: song.spotifyUri,
      duration: song.duration || null,
      energy: song.energyLevel || 3,
      bpm: song.bpm || null,
      genres: song.genres || [],
      moments: song.moments || [],
      explicit: song.explicit || false,
      popularity: song.popularity || 50,
      spotify_data: {
        releaseDate: song.releaseDate,
        albumImage: song.albumImage,
        albumArt: song.albumArt,
        generationAppeal: song.generationAppeal,
        popularIn: song.popularIn
      }
    }));
    
    // Upsert songs (insert or update if exists)
    const { data, error } = await supabase
      .from('songs')
      .upsert(songsToInsert, {
        onConflict: 'id',
        ignoreDuplicates: false
      });
    
    if (error) {
      console.error(`❌ Error in batch ${i / batchSize + 1}:`, error.message);
      errorCount += batch.length;
      errors.push({ batch: i / batchSize + 1, error });
    } else {
      successCount += batch.length;
      console.log(`✅ Batch ${i / batchSize + 1}: ${batch.length} songs processed`);
    }
    
    // Progress indicator
    const progress = Math.min(i + batchSize, songs.length);
    console.log(`Progress: ${progress}/${songs.length} (${Math.round(progress/songs.length * 100)}%)\n`);
  }
  
  // Summary
  console.log('✨ Migration complete!\n');
  console.log('📊 Summary:');
  console.log(`   ✅ Successfully migrated: ${successCount} songs`);
  console.log(`   ❌ Errors: ${errorCount} songs`);
  
  if (errors.length > 0) {
    console.log('\n⚠️ Errors encountered:');
    errors.forEach(e => {
      console.log(`   Batch ${e.batch}: ${e.error.message}`);
    });
  }
  
  // Verify the migration
  const { count } = await supabase
    .from('songs')
    .select('*', { count: 'exact', head: true });
  
  console.log(`\n🎵 Total songs in database: ${count}`);
  
  // Get genre distribution
  const { data: genreData } = await supabase
    .from('songs')
    .select('genres')
    .not('genres', 'is', null);
  
  if (genreData) {
    const genreCounts: Record<string, number> = {};
    genreData.forEach(row => {
      (row.genres || []).forEach(genre => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
    });
    
    console.log('\n📈 Genre Distribution:');
    Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([genre, count]) => {
        console.log(`   ${genre}: ${count} songs`);
      });
  }
}

// Run the migration
migrateSongs()
  .then(() => {
    console.log('\n🎉 Migration successful!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  });