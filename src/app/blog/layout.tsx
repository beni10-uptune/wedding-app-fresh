import { Metadata } from 'next'
import { BlogNavigation } from '@/components/BlogNavigation'

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
      <BlogNavigation />

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