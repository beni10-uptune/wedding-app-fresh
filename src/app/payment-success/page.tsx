'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Heart, CheckCircle, Music } from 'lucide-react'
import Link from 'next/link'
import confetti from 'canvas-confetti'
import { ErrorBoundary } from '@/components/ErrorBoundary'

function PaymentSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    try {
      // Check if we have Stripe redirect parameters
      const paymentIntentSecret = searchParams.get('payment_intent_client_secret')
      const paymentIntent = searchParams.get('payment_intent')
      
      // Only trigger confetti if we have a valid payment redirect
      if (paymentIntentSecret || paymentIntent) {
        // Trigger confetti only on client side
        if (typeof window !== 'undefined' && typeof confetti === 'function') {
          try {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#a855f7', '#ec4899', '#8b5cf6']
            })
          } catch (confettiError) {
            console.error('Confetti error:', confettiError)
          }
        }
      }
    } catch (error) {
      console.error('Error in payment success page:', error)
    }

    // Countdown redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push('/dashboard')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router, searchParams])

  return (
    <div className="min-h-screen dark-gradient relative overflow-hidden flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-purple w-96 h-96 -top-48 -right-48"></div>
        <div className="orb orb-blue w-96 h-96 -bottom-48 -left-48"></div>
      </div>

      <div className="relative z-10 text-center px-4">
        <div className="glass rounded-2xl p-12 max-w-md mx-auto">
          <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="w-16 h-16 text-white" />
          </div>

          <h1 className="text-4xl font-serif font-bold text-white mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-xl text-white/80 mb-8">
            Welcome to your musical journey
          </p>

          <div className="glass-darker rounded-xl p-6 mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-pink-400" />
              <h2 className="text-lg font-semibold text-white">What&apos;s Next?</h2>
            </div>
            <p className="text-white/70">
              Your wedding platform is ready! Start building your perfect playlists, 
              invite guests to collaborate, and create the soundtrack to your special day.
            </p>
          </div>

          <div className="space-y-4">
            <Link href="/dashboard" className="btn-primary w-full">
              <Music className="w-5 h-5" />
              Go to Dashboard
            </Link>
            
            <p className="text-sm text-white/50">
              Redirecting in {countdown} seconds...
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={
        <div className="min-h-screen dark-gradient flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/60">Loading...</p>
          </div>
        </div>
      }>
        <PaymentSuccessContent />
      </Suspense>
    </ErrorBoundary>
  )
}