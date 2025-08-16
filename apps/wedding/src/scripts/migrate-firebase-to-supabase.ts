/**
 * Migration script from Firebase to Supabase
 * This script migrates existing Firebase data to the new Supabase multi-app structure
 */

import { createClient } from '@supabase/supabase-js';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Initialize Supabase client with service role
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize Firebase Admin
const firebaseApp = initializeApp({
  credential: cert({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

const firestore = getFirestore(firebaseApp);
const firebaseAuth = getAuth(firebaseApp);

async function migrateUsers() {
  console.log('Starting user migration...');
  
  try {
    // Get all Firebase users
    const listUsersResult = await firebaseAuth.listUsers();
    const users = listUsersResult.users;
    
    console.log(`Found ${users.length} users to migrate`);
    
    for (const firebaseUser of users) {
      try {
        // Check if user already exists in Supabase
        const { data: existingUser } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', firebaseUser.email)
          .single();
        
        if (existingUser) {
          console.log(`User ${firebaseUser.email} already exists, skipping`);
          continue;
        }
        
        // Create user in Supabase Auth
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
        
        if (authError) {
          console.error(`Error creating user ${firebaseUser.email}:`, authError);
          continue;
        }
        
        console.log(`Migrated user: ${firebaseUser.email}`);
        
        // The profile will be created automatically via the trigger
        // Track wedding app usage
        if (supabaseUser?.user) {
          await supabase.from('user_apps').insert({
            user_id: supabaseUser.user.id,
            app_name: 'wedding',
            first_accessed: firebaseUser.metadata.creationTime,
            last_accessed: firebaseUser.metadata.lastSignInTime,
          });
        }
      } catch (error) {
        console.error(`Error migrating user ${firebaseUser.email}:`, error);
      }
    }
    
    console.log('User migration completed');
  } catch (error) {
    console.error('Error in user migration:', error);
  }
}

async function migrateWeddings() {
  console.log('Starting wedding migration...');
  
  try {
    // Get all weddings from Firebase
    const weddingsSnapshot = await firestore.collection('weddings').get();
    console.log(`Found ${weddingsSnapshot.size} weddings to migrate`);
    
    for (const doc of weddingsSnapshot.docs) {
      const weddingData = doc.data();
      
      try {
        // Get the Supabase user ID from email
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', weddingData.userEmail)
          .single();
        
        if (!profile) {
          console.log(`No Supabase user found for ${weddingData.userEmail}, skipping wedding`);
          continue;
        }
        
        // Create wedding in Supabase
        const { data: wedding, error } = await supabase
          .from('wedding_weddings')
          .insert({
            slug: weddingData.slug || doc.id,
            couple_names: weddingData.coupleNames || 'Unnamed Couple',
            partner1_name: weddingData.partner1Name,
            partner2_name: weddingData.partner2Name,
            wedding_date: weddingData.weddingDate,
            venue_name: weddingData.venueName,
            venue_address: weddingData.venueAddress,
            venue_type: weddingData.venueType,
            guest_count: weddingData.guestCount,
            owner_id: profile.id,
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
            created_at: weddingData.createdAt,
            updated_at: weddingData.updatedAt,
          })
          .select()
          .single();
        
        if (error) {
          console.error(`Error creating wedding for ${weddingData.coupleNames}:`, error);
          continue;
        }
        
        console.log(`Migrated wedding: ${weddingData.coupleNames}`);
        
        // Migrate timeline if exists
        if (weddingData.timeline && wedding) {
          await migrateTimeline(wedding.id, weddingData.timeline);
        }
        
        // Create associated playlist
        if (wedding) {
          const { data: playlist } = await supabase
            .from('playlists')
            .insert({
              owner_id: profile.id,
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
      } catch (error) {
        console.error(`Error migrating wedding ${doc.id}:`, error);
      }
    }
    
    console.log('Wedding migration completed');
  } catch (error) {
    console.error('Error in wedding migration:', error);
  }
}

async function migrateTimeline(weddingId: string, timeline: any) {
  console.log(`Migrating timeline for wedding ${weddingId}`);
  
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
        
        if (!dbSong) {
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
        
        songIds.push(song.id);
      }
      
      // Create timeline moment
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
    
    console.log(`Timeline migrated for wedding ${weddingId}`);
  } catch (error) {
    console.error(`Error migrating timeline for wedding ${weddingId}:`, error);
  }
}

async function migrateGuestSubmissions() {
  console.log('Starting guest submissions migration...');
  
  try {
    const submissionsSnapshot = await firestore.collection('guestSubmissions').get();
    console.log(`Found ${submissionsSnapshot.size} guest submissions to migrate`);
    
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
          console.log(`No wedding found for submission ${doc.id}, skipping`);
          continue;
        }
        
        // Create guest submission
        await supabase.from('wedding_guest_submissions').insert({
          wedding_id: wedding.id,
          guest_name: submission.guestName,
          guest_email: submission.guestEmail,
          table_number: submission.tableNumber,
          song_title: submission.songTitle,
          song_artist: submission.songArtist,
          spotify_id: submission.spotifyId,
          moment_suggestion: submission.momentSuggestion,
          dedication: submission.dedication,
          special_memory: submission.specialMemory,
          status: submission.status || 'pending',
          created_at: submission.createdAt,
        });
        
        console.log(`Migrated guest submission from ${submission.guestName}`);
      } catch (error) {
        console.error(`Error migrating submission ${doc.id}:`, error);
      }
    }
    
    console.log('Guest submissions migration completed');
  } catch (error) {
    console.error('Error in guest submissions migration:', error);
  }
}

async function main() {
  console.log('Starting Firebase to Supabase migration...');
  console.log('=====================================');
  
  // Run migrations in sequence
  await migrateUsers();
  await migrateWeddings();
  await migrateGuestSubmissions();
  
  console.log('=====================================');
  console.log('Migration completed!');
  console.log('');
  console.log('Next steps:');
  console.log('1. Test the migrated data in Supabase dashboard');
  console.log('2. Update environment variables in production');
  console.log('3. Switch DNS/routing to use new Supabase-backed app');
  console.log('4. Monitor for any issues');
}

// Run the migration
main().catch(console.error);