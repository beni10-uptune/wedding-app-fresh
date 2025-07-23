import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { BlogPostCard } from '@/components/blog/BlogPostCard'
import { NewsletterSignup } from '@/components/blog/NewsletterSignup'
import { getBlogPosts } from '@/lib/blog/api'

const categories = {
  'music-planning': {
    name: 'Music Planning',
    description: 'Comprehensive guides for planning every musical moment of your wedding day',
    color: 'from-purple-600 to-pink-600',
  },
  'planning-resources': {
    name: 'Planning Resources',
    description: 'Tools, timelines, and tips to organize your wedding music perfectly',
    color: 'from-blue-600 to-purple-600',
  },
  'guest-experience': {
    name: 'Guest Experience',
    description: 'Create an inclusive celebration that gets everyone on the dance floor',
    color: 'from-green-600 to-blue-600',
  },
  'real-weddings': {
    name: 'Real Weddings',
    description: 'Success stories and inspiration from real couples using UpTune',
    color: 'from-pink-600 to-red-600',
  },
  'reception-planning': {
    name: 'Reception Planning',
    description: 'Master the art of reception music from cocktail hour to last dance',
    color: 'from-indigo-600 to-purple-600',
  },
}

interface CategoryPageProps {
  params: Promise<{
    category: string
  }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params
  const category = categories[categorySlug as keyof typeof categories]
  
  if (!category) {
    return {
      title: 'Category Not Found',
    }
  }

  return {
    title: `${category.name} | UpTune Wedding Music Blog`,
    description: category.description,
    openGraph: {
      title: `${category.name} - Wedding Music Resources`,
      description: category.description,
    },
  }
}

export async function generateStaticParams() {
  return Object.keys(categories).map((category) => ({
    category,
  }))
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params
  const categoryData = categories[categorySlug as keyof typeof categories]
  
  if (!categoryData) {
    notFound()
  }

  const posts = await getBlogPosts({ 
    category: categoryData.name,
    limit: 20 
  })

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-12">
        <Link href="/blog" className="inline-flex items-center text-white/60 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>
        
        <div className={`glass-gradient bg-gradient-to-r ${categoryData.color} rounded-xl p-8`}>
          <h1 className="text-4xl font-bold mb-3">{categoryData.name}</h1>
          <p className="text-xl opacity-90">{categoryData.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {posts.length > 0 ? (
            <>
              <h2 className="text-2xl font-bold mb-6">Articles in {categoryData.name}</h2>
              <div className="grid gap-6">
                {posts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 glass rounded-xl">
              <p className="text-white/60 mb-4">No articles in this category yet.</p>
              <Link href="/blog" className="text-purple-400 hover:text-purple-300 transition-colors">
                Browse all articles
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          {/* Other Categories */}
          <div className="card">
            <h3 className="font-semibold mb-4">Explore Other Categories</h3>
            <div className="space-y-2">
              {Object.entries(categories).map(([slug, category]) => {
                if (slug === categorySlug) return null
                return (
                  <Link
                    key={slug}
                    href={`/blog/category/${slug}`}
                    className="block p-3 glass rounded-lg hover:bg-white/20 transition-all"
                  >
                    <p className="font-medium">{category.name}</p>
                    <p className="text-sm text-white/60">{category.description}</p>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Newsletter */}
          <NewsletterSignup />
        </aside>
      </div>
    </div>
  )
}