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
  increment,
  startAfter,
  DocumentSnapshot
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { BlogPost, BlogAuthor, UserBlogInteraction } from '@/types/blog'
import { logger } from '@/lib/logger'

const BLOG_POSTS_COLLECTION = 'blogPosts'
const BLOG_AUTHORS_COLLECTION = 'blogAuthors'
const BLOG_INTERACTIONS_COLLECTION = 'blogInteractions'

// Cache for authors to reduce reads
const authorCache = new Map<string, BlogAuthor>()

async function getAuthor(authorId: string): Promise<BlogAuthor | null> {
  try {
    // Check cache first
    if (authorCache.has(authorId)) {
      return authorCache.get(authorId)!
    }

    const authorDoc = await getDoc(doc(db, BLOG_AUTHORS_COLLECTION, authorId))
    if (!authorDoc.exists()) {
      return null
    }

    const author = { id: authorDoc.id, ...authorDoc.data() } as BlogAuthor
    authorCache.set(authorId, author)
    return author
  } catch (error) {
    logger.error('Error fetching author:', { error, authorId })
    return null
  }
}

export async function getBlogPosts({
  category,
  tag,
  status = 'published',
  limit = 10,
  offset = 0,
  lastDoc,
}: {
  category?: string
  tag?: string
  status?: 'draft' | 'published' | 'archived'
  limit?: number
  offset?: number
  lastDoc?: DocumentSnapshot
} = {}): Promise<{ posts: BlogPost[], lastDoc?: DocumentSnapshot }> {
  try {
    const postsRef = collection(db, BLOG_POSTS_COLLECTION)
    let q = query(postsRef, where('status', '==', status))

    // Add category filter
    if (category) {
      q = query(q, where('category', '==', category))
    }

    // Add tag filter
    if (tag) {
      q = query(q, where('tags', 'array-contains', tag))
    }

    // Add ordering and pagination
    q = query(q, orderBy('publishedAt', 'desc'))
    
    if (lastDoc) {
      q = query(q, startAfter(lastDoc))
    }
    
    q = query(q, firestoreLimit(limit))

    const snapshot = await getDocs(q)
    const posts: BlogPost[] = []

    for (const doc of snapshot.docs) {
      const data = doc.data()
      const author = await getAuthor(data.authorId)
      
      if (author) {
        posts.push({
          id: doc.id,
          ...data,
          author,
          publishedAt: data.publishedAt?.toDate?.() || data.publishedAt,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
        } as BlogPost)
      }
    }

    const lastDocument = snapshot.docs[snapshot.docs.length - 1]

    return { posts, lastDoc: lastDocument }
  } catch (error) {
    logger.error('Error fetching blog posts:', { error, category, tag, status })
    
    // Fallback to mock data if Firestore fails
    try {
      const { mockBlogPosts } = await import('./mock-content')
      let filtered = mockBlogPosts.filter(p => p.status === status)
      
      if (category) {
        filtered = filtered.filter(p => p.category === category)
      }
      if (tag) {
        filtered = filtered.filter(p => p.tags.includes(tag))
      }
      
      return { posts: filtered.slice(0, limit) }
    } catch {
      return { posts: [] }
    }
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    // First try to get from Firestore by querying with slug field
    const postsRef = collection(db, BLOG_POSTS_COLLECTION)
    const q = query(postsRef, where('slug', '==', slug), firestoreLimit(1))
    const snapshot = await getDocs(q)
    
    if (!snapshot.empty) {
      const postDoc = snapshot.docs[0]
      const data = postDoc.data()
      const author = await getAuthor(data.authorId)
      
      if (author) {
        // Increment view count
        await updateDoc(postDoc.ref, {
          views: increment(1)
        }).catch(error => {
          logger.warn('Failed to increment view count:', { error, slug })
        })

        return {
          id: postDoc.id,
          ...data,
          author,
          publishedAt: data.publishedAt?.toDate?.() || data.publishedAt,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
          views: (data.views || 0) + 1, // Include the incremented view
        } as BlogPost
      }
    }
    
    // Also try direct document access (for backward compatibility)
    const postDoc = await getDoc(doc(db, BLOG_POSTS_COLLECTION, slug))
    
    if (postDoc.exists()) {
      const data = postDoc.data()
      const author = await getAuthor(data.authorId)
      
      if (author) {
        // Increment view count
        await updateDoc(postDoc.ref, {
          views: increment(1)
        }).catch(error => {
          logger.warn('Failed to increment view count:', { error, slug })
        })

        return {
          id: postDoc.id,
          ...data,
          author,
          publishedAt: data.publishedAt?.toDate?.() || data.publishedAt,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
          views: (data.views || 0) + 1, // Include the incremented view
        } as BlogPost
      }
    }

    // Fall back to mock data if not in Firestore
    const { mockBlogPosts } = await import('./mock-content')
    const post = mockBlogPosts.find(p => p.slug === slug)
    
    if (post) {
      post.views = (post.views || 0) + 1
      return post
    }

    return null
  } catch (error) {
    logger.error('Error fetching blog post:', { error, slug })
    
    // Fallback to mock data
    try {
      const { mockBlogPosts } = await import('./mock-content')
      const post = mockBlogPosts.find(p => p.slug === slug)
      if (post) {
        post.views = (post.views || 0) + 1
        return post
      }
    } catch {}
    
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
    const { posts: categoryPosts } = await getBlogPosts({
      category,
      limit: limit + 1, // Get one extra to exclude current post
    })

    const relatedPosts = categoryPosts.filter(post => post.id !== postId && post.slug !== postId)

    if (relatedPosts.length >= limit) {
      return relatedPosts.slice(0, limit)
    }

    // If not enough posts, get posts with matching tags
    const tagPromises = tags.map(tag => getBlogPosts({ tag, limit: 2 }))
    const tagResults = await Promise.all(tagPromises)
    const tagPosts = tagResults.flatMap(result => result.posts)

    const uniquePosts = new Map<string, BlogPost>()
    
    relatedPosts.forEach(post => uniquePosts.set(post.id, post))
    tagPosts.forEach(post => {
      if (post.id !== postId && post.slug !== postId) {
        uniquePosts.set(post.id, post)
      }
    })

    return Array.from(uniquePosts.values()).slice(0, limit)
  } catch (error) {
    logger.error('Error fetching related posts:', { error, postId, category })
    return []
  }
}

export async function getBlogCategories(): Promise<string[]> {
  try {
    const { posts } = await getBlogPosts({ limit: 100 })
    const categories = new Set<string>()
    posts.forEach(post => categories.add(post.category))
    return Array.from(categories).sort()
  } catch (error) {
    logger.error('Error fetching blog categories:', { error })
    return ['Music Planning', 'Planning Resources', 'Guest Experience', 'Real Weddings', 'Reception Planning']
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
    logger.error('Error saving blog post:', { error, userId, postId })
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
    logger.error('Error updating read progress:', { error, userId, postId, progress })
    return false
  }
}

export async function getTrendingSongs(category?: string, limit: number = 10) {
  try {
    // For now, return mock trending songs until we have real data
    const mockTrendingSongs = [
      { id: '1', title: 'Perfect', artist: 'Ed Sheeran', spotifyId: '0tgVpDi06FyKpA1z0VMD4v', popularity: 95 },
      { id: '2', title: 'Thinking Out Loud', artist: 'Ed Sheeran', spotifyId: '3QGsuHI8jO1Rx4JWLUh9jd', popularity: 92 },
      { id: '3', title: 'Marry You', artist: 'Bruno Mars', spotifyId: '5UofU3xG4Y7a1rHoYcVpYu', popularity: 90 },
      { id: '4', title: 'A Thousand Years', artist: 'Christina Perri', spotifyId: '6lanRgr6wXibZr8KgzXxBl', popularity: 89 },
      { id: '5', title: "Can't Help Myself", artist: 'Flowers', spotifyId: '5UlZLkF8pcCLa7NVBV5Tv5', popularity: 88 },
      { id: '6', title: 'All of Me', artist: 'John Legend', spotifyId: '3U4isOIWM3VvDubwSI3y7a', popularity: 87 },
      { id: '7', title: 'Make You Feel My Love', artist: 'Adele', spotifyId: '08GOmTlwRlB0xwU7jgHDgE', popularity: 85 },
      { id: '8', title: "I'm Yours", artist: 'Jason Mraz', spotifyId: '7cuk8JsPTYJCfxfRqOp3xP', popularity: 84 },
      { id: '9', title: 'Better Days', artist: 'OneRepublic', spotifyId: '2eAvDnpXP5W0cVtiI0PUxV', popularity: 82 },
      { id: '10', title: 'Photograph', artist: 'Ed Sheeran', spotifyId: '6fxVffaTuwjgEk5h9QyRjy', popularity: 80 }
    ]

    return category 
      ? mockTrendingSongs.filter(song => {
          // Filter by category logic here if needed
          return true
        }).slice(0, limit)
      : mockTrendingSongs.slice(0, limit)
  } catch (error) {
    logger.error('Error fetching trending songs:', { error, category, limit })
    return []
  }
}