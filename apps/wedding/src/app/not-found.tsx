import Link from 'next/link'
import { Music, Home, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center px-4">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-spin-slow" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full blur-3xl animate-spin-slow" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="relative z-10 text-center max-w-md">
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
            <Search className="w-16 h-16 text-purple-400" />
          </div>
        </div>
        
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4 gradient-text">Page Not Found</h2>
        <p className="text-white/70 mb-8">
          Looks like this page hit a wrong note. Let's get you back to making beautiful wedding music.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="btn-primary">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="bg-white/5 border-white/20 hover:bg-white/10">
              <Music className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}