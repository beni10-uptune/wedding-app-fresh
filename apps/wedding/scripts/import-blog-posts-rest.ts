#!/usr/bin/env npx tsx

import { readFileSync } from 'fs'
import { join } from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

async function importBlogPostsViaREST() {
  console.log('🔥 Importing genre blog posts to Firestore via REST API...\n')
  
  try {
    // Get access token
    const { stdout: token } = await execAsync('gcloud auth application-default print-access-token')
    const accessToken = token.trim()
    
    // Read the blog posts JSON
    const blogPostsPath = join(process.cwd(), 'src', 'data', 'exports', 'genre-blog-posts.json')
    const blogPosts = JSON.parse(readFileSync(blogPostsPath, 'utf8'))
    
    const project = 'weddings-uptune-d12fa'
    const database = '(default)'
    let successCount = 0
    
    // First, ensure the author exists
    console.log('Creating/updating author...')
    const authorUrl = `https://firestore.googleapis.com/v1/projects/${project}/databases/${database}/documents/blogAuthors/uptune-team`
    
    const authorData = {
      fields: {
        id: { stringValue: 'uptune-team' },
        name: { stringValue: 'UpTune Music Team' },
        bio: { stringValue: 'Wedding music experts helping couples create unforgettable celebrations' },
        avatar: { stringValue: '/images/authors/uptune-team.jpg' },
        email: { stringValue: 'team@uptune.xyz' },
        createdAt: { timestampValue: new Date().toISOString() },
        updatedAt: { timestampValue: new Date().toISOString() }
      }
    }
    
    const authorResponse = await fetch(authorUrl, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(authorData)
    })
    
    if (authorResponse.ok) {
      console.log('✅ Author created/updated successfully\n')
    } else {
      console.log('⚠️  Author creation warning:', await authorResponse.text())
    }
    
    // Import each blog post
    for (const post of blogPosts) {
      console.log(`📝 Importing: ${post.title}`)
      
      const url = `https://firestore.googleapis.com/v1/projects/${project}/databases/${database}/documents/blogPosts/${post.slug}`
      
      // Convert blog post to Firestore format
      const firestoreDoc = {
        fields: {
          title: { stringValue: post.title },
          slug: { stringValue: post.slug },
          excerpt: { stringValue: post.excerpt },
          content: { stringValue: post.content },
          authorId: { stringValue: post.authorId },
          category: { stringValue: post.category },
          tags: { 
            arrayValue: { 
              values: (typeof post.tags === 'string' ? JSON.parse(post.tags) : post.tags).map((tag: string) => ({ stringValue: tag })) 
            } 
          },
          featuredImage: { stringValue: post.featuredImage },
          status: { stringValue: post.status },
          publishedAt: { timestampValue: post.publishedAt },
          updatedAt: { timestampValue: post.updatedAt },
          createdAt: { timestampValue: post.createdAt },
          views: { integerValue: String(post.views) },
          likes: { integerValue: String(post.likes) },
          shares: { integerValue: String(post.shares) },
          readTime: { integerValue: String(typeof post.readTime === 'string' ? parseInt(post.readTime) : post.readTime) },
          seo: {
            mapValue: {
              fields: {
                title: { stringValue: post.seo.title },
                description: { stringValue: post.seo.description },
                keywords: { 
                  arrayValue: { 
                    values: (typeof post.seo.keywords === 'string' ? JSON.parse(post.seo.keywords) : post.seo.keywords).map((kw: string) => ({ stringValue: kw })) 
                  }
                }
              }
            }
          }
        }
      }
      
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(firestoreDoc)
      })
      
      if (response.ok) {
        console.log(`   ✅ Successfully imported`)
        successCount++
      } else {
        const error = await response.text()
        console.error(`   ❌ Failed to import:`, error)
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    console.log(`\n✅ Import completed!`)
    console.log(`   - Successfully imported: ${successCount}/${blogPosts.length} posts`)
    console.log(`\n🔗 Your blog posts are now available at:`)
    blogPosts.forEach((post: any) => {
      console.log(`   - weddings.uptune.xyz/blog/${post.slug}`)
    })
    
  } catch (error) {
    console.error('❌ Import failed:', error)
  }
}

// Run the script
importBlogPostsViaREST()
  .then(() => {
    console.log('\n✅ Script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error)
    process.exit(1)
  })