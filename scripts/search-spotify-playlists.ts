/**
 * Quick script to search for wedding playlists on Spotify
 */

import SpotifyWebApi from 'spotify-web-api-node'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
})

async function searchWeddingPlaylists() {
  // Authenticate
  const data = await spotifyApi.clientCredentialsGrant()
  spotifyApi.setAccessToken(data.body['access_token'])
  
  const searches = [
    'wedding songs 2024',
    'UK wedding songs',
    'wedding first dance',
    'wedding reception',
    'wedding party songs'
  ]
  
  console.log('🔍 Searching for wedding playlists...\n')
  
  for (const query of searches) {
    try {
      const results = await spotifyApi.searchPlaylists(query, { limit: 5 })
      console.log(`\n📋 Results for "${query}":`)
      
      results.body.playlists?.items.forEach(playlist => {
        console.log(`- ${playlist.name}`)
        console.log(`  ID: ${playlist.id}`)
        console.log(`  Owner: ${playlist.owner.display_name}`)
        console.log(`  Tracks: ${playlist.tracks.total}`)
      })
    } catch (error) {
      console.error(`Error searching for ${query}:`, error)
    }
    
    // Rate limit
    await new Promise(resolve => setTimeout(resolve, 500))
  }
}

searchWeddingPlaylists().catch(console.error)