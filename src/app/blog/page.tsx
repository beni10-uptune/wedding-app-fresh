import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowRight, Music, Calendar, Users, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BlogPostCard } from '@/components/blog/BlogPostCard'
import { NewsletterSignup } from '@/components/blog/NewsletterSignup'
import { TrendingSongsWidget } from '@/components/blog/TrendingSongsWidget'
import { getBlogPosts } from '@/lib/blog/api'

export default async function BlogHomePage() {
  const posts = await getBlogPosts({ limit: 6, status: 'published' })
  const featuredPost = posts[0]
  const recentPosts = posts.slice(1)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Your Wedding Music Planning Resource
          </h1>
          <p className="text-xl text-gray-600">
            Expert guides, curated playlists, and tools to create the perfect soundtrack for your special day
          </p>
        </div>

        {/* Feature Categories */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Link href="/blog/category/music-planning" className="group">
            <div className="p-6 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <Music className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-semibold mb-1">Music Planning</h3>
              <p className="text-sm text-gray-600">Step-by-step guides</p>
              <ArrowRight className="w-4 h-4 text-purple-600 mt-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
          <Link href="/blog/category/timeline-tips" className="group">
            <div className="p-6 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors">
              <Calendar className="w-8 h-8 text-pink-600 mb-3" />
              <h3 className="font-semibold mb-1">Timeline Tips</h3>
              <p className="text-sm text-gray-600">Perfect flow & timing</p>
              <ArrowRight className="w-4 h-4 text-pink-600 mt-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
          <Link href="/blog/category/guest-collaboration" className="group">
            <div className="p-6 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
              <Users className="w-8 h-8 text-indigo-600 mb-3" />
              <h3 className="font-semibold mb-1">Guest Collaboration</h3>
              <p className="text-sm text-gray-600">Involve your guests</p>
              <ArrowRight className="w-4 h-4 text-indigo-600 mt-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
          <Link href="/blog/category/trends" className="group">
            <div className="p-6 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <TrendingUp className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="font-semibold mb-1">Trends & Ideas</h3>
              <p className="text-sm text-gray-600">Latest wedding music</p>
              <ArrowRight className="w-4 h-4 text-green-600 mt-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Featured Post */}
          {featuredPost && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Featured Guide</h2>
              <BlogPostCard post={featuredPost} featured />
            </section>
          )}

          {/* Recent Posts */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Recent Articles</h2>
            <div className="grid gap-6">
              {recentPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/blog/archive">
                <Button variant="outline" size="lg">
                  View All Articles
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          {/* CTA */}
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-6 rounded-lg text-white">
            <h3 className="text-xl font-bold mb-2">Start Planning Your Music</h3>
            <p className="mb-4 text-purple-100">
              Join thousands of couples creating their perfect wedding soundtrack
            </p>
            <Link href="/signup">
              <Button variant="secondary" className="w-full">
                Start Free Trial
              </Button>
            </Link>
          </div>

          {/* Trending Songs */}
          <Suspense fallback={<div className="animate-pulse bg-gray-100 h-96 rounded-lg" />}>
            <TrendingSongsWidget />
          </Suspense>

          {/* Newsletter */}
          <NewsletterSignup />

          {/* Quick Links */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-4">Quick Tools</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/blog/music-calculator" className="text-purple-600 hover:text-purple-700 flex items-center">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Music Calculator
                </Link>
              </li>
              <li>
                <Link href="/blog/playlist-quiz" className="text-purple-600 hover:text-purple-700 flex items-center">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Style Quiz
                </Link>
              </li>
              <li>
                <Link href="/blog/timeline-builder" className="text-purple-600 hover:text-purple-700 flex items-center">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Timeline Builder
                </Link>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}