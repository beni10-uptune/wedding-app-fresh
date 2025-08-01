'use client'

import { useState } from 'react'
import { ArrowRight, Music } from 'lucide-react'
import Link from 'next/link'
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import { getSmartRedirectPath } from '@/lib/auth-helpers'
import { ensureUserDocument } from '@/lib/auth-utils'
import { formatFirestoreError } from '@/lib/firestore-helpers'
import { GTMEvents } from '@/components/GoogleTagManager'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      
      // Ensure user document exists
      try {
        await ensureUserDocument(userCredential.user)
      } catch (firestoreError) {
        console.error('Error ensuring user document:', firestoreError)
        // Continue anyway - user is authenticated
      }
      
      // Track login event
      GTMEvents.login('email')
      
      const redirectPath = await getSmartRedirectPath(userCredential.user)
      router.push(redirectPath)
    } catch (err: any) {
      console.error('Login error:', err)
      
      // Provide user-friendly error messages
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email. Please sign up first.')
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.')
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.')
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.')
      } else if (err.code === 'auth/network-request-failed') {
        setError('Network error. Please check your internet connection.')
      } else {
        setError(formatFirestoreError(err))
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError('')

    try {
      const provider = new GoogleAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)
      
      // Ensure user document exists
      try {
        await ensureUserDocument(userCredential.user)
      } catch (firestoreError) {
        console.error('Error ensuring user document:', firestoreError)
        // Continue anyway - user is authenticated
      }
      
      // Track login event
      GTMEvents.login('google')
      
      const redirectPath = await getSmartRedirectPath(userCredential.user)
      router.push(redirectPath)
    } catch (err: any) {
      console.error('Google login error:', err)
      
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in cancelled. Please try again.')
      } else if (err.code === 'auth/popup-blocked') {
        setError('Pop-up blocked. Please allow pop-ups for this site.')
      } else if (err.code === 'auth/network-request-failed') {
        setError('Network error. Please check your internet connection.')
      } else {
        setError(formatFirestoreError(err))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen dark-gradient flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-purple w-96 h-96 -top-48 -right-48"></div>
        <div className="orb orb-blue w-96 h-96 -bottom-48 -left-48"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
            <Music className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">UpTune</h1>
            <p className="text-xs text-purple-400">for Weddings</p>
          </div>
        </Link>

        <div className="glass rounded-2xl p-8">
          <h2 className="text-3xl font-serif font-bold text-center mb-2">
            Welcome Back
          </h2>
          <p className="text-white/60 text-center mb-8">
            Sign in to continue your musical journey
          </p>

          {error && (
            <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-6 text-sm border border-red-500/30">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-white/80">
                  Password
                </label>
                <Link 
                  href="/auth/forgot-password" 
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 bg-slate-900 text-sm text-white/60">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="btn-glass w-full"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>

          <p className="text-center mt-8 text-white/60">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-purple-400 font-semibold hover:text-purple-300 transition-colors">
              Start Your Journey
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}