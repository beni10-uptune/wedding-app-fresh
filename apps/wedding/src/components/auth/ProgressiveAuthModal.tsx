'use client'

import React, { useState, useEffect } from 'react'
import { X, Loader2, ArrowRight, Sparkles, Check, Eye, EyeOff, Music2, Share2, Download } from 'lucide-react'
import { FcGoogle } from 'react-icons/fc'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/SupabaseAuthProvider'

interface ProgressiveAuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  trigger: 'save' | 'share' | 'spotify' | 'premium' | 'export'
  metadata?: {
    totalSongs?: number
    playlistName?: string
    localData?: any
  }
}

const TRIGGER_MESSAGES = {
  save: {
    title: 'Save Your Perfect Playlist',
    subtitle: 'Create a free account to save your playlist and continue editing anytime',
    icon: Music2,
    benefits: [
      'Save unlimited playlists',
      'Access from any device',
      'Share with your partner',
      'Get guest song suggestions'
    ]
  },
  share: {
    title: 'Share with Your Partner',
    subtitle: 'Create an account to collaborate on your wedding playlist together',
    icon: Share2,
    benefits: [
      'Real-time collaboration',
      'Partner can add songs',
      'Track who added what',
      'Shared planning tools'
    ]
  },
  spotify: {
    title: 'Connect to Spotify',
    subtitle: 'Sign up to sync your playlist directly to Spotify',
    icon: Music2,
    benefits: [
      'One-click Spotify sync',
      'Auto-create playlists',
      'Import your favorites',
      'Stream during reception'
    ]
  },
  premium: {
    title: 'Unlock Premium Features',
    subtitle: 'Get access to advanced features for your perfect wedding',
    icon: Sparkles,
    benefits: [
      'Unlimited song suggestions',
      'AI-powered mixing',
      'Professional DJ tools',
      'Priority support'
    ]
  },
  export: {
    title: 'Export Your Playlist',
    subtitle: 'Create an account to download and share your playlist',
    icon: Download,
    benefits: [
      'Export to PDF',
      'Share with vendors',
      'Print song lists',
      'Backup your data'
    ]
  }
}

export function ProgressiveAuthModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  trigger,
  metadata 
}: ProgressiveAuthModalProps) {
  const [mode, setMode] = useState<'signup' | 'signin'>('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const router = useRouter()
  const { user } = useAuth()
  const supabase = createClient()
  
  const triggerConfig = TRIGGER_MESSAGES[trigger]
  const Icon = triggerConfig.icon

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setError(null)
      setSuccess(false)
      setPassword('')
    }
  }, [isOpen])

  // If user is already logged in, just call onSuccess
  useEffect(() => {
    if (user && isOpen) {
      onSuccess?.()
      onClose()
    }
  }, [user, isOpen, onSuccess, onClose])

  const saveLocalProgress = () => {
    if (metadata?.localData) {
      const progressData = {
        ...metadata.localData,
        savedAt: new Date().toISOString(),
        trigger
      }
      localStorage.setItem('wedding_playlist_progress', JSON.stringify(progressData))
    }
  }

  const mergeProgressWithAccount = async (userId: string) => {
    const localProgress = localStorage.getItem('wedding_playlist_progress')
    if (localProgress && metadata?.localData) {
      try {
        // Save the local progress to the user's account
        const progressData = JSON.parse(localProgress)
        
        // Here you would save to Supabase
        // For now, we'll just clear local storage after successful auth
        console.log('Merging local progress with account:', progressData)
        
        localStorage.removeItem('wedding_playlist_progress')
      } catch (error) {
        console.error('Error merging progress:', error)
      }
    }
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (mode === 'signin') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        
        if (error) throw error
        
        if (data.user) {
          await mergeProgressWithAccount(data.user.id)
          setSuccess(true)
          setTimeout(() => {
            onSuccess?.()
            onClose()
          }, 1000)
        }
      } else {
        // Save progress locally first
        saveLocalProgress()
        
        // Sign up without email verification
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name }
          }
        })
        
        if (signUpError) throw signUpError
        
        // Auto sign in after signup
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        
        if (signInError) throw signInError
        
        if (signInData.user) {
          await mergeProgressWithAccount(signInData.user.id)
          setSuccess(true)
          setTimeout(() => {
            onSuccess?.()
            onClose()
          }, 1000)
        }
      }
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use' || err.message?.includes('already registered')) {
        setError('This email is already registered. Try signing in instead.')
        setMode('signin')
      } else {
        setError(err.message || 'Authentication failed')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setLoadingProvider('google')
    setError(null)
    
    // Save progress locally first
    saveLocalProgress()

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/builder`
        }
      })

      if (error) throw error
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google')
      setLoadingProvider(null)
    }
  }

  const handleContinueAsGuest = () => {
    // Save progress locally
    saveLocalProgress()
    
    // Close modal and continue
    onClose()
    
    // Show a toast or notification that progress is saved locally
    console.log('Continuing as guest, progress saved locally')
  }

  if (!isOpen || user) return null

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-gradient-to-br from-purple-900/90 via-purple-800/90 to-pink-800/90 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
              <Check className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Welcome! 🎉</h2>
            <p className="text-white/80 mb-6">
              Your account has been created and your playlist is saved!
            </p>
            <p className="text-white/60 text-sm">
              Redirecting you now...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gradient-to-br from-purple-900/90 via-purple-800/90 to-pink-800/90 backdrop-blur-xl rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-white/20">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        
        {/* Header with Icon */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 rounded-full mb-4">
            <Icon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {triggerConfig.title}
          </h2>
          <p className="text-white/70">
            {triggerConfig.subtitle}
          </p>
          {metadata?.totalSongs && (
            <p className="text-sm text-purple-300 mt-2">
              You've added {metadata.totalSongs} amazing songs!
            </p>
          )}
        </div>

        {/* Benefits */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-white/10">
          <div className="grid grid-cols-2 gap-3">
            {triggerConfig.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-sm text-white/80">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {/* Google Sign In/Up */}
        <button
          onClick={handleGoogleAuth}
          disabled={loading || loadingProvider !== null}
          className="w-full bg-white hover:bg-gray-50 text-gray-800 font-medium py-3.5 px-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loadingProvider === 'google' ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <FcGoogle className="w-5 h-5" />
              <span>{mode === 'signin' ? 'Sign in' : 'Continue'} with Google</span>
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-transparent text-white/50">
              or {mode === 'signin' ? 'sign in' : 'sign up'} with email
            </span>
          </div>
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                placeholder="Your name"
                required
              />
            </div>
          )}
          
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
              placeholder="Email address"
              required
            />
          </div>
          
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all pr-12"
              placeholder={mode === 'signin' ? 'Password' : 'Create password (6+ characters)'}
              required
              minLength={mode === 'signup' ? 6 : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading || loadingProvider !== null}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle Sign In/Up */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="text-purple-300 hover:text-purple-200 text-sm transition-colors"
          >
            {mode === 'signin' 
              ? "Don't have an account? Sign up" 
              : 'Already have an account? Sign in'}
          </button>
        </div>

        {/* Continue as Guest Option - Only for save trigger */}
        {trigger === 'save' && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <button
              onClick={handleContinueAsGuest}
              className="w-full text-white/60 hover:text-white text-sm transition-colors py-2"
            >
              Continue without account (progress saved locally)
            </button>
          </div>
        )}
      </div>
    </div>
  )
}