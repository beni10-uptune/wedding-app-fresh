'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { WeddingV2 } from '@/types/wedding-v2'
import { WEDDING_MOMENTS } from '@/data/weddingMoments'
import { 
  Music, Search, Filter, Users, Sparkles, 
  Download, Clock, ChevronLeft, ChevronRight,
  Plus, X, Check, AlertCircle, Headphones
} from 'lucide-react'
import Link from 'next/link'

export default function WeddingBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: weddingId } = use(params)
  const [wedding, setWedding] = useState<WeddingV2 | null>(null)
  const [loading, setLoading] = useState(true)
  const [activePanel, setActivePanel] = useState<'curated' | 'guests'>('curated')
  const [selectedMoment, setSelectedMoment] = useState<string>('prelude')
  const [searchQuery, setSearchQuery] = useState('')
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
        router.push('/dashboard')
        return
      }

      const weddingData = { id: weddingDoc.id, ...weddingDoc.data() } as WeddingV2
      
      // Check if user is owner
      if (!weddingData.owners.includes(user?.uid || '')) {
        router.push('/dashboard')
        return
      }

      // Initialize timeline if not exists
      if (!weddingData.timeline) {
        weddingData.timeline = {}
        WEDDING_MOMENTS.forEach(moment => {
          weddingData.timeline[moment.id] = {
            id: moment.id,
            name: moment.name,
            order: moment.order,
            duration: moment.duration,
            songs: []
          }
        })
      }

      setWedding(weddingData)
    } catch (error) {
      console.error('Error loading wedding:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen dark-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading your music builder...</p>
        </div>
      </div>
    )
  }

  if (!wedding) {
    return (
      <div className="min-h-screen dark-gradient flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Wedding not found</h2>
          <Link href="/dashboard" className="btn-primary">
            Go to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const totalSongs = Object.values(wedding.timeline).reduce(
    (total, moment) => total + moment.songs.length, 0
  )
  const totalDuration = Object.values(wedding.timeline).reduce(
    (total, moment) => moment.songs.reduce((sum, song) => sum + song.duration, 0) + total, 0
  ) / 60 // Convert to minutes

  return (
    <div className="min-h-screen dark-gradient flex flex-col">
      {/* Header */}
      <header className="glass border-b border-white/10 sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href={`/wedding/${weddingId}`} className="flex items-center gap-2 text-white/60 hover:text-white">
              <ChevronLeft className="w-5 h-5" />
              <span>Back to Overview</span>
            </Link>
            
            <div className="flex items-center gap-6">
              {/* Progress Stats */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-purple-400" />
                  <span className="text-white">{totalSongs} songs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span className="text-white">{Math.round(totalDuration)} min</span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <button className="btn-secondary text-sm">
                <Users className="w-4 h-4" />
                Get Guest Input
              </button>
              <button className="btn-primary text-sm">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Three Panels */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Search */}
        <div className="w-[280px] glass border-r border-white/10 flex flex-col">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white mb-3">Add Custom Songs</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search any song..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-purple-400"
              />
            </div>
            <button className="mt-2 text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Filters
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {/* Search results will go here */}
            <div className="text-center text-white/40 py-8">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Search for songs to add to your timeline</p>
            </div>
          </div>
        </div>

        {/* Center Panel - Discovery */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="glass-darker border-b border-white/10">
            <div className="flex">
              <button
                onClick={() => setActivePanel('curated')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activePanel === 'curated'
                    ? 'text-white border-b-2 border-purple-400'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Curated Collections
                </div>
              </button>
              <button
                onClick={() => setActivePanel('guests')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activePanel === 'guests'
                    ? 'text-white border-b-2 border-purple-400'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Users className="w-4 h-4" />
                  Guest Requests
                  <span className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full">
                    0
                  </span>
                </div>
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activePanel === 'curated' ? (
              <div className="space-y-6">
                {/* AI Assistant Card */}
                <div className="glass-gradient rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">AI Wedding Assistant</h4>
                      <p className="text-sm text-white/60">Let me help create your perfect mix</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <button className="glass-darker rounded-lg p-3 text-center hover:scale-105 transition-transform">
                      <p className="text-sm text-white">Generate Mix</p>
                    </button>
                    <button className="glass-darker rounded-lg p-3 text-center hover:scale-105 transition-transform">
                      <p className="text-sm text-white">Analyze Guests</p>
                    </button>
                    <button className="glass-darker rounded-lg p-3 text-center hover:scale-105 transition-transform">
                      <p className="text-sm text-white">Fix Energy Flow</p>
                    </button>
                  </div>
                </div>

                {/* Collection Grid */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">
                    Collections for {WEDDING_MOMENTS.find(m => m.id === selectedMoment)?.name}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Placeholder collections */}
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="glass-darker rounded-lg p-4 hover:scale-105 transition-transform cursor-pointer">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-2xl">🎵</span>
                          <div>
                            <h5 className="font-medium text-white">Collection {i}</h5>
                            <p className="text-xs text-white/60">25 songs</p>
                          </div>
                        </div>
                        <p className="text-sm text-white/70">Perfect for your special moment</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-white mb-2">No guest requests yet</h4>
                <p className="text-white/60 mb-6">Invite guests to suggest their favorite songs</p>
                <button className="btn-primary">
                  <Users className="w-4 h-4" />
                  Send Invitations
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Timeline */}
        <div className="w-[400px] glass border-l border-white/10 flex flex-col">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white">Wedding Timeline</h3>
            <p className="text-sm text-white/60 mt-1">Drag songs to organize your perfect day</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {WEDDING_MOMENTS.map((moment) => {
              const momentData = wedding.timeline[moment.id]
              const isSelected = selectedMoment === moment.id
              const momentDuration = momentData.songs.reduce((sum, song) => sum + song.duration, 0) / 60
              
              return (
                <div
                  key={moment.id}
                  className={`glass-darker rounded-lg p-4 cursor-pointer transition-all ${
                    isSelected ? 'ring-2 ring-purple-400' : 'hover:ring-1 hover:ring-white/20'
                  }`}
                  onClick={() => setSelectedMoment(moment.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{moment.icon}</span>
                      <div>
                        <h4 className="font-medium text-white">{moment.name}</h4>
                        <p className="text-xs text-white/60">{moment.description}</p>
                      </div>
                    </div>
                    <div className="text-right text-xs">
                      <p className="text-white">{momentData.songs.length} songs</p>
                      <p className="text-white/60">{Math.round(momentDuration)}/{moment.duration} min</p>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min((momentDuration / moment.duration) * 100, 100)}%` }}
                    />
                  </div>
                  
                  {/* Song list preview */}
                  {momentData.songs.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {momentData.songs.slice(0, 3).map((song, index) => (
                        <div key={song.id} className="text-xs text-white/60 truncate">
                          {index + 1}. {song.title} - {song.artist}
                        </div>
                      ))}
                      {momentData.songs.length > 3 && (
                        <div className="text-xs text-white/40">
                          +{momentData.songs.length - 3} more songs
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          
          {/* Export Actions */}
          <div className="p-4 border-t border-white/10 space-y-2">
            <button className="btn-primary w-full">
              <Download className="w-4 h-4" />
              Export to Spotify
            </button>
            <button className="btn-secondary w-full">
              <Download className="w-4 h-4" />
              Download for DJ
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}