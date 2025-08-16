/**
 * Migration script using Firebase Service Account
 */

import { createClient } from '@supabase/supabase-js';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import * as dotenv from 'dotenv';
import { ALL_WEDDING_SONGS_ENRICHED } from '../data/spotify-wedding-songs-enriched';

dotenv.config({ path: '.env.local' });

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize Firebase Admin with service account
let serviceAccount;
try {
  // Try to load service account from file
  serviceAccount = require('../../firebase-service-account.json');
} catch (error) {
  console.error('❌ Could not find firebase-service-account.json');
  console.error('Please download it from Firebase Console > Project Settings > Service Accounts');
  process.exit(1);
}

const firebaseApp = initializeApp({
  credential: cert(serviceAccount),
});

const firestore = getFirestore(firebaseApp);
const firebaseAuth = getAuth(firebaseApp);

async function migrateSongs() {
  console.log('\n🎵 Migrating songs from enriched data...');
  
  let migrated = 0;
  let errors = 0;
  
  // First, migrate all the enriched songs we have
  for (const song of ALL_WEDDING_SONGS_ENRICHED) {
    try {
      const { error } = await supabase.from('songs').upsert({
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
      });
      
      if (!error) {
        migrated++;
        if (migrated % 100 === 0) {
          console.log(`  Migrated ${migrated} songs...`);
        }
      } else {
        errors++;
      }
    } catch (error) {
      errors++;
    }
  }
  
  console.log(`✅ Songs migration complete: ${migrated} songs imported, ${errors} errors`);
  return migrated;
}

async function migrateUsers() {
  console.log('\n👤 Migrating users...');
  
  try {
    const listUsersResult = await firebaseAuth.listUsers(100);
    const users = listUsersResult.users;
    
    console.log(`Found ${users.length} users to migrate`);
    
    let migrated = 0;
    let skipped = 0;
    
    for (const firebaseUser of users) {
      try {
        // Check if user already exists
        const { data: existingUser } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', firebaseUser.email)
          .single();
        
        if (existingUser) {
          skipped++;
          continue;
        }
        
        // Create user in Supabase
        const { data: supabaseUser, error: authError } = await supabase.auth.admin.createUser({
          email: firebaseUser.email!,
          email_confirm: true,
          user_metadata: {
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
            avatar_url: firebaseUser.photoURL,
            firebase_uid: firebaseUser.uid,
            initial_app: 'wedding'
          }
        });
        
        if (!authError && supabaseUser?.user) {
          migrated++;
          console.log(`  ✅ Migrated user: ${firebaseUser.email}`);
        }
      } catch (error) {
        console.error(`  ❌ Error migrating user ${firebaseUser.email}:`, error);
      }
    }
    
    console.log(`✅ User migration complete: ${migrated} migrated, ${skipped} skipped`);
  } catch (error) {
    console.error('❌ Error in user migration:', error);
  }
}

async function migrateWeddings() {
  console.log('\n💒 Migrating weddings...');
  
  try {
    const weddingsSnapshot = await firestore.collection('weddings').limit(100).get();
    console.log(`Found ${weddingsSnapshot.size} weddings to migrate`);
    
    let migrated = 0;
    let skipped = 0;
    let errors = 0;
    
    for (const doc of weddingsSnapshot.docs) {
      const weddingData = doc.data();
      
      try {
        // Check if already exists
        const existingSlug = weddingData.slug || doc.id;
        const { data: existing } = await supabase
          .from('wedding_weddings')
          .select('id')
          .eq('slug', existingSlug)
          .single();
        
        if (existing) {
          skipped++;
          continue;
        }
        
        // Get or create user
        let userId: string | null = null;
        
        if (weddingData.userEmail) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', weddingData.userEmail)
            .single();
          
          if (profile) {
            userId = profile.id;
          } else {
            // Create user
            const { data: authUser } = await supabase.auth.admin.createUser({
              email: weddingData.userEmail,
              email_confirm: true,
              user_metadata: {
                name: weddingData.coupleNames || 'Wedding User',
                initial_app: 'wedding'
              }
            });
            
            if (authUser?.user) {
              userId = authUser.user.id;
            }
          }
        }
        
        if (!userId) {
          console.log(`  ⚠️  No user for wedding ${weddingData.coupleNames}, skipping`);
          errors++;
          continue;
        }
        
        // Create wedding
        const { data: wedding, error } = await supabase
          .from('wedding_weddings')
          .insert({
            slug: existingSlug,
            couple_names: weddingData.coupleNames || 'Unnamed Couple',
            partner1_name: weddingData.partner1Name,
            partner2_name: weddingData.partner2Name,
            wedding_date: weddingData.weddingDate,
            venue_name: weddingData.venueName,
            venue_type: weddingData.venueType,
            guest_count: weddingData.guestCount || 100,
            owner_id: userId,
            payment_tier: weddingData.subscriptionTier || 'free',
            payment_status: weddingData.paymentStatus || weddingData.subscriptionStatus || 'active',
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
          })
          .select()
          .single();
        
        if (error) {
          console.error(`  ❌ Error creating wedding:`, error.message);
          errors++;
          continue;
        }
        
        // Migrate timeline
        if (weddingData.timeline?.moments && wedding) {
          for (let i = 0; i < weddingData.timeline.moments.length; i++) {
            const moment = weddingData.timeline.moments[i];
            const songIds = (moment.songs || [])
              .filter((s: any) => s.id)
              .map((s: any) => s.id);
            
            if (songIds.length > 0) {
              await supabase.from('wedding_timeline').upsert({
                wedding_id: wedding.id,
                moment_id: moment.id.toLowerCase().replace(/\s+/g, '-'),
                moment_name: moment.name || moment.id,
                moment_order: i + 1,
                song_ids: songIds,
              }, {
                onConflict: 'wedding_id,moment_id'
              });
            }
          }
        }
        
        // Create playlist
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
          
          if (playlist) {
            await supabase
              .from('wedding_weddings')
              .update({ main_playlist_id: playlist.id })
              .eq('id', wedding.id);
          }
        }
        
        migrated++;
        console.log(`  ✅ Migrated wedding: ${weddingData.coupleNames}`);
        
      } catch (error: any) {
        console.error(`  ❌ Error migrating wedding ${doc.id}:`, error.message);
        errors++;
      }
    }
    
    console.log(`✅ Wedding migration complete: ${migrated} migrated, ${skipped} skipped, ${errors} errors`);
  } catch (error) {
    console.error('❌ Error in wedding migration:', error);
  }
}

async function main() {
  console.log('🚀 Starting Firebase to Supabase migration...');
  console.log('=====================================\n');
  
  // Test Supabase connection
  const { data, error } = await supabase.from('profiles').select('count').single();
  if (error) {
    console.error('❌ Supabase connection failed:', error);
    process.exit(1);
  }
  console.log('✅ Supabase connected successfully\n');
  
  // Run migrations
  const songCount = await migrateSongs();
  await migrateUsers();
  await migrateWeddings();
  
  console.log('\n=====================================');
  console.log('✅ Migration completed!');
  console.log(`📊 Summary:`);
  console.log(`   - ${songCount} songs imported`);
  console.log(`   - Check Supabase dashboard for users and weddings`);
  console.log('\nNext steps:');
  console.log('1. Test login with migrated users');
  console.log('2. Test wedding builder with migrated data');
  console.log('3. Verify songs appear in search');
}

main().catch(console.error);