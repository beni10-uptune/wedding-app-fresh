'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { collection, query, where, getDocs, doc, getDoc, orderBy, limit } from 'firebase/firestore'
import { 
  Music, Plus, Users, Calendar, Clock, 
  LogOut, Settings, ChevronRight, Heart, 
  Sparkles, Gift, TrendingUp, Share2,
  CheckCircle2, Circle, Zap, PartyPopper,
  HeartHandshake, Headphones, Timer
} from 'lucide-react'
import Link from 'next/link'
import QuickAddSongModal from '@/components/QuickAddSongModal'

interface Wedding {
  id: string
  coupleName1: string
  coupleName2: string
  weddingDate: string
  venue: string
  city: string
  playlistCount: number
  guestCount: number
  songCount: number
  completedPlaylists: number
  updatedAt: any
  paymentStatus?: 'pending' | 'paid' | 'refunded'
}

interface Playlist {
  id: string
  name: string
  description: string
  moment: string
  songs: any[]
  targetSongCount: number
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeWedding, setActiveWedding] = useState<Wedding | null>(null)
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [userName, setUserName] = useState('')
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const router = useRouter()

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  // Calculate days until wedding
  const getDaysUntilWedding = (weddingDate: string) => {
    const wedding = new Date(weddingDate)
    const today = new Date()
    const diffTime = wedding.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Get playlist completion percentage
  const getPlaylistProgress = (playlist: Playlist) => {
    const currentSongs = playlist.songs?.length || 0
    const targetSongs = playlist.targetSongCount || 20
    return Math.min((currentSongs / targetSongs) * 100, 100)
  }

  // Get overall progress
  const getOverallProgress = () => {
    if (!playlists.length) return 0
    const totalProgress = playlists.reduce((acc, playlist) => acc + getPlaylistProgress(playlist), 0)
    return Math.round(totalProgress / playlists.length)
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
        const weddingData = {
          id: weddingDoc.id,
          ...weddingDoc.data()
        } as Wedding
        
        setActiveWedding(weddingData)
        
        // Load playlists for this wedding
        await loadPlaylists(weddingDoc.id)
      }
    } catch (error) {
      console.error('Error loading wedding:', error)
    }
  }

  const loadPlaylists = async (weddingId: string) => {
    try {
      const playlistsSnapshot = await getDocs(
        collection(db, 'weddings', weddingId, 'playlists')
      )
      const playlistData = playlistsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Playlist[]
      setPlaylists(playlistData)
      
      // Calculate total song count
      const totalSongs = playlistData.reduce((acc, playlist) => acc + (playlist.songs?.length || 0), 0)
      setActiveWedding(prev => prev ? { ...prev, songCount: totalSongs } : null)
    } catch (error) {
      console.error('Error loading playlists:', error)
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
      <div className="min-h-screen dark-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-400/30 rounded-full animate-pulse"></div>
            <div className="w-20 h-20 border-4 border-pink-400 border-t-transparent rounded-full animate-spin absolute inset-0"></div>
          </div>
          <p className="text-white/60 mt-6 text-lg">Loading your love story...</p>
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
              <button className="text-white/60 hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
              </button>
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
                          {activeWedding?.coupleName1 || 'Your'} & {activeWedding?.coupleName2 || 'Partner'}'s Wedding
                        </p>
                        <p className="text-3xl font-bold text-white">
                          {activeWedding?.weddingDate ? getDaysUntilWedding(activeWedding.weddingDate) : 0} days to go!
                        </p>
                        <p className="text-white/60 text-sm mt-1">
                          {activeWedding?.weddingDate ? new Date(activeWedding.weddingDate).toLocaleDateString('en-US', { 
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
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="glass-darker rounded-2xl p-6 transform hover:scale-105 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <Music className="w-8 h-8 text-purple-400" />
                        <span className="text-3xl font-bold text-white">
                          {activeWedding?.songCount || 0}
                        </span>
                      </div>
                      <p className="text-white font-medium">Songs Collected</p>
                      <p className="text-sm text-white/60 mt-1">Across all playlists</p>
                    </div>
                    
                    <div className="glass-darker rounded-2xl p-6 transform hover:scale-105 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <CheckCircle2 className="w-8 h-8 text-green-400" />
                        <span className="text-3xl font-bold text-white">
                          {getOverallProgress()}%
                        </span>
                      </div>
                      <p className="text-white font-medium">Playlist Progress</p>
                      <div className="w-full bg-white/10 rounded-full h-2 mt-3">
                        <div 
                          className="bg-gradient-to-r from-green-400 to-emerald-400 h-2 rounded-full transition-all"
                          style={{ width: `${getOverallProgress()}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="glass-darker rounded-2xl p-6 transform hover:scale-105 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <Users className="w-8 h-8 text-pink-400" />
                        <span className="text-3xl font-bold text-white">
                          {activeWedding?.guestCount || 0}
                        </span>
                      </div>
                      <p className="text-white font-medium">Guest Contributors</p>
                      <p className="text-sm text-white/60 mt-1">Sharing their favorites</p>
                    </div>
                    
                    <div className="glass-darker rounded-2xl p-6 transform hover:scale-105 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <Headphones className="w-8 h-8 text-indigo-400" />
                        <span className="text-3xl font-bold text-white">
                          {activeWedding?.playlistCount || 0}
                        </span>
                      </div>
                      <p className="text-white font-medium">Playlists Created</p>
                      <p className="text-sm text-white/60 mt-1">For every moment</p>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-4 mt-8">
                    <button
                      onClick={() => setShowQuickAdd(true)}
                      className="btn-primary group"
                    >
                      <Zap className="w-5 h-5 group-hover:animate-pulse" />
                      Quick Add Song
                    </button>
                    <Link
                      href={`/wedding/${activeWedding.id}/guests`}
                      className="btn-secondary"
                    >
                      <Share2 className="w-5 h-5" />
                      Invite Guests
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Playlist Progress Section */}
          <section className="px-4 py-12 relative z-10">
            <div className="max-w-7xl mx-auto">
              <h3 className="text-3xl font-serif font-bold text-white mb-8 flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
                Your Wedding Playlists
              </h3>
              
              <div className="grid gap-6">
                {playlists.map((playlist) => {
                  const progress = getPlaylistProgress(playlist)
                  const Icon = momentIcons[playlist.moment] || Music
                  const gradient = momentColors[playlist.moment] || 'from-purple-500 to-pink-500'
                  
                  return (
                    <Link
                      key={playlist.id}
                      href={`/wedding/${activeWedding.id}/playlist/${playlist.id}`}
                      className="group"
                    >
                      <div className="glass-darker rounded-2xl p-6 hover:scale-[1.02] transform transition-all">
                        <div className="flex items-center gap-6">
                          <div className={`w-16 h-16 bg-gradient-to-r ${gradient} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-xl font-bold text-white">{playlist.name}</h4>
                              <span className="text-sm text-white/60">
                                {playlist.songs?.length || 0} / {playlist.targetSongCount || 20} songs
                              </span>
                            </div>
                            <p className="text-white/70 text-sm mb-3">{playlist.description}</p>
                            
                            <div className="relative">
                              <div className="w-full bg-white/10 rounded-full h-3">
                                <div 
                                  className={`bg-gradient-to-r ${gradient} h-3 rounded-full transition-all relative overflow-hidden`}
                                  style={{ width: `${progress}%` }}
                                >
                                  <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
                                </div>
                              </div>
                              {progress === 100 && (
                                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Complete!
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <ChevronRight className="w-6 h-6 text-white/40 group-hover:text-white transition-colors" />
                        </div>
                      </div>
                    </Link>
                  )
                })}
                
                {playlists.length === 0 && (
                  <div className="glass-darker rounded-2xl p-12 text-center">
                    <Music className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-white mb-2">No playlists yet!</h4>
                    <p className="text-white/60 mb-6">Create your first playlist to start building your wedding soundtrack.</p>
                    <Link
                      href={`/wedding/${activeWedding.id}`}
                      className="btn-primary inline-flex"
                    >
                      <Plus className="w-5 h-5" />
                      Create Playlist
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Quick Add Modal */}
          {showQuickAdd && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="glass-gradient rounded-3xl p-8 max-w-md w-full animate-scale-in">
                <h3 className="text-2xl font-bold text-white mb-4">Quick Add Song</h3>
                <p className="text-white/70 mb-6">This feature is coming soon! For now, visit your playlists to add songs.</p>
                <button
                  onClick={() => setShowQuickAdd(false)}
                  className="btn-primary w-full"
                >
                  Got it!
                </button>
              </div>
            </div>
          )}
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
            </div>
          </div>
        </section>
      )}
      
      {/* Quick Add Song Modal */}
      {activeWedding && (
        <QuickAddSongModal
          isOpen={showQuickAdd}
          onClose={() => setShowQuickAdd(false)}
          weddingId={activeWedding.id}
          playlists={playlists.map(p => ({
            id: p.id,
            name: p.name,
            moment: p.moment
          }))}
        />
      )}
    </div>
  )
}