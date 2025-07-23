import { Metadata } from 'next'
import Link from 'next/link'
import { Music, ArrowLeft, Heart, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: {
    template: '%s | UpTune Wedding Music Blog',
    default: 'Wedding Music Planning Guide & Resources | UpTune Blog',
  },
  description: 'Expert wedding music planning guides, curated playlists, and tips to create the perfect soundtrack for your special day.',
  openGraph: {
    type: 'website',
    siteName: 'UpTune Wedding Music Blog',
    images: [
      {
        url: '/images/blog-og.png',
        width: 1200,
        height: 630,
        alt: 'UpTune Wedding Music Blog',
      },
    ],
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 orb orb-purple animate-spin-slow" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 orb orb-blue animate-spin-slow" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] orb orb-purple animate-pulse" />
      </div>

      {/* Blog Header */}
      <header className="sticky top-0 z-50 glass-darker border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">UpTune Blog</h1>
                  <p className="text-xs text-purple-400">Wedding Music Guides</p>
                </div>
              </Link>
              
              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/blog" className="text-white/70 hover:text-white transition-colors">
                  All Articles
                </Link>
                <Link href="/blog/category/music-planning" className="text-white/70 hover:text-white transition-colors">
                  Music Planning
                </Link>
                <Link href="/blog/category/real-weddings" className="text-white/70 hover:text-white transition-colors">
                  Real Weddings
                </Link>
                <Link href="/blog/category/reception-planning" className="text-white/70 hover:text-white transition-colors">
                  Reception Tips
                </Link>
              </nav>
            </div>
            
            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Link href="/" className="text-white/70 hover:text-white transition-colors">
                Back to App
              </Link>
              <Link href="/auth/signup" className="btn-primary">
                Start Free Trial
                <Heart className="w-4 h-4" />
              </Link>
            </div>
            
            {/* Mobile Menu Button */}
            <button className="md:hidden p-2">
              <Menu className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1">
        {children}
      </main>

      {/* Blog Footer */}
      <footer className="relative z-10 glass-darker border-t border-white/10 py-16 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-semibold text-white mb-4">About UpTune</h3>
              <p className="text-white/60 text-sm">
                The modern way to plan your wedding music. Create perfect playlists, collaborate with guests, and export to Spotify.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Popular Articles</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/blog/complete-guide-wedding-music-planning" className="text-white/60 hover:text-purple-400 transition-colors">
                    Complete Wedding Music Guide
                  </Link>
                </li>
                <li>
                  <Link href="/blog/perfect-wedding-timeline" className="text-white/60 hover:text-purple-400 transition-colors">
                    Perfect Wedding Timeline
                  </Link>
                </li>
                <li>
                  <Link href="/blog/10-ways-guest-music-selection" className="text-white/60 hover:text-purple-400 transition-colors">
                    Guest Music Collaboration
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/blog" className="text-white/60 hover:text-purple-400 transition-colors">
                    All Articles
                  </Link>
                </li>
                <li>
                  <Link href="/blog/category/music-planning" className="text-white/60 hover:text-purple-400 transition-colors">
                    Planning Guides
                  </Link>
                </li>
                <li>
                  <Link href="/blog/category/real-weddings" className="text-white/60 hover:text-purple-400 transition-colors">
                    Real Stories
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Stay Updated</h3>
              <p className="text-white/60 text-sm mb-4">
                Get weekly wedding music tips and trends delivered to your inbox.
              </p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="input flex-1 text-sm"
                />
                <Button className="btn-primary" size="sm">Subscribe</Button>
              </form>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 text-center">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-white/60">&copy; 2025 UpTune. All rights reserved.</p>
              <div className="flex items-center gap-6 text-sm text-white/60">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
                <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}