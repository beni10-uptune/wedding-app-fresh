'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// REDIRECT TO NEW BUILDER
export default function DashboardRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace('/builder')
  }, [router])
  
  return (
    <div className="min-h-screen flex items-center justify-center dark-gradient">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/60">Redirecting to builder...</p>
      </div>
    </div>
  )
}

// OLD DASHBOARD CODE - TO BE REMOVED
/*
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { collection, query, where, getDocs, doc, getDoc, orderBy, Timestamp } from 'firebase/firestore'
import { WEDDING_MOMENTS } from '@/data/weddingMoments'
import { Timeline } from '@/types/wedding-v2'
import { 
  Music, Plus, Users, 
  ChevronRight, Heart, 
  Zap, Timer,
  Calendar, UserCheck, Share2, Play,
  AlertCircle, RefreshCw, Crown
} from 'lucide-react'
import Link from 'next/link'
import { DashboardSkeleton } from '@/components/LoadingSkeleton'
import { DashboardNavigation } from '@/components/DashboardNavigation'
import { ensureUserDocument } from '@/lib/auth-utils'
import { formatFirestoreError } from '@/lib/firestore-helpers'
import { GuidesSection } from '@/components/dashboard/GuidesSection'
import { TimelineSection } from '@/components/dashboard/TimelineSection'
import { getClientPricing } from '@/lib/pricing-utils-client'

interface Wedding {
  id: string
  coupleName1?: string
  coupleName2?: string
  weddingDate: Timestamp
  venue: string
  city?: string
  playlistCount?: number
  guestCount?: number
  songCount?: number
  completedPlaylists?: number
  updatedAt: any
  paymentStatus?: 'pending' | 'paid' | 'refunded'
  owners: string[]
  coupleNames?: string[]
  title?: string
  totalDuration?: number
}


export default function Dashboard() {
  const [, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeWedding, setActiveWedding] = useState<Wedding | null>(null)
  const [timeline, setTimeline] = useState<Timeline | null>(null)
  const [userName, setUserName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [pricing] = useState(() => getClientPricing())
  const router = useRouter()

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  // Calculate days until wedding
  const getDaysUntilWedding = (weddingDate: Timestamp) => {
    try {
      if (!weddingDate || !weddingDate.toDate) {
        console.error('Invalid wedding date:', weddingDate)
        return 0
      }
      const wedding = weddingDate.toDate()
      const today = new Date()
      const diffTime = wedding.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return Math.max(0, diffDays) // Prevent negative days
    } catch (error) {
      console.error('Error calculating days until wedding:', error)
      return 0
    }
  }


  // Get overall progress
  const getOverallProgress = () => {
    if (!activeWedding) return 0
    const targetSongs = 150 // Target number of songs for a full wedding
    const currentSongs = activeWedding.songCount || 0
    return Math.min(Math.round((currentSongs / targetSongs) * 100), 100)
  }
  
  // Format duration
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes} min`
  }
  
  // Get wedding statistics
  const getWeddingStats = () => {
    if (!activeWedding || !timeline) return { totalTime: 0, plannedTime: 0, remainingTime: 0 }
    
    const totalDuration = activeWedding.totalDuration || 0
    const plannedDuration = WEDDING_MOMENTS.reduce((sum, moment) => sum + (moment.duration * 60), 0)
    const remainingTime = Math.max(plannedDuration - totalDuration, 0)
    
    return {
      totalTime: totalDuration,
      plannedTime: plannedDuration,
      remainingTime
    }
  }

  // Get guest response rate from actual submissions
  const [guestStats, setGuestStats] = useState({ responded: 0, invited: 0, rate: 0 })
  
  const loadGuestStats = async (weddingId: string, weddingData?: Wedding) => {
    try {
      // Get guest submissions
      const submissionsSnapshot = await getDocs(
        collection(db, 'weddings', weddingId, 'guestSubmissions')
      )
      // Count unique guests by name or email (whichever is available)
      const uniqueGuests = new Set(
        submissionsSnapshot.docs.map(doc => {
          const data = doc.data()
          return data.guestEmail || data.guestName || 'unknown'
        })
      )
      const responded = uniqueGuests.size
      
      // For now, use guestCount as invited count (can be enhanced with actual invitations)
      const invited = weddingData?.guestCount || activeWedding?.guestCount || 50 // Default expected guests
      
      setGuestStats({
        responded,
        invited,
        rate: invited > 0 ? Math.round((responded / invited) * 100) : 0
      })
    } catch (error) {
      console.error('Error loading guest stats:', error)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user)
        
        // Ensure user document exists
        try {
          const userData = await ensureUserDocument(user)
          // Extract first name from full display name or email
          const fullName = userData.displayName || user.displayName || user.email?.split('@')[0] || 'there'
          const firstName = fullName.split(' ')[0]
          setUserName(firstName)
        } catch (error) {
          console.error('Error ensuring user data:', error)
          // Fallback to email-based name if available
          const fallbackName = user.email?.split('@')[0] || 'there'
          setUserName(fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1))
          // Show user-friendly error but don't block dashboard
          setError('Having trouble loading your profile. Some features may be limited.')
        }
        
        // Load user's active wedding
        await loadActiveWedding(user.uid)
      } else {
        router.push('/auth/login')
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router, retryCount])

  const loadActiveWedding = async (userId: string) => {
    try {
      setError(null)
      console.log('Loading weddings for user:', userId)
      
      let allSnapshot
      
      try {
        // First, try with ordering (requires index)
        const allWeddingsQuery = query(
          collection(db, 'weddings'), 
          where('owners', 'array-contains', userId),
          orderBy('updatedAt', 'desc')
        )
        allSnapshot = await getDocs(allWeddingsQuery)
      } catch (indexError: any) {
        console.log('Index not ready, falling back to simple query:', indexError.message)
        // Fallback to simple query without ordering
        const simpleQuery = query(
          collection(db, 'weddings'), 
          where('owners', 'array-contains', userId)
        )
        allSnapshot = await getDocs(simpleQuery)
      }
      
      console.log('Found weddings:', allSnapshot.size)
      
      if (!allSnapshot.empty) {
        // Find the most recent wedding (prefer paid ones)
        const weddings = allSnapshot.docs.map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            ...data,
            // Ensure critical fields have defaults
            paymentStatus: data.paymentStatus || 'pending',
            owners: data.owners || [],
            updatedAt: data.updatedAt || Timestamp.now()
          }
        }) as Wedding[]
        
        // Validate we have at least one valid wedding
        const validWeddings = weddings.filter(w => 
          w.owners && Array.isArray(w.owners) && w.owners.includes(userId)
        )
        
        if (validWeddings.length === 0) {
          console.error('No valid weddings found for user')
          setActiveWedding(null)
          return
        }
        
        // Sort: paid weddings first, then by date
        const sortedWeddings = validWeddings.sort((a, b) => {
          if (a.paymentStatus === 'paid' && b.paymentStatus !== 'paid') return -1
          if (b.paymentStatus === 'paid' && a.paymentStatus !== 'paid') return 1
          return 0
        })
        
        const selectedWedding = sortedWeddings[0]
        const weddingDoc = allSnapshot.docs.find(doc => doc.id === selectedWedding.id)!
        const data = weddingDoc.data()
        
        // Validate and clean wedding data
        const weddingData = {
          id: weddingDoc.id,
          ...data,
          // Ensure we have required fields with defaults
          coupleNames: data.coupleNames || [data.coupleName1, data.coupleName2].filter(Boolean),
          weddingDate: data.weddingDate || Timestamp.now(),
          paymentStatus: data.paymentStatus || 'pending',
          owners: data.owners || [userId],
          venue: data.venue || '',
          city: data.city || ''
        } as Wedding
        
        setActiveWedding(weddingData)
        
        // Load timeline and guest stats for this wedding
        await Promise.all([
          loadTimeline(weddingDoc.id),
          loadGuestStats(weddingDoc.id, weddingData)
        ])
      } else {
        // No weddings found - this is a valid state
        console.log('No weddings found for user')
        setActiveWedding(null)
      }
    } catch (error: any) {
      console.error('Error loading wedding:', error)
      
      // Format error for user
      const errorMessage = formatFirestoreError(error)
      setError(errorMessage)
      
      // If it's a missing index error, try simpler query
      if (error.code === 'failed-precondition' && error.message?.includes('index')) {
        console.log('Trying simpler query without ordering...')
        try {
          const simpleQuery = query(
            collection(db, 'weddings'),
            where('owners', 'array-contains', userId)
          )
          const simpleSnapshot = await getDocs(simpleQuery)
          
          if (!simpleSnapshot.empty) {
            const weddingDoc = simpleSnapshot.docs[0]
            const data = weddingDoc.data()
            const weddingData = {
              id: weddingDoc.id,
              ...data,
              coupleNames: data.coupleNames || [],
              weddingDate: data.weddingDate || Timestamp.now(),
              paymentStatus: data.paymentStatus || 'pending',
              owners: data.owners || [userId]
            } as Wedding
            
            setActiveWedding(weddingData)
            setError(null) // Clear error if simple query works
            
            // Try to load additional data
            await Promise.all([
              loadTimeline(weddingDoc.id).catch(console.error),
              loadGuestStats(weddingDoc.id, weddingData).catch(console.error)
            ])
          }
        } catch (simpleError) {
          console.error('Simple query also failed:', simpleError)
        }
      }
      
      setActiveWedding(null)
    }
  }

  const loadTimeline = async (weddingId: string) => {
    try {
      console.log('Loading timeline for wedding:', weddingId)
      const weddingDoc = await getDoc(doc(db, 'weddings', weddingId))
      if (weddingDoc.exists()) {
        const weddingData = weddingDoc.data()
        const timelineData = weddingData.timeline || {}
        setTimeline(timelineData)
        
        // Calculate total song count and duration
        let totalSongs = 0
        let totalDuration = 0
        Object.values(timelineData).forEach((moment: any) => {
          if (moment && moment.songs && Array.isArray(moment.songs)) {
            totalSongs += moment.songs.length
            totalDuration += moment.songs.reduce((sum: number, song: any) => {
              return sum + (song?.duration || 0)
            }, 0)
          }
        })
        
        console.log('Timeline loaded - Total songs:', totalSongs, 'Total duration:', totalDuration)
        
        setActiveWedding(prev => prev ? { 
          ...prev, 
          songCount: totalSongs,
          totalDuration
        } : null)
      } else {
        console.error('Wedding document not found:', weddingId)
      }
    } catch (error) {
      console.error('Error loading timeline:', error)
      // Don't throw - just log the error to prevent cascade failures
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }


  if (loading) {
    return (
      <div className="min-h-screen dark-gradient relative overflow-hidden">
        {/* Header skeleton */}
        <header className="glass sticky top-0 z-50 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/10 rounded-full animate-pulse"></div>
                <div>
                  <div className="h-5 bg-white/10 rounded w-20 mb-1"></div>
                  <div className="h-3 bg-white/10 rounded w-24"></div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-20 h-8 bg-white/10 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </header>
        
        <div className="px-4 py-12">
          <div className="max-w-7xl mx-auto">
            <DashboardSkeleton />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen dark-gradient relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-purple w-96 h-96 -top-48 -right-48 animate-float"></div>
        <div className="orb orb-pink w-96 h-96 top-1/2 -left-48 animate-float-delayed"></div>
        <div className="orb orb-blue w-96 h-96 -bottom-48 right-1/3 animate-float-slow"></div>
      </div>

      {/* Header */}
      <DashboardNavigation 
        activeWeddingId={activeWedding?.id}
        userName={userName}
      />

      {error ? (
        /* Error State */
        <section className="px-4 py-12 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="glass-gradient rounded-3xl p-12 text-center max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-red-400" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-white mb-4">
                Oops! Something went wrong
              </h2>
              <p className="text-xl text-white/70 mb-8">
                {error}
              </p>
              <button
                onClick={() => {
                  setError(null)
                  setRetryCount(prev => prev + 1)
                }}
                className="btn-primary inline-flex"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>
            </div>
          </div>
        </section>
      ) : activeWedding ? (
        <>
          {/* Hero Section with Wedding Countdown */}
          <section className="px-4 py-12 relative z-10">
            <div className="max-w-7xl mx-auto">
              <div className="glass-gradient rounded-3xl p-8 md:p-12 relative overflow-hidden">
                {/* Animated hearts */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(6)].map((_, i) => (
                    <Heart 
                      key={i} 
                      className={`absolute w-6 h-6 text-pink-400/20 animate-float-up`}
                      style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${i * 0.5}s`,
                        animationDuration: `${10 + Math.random() * 5}s`
                      }}
                    />
                  ))}
                </div>
                
                <div className="relative z-10">
                  <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                    {getGreeting()}, {userName}!
                  </h2>
                  
                  {/* Wedding Countdown */}
                  <div className="mt-8 mb-12">
                    <div className="inline-flex items-center gap-4 glass-darker rounded-2xl p-6">
                      <Timer className="w-12 h-12 text-pink-400" />
                      <div>
                        <p className="text-white/70 text-sm mb-1">
                          {activeWedding?.coupleNames?.length ? activeWedding.coupleNames.join(' & ') : `${activeWedding?.coupleName1 || 'Your'} & ${activeWedding?.coupleName2 || 'Partner'}`}'s Wedding
                        </p>
                        <p className="text-3xl font-bold text-white">
                          {activeWedding?.weddingDate ? getDaysUntilWedding(activeWedding.weddingDate) : 0} days to go!
                        </p>
                        <p className="text-white/60 text-sm mt-1">
                          {activeWedding?.weddingDate ? activeWedding.weddingDate.toDate().toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          }) : ''}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* Songs Progress */}
                    <Link href="/builder" className="glass-darker rounded-2xl p-6 transform hover:scale-105 transition-all cursor-pointer group">
                      <div className="flex items-center justify-between mb-2">
                        <Music className="w-8 h-8 text-purple-400" />
                        <span className="text-3xl font-bold text-white">
                          {activeWedding?.songCount || 0}
                        </span>
                      </div>
                      <p className="text-white font-medium">Songs</p>
                      <div className="w-full bg-white/10 rounded-full h-2 mt-3">
                        <div 
                          className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all"
                          style={{ width: `${getOverallProgress()}%` }}
                        />
                      </div>
                      <p className="text-xs text-white/60 mt-2">
                        {activeWedding?.paymentStatus === 'paid' 
                          ? 'Target: 150 songs' 
                          : `${activeWedding?.songCount || 0} / 10 free`
                        }
                      </p>
                    </Link>
                    
                    {/* Total Duration */}
                    <div className="glass-darker rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-2">
                        <Timer className="w-8 h-8 text-blue-400" />
                        <span className="text-2xl font-bold text-white">
                          {formatDuration(getWeddingStats().totalTime)}
                        </span>
                      </div>
                      <p className="text-white font-medium">Total Music</p>
                      <p className="text-xs text-white/60 mt-1">
                        Planned: {formatDuration(getWeddingStats().plannedTime)}
                      </p>
                    </div>
                    
                    {/* Remaining Time */}
                    <div className="glass-darker rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-2">
                        <Zap className="w-8 h-8 text-yellow-400" />
                        <span className="text-2xl font-bold text-white">
                          {formatDuration(getWeddingStats().remainingTime)}
                        </span>
                      </div>
                      <p className="text-white font-medium">To Fill</p>
                      <p className="text-xs text-white/60 mt-1">
                        Add more songs
                      </p>
                    </div>
                    
                    {/* Guest Responses */}
                    <Link href="/builder?tab=guests" className="glass-darker rounded-2xl p-6 transform hover:scale-105 transition-all cursor-pointer group">
                      <div className="flex items-center justify-between mb-2">
                        <UserCheck className="w-8 h-8 text-green-400" />
                        <span className="text-3xl font-bold text-white">
                          {guestStats.responded}
                        </span>
                      </div>
                      <p className="text-white font-medium">Guest Responses</p>
                      <div className="w-full bg-white/10 rounded-full h-2 mt-3">
                        <div 
                          className="bg-gradient-to-r from-green-400 to-emerald-400 h-2 rounded-full transition-all"
                          style={{ width: `${guestStats.rate}%` }}
                        />
                      </div>
                      <p className="text-xs text-white/60 mt-2">
                        {activeWedding?.paymentStatus !== 'paid' && guestStats.invited >= 5
                          ? `${guestStats.responded} / 5 free guest slots used`
                          : guestStats.responded === 0 
                          ? 'Share with guests to collect song suggestions' 
                          : `${guestStats.responded} of ${guestStats.invited} expected guests`}
                      </p>
                    </Link>
                    
                    {/* Wedding Details */}
                    <Link href="/builder" className="glass-darker rounded-2xl p-6 transform hover:scale-105 transition-all cursor-pointer group">
                      <div className="flex items-center justify-between mb-2">
                        <Calendar className="w-8 h-8 text-pink-400" />
                        <span className="text-xl font-bold text-white">
                          {activeWedding?.venue || 'Venue'}
                        </span>
                      </div>
                      <p className="text-white font-medium">Wedding Details</p>
                      <p className="text-sm text-white/60 mt-1">{activeWedding?.city || 'Location'}</p>
                      <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white mt-2" />
                    </Link>
                    
                    {/* Quick Play */}
                    <Link href="/builder" className="glass-darker rounded-2xl p-6 transform hover:scale-105 transition-all cursor-pointer group">
                      <div className="flex items-center justify-between mb-2">
                        <Play className="w-8 h-8 text-indigo-400" />
                        <span className="text-lg font-bold text-white">
                          Build
                        </span>
                      </div>
                      <p className="text-white font-medium">Music Builder</p>
                      <p className="text-sm text-white/60 mt-1">Drag & drop editor</p>
                      <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white mt-2" />
                    </Link>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-4 mt-8">
                    <Link
                      href="/builder"
                      className="btn-primary group"
                    >
                      <Music className="w-5 h-5 group-hover:animate-pulse" />
                      Open Music Builder
                    </Link>
                    <Link
                      href="/builder?tab=guests"
                      className="btn-secondary"
                    >
                      <Share2 className="w-5 h-5" />
                      Share with Guests
                    </Link>
                  </div>
                  
                  {/* Free Plan Notice */}
                  {activeWedding?.paymentStatus !== 'paid' && (
                    <div className="mt-8 glass-darker rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Crown className="w-5 h-5 text-yellow-400" />
                        <p className="text-white/80">
                          You're on the free plan. Upgrade to unlock unlimited songs, exports, and more for just {pricing.displayPrice}!
                        </p>
                      </div>
                      <Link
                        href={`/wedding/${activeWedding.id}/payment`}
                        className="text-purple-400 hover:text-purple-300 font-medium"
                      >
                        Upgrade Now
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Planning Guides Section */}
          <GuidesSection 
            weddingId={activeWedding.id}
            hasMusic={timeline ? Object.values(timeline).some(m => m?.songs?.length > 0) : false}
            songCount={activeWedding.songCount || 0}
            guestCount={guestStats.responded}
          />

          {/* Timeline Section */}
          <TimelineSection 
            weddingId={activeWedding.id}
            timeline={timeline}
            paymentStatus={activeWedding.paymentStatus || 'pending'}
          />

        </>
    ) : (
        /* No Active Wedding */
        <section className="px-4 py-12 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="glass-gradient rounded-3xl p-12 text-center max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-slow">
                <Heart className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-4xl font-serif font-bold text-white mb-4">
                Welcome, {userName}!
              </h2>
              <p className="text-xl text-white/70 mb-8">
                Ready to create the perfect soundtrack for your special day?
              </p>
              <Link
                href="/builder"
                className="btn-primary text-lg px-8 py-4 inline-flex"
              >
                <Plus className="w-6 h-6" />
                Start Your Musical Journey
              </Link>
              
              {/* Template Showcase */}
              <div className="mt-12 text-left">
                <h3 className="text-lg font-bold text-white mb-4 text-center">
                  🎵 Start with a template that matches your style
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="glass-darker rounded-lg p-4 text-center">
                    <span className="text-2xl mb-2 block">🎩</span>
                    <p className="text-sm text-white/80 font-medium">Classic & Elegant</p>
                  </div>
                  <div className="glass-darker rounded-lg p-4 text-center">
                    <span className="text-2xl mb-2 block">🎉</span>
                    <p className="text-sm text-white/80 font-medium">Modern Party</p>
                  </div>
                  <div className="glass-darker rounded-lg p-4 text-center">
                    <span className="text-2xl mb-2 block">🌻</span>
                    <p className="text-sm text-white/80 font-medium">Rustic & Folk</p>
                  </div>
                  <div className="glass-darker rounded-lg p-4 text-center">
                    <span className="text-2xl mb-2 block">🌍</span>
                    <p className="text-sm text-white/80 font-medium">Cultural Fusion</p>
                  </div>
                  <div className="glass-darker rounded-lg p-4 text-center">
                    <span className="text-2xl mb-2 block">📻</span>
                    <p className="text-sm text-white/80 font-medium">Vintage & Retro</p>
                  </div>
                  <div className="glass-darker rounded-lg p-4 text-center">
                    <span className="text-2xl mb-2 block">🕯️</span>
                    <p className="text-sm text-white/80 font-medium">Intimate & Minimal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
*/