// Load environment variables for local execution
import * as dotenv from 'dotenv'
import * as path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { 
  collection, 
  doc, 
  setDoc,
  Timestamp 
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { mockBlogPosts } from '@/lib/blog/mock-content'
import { BlogPost } from '@/types/blog'

const BLOG_POSTS_COLLECTION = 'blogPosts'
const BLOG_AUTHORS_COLLECTION = 'blogAuthors'

// Unique authors from the mock data
const authors = [
  {
    id: 'sarah-mitchell',
    name: 'Sarah Mitchell',
    bio: 'Wedding music expert and content strategist at UpTune.',
    avatar: '/images/authors/sarah-mitchell.jpg',
    email: 'sarah@uptune.xyz'
  },
  {
    id: 'uptune-team',
    name: 'UpTune Team',
    bio: 'The UpTune team is dedicated to helping couples create their perfect wedding soundtrack.',
    avatar: '/images/authors/uptune-team.jpg',
    email: 'team@uptune.xyz'
  }
]

export async function seedBlogData() {
  try {
    // Seed authors first
    console.log('Seeding authors...')
    for (const author of authors) {
      await setDoc(doc(db, BLOG_AUTHORS_COLLECTION, author.id), {
        ...author,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      })
    }
    console.log(`✓ Seeded ${authors.length} authors`)

    // Seed blog posts
    console.log('Seeding blog posts...')
    for (const post of mockBlogPosts) {
      // Convert author to use the new ID format
      const authorId = post.author.name === 'Sarah Mitchell' ? 'sarah-mitchell' : 'uptune-team'
      
      const blogPost = {
        ...post,
        authorId,
        publishedAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        createdAt: Timestamp.now(),
        views: 0,
        likes: 0,
        shares: 0
      }

      // Remove the nested author object as we'll use authorId
      delete (blogPost as any).author

      await setDoc(doc(db, BLOG_POSTS_COLLECTION, post.slug), blogPost)
    }
    console.log(`✓ Seeded ${mockBlogPosts.length} blog posts`)

    console.log('✅ Blog data seeding completed successfully!')
  } catch (error) {
    console.error('Error seeding blog data:', error)
    throw error
  }
}

// Run this script with: npx tsx src/scripts/seed-blog-data.ts
seedBlogData()
  .then(() => {
    console.log('Script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Script failed:', error)
    process.exit(1)
  })