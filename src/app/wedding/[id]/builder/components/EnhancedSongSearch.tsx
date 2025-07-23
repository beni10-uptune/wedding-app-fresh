'use client'

import { useState, useEffect, useCallback } from 'react'
import { searchSpotifyTracks } from '@/lib/spotify-client'
import { Song } from '@/types/wedding-v2'
import { Search, AlertCircle, Music } from 'lucide-react'
import { debounce } from 'lodash'
import UnifiedSongCard from './UnifiedSongCard'

interface EnhancedSongSearchProps {
  onAddSong: (song: Song, momentId: string) => void
  selectedMoment: string
}

interface SearchResult {
  id: string
  name: string
  artist: string
  album: string
  duration_ms: number
  preview_url: string | null
  uri: string
  image?: string
  explicit?: boolean
}

export default function EnhancedSongSearch({ onAddSong, selectedMoment }: EnhancedSongSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioElement) {
        audioElement.pause()
        audioElement.src = ''
      }
    }
  }, [audioElement])

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([])
        return
      }

      setLoading(true)
      setError('')

      try {
        const tracks = await searchSpotifyTracks(searchQuery)
        setResults(tracks)
      } catch (err) {
        console.error('Search error:', err)
        setError('Failed to search songs. Please try again.')
      } finally {
        setLoading(false)
      }
    }, 300),
    []
  )

  useEffect(() => {
    debouncedSearch(query)
  }, [query, debouncedSearch])

  const handlePlayPause = (track: SearchResult) => {
    if (playingId === track.id) {
      // Stop playing
      if (audioElement) {
        audioElement.pause()
        audioElement.src = ''
      }
      setPlayingId(null)
    } else {
      // Start playing
      if (audioElement) {
        audioElement.pause()
      }

      if (track.preview_url) {
        const audio = new Audio(track.preview_url)
        audio.volume = 0.5
        audio.play().catch(err => {
          console.error('Failed to play preview:', err)
          setError('Preview not available for this track')
        })

        audio.addEventListener('ended', () => {
          setPlayingId(null)
        })

        setAudioElement(audio)
        setPlayingId(track.id)
      } else {
        setError('No preview available for this track')
      }
    }
  }

  const convertToSong = (track: SearchResult): Song => ({
    id: track.id,
    title: track.name,
    artist: track.artist,
    album: track.album,
    albumArt: track.image,
    duration: Math.round(track.duration_ms / 1000),
    energyLevel: 3, // Default
    explicit: track.explicit || false,
    generationAppeal: ['millennial', 'gen_z'], // Default
    genres: [], // Could be fetched from Spotify
    previewUrl: track.preview_url || undefined,
    spotifyUri: track.uri,
    bpm: undefined,
    audioFeatures: undefined
  })

  const handleAddToMoment = (track: SearchResult, momentId: string) => {
    const song = convertToSong(track)
    onAddSong(song, momentId)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Search Input */}
      <div className="p-4 border-b border-white/10">
        <h3 className="text-lg font-semibold text-white mb-3">Add Custom Songs</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search any song..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-purple-400"
            data-tutorial="search-input"
          />
        </div>
      </div>

      {/* Search Results */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-3 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {error && (
          <div className="p-4">
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-200">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && results.length === 0 && query.trim() && (
          <div className="text-center py-8 px-4">
            <Music className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/60">No songs found for "{query}"</p>
            <p className="text-sm text-white/40 mt-1">Try a different search term</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="p-4 space-y-2">
            {results.map((track, index) => (
              <div key={track.id} data-tutorial={index === 0 ? "song-card" : undefined}>
                <UnifiedSongCard
                  song={convertToSong(track)}
                  source="search"
                  index={index}
                  isPlaying={playingId === track.id}
                  onPlay={() => handlePlayPause(track)}
                  onPause={() => {
                    if (audioElement) {
                      audioElement.pause()
                      setPlayingId(null)
                    }
                  }}
                  onAddToMoment={(momentId) => handleAddToMoment(track, momentId)}
                />
              </div>
            ))}
          </div>
        )}

        {!loading && !query.trim() && (
          <div className="py-8 px-4">
            <div className="text-center mb-6">
              <Search className="w-12 h-12 mx-auto mb-3 text-white/30" />
              <p className="text-white/60 font-medium">Search for songs to add to your timeline</p>
              <p className="text-sm text-white/40 mt-1">
                Type an artist, song title, or lyrics to get started
              </p>
            </div>
            
            {/* Quick Search Suggestions */}
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-xs font-medium text-white/60 mb-3">Popular searches:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  'Ed Sheeran Perfect',
                  'First Dance Songs',
                  'John Legend',
                  'Classic Love Songs',
                  'Upbeat Party',
                  'Father Daughter Dance'
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setQuery(suggestion)}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-sm text-white/80 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Pro Tips */}
            <div className="mt-6 text-xs text-white/40 space-y-1">
              <p>💡 Pro tips:</p>
              <p>• Click any song to preview it</p>
              <p>• Use the "+ Add" button to choose specific moments</p>
              <p>• Drag songs directly to timeline moments</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}