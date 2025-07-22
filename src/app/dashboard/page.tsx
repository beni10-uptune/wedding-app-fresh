'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { collection, query, where, getDocs, doc, getDoc, orderBy, limit, Timestamp } from 'firebase/firestore'
import { WEDDING_MOMENTS } from '@/data/weddingMoments'
import { Timeline } from '@/types/wedding-v2'
import { 
  Music, Plus, Users, 
  LogOut, Settings, ChevronRight, Heart, 
  Sparkles, Gift,
  CheckCircle2, Zap, PartyPopper,
  HeartHandshake, Timer,
  Calendar, UserCheck, Share2, Play
} from 'lucide-react'
import Link from 'next/link'
import { DashboardSkeleton } from '@/components/LoadingSkeleton'

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
    const wedding = weddingDate.toDate()
    const today = new Date()
    const diffTime = wedding.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Get moment completion percentage
  const getMomentProgress = (moment: any) => {
    const currentSongs = moment.songs?.length || 0
    const targetDuration = moment.duration * 60 // Convert minutes to seconds
    const currentDuration = moment.songs?.reduce((sum: number, song: any) => sum + (song.duration || 0), 0) || 0
    return Math.min((currentDuration / targetDuration) * 100, 100)
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
      const uniqueGuests = new Set(submissionsSnapshot.docs.map(doc => doc.data().guestEmail))
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
        
        // Get user data
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists()) {
          setUserName(userDoc.data().displayName || user.displayName || 'Lovebird')
        }
        
        // Load user's active wedding
        await loadActiveWedding(user.uid)
      } else {
        router.push('/auth/login')
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  const loadActiveWedding = async (userId: string) => {
    try {
      // Get the most recent paid wedding
      const weddingsQuery = query(
        collection(db, 'weddings'), 
        where('owners', 'array-contains', userId),
        where('paymentStatus', '==', 'paid'),
        orderBy('updatedAt', 'desc'),
        limit(1)
      )
      const snapshot = await getDocs(weddingsQuery)
      
      if (!snapshot.empty) {
        const weddingDoc = snapshot.docs[0]
        const data = weddingDoc.data()
        const weddingData = {
          id: weddingDoc.id,
          ...data,
          // Ensure we have coupleNames array
          coupleNames: data.coupleNames || [data.coupleName1, data.coupleName2].filter(Boolean)
        } as Wedding
        
        setActiveWedding(weddingData)
        
        // Load timeline and guest stats for this wedding
        await loadTimeline(weddingDoc.id)
        await loadGuestStats(weddingDoc.id, weddingData)
        
        // Don't auto-redirect - let users navigate manually
      }
    } catch (error) {
      console.error('Error loading wedding:', error)
    }
  }

  const loadTimeline = async (weddingId: string) => {
    try {
      const weddingDoc = await getDoc(doc(db, 'weddings', weddingId))
      if (weddingDoc.exists()) {
        const weddingData = weddingDoc.data()
        const timelineData = weddingData.timeline || {}
        setTimeline(timelineData)
        
        // Calculate total song count and duration
        let totalSongs = 0
        let totalDuration = 0
        Object.values(timelineData).forEach((moment: any) => {
          if (moment.songs && Array.isArray(moment.songs)) {
            totalSongs += moment.songs.length
            totalDuration += moment.songs.reduce((sum: number, song: any) => sum + (song.duration || 0), 0)
          }
        })
        
        setActiveWedding(prev => prev ? { 
          ...prev, 
          songCount: totalSongs,
          totalDuration
        } : null)
      }
    } catch (error) {
      console.error('Error loading timeline:', error)
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

  const momentIcons: { [key: string]: any } = {
    'processional': HeartHandshake,
    'first-dance': Heart,
    'cocktail': Gift,
    'dinner': Users,
    'party': PartyPopper,
    'ceremony': Heart,
    'reception': Sparkles
  }

  const momentColors: { [key: string]: string } = {
    'processional': 'from-pink-500 to-rose-500',
    'first-dance': 'from-red-500 to-pink-500',
    'cocktail': 'from-purple-500 to-pink-500',
    'dinner': 'from-indigo-500 to-purple-500',
    'party': 'from-purple-500 to-indigo-500',
    'ceremony': 'from-rose-500 to-pink-500',
    'reception': 'from-purple-600 to-pink-600'
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
      <header className="glass sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center animate-pulse-slow">
                <Music className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">UpTune</h1>
                <p className="text-sm gradient-text font-medium">for Weddings</p>
              </div>
            </Link>
            
            <div className="flex items-center space-x-4">
              {activeWedding && (
                <Link 
                  href={`/wedding/${activeWedding.id}/settings`}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <Settings className="w-5 h-5" />
                </Link>
              )}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {activeWedding ? (
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
                    <Link href={`/wedding/${activeWedding.id}/builder`} className="glass-darker rounded-2xl p-6 transform hover:scale-105 transition-all cursor-pointer group">
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
                      <p className="text-xs text-white/60 mt-2">Target: 150</p>
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
                    <Link href={`/wedding/${activeWedding.id}/guests`} className="glass-darker rounded-2xl p-6 transform hover:scale-105 transition-all cursor-pointer group">
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
                        {guestStats.responded === 0 
                          ? 'Share with guests to collect song suggestions' 
                          : `${guestStats.responded} of ${guestStats.invited} expected guests`}
                      </p>
                    </Link>
                    
                    {/* Wedding Details */}
                    <Link href={`/wedding/${activeWedding.id}`} className="glass-darker rounded-2xl p-6 transform hover:scale-105 transition-all cursor-pointer group">
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
                    <Link href={`/wedding/${activeWedding.id}/builder`} className="glass-darker rounded-2xl p-6 transform hover:scale-105 transition-all cursor-pointer group">
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
                      href={`/wedding/${activeWedding.id}/builder`}
                      className="btn-primary group"
                    >
                      <Music className="w-5 h-5 group-hover:animate-pulse" />
                      Open Music Builder
                    </Link>
                    <Link
                      href={`/wedding/${activeWedding.id}/guests`}
                      className="btn-secondary"
                    >
                      <Share2 className="w-5 h-5" />
                      Share with Guests
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Recent Activity Section */}
          <section className="px-4 py-12 relative z-10">
            <div className="max-w-7xl mx-auto">
              <h3 className="text-3xl font-serif font-bold text-white mb-8 flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
                Recent Activity
              </h3>
              
              <div className="grid gap-6">
                {timeline && Object.entries(timeline).length > 0 ? (
                  WEDDING_MOMENTS.filter(moment => timeline[moment.id]?.songs?.length > 0).map((moment) => {
                    const momentData = timeline[moment.id]
                    const progress = getMomentProgress(momentData)
                    const Icon = momentIcons[moment.id] || Music
                    const gradient = momentColors[moment.id] || 'from-purple-500 to-pink-500'
                    const songCount = momentData.songs?.length || 0
                    const duration = momentData.songs?.reduce((sum: number, song: any) => sum + (song.duration || 0), 0) || 0
                    
                    return (
                      <Link
                        key={moment.id}
                        href={`/wedding/${activeWedding.id}/builder`}
                        className="group"
                      >
                        <div className="glass-darker rounded-2xl p-6 hover:scale-[1.02] transform transition-all">
                          <div className="flex items-center gap-6">
                            <div className={`w-16 h-16 bg-gradient-to-r ${gradient} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                              <span className="text-2xl">{moment.icon}</span>
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-xl font-bold text-white">{moment.name}</h4>
                                <span className="text-sm text-white/60">
                                  {songCount} songs • {formatDuration(duration)}
                                </span>
                              </div>
                              <p className="text-white/70 text-sm mb-3">
                                {moment.description || `Music for ${moment.name.toLowerCase()}`}
                              </p>
                              
                              <div className="relative">
                                <div className="w-full bg-white/10 rounded-full h-3">
                                  <div 
                                    className={`bg-gradient-to-r ${gradient} h-3 rounded-full transition-all relative overflow-hidden`}
                                    style={{ width: `${progress}%` }}
                                  >
                                    <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
                                  </div>
                                </div>
                                {progress >= 90 && progress <= 110 && (
                                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Perfect!
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <ChevronRight className="w-6 h-6 text-white/40 group-hover:text-white transition-colors" />
                          </div>
                        </div>
                      </Link>
                    )
                  })
                ) : (
                  <div className="glass-darker rounded-2xl p-12 text-center">
                    <Music className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-white mb-2">No music added yet!</h4>
                    <p className="text-white/60 mb-6">Start building your wedding soundtrack in the music builder.</p>
                    <Link
                      href={`/wedding/${activeWedding.id}/builder`}
                      className="btn-primary inline-flex"
                    >
                      <Plus className="w-5 h-5" />
                      Open Music Builder
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </section>

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
                href="/create-wedding"
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