import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit as firestoreLimit,
  Timestamp,
  addDoc,
  updateDoc,
  increment
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { BlogPost, BlogAuthor, UserBlogInteraction } from '@/types/blog'

const BLOG_POSTS_COLLECTION = 'blogPosts'
const BLOG_AUTHORS_COLLECTION = 'blogAuthors'
const BLOG_INTERACTIONS_COLLECTION = 'blogInteractions'

export async function getBlogPosts({
  category,
  tag,
  status = 'published',
  limit = 10,
  offset = 0,
}: {
  category?: string
  tag?: string
  status?: 'draft' | 'published' | 'archived'
  limit?: number
  offset?: number
} = {}) {
  try {
    // For now, return mock data until Firestore is populated
    const mockPosts: BlogPost[] = [
      {
        id: '1',
        slug: 'complete-guide-wedding-music-planning',
        title: "The Complete Guide to Wedding Music Planning: Create Your Perfect Soundtrack",
        excerpt: "Learn how to create the perfect soundtrack for every moment of your wedding day with our comprehensive music planning guide.",
        content: '',
        author: {
          id: '1',
          name: 'Sarah Mitchell',
          bio: 'Wedding music expert and content strategist at UpTune.',
        },
        category: 'Music Planning',
        tags: ["planning", "complete-guide", "timeline"],
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'published',
        readTime: 12,
        views: 0,
      },
      {
        id: '2',
        slug: 'perfect-wedding-timeline',
        title: "How to Create the Perfect Wedding Timeline with Music",
        excerpt: "Design a flawless wedding day timeline with perfectly timed music for each special moment.",
        content: '',
        author: {
          id: '2',
          name: 'UpTune Team',
          bio: 'The UpTune team is dedicated to helping couples create their perfect wedding soundtrack.',
        },
        category: 'Planning Resources',
        tags: ["timeline", "planning", "coordination"],
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'published',
        readTime: 10,
        views: 0,
      },
      {
        id: '3',
        slug: '10-ways-guest-music-selection',
        title: "10 Ways to Get Your Wedding Guests Involved in Music Selection",
        excerpt: "Discover creative ways to include your guests in choosing your wedding music while maintaining your vision.",
        content: '',
        author: {
          id: '1',
          name: 'Sarah Mitchell',
          bio: 'Wedding music expert and content strategist at UpTune.',
        },
        category: 'Guest Experience',
        tags: ["guest-involvement", "music-selection", "collaboration"],
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'published',
        readTime: 8,
        views: 0,
      },
      {
        id: '4',
        slug: 'real-wedding-sarah-tom',
        title: "Real Wedding: How Sarah & Tom Created Their Perfect Soundtrack",
        excerpt: "Follow Sarah and Tom's journey as they navigated different musical tastes to create a wedding playlist that had everyone dancing.",
        content: '',
        author: {
          id: '2',
          name: 'UpTune Team',
          bio: 'The UpTune team is dedicated to helping couples create their perfect wedding soundtrack.',
        },
        category: 'Real Weddings',
        tags: ["real-wedding", "success-story", "case-study"],
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'published',
        readTime: 7,
        views: 0,
      },
      {
        id: '5',
        slug: 'wedding-reception-music-guide',
        title: "Wedding Reception Music: From Cocktail Hour to Last Dance",
        excerpt: "Master the art of reception music planning with this detailed guide.",
        content: '',
        author: {
          id: '1',
          name: 'Sarah Mitchell',
          bio: 'Wedding music expert and content strategist at UpTune.',
        },
        category: 'Reception Planning',
        tags: ["reception", "cocktail-hour", "dancing"],
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'published',
        readTime: 9,
        views: 0,
      },
    ]

    // Filter by category if provided
    let filtered = mockPosts
    if (category) {
      filtered = filtered.filter(post => post.category === category)
    }
    if (tag) {
      filtered = filtered.filter(post => post.tags.includes(tag))
    }

    // Apply limit
    return filtered.slice(0, limit)
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    // Import mock content
    const { mockBlogPosts } = await import('./mock-content')
    
    // Find post by slug
    const post = mockBlogPosts.find(p => p.slug === slug)
    
    if (!post) return null
    
    // Simulate view count increment
    post.views = (post.views || 0) + 1
    
    return post
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
}

export async function getRelatedPosts(
  postId: string,
  category: string,
  tags: string[],
  limit: number = 3
): Promise<BlogPost[]> {
  try {
    // First try to get posts from the same category
    const categoryPosts = await getBlogPosts({
      category,
      limit: limit + 1, // Get one extra to exclude current post
    })

    const relatedPosts = categoryPosts.filter(post => post.id !== postId)

    if (relatedPosts.length >= limit) {
      return relatedPosts.slice(0, limit)
    }

    // If not enough posts, get posts with matching tags
    const tagPosts = await Promise.all(
      tags.map(tag => getBlogPosts({ tag, limit: 2 }))
    )

    const uniquePosts = new Map<string, BlogPost>()
    
    relatedPosts.forEach(post => uniquePosts.set(post.id, post))
    tagPosts.flat().forEach(post => {
      if (post.id !== postId) {
        uniquePosts.set(post.id, post)
      }
    })

    return Array.from(uniquePosts.values()).slice(0, limit)
  } catch (error) {
    console.error('Error fetching related posts:', error)
    return []
  }
}

export async function saveBlogPost(userId: string, postId: string) {
  try {
    const interactionId = `${userId}_${postId}`
    const interactionRef = doc(db, BLOG_INTERACTIONS_COLLECTION, interactionId)
    
    await updateDoc(interactionRef, {
      saved: true,
      lastReadAt: Timestamp.now(),
    }).catch(() => {
      // If document doesn't exist, create it
      return addDoc(collection(db, BLOG_INTERACTIONS_COLLECTION), {
        userId,
        postId,
        saved: true,
        readProgress: 0,
        lastReadAt: Timestamp.now(),
      })
    })

    return true
  } catch (error) {
    console.error('Error saving blog post:', error)
    return false
  }
}

export async function updateReadProgress(
  userId: string,
  postId: string,
  progress: number
) {
  try {
    const interactionId = `${userId}_${postId}`
    const interactionRef = doc(db, BLOG_INTERACTIONS_COLLECTION, interactionId)
    
    await updateDoc(interactionRef, {
      readProgress: progress,
      lastReadAt: Timestamp.now(),
    }).catch(() => {
      // If document doesn't exist, create it
      return addDoc(collection(db, BLOG_INTERACTIONS_COLLECTION), {
        userId,
        postId,
        saved: false,
        readProgress: progress,
        lastReadAt: Timestamp.now(),
      })
    })

    return true
  } catch (error) {
    console.error('Error updating read progress:', error)
    return false
  }
}

export async function getTrendingSongs(limit: number = 10) {
  try {
    const songsRef = collection(db, 'songs')
    const q = query(
      songsRef,
      orderBy('popularity', 'desc'),
      firestoreLimit(limit)
    )
    
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error fetching trending songs:', error)
    return []
  }
}