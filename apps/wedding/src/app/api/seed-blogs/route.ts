import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase-admin'
import { Timestamp } from 'firebase-admin/firestore'

// Simple auth check
const SEED_SECRET = process.env.NEXT_PUBLIC_SEED_SECRET

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 404 })
  }
  try {
    // Check authorization
    const { secret } = await request.json()
    if (!SEED_SECRET) {
      return NextResponse.json({ error: 'NEXT_PUBLIC_SEED_SECRET environment variable not set' }, { status: 500 })
    }
    if (secret !== SEED_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if admin SDK is available
    if (!adminDb) {
      // Fallback to client SDK if admin is not available
      const { db } = await import('@/lib/firebase')
      const { doc, setDoc, Timestamp: ClientTimestamp } = await import('firebase/firestore')
      
      console.log('Using client SDK for seeding...')
      
      // Create author
      const authorId = 'uptune-music-team'
      await setDoc(doc(db, 'blog_authors', authorId), {
        name: 'UpTune Music Team',
        bio: 'Wedding music experts helping couples create unforgettable celebrations',
        avatar: '/images/authors/uptune-team.jpg',
        email: 'team@uptune.xyz',
        createdAt: ClientTimestamp.now(),
        updatedAt: ClientTimestamp.now()
      })
      
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
      
      const results = []
      
      for (const post of blogPosts) {
        try {
          await setDoc(doc(db, 'blog_posts', post.slug), {
            ...post,
            authorId,
            content: 'Blog content will be loaded from markdown files.',
            status: 'published',
            publishedAt: ClientTimestamp.now(),
            updatedAt: ClientTimestamp.now(),
            createdAt: ClientTimestamp.now(),
            views: 0,
            likes: 0,
            shares: 0,
            seo: {
              title: post.title,
              description: post.excerpt,
              keywords: post.tags
            }
          })
          
          results.push({ slug: post.slug, success: true })
        } catch (error) {
          results.push({ slug: post.slug, success: false, error: String(error) })
        }
      }
      
      return NextResponse.json({
        message: 'Blog posts seeded using client SDK',
        results,
        total: results.length,
        successful: results.filter(r => r.success).length
      })
    }

    // Use admin SDK if available
    console.log('Using admin SDK for seeding...')
    
    // Create author
    const authorId = 'uptune-music-team'
    await adminDb.collection('blog_authors').doc(authorId).set({
      name: 'UpTune Music Team',
      bio: 'Wedding music experts helping couples create unforgettable celebrations',
      avatar: '/images/authors/uptune-team.jpg',
      email: 'team@uptune.xyz',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    })
    
    // Blog posts data (same as above)
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
    
    const results = []
    
    for (const post of blogPosts) {
      try {
        await adminDb.collection('blog_posts').doc(post.slug).set({
          ...post,
          authorId,
          content: 'Blog content will be loaded from markdown files.',
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
        
        results.push({ slug: post.slug, success: true })
      } catch (error) {
        results.push({ slug: post.slug, success: false, error: String(error) })
      }
    }
    
    return NextResponse.json({
      message: 'Blog posts seeded using admin SDK',
      results,
      total: results.length,
      successful: results.filter(r => r.success).length
    })
    
  } catch (error) {
    console.error('Seeding error:', error)
    return NextResponse.json(
      { error: 'Failed to seed blog posts', details: String(error) },
      { status: 500 }
    )
  }
}