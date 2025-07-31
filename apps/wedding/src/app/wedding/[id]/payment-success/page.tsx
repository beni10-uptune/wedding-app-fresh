'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { Crown, CheckCircle2, Music, Users, Download, Share2, Sparkles, Heart, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import confetti from 'canvas-confetti'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/contexts/AuthContext'

export default function PaymentSuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: weddingId } = use(params)
  const [wedding, setWedding] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Trigger confetti on mount
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#a855f7', '#ec4899', '#8b5cf6', '#d946ef', '#f97316']
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#a855f7', '#ec4899', '#8b5cf6', '#d946ef', '#f97316']
      })
    }, 250)

    loadWedding()
  }, [])

  const loadWedding = async () => {
    try {
      const weddingDoc = await getDoc(doc(db, 'weddings', weddingId))
      if (weddingDoc.exists()) {
        setWedding({ id: weddingDoc.id, ...weddingDoc.data() })
      }
    } catch (error) {
      console.error('Error loading wedding:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen dark-gradient flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const premiumFeatures = [
    {
      icon: Music,
      title: "Unlimited Songs",
      description: "Add as many songs as you want to create the perfect soundtrack",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Users,
      title: "Unlimited Guests",
      description: "Invite all your guests to contribute their favorite songs",
      color: "from-blue-500 to-purple-500"
    },
    {
      icon: Download,
      title: "Export to Spotify",
      description: "Create Spotify playlists with one click",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Share2,
      title: "Co-owner Access",
      description: "Share full access with your partner",
      color: "from-pink-500 to-rose-500"
    }
  ]

  return (
    <div className="min-h-screen dark-gradient relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-purple w-96 h-96 -top-48 -right-48 animate-float"></div>
        <div className="orb orb-pink w-96 h-96 top-1/2 -left-48 animate-float-delayed"></div>
        <div className="orb orb-blue w-96 h-96 -bottom-48 right-1/3 animate-float-slow"></div>
      </div>

      <div className="relative z-10 px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
              <Crown className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-5xl font-serif font-bold text-white mb-4">
              Welcome to Premium!
            </h1>
            
            <p className="text-xl text-white/80 mb-2">
              {wedding?.coupleNames?.join(' & ') || 'Your'} wedding music just got supercharged
            </p>
            
            <div className="flex items-center justify-center gap-2 text-green-400">
              <CheckCircle2 className="w-6 h-6" />
              <span className="text-lg font-medium">Payment successful - You're all set!</span>
            </div>
          </div>

          {/* Premium Features Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {premiumFeatures.map((feature, index) => (
              <div
                key={index}
                className="glass-gradient rounded-2xl p-6 transform hover:scale-105 transition-all cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-4`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Next Steps */}
          <div className="glass-darker rounded-3xl p-8 text-center">
            <Sparkles className="w-12 h-12 text-yellow-400 mx-auto mb-4 animate-pulse" />
            <h2 className="text-3xl font-serif font-bold text-white mb-4">
              Ready to Create Magic?
            </h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              Now that you have unlimited access, let's build the perfect soundtrack for every moment of your wedding day.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/wedding/${weddingId}/builder`}
                className="btn-primary group"
              >
                <Music className="w-5 h-5 group-hover:animate-pulse" />
                Build Your Playlists
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <Link
                href={`/wedding/${weddingId}/guests`}
                className="btn-secondary"
              >
                <Users className="w-5 h-5" />
                Invite Guests
              </Link>
            </div>
          </div>

          {/* Pro Tips */}
          <div className="mt-12 grid md:grid-cols-3 gap-4">
            <div className="glass-darker rounded-xl p-4 text-center">
              <Heart className="w-8 h-8 text-pink-400 mx-auto mb-2" />
              <h4 className="font-semibold text-white mb-1">Pro Tip #1</h4>
              <p className="text-sm text-white/60">Start with your first dance and ceremony music - these set the tone</p>
            </div>
            
            <div className="glass-darker rounded-xl p-4 text-center">
              <Share2 className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <h4 className="font-semibold text-white mb-1">Pro Tip #2</h4>
              <p className="text-sm text-white/60">Add your partner as a co-owner so you can build together</p>
            </div>
            
            <div className="glass-darker rounded-xl p-4 text-center">
              <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h4 className="font-semibold text-white mb-1">Pro Tip #3</h4>
              <p className="text-sm text-white/60">Share early with guests - the best suggestions come with time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}