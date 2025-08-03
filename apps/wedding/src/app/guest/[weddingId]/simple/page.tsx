'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { 
  doc, 
  getDoc, 
  collection, 
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Wedding } from '@/types/wedding'
import { Music, Search, Check, Play, Pause } from 'lucide-react'
import { searchSpotifyTracks } from '@/lib/spotify'
import Image from 'next/image'

interface SpotifyTrack {
  id: string
  name: string
  artist: string
  album: string
  albumArt: string
  previewUrl?: string
}

export default function SimpleGuestPage({ params }: { params: Promise<{ weddingId: string }> }) {
  const { weddingId } = use(params)
  const [wedding, setWedding] = useState<Wedding | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SpotifyTrack[]>([])
  const [searching, setSearching] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [guestName, setGuestName] = useState('')
  const [message, setMessage] = useState('')
  const [selectedSong, setSelectedSong] = useState<SpotifyTrack | null>(null)
  const [playingPreview, setPlayingPreview] = useState<string | null>(null)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)
  const router = useRouter()

  // Load wedding details
  useEffect(() => {
    async function loadWedding() {
      try {
        const weddingDoc = await getDoc(doc(db, 'weddings', weddingId))
        if (weddingDoc.exists()) {
          setWedding({ id: weddingDoc.id, ...weddingDoc.data() } as Wedding)
        } else {
          router.push('/')
        }
      } catch (error) {
        console.error('Error loading wedding:', error)
        router.push('/')
      } finally {
        setLoading(false)
      }
    }
    loadWedding()
  }, [weddingId, router])

  // Search songs with debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length > 2) {
        setSearching(true)
        try {
          const results = await searchSpotifyTracks(searchQuery, 10)
          setSearchResults(results.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artist,
            album: track.album,
            albumArt: track.image || '',
            previewUrl: track.preview_url || undefined
          })))
        } catch (error) {
          console.error('Search error:', error)
          setSearchResults([])
        } finally {
          setSearching(false)
        }
      } else {
        setSearchResults([])
      }
    }, 300) // Reduced debounce for faster search

    return () => clearTimeout(timer)
  }, [searchQuery])

  const handlePreviewToggle = (track: SpotifyTrack) => {
    if (!track.previewUrl) return

    if (playingPreview === track.id) {
      audioElement?.pause()
      setPlayingPreview(null)
    } else {
      audioElement?.pause()
      const audio = new Audio(track.previewUrl)
      audio.play()
      setAudioElement(audio)
      setPlayingPreview(track.id)
      
      audio.addEventListener('ended', () => {
        setPlayingPreview(null)
      })
    }
  }

  const handleSelectSong = (track: SpotifyTrack) => {
    setSelectedSong(track)
    setSearchQuery('')
    setSearchResults([])
    audioElement?.pause()
    setPlayingPreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSong || !guestName.trim()) return

    setSubmitting(true)
    try {
      // Check if this guest already submitted this song
      const existingQuery = query(
        collection(db, 'weddings', weddingId, 'guestSubmissions'),
        where('guestName', '==', guestName.trim()),
        where('song.spotifyId', '==', selectedSong.id)
      )
      const existingDocs = await getDocs(existingQuery)
      
      if (!existingDocs.empty) {
        alert('You have already suggested this song!')
        return
      }

      // Add to guestSubmissions collection (not suggestions!)
      await addDoc(collection(db, 'weddings', weddingId, 'guestSubmissions'), {
        song: {
          title: selectedSong.name,
          artist: selectedSong.artist,
          album: selectedSong.album,
          albumArt: selectedSong.albumArt,
          spotifyId: selectedSong.id,
          previewUrl: selectedSong.previewUrl || null
        },
        guestName: guestName.trim(),
        guestMessage: message.trim() || null,
        momentId: 'danceFloor', // Default to dance floor
        status: 'pending',
        submittedAt: serverTimestamp(),
        approvedAt: null,
        approvedBy: null
      })

      setSubmitted(true)
      setTimeout(() => {
        // Reset form for another submission
        setSubmitted(false)
        setSelectedSong(null)
        setMessage('')
        setSearchQuery('')
      }, 3000)
    } catch (error) {
      console.error('Error submitting song:', error)
      alert('Sorry, there was an error submitting your song. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen dark-gradient flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-400 border-t-transparent"></div>
      </div>
    )
  }

  if (!wedding) {
    return (
      <div className="min-h-screen dark-gradient flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl mb-4">Wedding not found</h1>
          <p>Please check your link and try again.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen dark-gradient py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Music className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl font-serif text-white">
              {wedding.coupleNames.join(' & ')}'s Wedding
            </h1>
          </div>
          <p className="text-white/70">
            Help us build the perfect wedding playlist! Suggest your favorite songs below.
          </p>
        </div>

        {submitted ? (
          <div className="glass rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">Thank You!</h2>
            <p className="text-white/70 mb-4">Your song has been submitted.</p>
            <p className="text-white/60 text-sm">You can suggest another song in a moment...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Guest Name */}
            <div className="glass rounded-xl p-6">
              <label className="block text-white font-semibold mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                required
              />
            </div>

            {/* Song Search */}
            <div className="glass rounded-xl p-6">
              <label className="block text-white font-semibold mb-2">
                Search for a Song
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by song title or artist..."
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                />
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
                  {searchResults.map((track) => (
                    <div
                      key={track.id}
                      onClick={() => handleSelectSong(track)}
                      className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
                    >
                      <Image
                        src={track.albumArt}
                        alt={track.album}
                        width={48}
                        height={48}
                        className="rounded"
                      />
                      <div className="flex-1">
                        <p className="text-white font-medium">{track.name}</p>
                        <p className="text-white/60 text-sm">{track.artist}</p>
                      </div>
                      {track.previewUrl && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handlePreviewToggle(track)
                          }}
                          className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                          {playingPreview === track.id ? (
                            <Pause className="w-4 h-4 text-purple-400" />
                          ) : (
                            <Play className="w-4 h-4 text-purple-400" />
                          )}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {searching && (
                <div className="mt-4 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-400 border-t-transparent mx-auto"></div>
                </div>
              )}
            </div>

            {/* Selected Song */}
            {selectedSong && (
              <div className="glass rounded-xl p-6">
                <label className="block text-white font-semibold mb-2">
                  Selected Song
                </label>
                <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                  <Image
                    src={selectedSong.albumArt}
                    alt={selectedSong.album}
                    width={48}
                    height={48}
                    className="rounded"
                  />
                  <div>
                    <p className="text-white font-medium">{selectedSong.name}</p>
                    <p className="text-white/60 text-sm">{selectedSong.artist}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Message */}
            <div className="glass rounded-xl p-6">
              <label className="block text-white font-semibold mb-2">
                Why this song? (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share a memory or reason for suggesting this song..."
                rows={3}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!selectedSong || !guestName.trim() || submitting}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Song Suggestion'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}