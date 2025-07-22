'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db, auth } from '@/lib/firebase'

// Extended interface to support old wedding data structure
interface ExtendedWedding {
  id: string
  coupleName1?: string
  coupleName2?: string
  weddingDate: any // Can be Timestamp or string
  coupleNames?: string[]
  owners: string[]
  paymentStatus?: 'pending' | 'paid' | 'refunded'
  venue?: string
  title?: string
}
import PaymentForm from '@/components/PaymentForm'
import { Heart, Music, Check, ArrowLeft, Lock } from 'lucide-react'
import Link from 'next/link'

export default function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: weddingId } = use(params)
  const [wedding, setWedding] = useState<ExtendedWedding | null>(null)
  const [clientSecret, setClientSecret] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    loadWedding()
  }, [user, weddingId])

  const loadWedding = async () => {
    try {
      const weddingDoc = await getDoc(doc(db, 'weddings', weddingId))
      if (!weddingDoc.exists()) {
        setError('Wedding not found')
        setLoading(false)
        return
      }

      const weddingData = { id: weddingDoc.id, ...weddingDoc.data() } as ExtendedWedding
      
      // Check if user is owner
      if (!weddingData.owners.includes(user?.uid || '')) {
        router.push('/')
        return
      }

      // Check if already paid
      if (weddingData.paymentStatus === 'paid') {
        router.push(`/wedding/${weddingId}`)
        return
      }

      setWedding(weddingData)
      
      // Get auth token
      const token = await auth.currentUser?.getIdToken()
      
      // Create payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          weddingId,
          email: user?.email
        })
      })

      const data = await response.json()
      if (data.clientSecret) {
        setClientSecret(data.clientSecret)
      } else {
        setError('Failed to initialize payment')
      }
    } catch (err) {
      console.error('Error loading wedding:', err)
      setError('Failed to load wedding details')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = async () => {
    try {
      // Update wedding payment status
      await updateDoc(doc(db, 'weddings', weddingId), {
        paymentStatus: 'paid',
        paymentDate: new Date(),
        updatedAt: new Date()
      })

      // Redirect to dashboard
      router.push(`/wedding/${weddingId}`)
    } catch (err) {
      console.error('Error updating payment status:', err)
      setError('Payment successful but failed to update status')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen dark-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading payment details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen dark-gradient flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Oops!</h2>
          <p className="text-white/60 mb-8">{error}</p>
          <Link href="/" className="btn-primary">
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen dark-gradient relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-purple w-96 h-96 -top-48 -right-48"></div>
        <div className="orb orb-blue w-96 h-96 -bottom-48 -left-48"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <Link href={`/wedding/${weddingId}`} className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8">
          <ArrowLeft className="w-5 h-5" />
          Back to Wedding
        </Link>

        {/* Payment Card */}
        <div className="glass rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-white mb-2">
              Complete Your Journey
            </h1>
            <p className="text-white/60">
              One-time payment for lifetime access to your wedding music platform
            </p>
          </div>

          {/* What's Included */}
          <div className="glass-darker rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">What&apos;s Included:</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-400 mt-0.5" />
                <span className="text-white/80">Unlimited playlist creation and editing</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-400 mt-0.5" />
                <span className="text-white/80">Access to 500+ curated wedding songs</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-400 mt-0.5" />
                <span className="text-white/80">Guest collaboration and voting features</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-400 mt-0.5" />
                <span className="text-white/80">Professional DJ export formats</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-400 mt-0.5" />
                <span className="text-white/80">Lifetime access - no recurring fees</span>
              </li>
            </ul>
          </div>

          {/* Wedding Details */}
          {wedding && (
            <div className="text-center mb-8">
              <p className="text-white/60 mb-2">Payment for:</p>
              <h2 className="text-xl font-semibold gradient-text">
                {wedding.coupleNames?.length 
                  ? wedding.coupleNames.join(' & ') 
                  : `${wedding.coupleName1 || 'Partner 1'} & ${wedding.coupleName2 || 'Partner 2'}`
                }&apos;s Wedding
              </h2>
              <p className="text-white/60 text-sm">
                {wedding.weddingDate?.toDate 
                  ? new Date(wedding.weddingDate.toDate()).toLocaleDateString()
                  : new Date(wedding.weddingDate).toLocaleDateString()
                }
              </p>
            </div>
          )}

          {/* Payment Form */}
          {clientSecret && (
            <PaymentForm
              clientSecret={clientSecret}
              onSuccess={handlePaymentSuccess}
              onError={setError}
            />
          )}
        </div>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-6 mt-8 text-sm text-white/40">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            <span>Secure Payment</span>
          </div>
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4" />
            <span>Instant Access</span>
          </div>
        </div>
      </div>
    </div>
  )
}