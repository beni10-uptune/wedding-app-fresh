#!/usr/bin/env npx tsx

import * as dotenv from 'dotenv'
import * as path from 'path'
import { 
  collection, 
  getDocs,
  query,
  where,
  limit
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

async function testBlogAccess() {
  console.log('🔍 Testing blog post access in Firestore...\n')
  
  try {
    // Test 1: Get all blog posts
    console.log('📚 Fetching all blog posts...')
    const postsRef = collection(db, 'blogPosts')
    const allPostsSnapshot = await getDocs(postsRef)
    console.log(`   Found ${allPostsSnapshot.size} total blog posts\n`)
    
    // Test 2: Get specific genre blog posts
    console.log('🎵 Looking for genre blog posts...')
    const genreSlugs = [
      'best-hip-hop-wedding-songs-2025',
      'best-country-wedding-songs-2025',
      'best-rnb-wedding-songs-2025',
      'best-rock-wedding-songs-2025',
      'best-indie-wedding-songs-2025'
    ]
    
    for (const slug of genreSlugs) {
      const q = query(postsRef, where('slug', '==', slug), limit(1))
      const snapshot = await getDocs(q)
      
      if (!snapshot.empty) {
        const post = snapshot.docs[0].data()
        console.log(`   ✅ Found: ${post.title}`)
        console.log(`      - Status: ${post.status}`)
        console.log(`      - Category: ${post.category}`)
        console.log(`      - Author ID: ${post.authorId}`)
      } else {
        console.log(`   ❌ Not found: ${slug}`)
      }
    }
    
    // Test 3: Check blog authors
    console.log('\n👥 Checking blog authors...')
    const authorsRef = collection(db, 'blogAuthors')
    const authorsSnapshot = await getDocs(authorsRef)
    console.log(`   Found ${authorsSnapshot.size} authors`)
    
    authorsSnapshot.docs.forEach(doc => {
      const author = doc.data()
      console.log(`   - ${author.name} (ID: ${doc.id})`)
    })
    
  } catch (error) {
    console.error('❌ Error accessing Firestore:', error)
  }
}

// Run the test
testBlogAccess()
  .then(() => {
    console.log('\n✅ Test completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Test failed:', error)
    process.exit(1)
  })