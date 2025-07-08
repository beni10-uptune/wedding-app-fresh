'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { getInvitationByCode, acceptInvitation } from '@/lib/invitations'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Wedding, Invitation } from '@/types/wedding'
import Image from 'next/image'
import Link from 'next/link'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export default function GuestJoinPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ weddingId: string }>,
  searchParams: Promise<{ code?: string }>
}) {
  const [invitation, setInvitation] = useState<Invitation | null>(null)
  const [wedding, setWedding] = useState<Wedding | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [joining, setJoining] = useState(false)
  const [resolvedParams, setResolvedParams] = useState<{ weddingId: string } | null>(null)
  const [resolvedSearchParams, setResolvedSearchParams] = useState<{ code?: string } | null>(null)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    params.then(setResolvedParams)
    searchParams.then(setResolvedSearchParams)
  }, [params, searchParams])

  useEffect(() => {
    const loadInvitation = async () => {
      if (!resolvedParams || !resolvedSearchParams) return
      
      try {
        if (!resolvedSearchParams.code) {
          setError('Invalid invitation link')
          setLoading(false)
          return
        }

        // Get invitation by code
        const inv = await getInvitationByCode(resolvedSearchParams.code)
        if (!inv) {
          setError('Invitation not found or has expired')
          setLoading(false)
          return
        }

        setInvitation(inv)

        // Load wedding details
        const weddingDoc = await getDoc(doc(db, 'weddings', resolvedParams.weddingId))
        if (weddingDoc.exists()) {
          setWedding({ id: weddingDoc.id, ...weddingDoc.data() } as Wedding)
        }

        setLoading(false)
      } catch (err) {
        console.error('Error loading invitation:', err)
        setError('Failed to load invitation')
        setLoading(false)
      }
    }

    if (resolvedParams && resolvedSearchParams) {
      loadInvitation()
    }
  }, [resolvedParams, resolvedSearchParams])

  const handleJoinWithGoogle = async () => {
    try {
      setJoining(true)
      setError('')

      if (!invitation) {
        setError('No valid invitation')
        return
      }

      let userId = user?.uid

      // If not logged in, sign in with Google
      if (!userId) {
        const provider = new GoogleAuthProvider()
        const result = await signInWithPopup(auth, provider)
        userId = result.user.uid
      }

      // Accept the invitation
      await acceptInvitation(invitation.id, userId)

      // Redirect to guest interface
      router.push(`/guest/${resolvedParams?.weddingId}`)
    } catch (err) {
      console.error('Error joining wedding:', err)
      setError((err as Error).message || 'Failed to join wedding')
      setJoining(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invitation...</p>
        </div>
      </div>
    )
  }

  if (error && !invitation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="max-w-md mx-auto pt-20 px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-8 text-white text-center">
            <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2">You&apos;re Invited!</h1>
            {wedding && (
              <p className="text-white/90">
                {wedding.coupleNames.join(' & ')}&apos;s Wedding
              </p>
            )}
          </div>

          {/* Invitation details */}
          <div className="p-8">
            {invitation && (
              <div className="mb-6 text-center">
                <p className="text-gray-600 mb-2">You&apos;ve been invited as a</p>
                <span className="inline-block px-4 py-2 bg-purple-100 text-purple-700 font-medium rounded-full capitalize">
                  {invitation.role}
                </span>
              </div>
            )}

            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Help create the perfect playlist!</h3>
              <p className="text-gray-600 text-sm">
                Join to suggest songs, vote on favorites, and help craft a memorable soundtrack for this special day.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleJoinWithGoogle}
              disabled={joining}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {joining ? (
                <>
                  <div className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="font-medium text-gray-700">Joining...</span>
                </>
              ) : (
                <>
                  <Image
                    src="https://www.google.com/favicon.ico"
                    alt="Google"
                    width={20}
                    height={20}
                  />
                  <span className="font-medium text-gray-700">Continue with Google</span>
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              By joining, you&apos;ll be able to suggest songs and vote on the wedding playlist
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600 mt-8 mb-4">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-purple-600 hover:text-purple-700 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}