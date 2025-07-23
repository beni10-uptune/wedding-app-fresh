'use client'

import Link from 'next/link'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { Clock, User, ArrowRight } from 'lucide-react'
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
          <div className="glass rounded-xl overflow-hidden hover:bg-white/[0.15] transition-all duration-300">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image
                  src={post.featuredImage || '/images/blog-placeholder.jpg'}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 flex flex-col justify-center">
                <div className="flex items-center gap-4 text-sm text-white/60 mb-3">
                  <span className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full text-xs font-medium">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.readTime} min read
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-purple-400 transition-colors">
                  {post.title}
                </h3>
                <p className="text-white/70 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm text-white/50">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {post.author.name}
                    </div>
                    <span>•</span>
                    <span>{formattedDate}</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
                </div>
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
        <div className="glass rounded-lg p-4 hover:bg-white/[0.15] transition-all duration-300">
          <div className="flex gap-4">
            <div className="relative w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={post.featuredImage || '/images/blog-placeholder.jpg'}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 text-xs text-white/60 mb-2">
                <span className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded-full font-medium">
                  {post.category}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {post.readTime} min
                </span>
              </div>
              <h3 className="font-semibold mb-1 group-hover:text-purple-400 transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-sm text-white/60 line-clamp-2">
                {post.excerpt}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}