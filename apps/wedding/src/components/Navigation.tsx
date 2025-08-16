'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Music, Menu, X } from 'lucide-react'
import { AuthButtons } from '@/components/auth/AuthButtons'
import { cn } from '@/lib/utils'

export function Navigation() {
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
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Music className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">UpTune</h1>
              <p className="text-xs text-purple-400">Wedding Music</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              className={cn(
                "text-white/70 hover:text-white transition-colors",
                isActive('/') && "text-white"
              )}
            >
              Home
            </Link>
            <Link 
              href="/blog" 
              className={cn(
                "text-white/70 hover:text-white transition-colors",
                pathname.startsWith('/blog') && "text-white"
              )}
            >
              Blog
            </Link>
            <Link 
              href="/builder" 
              className={cn(
                "text-white/70 hover:text-white transition-colors",
                pathname.startsWith('/builder') && "text-white"
              )}
            >
              Builder
            </Link>
            <AuthButtons variant="header" />
          </nav>

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
              href="/"
              className={cn(
                "flex items-center gap-3 py-2 text-white/70 hover:text-white transition-colors",
                isActive('/') && "text-white"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/blog"
              className={cn(
                "flex items-center gap-3 py-2 text-white/70 hover:text-white transition-colors",
                pathname.startsWith('/blog') && "text-white"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/builder"
              className={cn(
                "flex items-center gap-3 py-2 text-white/70 hover:text-white transition-colors",
                pathname.startsWith('/builder') && "text-white"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              Builder
            </Link>
            <div className="pt-4 border-t border-white/10 mt-4">
              <AuthButtons 
                variant="mobile" 
                onClose={() => setMobileMenuOpen(false)}
              />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}