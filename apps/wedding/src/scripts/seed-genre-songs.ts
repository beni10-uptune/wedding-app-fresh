// Load environment variables for local execution
import * as dotenv from 'dotenv'
import * as path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { 
  collection, 
  doc, 
  setDoc,
  Timestamp,
  writeBatch 
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Song } from '@/types/wedding-v2'

// Import all genre song collections
import { HIP_HOP_WEDDING_SONGS, hipHopWeddingSongsCollection } from '../data/genre-songs/hip-hop-wedding-songs'
import { COUNTRY_WEDDING_SONGS, countryWeddingSongsCollection } from '../data/genre-songs/country-wedding-songs'
import { RNB_WEDDING_SONGS, rnbWeddingSongsCollection } from '../data/genre-songs/rnb-wedding-songs'
import { ROCK_WEDDING_SONGS, rockWeddingSongsCollection } from '../data/genre-songs/rock-wedding-songs'
import { INDIE_WEDDING_SONGS, indieWeddingSongsCollection } from '../data/genre-songs/indie-wedding-songs'

const SONGS_COLLECTION = 'songs'
const SONG_COLLECTIONS_COLLECTION = 'songCollections'

interface GenreSongData {
  name: string
  songs: Song[]
  collection: typeof hipHopWeddingSongsCollection
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

export async function seedGenreSongs() {
  try {
    console.log('Starting genre songs seeding...')
    
    let totalSongs = 0
    let totalCollections = 0
    
    // Process each genre
    for (const genreData of genreSongData) {
      console.log(`\nProcessing ${genreData.name} songs...`)
      
      // Use batched writes for better performance
      const batch = writeBatch(db)
      let batchSize = 0
      
      // Add songs to batch
      for (const song of genreData.songs) {
        const songDoc = doc(db, SONGS_COLLECTION, song.id)
        batch.set(songDoc, {
          ...song,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          source: 'genre-collection',
          genreCollection: genreData.collection.name
        })
        
        batchSize++
        totalSongs++
        
        // Firestore has a limit of 500 operations per batch
        if (batchSize >= 400) {
          await batch.commit()
          console.log(`  - Committed batch of ${batchSize} songs`)
          batchSize = 0
        }
      }
      
      // Commit remaining songs in batch
      if (batchSize > 0) {
        await batch.commit()
        console.log(`  - Committed final batch of ${batchSize} songs`)
      }
      
      // Create song collection document
      const collectionId = `${genreData.name.toLowerCase().replace(/[&\s]/g, '-')}-wedding-collection`
      await setDoc(doc(db, SONG_COLLECTIONS_COLLECTION, collectionId), {
        id: collectionId,
        name: genreData.collection.name,
        description: genreData.collection.description,
        genres: genreData.collection.genres,
        songIds: genreData.songs.map(s => s.id),
        totalSongs: genreData.collection.totalSongs,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        stats: {
          totalSongs: genreData.collection.totalSongs,
          avgRating: 0,
          timesUsed: 0
        },
        source: 'genre-seed',
        lastUpdated: genreData.collection.lastUpdated
      })
      
      totalCollections++
      console.log(`✓ Seeded ${genreData.songs.length} ${genreData.name} songs and collection`)
    }
    
    // Create a master genre collection
    const allGenreSongs = genreSongData.flatMap(g => g.songs)
    await setDoc(doc(db, SONG_COLLECTIONS_COLLECTION, 'all-genre-wedding-songs'), {
      id: 'all-genre-wedding-songs',
      name: 'All Genre Wedding Songs Collection',
      description: 'Complete collection of wedding songs across all genres',
      genres: ['hip hop', 'country', 'r&b', 'rock', 'indie'],
      songIds: allGenreSongs.map(s => s.id),
      totalSongs: allGenreSongs.length,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      stats: {
        totalSongs: allGenreSongs.length,
        avgRating: 0,
        timesUsed: 0
      },
      source: 'genre-seed',
      lastUpdated: new Date().toISOString().split('T')[0]
    })
    totalCollections++
    
    console.log('\n✅ Genre songs seeding completed successfully!')
    console.log(`   - Total songs seeded: ${totalSongs}`)
    console.log(`   - Total collections created: ${totalCollections}`)
    console.log(`   - Songs by genre:`)
    genreSongData.forEach(g => {
      console.log(`     • ${g.name}: ${g.songs.length} songs`)
    })
    
  } catch (error) {
    console.error('Error seeding genre songs:', error)
    throw error
  }
}

// Run this script with: npx tsx src/scripts/seed-genre-songs.ts
seedGenreSongs()
  .then(() => {
    console.log('\nScript completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\nScript failed:', error)
    process.exit(1)
  })