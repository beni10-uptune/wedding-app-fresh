import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import { BlogPostCard } from '@/components/blog/BlogPostCard'
import { getBlogPosts } from '@/lib/blog/api'

export const metadata: Metadata = {
  title: 'All Articles | UpTune Wedding Music Blog',
  description: 'Browse all wedding music planning articles, guides, and resources from the UpTune blog.',
}

export default async function ArchivePage() {
  const posts = await getBlogPosts({ limit: 100 })

  // Group posts by month
  const postsByMonth = posts.reduce((acc, post) => {
    const date = new Date(post.publishedAt)
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
        <Link href="/blog" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>
        
        <h1 className="text-4xl font-bold mb-3">All Articles</h1>
        <p className="text-xl text-gray-600">
          Browse our complete collection of wedding music planning resources
        </p>
      </div>

      <div className="max-w-4xl">
        {Object.entries(postsByMonth).map(([monthYear, monthPosts]) => (
          <div key={monthYear} className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-purple-600" />
              {monthYear}
            </h2>
            <div className="space-y-4">
              {monthPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No articles published yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}