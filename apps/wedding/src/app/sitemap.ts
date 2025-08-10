import { MetadataRoute } from 'next'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'

// Cache blog posts for 1 hour in production
let cachedBlogPosts: any[] | null = null
let cacheTime: number = 0
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour

async function getBlogPosts() {
  const now = Date.now()
  
  // Return cached data if still valid
  if (cachedBlogPosts && (now - cacheTime) < CACHE_DURATION) {
    return cachedBlogPosts
  }

  try {
    const blogPostsRef = collection(db, 'blogPosts')
    const publishedQuery = query(blogPostsRef, where('status', '==', 'published'))
    const snapshot = await getDocs(publishedQuery)
    
    cachedBlogPosts = snapshot.docs.map(doc => ({
      slug: doc.id,
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    }))
    
    cacheTime = now
    return cachedBlogPosts
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error)
    // Return static blog posts as fallback
    return [
      { slug: 'complete-guide-wedding-music-planning', updatedAt: new Date() },
      { slug: 'perfect-wedding-timeline', updatedAt: new Date() },
      { slug: '10-ways-guest-music-selection', updatedAt: new Date() },
      { slug: 'real-wedding-sarah-tom', updatedAt: new Date() },
      { slug: 'wedding-reception-music-guide', updatedAt: new Date() }
    ]
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://weddings.uptune.xyz'
  
  // High priority pages (home, core features)
  const highPriorityPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/auth/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    }
  ]

  // Feature pages
  const featurePages = [
    '/song-tools',
    '/builder',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Content pages
  const contentPages = [
    '/blog',
    '/help',
    '/contact',
    '/about',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Legal pages (lower priority, less frequent changes)
  const legalPages = [
    '/privacy',
    '/terms',
    '/cookies',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  // Auth pages (lower priority for SEO)
  const authPages = [
    '/auth/login',
    '/auth/forgot-password',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'yearly' as const,
    priority: 0.4,
  }))

  // Fetch dynamic blog posts
  const blogPostsData = await getBlogPosts()
  const blogPosts = blogPostsData.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Blog category pages
  const blogCategories = [
    '/blog/category/music-planning',
    '/blog/category/planning-resources',
    '/blog/category/guest-experience',
    '/blog/category/real-weddings',
    '/blog/category/reception-planning',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [
    ...highPriorityPages,
    ...featurePages,
    ...contentPages,
    ...blogPosts,
    ...blogCategories,
    ...legalPages,
    ...authPages,
  ]
}