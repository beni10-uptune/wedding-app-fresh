'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore'
import { 
  Music, Plus, Users, Calendar, Clock, 
  ArrowRight, LogOut, Settings, ChevronRight,
  Play, Heart, Star, TrendingUp, 
  Headphones, Mic, Sparkles
} from 'lucide-react'
import Link from 'next/link'

interface Wedding {
  id: string
  coupleName1: string
  coupleName2: string
  weddingDate: string
  venue: string
  city: string
  playlistCount: number
  guestCount: number
  updatedAt: any
  paymentStatus?: 'pending' | 'paid' | 'refunded'
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [weddings, setWeddings] = useState<Wedding[]>([])
  const [userName, setUserName] = useState('')
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user)
        
        // Get user data
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists()) {
          setUserName(userDoc.data().displayName || user.displayName || 'Music Lover')
        }
        
        // Load user's weddings
        loadWeddings(user.uid)
      } else {
        router.push('/auth/login')
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  const loadWeddings = async (userId: string) => {
    try {
      const weddingsQuery = query(
        collection(db, 'weddings'), 
        where('owners', 'array-contains', userId)
      )
      const snapshot = await getDocs(weddingsQuery)
      const weddingData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Wedding[]
      setWeddings(weddingData)
    } catch (error) {
      console.error('Error loading weddings:', error)
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
      <div className="min-h-screen dark-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading your musical world...</p>
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

      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
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

      {/* Welcome Section */}
      <section className="px-4 py-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl font-serif font-bold text-white mb-4">
                Welcome back, {userName}! 🎵
              </h2>
              <p className="text-xl text-white/70 mb-8">
                {weddings.some(w => w.paymentStatus !== 'paid') 
                  ? 'You have weddings waiting to be completed! Complete setup to start building your perfect playlists.' 
                  : 'Ready to create musical magic for your special day?'
                }
              </p>
              
              {weddings.length === 0 ? (
                <div className="glass-darker rounded-2xl p-8 max-w-2xl">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Start Your Musical Journey
                  </h3>
                  <p className="text-white/60 mb-6">
                    Create your first wedding and begin building the perfect soundtrack for your celebration.
                  </p>
                  <Link
                    href="/create-wedding"
                    className="btn-primary"
                  >
                    <Plus className="w-5 h-5" />
                    Create Your Wedding
                  </Link>
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="glass-darker rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Headphones className="w-8 h-8 text-purple-400" />
                      <span className="text-3xl font-bold text-white">
                        {weddings.reduce((acc, w) => acc + w.playlistCount, 0)}
                      </span>
                    </div>
                    <p className="text-white font-medium">Total Playlists</p>
                    <p className="text-sm text-white/60 mt-1">Across all weddings</p>
                  </div>
                  
                  <div className="glass-darker rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Users className="w-8 h-8 text-pink-400" />
                      <span className="text-3xl font-bold text-white">
                        {weddings.reduce((acc, w) => acc + w.guestCount, 0)}
                      </span>
                    </div>
                    <p className="text-white font-medium">Guest Contributors</p>
                    <p className="text-sm text-white/60 mt-1">Sharing their favorites</p>
                  </div>
                  
                  <div className="glass-darker rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <TrendingUp className="w-8 h-8 text-purple-400" />
                      <span className="text-3xl font-bold text-white">
                        {weddings.length}
                      </span>
                    </div>
                    <p className="text-white font-medium">Active Weddings</p>
                    <p className="text-sm text-white/60 mt-1">In progress</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Incomplete Weddings Alert */}
      {weddings.some(w => w.paymentStatus !== 'paid') && (
        <section className="px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 border border-yellow-500/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">Complete Your Wedding Setup</h3>
                  <p className="text-white/70">
                    You're just one step away from creating the perfect soundtrack for your special day!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Your Weddings */}
      {weddings.length > 0 && (
        <section className="px-4 py-12 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-serif font-bold text-white">
                Your Weddings
              </h3>
              <Link
                href="/create-wedding"
                className="btn-primary"
              >
                <Plus className="w-4 h-4" />
                New Wedding
              </Link>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {weddings.map((wedding) => {
                const isPaid = wedding.paymentStatus === 'paid'
                return (
                  <div
                    key={wedding.id}
                    className="card hover:scale-105 transform transition-all duration-300 group relative"
                  >
                    {!isPaid && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-lg animate-pulse">
                        Complete Setup
                      </div>
                    )}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-xl font-bold text-white mb-1">
                          {wedding.coupleName1} & {wedding.coupleName2}
                        </h4>
                        <p className="text-white/60 text-sm">
                          {wedding.venue}, {wedding.city}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-purple-400 transition-colors" />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm text-white/60">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(wedding.weddingDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-white/60">
                        <Music className="w-4 h-4" />
                        <span>{wedding.playlistCount} playlists</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-white/60">
                        <Users className="w-4 h-4" />
                        <span>{wedding.guestCount} contributors</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                      <span className="text-xs text-white/40">
                        Last updated {wedding.updatedAt?.toDate ? new Date(wedding.updatedAt.toDate()).toLocaleDateString() : 'Recently'}
                      </span>
                      <Link
                        href={isPaid ? `/wedding/${wedding.id}` : `/wedding/${wedding.id}/payment`}
                        className={`font-semibold text-sm ${isPaid ? 'text-purple-400' : 'text-yellow-400'}`}
                      >
                        {isPaid ? 'Manage →' : 'Complete Setup →'}
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Quick Actions */}
      <section className="px-4 py-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-serif font-bold text-white mb-8">
            Quick Actions
          </h3>
          
          <div className="grid md:grid-cols-4 gap-6">
            <Link
              href="/music-library"
              className="card hover:scale-105 transform transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Music className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-white mb-2">Browse Music Library</h4>
              <p className="text-sm text-white/60">
                Explore our curated collection of 500+ wedding songs
              </p>
            </Link>
            
            <Link
              href="/templates"
              className="card hover:scale-105 transform transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-white mb-2">Quick Start Templates</h4>
              <p className="text-sm text-white/60">
                Jump-start with pre-made playlists for every moment
              </p>
            </Link>
            
            <Link
              href="/invite-guests"
              className="card hover:scale-105 transform transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-white mb-2">Invite Guests</h4>
              <p className="text-sm text-white/60">
                Let your loved ones contribute their favorite songs
              </p>
            </Link>
            
            <Link
              href="/export"
              className="card hover:scale-105 transform transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-white mb-2">DJ Export</h4>
              <p className="text-sm text-white/60">
                Export your playlists in DJ-friendly formats
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Musical Inspiration */}
      <section className="px-4 py-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-serif font-bold text-white mb-8">
            Musical Inspiration
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-darker rounded-2xl p-6">
              <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                Trending This Week
              </h4>
              <ul className="space-y-2">
                <li className="text-white/70">"Perfect" - Ed Sheeran</li>
                <li className="text-white/70">"All of Me" - John Legend</li>
                <li className="text-white/70">"Marry You" - Bruno Mars</li>
                <li className="text-white/70">"A Thousand Years" - Christina Perri</li>
              </ul>
            </div>
            
            <div className="glass-darker rounded-2xl p-6">
              <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-400" />
                First Dance Favorites
              </h4>
              <ul className="space-y-2">
                <li className="text-white/70">"At Last" - Etta James</li>
                <li className="text-white/70">"Make You Feel My Love" - Adele</li>
                <li className="text-white/70">"Can't Help Falling in Love" - Elvis</li>
                <li className="text-white/70">"Thinking Out Loud" - Ed Sheeran</li>
              </ul>
            </div>
            
            <div className="glass-darker rounded-2xl p-6">
              <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                <Play className="w-5 h-5 text-purple-400" />
                Party Starters
              </h4>
              <ul className="space-y-2">
                <li className="text-white/70">"Uptown Funk" - Mark Ronson ft. Bruno Mars</li>
                <li className="text-white/70">"I Wanna Dance with Somebody" - Whitney Houston</li>
                <li className="text-white/70">"Shut Up and Dance" - Walk the Moon</li>
                <li className="text-white/70">"Can't Stop the Feeling!" - Justin Timberlake</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}