#!/usr/bin/env npx tsx

import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import * as path from 'path'

const serviceAccountPath = path.join(process.cwd(), 'wedding-app-426623-firebase-adminsdk-mfxfl-b949dd03e0.json')

// Initialize Firebase Admin
initializeApp({
  credential: cert(serviceAccountPath),
  projectId: 'wedding-app-426623'
})

const db = getFirestore()

async function checkBlogPosts() {
  console.log('🔍 Checking blog posts in Firestore...\n')
  
  try {
    // Check all blog posts
    const blogPostsRef = db.collection('blog_posts')
    const snapshot = await blogPostsRef.get()
    
    console.log(`📊 Total blog posts: ${snapshot.size}\n`)
    
    // Check specifically for genre blog posts
    const genrePosts = await blogPostsRef.where('category', '==', 'Music by Genre').get()
    console.log(`🎵 Genre blog posts: ${genrePosts.size}\n`)
    
    if (genrePosts.size > 0) {
      console.log('📝 Genre blog posts found:')
      genrePosts.forEach(doc => {
        const data = doc.data()
        console.log(`   - ${data.title}`)
        console.log(`     Slug: ${data.slug}`)
        console.log(`     Status: ${data.status}`)
        console.log(`     Category: ${data.category}\n`)
      })
    } else {
      console.log('❌ No genre blog posts found in Firestore!')
      console.log('\n💡 You may need to run: npm run seed:genre-blogs')
    }
    
    // List all categories
    const categories = new Set<string>()
    snapshot.forEach(doc => {
      const data = doc.data()
      if (data.category) {
        categories.add(data.category)
      }
    })
    
    console.log('\n📂 All categories in database:')
    categories.forEach(cat => console.log(`   - ${cat}`))
    
  } catch (error) {
    console.error('❌ Error checking blog posts:', error)
  }
}

checkBlogPosts()
  .then(() => {
    console.log('\n✅ Check completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Check failed:', error)
    process.exit(1)
  })