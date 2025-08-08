import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Calendar } from 'lucide-react'
import { BlogPostCard } from '@/components/blog/BlogPostCard'
import { getBlogPosts } from '@/lib/blog/api'

// Force dynamic rendering to avoid Firestore permission issues during build
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'All Articles | UpTune Wedding Music Blog',
  description: 'Browse all wedding music planning articles, guides, and resources from the UpTune blog.',
}

export default async function ArchivePage() {
  const { posts } = await getBlogPosts({ limit: 100 })

  // Group posts by month
  const postsByMonth = posts.reduce((acc, post) => {
    const date = (() => {
      if (typeof post.publishedAt === 'string') {
        return new Date(post.publishedAt);
      } else if (post.publishedAt && typeof post.publishedAt === 'object' && 'toDate' in post.publishedAt) {
        return (post.publishedAt as any).toDate();
      } else if (post.publishedAt && Object.prototype.toString.call(post.publishedAt) === '[object Date]') {
        return post.publishedAt as Date;
      } else {
        return new Date();
      }
    })()
    const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    
    if (!acc[monthYear]) {
      acc[monthYear] = []
    }
    acc[monthYear].push(post)
    
    return acc
  }, {} as Record<string, typeof posts>)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/blog" className="inline-flex items-center text-white/60 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>
        
        <h1 className="text-4xl font-bold mb-2 gradient-text">Article Archive</h1>
        <p className="text-xl text-white/70">
          Browse all {posts.length} articles from the UpTune blog
        </p>
      </div>

      <div className="space-y-12">
        {Object.entries(postsByMonth).map(([month, monthPosts]) => (
          <div key={month}>
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-5 h-5 text-purple-400" />
              <h2 className="text-2xl font-semibold">{month}</h2>
              <span className="text-white/50">({monthPosts.length} articles)</span>
            </div>
            <div className="grid gap-4">
              {monthPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}