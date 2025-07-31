import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

// Initialize admin SDK
if (!getApps().length) {
  initializeApp({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  })
}

const db = getFirestore()

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

async function updateBlogImages() {
  console.log('Starting blog image updates using Admin SDK...')
  
  for (const update of blogImageUpdates) {
    try {
      const docRef = db.collection('blogPosts').doc(update.slug)
      
      // First check if the document exists
      const doc = await docRef.get()
      
      if (!doc.exists) {
        console.log(`⚠️  Blog post not found: ${update.slug}`)
        continue
      }
      
      // Update only the featuredImage field
      await docRef.update({
        featuredImage: update.featuredImage,
        featuredImageAlt: update.altText
      })
      
      console.log(`✅ Updated featured image for: ${update.slug}`)
    } catch (error) {
      console.error(`❌ Error updating ${update.slug}:`, error)
    }
  }
  
  console.log('✨ Blog image updates completed!')
}

// Run the update
updateBlogImages()
  .then(() => {
    console.log('Script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Script failed:', error)
    process.exit(1)
  })