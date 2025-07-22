'use client'

import { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, Search, Filter, Plus, Heart, Clock, Star, Music } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { musicLibrary, getFilteredSongs, getGenres, getMoods, getEnergyLevels, Song, weddingMoments } from '@/data/musicLibrary'
import MusicPlayer from '@/components/MusicPlayer'
import { searchSpotifyTracks, getSpotifyTrack } from '@/lib/spotify'
import Image from 'next/image'

interface SpotifyTrack {
  id: string
  name: string
  artist: string
  album: string
  duration_ms: number
  preview_url: string | null
  external_urls: { spotify: string }
  uri: string
  image?: string
}

interface EnhancedSong extends Song {
  spotifyData?: SpotifyTrack
}

export default function MusicLibraryPage({ params }: { params: Promise<{ id: string }> }) {
  const { } = useAuth()
  const [songs, setSongs] = useState<EnhancedSong[]>(musicLibrary)
  const [filters, setFilters] = useState({
    moment: '',
    genre: '',
    mood: '',
    energy: '',
    search: ''
  })
  const [showFilters, setShowFilters] = useState(false)
  const [selectedSongs, setSelectedSongs] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [playlists, setPlaylists] = useState<{ id: string; name: string; moment: string }[]>([])
  const [weddingId, setWeddingId] = useState<string>('')
  const [spotifySearchResults, setSpotifySearchResults] = useState<SpotifyTrack[]>([])
  const [isSearchingSpotify, setIsSearchingSpotify] = useState(false)
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null)

  useEffect(() => {
    params.then((p) => {
      setWeddingId(p.id)
    })
  }, [params])

  useEffect(() => {
    const fetchPlaylistsEffect = async () => {
      if (weddingId) {
        await fetchPlaylists()
      }
    }
    fetchPlaylistsEffect()
  }, [weddingId])

  useEffect(() => {
    const filtered = getFilteredSongs(filters)
    setSongs(filtered)
  }, [filters])

  // Load Spotify data for songs with spotify_id
  useEffect(() => {
    const loadSpotifyData = async () => {
      const songsWithSpotifyIds = songs.filter(song => song.spotify_id)
      
      for (const song of songsWithSpotifyIds) {
        if (song.spotify_id && !song.spotifyData) {
          try {
            const trackData = await getSpotifyTrack(song.spotify_id)
            if (trackData) {
              setSongs(prev => prev.map(s => 
                s.id === song.id 
                  ? { ...s, spotifyData: trackData as SpotifyTrack }
                  : s
              ))
            }
          } catch (error) {
            console.error(`Failed to load Spotify data for ${song.title}:`, error)
          }
        }
      }
    }

    loadSpotifyData()
  }, [songs.length])

  const fetchPlaylists = async () => {
    try {
      if (!weddingId) return
      // const playlistsSnapshot = await collection(db, 'weddings', weddingId, 'playlists')
      // In a real app, you'd fetch the actual playlists here
      // For now, we'll use mock data
      setPlaylists([
        { id: 'ceremony', name: 'Ceremony', moment: 'ceremony' },
        { id: 'cocktail', name: 'Cocktail Hour', moment: 'cocktail' },
        { id: 'dinner', name: 'Dinner', moment: 'dinner' },
        { id: 'dancing', name: 'Dancing', moment: 'dancing' }
      ])
    } catch (error) {
      console.error('Error fetching playlists:', error)
    }
  }

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      moment: '',
      genre: '',
      mood: '',
      energy: '',
      search: ''
    })
    setSpotifySearchResults([])
  }

  // Search Spotify
  const searchSpotify = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSpotifySearchResults([])
      return
    }

    setIsSearchingSpotify(true)
    try {
      const results = await searchSpotifyTracks(query, 5)
      setSpotifySearchResults(results)
    } catch (error) {
      console.error('Spotify search error:', error)
      setSpotifySearchResults([])
    } finally {
      setIsSearchingSpotify(false)
    }
  }, [])

  // Debounced Spotify search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.search) {
        searchSpotify(filters.search)
      } else {
        setSpotifySearchResults([])
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [filters.search, searchSpotify])

  const toggleSongSelection = (songId: string) => {
    setSelectedSongs(prev => {
      const newSet = new Set(prev)
      if (newSet.has(songId)) {
        newSet.delete(songId)
      } else {
        newSet.add(songId)
      }
      return newSet
    })
  }

  const addToPlaylist = async (playlistId: string) => {
    if (selectedSongs.size === 0) return
    
    setLoading(true)
    try {
      const selectedSongObjects = songs.filter(song => selectedSongs.has(song.id))
      
      // In a real app, you'd update the playlist in Firestore
      console.log('Adding songs to playlist:', playlistId, selectedSongObjects)
      
      // Clear selection
      setSelectedSongs(new Set())
      
      // Show success message (you could add a toast here)
      alert(`Added ${selectedSongs.size} songs to playlist!`)
    } catch (error) {
      console.error('Error adding songs to playlist:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
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

  const getEnergyColor = (energy: string) => {
    switch (energy) {
      case 'low': return 'text-blue-400 bg-blue-400/10'
      case 'medium': return 'text-orange-400 bg-orange-400/10'
      case 'high': return 'text-red-400 bg-red-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  return (
    <div className="min-h-screen dark-gradient relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-purple w-96 h-96 -top-48 -right-48"></div>
        <div className="orb orb-blue w-96 h-96 -bottom-48 -left-48"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full bg-purple-600/10 animate-spin-slow"></div>
      </div>
      {/* Header */}
      <header className="relative z-50 glass-darker border-b border-white/10">
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
              <div>
                <h1 className="text-2xl font-serif font-bold text-white">Music Library</h1>
                <p className="text-white/60">Discover your perfect wedding soundtrack</p>
              </div>
            </div>
            
            {selectedSongs.size > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-white/60">
                  {selectedSongs.size} song{selectedSongs.size !== 1 ? 's' : ''} selected
                </span>
                <div className="flex gap-2">
                  {playlists.map(playlist => (
                    <button
                      key={playlist.id}
                      onClick={() => addToPlaylist(playlist.id)}
                      disabled={loading}
                      className="btn-primary"
                    >
                      <Plus className="w-4 h-4" />
                      {playlist.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 py-6 relative z-10">
        <div className="glass-darker rounded-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Search our library or find songs on Spotify..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="input pl-10"
              />
              {isSearchingSpotify && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-purple-500 border-t-transparent"></div>
                </div>
              )}
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                showFilters ? 'btn-primary' : 'btn-glass'
              }`}
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Moment</label>
                <select
                  value={filters.moment}
                  onChange={(e) => handleFilterChange('moment', e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">All Moments</option>
                  {weddingMoments.map(moment => (
                    <option key={moment} value={moment}>
                      {moment.charAt(0).toUpperCase() + moment.slice(1).replace('-', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Genre</label>
                <select
                  value={filters.genre}
                  onChange={(e) => handleFilterChange('genre', e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">All Genres</option>
                  {getGenres().map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Mood</label>
                <select
                  value={filters.mood}
                  onChange={(e) => handleFilterChange('mood', e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">All Moods</option>
                  {getMoods().map(mood => (
                    <option key={mood} value={mood}>{mood}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Energy</label>
                <select
                  value={filters.energy}
                  onChange={(e) => handleFilterChange('energy', e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">All Energy</option>
                  {getEnergyLevels().map(energy => (
                    <option key={energy} value={energy}>
                      {energy.charAt(0).toUpperCase() + energy.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 text-white/60 hover:text-white transition-colors border border-white/10 rounded-lg hover:border-white/20 hover:bg-white/5"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Spotify Search Results */}
        {spotifySearchResults.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Music className="w-5 h-5" />
              Spotify Search Results
            </h3>
            <div className="space-y-4">
              {spotifySearchResults.map(track => (
                <MusicPlayer
                  key={track.id}
                  trackId={track.id}
                  trackName={track.name}
                  artistName={track.artist}
                  previewUrl={track.preview_url}
                  spotifyUrl={track.external_urls.spotify}
                  imageUrl={track.image}
                  duration={track.duration_ms}
                  onPlay={() => setCurrentlyPlayingId(track.id)}
                  className="hover:bg-white/[0.08] transition-colors"
                />
              ))}
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            {songs.length} song{songs.length !== 1 ? 's' : ''} in our library
          </h2>
          <div className="text-sm text-white/60">
            Click songs to select, then add to playlists
          </div>
        </div>

        {/* Song List */}
        <div className="space-y-4">
          {songs.map(song => (
            <div
              key={song.id}
              onClick={() => toggleSongSelection(song.id)}
              className={`glass rounded-xl p-6 hover:bg-white/[0.15] transition-all duration-300 cursor-pointer border-2 ${
                selectedSongs.has(song.id) 
                  ? 'border-purple-500 bg-purple-500/10' 
                  : 'border-transparent hover:border-purple-500/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    {song.spotifyData?.image ? (
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={song.spotifyData.image}
                          alt={`${song.title} album art`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="text-2xl">🎵</div>
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-white">{song.title}</h3>
                      <p className="text-white/70">{song.artist}</p>
                      {song.album && (
                        <p className="text-sm text-white/50">{song.album} • {song.year}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEnergyColor(song.energy)}`}>
                      {song.energy} energy
                    </span>
                    <span className="px-3 py-1 bg-white/10 text-white/70 rounded-full text-sm font-medium">
                      {song.genre}
                    </span>
                    <span className="px-3 py-1 bg-white/10 text-white/70 rounded-full text-sm font-medium">
                      {song.mood}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-white/60">{song.popularity}/100</span>
                    </div>
                    {song.duration && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-white/40" />
                        <span className="text-sm text-white/60">{formatDuration(song.duration)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {song.moments.map(moment => (
                      <span
                        key={moment}
                        className="flex items-center gap-1 px-2 py-1 bg-purple-500/20 rounded-full text-sm text-purple-300"
                      >
                        <span>{getMomentIcon(moment)}</span>
                        {moment.replace('-', ' ')}
                      </span>
                    ))}
                  </div>

                  {song.why_recommended && (
                    <p className="text-white/60 text-sm mb-2">
                      <strong>Why we recommend it:</strong> {song.why_recommended}
                    </p>
                  )}

                  {song.story && (
                    <p className="text-white/60 text-sm italic">
                      {song.story}
                    </p>
                  )}

                  {/* Spotify Preview Player */}
                  {song.spotifyData && (
                    <div className="mt-4">
                      <MusicPlayer
                        trackId={song.spotifyData.id}
                        trackName={song.title}
                        artistName={song.artist}
                        previewUrl={song.spotifyData.preview_url}
                        spotifyUrl={song.spotifyData.external_urls.spotify}
                        imageUrl={song.spotifyData.image}
                        duration={song.spotifyData.duration_ms}
                        onPlay={() => setCurrentlyPlayingId(song.id)}
                        className="bg-black/20"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 ml-6">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleSongSelection(song.id)
                    }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      selectedSongs.has(song.id)
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/10 text-white/60 hover:bg-purple-500/20'
                    }`}
                  >
                    {selectedSongs.has(song.id) ? (
                      <Heart className="w-5 h-5 fill-current" />
                    ) : (
                      <Plus className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {songs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎵</div>
            <h3 className="text-xl font-bold text-white mb-2">No songs found</h3>
            <p className="text-white/60 mb-6">
              Try adjusting your filters or search terms
            </p>
            <button
              onClick={clearFilters}
              className="btn-primary"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}