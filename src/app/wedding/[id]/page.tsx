'use client'

import { useEffect, useState } from 'react'
import { Music, Users, Calendar, MapPin, Heart, Play, Plus, Settings, Share2, Download } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { db } from '@/lib/firebase'
import { doc, getDoc, collection, onSnapshot } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import ActivityFeed from '@/components/ActivityFeed'

interface Wedding {
  id: string
  coupleName1: string
  coupleName2: string
  weddingDate: string
  venue: string
  city: string
  guestCount: number
  weddingStyle: string
  moments: string[]
  ownerId: string
  owners: string[]
  status: string
  createdAt: any
}

interface Playlist {
  id: string
  name: string
  description: string
  moment: string
  songs: any[]
  createdAt: any
}

export default function WeddingDashboard({ params }: { params: Promise<{ id: string }> }) {
  const { user } = useAuth()
  const [wedding, setWedding] = useState<Wedding | null>(null)
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [weddingId, setWeddingId] = useState<string>('')
  const router = useRouter()

  useEffect(() => {
    params.then(({ id }) => {
      setWeddingId(id)
    })
  }, [params])

  useEffect(() => {
    if (!user || !weddingId) {
      if (!user) router.push('/auth/login')
      return
    }

    fetchWedding()
    subscribeToPlaylists()
  }, [user, weddingId])

  const fetchWedding = async () => {
    try {
      const weddingDoc = await getDoc(doc(db, 'weddings', weddingId))
      if (weddingDoc.exists()) {
        const weddingData = { id: weddingDoc.id, ...weddingDoc.data() } as Wedding
        
        // Check if user has access to this wedding
        if (!weddingData.owners.includes(user?.uid || '')) {
          setError('You do not have access to this wedding')
          return
        }
        
        // Check payment status
        if (weddingData.paymentStatus !== 'paid') {
          router.push(`/wedding/${weddingId}/payment`)
          return
        }
        
        setWedding(weddingData)
      } else {
        setError('Wedding not found')
      }
    } catch (err) {
      setError('Failed to load wedding')
    } finally {
      setLoading(false)
    }
  }

  const subscribeToPlaylists = () => {
    const unsubscribe = onSnapshot(
      collection(db, 'weddings', weddingId, 'playlists'),
      (snapshot) => {
        const playlistData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Playlist[]
        setPlaylists(playlistData)
      },
      (error) => {
        console.error('Error fetching playlists:', error)
      }
    )

    return unsubscribe
  }

  const getMomentIcon = (moment: string) => {
    switch (moment) {
      case 'ceremony': return '💒'
      case 'cocktail': return '🍸'
      case 'dinner': return '🍽️'
      case 'dancing': return '💃'
      case 'first-dance': return '💕'
      case 'parent-dance': return '👨‍👩‍👧‍👦'
      default: return '🎵'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getDaysUntilWedding = () => {
    if (!wedding?.weddingDate) return null
    const today = new Date()
    const weddingDate = new Date(wedding.weddingDate)
    const diffTime = weddingDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wedding-pink-50 via-white to-wedding-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-wedding-gradient rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Music className="w-8 h-8 text-white" />
          </div>
          <p className="text-wedding-neutral-600">Loading your wedding...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wedding-pink-50 via-white to-wedding-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold text-wedding-neutral-900 mb-4">
            Oops! Something went wrong
          </h2>
          <p className="text-wedding-neutral-600 mb-8">{error}</p>
          <Link href="/" className="bg-wedding-gradient text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300">
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  if (!wedding) return null

  const daysUntilWedding = getDaysUntilWedding()

  return (
    <div className="min-h-screen bg-gradient-to-br from-wedding-pink-50 via-white to-wedding-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-wedding-neutral-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-wedding-gradient rounded-full flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-wedding-neutral-900">UpTune</h1>
                <p className="text-sm text-wedding-pink-600 font-medium">for Weddings</p>
              </div>
            </Link>
            
            <div className="flex items-center space-x-4">
              <button className="flex items-center gap-2 px-4 py-2 border border-wedding-neutral-200 rounded-full hover:bg-wedding-neutral-50 transition-colors">
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-wedding-neutral-200 rounded-full hover:bg-wedding-neutral-50 transition-colors">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
              <Link href={`/wedding/${weddingId}/settings`} className="flex items-center gap-2 px-4 py-2 border border-wedding-neutral-200 rounded-full hover:bg-wedding-neutral-50 transition-colors">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Wedding Info Banner */}
      <div className="bg-wedding-gradient text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="w-8 h-8" />
              <h2 className="text-4xl font-serif font-bold">
                {wedding.coupleName1} & {wedding.coupleName2}
              </h2>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-lg opacity-90">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {formatDate(wedding.weddingDate)}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {wedding.venue}, {wedding.city}
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                {wedding.guestCount} guests
              </div>
            </div>
            
            {daysUntilWedding !== null && (
              <div className="mt-6 text-center">
                {daysUntilWedding > 0 ? (
                  <p className="text-2xl font-bold">
                    {daysUntilWedding} day{daysUntilWedding !== 1 ? 's' : ''} until your special day! 🎉
                  </p>
                ) : daysUntilWedding === 0 ? (
                  <p className="text-2xl font-bold">
                    Today is your wedding day! 🎊
                  </p>
                ) : (
                  <p className="text-2xl font-bold">
                    Hope you had an amazing wedding! 💕
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Playlists Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-serif font-bold text-wedding-neutral-900">
                Your Musical Moments
              </h3>
              <Link href={`/wedding/${weddingId}/music-library`} className="bg-wedding-gradient text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add Songs
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {playlists.map(playlist => (
                <Link
                  key={playlist.id}
                  href={`/wedding/${weddingId}/playlist/${playlist.id}`}
                  className="card hover:scale-105 transform transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl">{getMomentIcon(playlist.moment)}</div>
                    <div className="text-sm text-white/50">
                      {playlist.songs.length} songs
                    </div>
                  </div>
                  
                  <h4 className="text-xl font-bold text-white mb-2">
                    {playlist.name}
                  </h4>
                  <p className="text-white/70 mb-4">
                    {playlist.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-purple-400">
                      <Play className="w-4 h-4" />
                      <span className="text-sm font-medium">Preview</span>
                    </div>
                    <div className="text-sm text-white/50">
                      {playlist.songs.length > 0 ? `${playlist.songs.length} songs` : 'Empty'}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="card">
              <h4 className="text-xl font-bold gradient-text mb-4">Quick Actions</h4>
              <div className="space-y-3">
                <Link href={`/wedding/${weddingId}/music-library`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    <Music className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-white">Browse Music</div>
                    <div className="text-sm text-white/60">Discover 500+ curated songs</div>
                  </div>
                </Link>
                
                <Link href={`/wedding/${weddingId}/guests`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-white">Invite Guests</div>
                    <div className="text-sm text-white/60">Let guests suggest songs</div>
                  </div>
                </Link>
                
                <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors w-full text-left">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    <Download className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-white">Export for DJ</div>
                    <div className="text-sm text-white/60">Download organized playlists</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Wedding Details */}
            <div className="card">
              <h4 className="text-xl font-bold gradient-text mb-4">Wedding Details</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Style:</span>
                  <span className="font-medium text-white">{wedding.weddingStyle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Guests:</span>
                  <span className="font-medium text-white">{wedding.guestCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Moments:</span>
                  <span className="font-medium text-white">{wedding.moments.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Status:</span>
                  <span className="font-medium text-purple-400 capitalize">{wedding.status}</span>
                </div>
              </div>
            </div>

            {/* Activity Feed */}
            <ActivityFeed weddingId={weddingId} limit={5} />
          </div>
        </div>
      </main>
    </div>
  )
}