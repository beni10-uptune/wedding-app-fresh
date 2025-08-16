/**
 * Migrate songs to Supabase (no Firebase needed)
 */

import { createClient } from '@supabase/supabase-js';
import { ALL_WEDDING_SONGS_ENRICHED } from '../data/spotify-wedding-songs-enriched';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrateSongs() {
  console.log('🎵 Starting songs migration...');
  console.log(`Found ${ALL_WEDDING_SONGS_ENRICHED.length} songs to migrate\n`);
  
  let migrated = 0;
  let errors = 0;
  const batchSize = 50;
  
  // Process in batches for better performance
  for (let i = 0; i < ALL_WEDDING_SONGS_ENRICHED.length; i += batchSize) {
    const batch = ALL_WEDDING_SONGS_ENRICHED.slice(i, i + batchSize);
    
    const songsToInsert = batch.map(song => ({
      id: song.id,
      title: song.title,
      artist: song.artist,
      album: song.album || null,
      album_art: song.albumArt || null,
      preview_url: song.previewUrl || null,
      spotify_uri: song.spotifyUri || `spotify:track:${song.id}`,
      duration: song.duration || null,
      energy: song.energy || null,
      genres: song.genres || song.artistGenres || [],
      moods: song.moods || [],
      contexts: ['wedding'],
      explicit: song.explicit || false,
      popularity: song.popularity || 50,
    }));
    
    const { error } = await supabase
      .from('songs')
      .upsert(songsToInsert, { onConflict: 'id' });
    
    if (error) {
      console.error(`❌ Error in batch ${i / batchSize + 1}:`, error.message);
      errors += batch.length;
    } else {
      migrated += batch.length;
      console.log(`✅ Migrated batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(ALL_WEDDING_SONGS_ENRICHED.length / batchSize)} (${migrated} songs total)`);
    }
  }
  
  console.log('\n=====================================');
  console.log(`✅ Songs migration completed!`);
  console.log(`📊 Results:`);
  console.log(`   - Total songs: ${ALL_WEDDING_SONGS_ENRICHED.length}`);
  console.log(`   - Successfully migrated: ${migrated}`);
  console.log(`   - Errors: ${errors}`);
  
  // Verify count in database
  const { count } = await supabase
    .from('songs')
    .select('*', { count: 'exact', head: true });
  
  console.log(`   - Songs in database: ${count}`);
  
  return migrated;
}

async function main() {
  try {
    // Test connection
    const { error } = await supabase.from('songs').select('id').limit(1);
    if (error) {
      console.error('❌ Cannot connect to Supabase:', error.message);
      console.error('Please check your SUPABASE_SERVICE_ROLE_KEY in .env.local');
      process.exit(1);
    }
    
    await migrateSongs();
    
    console.log('\n✅ You can now:');
    console.log('   1. Test song search in the wedding builder');
    console.log('   2. Generate smart playlists');
    console.log('   3. Create test weddings at /builder-new');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

main();