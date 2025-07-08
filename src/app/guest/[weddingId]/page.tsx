'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { checkUserWeddingAccess } from '@/lib/invitations'
import { 
  doc, 
  getDoc, 
  collection, 
  query, 
  where, 
  onSnapshot,
  addDoc,
  updateDoc,
  setDoc,
  serverTimestamp,
  Timestamp,
  orderBy
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Wedding, SongSuggestion, Vote, WeddingMoment } from '@/types/wedding'
import Link from 'next/link'
import { searchSpotifyTracks } from '@/lib/spotify'
import SongCard from '@/components/SongCard'
import { Search, X } from 'lucide-react'

const WEDDING_MOMENTS: { value: WeddingMoment; label: string; icon: string }[] = [
  { value: 'processional', label: 'Processional', icon: '👰' },
  { value: 'ceremony', label: 'Ceremony', icon: '💒' },
  { value: 'recessional', label: 'Recessional', icon: '🎊' },
  { value: 'cocktail', label: 'Cocktail Hour', icon: '🥂' },
  { value: 'dinner', label: 'Dinner', icon: '🍽️' },
  { value: 'first-dance', label: 'First Dance', icon: '💑' },
  { value: 'parent-dance', label: 'Parent Dances', icon: '👨‍👩‍👧' },
  { value: 'party', label: 'Dance Party', icon: '🎉' },
  { value: 'last-dance', label: 'Last Dance', icon: '✨' }
]

export default function GuestInterfacePage({ params }: { params: Promise<{ weddingId: string }> }) {
  const [wedding, setWedding] = useState<Wedding | null>(null)
  const [suggestions, setSuggestions] = useState<SongSuggestion[]>([])
  const [userVotes, setUserVotes] = useState<{ [suggestionId: string]: 1 | -1 }>({})
  const [loading, setLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)
  const [showSuggestionForm, setShowSuggestionForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [weddingId, setWeddingId] = useState<string | null>(null)
  const { user } = useAuth()
  const router = useRouter()

  // Form state
  const [songTitle, setSongTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [moment, setMoment] = useState<WeddingMoment>('party')
  const [message, setMessage] = useState('')
  const [spotifyId, setSpotifyId] = useState('')
  
  // Spotify search state
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)

  useEffect(() => {
    params.then(p => setWeddingId(p.weddingId))
  }, [params])

  useEffect(() => {
    if (!weddingId) return
    
    if (!user) {
      router.push(`/auth/guest-join/${weddingId}`)
      return
    }

    const checkAccess = async () => {
      try {
        const access = await checkUserWeddingAccess(user.uid, weddingId)
        if (!access) {
          router.push('/')
          return
        }
        setHasAccess(true)

        // Load wedding details
        const weddingDoc = await getDoc(doc(db, 'weddings', weddingId))
        if (weddingDoc.exists()) {
          setWedding({ id: weddingDoc.id, ...weddingDoc.data() } as Wedding)
        }

        setLoading(false)
      } catch (err) {
        console.error('Error checking access:', err)
        router.push('/')
      }
    }

    checkAccess()
  }, [user, weddingId, router])

  useEffect(() => {
    if (!hasAccess || !user || !weddingId) return

    // Subscribe to suggestions
    const suggestionsQuery = query(
      collection(db, 'weddings', weddingId, 'suggestions'),
      orderBy('createdAt', 'desc')
    )

    const unsubscribeSuggestions = onSnapshot(suggestionsQuery, (snapshot) => {
      const suggestionsList: SongSuggestion[] = []
      snapshot.forEach((doc) => {
        suggestionsList.push({ id: doc.id, ...doc.data() } as SongSuggestion)
      })
      setSuggestions(suggestionsList)
    })

    // Subscribe to user's votes
    const votesQuery = query(
      collection(db, 'weddings', weddingId, 'votes'),
      where('userId', '==', user.uid)
    )

    const unsubscribeVotes = onSnapshot(votesQuery, (snapshot) => {
      const votes: { [suggestionId: string]: 1 | -1 } = {}
      snapshot.forEach((doc) => {
        const vote = doc.data() as Vote
        votes[vote.suggestionId] = vote.value
      })
      setUserVotes(votes)
    })

    return () => {
      unsubscribeSuggestions()
      unsubscribeVotes()
    }
  }, [hasAccess, user, weddingId])

  // Spotify search with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 2) {
        setSearchLoading(true)
        try {
          const results = await searchSpotifyTracks(searchQuery, 5)
          setSearchResults(results)
          setShowSearchResults(true)
        } catch (error) {
          console.error('Spotify search error:', error)
        } finally {
          setSearchLoading(false)
        }
      } else {
        setSearchResults([])
        setShowSearchResults(false)
      }
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])


  const handleSelectSpotifySong = (track: any) => {
    setSongTitle(track.name)
    setArtist(track.artist)
    setSpotifyId(track.id)
    setSearchQuery('')
    setShowSearchResults(false)
  }

  const handleSuggestSong = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !songTitle || !artist || !weddingId) return

    setSubmitting(true)
    try {
      const suggestionData: Omit<SongSuggestion, 'id'> = {
        weddingId: weddingId,
        customSong: {
          title: songTitle,
          artist: artist
        },
        spotifyId: spotifyId || undefined,
        suggestedBy: user.uid,
        suggestedFor: moment,
        message: message,
        status: 'pending',
        votes: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }

      await addDoc(collection(db, 'weddings', weddingId, 'suggestions'), suggestionData)

      // Reset form
      setSongTitle('')
      setArtist('')
      setMessage('')
      setSpotifyId('')
      setSearchQuery('')
      setShowSuggestionForm(false)
    } catch (err) {
      console.error('Error suggesting song:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleVote = async (suggestionId: string, value: 1 | -1) => {
    if (!user || !weddingId) return

    try {
      const voteRef = doc(collection(db, 'weddings', weddingId, 'votes'))
      const currentVote = userVotes[suggestionId]

      if (currentVote === value) {
        // Remove vote
        // In a real app, we'd delete the vote document
        return
      }

      // Add or update vote
      await setDoc(voteRef, {
        suggestionId,
        userId: user.uid,
        value,
        createdAt: serverTimestamp()
      })

      // Update suggestion vote count
      const suggestionRef = doc(db, 'weddings', weddingId, 'suggestions', suggestionId)
      const suggestion = suggestions.find(s => s.id === suggestionId)
      if (suggestion) {
        const voteChange = currentVote ? value * 2 : value
        await updateDoc(suggestionRef, {
          votes: suggestion.votes + voteChange
        })
      }
    } catch (err) {
      console.error('Error voting:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen dark-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading...</p>
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
      <header className="relative z-50 glass-darker border-b border-white/10 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold gradient-text">
              {wedding?.coupleNames.join(' & ')}&apos;s Wedding
            </h1>
            <p className="text-sm text-purple-400">Guest Music Suggestions</p>
          </div>
          <Link
            href="/"
            className="text-white/60 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Link>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto p-4 py-8">
        {/* Add suggestion button */}
        <div className="mb-8 text-center">
          <button
            onClick={() => setShowSuggestionForm(true)}
            className="btn-primary"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Suggest a Song
          </button>
        </div>

        {/* Suggestion form modal */}
        {showSuggestionForm && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="glass-darker rounded-xl max-w-md w-full p-6 border border-white/20">
              <h2 className="text-2xl font-bold gradient-text mb-4">Suggest a Song</h2>
              <form onSubmit={handleSuggestSong}>
                {/* Spotify Search */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    Search on Spotify
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for a song..."
                      className="input pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    {searchLoading && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  
                  {/* Search Results Dropdown */}
                  {showSearchResults && searchResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 glass-darker rounded-lg border border-white/20 overflow-hidden">
                      <div className="max-h-60 overflow-y-auto">
                        {searchResults.map((track) => (
                          <button
                            key={track.id}
                            type="button"
                            onClick={() => handleSelectSpotifySong(track)}
                            className="w-full text-left hover:bg-white/10 transition-colors"
                          >
                            <SongCard
                              title={track.name}
                              artist={track.artist}
                              spotifyId={track.id}
                              variant="compact"
                              showPreview={false}
                              showSpotifyLink={false}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    Song Title *
                  </label>
                  <input
                    type="text"
                    value={songTitle}
                    onChange={(e) => {
                      setSongTitle(e.target.value)
                      // Clear spotify ID if manually editing
                      if (spotifyId) setSpotifyId('')
                    }}
                    className="input"
                    placeholder="Or enter manually..."
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    Artist *
                  </label>
                  <input
                    type="text"
                    value={artist}
                    onChange={(e) => {
                      setArtist(e.target.value)
                      // Clear spotify ID if manually editing
                      if (spotifyId) setSpotifyId('')
                    }}
                    className="input"
                    placeholder="Artist name"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    Wedding Moment
                  </label>
                  <select
                    value={moment}
                    onChange={(e) => setMoment(e.target.value as WeddingMoment)}
                    className="input"
                  >
                    {WEDDING_MOMENTS.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.icon} {m.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    Why this song? (optional)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    className="input"
                    placeholder="Share why this song is special..."
                  />
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSuggestionForm(false)
                      setSearchQuery('')
                      setShowSearchResults(false)
                      setSongTitle('')
                      setArtist('')
                      setSpotifyId('')
                    }}
                    className="px-4 py-2 text-white/70 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary"
                  >
                    {submitting ? 'Suggesting...' : 'Suggest Song'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Suggestions list */}
        <div className="space-y-4">
          {suggestions.length === 0 ? (
            <div className="text-center py-12 glass-darker rounded-xl">
              <div className="w-20 h-20 glass rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No suggestions yet</h3>
              <p className="text-white/60">Be the first to suggest a song!</p>
            </div>
          ) : (
            suggestions.map((suggestion) => (
              <div key={suggestion.id} className="card relative overflow-visible">
                <div className="flex items-start gap-4">
                  {/* Song Card */}
                  <div className="flex-1">
                    <SongCard
                      title={suggestion.customSong?.title || ''}
                      artist={suggestion.customSong?.artist || ''}
                      spotifyId={suggestion.spotifyId}
                      variant="default"
                    />
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 text-white/60">
                          {WEDDING_MOMENTS.find(m => m.value === suggestion.suggestedFor)?.icon}
                          <span>{WEDDING_MOMENTS.find(m => m.value === suggestion.suggestedFor)?.label}</span>
                        </span>
                        <span className="text-white/60">
                          {suggestion.votes} {suggestion.votes === 1 ? 'vote' : 'votes'}
                        </span>
                      </div>

                      {suggestion.message && (
                        <p className="text-white/80 italic border-l-2 border-purple-500/50 pl-3">
                          &ldquo;{suggestion.message}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Voting buttons */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleVote(suggestion.id, 1)}
                      className={`group relative p-3 rounded-lg transition-all transform hover:scale-105 ${
                        userVotes[suggestion.id] === 1
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/25'
                          : 'glass hover:bg-white/20'
                      }`}
                      title="Upvote"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                      {userVotes[suggestion.id] === 1 && (
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-400 to-emerald-400 opacity-20 blur animate-pulse"></div>
                      )}
                    </button>
                    <button
                      onClick={() => handleVote(suggestion.id, -1)}
                      className={`group relative p-3 rounded-lg transition-all transform hover:scale-105 ${
                        userVotes[suggestion.id] === -1
                          ? 'bg-gradient-to-r from-red-500 to-rose-500 shadow-lg shadow-red-500/25'
                          : 'glass hover:bg-white/20'
                      }`}
                      title="Downvote"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      {userVotes[suggestion.id] === -1 && (
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-400 to-rose-400 opacity-20 blur animate-pulse"></div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}