'use client'

import { useState, useEffect } from 'react'
import { Search, Music, TrendingUp, Clock, Sparkles, Filter } from 'lucide-react'
import { ALL_WEDDING_SONGS, SPOTIFY_WEDDING_SONGS } from '@/data/spotify-wedding-songs'
import { Song } from '@/types/wedding-v2'
import { getSmartRecommendations, getTrendingSongs, groupSongsByEra } from '@/lib/song-analytics'

interface EnhancedSongSearchProps {
  moment?: string
  onSelectSong: (song: Song) => void
  existingSongs?: string[]
}

export function EnhancedSongSearch({ moment, onSelectSong, existingSongs = [] }: EnhancedSongSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEra, setSelectedEra] = useState<string | null>(null)
  const [energyLevel, setEnergyLevel] = useState<number>(3)
  const [showFilters, setShowFilters] = useState(false)
  const [view, setView] = useState<'search' | 'trending' | 'curated'>('search')
  const [results, setResults] = useState<Song[]>([])

  // Get songs by category
  const trendingSongs = getTrendingSongs(10)
  const songsByEra = groupSongsByEra()
  const momentSongs = moment ? (SPOTIFY_WEDDING_SONGS[moment] || []) : ALL_WEDDING_SONGS

  // Search and filter logic
  useEffect(() => {
    if (view === 'search') {
      let filtered = momentSongs

      // Text search
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        filtered = filtered.filter(song => 
          song.title.toLowerCase().includes(query) ||
          song.artist.toLowerCase().includes(query) ||
          song.album?.toLowerCase().includes(query)
        )
      }

      // Era filter
      if (selectedEra && songsByEra[selectedEra]) {
        const eraSongIds = new Set(songsByEra[selectedEra].map(s => s.id))
        filtered = filtered.filter(song => eraSongIds.has(song.id))
      }

      // Energy filter
      filtered = filtered.filter(song => 
        Math.abs(song.energyLevel - energyLevel) <= 1
      )

      // Remove existing songs
      filtered = filtered.filter(song => !existingSongs.includes(song.id))

      setResults(filtered.slice(0, 50))
    } else if (view === 'trending') {
      setResults(trendingSongs.filter(song => !existingSongs.includes(song.id)))
    } else if (view === 'curated') {
      setResults(getSmartRecommendations(moment || '', existingSongs))
    }
  }, [searchQuery, selectedEra, energyLevel, view, moment, existingSongs])

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* View Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setView('search')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            view === 'search' ? 'bg-purple-600 text-white' : 'bg-gray-100'
          }`}
        >
          <Search className="w-4 h-4" />
          Search
        </button>
        <button
          onClick={() => setView('trending')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            view === 'trending' ? 'bg-purple-600 text-white' : 'bg-gray-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Trending
        </button>
        <button
          onClick={() => setView('curated')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            view === 'curated' ? 'bg-purple-600 text-white' : 'bg-gray-100'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          For You
        </button>
      </div>

      {/* Search Bar */}
      {view === 'search' && (
        <>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${moment ? moment.replace('-', ' ') : 'wedding'} songs...`}
              className="w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4 space-y-4">
              {/* Era Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Era</label>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(songsByEra).map(era => (
                    <button
                      key={era}
                      onClick={() => setSelectedEra(selectedEra === era ? null : era)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedEra === era 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-white border hover:border-purple-300'
                      }`}
                    >
                      {era}
                    </button>
                  ))}
                </div>
              </div>

              {/* Energy Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Energy Level: {energyLevel}
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={energyLevel}
                  onChange={(e) => setEnergyLevel(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Mellow</span>
                  <span>Balanced</span>
                  <span>Upbeat</span>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Results Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">
          {view === 'trending' && 'Trending at Weddings'}
          {view === 'curated' && `Recommended for ${moment?.replace('-', ' ') || 'Your Wedding'}`}
          {view === 'search' && `${results.length} Songs Found`}
        </h3>
      </div>

      {/* Song Results */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {results.map((song) => (
          <div
            key={song.id}
            onClick={() => onSelectSong(song)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer border"
          >
            {/* Album Art */}
            {song.albumImage ? (
              <img 
                src={song.albumImage} 
                alt={song.album}
                className="w-12 h-12 rounded"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
            )}
            
            {/* Song Info */}
            <div className="flex-1">
              <p className="font-medium">{song.title}</p>
              <p className="text-sm text-gray-600">{song.artist}</p>
            </div>

            {/* Metadata */}
            <div className="text-right">
              <p className="text-sm text-gray-500">
                {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
              </p>
              <div className="flex gap-1 justify-end mt-1">
                {[...Array(song.energyLevel)].map((_, i) => (
                  <div key={i} className="w-1 h-3 bg-purple-400 rounded-full" />
                ))}
                {[...Array(5 - song.energyLevel)].map((_, i) => (
                  <div key={i} className="w-1 h-3 bg-gray-200 rounded-full" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {results.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Music className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>No songs found matching your criteria</p>
        </div>
      )}
    </div>
  )
}