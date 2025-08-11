/**
 * API Route: Search songs in database
 * GET /api/search-songs?q=query&moment=first_dance&limit=10
 */

import { NextRequest, NextResponse } from 'next/server';
import { getMusicDatabase } from '@/lib/music-database-service';
import { WeddingMoment } from '@/types/music-ai';
import { mapCountryToCulture } from '@/lib/country-culture-mapping';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const moment = searchParams.get('moment') as WeddingMoment | null;
    const limit = parseInt(searchParams.get('limit') || '20');
    const mood = searchParams.get('mood');
    const genres = searchParams.get('genres')?.split(',').filter(g => g);
    const country = searchParams.get('country');
    
    const musicDb = getMusicDatabase();
    
    let songs;
    
    if (moment) {
      // Search by moment with filters
      songs = await musicDb.getSongsForMoment(moment, { 
        limit,
        genres,
        country: country || undefined
      });
    } else if (query) {
      // Text search - using filters interface
      songs = await musicDb.searchSongs({
        genres,
        cultural_fit: country ? mapCountryToCulture(country) : undefined
      }, limit);
      // Filter by query in memory for now
      songs = songs.filter(song => 
        song.title.toLowerCase().includes(query.toLowerCase()) ||
        song.artist.toLowerCase().includes(query.toLowerCase())
      );
    } else {
      // Get top songs with filters
      songs = await musicDb.searchSongs({
        genres,
        cultural_fit: country ? mapCountryToCulture(country) : undefined
      }, limit);
    }
    
    // Filter by mood if specified
    if (mood && songs) {
      songs = songs.filter(song => 
        song.wedding_moods.includes(mood as any)
      );
    }
    
    // Format response
    const response = {
      success: true,
      count: songs.length,
      songs: songs.map(song => ({
        id: song.spotify_id,
        title: song.title,
        artist: song.artist,
        album: song.album,
        duration: Math.round(song.duration_ms / 1000), // seconds
        previewUrl: song.preview_url,
        albumArt: song.album_art_url,
        spotifyUrl: song.external_urls?.spotify,
        moments: song.wedding_moments,
        moods: song.wedding_moods,
        score: song.wedding_score,
        popularity: song.popularity,
        explicit: song.explicit
      }))
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Song search error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to search songs',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST endpoint for advanced search
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const musicDb = getMusicDatabase();
    
    // Advanced search with multiple filters
    const filters = {
      moments: body.moments || [],
      moods: body.moods || [],
      genres: body.genres || [],
      excludeExplicit: body.excludeExplicit || false,
      minScore: body.minScore || 0,
      maxDuration: body.maxDuration, // in seconds
      minPopularity: body.minPopularity || 0
    };
    
    // Start with all songs or search results
    let songs = body.query ? 
      await musicDb.searchSongs({}, 100) :
      await musicDb.getPopularSongs({ limit: 100 });
    
    // Apply text search if provided
    if (body.query) {
      const query = body.query.toLowerCase();
      songs = songs.filter(song => 
        song.title.toLowerCase().includes(query) ||
        song.artist.toLowerCase().includes(query) ||
        song.album?.toLowerCase().includes(query)
      );
    }
    
    // Apply filters
    if (filters.moments.length > 0) {
      songs = songs.filter(song => 
        filters.moments.some((m: string) => song.wedding_moments.includes(m as WeddingMoment))
      );
    }
    
    if (filters.moods.length > 0) {
      songs = songs.filter(song => 
        filters.moods.some((m: string) => song.wedding_moods.includes(m as any))
      );
    }
    
    if (filters.genres.length > 0) {
      songs = songs.filter(song => 
        filters.genres.some((g: string) => song.wedding_genres.includes(g))
      );
    }
    
    if (filters.excludeExplicit) {
      songs = songs.filter(song => !song.explicit);
    }
    
    if (filters.minScore > 0) {
      songs = songs.filter(song => song.wedding_score >= filters.minScore);
    }
    
    if (filters.maxDuration) {
      songs = songs.filter(song => song.duration_ms <= filters.maxDuration * 1000);
    }
    
    if (filters.minPopularity > 0) {
      songs = songs.filter(song => song.popularity >= filters.minPopularity);
    }
    
    // Sort by score
    songs.sort((a, b) => b.wedding_score - a.wedding_score);
    
    // Limit results
    const limit = body.limit || 50;
    songs = songs.slice(0, limit);
    
    // Format response
    const response = {
      success: true,
      count: songs.length,
      filters: filters,
      songs: songs.map(song => ({
        id: song.spotify_id,
        title: song.title,
        artist: song.artist,
        album: song.album,
        duration: Math.round(song.duration_ms / 1000),
        previewUrl: song.preview_url,
        albumArt: song.album_art_url,
        spotifyUrl: song.external_urls?.spotify,
        moments: song.wedding_moments,
        moods: song.wedding_moods,
        genres: song.wedding_genres,
        score: song.wedding_score,
        popularity: song.popularity,
        explicit: song.explicit
      }))
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Advanced search error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to perform advanced search',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}