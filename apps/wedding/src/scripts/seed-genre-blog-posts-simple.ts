#!/usr/bin/env npx tsx

import { readFileSync } from 'fs'
import * as path from 'path'

// Parse markdown files and create JSON for manual import
async function exportGenreBlogPosts() {
  console.log('📚 Exporting genre blog posts to JSON...\n')
  
  const genreBlogFiles = [
    'best-hip-hop-wedding-songs-2025.md',
    'best-country-wedding-songs-2025.md', 
    'best-rnb-wedding-songs-2025.md',
    'best-rock-wedding-songs-2025.md',
    'best-indie-wedding-songs-2025.md'
  ]
  
  const blogPosts: any[] = []
  const contentDir = path.join(process.cwd(), 'content', 'blog')
  
  for (const fileName of genreBlogFiles) {
    try {
      const filePath = path.join(contentDir, fileName)
      const fileContent = readFileSync(filePath, 'utf8')
      
      // Simple frontmatter parsing
      const frontmatterMatch = fileContent.match(/^---\n([\s\S]*?)\n---/)
      if (!frontmatterMatch) continue
      
      const frontmatterText = frontmatterMatch[1]
      const content = fileContent.replace(frontmatterMatch[0], '').trim()
      
      // Parse frontmatter manually
      const frontmatter: any = {}
      const lines = frontmatterText.split('\n')
      let currentKey = ''
      let currentValue: any = ''
      let inArray = false
      let inObject = false
      
      for (const line of lines) {
        if (line.match(/^[a-zA-Z]+:/)) {
          // Save previous key-value
          if (currentKey) {
            frontmatter[currentKey] = currentValue
          }
          
          const [key, ...valueParts] = line.split(':')
          currentKey = key.trim()
          currentValue = valueParts.join(':').trim()
          
          // Handle simple values
          if (currentValue.startsWith('"') && currentValue.endsWith('"')) {
            currentValue = currentValue.slice(1, -1)
          }
          
          inArray = false
          inObject = false
        } else if (line.trim().startsWith('-')) {
          // Array item
          if (!inArray) {
            currentValue = []
            inArray = true
          }
          const item = line.trim().slice(1).trim()
          currentValue.push(item.replace(/^["']|["']$/g, ''))
        } else if (line.includes(':') && line.trim()) {
          // Object property
          if (!inObject) {
            currentValue = {}
            inObject = true
          }
          const [key, ...valueParts] = line.trim().split(':')
          const value = valueParts.join(':').trim().replace(/^["']|["']$/g, '')
          currentValue[key.trim()] = value
        }
      }
      
      // Save last key-value
      if (currentKey) {
        frontmatter[currentKey] = currentValue
      }
      
      // Create blog post object
      const blogPost = {
        id: frontmatter.slug,
        title: frontmatter.title,
        slug: frontmatter.slug,
        excerpt: frontmatter.excerpt,
        content: content,
        authorId: 'uptune-team',
        category: frontmatter.category,
        tags: frontmatter.tags || [],
        featuredImage: frontmatter.featuredImage,
        status: frontmatter.status || 'published',
        publishedAt: frontmatter.publishedAt || new Date().toISOString(),
        updatedAt: frontmatter.updatedAt || new Date().toISOString(),
        createdAt: new Date().toISOString(),
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
      
      blogPosts.push(blogPost)
      console.log(`✅ Processed: ${frontmatter.title}`)
      
    } catch (error) {
      console.error(`❌ Error processing ${fileName}:`, error)
    }
  }
  
  // Write to JSON file
  const outputPath = path.join(process.cwd(), 'src', 'data', 'exports', 'genre-blog-posts.json')
  const { writeFileSync } = await import('fs')
  writeFileSync(outputPath, JSON.stringify(blogPosts, null, 2))
  
  console.log(`\n✅ Export completed!`)
  console.log(`📁 File saved to: ${outputPath}`)
  console.log(`📊 Total posts: ${blogPosts.length}`)
  
  console.log('\n📝 Import Instructions:')
  console.log('1. Go to Firebase Console > Firestore Database')
  console.log('2. Navigate to the "blogPosts" collection')
  console.log('3. Import the genre-blog-posts.json file')
  console.log('\nOR use the Firebase Admin SDK to import programmatically')
  
  return blogPosts
}

// Run the script
exportGenreBlogPosts()
  .then(() => {
    console.log('\n✅ Script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error)
    process.exit(1)
  })