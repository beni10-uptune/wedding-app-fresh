import { Metadata } from 'next'
import Link from 'next/link'
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
    <div className="min-h-screen bg-white">
      {/* Blog Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/blog" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                UpTune Blog
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/blog/category/music-planning" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Music Planning
                </Link>
                <Link href="/blog/category/real-weddings" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Real Weddings
                </Link>
                <Link href="/blog/category/tips-trends" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Tips & Trends
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost">Back to App</Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Blog Footer */}
      <footer className="bg-gray-50 border-t mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">About UpTune</h3>
              <p className="text-gray-600 text-sm">
                The modern way to plan your wedding music. Create perfect playlists, collaborate with guests, and export to Spotify.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Popular Posts</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/blog/complete-wedding-music-guide" className="text-gray-600 hover:text-gray-900">
                    Complete Wedding Music Guide
                  </Link>
                </li>
                <li>
                  <Link href="/blog/perfect-wedding-timeline" className="text-gray-600 hover:text-gray-900">
                    Perfect Wedding Timeline
                  </Link>
                </li>
                <li>
                  <Link href="/blog/guest-music-collaboration" className="text-gray-600 hover:text-gray-900">
                    Guest Music Collaboration
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/blog/music-calculator" className="text-gray-600 hover:text-gray-900">
                    Music Calculator
                  </Link>
                </li>
                <li>
                  <Link href="/blog/playlist-templates" className="text-gray-600 hover:text-gray-900">
                    Playlist Templates
                  </Link>
                </li>
                <li>
                  <Link href="/blog/trending-songs" className="text-gray-600 hover:text-gray-900">
                    Trending Songs
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Stay Updated</h3>
              <p className="text-gray-600 text-sm mb-4">
                Get weekly wedding music tips and trends delivered to your inbox.
              </p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 border rounded-md text-sm"
                />
                <Button size="sm">Subscribe</Button>
              </form>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
            <p>&copy; 2025 UpTune. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}