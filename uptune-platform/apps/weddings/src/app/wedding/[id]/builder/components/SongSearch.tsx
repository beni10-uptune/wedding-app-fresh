'use client'

import { useState, useEffect, useCallback } from 'react'
import { searchSpotifyTracks, formatDuration } from '@/lib/spotify-client'
import { Song } from '@/types/wedding-v2'
import { Search, Plus, Play, Pause, AlertCircle, Music, Loader2 } from 'lucide-react'
import { debounce } from 'lodash'
import { enrichAndStoreSong } from '@/lib/song-enrichment'

interface SongSearchProps {
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
  external_urls: { spotify: string }
  uri: string
  image: string
  explicit: boolean
}

export default function SongSearch({ onAddSong, selectedMoment }: SongSearchProps) {
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

  const handleAddSong = async (track: SearchResult) => {
    // Create a temporary loading indicator for this specific song
    const songElement = document.getElementById(`song-${track.id}`)
    if (songElement) {
      const addButton = songElement.querySelector('.add-button')
      if (addButton) {
        addButton.innerHTML = '<svg class="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>'
      }
    }
    
    try {
      // Create basic song object
      const basicSong: Partial<Song> = {
        id: track.id,
        title: track.name,
        artist: track.artist,
        album: track.album,
        albumArt: track.image,
        albumImage: track.image,
        duration: Math.round(track.duration_ms / 1000),
        explicit: track.explicit,
        previewUrl: track.preview_url || undefined,
        spotifyUri: track.uri
      }
      
      // Enrich with BPM, audio features, and store in community DB
      const enrichedSong = await enrichAndStoreSong(basicSong, selectedMoment)
      
      // Add enriched song to wedding
      onAddSong(enrichedSong, selectedMoment)
      
      // Show success feedback
      if (enrichedSong.bpm) {
        setError(`✓ Added "${track.name}" (${enrichedSong.bpm} BPM, ${enrichedSong.generationAppeal.join('/')})`)
        setTimeout(() => setError(''), 3000)
      }
      
      // Clear search after adding
      setQuery('')
      setResults([])
    } catch (error) {
      console.error('Error enriching song:', error)
      
      // Fall back to basic song if enrichment fails
      const basicSong: Song = {
        id: track.id,
        title: track.name,
        artist: track.artist,
        album: track.album,
        duration: Math.round(track.duration_ms / 1000),
        energyLevel: 3,
        explicit: track.explicit,
        generationAppeal: ['millennial'],
        genres: [],
        previewUrl: track.preview_url || undefined,
        spotifyUri: track.uri,
        bpm: undefined,
        audioFeatures: undefined
      }
      
      onAddSong(basicSong, selectedMoment)
      setQuery('')
      setResults([])
    }
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
          <div className="p-4 space-y-3">
            {results.map((track) => (
              <div
                key={track.id}
                id={`song-${track.id}`}
                className="glass-darker rounded-lg p-3 hover:ring-1 hover:ring-white/20 transition-all group"
              >
                <div className="flex items-center gap-3">
                  {/* Album Art */}
                  <div className="w-12 h-12 bg-white/10 rounded-lg overflow-hidden flex-shrink-0">
                    {track.image && track.image !== '/api/placeholder/300/300' ? (
                      <img 
                        src={track.image} 
                        alt={track.album}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Music className="w-6 h-6 text-white/40" />
                      </div>
                    )}
                  </div>

                  {/* Song Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-white truncate">
                          {track.name}
                          {track.explicit && (
                            <span className="ml-2 text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">E</span>
                          )}
                        </p>
                        <p className="text-xs text-white/60 truncate">{track.artist}</p>
                      </div>
                      <span className="text-xs text-white/40 flex-shrink-0">
                        {formatDuration(track.duration_ms)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {track.preview_url && (
                      <button
                        onClick={() => handlePlayPause(track)}
                        className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                        title={playingId === track.id ? 'Pause' : 'Play preview'}
                      >
                        {playingId === track.id ? (
                          <Pause className="w-4 h-4 text-white" />
                        ) : (
                          <Play className="w-4 h-4 text-white ml-0.5" />
                        )}
                      </button>
                    )}
                    <button
                      onClick={() => handleAddSong(track)}
                      className="add-button w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center hover:bg-purple-500/30 transition-colors opacity-0 group-hover:opacity-100"
                      title="Add to timeline"
                    >
                      <Plus className="w-4 h-4 text-purple-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !query.trim() && (
          <div className="text-center text-white/40 py-8 px-4">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Search for songs to add to your timeline</p>
            <p className="text-sm mt-1">Try searching for your favorite artists or songs</p>
          </div>
        )}
      </div>
    </div>
  )
}