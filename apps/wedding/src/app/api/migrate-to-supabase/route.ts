import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Initialize Supabase client with service role
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
    console.log('Starting migration...');
    
    // Test Supabase connection
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (testError) {
      return NextResponse.json({ 
        error: 'Supabase connection failed', 
        details: testError 
      }, { status: 500 });
    }
    
    // Get all weddings from Firebase
    const weddingsRef = collection(db, 'weddings');
    let weddingsSnapshot;
    
    try {
      // Try with orderBy first
      weddingsSnapshot = await getDocs(query(weddingsRef, orderBy('createdAt', 'desc'), limit(50)));
    } catch (error) {
      // Fallback to simple query without ordering if permissions issue
      console.log('Falling back to simple query without ordering');
      weddingsSnapshot = await getDocs(query(weddingsRef, limit(50)));
    }
    
    const results = {
      total: weddingsSnapshot.size,
      migrated: 0,
      skipped: 0,
      errors: [] as any[]
    };
    
    for (const doc of weddingsSnapshot.docs) {
      const weddingData = doc.data();
      
      try {
        // Check if wedding already exists
        const existingSlug = weddingData.slug || doc.id;
        const { data: existing } = await supabase
          .from('wedding_weddings')
          .select('id')
          .eq('slug', existingSlug)
          .single();
        
        if (existing) {
          results.skipped++;
          continue;
        }
        
        // Create or find user
        let userId: string;
        if (weddingData.userEmail) {
          // Check if user exists
          const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', weddingData.userEmail)
            .single();
          
          if (profile) {
            userId = profile.id;
          } else {
            // Create user
            const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
              email: weddingData.userEmail,
              email_confirm: true,
              user_metadata: {
                name: weddingData.coupleNames || 'Wedding User',
                initial_app: 'wedding'
              }
            });
            
            if (authError || !authUser?.user) {
              results.errors.push({
                wedding: weddingData.coupleNames,
                error: 'Could not create user'
              });
              continue;
            }
            
            userId = authUser.user.id;
          }
        } else {
          results.errors.push({
            wedding: weddingData.coupleNames,
            error: 'No user email'
          });
          continue;
        }
        
        // Create wedding
        const { data: wedding, error: weddingError } = await supabase
          .from('wedding_weddings')
          .insert({
            slug: existingSlug,
            couple_names: weddingData.coupleNames || 'Unnamed Couple',
            partner1_name: weddingData.partner1Name,
            partner2_name: weddingData.partner2Name,
            wedding_date: weddingData.weddingDate,
            venue_name: weddingData.venueName,
            venue_type: weddingData.venueType,
            guest_count: weddingData.guestCount,
            owner_id: userId,
            payment_tier: weddingData.subscriptionTier || 'free',
            payment_status: weddingData.paymentStatus || 'active',
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
          })
          .select()
          .single();
        
        if (weddingError) {
          results.errors.push({
            wedding: weddingData.coupleNames,
            error: weddingError.message
          });
          continue;
        }
        
        // Migrate timeline if exists
        if (weddingData.timeline?.moments && wedding) {
          for (let i = 0; i < weddingData.timeline.moments.length; i++) {
            const moment = weddingData.timeline.moments[i];
            const songIds = (moment.songs || [])
              .filter((s: any) => s.id)
              .map((s: any) => s.id);
            
            if (songIds.length > 0) {
              // Ensure songs exist
              for (const song of moment.songs || []) {
                if (song.id && song.title && song.artist) {
                  await supabase.from('songs').upsert({
                    id: song.id,
                    title: song.title,
                    artist: song.artist,
                    album: song.album,
                    album_art: song.albumArt,
                    spotify_uri: song.spotifyUri || `spotify:track:${song.id}`,
                    duration: song.duration,
                    energy: song.energy,
                    genres: song.genres || [],
                  });
                }
              }
              
              // Create timeline moment
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
        
        results.migrated++;
      } catch (error: any) {
        results.errors.push({
          wedding: weddingData.coupleNames,
          error: error.message
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      results,
      message: `Migration completed: ${results.migrated} migrated, ${results.skipped} skipped, ${results.errors.length} errors`
    });
    
  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json({ 
      error: 'Migration failed', 
      details: error.message 
    }, { status: 500 });
  }
}