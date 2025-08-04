#!/usr/bin/env npx tsx

import * as dotenv from 'dotenv'
import * as path from 'path'
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'

// Load environment variables first
dotenv.config({ path: path.join(process.cwd(), '.env.local') })

async function seedGenreBlogs() {
  console.log('🎵 Seeding genre blog posts to Firestore...\n')
  
  try {
    // Initialize Firebase Admin with loaded env vars
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'weddings-uptune-d12fa'
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || 'firebase-adminsdk-b4qko@weddings-uptune-d12fa.iam.gserviceaccount.com'
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    
    if (!privateKey) {
      throw new Error('FIREBASE_PRIVATE_KEY not found in environment variables')
    }
    
    console.log('Initializing Firebase Admin...')
    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey
      })
    })
    
    const db = getFirestore()
    console.log('✅ Firebase Admin initialized successfully!\n')
    
    // Create author
    const authorId = 'uptune-music-team'
    await db.collection('blog_authors').doc(authorId).set({
      name: 'UpTune Music Team',
      bio: 'Wedding music experts helping couples create unforgettable celebrations',
      avatar: '/images/authors/uptune-team.jpg',
      email: 'team@uptune.xyz',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    })
    console.log('✅ Author created: UpTune Music Team\n')
    
    // Blog posts data
    const blogPosts = [
      {
        slug: 'best-hip-hop-wedding-songs-2025',
        title: 'Best Hip Hop Wedding Songs 2025: From Old School to New Hits',
        excerpt: 'Discover the ultimate hip hop wedding playlist featuring 50+ songs perfect for every moment of your celebration.',
        category: 'Music by Genre',
        tags: ['hip hop', 'wedding songs', 'reception music', 'party songs', 'first dance'],
        featuredImage: '/images/blog/optimized/hip-hop-wedding-songs-hero.jpeg',
        readTime: 8
      },
      {
        slug: 'best-country-wedding-songs-2025',
        title: 'Best Country Wedding Songs 2025: Romantic & Fun Playlist Ideas',
        excerpt: 'From heartfelt first dances to boot-scootin\' reception hits, discover the perfect country songs for your wedding.',
        category: 'Music by Genre',
        tags: ['country music', 'wedding songs', 'first dance', 'reception music', 'rustic wedding'],
        featuredImage: '/images/blog/optimized/country-wedding-songs-hero.jpeg',
        readTime: 7
      },
      {
        slug: 'best-rnb-wedding-songs-2025',
        title: 'Best R&B Wedding Songs 2025: Smooth Grooves for Your Big Day',
        excerpt: 'Create the perfect romantic atmosphere with our curated collection of R&B wedding songs for every moment.',
        category: 'Music by Genre',
        tags: ['r&b', 'wedding songs', 'soul music', 'first dance', 'romantic songs'],
        featuredImage: '/images/blog/optimized/rnb-wedding-songs-hero.jpeg',
        readTime: 7
      },
      {
        slug: 'best-rock-wedding-songs-2025',
        title: 'Best Rock Wedding Songs 2025: From Classic to Modern Hits',
        excerpt: 'Rock your wedding with the perfect mix of classic anthems and modern hits that\'ll get everyone on the dance floor.',
        category: 'Music by Genre',
        tags: ['rock music', 'wedding songs', 'reception music', 'party songs', 'classic rock'],
        featuredImage: '/images/blog/optimized/rock-wedding-songs-hero.jpeg',
        readTime: 8
      },
      {
        slug: 'best-indie-wedding-songs-2025',
        title: 'Best Indie Wedding Songs 2025: Unique & Alternative Tracks',
        excerpt: 'Make your wedding uniquely yours with our carefully curated indie wedding playlist featuring emerging artists.',
        category: 'Music by Genre',
        tags: ['indie music', 'alternative', 'wedding songs', 'unique wedding', 'modern wedding'],
        featuredImage: '/images/blog/optimized/indie-wedding-songs-hero.jpeg',
        readTime: 7
      }
    ]
    
    let successCount = 0
    
    for (const post of blogPosts) {
      try {
        console.log(`📝 Seeding: ${post.title}`)
        
        await db.collection('blog_posts').doc(post.slug).set({
          ...post,
          authorId,
          content: `Blog content for ${post.title}. This will be loaded from markdown files.`,
          status: 'published',
          publishedAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          createdAt: Timestamp.now(),
          views: 0,
          likes: 0,
          shares: 0,
          seo: {
            title: post.title,
            description: post.excerpt,
            keywords: post.tags
          }
        })
        
        console.log(`   ✅ Success: ${post.slug}\n`)
        successCount++
        
      } catch (error) {
        console.error(`   ❌ Error seeding ${post.slug}:`, error)
      }
    }
    
    console.log(`\n✅ Seeding completed! ${successCount}/${blogPosts.length} posts seeded successfully.`)
    
    // Verify posts exist
    console.log('\n📊 Verifying blog posts in Firestore...')
    const genrePosts = await db.collection('blog_posts')
      .where('category', '==', 'Music by Genre')
      .get()
    
    console.log(`Found ${genrePosts.size} genre blog posts:`)
    genrePosts.forEach(doc => {
      const data = doc.data()
      console.log(`  - ${data.title}`)
      console.log(`    URL: weddings.uptune.xyz/blog/${doc.id}`)
    })
    
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

seedGenreBlogs()
  .then(() => {
    console.log('\n✅ Script completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Script error:', error)
    process.exit(1)
  })