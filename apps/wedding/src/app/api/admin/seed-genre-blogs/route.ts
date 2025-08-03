import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase-admin'
import { readFileSync } from 'fs'
import * as path from 'path'
import matter from 'gray-matter'

// Protect this endpoint
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    // Check authorization
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${ADMIN_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Starting genre blog posts seeding...')
    
    const genreBlogFiles = [
      'best-hip-hop-wedding-songs-2025.md',
      'best-country-wedding-songs-2025.md',
      'best-rnb-wedding-songs-2025.md',
      'best-rock-wedding-songs-2025.md',
      'best-indie-wedding-songs-2025.md'
    ]
    
    // Create or update author
    const authorId = 'uptune-music-team'
    await adminDb.collection('blog_authors').doc(authorId).set({
      name: 'UpTune Music Team',
      bio: 'Wedding music experts helping couples create unforgettable celebrations',
      avatar: '/images/authors/uptune-team.jpg',
      email: 'team@uptune.xyz',
      createdAt: new Date(),
      updatedAt: new Date()
    })
    
    const results = []
    
    for (const fileName of genreBlogFiles) {
      try {
        const filePath = path.join(process.cwd(), 'content', 'blog', fileName)
        const fileContent = readFileSync(filePath, 'utf8')
        const { data: frontmatter, content } = matter(fileContent)
        
        const blogPost = {
          title: frontmatter.title,
          slug: frontmatter.slug,
          excerpt: frontmatter.excerpt,
          content: content,
          authorId: authorId,
          category: frontmatter.category,
          tags: frontmatter.tags || [],
          featuredImage: frontmatter.featuredImage,
          status: frontmatter.status || 'published',
          publishedAt: new Date(frontmatter.publishedAt || Date.now()),
          updatedAt: new Date(frontmatter.updatedAt || Date.now()),
          createdAt: new Date(),
          views: 0,
          likes: 0,
          shares: 0,
          readTime: frontmatter.readTime || 8,
          seo: frontmatter.seo || {
            title: frontmatter.title,
            description: frontmatter.excerpt,
            keywords: frontmatter.tags || []
          }
        }
        
        await adminDb.collection('blog_posts').doc(frontmatter.slug).set(blogPost)
        results.push({ slug: frontmatter.slug, title: frontmatter.title, success: true })
        
      } catch (error) {
        console.error(`Error processing ${fileName}:`, error)
        results.push({ file: fileName, success: false, error: String(error) })
      }
    }
    
    return NextResponse.json({
      message: 'Genre blog posts seeded successfully',
      results,
      totalSuccess: results.filter(r => r.success).length,
      totalFiles: genreBlogFiles.length
    })
    
  } catch (error) {
    console.error('Error seeding blog posts:', error)
    return NextResponse.json(
      { error: 'Failed to seed blog posts', details: String(error) },
      { status: 500 }
    )
  }
}