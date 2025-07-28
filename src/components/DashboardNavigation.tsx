'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Music, Settings, LogOut, Menu, X, Home, Plus } from 'lucide-react'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { cn } from '@/lib/utils'

interface DashboardNavigationProps {
  activeWeddingId?: string
  userName?: string
}

export function DashboardNavigation({ activeWeddingId, userName }: DashboardNavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

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

  return (
    <header className="glass sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center animate-pulse-slow">
              <Music className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">UpTune</h1>
              <p className="text-sm gradient-text font-medium">for Weddings</p>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {activeWeddingId && (
              <Link 
                href={`/wedding/${activeWeddingId}/settings`}
                className="text-white/60 hover:text-white transition-colors"
              >
                <Settings className="w-5 h-5" />
              </Link>
            )}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
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
            {userName && (
              <div className="text-white/60 text-sm mb-4">
                Signed in as <span className="text-white">{userName}</span>
              </div>
            )}
            <Link
              href="/dashboard"
              className={cn(
                "flex items-center gap-3 py-2 text-white/70 hover:text-white transition-colors",
                pathname === '/dashboard' && "text-white"
              )}
            >
              <Home className="w-5 h-5" />
              Dashboard
            </Link>
            {activeWeddingId && (
              <Link
                href={`/wedding/${activeWeddingId}/settings`}
                className={cn(
                  "flex items-center gap-3 py-2 text-white/70 hover:text-white transition-colors",
                  pathname.includes('/settings') && "text-white"
                )}
              >
                <Settings className="w-5 h-5" />
                Wedding Settings
              </Link>
            )}
            <Link
              href="/create-wedding"
              className="flex items-center gap-3 py-2 text-white/70 hover:text-white transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create New Wedding
            </Link>
            <div className="border-t border-white/10 pt-4">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 py-2 text-white/70 hover:text-white transition-colors w-full text-left"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}