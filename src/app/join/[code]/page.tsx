'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { auth, db } from '@/lib/firebase'
import { collection, query, where, getDocs, doc, getDoc, addDoc, serverTimestamp } from 'firebase/firestore'
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth'
import { 
  Music, Heart, Calendar, MapPin, 
  Sparkles, Search, Plus, Play, Pause,
  CheckCircle, Headphones
} from 'lucide-react'
import Image from 'next/image'

interface Wedding {
  id: string
  title: string
  coupleNames: string[]
  weddingDate: any
  venue?: string
  city?: string
}

interface WeddingWithPrompt extends Wedding {
  personalizedPrompt?: string
}

interface Moment {
  id: string
  name: string
  description: string
  icon: string
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

export default function JoinPage() {
  const { code } = useParams()
  const router = useRouter()
  const [wedding, setWedding] = useState<WeddingWithPrompt | null>(null)
  const [moments] = useState<Moment[]>([
    { id: 'ceremony', name: 'Ceremony', description: 'Walk down the aisle', icon: '💒' },
    { id: 'cocktail', name: 'Cocktail Hour', description: 'Mingling and drinks', icon: '🍸' },
    { id: 'dinner', name: 'Dinner', description: 'Meal service', icon: '🍽️' },
    { id: 'first-dance', name: 'First Dance', description: 'Special moment', icon: '💕' },
    { id: 'party', name: 'Dance Floor', description: 'Party time!', icon: '🎉' }
  ])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [hasJoined, setHasJoined] = useState(false)
  const [selectedMoment, setSelectedMoment] = useState('party')
  const [submittedSongs, setSubmittedSongs] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SpotifyTrack[]>([])
  const [searching, setSearching] = useState(false)
  const [addingTrack, setAddingTrack] = useState<string | null>(null)
  const [playingTrack, setPlayingTrack] = useState<string | null>(null)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [personalizedPrompt, setPersonalizedPrompt] = useState<string | null>(null)

  useEffect(() => {
    if (code) {
      loadWeddingByCode()
    }
  }, [code])

  useEffect(() => {
    // Check if user has already joined
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && wedding) {
        const guestSession = localStorage.getItem(`wedding_${wedding.id}_guest`)
        if (guestSession) {
          setHasJoined(true)
          const sessionData = JSON.parse(guestSession)
          setGuestName(sessionData.name)
          setGuestEmail(sessionData.email)
        }
      }
    })

    return () => unsubscribe()
  }, [wedding])

  const loadWeddingByCode = async () => {
    try {
      let weddingId: string
      
      // Ensure code is a string
      const codeStr = Array.isArray(code) ? code[0] : code
      if (!codeStr) {
        setError('Invalid invitation code')
        setLoading(false)
        return
      }
      
      console.log('Loading wedding with code:', codeStr)
      
      // First try to use code as wedding ID directly (for share links)
      try {
        const directWeddingDoc = await getDoc(doc(db, 'weddings', codeStr))
        if (directWeddingDoc.exists()) {
          console.log('Found wedding by direct ID')
          weddingId = codeStr
        } else {
          // Not a direct wedding ID, try to find an invitation with this code
          console.log('Not a wedding ID, checking invitations...')
          const invitationsQuery = query(
            collection(db, 'invitations'),
            where('inviteCode', '==', codeStr)
          )
          const inviteSnapshot = await getDocs(invitationsQuery)
          
          if (!inviteSnapshot.empty) {
            // Found an invitation with personalized prompt
            console.log('Found invitation with code')
            const inviteData = inviteSnapshot.docs[0].data()
            weddingId = inviteData.weddingId
            if (inviteData.personalizedPrompt) {
              setPersonalizedPrompt(inviteData.personalizedPrompt)
            }
          } else {
            // Try finding wedding by general invite code
            console.log('Checking for wedding invite code')
            const weddingsQuery = query(
              collection(db, 'weddings'),
              where('inviteCode', '==', codeStr)
            )
            const weddingSnapshot = await getDocs(weddingsQuery)
            
            if (weddingSnapshot.empty) {
              console.error('No wedding or invitation found for code:', codeStr)
              setError('Invalid invitation code or link')
              setLoading(false)
              return
            }
            
            weddingId = weddingSnapshot.docs[0].id
          }
        }
      } catch (queryError) {
        console.error('Error querying for wedding:', queryError)
        setError('Unable to load wedding. Please check the link and try again.')
        setLoading(false)
        return
      }
      
      // Load wedding data
      const weddingDoc = await getDoc(doc(db, 'weddings', weddingId))
      if (weddingDoc.exists()) {
        const weddingData = { id: weddingDoc.id, ...weddingDoc.data() } as WeddingWithPrompt
        setWedding(weddingData)
        
        // Load submitted songs from localStorage
        const storedSubmissions = localStorage.getItem(`wedding_${weddingId}_submissions`)
        if (storedSubmissions) {
          setSubmittedSongs(JSON.parse(storedSubmissions))
        }
      } else {
        setError('Wedding not found')
      }
    } catch (error) {
      console.error('Error loading wedding:', error)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleJoin = async () => {
    if (!guestName || !wedding) return

    try {
      // Sign in anonymously if not already signed in
      if (!auth.currentUser) {
        await signInAnonymously(auth)
      }

      // Store guest session
      const guestSession = {
        name: guestName,
        email: guestEmail,
        joinedAt: new Date().toISOString()
      }
      localStorage.setItem(`wedding_${wedding.id}_guest`, JSON.stringify(guestSession))

      // Create guest record
      await addDoc(collection(db, 'weddings', wedding.id, 'guests'), {
        name: guestName,
        email: guestEmail,
        userId: auth.currentUser?.uid,
        joinedAt: serverTimestamp(),
        inviteCode: code
      })

      setHasJoined(true)
    } catch (error) {
      console.error('Error joining wedding:', error)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    setSearching(true)
    try {
      const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(searchQuery)}&limit=10`)
      const data = await response.json()
      
      if (data.tracks) {
        setSearchResults(data.tracks)
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setSearching(false)
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
    if (!selectedMoment || !wedding) return
    
    setAddingTrack(track.id)
    try {
      // Create guest submission
      await addDoc(collection(db, 'weddings', wedding.id, 'guestSubmissions'), {
        guestName,
        guestEmail,
        songSpotifyId: track.id,
        songTitle: track.name,
        songArtist: track.artist,
        songAlbum: track.album,
        duration: Math.floor(track.duration_ms / 1000),
        previewUrl: track.preview_url,
        suggestedFor: selectedMoment,
        submittedAt: serverTimestamp(),
        status: 'pending',
        votes: 1 // Guest's own vote
      })

      // Track submission locally
      const newSubmissions = [...submittedSongs, track.id]
      setSubmittedSongs(newSubmissions)
      localStorage.setItem(`wedding_${wedding.id}_submissions`, JSON.stringify(newSubmissions))

      // Clear search
      setSearchQuery('')
      setSearchResults([])
      
      // Show success state
      setTimeout(() => {
        setAddingTrack(null)
      }, 1000)
    } catch (error) {
      console.error('Error adding song:', error)
      setAddingTrack(null)
    }
  }

  const getDaysUntilWedding = (weddingDate: any) => {
    const wedding = new Date(weddingDate.seconds ? weddingDate.seconds * 1000 : weddingDate)
    const today = new Date()
    const diffTime = wedding.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getMomentIcon = (moment: string) => {
    switch (moment) {
      case 'ceremony': return '💒'
      case 'cocktail': return '🍸'
      case 'dinner': return '🍽️'
      case 'first-dance': return '💕'
      case 'party': return '🎉'
      default: return '🎵'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen dark-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading wedding details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen dark-gradient flex items-center justify-center">
        <div className="text-center glass-gradient rounded-2xl p-8 max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">❌</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-white mb-2">Oops!</h2>
          <p className="text-white/60">{error}</p>
        </div>
      </div>
    )
  }

  if (!wedding) return null

  return (
    <div className="min-h-screen dark-gradient">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">UpTune</h1>
                <p className="text-sm gradient-text font-medium">for Weddings</p>
              </div>
            </div>
            {hasJoined && (
              <div className="text-right">
                <p className="text-sm text-white/60">Welcome back,</p>
                <p className="font-medium text-white">{guestName}</p>
              </div>
            )}
          </div>
        </div>
      </header>

      {!hasJoined ? (
        /* Guest Registration */
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="glass-gradient rounded-3xl p-8 text-center">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-slow">
                <Heart className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-4xl font-serif font-bold text-white mb-4">
                You're Invited! 💌
              </h2>
              <p className="text-xl text-white/80 mb-2">
                {wedding.coupleNames[0]} & {wedding.coupleNames[1]}
              </p>
              <p className="text-white/60">
                are getting married and want you to help create their wedding playlist!
              </p>
            </div>

            <div className="glass-darker rounded-2xl p-6 mb-8 text-left">
              <div className="flex items-center gap-4 mb-3">
                <Calendar className="w-5 h-5 text-purple-400" />
                <p className="text-white">
                  {new Date(wedding.weddingDate.seconds ? wedding.weddingDate.seconds * 1000 : wedding.weddingDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              {wedding.venue && (
                <div className="flex items-center gap-4">
                  <MapPin className="w-5 h-5 text-purple-400" />
                  <p className="text-white">{wedding.venue}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Your name"
                className="input w-full"
                required
              />
              <input
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="Your email (optional)"
                className="input w-full"
              />
              <button
                onClick={handleJoin}
                disabled={!guestName}
                className="btn-primary w-full text-lg py-4"
              >
                <Sparkles className="w-5 h-5" />
                Join & Add Songs
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Song Addition Interface */
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="glass-gradient rounded-3xl p-8 mb-8">
            <h2 className="text-3xl font-serif font-bold text-white mb-4">
              Help Create the Perfect Playlist! 🎵
            </h2>
            {personalizedPrompt ? (
              <div className="glass-darker rounded-xl p-6 mb-6">
                <p className="text-lg text-white leading-relaxed">
                  {personalizedPrompt}
                </p>
              </div>
            ) : (
              <p className="text-xl text-white/80 mb-6">
                Add your favorite songs to make {wedding.coupleNames[0]} & {wedding.coupleNames[1]}'s 
                wedding day even more special.
              </p>
            )}

            <div className="grid md:grid-cols-3 gap-4">
              <div className="glass-darker rounded-xl p-4 text-center">
                <Headphones className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{moments.length}</p>
                <p className="text-sm text-white/60">Moments</p>
              </div>
              <div className="glass-darker rounded-xl p-4 text-center">
                <Music className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">
                  {submittedSongs.length}
                </p>
                <p className="text-sm text-white/60">Songs Suggested</p>
              </div>
              <div className="glass-darker rounded-xl p-4 text-center">
                <Heart className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{getDaysUntilWedding(wedding.weddingDate)}</p>
                <p className="text-sm text-white/60">Days to Go</p>
              </div>
            </div>
          </div>

          {/* Moment Selector */}
          <div className="glass rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-bold text-white mb-4">Choose a moment to add songs to:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {moments.map(moment => (
                <button
                  key={moment.id}
                  onClick={() => setSelectedMoment(moment.id)}
                  className={`p-4 rounded-xl border transition-all ${
                    selectedMoment === moment.id
                      ? 'border-purple-500 bg-purple-500/20 scale-105'
                      : 'border-white/20 hover:border-purple-400'
                  }`}
                >
                  <span className="text-2xl mb-2 block">{moment.icon}</span>
                  <p className="font-medium text-white">{moment.name}</p>
                  <p className="text-xs text-white/60 mt-1">
                    {moment.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Search Section */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Search for songs:</h3>
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search by song title, artist, or album..."
                className="input flex-1"
              />
              <button
                onClick={handleSearch}
                disabled={searching || !searchQuery.trim()}
                className="btn-primary"
              >
                <Search className="w-5 h-5" />
                Search
              </button>
            </div>

            {/* Search Results */}
            {searching ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white/60">Searching for songs...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-3">
                {searchResults.map(track => (
                  <div
                    key={track.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
                  >
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
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white truncate">{track.name}</h4>
                      <p className="text-sm text-white/60 truncate">
                        {track.artist} • {track.album}
                      </p>
                    </div>
                    
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
                          <CheckCircle className="w-4 h-4 text-green-400" />
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
            ) : (
              <div className="text-center py-8">
                <p className="text-white/60">
                  Search for songs to add to the {moments.find(m => m.id === selectedMoment)?.name}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}