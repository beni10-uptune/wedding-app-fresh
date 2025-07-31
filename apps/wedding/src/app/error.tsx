'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to error tracking service (e.g., Sentry)
      // window.Sentry?.captureException(error)
    } else {
      console.error('Application error:', error)
    }
  }, [error])

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center px-4">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="relative z-10 text-center max-w-md">
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-gradient-to-r from-red-600/20 to-pink-600/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-red-500/20">
            <AlertTriangle className="w-16 h-16 text-red-400" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Oops! Something went wrong</h1>
        <p className="text-white/70 mb-8">
          We hit an unexpected note. Don't worry, your wedding music is safe. Try refreshing the page or head back home.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => reset()}
            className="btn-primary"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Link href="/">
            <Button variant="outline" className="bg-white/5 border-white/20 hover:bg-white/10">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
        </div>
        
        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-left">
            <p className="text-sm text-red-400 font-mono">{error.message}</p>
          </div>
        )}
      </div>
    </div>
  )
}