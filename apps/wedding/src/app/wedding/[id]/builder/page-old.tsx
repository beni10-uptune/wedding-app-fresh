'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { WeddingV2, Song, TimelineSong } from '@/types/wedding-v2'
import { WEDDING_MOMENTS_V2 as WEDDING_MOMENTS } from '@/data/weddingMomentsV2'
import { getCollectionsByMoment } from '@/data/curatedCollections'
import { 
  Music, Users, Sparkles, 
  Download, Clock, ChevronLeft
} from 'lucide-react'
import Link from 'next/link'
import CollectionCard from './components/CollectionCard'
import GuestSubmissions from './components/GuestSubmissions'
import GuestInviteModal from './components/GuestInviteModal'
import SongSearch from './components/SongSearch'

export default function WeddingBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: weddingId } = use(params)
  const [wedding, setWedding] = useState<WeddingV2 | null>(null)
  const [loading, setLoading] = useState(true)
  const [activePanel, setActivePanel] = useState<'curated' | 'guests'>('curated')
  const [selectedMoment, setSelectedMoment] = useState<string>('prelude')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [saving, setSaving] = useState(false)
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
        router.push('/builder')
        return
      }

      const weddingData = { id: weddingDoc.id, ...weddingDoc.data() } as WeddingV2
      
      // Check if user is owner
      if (!weddingData.owners.includes(user?.uid || '')) {
        router.push('/builder')
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

  const saveTimeline = async () => {
    if (!wedding) return
    
    setSaving(true)
    try {
      await updateDoc(doc(db, 'weddings', weddingId), {
        timeline: wedding.timeline,
        updatedAt: Timestamp.now()
      })
    } catch (error) {
      console.error('Error saving timeline:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleAddSong = (song: Song | any, momentId: string) => {
    if (!wedding) return

    const timelineSong: TimelineSong = {
      id: `${momentId}-${Date.now()}`,
      spotifyId: song.id || song.spotifyId,
      title: song.title,
      artist: song.artist,
      duration: song.duration || 210,
      addedBy: song.addedBy || 'couple',
      addedAt: Timestamp.now(),
      energy: song.energyLevel,
      explicit: song.explicit
    }

    const updatedWedding = { ...wedding }
    updatedWedding.timeline[momentId].songs.push(timelineSong)
    setWedding(updatedWedding)
    
    // Auto-save after 2 seconds
    setTimeout(() => saveTimeline(), 2000)
  }

  const handleAddAllSongs = (songs: Song[], momentId: string) => {
    songs.forEach(song => handleAddSong(song, momentId))
  }

  const handleRemoveSong = (momentId: string, songId: string) => {
    if (!wedding) return

    const updatedWedding = { ...wedding }
    updatedWedding.timeline[momentId].songs = updatedWedding.timeline[momentId].songs.filter(
      song => song.id !== songId
    )
    setWedding(updatedWedding)
    
    // Auto-save
    setTimeout(() => saveTimeline(), 2000)
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
          <Link href="/builder" className="btn-primary">
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

  const currentMomentCollections = getCollectionsByMoment(selectedMoment)

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
                {saving && (
                  <span className="text-xs text-green-400">Saving...</span>
                )}
              </div>
              
              {/* Action Buttons */}
              <button 
                onClick={() => setShowInviteModal(true)}
                className="btn-secondary text-sm"
              >
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
        <div className="w-[280px] glass border-r border-white/10">
          <SongSearch 
            onAddSong={handleAddSong}
            selectedMoment={selectedMoment}
          />
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
                  <div className="space-y-4">
                    {currentMomentCollections.map((collection) => (
                      <CollectionCard
                        key={collection.id}
                        collection={collection}
                        onAddSong={handleAddSong}
                        onAddAllSongs={handleAddAllSongs}
                      />
                    ))}
                    {currentMomentCollections.length === 0 && (
                      <p className="text-white/60 text-center py-8">
                        No collections available for this moment yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <GuestSubmissions 
                weddingId={weddingId}
                onAddSong={handleAddSong}
              />
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
                        <div key={song.id} className="text-xs text-white/60 truncate flex items-center justify-between group">
                          <span>{index + 1}. {song.title} - {song.artist}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRemoveSong(moment.id, song.id)
                            }}
                            className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300"
                          >
                            ×
                          </button>
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

      {/* Guest Invite Modal */}
      {showInviteModal && (
        <GuestInviteModal
          weddingId={weddingId}
          coupleNames={wedding.coupleNames}
          onClose={() => setShowInviteModal(false)}
          onSuccess={() => {
            setShowInviteModal(false)
            // You could show a success toast here
          }}
        />
      )}
    </div>
  )
}