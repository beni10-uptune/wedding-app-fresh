#!/usr/bin/env npx tsx

import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

// Import all genre song collections
import { HIP_HOP_WEDDING_SONGS, hipHopWeddingSongsCollection } from '../data/genre-songs/hip-hop-wedding-songs'
import { COUNTRY_WEDDING_SONGS, countryWeddingSongsCollection } from '../data/genre-songs/country-wedding-songs'
import { RNB_WEDDING_SONGS, rnbWeddingSongsCollection } from '../data/genre-songs/rnb-wedding-songs'
import { ROCK_WEDDING_SONGS, rockWeddingSongsCollection } from '../data/genre-songs/rock-wedding-songs'
import { INDIE_WEDDING_SONGS, indieWeddingSongsCollection } from '../data/genre-songs/indie-wedding-songs'

interface GenreSongData {
  name: string
  songs: any[]
  collection: any
}

const genreSongData: GenreSongData[] = [
  {
    name: 'Hip Hop',
    songs: HIP_HOP_WEDDING_SONGS,
    collection: hipHopWeddingSongsCollection
  },
  {
    name: 'Country',
    songs: COUNTRY_WEDDING_SONGS,
    collection: countryWeddingSongsCollection
  },
  {
    name: 'R&B',
    songs: RNB_WEDDING_SONGS,
    collection: rnbWeddingSongsCollection
  },
  {
    name: 'Rock',
    songs: ROCK_WEDDING_SONGS,
    collection: rockWeddingSongsCollection
  },
  {
    name: 'Indie',
    songs: INDIE_WEDDING_SONGS,
    collection: indieWeddingSongsCollection
  }
]

export async function exportGenreSongsJson() {
  console.log('📚 Exporting genre songs to JSON...\n')
  
  const outputDir = join(process.cwd(), 'src', 'data', 'exports')
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
  }
  
  // Export all songs
  const allSongs: any[] = []
  const collections: any[] = []
  
  for (const genreData of genreSongData) {
    console.log(`📁 Processing ${genreData.name} songs...`)
    
    // Add metadata to each song
    const songsWithMetadata = genreData.songs.map(song => ({
      ...song,
      source: 'genre-collection',
      genreCollection: genreData.collection.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }))
    
    allSongs.push(...songsWithMetadata)
    
    // Create collection metadata
    const collectionId = `${genreData.name.toLowerCase().replace(/[&\s]/g, '-')}-wedding-collection`
    collections.push({
      id: collectionId,
      name: genreData.collection.name,
      description: genreData.collection.description,
      genres: genreData.collection.genres,
      songIds: genreData.songs.map(s => s.id),
      totalSongs: genreData.collection.totalSongs,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stats: {
        totalSongs: genreData.collection.totalSongs,
        avgRating: 0,
        timesUsed: 0
      },
      source: 'genre-seed',
      lastUpdated: genreData.collection.lastUpdated
    })
    
    console.log(`   ✅ Processed ${genreData.songs.length} songs`)
  }
  
  // Create master collection
  collections.push({
    id: 'all-genre-wedding-songs',
    name: 'All Genre Wedding Songs Collection',
    description: 'Complete collection of wedding songs across all genres',
    genres: ['hip hop', 'country', 'r&b', 'rock', 'indie'],
    songIds: allSongs.map(s => s.id),
    totalSongs: allSongs.length,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    stats: {
      totalSongs: allSongs.length,
      avgRating: 0,
      timesUsed: 0
    },
    source: 'genre-seed',
    lastUpdated: new Date().toISOString().split('T')[0]
  })
  
  // Write JSON files
  const songsPath = join(outputDir, 'genre-wedding-songs.json')
  const collectionsPath = join(outputDir, 'genre-wedding-collections.json')
  
  writeFileSync(songsPath, JSON.stringify(allSongs, null, 2))
  writeFileSync(collectionsPath, JSON.stringify(collections, null, 2))
  
  console.log('\n✅ Export completed successfully!')
  console.log(`📁 Files saved to: ${outputDir}`)
  console.log(`   - genre-wedding-songs.json (${allSongs.length} songs)`)
  console.log(`   - genre-wedding-collections.json (${collections.length} collections)`)
  console.log('\n📊 Summary by genre:')
  genreSongData.forEach(g => {
    console.log(`   • ${g.name}: ${g.songs.length} songs`)
  })
  
  console.log('\nNext steps:')
  console.log('1. When Firebase is configured, import these JSON files')
  console.log('2. Use Firebase Admin SDK or import script to load data')
}

// Run the script
exportGenreSongsJson()
  .then(() => {
    console.log('\n✅ Script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error)
    process.exit(1)
  })