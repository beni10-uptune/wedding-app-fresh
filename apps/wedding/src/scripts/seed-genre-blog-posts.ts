#!/usr/bin/env npx tsx

import * as dotenv from 'dotenv'
import * as path from 'path'
import { readFileSync, readdirSync } from 'fs'
import matter from 'gray-matter'
import { 
  collection, 
  doc, 
  setDoc,
  Timestamp 
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const BLOG_POSTS_COLLECTION = 'blogPosts'
const BLOG_AUTHORS_COLLECTION = 'blogAuthors'

// Genre blog posts to seed
const genreBlogFiles = [
  'best-hip-hop-wedding-songs-2025.md',
  'best-country-wedding-songs-2025.md',
  'best-rnb-wedding-songs-2025.md',
  'best-rock-wedding-songs-2025.md',
  'best-indie-wedding-songs-2025.md'
]

async function seedGenreBlogPosts() {
  try {
    console.log('🎵 Starting genre blog posts seeding...\n')
    
    // First ensure the UpTune Team author exists
    const authorId = 'uptune-team'
    await setDoc(doc(db, BLOG_AUTHORS_COLLECTION, authorId), {
      id: authorId,
      name: 'UpTune Music Team',
      bio: 'Wedding music experts helping couples create unforgettable celebrations',
      avatar: '/images/authors/uptune-team.jpg',
      email: 'team@uptune.xyz',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    })
    console.log('✓ Author created/updated: UpTune Music Team')
    
    const contentDir = path.join(process.cwd(), 'content', 'blog')
    let successCount = 0
    
    for (const fileName of genreBlogFiles) {
      try {
        const filePath = path.join(contentDir, fileName)
        const fileContent = readFileSync(filePath, 'utf8')
        const { data: frontmatter, content } = matter(fileContent)
        
        console.log(`\n📝 Processing: ${fileName}`)
        
        // Convert frontmatter to blog post format
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
          publishedAt: frontmatter.publishedAt ? Timestamp.fromDate(new Date(frontmatter.publishedAt)) : Timestamp.now(),
          updatedAt: frontmatter.updatedAt ? Timestamp.fromDate(new Date(frontmatter.updatedAt)) : Timestamp.now(),
          createdAt: Timestamp.now(),
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
        
        // Save to Firestore
        await setDoc(doc(db, BLOG_POSTS_COLLECTION, frontmatter.slug), blogPost)
        console.log(`   ✅ Successfully seeded: ${frontmatter.title}`)
        console.log(`   📍 Slug: ${frontmatter.slug}`)
        console.log(`   🏷️  Tags: ${frontmatter.tags.join(', ')}`)
        successCount++
        
      } catch (error) {
        console.error(`   ❌ Error processing ${fileName}:`, error)
      }
    }
    
    console.log(`\n✅ Genre blog posts seeding completed!`)
    console.log(`   - Successfully seeded: ${successCount}/${genreBlogFiles.length} posts`)
    console.log(`\n🔗 Your blog posts will be available at:`)
    genreBlogFiles.forEach(file => {
      const slug = file.replace('.md', '')
      console.log(`   - weddings.uptune.xyz/blog/${slug}`)
    })
    
  } catch (error) {
    console.error('❌ Error seeding genre blog posts:', error)
    throw error
  }
}

// Main execution
async function main() {
  // Check if gray-matter is installed
  try {
    require.resolve('gray-matter')
  } catch (e) {
    console.log('📦 Installing required dependency: gray-matter')
    // Use dynamic import instead of require to comply with ESLint rules
    const cp = await import('child_process')
    cp.execSync('npm install gray-matter', { stdio: 'inherit' })
  }

  // Run the script
  try {
    await seedGenreBlogPosts()
    console.log('\n✅ Script completed successfully')
    process.exit(0)
  } catch (error) {
    console.error('\n❌ Script failed:', error)
    process.exit(1)
  }
}

main()