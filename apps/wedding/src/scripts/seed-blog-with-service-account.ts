// This script uses Firebase Admin SDK with service account for proper authentication
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'
import * as dotenv from 'dotenv'
import * as path from 'path'
import { mockBlogPosts } from '@/lib/blog/mock-content'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

// Service account configuration
async function initializeAdmin() {
  if (getApps().length > 0) {
    return getFirestore()
  }

  // Option 1: Using service account JSON file (most secure)
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const { readFileSync } = await import('fs')
    const serviceAccountJson = readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, 'utf8')
    const serviceAccount = JSON.parse(serviceAccountJson)
    initializeApp({
      credential: cert(serviceAccount),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    })
  } 
  // Option 2: Using individual environment variables
  else if (process.env.FIREBASE_PRIVATE_KEY) {
    initializeApp({
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      })
    })
  }
  // Option 3: Using default credentials (for Google Cloud environments)
  else {
    initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    })
  }

  return getFirestore()
}

// Authors data
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

async function seedBlogData() {
  try {
    console.log('Initializing Firebase Admin...')
    const db = await initializeAdmin()
    
    // Seed authors
    console.log('\n📝 Seeding authors...')
    for (const author of authors) {
      await db.collection('blogAuthors').doc(author.id).set({
        ...author,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      })
      console.log(`  ✓ Created author: ${author.name}`)
    }

    // Seed blog posts
    console.log('\n📚 Seeding blog posts...')
    for (const post of mockBlogPosts) {
      const authorId = post.author.name === 'Sarah Mitchell' ? 'sarah-mitchell' : 'uptune-team'
      
      // Prepare blog post data
      const blogPostData: any = {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        authorId,
        category: post.category,
        tags: post.tags,
        featuredImage: post.featuredImage || null,
        featuredImageAlt: post.featuredImage ? (post.seo?.metaDescription || `Featured image for ${post.title}`) : null,
        publishedAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        createdAt: Timestamp.now(),
        status: post.status,
        readTime: post.readTime,
        views: 0,
        likes: 0,
        shares: 0
      }

      // Add SEO data if present
      if (post.seo) {
        blogPostData.seo = post.seo
      }

      // Add related features if present
      if (post.relatedFeatures) {
        blogPostData.relatedFeatures = post.relatedFeatures
      }

      await db.collection('blogPosts').doc(post.slug).set(blogPostData)
      console.log(`  ✓ Created post: ${post.title}`)
    }

    console.log('\n✅ Blog seeding completed successfully!')
    console.log('\n🎉 Your blog is now live with:')
    console.log('  - 5 comprehensive blog posts')
    console.log('  - Featured images for each post')
    console.log('  - All interactive components')
    console.log('  - Full MDX content')
    console.log('  - SEO metadata')
    console.log('\n🔗 Visit https://weddings.uptune.xyz/blog to see your blog!')
    
  } catch (error) {
    console.error('\n❌ Error seeding blog data:', error)
    throw error
  }
}

// Instructions for running this script
console.log(`
========================================
Firebase Admin Blog Seeding Script
========================================

This script requires Firebase Admin credentials. Choose one of these options:

OPTION 1: Service Account JSON (Recommended)
1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Save the JSON file securely
4. Run: GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccount.json npm run seed:blog

OPTION 2: Individual Credentials
1. From the service account JSON, extract:
   - client_email
   - private_key
   - project_id
2. Add to .env.local:
   FIREBASE_CLIENT_EMAIL=your-client-email
   FIREBASE_PRIVATE_KEY="your-private-key"
3. Run: npm run seed:blog

OPTION 3: Google Cloud Default Credentials
1. Install gcloud CLI
2. Run: gcloud auth application-default login
3. Run: npm run seed:blog

Starting seed process...
`)

// Run the seeding
seedBlogData()
  .then(() => {
    console.log('\n✨ Script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Script failed:', error)
    process.exit(1)
  })