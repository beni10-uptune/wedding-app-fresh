import { Timestamp } from 'firebase/firestore'

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string // MDX content
  author: BlogAuthor
  category: string
  tags: string[]
  featuredImage?: string
  featuredImageAlt?: string
  publishedAt: string | Timestamp
  updatedAt: string | Timestamp
  status: 'draft' | 'published' | 'archived'
  seo?: {
    metaTitle?: string
    metaDescription?: string
    focusKeyword?: string
  }
  relatedFeatures?: string[]
  embeddedPlaylists?: string[]
  readTime: number
  views?: number
}

export interface BlogAuthor {
  id: string
  name: string
  avatar?: string
  bio?: string
  socialLinks?: {
    twitter?: string
    linkedin?: string
    website?: string
  }
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description: string
  color: string
}

export interface UserBlogInteraction {
  userId: string
  postId: string
  saved: boolean
  readProgress: number
  lastReadAt: Timestamp
}