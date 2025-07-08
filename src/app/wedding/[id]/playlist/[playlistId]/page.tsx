'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Play, MoreVertical, Clock, Users, Share2, Download, Plus, Trash2, GripVertical, Check, X, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { db } from '@/lib/firebase'
import { doc, updateDoc, onSnapshot, collection, query, where, Timestamp } from 'firebase/firestore'
import { Song } from '@/data/musicLibrary'
import { SongSuggestion } from '@/types/wedding'
import SpotifyExport from '@/components/SpotifyExport'
import SongCard from '@/components/SongCard'

interface PlaylistSong extends Song {
  addedBy: string
  addedAt: Date
  notes?: string
  order: number
}

interface Playlist {
  id: string
  name: string
  description: string
  moment: string
  songs: PlaylistSong[]
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

export default function PlaylistBuilderPage({ params }: { params: Promise<{ id: string, playlistId: string }> }) {
  const { user } = useAuth()
  const [playlist, setPlaylist] = useState<Playlist | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null)
  const [draggedSong, setDraggedSong] = useState<string | null>(null)
  const [weddingId, setWeddingId] = useState<string>('')
  const [playlistId, setPlaylistId] = useState<string>('')
  const [suggestions, setSuggestions] = useState<SongSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)

  useEffect(() => {
    params.then(({ id, playlistId }) => {
      setWeddingId(id)
      setPlaylistId(playlistId)
    })
  }, [params])

  useEffect(() => {
    if (!user || !weddingId || !playlistId) return

    // Subscribe to playlist changes
    const unsubscribePlaylist = onSnapshot(
      doc(db, 'weddings', weddingId, 'playlists', playlistId),
      (doc) => {
        if (doc.exists()) {
          const data = { id: doc.id, ...doc.data() } as Playlist
          setPlaylist(data)
        }
        setLoading(false)
      },
      (error) => {
        console.error('Error fetching playlist:', error)
        setLoading(false)
      }
    )

    // Subscribe to suggestions for this playlist's moment
    const unsubscribeSuggestions = onSnapshot(
      query(
        collection(db, 'weddings', weddingId, 'suggestions'),
        where('status', '==', 'pending')
      ),
      (snapshot) => {
        const suggestionsList: SongSuggestion[] = []
        snapshot.forEach((doc) => {
          const suggestion = { id: doc.id, ...doc.data() } as SongSuggestion
          suggestionsList.push(suggestion)
        })
        setSuggestions(suggestionsList)
      }
    )

    return () => {
      unsubscribePlaylist()
      unsubscribeSuggestions()
    }
  }, [user, weddingId, playlistId])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getTotalDuration = () => {
    if (!playlist) return 0
    return playlist.songs.reduce((total, song) => total + (song.duration || 0), 0)
  }

  const handlePlay = (songId: string) => {
    setCurrentlyPlaying(currentlyPlaying === songId ? null : songId)
  }

  const handleRemoveSong = async (songId: string) => {
    if (!playlist || !user) return

    try {
      const updatedSongs = playlist.songs.filter(song => song.id !== songId)
      await updateDoc(doc(db, 'weddings', weddingId, 'playlists', playlistId), {
        songs: updatedSongs,
        updatedAt: new Date()
      })
    } catch (error) {
      console.error('Error removing song:', error)
    }
  }

  const handleDragStart = (e: React.DragEvent, songId: string) => {
    setDraggedSong(songId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleApproveSuggestion = async (suggestion: SongSuggestion) => {
    if (!playlist || !user) return

    try {
      // Add the song to the playlist
      const newSong: PlaylistSong = {
        id: `custom-${Date.now()}`,
        title: suggestion.customSong?.title || '',
        artist: suggestion.customSong?.artist || '',
        album: suggestion.customSong?.album || '',
        genre: 'Various',
        mood: 'Happy',
        energy: 'medium',
        moments: [suggestion.suggestedFor],
        popularity: 0,
        duration: 0,
        addedBy: suggestion.suggestedBy,
        addedAt: new Date(),
        order: playlist.songs.length,
        spotify_id: suggestion.spotifyId
      }

      await updateDoc(doc(db, 'weddings', weddingId, 'playlists', playlistId), {
        songs: [...playlist.songs, newSong],
        updatedAt: new Date()
      })

      // Update suggestion status
      await updateDoc(doc(db, 'weddings', weddingId, 'suggestions', suggestion.id), {
        status: 'approved',
        updatedAt: Timestamp.now()
      })
    } catch (error) {
      console.error('Error approving suggestion:', error)
    }
  }

  const handleRejectSuggestion = async (suggestionId: string) => {
    try {
      await updateDoc(doc(db, 'weddings', weddingId, 'suggestions', suggestionId), {
        status: 'rejected',
        updatedAt: Timestamp.now()
      })
    } catch (error) {
      console.error('Error rejecting suggestion:', error)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    if (!playlist || !draggedSong) return

    const draggedIndex = playlist.songs.findIndex(song => song.id === draggedSong)
    if (draggedIndex === -1 || draggedIndex === targetIndex) return

    try {
      const newSongs = [...playlist.songs]
      const [draggedSongObj] = newSongs.splice(draggedIndex, 1)
      newSongs.splice(targetIndex, 0, draggedSongObj)

      // Update order numbers
      const updatedSongs = newSongs.map((song, index) => ({
        ...song,
        order: index
      }))

      await updateDoc(doc(db, 'weddings', weddingId, 'playlists', playlistId), {
        songs: updatedSongs,
        updatedAt: new Date()
      })
    } catch (error) {
      console.error('Error reordering songs:', error)
    }

    setDraggedSong(null)
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

  if (loading) {
    return (
      <div className="min-h-screen dark-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Play className="w-8 h-8 text-white" />
          </div>
          <p className="text-white/70">Loading playlist...</p>
        </div>
      </div>
    )
  }

  if (!playlist) {
    return (
      <div className="min-h-screen dark-gradient flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold text-white mb-4">Playlist not found</h2>
          <Link href={`/wedding/${weddingId}`} className="btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const totalDuration = getTotalDuration()

  return (
    <div className="min-h-screen dark-gradient relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="orb orb-purple w-96 h-96 -top-48 -left-48 animate-float" />
        <div className="orb orb-blue w-64 h-64 top-96 right-32 animate-float" style={{ animationDelay: '2s' }} />
        <div className="orb orb-purple w-80 h-80 bottom-32 -left-40 animate-float" style={{ animationDelay: '4s' }} />
      </div>
      
      <div className="relative z-10">
      {/* Header */}
      <header className="glass-darker border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href={`/wedding/${weddingId}`}
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </Link>
              <div className="flex items-center gap-3">
                <div className="text-3xl">{getMomentIcon(playlist.moment)}</div>
                <div>
                  <h1 className="text-2xl font-serif font-bold text-white">{playlist.name}</h1>
                  <p className="text-white/70">{playlist.description}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Link 
                href={`/wedding/${weddingId}/music-library`}
                className="btn-primary"
              >
                <Plus className="w-4 h-4" />
                Add Songs
              </Link>
              <button className="btn-glass">
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button className="btn-glass">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Playlist Info */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="text-4xl">{getMomentIcon(playlist.moment)}</div>
                <div>
                  <h2 className="text-3xl font-serif font-bold">{playlist.name}</h2>
                  <p className="text-white/90 text-lg">{playlist.description}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-white/80">
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  {playlist.songs.length} song{playlist.songs.length !== 1 ? 's' : ''}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {formatDuration(totalDuration)}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Collaborative
                </div>
              </div>
            </div>
            
            <button 
              className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              onClick={() => playlist.songs.length > 0 && handlePlay(playlist.songs[0].id)}
            >
              <Play className="w-8 h-8 ml-1" />
            </button>
          </div>
        </div>

        {/* Song List */}
        <div className="glass rounded-2xl overflow-hidden">
          {playlist.songs.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">{getMomentIcon(playlist.moment)}</div>
              <h3 className="text-xl font-bold text-white mb-2">Your playlist is empty</h3>
              <p className="text-white/70 mb-8">
                Start building your perfect {playlist.name.toLowerCase()} playlist
              </p>
              <Link 
                href={`/wedding/${weddingId}/music-library`}
                className="btn-primary"
              >
                <Plus className="w-5 h-5" />
                Browse Music Library
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {playlist.songs.map((song, index) => (
                <div
                  key={song.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, song.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors group ${
                    draggedSong === song.id ? 'opacity-50' : ''
                  }`}
                >
                  {/* Drag Handle */}
                  <div className="cursor-move text-white/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="w-4 h-4" />
                  </div>

                  {/* Track Number */}
                  <div className="w-8 text-center text-white/50 font-medium">
                    {index + 1}
                  </div>

                  {/* Song Card */}
                  <div className="flex-1">
                    <SongCard
                      title={song.title}
                      artist={song.artist}
                      spotifyId={song.spotify_id}
                      variant="compact"
                      showPreview={true}
                      showSpotifyLink={true}
                      onPlay={() => handlePlay(song.id)}
                      className="p-0 hover:bg-transparent"
                    />
                    {song.notes && (
                      <p className="text-sm text-white/50 italic mt-1 ml-[52px]">{song.notes}</p>
                    )}
                  </div>

                  {/* Genre & Mood */}
                  <div className="hidden md:flex flex-col items-end gap-1">
                    <span className="px-2 py-1 bg-white/10 text-white/70 rounded text-xs">
                      {song.genre}
                    </span>
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                      {song.mood}
                    </span>
                  </div>

                  {/* Duration */}
                  <div className="text-white/50 text-sm w-12 text-right">
                    {song.duration ? formatDuration(song.duration) : '--:--'}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleRemoveSong(song.id)}
                      className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white/60 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Playlist Actions */}
        {playlist.songs.length > 0 && (
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary">
              <Play className="w-5 h-5" />
              Play All
            </button>
            <button 
              onClick={() => setShowExportModal(true)}
              className="btn-glass"
            >
              <Download className="w-5 h-5" />
              Export for DJ
            </button>
            <button className="btn-glass">
              <Share2 className="w-5 h-5" />
              Share with Guests
            </button>
          </div>
        )}

        {/* Guest Suggestions */}
        {suggestions.filter(s => s.suggestedFor === playlist.moment).length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-serif font-bold text-white">
                Guest Suggestions
              </h3>
              <button
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="text-purple-400 hover:text-purple-300 font-medium"
              >
                {showSuggestions ? 'Hide' : 'Show'} ({suggestions.filter(s => s.suggestedFor === playlist.moment).length})
              </button>
            </div>

            {showSuggestions && (
              <div className="glass rounded-2xl overflow-hidden">
                <div className="divide-y divide-white/10">
                  {suggestions
                    .filter(s => s.suggestedFor === playlist.moment)
                    .map((suggestion) => (
                      <div key={suggestion.id} className="p-6 hover:bg-white/5 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-white">
                              {suggestion.customSong?.title}
                            </h4>
                            <p className="text-white/70">{suggestion.customSong?.artist}</p>
                            
                            {suggestion.message && (
                              <div className="mt-3 flex items-start gap-2">
                                <MessageSquare className="w-4 h-4 text-white/40 mt-0.5" />
                                <p className="text-sm text-white/80 italic">"{suggestion.message}"</p>
                              </div>
                            )}

                            <div className="mt-2 flex items-center gap-4 text-sm text-white/50">
                              <span>Suggested by guest</span>
                              <span>{suggestion.votes} votes</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 ml-4">
                            <button
                              onClick={() => handleApproveSuggestion(suggestion)}
                              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                              title="Approve and add to playlist"
                            >
                              <Check className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleRejectSuggestion(suggestion.id)}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                              title="Reject suggestion"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Export Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="glass-darker rounded-xl max-w-md w-full p-6 border border-white/20">
              <h2 className="text-2xl font-bold gradient-text mb-4">Export Playlist</h2>
              
              <div className="space-y-4">
                {/* Spotify Export */}
                <SpotifyExport
                  weddingId={weddingId}
                  playlistId={playlistId}
                  playlistName={playlist.name}
                  songs={playlist.songs.map(song => ({
                    spotifyId: song.spotify_id,
                    title: song.title,
                    artist: song.artist
                  }))}
                />

                {/* Other Export Options */}
                <div className="pt-4 border-t border-white/10">
                  <h3 className="text-sm font-medium text-white/80 mb-3">Other Export Options</h3>
                  <div className="space-y-2">
                    <button className="w-full btn-glass justify-center">
                      <Download className="w-5 h-5" />
                      Download as CSV
                    </button>
                    <button className="w-full btn-glass justify-center">
                      <Download className="w-5 h-5" />
                      Download as PDF
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setShowExportModal(false)}
                  className="w-full text-white/70 hover:text-white text-sm mt-4"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  )
}