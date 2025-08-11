/**
 * Test endpoint to verify country and genre filtering
 * GET /api/test-filters
 */

import { NextRequest, NextResponse } from 'next/server';
import { getMusicDatabase } from '@/lib/music-database-service';
import { WeddingMoment } from '@/types/music-ai';
import { mapCountryToCulture } from '@/lib/country-culture-mapping';

export async function GET(request: NextRequest) {
  try {
    const musicDb = getMusicDatabase();
    
    // Test 1: Get songs for UK weddings
    const ukSongs = await musicDb.getSongsForMoment(
      WeddingMoment.PARTY_PEAK,
      {
        limit: 5,
        country: 'UK'
      }
    );
    
    // Test 2: Get songs with genre filter (pop and rock)
    const genreSongs = await musicDb.getSongsForMoment(
      WeddingMoment.DINNER,
      {
        limit: 5,
        genres: ['pop', 'rock']
      }
    );
    
    // Test 3: Combined filters
    const combinedSongs = await musicDb.getSongsForMoment(
      WeddingMoment.COCKTAIL,
      {
        limit: 5,
        genres: ['indie', 'electronic'],
        country: 'US'
      }
    );
    
    // Test 4: Search with filters
    const searchResults = await musicDb.searchSongs({
      genres: ['rnb'],
      cultural_fit: mapCountryToCulture('Ireland')
    }, 5);
    
    return NextResponse.json({
      success: true,
      tests: {
        ukFiltering: {
          description: 'UK country filter for party songs',
          culturalContexts: mapCountryToCulture('UK'),
          songCount: ukSongs.length,
          songs: ukSongs.slice(0, 3).map(s => ({
            title: s.title,
            artist: s.artist,
            cultural_fit: s.cultural_fit,
            genres: s.wedding_genres
          }))
        },
        genreFiltering: {
          description: 'Pop and Rock genre filter for dinner',
          genres: ['pop', 'rock'],
          songCount: genreSongs.length,
          songs: genreSongs.slice(0, 3).map(s => ({
            title: s.title,
            artist: s.artist,
            genres: s.wedding_genres
          }))
        },
        combinedFiltering: {
          description: 'US + Indie/Electronic for cocktails',
          country: 'US',
          genres: ['indie', 'electronic'],
          culturalContexts: mapCountryToCulture('US'),
          songCount: combinedSongs.length,
          songs: combinedSongs.slice(0, 3).map(s => ({
            title: s.title,
            artist: s.artist,
            cultural_fit: s.cultural_fit,
            genres: s.wedding_genres
          }))
        },
        searchWithFilters: {
          description: 'Search with R&B genre and Ireland culture',
          genres: ['rnb'],
          culturalContexts: mapCountryToCulture('Ireland'),
          songCount: searchResults.length,
          songs: searchResults.slice(0, 3).map(s => ({
            title: s.title,
            artist: s.artist,
            cultural_fit: s.cultural_fit,
            genres: s.wedding_genres
          }))
        }
      }
    });
    
  } catch (error) {
    console.error('Filter test error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to test filters',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}