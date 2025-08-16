/**
 * Client-side migration script from Firebase to Supabase
 * Uses Firebase client SDK which is already configured
 */

import { createClient } from '@supabase/supabase-js';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getAuth } from 'firebase/auth';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Initialize Supabase client with service role
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
  console.log('Testing Supabase connection...');
  const { data, error } = await supabase.from('profiles').select('count').single();
  if (error) {
    console.error('Supabase connection error:', error);
    return false;
  }
  console.log('✅ Supabase connected successfully');
  return true;
}

async function migrateWeddings() {
  console.log('\n📋 Starting wedding migration...');
  
  try {
    // Get all weddings from Firebase
    const weddingsRef = collection(db, 'weddings');
    const weddingsSnapshot = await getDocs(query(weddingsRef, orderBy('createdAt', 'desc'), limit(100)));
    
    console.log(`Found ${weddingsSnapshot.size} weddings to migrate`);
    
    let migrated = 0;
    let skipped = 0;
    
    for (const doc of weddingsSnapshot.docs) {
      const weddingData = doc.data();
      
      try {
        // Check if this wedding already exists (by slug)
        const existingSlug = weddingData.slug || doc.id;
        const { data: existing } = await supabase
          .from('wedding_weddings')
          .select('id')
          .eq('slug', existingSlug)
          .single();
        
        if (existing) {
          console.log(`⏭️  Wedding already exists: ${weddingData.coupleNames}`);
          skipped++;
          continue;
        }
        
        // Create a test user if no userEmail
        let userId: string;
        if (weddingData.userEmail) {
          // Try to find or create user
          const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', weddingData.userEmail)
            .single();
          
          if (profile) {
            userId = profile.id;
          } else {
            // Create user via Supabase Auth
            const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
              email: weddingData.userEmail,
              email_confirm: true,
              user_metadata: {
                name: weddingData.coupleNames || 'Wedding User',
                initial_app: 'wedding'
              }
            });
            
            if (authError || !authUser?.user) {
              console.log(`⚠️  Could not create user for ${weddingData.userEmail}, skipping wedding`);
              skipped++;
              continue;
            }
            
            userId = authUser.user.id;
          }
        } else {
          console.log(`⚠️  No user email for wedding ${weddingData.coupleNames}, skipping`);
          skipped++;
          continue;
        }
        
        // Create wedding in Supabase
        const { data: wedding, error } = await supabase
          .from('wedding_weddings')
          .insert({
            slug: existingSlug,
            couple_names: weddingData.coupleNames || 'Unnamed Couple',
            partner1_name: weddingData.partner1Name,
            partner2_name: weddingData.partner2Name,
            wedding_date: weddingData.weddingDate,
            venue_name: weddingData.venueName,
            venue_address: weddingData.venueAddress,
            venue_type: weddingData.venueType,
            guest_count: weddingData.guestCount,
            owner_id: userId,
            payment_tier: weddingData.subscriptionTier || 'free',
            payment_status: weddingData.subscriptionStatus || 'active',
            stripe_subscription_id: weddingData.stripeSubscriptionId,
            music_preferences: {
              genres: weddingData.selectedGenres || [],
              excluded_genres: [],
              energy_range: [2, 5],
              no_explicit: weddingData.explicitFilter || false,
            },
            settings: {
              allow_guest_submissions: true,
              require_song_approval: false,
              explicit_filter: weddingData.explicitFilter || false,
              max_songs_per_guest: 5,
            },
            total_songs: weddingData.totalSongs || 0,
            created_at: weddingData.createdAt?.toDate?.() || new Date(),
            updated_at: weddingData.updatedAt?.toDate?.() || new Date(),
          })
          .select()
          .single();
        
        if (error) {
          console.error(`❌ Error creating wedding for ${weddingData.coupleNames}:`, error.message);
          continue;
        }
        
        console.log(`✅ Migrated wedding: ${weddingData.coupleNames}`);
        migrated++;
        
        // Migrate timeline if exists
        if (weddingData.timeline && wedding) {
          await migrateTimeline(wedding.id, weddingData.timeline);
        }
        
        // Create associated playlist
        if (wedding) {
          const { data: playlist } = await supabase
            .from('playlists')
            .insert({
              owner_id: userId,
              name: `${weddingData.coupleNames} Wedding Playlist`,
              description: `Wedding playlist for ${weddingData.coupleNames}`,
              source_app: 'wedding',
              source_id: wedding.id,
              playlist_type: 'wedding_timeline',
              is_public: false,
              song_count: weddingData.totalSongs || 0,
            })
            .select()
            .single();
          
          // Update wedding with playlist ID
          if (playlist) {
            await supabase
              .from('wedding_weddings')
              .update({ main_playlist_id: playlist.id })
              .eq('id', wedding.id);
          }
        }
      } catch (error: any) {
        console.error(`❌ Error migrating wedding ${doc.id}:`, error.message);
      }
    }
    
    console.log(`\n✅ Wedding migration completed: ${migrated} migrated, ${skipped} skipped`);
  } catch (error) {
    console.error('❌ Error in wedding migration:', error);
  }
}

async function migrateTimeline(weddingId: string, timeline: any) {
  console.log(`  📍 Migrating timeline for wedding ${weddingId}`);
  
  try {
    const moments = timeline.moments || [];
    
    for (let i = 0; i < moments.length; i++) {
      const moment = moments[i];
      
      // First, ensure all songs exist in the database
      const songIds = [];
      for (const song of (moment.songs || [])) {
        const { data: dbSong } = await supabase
          .from('songs')
          .select('id')
          .eq('id', song.id)
          .single();
        
        if (!dbSong && song.id && song.title && song.artist) {
          // Insert the song if it doesn't exist
          await supabase.from('songs').insert({
            id: song.id,
            title: song.title,
            artist: song.artist,
            album: song.album,
            album_art: song.albumArt,
            preview_url: song.previewUrl,
            spotify_uri: song.spotifyUri || `spotify:track:${song.id}`,
            duration: song.duration,
            energy: song.energy,
            genres: song.genres || [],
            explicit: song.explicit || false,
          });
        }
        
        if (song.id) {
          songIds.push(song.id);
        }
      }
      
      // Create timeline moment
      if (songIds.length > 0) {
        await supabase.from('wedding_timeline').upsert({
          wedding_id: weddingId,
          moment_id: moment.id.toLowerCase().replace(/\s+/g, '-'),
          moment_name: moment.name,
          moment_order: i + 1,
          song_ids: songIds,
        }, {
          onConflict: 'wedding_id,moment_id'
        });
      }
    }
    
    console.log(`  ✅ Timeline migrated with ${moments.length} moments`);
  } catch (error: any) {
    console.error(`  ❌ Error migrating timeline:`, error.message);
  }
}

async function migrateGuestSubmissions() {
  console.log('\n👥 Starting guest submissions migration...');
  
  try {
    const submissionsRef = collection(db, 'guestSubmissions');
    const submissionsSnapshot = await getDocs(query(submissionsRef, limit(100)));
    
    console.log(`Found ${submissionsSnapshot.size} guest submissions to migrate`);
    
    let migrated = 0;
    let skipped = 0;
    
    for (const doc of submissionsSnapshot.docs) {
      const submission = doc.data();
      
      try {
        // Get the wedding by slug
        const { data: wedding } = await supabase
          .from('wedding_weddings')
          .select('id')
          .eq('slug', submission.weddingId)
          .single();
        
        if (!wedding) {
          console.log(`⏭️  No wedding found for submission ${doc.id}, skipping`);
          skipped++;
          continue;
        }
        
        // Create guest submission
        const { error } = await supabase.from('wedding_guest_submissions').insert({
          wedding_id: wedding.id,
          guest_name: submission.guestName || 'Anonymous',
          guest_email: submission.guestEmail,
          table_number: submission.tableNumber,
          song_title: submission.songTitle || 'Unknown',
          song_artist: submission.songArtist || 'Unknown',
          spotify_id: submission.spotifyId,
          moment_suggestion: submission.momentSuggestion,
          dedication: submission.dedication,
          special_memory: submission.specialMemory,
          status: submission.status || 'pending',
          created_at: submission.createdAt?.toDate?.() || new Date(),
        });
        
        if (!error) {
          console.log(`✅ Migrated guest submission from ${submission.guestName}`);
          migrated++;
        } else {
          console.error(`❌ Error migrating submission:`, error.message);
        }
      } catch (error: any) {
        console.error(`❌ Error migrating submission ${doc.id}:`, error.message);
      }
    }
    
    console.log(`\n✅ Guest submissions migration completed: ${migrated} migrated, ${skipped} skipped`);
  } catch (error) {
    console.error('❌ Error in guest submissions migration:', error);
  }
}

async function main() {
  console.log('🚀 Starting Firebase to Supabase migration...');
  console.log('=====================================\n');
  
  // Test connection
  const connected = await testConnection();
  if (!connected) {
    console.error('❌ Could not connect to Supabase. Check your credentials.');
    return;
  }
  
  // Run migrations in sequence
  await migrateWeddings();
  await migrateGuestSubmissions();
  
  console.log('\n=====================================');
  console.log('✅ Migration completed!\n');
  console.log('Next steps:');
  console.log('1. Test the migrated data in Supabase dashboard');
  console.log('2. Check that weddings and timelines are properly created');
  console.log('3. Test login with migrated users');
  console.log('4. Deploy and test in production');
}

// Run the migration
main().catch(console.error);