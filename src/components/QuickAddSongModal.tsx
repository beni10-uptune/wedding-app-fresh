'use client'

import { useState, useEffect } from 'react'
import { X, Search, Plus, Play, Pause } from 'lucide-react'
import { searchSpotifyTracks } from '@/lib/spotify'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'

interface QuickAddSongModalProps {
  isOpen: boolean
  onClose: () => void
  weddingId: string
  playlists: Array<{
    id: string
    name: string
    moment: string
  }>
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
  playlists
}: QuickAddSongModalProps) {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SpotifyTrack[]>([])
  const [selectedPlaylist, setSelectedPlaylist] = useState(playlists[0]?.id || '')
  const [loading, setLoading] = useState(false)
  const [addingTrack, setAddingTrack] = useState<string | null>(null)
  const [playingTrack, setPlayingTrack] = useState<string | null>(null)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

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
      const results = await searchSpotifyTracks(searchQuery)
      setSearchResults(results)
    } catch (error) {
      console.error('Search error:', error)
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
    if (!selectedPlaylist || !user) return
    
    setAddingTrack(track.id)
    try {
      // Add song to the selected playlist
      const playlistRef = collection(db, 'weddings', weddingId, 'playlists', selectedPlaylist, 'songs')
      await addDoc(playlistRef, {
        spotify_id: track.id,
        title: track.name,
        artist: track.artist,
        album: track.album,
        duration_ms: track.duration_ms,
        preview_url: track.preview_url,
        image: track.image,
        addedBy: user.uid,
        addedAt: serverTimestamp(),
        votes: 0
      })

      // Show success animation
      setAddingTrack(null)
      
      // Clear search after successful add
      setSearchQuery('')
      setSearchResults([])
      
    } catch (error) {
      console.error('Error adding song:', error)
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
              {playlists.map(playlist => (
                <button
                  key={playlist.id}
                  onClick={() => setSelectedPlaylist(playlist.id)}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    selectedPlaylist === playlist.id
                      ? 'border-purple-500 bg-purple-500/20 text-white'
                      : 'border-white/20 hover:border-purple-400 text-white/60'
                  }`}
                >
                  <span className="mr-2">{getMomentIcon(playlist.moment)}</span>
                  {playlist.name}
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
  )
}