'use client'

import Link from 'next/link'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { Clock, User } from 'lucide-react'
import { BlogPost } from '@/types/blog'

interface BlogPostCardProps {
  post: BlogPost
  featured?: boolean
}

export function BlogPostCard({ post, featured = false }: BlogPostCardProps) {
  const formattedDate = formatDistanceToNow(
    typeof post.publishedAt === 'string' 
      ? new Date(post.publishedAt) 
      : post.publishedAt.toDate(), 
    { addSuffix: true }
  )

  if (featured) {
    return (
      <article className="group">
        <Link href={`/blog/${post.slug}`}>
          <div className="grid md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <Image
                src={post.featuredImage || '/images/blog/placeholder.svg'}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                  {post.category}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.readTime} min read
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-purple-600 transition-colors">
                {post.title}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {post.author.name}
                </div>
                <span>•</span>
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>
        </Link>
      </article>
    )
  }

  return (
    <article className="group">
      <Link href={`/blog/${post.slug}`}>
        <div className="flex gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="relative w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={post.featuredImage || '/images/blog/placeholder.svg'}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                {post.category}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {post.readTime} min
              </span>
            </div>
            <h3 className="font-semibold mb-1 group-hover:text-purple-600 transition-colors line-clamp-2">
              {post.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {post.excerpt}
            </p>
          </div>
        </div>
      </Link>
    </article>
  )
}