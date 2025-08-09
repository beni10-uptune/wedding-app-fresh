import { NextRequest, NextResponse } from 'next/server';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';

// Mapping of our song IDs to actual Spotify track IDs
// In production, these would be stored in the database
const SPOTIFY_TRACK_IDS: Record<string, string> = {
  // Getting Ready
  'gr1': '3QwBODjSEzelZyVjxPOHdq', // Sunday Morning - Maroon 5
  'gr2': '6dGnYIeXmHdcikdzNNDMm2', // Here Comes the Sun - The Beatles
  'gr3': '0bRXwKfigvpKZUurwqAlEh', // Lovely Day - Bill Withers
  
  // Ceremony  
  'c1': '1VNvsvEkHgcOyqLz7OosS5', // Canon in D - Pachelbel
  'c2': '3CeCwYWvdfXbZLXFhBrbnf', // A Thousand Years - Christina Perri
  
  // Cocktails
  'ct1': '5b7OgznPJJr1vHNYGyvxau', // Fly Me to the Moon - Frank Sinatra
  'ct2': '3uRvXsoN356P9FqpSztxPb', // Valerie - Amy Winehouse
  'ct3': '5Ohxk2dO5COHF1krpoPigN', // Golden - Harry Styles
  
  // Party
  'p1': '3cTuVr71qBqBjpN1NP1JD3', // September - Earth, Wind & Fire
  'p2': '32OlwWuMpZ6b0aN2RZOeMS', // Uptown Funk - Bruno Mars
  'p3': '3n3Ppam7vgaVa1iaRUc9Lp', // Mr. Brightside - The Killers
};

// Search for track on Spotify by title and artist
async function searchSpotifyTrack(title: string, artist: string, accessToken: string): Promise<string | null> {
  try {
    const query = `track:"${title}" artist:"${artist}"`;
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
    
    if (!response.ok) {
      console.error('Spotify search failed:', response.status);
      return null;
    }
    
    const data = await response.json();
    if (data.tracks?.items?.[0]) {
      return data.tracks.items[0].id;
    }
    
    return null;
  } catch (error) {
    console.error('Spotify search error:', error);
    return null;
  }
}

// Get track details including preview URL
async function getSpotifyTrack(trackId: string, accessToken: string): Promise<any> {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/tracks/${trackId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
    
    if (!response.ok) {
      console.error('Spotify track fetch failed:', response.status);
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Spotify track error:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { songId, title, artist } = await request.json();
    
    // Get Spotify access token
    const tokenResponse = await fetch(
      `${request.nextUrl.origin}/api/spotify/token`
    );
    const tokenData = await tokenResponse.json();
    
    if (tokenData.demo_mode || !tokenData.access_token) {
      // Return null in demo mode
      return NextResponse.json({
        success: true,
        previewUrl: null,
        demo: true
      });
    }
    
    let spotifyTrackId = SPOTIFY_TRACK_IDS[songId];
    
    // If we don't have a mapped ID, search for the track
    if (!spotifyTrackId && title && artist) {
      spotifyTrackId = await searchSpotifyTrack(title, artist, tokenData.access_token) || '';
    }
    
    if (!spotifyTrackId) {
      return NextResponse.json({
        success: true,
        previewUrl: null,
        message: 'Track not found on Spotify'
      });
    }
    
    // Get track details including preview URL
    const track = await getSpotifyTrack(spotifyTrackId, tokenData.access_token);
    
    if (!track) {
      return NextResponse.json({
        success: true,
        previewUrl: null,
        message: 'Could not fetch track details'
      });
    }
    
    return NextResponse.json({
      success: true,
      previewUrl: track.preview_url,
      spotifyId: track.id,
      duration: track.duration_ms,
      albumArt: track.album?.images?.[0]?.url
    });
  } catch (error) {
    console.error('Failed to get preview URL:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get preview URL' },
      { status: 500 }
    );
  }
}