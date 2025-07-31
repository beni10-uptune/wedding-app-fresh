'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Music, Heart, Menu, X, BookOpen, FileText, Calendar, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function BlogNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const isActive = (path: string) => pathname === path

  return (
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
              <Link 
                href="/blog" 
                className={cn(
                  "text-white/70 hover:text-white transition-colors",
                  isActive('/blog') && "text-white"
                )}
              >
                All Articles
              </Link>
              <Link 
                href="/blog/category/music-planning" 
                className={cn(
                  "text-white/70 hover:text-white transition-colors",
                  pathname.includes('music-planning') && "text-white"
                )}
              >
                Music Planning
              </Link>
              <Link 
                href="/blog/category/real-weddings" 
                className={cn(
                  "text-white/70 hover:text-white transition-colors",
                  pathname.includes('real-weddings') && "text-white"
                )}
              >
                Real Weddings
              </Link>
              <Link 
                href="/blog/category/reception-planning" 
                className={cn(
                  "text-white/70 hover:text-white transition-colors",
                  pathname.includes('reception-planning') && "text-white"
                )}
              >
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
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass-darker border-b border-white/10">
          <nav className="container mx-auto px-4 py-4 space-y-4">
            <Link
              href="/blog"
              className={cn(
                "flex items-center gap-3 py-2 text-white/70 hover:text-white transition-colors",
                isActive('/blog') && "text-white"
              )}
            >
              <BookOpen className="w-5 h-5" />
              All Articles
            </Link>
            <Link
              href="/blog/category/music-planning"
              className={cn(
                "flex items-center gap-3 py-2 text-white/70 hover:text-white transition-colors",
                pathname.includes('music-planning') && "text-white"
              )}
            >
              <FileText className="w-5 h-5" />
              Music Planning
            </Link>
            <Link
              href="/blog/category/real-weddings"
              className={cn(
                "flex items-center gap-3 py-2 text-white/70 hover:text-white transition-colors",
                pathname.includes('real-weddings') && "text-white"
              )}
            >
              <Users className="w-5 h-5" />
              Real Weddings
            </Link>
            <Link
              href="/blog/category/reception-planning"
              className={cn(
                "flex items-center gap-3 py-2 text-white/70 hover:text-white transition-colors",
                pathname.includes('reception-planning') && "text-white"
              )}
            >
              <Calendar className="w-5 h-5" />
              Reception Tips
            </Link>
            <div className="border-t border-white/10 pt-4">
              <Link
                href="/"
                className="flex items-center gap-3 py-2 text-white/70 hover:text-white transition-colors"
              >
                <Music className="w-5 h-5" />
                Back to App
              </Link>
              <Link
                href="/auth/signup"
                className="block mt-4"
              >
                <Button className="btn-primary w-full">
                  <Heart className="w-4 h-4 mr-2" />
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}