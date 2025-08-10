'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Music, Menu, X, Home, BookOpen, LogIn, UserPlus, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { cn } from '@/lib/utils'

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user } = useAuth()

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      // Error is logged in auth context
    }
  }

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
            {user ? (
              <>
                <Link 
                  href="/builder" 
                  className={cn(
                    "text-white/70 hover:text-white transition-colors",
                    pathname.startsWith('/builder') || pathname.startsWith('/wedding') && "text-white"
                  )}
                >
                  Builder
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-white/70 hover:text-white"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="btn-primary" size="sm">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
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
            >
              <Home className="w-5 h-5" />
              Home
            </Link>
            <Link
              href="/blog"
              className={cn(
                "flex items-center gap-3 py-2 text-white/70 hover:text-white transition-colors",
                pathname.startsWith('/blog') && "text-white"
              )}
            >
              <BookOpen className="w-5 h-5" />
              Blog
            </Link>
            {user ? (
              <>
                <Link
                  href="/builder"
                  className={cn(
                    "flex items-center gap-3 py-2 text-white/70 hover:text-white transition-colors",
                    pathname.startsWith('/builder') || pathname.startsWith('/wedding') && "text-white"
                  )}
                >
                  <Music className="w-5 h-5" />
                  Builder
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 py-2 text-white/70 hover:text-white transition-colors w-full text-left"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="flex items-center gap-3 py-2 text-white/70 hover:text-white transition-colors"
                >
                  <LogIn className="w-5 h-5" />
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="block"
                >
                  <Button className="btn-primary w-full">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Get Started Free
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}