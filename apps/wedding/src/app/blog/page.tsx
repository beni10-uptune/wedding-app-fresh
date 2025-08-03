import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowRight, Music, Calendar, Users, TrendingUp, Sparkles, Heart } from 'lucide-react'
import { BlogPostCard } from '@/components/blog/BlogPostCard'
import { NewsletterSignup } from '@/components/blog/NewsletterSignup'
import { TrendingSongsWidget } from '@/components/blog/TrendingSongsWidget'
import { getBlogPosts } from '@/lib/blog/api'

export default async function BlogHomePage() {
  const { posts } = await getBlogPosts({ limit: 6, status: 'published' })
  const featuredPost = posts[0]
  const recentPosts = posts.slice(1)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-5xl md:text-6xl font-serif mb-6">
              Your Wedding Music<br />
              <span className="gradient-text">Planning Resource</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Expert guides, curated playlists, and tools to create the perfect soundtrack for your special day
            </p>
          </div>

          {/* Feature Categories */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-16">
            <Link href="/blog/category/music-planning" className="group">
              <div className="card p-6 h-full">
                <Music className="w-8 h-8 text-purple-400 mb-3" />
                <h3 className="font-semibold mb-1">Music Planning</h3>
                <p className="text-sm text-white/60">Step-by-step guides</p>
                <ArrowRight className="w-4 h-4 text-purple-400 mt-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
            <Link href="/blog/category/planning-resources" className="group">
              <div className="card p-6 h-full">
                <Calendar className="w-8 h-8 text-pink-400 mb-3" />
                <h3 className="font-semibold mb-1">Timeline Tips</h3>
                <p className="text-sm text-white/60">Perfect flow & timing</p>
                <ArrowRight className="w-4 h-4 text-pink-400 mt-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
            <Link href="/blog/category/guest-experience" className="group">
              <div className="card p-6 h-full">
                <Users className="w-8 h-8 text-indigo-400 mb-3" />
                <h3 className="font-semibold mb-1">Guest Collaboration</h3>
                <p className="text-sm text-white/60">Involve your guests</p>
                <ArrowRight className="w-4 h-4 text-indigo-400 mt-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
            <Link href="/blog/category/reception-planning" className="group">
              <div className="card p-6 h-full">
                <TrendingUp className="w-8 h-8 text-emerald-400 mb-3" />
                <h3 className="font-semibold mb-1">Reception Tips</h3>
                <p className="text-sm text-white/60">Keep the party going</p>
                <ArrowRight className="w-4 h-4 text-emerald-400 mt-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
            <Link href="/blog/category/music-by-genre" className="group">
              <div className="card p-6 h-full">
                <Sparkles className="w-8 h-8 text-amber-400 mb-3" />
                <h3 className="font-semibold mb-1">Music by Genre</h3>
                <p className="text-sm text-white/60">Hip hop, country & more</p>
                <ArrowRight className="w-4 h-4 text-amber-400 mt-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-12">
            {/* Featured Post */}
            {featuredPost && (
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                  Featured Article
                </h2>
                <BlogPostCard post={featuredPost} featured />
              </div>
            )}

            {/* Recent Posts */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Recent Articles</h2>
              <div className="space-y-6">
                {recentPosts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
            </div>

            {/* View All Link */}
            <div className="text-center">
              <Link href="/blog/archive" className="btn-glass">
                View All Articles
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* CTA Card */}
            <div className="glass-gradient rounded-xl p-6 text-center">
              <Heart className="w-12 h-12 text-pink-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Start Planning Today</h3>
              <p className="text-white/70 mb-4">
                Join thousands of couples creating their perfect wedding soundtrack
              </p>
              <Link href="/auth/signup" className="btn-primary w-full">
                Try UpTune Free
              </Link>
            </div>

            {/* Trending Songs */}
            <div className="card">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                Trending Wedding Songs
              </h3>
              <Suspense fallback={<div className="text-white/60">Loading...</div>}>
                <TrendingSongsWidget />
              </Suspense>
            </div>

            {/* Newsletter */}
            <NewsletterSignup />

            {/* Quick Links */}
            <div className="card">
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/blog/complete-guide-wedding-music-planning" className="text-white/70 hover:text-purple-400 transition-colors">
                    → Complete Music Planning Guide
                  </Link>
                </li>
                <li>
                  <Link href="/blog/perfect-wedding-timeline" className="text-white/70 hover:text-purple-400 transition-colors">
                    → Perfect Wedding Timeline
                  </Link>
                </li>
                <li>
                  <Link href="/blog/10-ways-guest-music-selection" className="text-white/70 hover:text-purple-400 transition-colors">
                    → Get Guests Involved
                  </Link>
                </li>
                <li>
                  <Link href="/blog/wedding-reception-music-guide" className="text-white/70 hover:text-purple-400 transition-colors">
                    → Reception Music Guide
                  </Link>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}