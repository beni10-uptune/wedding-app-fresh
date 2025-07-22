'use client'

import { useState, useEffect } from 'react'
import { X, Search, Plus, Play, Pause } from 'lucide-react'
// Removed direct Spotify import - will use API route instead
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/contexts/AuthContext'
import { validateSongData } from '@/lib/song-utils'
import { SUBSCRIPTION_TIERS, getUserTier } from '@/lib/subscription-tiers'
import UpgradeModal from './UpgradeModal'
import Image from 'next/image'

interface QuickAddSongModalProps {
  isOpen: boolean
  onClose: () => void
  weddingId: string
  playlists?: Array<{
    id: string
    name: string
    moment: string
  }>
  onSongAdded?: () => void
}

interface SpotifyTrack {
  id: string
  name: string
  artist: string
  album: string
  duration_ms: number
  preview_url: string | null
  image?: string
}

export default function QuickAddSongModal({
  isOpen,
  onClose,
  weddingId,
  playlists,
  onSongAdded
}: QuickAddSongModalProps) {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SpotifyTrack[]>([])
  const [selectedMoment, setSelectedMoment] = useState('first-dance')
  const [availableMoments, setAvailableMoments] = useState<string[]>(['first-dance', 'ceremony', 'cocktail', 'dinner', 'party'])
  const [loading, setLoading] = useState(false)
  const [addingTrack, setAddingTrack] = useState<string | null>(null)
  const [playingTrack, setPlayingTrack] = useState<string | null>(null)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('')
      setSearchResults([])
      if (audio) {
        audio.pause()
        setPlayingTrack(null)
      }
    }
  }, [isOpen, audio])

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(searchQuery)}&limit=20`)
      const data = await response.json()
      
      if (data.tracks) {
        setSearchResults(data.tracks)
      } else {
        console.error('No tracks in response:', data)
        setSearchResults([])
      }
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  const togglePlay = (trackId: string, previewUrl: string) => {
    if (playingTrack === trackId && audio) {
      audio.pause()
      setPlayingTrack(null)
    } else {
      if (audio) audio.pause()
      
      const newAudio = new Audio(previewUrl)
      newAudio.volume = 0.3
      newAudio.play()
      
      newAudio.addEventListener('ended', () => {
        setPlayingTrack(null)
      })
      
      setAudio(newAudio)
      setPlayingTrack(trackId)
    }
  }

  const handleAddSong = async (track: SpotifyTrack) => {
    if (!selectedMoment || !user) return
    
    setAddingTrack(track.id)
    try {
      // Get the wedding document
      const weddingRef = doc(db, 'weddings', weddingId)
      const weddingDoc = await getDoc(weddingRef)
      
      if (!weddingDoc.exists()) {
        throw new Error('Wedding not found')
      }
      
      const weddingData = weddingDoc.data()
      const timeline = weddingData.timeline || {}
      const currentPaymentStatus = weddingData.paymentStatus || 'pending'
      
      // Count total songs across all moments
      let currentSongCount = 0
      Object.values(timeline).forEach((moment: any) => {
        if (moment.songs && Array.isArray(moment.songs)) {
          currentSongCount += moment.songs.length
        }
      })
      
      // Check if user is on free tier and would exceed limit
      const userTier = getUserTier(currentPaymentStatus)
      if (userTier.maxSongs !== -1 && currentSongCount >= userTier.maxSongs) {
        setAddingTrack(null)
        setShowUpgradeModal(true)
        return
      }
      
      // Check for duplicates in the selected moment
      const momentSongs = timeline[selectedMoment]?.songs || []
      const isDuplicate = momentSongs.some((song: any) => song.spotifyId === track.id)
      
      if (isDuplicate) {
        alert('This song is already in this moment!')
        setAddingTrack(null)
        return
      }

      // Validate song data
      const validationError = validateSongData({
        spotify_id: track.id,
        title: track.name,
        artist: track.artist,
        duration_ms: track.duration_ms
      })
      
      if (validationError) {
        alert(validationError)
        setAddingTrack(null)
        return
      }

      // Create the new song object
      const newSong = {
        id: `${Date.now()}_${track.id}`,
        spotifyId: track.id,
        title: track.name,
        artist: track.artist,
        duration: Math.floor(track.duration_ms / 1000), // Convert to seconds
        addedBy: 'couple',
        addedAt: Timestamp.now(),
        energy: 3,
        explicit: false
      }

      // Update the timeline
      if (!timeline[selectedMoment]) {
        timeline[selectedMoment] = {
          songs: [],
          duration: 60 // Default duration in minutes
        }
      }
      
      timeline[selectedMoment].songs.push(newSong)
      
      // Update the wedding document
      await updateDoc(weddingRef, {
        timeline,
        updatedAt: new Date()
      })

      // Show success animation
      setAddingTrack(null)
      
      // Clear search after successful add
      setSearchQuery('')
      setSearchResults([])
      
      // Notify parent component
      if (onSongAdded) {
        onSongAdded()
      }
      
    } catch (error) {
      console.error('Error adding song:', error)
      alert('Failed to add song. Please try again.')
      setAddingTrack(null)
    }
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

  if (!isOpen) return null

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[80vh] glass rounded-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif font-bold text-white">
              Quick Add Song 🎵
            </h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-white/60" />
            </button>
          </div>
          
          {/* Playlist Selector */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-white/60 mb-2">
              Add to playlist:
            </label>
            <div className="flex gap-2 flex-wrap">
              {availableMoments.map(moment => (
                <button
                  key={moment}
                  onClick={() => setSelectedMoment(moment)}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    selectedMoment === moment
                      ? 'border-purple-500 bg-purple-500/20 text-white'
                      : 'border-white/20 hover:border-purple-400 text-white/60'
                  }`}
                >
                  <span className="mr-2">{getMomentIcon(moment)}</span>
                  {moment.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Search */}
        <div className="p-6 border-b border-white/10">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search for songs by title, artist, or album..."
              className="input flex-1"
              autoFocus
            />
            <button
              onClick={handleSearch}
              disabled={loading || !searchQuery.trim()}
              className="btn-primary"
            >
              <Search className="w-5 h-5" />
              Search
            </button>
          </div>
        </div>
        
        {/* Results */}
        <div className="overflow-y-auto max-h-[calc(80vh-300px)] p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white/60">Searching for songs...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-3">
              {searchResults.map(track => (
                <div
                  key={track.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group"
                >
                  {/* Album Art */}
                  {track.image ? (
                    <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={track.image}
                        alt={track.album}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-white/10 rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🎵</span>
                    </div>
                  )}
                  
                  {/* Track Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white truncate">{track.name}</h4>
                    <p className="text-sm text-white/60 truncate">
                      {track.artist} • {track.album}
                    </p>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {track.preview_url && (
                      <button
                        onClick={() => togglePlay(track.id, track.preview_url!)}
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                      >
                        {playingTrack === track.id ? (
                          <Pause className="w-4 h-4 text-white" />
                        ) : (
                          <Play className="w-4 h-4 text-white ml-0.5" />
                        )}
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleAddSong(track)}
                      disabled={addingTrack === track.id}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:scale-100"
                    >
                      {addingTrack === track.id ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Plus className="w-4 h-4 inline mr-1" />
                          Add
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : searchQuery && !loading ? (
            <div className="text-center py-8">
              <p className="text-white/60">No songs found. Try a different search!</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-white/60">
                Search for your favorite songs to add to your wedding playlist! 🎶
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
    
    {/* Upgrade Modal */}
    <UpgradeModal
      isOpen={showUpgradeModal}
      onClose={() => setShowUpgradeModal(false)}
      trigger="SONG_LIMIT"
      weddingId={weddingId}
    />
  </>
  )
}