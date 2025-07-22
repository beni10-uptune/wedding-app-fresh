'use client'

import { useState, useEffect, use } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore'
import { db, auth } from '@/lib/firebase'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import Link from 'next/link'
import { Heart, Users, AlertCircle } from 'lucide-react'

interface Wedding {
  id: string
  coupleNames: string[]
  owners: string[]
  weddingDate: any
  venue?: string
}

export default function CoOwnerJoinPage({ params }: { params: Promise<{ weddingId: string }> }) {
  const { weddingId } = use(params)
  const [wedding, setWedding] = useState<Wedding | null>(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const inviteCode = searchParams.get('code')

  useEffect(() => {
    loadWedding()
  }, [weddingId])

  useEffect(() => {
    // If user is already signed in and is already an owner, redirect to dashboard
    if (user && wedding?.owners.includes(user.uid)) {
      router.push('/dashboard')
    }
  }, [user, wedding])

  const loadWedding = async () => {
    try {
      const weddingDoc = await getDoc(doc(db, 'weddings', weddingId))
      if (!weddingDoc.exists()) {
        setError('Wedding not found')
        return
      }

      const weddingData = { id: weddingDoc.id, ...weddingDoc.data() } as Wedding
      setWedding(weddingData)
    } catch (error) {
      console.error('Error loading wedding:', error)
      setError('Failed to load wedding details')
    } finally {
      setLoading(false)
    }
  }

  const handleJoinAsCoOwner = async () => {
    if (!user || !wedding) return

    setJoining(true)
    setError('')

    try {
      // Add user as co-owner
      await updateDoc(doc(db, 'weddings', weddingId), {
        owners: arrayUnion(user.uid)
      })

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('Error joining as co-owner:', error)
      setError('Failed to join as co-owner')
      setJoining(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      // After sign in, the useEffect will handle the redirect
    } catch (error) {
      console.error('Error signing in:', error)
      setError('Failed to sign in. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen dark-gradient flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error && !wedding) {
    return (
      <div className="min-h-screen dark-gradient flex items-center justify-center p-4">
        <div className="glass-gradient rounded-3xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Oops!</h2>
          <p className="text-white/70 mb-6">{error}</p>
          <Link href="/" className="btn-primary">
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  if (!wedding) return null

  return (
    <div className="min-h-screen dark-gradient relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-purple w-96 h-96 -top-48 -right-48 animate-float"></div>
        <div className="orb orb-pink w-96 h-96 top-1/2 -left-48 animate-float-delayed"></div>
        <div className="orb orb-blue w-96 h-96 -bottom-48 right-1/3 animate-float-slow"></div>
      </div>

      <div className="glass-gradient rounded-3xl p-8 md:p-12 max-w-lg w-full relative z-10">
        <div className="text-center">
          {/* Logo */}
          <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-slow">
            <Heart className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-3xl md:text-4xl font-serif font-bold gradient-text mb-4">
            You're Invited to Co-Plan!
          </h1>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              {wedding.coupleNames.join(' & ')}'s Wedding
            </h2>
            {wedding.venue && (
              <p className="text-white/70">
                {wedding.venue} • {new Date(wedding.weddingDate.toDate()).toLocaleDateString()}
              </p>
            )}
          </div>

          <div className="bg-white/10 rounded-xl p-6 mb-8">
            <Users className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <p className="text-white/80">
              Join as a co-owner to collaborate on the wedding music, manage guests, and create the perfect celebration together!
            </p>
          </div>

          {!user ? (
            <>
              <p className="text-white/60 mb-6">
                Sign in or create an account to accept this invitation
              </p>
              <button
                onClick={handleGoogleSignIn}
                className="btn-primary w-full mb-4"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </>
          ) : (
            <>
              <p className="text-white/60 mb-6">
                Signed in as {user.email}
              </p>
              <button
                onClick={handleJoinAsCoOwner}
                disabled={joining}
                className="btn-primary w-full"
              >
                {joining ? 'Joining...' : 'Accept & Join as Co-Owner'}
              </button>
            </>
          )}

          {error && (
            <p className="text-red-400 text-sm mt-4">{error}</p>
          )}
        </div>
      </div>
    </div>
  )
}