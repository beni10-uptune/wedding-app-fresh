#!/usr/bin/env npx tsx

import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') })

import { adminAuth, adminDb } from '../lib/firebase-admin'

async function testFirebaseAdmin() {
  console.log('🔥 Testing Firebase Admin SDK connection...\n')
  
  try {
    // Test if admin SDK is initialized
    if (!adminDb) {
      console.error('❌ Firebase Admin SDK not initialized!')
      console.log('Make sure you have these environment variables set:')
      console.log('  - NEXT_PUBLIC_FIREBASE_PROJECT_ID')
      console.log('  - FIREBASE_CLIENT_EMAIL')
      console.log('  - FIREBASE_PRIVATE_KEY')
      return
    }
    
    console.log('✅ Firebase Admin SDK initialized successfully!')
    
    // Test Firestore connection
    console.log('\n📊 Testing Firestore connection...')
    const testDoc = await adminDb.collection('_test').doc('connection-test').set({
      timestamp: new Date(),
      message: 'Firebase Admin SDK is working!'
    })
    
    console.log('✅ Successfully wrote to Firestore!')
    
    // Clean up test document
    await adminDb.collection('_test').doc('connection-test').delete()
    console.log('✅ Cleaned up test document')
    
    // Check if blog posts exist
    console.log('\n📚 Checking existing blog posts...')
    const blogPosts = await adminDb.collection('blog_posts').get()
    console.log(`Found ${blogPosts.size} blog posts in Firestore`)
    
    if (blogPosts.size > 0) {
      console.log('\nExisting blog posts:')
      blogPosts.forEach(doc => {
        const data = doc.data()
        console.log(`  - ${data.title} (${doc.id})`)
      })
    }
    
    console.log('\n✅ All Firebase tests passed!')
    
  } catch (error) {
    console.error('❌ Firebase Admin SDK test failed:', error)
  }
}

testFirebaseAdmin()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Script failed:', error)
    process.exit(1)
  })