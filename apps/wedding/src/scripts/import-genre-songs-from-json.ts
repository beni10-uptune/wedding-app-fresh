#!/usr/bin/env npx tsx

import { readFileSync } from 'fs'
import { join } from 'path'

// This script prepares the data for import when Firebase is available
async function prepareGenreSongsImport() {
  console.log('📚 Preparing genre songs for database import...\n')
  
  const exportsDir = join(process.cwd(), 'src', 'data', 'exports')
  
  // Read the JSON files
  const songsData = JSON.parse(readFileSync(join(exportsDir, 'genre-wedding-songs.json'), 'utf8'))
  const collectionsData = JSON.parse(readFileSync(join(exportsDir, 'genre-wedding-collections.json'), 'utf8'))
  
  console.log(`📊 Data Summary:`)
  console.log(`   - Songs: ${songsData.length}`)
  console.log(`   - Collections: ${collectionsData.length}`)
  
  // Group songs by collection
  const songsByCollection = collectionsData.reduce((acc: Record<string, any[]>, collection: any) => {
    acc[collection.name] = songsData.filter((song: any) => song.genreCollection === collection.name)
    return acc
  }, {})
  
  console.log('\n📁 Songs by Collection:')
  Object.entries(songsByCollection).forEach(([name, songs]) => {
    console.log(`   - ${name}: ${(songs as any[]).length} songs`)
  })
  
  console.log('\n✅ Data is ready for import!')
  console.log('\n📝 Import Instructions:')
  console.log('1. Ensure Firebase is properly configured with environment variables')
  console.log('2. Run the seed-genre-songs.ts script to import to Firebase')
  console.log('3. Alternatively, use Firebase Admin SDK to import the JSON files directly')
  
  console.log('\n💡 For manual import via Firebase Console:')
  console.log('1. Go to Firebase Console > Firestore Database')
  console.log('2. Import genre-wedding-songs.json to the "songs" collection')
  console.log('3. Import genre-wedding-collections.json to the "songCollections" collection')
  
  return { songs: songsData, collections: collectionsData }
}

// Run the script
prepareGenreSongsImport()
  .then(() => {
    console.log('\n✅ Script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error)
    process.exit(1)
  })