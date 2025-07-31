// Load environment variables for local execution
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { 
  doc, 
  updateDoc,
  getDoc
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

const BLOG_POSTS_COLLECTION = 'blogPosts'

// Map of blog slugs to their featured images
const blogImageUpdates = [
  {
    slug: 'complete-guide-wedding-music-planning',
    featuredImage: '/images/blog/wedding_music_planning_guide.png',
    altText: 'Comprehensive wedding music planning guide showing timeline and music notes'
  },
  {
    slug: 'perfect-wedding-timeline',
    featuredImage: '/images/blog/wedding_timeline_music.png',
    altText: 'Wedding timeline infographic with music cues for each moment'
  },
  {
    slug: '10-ways-guest-music-selection',
    featuredImage: '/images/blog/guests_music_collaboration.png',
    altText: 'Wedding guests collaborating on music selection using phones and tablets'
  },
  {
    slug: 'real-wedding-sarah-tom',
    featuredImage: '/images/blog/sarah_tom_wedding_story.png',
    altText: 'Sarah and Tom dancing at their wedding reception with guests celebrating'
  },
  {
    slug: 'wedding-reception-music-guide',
    featuredImage: '/images/blog/reception_music_guide.png',
    altText: 'Wedding reception music guide showing DJ setup and dancing guests'
  }
]

export async function updateBlogImages() {
  console.log('Starting blog image updates...')
  
  for (const update of blogImageUpdates) {
    try {
      const docRef = doc(db, BLOG_POSTS_COLLECTION, update.slug)
      
      // First check if the document exists
      const docSnap = await getDoc(docRef)
      
      if (!docSnap.exists()) {
        console.log(`⚠️  Blog post not found: ${update.slug}`)
        continue
      }
      
      // Update only the featuredImage field
      await updateDoc(docRef, {
        featuredImage: update.featuredImage
      })
      
      console.log(`✅ Updated featured image for: ${update.slug}`)
    } catch (error) {
      console.error(`❌ Error updating ${update.slug}:`, error)
    }
  }
  
  console.log('✨ Blog image updates completed!')
}

// Run this script with: npx tsx src/scripts/update-blog-images.ts
updateBlogImages()
  .then(() => {
    console.log('Script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Script failed:', error)
    process.exit(1)
  })