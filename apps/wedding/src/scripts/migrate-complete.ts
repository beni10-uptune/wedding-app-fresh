/**
 * Complete Firebase to Supabase Migration
 * This will migrate ALL songs, users, and weddings
 */

import { createClient } from '@supabase/supabase-js';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize Firebase Admin
import * as fs from 'fs';
import * as path from 'path';

let serviceAccount;
try {
  const serviceAccountPath = path.join(process.cwd(), 'firebase-service-account.json');
  const serviceAccountFile = fs.readFileSync(serviceAccountPath, 'utf-8');
  serviceAccount = JSON.parse(serviceAccountFile);
} catch (error) {
  console.error('❌ Could not find firebase-service-account.json');
  console.error('Please download it from Firebase Console > Project Settings > Service Accounts');
  process.exit(1);
}

const firebaseApp = initializeApp({
  credential: cert(serviceAccount as any),
});

const firestore = getFirestore(firebaseApp);
const firebaseAuth = getAuth(firebaseApp);

async function migrateAllSongs() {
  console.log('\n🎵 Migrating ALL songs from Firebase...');
  
  try {
    // Get ALL songs from the songs_master collection in Firebase (the main collection)
    const songsSnapshot = await firestore.collection('songs_master').get();
    console.log(`Found ${songsSnapshot.size} songs in Firebase songs_master collection`);
    
    let migrated = 0;
    let errors = 0;
    const batchSize = 50;
    const songs: any[] = [];
    
    // Collect all songs
    songsSnapshot.forEach(doc => {
      const data = doc.data();
      songs.push({
        id: doc.id,
        ...data
      });
    });
    
    // Process in batches
    for (let i = 0; i < songs.length; i += batchSize) {
      const batch = songs.slice(i, i + batchSize);
      
      const songsToInsert = batch.map(song => ({
        id: song.id || song.spotifyId,
        title: song.title || song.name || 'Unknown',
        artist: song.artist || song.artists || 'Unknown',
        album: song.album || null,
        album_art: song.albumArt || song.albumCover || song.imageUrl || null,
        preview_url: song.previewUrl || song.preview_url || null,
        spotify_uri: song.spotifyUri || song.uri || (song.id ? `spotify:track:${song.id}` : null),
        duration: song.duration || song.duration_ms ? Math.floor(song.duration_ms / 1000) : null,
        energy: song.energy || null,
        bpm: song.bpm || song.tempo || null,
        valence: song.valence || null,
        danceability: song.danceability || null,
        acousticness: song.acousticness || null,
        instrumentalness: song.instrumentalness || null,
        speechiness: song.speechiness || null,
        loudness: song.loudness || null,
        genres: song.genres || song.artistGenres || [],
        moods: song.moods || [],
        contexts: song.contexts || ['wedding'],
        tags: song.tags || [],
        explicit: song.explicit || false,
        popularity: song.popularity || 50,
        added_by: song.addedBy || null,
      }));
      
      const { error } = await supabase
        .from('songs')
        .upsert(songsToInsert, { 
          onConflict: 'id',
          ignoreDuplicates: false 
        });
      
      if (error) {
        console.error(`❌ Error in batch ${Math.floor(i / batchSize) + 1}:`, error.message);
        errors += batch.length;
      } else {
        migrated += batch.length;
        console.log(`✅ Migrated batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(songs.length / batchSize)} (${migrated} songs total)`);
      }
    }
    
    // Also check for songs in subcollections or other places
    console.log('\n📀 Checking for additional song sources...');
    
    // Check weddingSongs collection if it exists
    try {
      const weddingSongsSnapshot = await firestore.collection('weddingSongs').get();
      if (weddingSongsSnapshot.size > 0) {
        console.log(`Found ${weddingSongsSnapshot.size} additional wedding songs`);
        
        const weddingSongs: any[] = [];
        weddingSongsSnapshot.forEach(doc => {
          const data = doc.data();
          weddingSongs.push({
            id: doc.id,
            ...data
          });
        });
        
        // Process wedding songs
        for (let i = 0; i < weddingSongs.length; i += batchSize) {
          const batch = weddingSongs.slice(i, i + batchSize);
          
          const songsToInsert = batch.map(song => ({
            id: song.id || song.spotifyId,
            title: song.title || song.name || 'Unknown',
            artist: song.artist || song.artists || 'Unknown',
            album: song.album || null,
            album_art: song.albumArt || song.albumCover || null,
            spotify_uri: song.spotifyUri || song.uri || (song.id ? `spotify:track:${song.id}` : null),
            duration: song.duration || null,
            energy: song.energy || null,
            genres: song.genres || song.artistGenres || [],
            contexts: ['wedding'],
            explicit: song.explicit || false,
          }));
          
          const { error } = await supabase
            .from('songs')
            .upsert(songsToInsert, { 
              onConflict: 'id',
              ignoreDuplicates: false 
            });
          
          if (!error) {
            migrated += batch.length;
          }
        }
      }
    } catch (error) {
      console.log('No weddingSongs collection found');
    }
    
    console.log(`\n✅ Songs migration complete: ${migrated} songs imported, ${errors} errors`);
    
    // Verify final count
    const { count } = await supabase
      .from('songs')
      .select('*', { count: 'exact', head: true });
    
    console.log(`📊 Total songs in Supabase: ${count}`);
    
    return migrated;
    
  } catch (error) {
    console.error('❌ Error migrating songs:', error);
    return 0;
  }
}

async function migrateUsers() {
  console.log('\n👤 Migrating users...');
  
  try {
    let allUsers: any[] = [];
    let nextPageToken: string | undefined;
    
    // Get all users (paginated)
    do {
      const listUsersResult = await firebaseAuth.listUsers(1000, nextPageToken);
      allUsers = allUsers.concat(listUsersResult.users);
      nextPageToken = listUsersResult.pageToken;
    } while (nextPageToken);
    
    console.log(`Found ${allUsers.length} users to migrate`);
    
    let migrated = 0;
    let skipped = 0;
    
    for (const firebaseUser of allUsers) {
      try {
        if (!firebaseUser.email) {
          console.log(`⚠️  Skipping user without email: ${firebaseUser.uid}`);
          skipped++;
          continue;
        }
        
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
          email: firebaseUser.email,
          email_confirm: true,
          user_metadata: {
            name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            avatar_url: firebaseUser.photoURL,
            firebase_uid: firebaseUser.uid,
            initial_app: 'wedding'
          }
        });
        
        if (!authError && supabaseUser?.user) {
          migrated++;
          if (migrated % 10 === 0) {
            console.log(`  ✅ Migrated ${migrated} users...`);
          }
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
  console.log('\n💒 Migrating weddings and timelines...');
  
  try {
    const weddingsSnapshot = await firestore.collection('weddings').get();
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
          let timelineSongs = 0;
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
              timelineSongs += songIds.length;
            }
          }
          console.log(`    📍 Migrated timeline with ${timelineSongs} songs`);
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
  console.log('🚀 Starting COMPLETE Firebase to Supabase migration...');
  console.log('=====================================\n');
  
  // Test Supabase connection
  const { data, error } = await supabase.from('profiles').select('count').single();
  if (error) {
    console.error('❌ Supabase connection failed:', error);
    process.exit(1);
  }
  console.log('✅ Supabase connected successfully');
  
  // Test Firebase connection
  try {
    const testDoc = await firestore.collection('songs').limit(1).get();
    console.log('✅ Firebase connected successfully\n');
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    process.exit(1);
  }
  
  // Run migrations
  const songCount = await migrateAllSongs();
  await migrateUsers();
  await migrateWeddings();
  
  console.log('\n=====================================');
  console.log('✅ COMPLETE MIGRATION FINISHED!');
  console.log('\n📊 Final Summary:');
  
  // Get final counts
  const { count: finalSongCount } = await supabase
    .from('songs')
    .select('*', { count: 'exact', head: true });
  
  const { count: finalUserCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });
    
  const { count: finalWeddingCount } = await supabase
    .from('wedding_weddings')
    .select('*', { count: 'exact', head: true });
  
  console.log(`   - Songs in database: ${finalSongCount}`);
  console.log(`   - Users in database: ${finalUserCount}`);
  console.log(`   - Weddings in database: ${finalWeddingCount}`);
  
  console.log('\n✅ You can now:');
  console.log('   1. Test login with migrated users');
  console.log('   2. View migrated weddings');
  console.log('   3. Search through ALL songs');
  console.log('   4. Generate playlists with the complete song library');
  
  // Clean up - Firebase Admin SDK doesn't need explicit cleanup
  // Process will exit naturally
}

main().catch(console.error);