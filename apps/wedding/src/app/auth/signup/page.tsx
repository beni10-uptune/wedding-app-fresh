'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Music } from 'lucide-react'
import Link from 'next/link'
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import { ensureUserDocument, getUserDocument } from '@/lib/auth-utils'
import { formatFirestoreError } from '@/lib/firestore-helpers'
import { getClientPricing, type PricingInfo } from '@/lib/pricing-utils-client'
import { GTMEvents } from '@/components/GoogleTagManager'
import { trackSignUpConversion } from '@/lib/google-ads'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [partnerName, setPartnerName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [pricing, setPricing] = useState<PricingInfo>({ 
    amount: 25, 
    currency: 'USD', 
    symbol: '$', 
    displayPrice: '$25' 
  })
  const router = useRouter()
  
  // Check if user is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if user has completed onboarding (has a wedding)
        try {
          const userData = await getUserDocument(user.uid)
          
          if (userData) {
            // If user just signed up (onboardingCompleted is false), go to create-wedding
            if (userData.onboardingCompleted === false) {
              console.log('New user detected, redirecting to create-wedding')
              router.push('/create-wedding')
            } else {
              console.log('Existing user detected, redirecting to dashboard')
              router.push('/dashboard')
            }
          } else {
            // No user document found, ensure it exists
            console.log('No user document found, creating one...')
            await ensureUserDocument(user)
            router.push('/create-wedding')
          }
        } catch (error) {
          console.error('Error in auth state observer:', error)
          // Default to dashboard on error
          router.push('/dashboard')
        }
      } else {
        setCheckingAuth(false)
      }
    })
    
    return () => unsubscribe()
  }, [router])

  // Get client pricing
  useEffect(() => {
    setPricing(getClientPricing())
  }, [])

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      console.log('Starting signup process...')
      
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      console.log('Firebase Auth user created:', user.uid)

      // Update display name
      await updateProfile(user, { displayName: name })
      console.log('Display name updated')

      // Create user document in Firestore with retry logic
      try {
        await ensureUserDocument(user, {
          displayName: name,
          partnerName: partnerName || undefined
        })
        console.log('User document created successfully')
      } catch (firestoreError) {
        console.error('Firestore error:', firestoreError)
        // Format the error for the user
        throw new Error(formatFirestoreError(firestoreError))
      }

      console.log('User created successfully, redirecting to wedding creation')
      
      // Track signup event
      GTMEvents.signUp('email')
      
      // Track Google Ads conversion
      trackSignUpConversion(user.uid)
      
      // Navigate directly to create-wedding after successful signup
      // This prevents the re-login issue
      router.push('/create-wedding')
    } catch (err) {
      console.error('Signup error:', err)
      const error = err as any
      
      // Check for specific Firebase errors
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please sign in instead.')
      } else if (error.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.')
      } else if (error.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.')
      } else if (error.code === 'auth/network-request-failed') {
        setError('Network error. Please check your internet connection.')
      } else {
        setError(error.message || 'Failed to create account. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setLoading(true)
    setError('')

    try {
      console.log('Starting Google signup...')
      const provider = new GoogleAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)
      const user = userCredential.user
      console.log('Google auth successful:', user.uid)

      // Ensure user document exists with retry logic
      try {
        await ensureUserDocument(user)
        console.log('User document ensured in Firestore')
      } catch (firestoreError) {
        console.error('Firestore error:', firestoreError)
        throw new Error(formatFirestoreError(firestoreError))
      }

      console.log('Google signup successful, redirecting to wedding creation')
      
      // Track signup event
      GTMEvents.signUp('google')
      
      // Track Google Ads conversion
      trackSignUpConversion(user.uid)
      
      // Navigate directly to create-wedding
      router.push('/create-wedding')
    } catch (err) {
      console.error('Google signup error:', err)
      const error = err as any
      
      if (error.code === 'auth/popup-closed-by-user') {
        setError('Sign-in cancelled. Please try again.')
      } else if (error.code === 'auth/popup-blocked') {
        setError('Pop-up blocked. Please allow pop-ups for this site.')
      } else if (error.code === 'auth/network-request-failed') {
        setError('Network error. Please check your internet connection.')
      } else {
        setError(error.message || 'Failed to sign up with Google. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen dark-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen dark-gradient flex items-center justify-center px-4 py-12 relative overflow-hidden">
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
            Start Your Musical Journey
          </h2>
          <p className="text-white/60 text-center mb-3">
            Create your perfect wedding soundtrack together
          </p>
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-3 mb-6 border border-purple-500/30">
            <p className="text-sm text-center font-medium text-white">
              🎉 <span className="text-purple-300">Start Free:</span> 10 songs + 3 guest invites included!
            </p>
          </div>

          {error && (
            <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-6 text-sm border border-red-500/30">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailSignUp} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
                Your Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                placeholder="Jane Doe"
                required
              />
            </div>

            <div>
              <label htmlFor="partnerName" className="block text-sm font-medium text-white/80 mb-2">
                Partner&apos;s Name (optional)
              </label>
              <input
                id="partnerName"
                type="text"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                className="input"
                placeholder="John Doe"
              />
            </div>

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
              <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
                minLength={6}
              />
              <p className="text-xs text-white/50 mt-1">
                Must be at least 6 characters
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Creating Account...' : 'Create Account & Continue'}
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
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="btn-glass w-full"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign up with Google
          </button>

          <div className="text-center mt-8 space-y-3">
            <p className="text-white/60">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-purple-400 font-semibold hover:text-purple-300 transition-colors">
                Sign In
              </Link>
            </p>
            <p className="text-xs text-white/40 max-w-sm mx-auto">
              By creating an account, you agree to our Terms of Service and Privacy Policy. 
              <span className="text-purple-300">Free to start</span> - upgrade to premium for just {pricing.displayPrice} when you need more.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}