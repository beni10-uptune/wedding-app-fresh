import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import SpotifyWebApi from 'spotify-web-api-node'

// Initialize Supabase admin client for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Initialize Spotify client
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
})

// Cache for Spotify access token
let tokenExpiresAt = 0

async function getSpotifyToken() {
  if (Date.now() < tokenExpiresAt) {
    return
  }

  try {
    const data = await spotifyApi.clientCredentialsGrant()
    spotifyApi.setAccessToken(data.body['access_token'])
    tokenExpiresAt = Date.now() + (data.body['expires_in'] - 60) * 1000
  } catch (error) {
    console.error('Error getting Spotify token:', error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const { query, limit = 20 } = await request.json()

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ songs: [] })
    }

    // First, search our Supabase database
    const { data: cachedSongs, error: dbError } = await supabase
      .from('songs')
      .select('*')
      .or(`title.ilike.%${query}%,artist.ilike.%${query}%`)
      .limit(10)

    if (!dbError && cachedSongs && cachedSongs.length > 0) {
      console.log(`Found ${cachedSongs.length} cached songs for query: ${query}`)
    }

    // Then search Spotify for fresh results
    await getSpotifyToken()
    const searchResults = await spotifyApi.searchTracks(query, { limit })

    // Format Spotify results
    const spotifySongs = searchResults.body.tracks?.items.map(track => ({
      id: track.id,
      title: track.name,
      artist: track.artists.map(a => a.name).join(', '),
      album: track.album.name,
      album_art: track.album.images[0]?.url || '',
      preview_url: track.preview_url,
      spotify_uri: track.uri,
      duration: Math.round(track.duration_ms / 1000),
      explicit: track.explicit,
      popularity: track.popularity,
      energy: 3, // Default, will be enriched later
      genres: [], // Will be enriched later
      moments: [], // Will be enriched later
      spotify_data: {
        release_date: track.album.release_date,
        album_images: track.album.images,
        artist_ids: track.artists.map(a => a.id),
        external_urls: track.external_urls
      }
    })) || []

    // Save new songs to Supabase in the background
    if (spotifySongs.length > 0) {
      // Don't await - let it run in background
      Promise.all(
        spotifySongs.map(async (song) => {
          try {
            await supabase
              .from('songs')
              .upsert({
                id: song.id,
                title: song.title,
                artist: song.artist,
                album: song.album,
                album_art: song.album_art,
                preview_url: song.preview_url,
                spotify_uri: song.spotify_uri,
                duration: song.duration,
                explicit: song.explicit,
                popularity: song.popularity,
                energy: song.energy,
                genres: song.genres,
                moments: song.moments,
                spotify_data: song.spotify_data
              }, {
                onConflict: 'id',
                ignoreDuplicates: true
              })
          } catch (err) {
            console.error(`Failed to cache song ${song.id}:`, err)
          }
        })
      ).catch(err => console.error('Background song caching failed:', err))
    }

    // Combine results, preferring Spotify's fresh data
    const songMap = new Map()
    
    // Add Spotify songs first (they're fresher)
    spotifySongs.forEach(song => songMap.set(song.id, song))
    
    // Add cached songs that weren't in Spotify results
    cachedSongs?.forEach(song => {
      if (!songMap.has(song.id)) {
        songMap.set(song.id, {
          id: song.id,
          title: song.title,
          artist: song.artist,
          album: song.album,
          album_art: song.album_art,
          preview_url: song.preview_url,
          spotify_uri: song.spotify_uri,
          duration: song.duration,
          explicit: song.explicit,
          popularity: song.popularity,
          energy: song.energy || 3,
          genres: song.genres || [],
          moments: song.moments || [],
          spotify_data: song.spotify_data
        })
      }
    })

    const combinedSongs = Array.from(songMap.values())

    return NextResponse.json({ 
      songs: combinedSongs,
      source: 'spotify_and_cache',
      cached_count: cachedSongs?.length || 0,
      spotify_count: spotifySongs.length
    })

  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Failed to search songs' },
      { status: 500 }
    )
  }
}