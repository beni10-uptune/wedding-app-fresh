/**
 * API route to import Spotify songs into Firestore
 * This runs server-side where Firebase Admin is already configured
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSpotifyService } from '@/lib/spotify-service';
import { getMusicDatabase } from '@/lib/music-database-service';
import type { MasterSong } from '@/types/music-ai';

// Simple auth check - in production, use proper authentication
const IMPORT_SECRET = process.env.IMPORT_SECRET;

export async function POST(request: NextRequest) {
  try {
    // Check authorization
    const { secret, searchTerms, limit } = await request.json();
    
    if (!IMPORT_SECRET || secret !== IMPORT_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Default search terms if not provided
    const terms = searchTerms || [
      'wedding 2025',
      'first dance songs',
      'wedding party',
      'wedding reception',
      'wedding ceremony'
    ];

    const maxPlaylists = limit || 3; // Limit playlists per search term

    // Starting Spotify import for search terms

    const spotifyService = getSpotifyService();
    const musicDatabase = getMusicDatabase();
    const uniqueSongs = new Map<string, MasterSong>();
    const errors: string[] = [];
    let playlistsProcessed = 0;

    // Initialize Spotify
    await spotifyService.initializeClientCredentials();

    // Process each search term
    for (const searchTerm of terms) {
      try {
        // Search for playlists
        const playlists = await spotifyService.searchPlaylists(searchTerm, { 
          limit: maxPlaylists 
        });
        
        // Process each playlist
        for (const playlist of playlists) {
          // Skip playlists with very few followers
          if ((playlist as any).followers && (playlist as any).followers.total < 10) {
            continue;
          }
          
          playlistsProcessed++;
          
          try {
            // Get all tracks from playlist
            const tracks = await spotifyService.getAllPlaylistTracks(playlist.id);
            
            // Get track IDs
            const trackIds = tracks
              .filter(item => item.track && item.track.id)
              .map(item => item.track.id);
            
            if (trackIds.length > 0) {
              // Get audio features
              const audioFeatures = await spotifyService.getAudioFeatures(trackIds);
              
              // Convert and store each track
              for (const track of tracks) {
                if (!track.track || !track.track.id) continue;
                
                // Skip if we already have this song
                if (uniqueSongs.has(track.track.id)) continue;
                
                // Find corresponding audio features
                const features = audioFeatures.find(f => f && f.id === track.track.id);
                
                // Convert to MasterSong format
                const masterSong = spotifyService.convertToMasterSong(track.track, features);
                
                if (masterSong.spotify_id) {
                  uniqueSongs.set(track.track.id, masterSong as MasterSong);
                }
              }
            }
          } catch (error) {
            errors.push(`Failed to process playlist "${playlist.name}": ${error}`);
          }
        }
      } catch (error) {
        errors.push(`Failed to search for "${searchTerm}": ${error}`);
      }
    }

    // Save songs to database
    const songsToSave = Array.from(uniqueSongs.values());
    
    if (songsToSave.length > 0) {
      // Save in batches
      await musicDatabase.bulkSaveSongs(songsToSave);
    }

    // Prepare response
    const response = {
      success: true,
      summary: {
        totalSongsImported: uniqueSongs.size,
        playlistsProcessed,
        searchTermsUsed: terms.length,
        errors: errors.length
      },
      details: {
        searchTerms: terms,
        errors: errors.slice(0, 10) // Limit error details
      }
    };

    // Analyze imported songs
    const analysis: any = {
      moments: {},
      moods: {},
      genres: {}
    };

    for (const song of uniqueSongs.values()) {
      // Count moments
      for (const moment of song.wedding_moments) {
        analysis.moments[moment] = (analysis.moments[moment] || 0) + 1;
      }
      
      // Count moods
      for (const mood of song.wedding_moods) {
        analysis.moods[mood] = (analysis.moods[mood] || 0) + 1;
      }
      
      // Count genres
      for (const genre of song.wedding_genres) {
        analysis.genres[genre] = (analysis.genres[genre] || 0) + 1;
      }
    }

    (response.summary as any).analysis = analysis;

    return NextResponse.json(response);

  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { 
        error: 'Import failed', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check if the route is working
export async function GET() {
  return NextResponse.json({
    message: 'Spotify import endpoint ready',
    usage: 'POST with { secret, searchTerms?, limit? }'
  });
}