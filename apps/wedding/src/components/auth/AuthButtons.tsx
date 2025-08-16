'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/components/providers/SupabaseAuthProvider'
import { User, Loader2, LogOut } from 'lucide-react'
import { useState } from 'react'

interface AuthButtonsProps {
  variant?: 'header' | 'mobile' | 'cta'
  redirectTo?: string
  className?: string
  onClose?: () => void
}

export function AuthButtons({ 
  variant = 'header', 
  redirectTo,
  className = '',
  onClose
}: AuthButtonsProps) {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [signingOut, setSigningOut] = useState(false)
  
  // Determine where to redirect after auth
  const getRedirectPath = () => {
    if (redirectTo) return redirectTo
    
    // Smart redirect based on current page
    if (pathname === '/') return '/builder'
    if (pathname.startsWith('/blog')) return '/builder'
    if (pathname.startsWith('/pricing')) return '/builder'
    if (pathname.startsWith('/help')) return '/builder'
    
    // Default to current page
    return pathname
  }

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      await signOut()
      router.push('/')
      onClose?.()
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setSigningOut(false)
    }
  }
  
  const redirectPath = getRedirectPath()
  const signUpUrl = `/auth/signup?redirectTo=${encodeURIComponent(redirectPath)}`
  const signInUrl = `/auth/login?redirectTo=${encodeURIComponent(redirectPath)}`
  
  if (loading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Loader2 className="w-5 h-5 animate-spin text-white/60" />
      </div>
    )
  }
  
  if (user) {
    // User is logged in
    if (variant === 'mobile') {
      return (
        <div className={`flex flex-col gap-2 ${className}`}>
          <Link 
            href="/builder"
            className="flex items-center gap-2 px-4 py-2 text-white/70 hover:text-white transition-colors"
            onClick={onClose}
          >
            <User className="w-5 h-5" />
            <span>My Dashboard</span>
          </Link>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex items-center gap-2 px-4 py-2 text-white/70 hover:text-white transition-colors text-left"
          >
            {signingOut ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <LogOut className="w-5 h-5" />
            )}
            <span>Sign Out</span>
          </button>
        </div>
      )
    }
    
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <Link 
          href="/builder"
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
        >
          <User className="w-5 h-5" />
          <span className="hidden sm:inline">Dashboard</span>
        </Link>
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="text-white/70 hover:text-white transition-colors"
        >
          {signingOut ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            'Sign Out'
          )}
        </button>
      </div>
    )
  }
  
  // User is not logged in
  if (variant === 'mobile') {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        <Link 
          href={signInUrl}
          className="text-white/70 hover:text-white transition-colors px-4 py-2"
          onClick={onClose}
        >
          Sign In
        </Link>
        <Link 
          href={signUpUrl}
          className="btn-primary text-center"
          onClick={onClose}
        >
          Get Started Free
        </Link>
      </div>
    )
  }
  
  if (variant === 'cta') {
    return (
      <div className={`flex flex-col sm:flex-row gap-4 ${className}`}>
        <Link 
          href={signUpUrl}
          className="btn-primary text-center"
        >
          Get Started Free
        </Link>
        <Link 
          href={signInUrl}
          className="text-center text-white/70 hover:text-white transition-colors"
        >
          Already have an account? Sign in
        </Link>
      </div>
    )
  }
  
  // Default header variant
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <Link 
        href={signInUrl}
        className="text-white/70 hover:text-white transition-colors"
      >
        Sign In
      </Link>
      <Link 
        href={signUpUrl}
        className="btn-primary"
      >
        Get Started
      </Link>
    </div>
  )
}

// Helper component for CTAs that should trigger auth
export function AuthCTA({ 
  children, 
  className = '',
  redirectTo,
  action = 'signup' // 'signup' | 'signin'
}: {
  children: React.ReactNode
  className?: string
  redirectTo?: string
  action?: 'signup' | 'signin'
}) {
  const pathname = usePathname()
  const targetPath = redirectTo || pathname
  const url = action === 'signup' 
    ? `/auth/signup?redirectTo=${encodeURIComponent(targetPath)}`
    : `/auth/login?redirectTo=${encodeURIComponent(targetPath)}`
    
  return (
    <Link href={url} className={className}>
      {children}
    </Link>
  )
}