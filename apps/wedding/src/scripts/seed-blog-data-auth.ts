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
import { signInWithEmailAndPassword } from 'firebase/auth'
import { db, auth } from '@/lib/firebase'
import { mockBlogPosts } from '@/lib/blog/mock-content'

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
    // First authenticate with your admin account
    console.log('Please authenticate to seed blog data...')
    console.log('Enter your admin email and password:')
    
    // For security, you should pass these as environment variables or command line args
    const email = process.env.ADMIN_EMAIL || ''
    const password = process.env.ADMIN_PASSWORD || ''
    
    if (!email || !password) {
      console.error('Please set ADMIN_EMAIL and ADMIN_PASSWORD environment variables')
      console.log('Example: ADMIN_EMAIL=your@email.com ADMIN_PASSWORD=yourpassword npx tsx src/scripts/seed-blog-data-auth.ts')
      return
    }
    
    console.log('Authenticating...')
    await signInWithEmailAndPassword(auth, email, password)
    console.log('✓ Authenticated successfully')
    
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

    // Seed blog posts with featured images
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
      console.log(`✓ Seeded: ${post.title}`)
    }
    console.log(`✓ Seeded ${mockBlogPosts.length} blog posts`)

    console.log('✅ Blog data seeding completed successfully!')
    console.log('\nYour blog is now live with:')
    console.log('- 5 comprehensive blog posts')
    console.log('- Featured images for each post')
    console.log('- All interactive components (quizzes, playlists, calculators)')
    console.log('- SEO metadata')
    console.log('\nVisit https://weddings.uptune.xyz/blog to see your blog!')
    
  } catch (error) {
    console.error('Error seeding blog data:', error)
    throw error
  }
}

// Run this script
seedBlogData()
  .then(() => {
    console.log('\nScript completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\nScript failed:', error)
    process.exit(1)
  })