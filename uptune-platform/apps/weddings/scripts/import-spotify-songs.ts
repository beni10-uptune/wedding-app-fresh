/**
 * Script to bulk import songs from Spotify playlists
 * This will help populate our database with real wedding songs
 */

import SpotifyWebApi from 'spotify-web-api-node'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

// Get __dirname equivalent for ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
dotenv.config({ path: '.env.local' })

console.log('Loading Spotify credentials...')
console.log('Client ID:', process.env.SPOTIFY_CLIENT_ID ? 'Found' : 'Missing')
console.log('Client Secret:', process.env.SPOTIFY_CLIENT_SECRET ? 'Found' : 'Missing')

// Initialize Spotify API
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
})

// Real wedding playlists from Spotify
const WEDDING_PLAYLISTS = {
  // UK/US/International Mix
  universal: [
    '43eWkIiNDbimyD35iong1G', // Wedding Songs 2025 - 148 tracks
    '0ml6XrpZyQoGwgF40Z4LUw', // First Dance Songs 2025 - 82 tracks
    '1M7L8WsZKnBqMNGxxSVGi5', // Best Wedding Party Songs 2025 - 638 tracks
    '2HlEly9jdCI1yMsMu3zNXS', // WEDDING DANCEFLOOR BANGERS - 208 tracks
  ],
  
  // Reception/Background  
  reception: [
    '7BDkhsTCQmk3Qp02m1AQtH', // Wedding Reception 2025 Background Music - 272 tracks
    '6DmO191OManKLoD1mf3hjQ', // Wedding: Drinks Reception - 37 tracks
    '2tYBsYfEo7Lxi3CiVjI2L1', // Best Wedding Party Songs - 186 tracks
  ],
  
  // First Dance/Romantic
  romantic: [
    '4nlN23W5IB8MnVLMP7s62y', // Acoustic Wedding Songs 2025 - 160 tracks
    '6qEqPYCN7QfZYLepRG5r2z', // Classy Wedding First Dance Songs - 25 tracks
  ],
  
  // Party/Dancing
  party: [
    '1QKGdxkplvWFWpsfW3t5Jr', // Wedding Dance Songs 2000-2024 - 85 tracks
    '3RNdTFg7SgzSCxK1FcLkZB', // UK after party wedding - 306 tracks
  ]
}

interface SpotifyTrack {
  id: string
  name: string
  artists: string[]
  album: string
  albumImage?: string
  releaseDate?: string
  duration_ms: number
  explicit: boolean
  popularity?: number
  preview_url: string | null
  external_urls: {
    spotify: string
  }
  audio_features?: {
    danceability: number
    energy: number
    valence: number
    tempo: number
    acousticness: number
  }
}

async function authenticate() {
  const data = await spotifyApi.clientCredentialsGrant()
  spotifyApi.setAccessToken(data.body['access_token'])
  console.log('✅ Authenticated with Spotify')
}

async function getPlaylistTracks(playlistId: string): Promise<SpotifyTrack[]> {
  const tracks: SpotifyTrack[] = []
  let offset = 0
  const limit = 100

  while (true) {
    const response = await spotifyApi.getPlaylistTracks(playlistId, {
      offset,
      limit,
      fields: 'items(track(id,name,artists,album(name,images,release_date),duration_ms,explicit,popularity,preview_url,external_urls,type)),next,total'
    })
    
    // console.log(`    Fetched ${response.body.items.length} items at offset ${offset}`)

    const items = response.body.items
    if (!items || items.length === 0) {
      // console.log('    No more items to fetch')
      break
    }

    for (const item of items) {
      // Skip null tracks (deleted songs)
      if (!item || !item.track) {
        // console.log('    Skipping null/deleted track')
        continue
      }
      
      const track = item.track as any
      // Debug log first track
      // if (tracks.length === 0 && offset === 0) {
      //   console.log('    First track debug:', JSON.stringify(track, null, 2).substring(0, 500))
      // }
      
      if (track.id) {
        tracks.push({
          id: track.id,
          name: track.name,
          artists: track.artists.map((a: any) => a.name),
          album: track.album.name,
          albumImage: track.album.images?.[0]?.url || undefined,
          releaseDate: track.album.release_date || undefined,
          duration_ms: track.duration_ms,
          explicit: track.explicit || false,
          popularity: track.popularity || 0,
          preview_url: track.preview_url,
          external_urls: track.external_urls
        })
      }
    }

    offset += limit
    
    // Check if there are more tracks to fetch
    if (!response.body.next) break
  }

  return tracks
}

async function getAudioFeatures(trackIds: string[]) {
  // Spotify API limits to 100 tracks per request
  const chunks = []
  for (let i = 0; i < trackIds.length; i += 100) {
    chunks.push(trackIds.slice(i, i + 100))
  }

  const allFeatures = []
  for (const chunk of chunks) {
    try {
      const response = await spotifyApi.getAudioFeaturesForTracks(chunk)
      allFeatures.push(...response.body.audio_features)
    } catch (error) {
      console.error('Error fetching audio features:', error)
      // Push null for failed tracks
      allFeatures.push(...chunk.map(() => null))
    }
  }

  return allFeatures
}

async function categorizeSong(track: SpotifyTrack, audioFeatures: any) {
  // Determine which wedding moments this song fits
  const moments = []
  
  if (audioFeatures) {
    // Slow, romantic songs for first dance
    if (audioFeatures.energy < 0.5 && audioFeatures.valence > 0.3 && audioFeatures.tempo < 100) {
      moments.push('first-dance')
    }
    
    // High energy for dance floor
    if (audioFeatures.energy > 0.7 && audioFeatures.danceability > 0.7) {
      moments.push('dancing')
    }
    
    // Calm for dinner
    if (audioFeatures.energy < 0.4 && audioFeatures.acousticness > 0.5) {
      moments.push('dinner')
    }
    
    // Processional songs
    if (audioFeatures.tempo >= 60 && audioFeatures.tempo <= 80 && audioFeatures.energy < 0.6) {
      moments.push('processional')
    }
  } else {
    // Use heuristics based on name/artist when no audio features
    const titleLower = track.name.toLowerCase()
    const artistLower = track.artists.join(' ').toLowerCase()
    
    // Common first dance keywords
    if (titleLower.includes('love') || titleLower.includes('marry') || 
        titleLower.includes('perfect') || titleLower.includes('forever') ||
        titleLower.includes('beautiful') || titleLower.includes('yours')) {
      moments.push('first-dance')
    }
    
    // Party/dance keywords
    if (titleLower.includes('dance') || titleLower.includes('party') ||
        titleLower.includes('celebration') || titleLower.includes('tonight')) {
      moments.push('dancing')
    }
    
    // Classical/processional artists
    if (artistLower.includes('pachelbel') || artistLower.includes('bach') ||
        artistLower.includes('mozart') || artistLower.includes('mendelssohn')) {
      moments.push('processional')
    }
  }
  
  // Default to general if no specific category
  if (moments.length === 0) {
    moments.push('general')
  }
  
  return moments
}

async function main() {
  await authenticate()
  
  const allSongs = new Map<string, any>()
  const songsByRegion: Record<string, Set<string>> = {
    uk: new Set(),
    us: new Set(),
    europe: new Set(),
    universal: new Set()
  }
  
  // Process playlists by region
  for (const [region, playlists] of Object.entries(WEDDING_PLAYLISTS)) {
    console.log(`\n🌍 Processing ${region.toUpperCase()} playlists...`)
    
    for (const playlistId of playlists) {
      console.log(`📋 Fetching playlist ${playlistId}...`)
    
    try {
      // First get playlist info
      const playlistInfo = await spotifyApi.getPlaylist(playlistId, { fields: 'name,owner,tracks.total' })
      console.log(`📋 Fetching "${playlistInfo.body.name}" by ${playlistInfo.body.owner.display_name} (${playlistInfo.body.tracks.total} tracks)...`)
      
      const tracks = await getPlaylistTracks(playlistId)
      console.log(`✅ Successfully fetched ${tracks.length} tracks`)
      
      // Get audio features for all tracks (optional - may fail with 403)
      const trackIds = tracks.map(t => t.id)
      let audioFeatures: any[] = []
      try {
        audioFeatures = await getAudioFeatures(trackIds)
      } catch (error) {
        console.log('    ⚠️  Could not fetch audio features (403 error) - using defaults')
        audioFeatures = trackIds.map(() => null)
      }
      
      // Process each track
      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i]
        const features = audioFeatures[i]
        
        if (!allSongs.has(track.id)) {
          const moments = await categorizeSong(track, features)
          
          allSongs.set(track.id, {
            id: track.id,
            title: track.name,
            artist: track.artists.join(', '),
            album: track.album,
            albumImage: track.albumImage,
            releaseDate: track.releaseDate,
            duration: Math.floor(track.duration_ms / 1000),
            explicit: track.explicit,
            popularity: track.popularity || 0,
            previewUrl: track.preview_url,
            spotifyUri: `spotify:track:${track.id}`,
            moments,
            energyLevel: features ? Math.ceil(features.energy * 5) : 3,
            genres: [], // Would need additional API call
            generationAppeal: [], // Would need to estimate based on release date
            audioFeatures: features && features.energy !== undefined ? {
              danceability: features.danceability,
              energy: features.energy,
              valence: features.valence,
              acousticness: features.acousticness
            } : undefined,
            popularIn: [region] // Track which region this is popular in
          })
          
          // Track this song for the region
          songsByRegion[region].add(track.id)
        } else {
          // Song exists, just add this region
          const existingSong = allSongs.get(track.id)
          if (!existingSong.popularIn.includes(region)) {
            existingSong.popularIn.push(region)
          }
          songsByRegion[region].add(track.id)
        }
      }
      
      // Add delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error(`Error processing playlist ${playlistId}:`, error)
    }
    }
  }
  
  // Group songs by moment
  const songsByMoment: Record<string, any[]> = {
    'first-dance': [],
    'processional': [],
    'recessional': [],
    'dinner': [],
    'dancing': [],
    'last-dance': [],
    'general': []
  }
  
  for (const song of allSongs.values()) {
    for (const moment of song.moments) {
      if (songsByMoment[moment]) {
        songsByMoment[moment].push(song)
      }
    }
  }
  
  // Write to file
  const output = `// Auto-generated from Spotify playlists
// Generated on ${new Date().toISOString()}

import { Song } from '@/types/wedding-v2'

export const SPOTIFY_WEDDING_SONGS: Record<string, Song[]> = ${JSON.stringify(songsByMoment, null, 2)}

export const ALL_WEDDING_SONGS: Song[] = ${JSON.stringify(Array.from(allSongs.values()), null, 2)}
`
  
  const outputPath = path.join(__dirname, '../src/data/spotify-wedding-songs.ts')
  fs.writeFileSync(outputPath, output)
  
  console.log(`\n✅ Successfully imported ${allSongs.size} unique songs!`)
  console.log(`📁 Saved to: ${outputPath}`)
  
  // Print statistics
  console.log('\n📊 Statistics by Moment:')
  for (const [moment, songs] of Object.entries(songsByMoment)) {
    console.log(`${moment}: ${songs.length} songs`)
  }
  
  console.log('\n🌍 Statistics by Region:')
  for (const [region, songIds] of Object.entries(songsByRegion)) {
    console.log(`${region}: ${songIds.size} songs`)
  }
  
  // Find songs popular in multiple regions
  const crossRegionalHits = Array.from(allSongs.values())
    .filter(song => song.popularIn.length > 2)
    .slice(0, 10)
  
  console.log('\n🎵 Top Cross-Regional Hits:')
  crossRegionalHits.forEach(song => {
    console.log(`"${song.title}" by ${song.artist} - Popular in: ${song.popularIn.join(', ')}`)
  })
}

// Run the script
main().catch(console.error)