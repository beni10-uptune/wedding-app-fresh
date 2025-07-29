'use client'

import { useState, useEffect } from 'react'
import { Users, Music, Sparkles, ChevronRight } from 'lucide-react'
import { ALL_WEDDING_SONGS } from '@/data/spotify-wedding-songs'
import { Song } from '@/types/wedding-v2'

interface GenerationMixerProps {
  currentSongs: Song[]
  onAddSongs: (songs: Song[]) => void
}

interface GenerationData {
  name: string
  ageRange: string
  yearRange: string
  count: number
  percentage: number
  suggestedCount: number
  color: string
  icon: string
}

export function GenerationMixer({ currentSongs, onAddSongs }: GenerationMixerProps) {
  const [generations, setGenerations] = useState<GenerationData[]>([])
  const [suggestions, setSuggestions] = useState<Record<string, Song[]>>({})
  const [showSuggestions, setShowSuggestions] = useState<string | null>(null)

  // Analyze current generation mix
  useEffect(() => {
    // Estimate generation from release dates and artist patterns
    const genCounts = {
      boomer: 0,
      gen_x: 0,
      millennial: 0,
      gen_z: 0
    }

    currentSongs.forEach(song => {
      // Use explicit generation data if available
      if (song.generationAppeal?.length > 0) {
        song.generationAppeal.forEach(gen => {
          genCounts[gen]++
        })
      } else {
        // Estimate from artist/title patterns
        const year = extractYear(song)
        if (year) {
          if (year < 1980) genCounts.boomer++
          else if (year < 1995) genCounts.gen_x++
          else if (year < 2010) genCounts.millennial++
          else genCounts.gen_z++
        } else {
          // Default to millennial if unknown
          genCounts.millennial++
        }
      }
    })

    const total = Object.values(genCounts).reduce((sum, count) => sum + count, 0) || 1

    // Calculate ideal distribution (adjust based on your target)
    const idealDistribution = {
      boomer: 0.15,      // 15% for grandparents
      gen_x: 0.25,       // 25% for parents
      millennial: 0.40,  // 40% for couple/friends
      gen_z: 0.20        // 20% for younger guests
    }

    const generationData: GenerationData[] = [
      {
        name: 'Boomer',
        ageRange: '60+',
        yearRange: '1960s-70s',
        count: genCounts.boomer,
        percentage: (genCounts.boomer / total) * 100,
        suggestedCount: Math.max(0, Math.round(total * idealDistribution.boomer) - genCounts.boomer),
        color: 'from-blue-500 to-indigo-500',
        icon: '👴'
      },
      {
        name: 'Gen X',
        ageRange: '45-60',
        yearRange: '1980s-90s',
        count: genCounts.gen_x,
        percentage: (genCounts.gen_x / total) * 100,
        suggestedCount: Math.max(0, Math.round(total * idealDistribution.gen_x) - genCounts.gen_x),
        color: 'from-purple-500 to-pink-500',
        icon: '🕺'
      },
      {
        name: 'Millennial',
        ageRange: '30-45',
        yearRange: '2000s-10s',
        count: genCounts.millennial,
        percentage: (genCounts.millennial / total) * 100,
        suggestedCount: Math.max(0, Math.round(total * idealDistribution.millennial) - genCounts.millennial),
        color: 'from-pink-500 to-rose-500',
        icon: '💃'
      },
      {
        name: 'Gen Z',
        ageRange: '18-30',
        yearRange: '2020s',
        count: genCounts.gen_z,
        percentage: (genCounts.gen_z / total) * 100,
        suggestedCount: Math.max(0, Math.round(total * idealDistribution.gen_z) - genCounts.gen_z),
        color: 'from-emerald-500 to-teal-500',
        icon: '🎉'
      }
    ]

    setGenerations(generationData)
    generateSuggestions(generationData)
  }, [currentSongs])

  // Extract year from song data
  const extractYear = (song: Song): number | null => {
    // Check release date first
    if (song.releaseDate) {
      return parseInt(song.releaseDate.substring(0, 4))
    }
    
    // Check for year in title
    const yearMatch = song.title.match(/\b(19|20)\d{2}\b/)
    if (yearMatch) {
      return parseInt(yearMatch[0])
    }

    // Estimate from artist
    const artistYears: Record<string, number> = {
      'Beatles': 1965,
      'Elvis': 1960,
      'Sinatra': 1955,
      'Queen': 1975,
      'Madonna': 1985,
      'Spice Girls': 1995,
      'Backstreet': 1998,
      'Beyoncé': 2005,
      'Swift': 2015,
      'Bieber': 2015,
      'Sheeran': 2015,
      'Eilish': 2020
    }

    for (const [artist, year] of Object.entries(artistYears)) {
      if (song.artist.includes(artist)) return year
    }

    return null
  }

  // Generate song suggestions for each generation
  const generateSuggestions = (genData: GenerationData[]) => {
    const newSuggestions: Record<string, Song[]> = {}

    genData.forEach(gen => {
      if (gen.suggestedCount > 0) {
        // Find songs that appeal to this generation
        let genSongs: Song[] = []

        if (gen.name === 'Boomer') {
          genSongs = ALL_WEDDING_SONGS.filter(song => {
            const year = extractYear(song)
            return year && year < 1980 && !song.explicit
          })
        } else if (gen.name === 'Gen X') {
          genSongs = ALL_WEDDING_SONGS.filter(song => {
            const year = extractYear(song)
            return year && year >= 1980 && year < 1995 && !song.explicit
          })
        } else if (gen.name === 'Millennial') {
          genSongs = ALL_WEDDING_SONGS.filter(song => {
            const year = extractYear(song)
            return year && year >= 1995 && year < 2010
          })
        } else if (gen.name === 'Gen Z') {
          genSongs = ALL_WEDDING_SONGS.filter(song => {
            const year = extractYear(song)
            return year && year >= 2010
          })
        }

        // Sort by popularity if available
        genSongs.sort((a, b) => (b.popularity || 0) - (a.popularity || 0))

        // Filter out already selected songs
        const currentSongIds = new Set(currentSongs.map(s => s.id))
        genSongs = genSongs.filter(song => !currentSongIds.has(song.id))

        newSuggestions[gen.name] = genSongs.slice(0, 10)
      }
    })

    setSuggestions(newSuggestions)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-6">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Users className="w-6 h-6" />
          Generation Mixer
        </h2>
        <p className="text-gray-600">
          Ensure every age group has songs they'll love
        </p>
      </div>

      {/* Generation Breakdown */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 className="font-semibold mb-4">Current Mix</h3>
        
        {/* Visual Bar Chart */}
        <div className="mb-6">
          <div className="flex h-8 rounded-lg overflow-hidden">
            {generations.map((gen, index) => (
              <div
                key={gen.name}
                className={`bg-gradient-to-r ${gen.color} transition-all duration-500`}
                style={{ width: `${gen.percentage}%` }}
                title={`${gen.name}: ${gen.percentage.toFixed(1)}%`}
              />
            ))}
          </div>
        </div>

        {/* Generation Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {generations.map(gen => (
            <div key={gen.name} className="relative">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{gen.icon}</span>
                  <span className="text-sm font-medium">{gen.percentage.toFixed(0)}%</span>
                </div>
                <h4 className="font-medium">{gen.name}</h4>
                <p className="text-xs text-gray-600">{gen.ageRange}</p>
                <p className="text-xs text-gray-500">{gen.yearRange}</p>
                <p className="text-sm font-medium mt-2">{gen.count} songs</p>
                
                {gen.suggestedCount > 0 && (
                  <button
                    onClick={() => setShowSuggestions(showSuggestions === gen.name ? null : gen.name)}
                    className="mt-2 text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    Add {gen.suggestedCount} more
                    <ChevronRight className={`w-3 h-3 transition-transform ${showSuggestions === gen.name ? 'rotate-90' : ''}`} />
                  </button>
                )}
              </div>
              
              {/* Balance Indicator */}
              {gen.suggestedCount > 0 && (
                <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                  +{gen.suggestedCount}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      {showSuggestions && suggestions[showSuggestions]?.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-semibold mb-4">
            Suggested {showSuggestions} Songs
          </h3>
          
          <div className="grid md:grid-cols-2 gap-2 mb-4">
            {suggestions[showSuggestions].slice(0, 6).map(song => (
              <div
                key={song.id}
                className="flex items-center gap-3 p-2 rounded-lg border hover:bg-gray-50"
              >
                {song.albumImage ? (
                  <img 
                    src={song.albumImage} 
                    alt={song.album}
                    className="w-10 h-10 rounded"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded flex items-center justify-center">
                    <Music className="w-5 h-5 text-white" />
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{song.title}</p>
                  <p className="text-xs text-gray-600 truncate">{song.artist}</p>
                </div>
                
                {song.releaseDate && (
                  <p className="text-xs text-gray-500">
                    {song.releaseDate.substring(0, 4)}
                  </p>
                )}
              </div>
            ))}
          </div>
          
          <button
            onClick={() => {
              onAddSongs(suggestions[showSuggestions].slice(0, 6))
              setShowSuggestions(null)
            }}
            className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Add These Songs
          </button>
        </div>
      )}

      {/* Tips */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Generation Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Include at least 2-3 songs from each generation</li>
          <li>• Place older generation songs during dinner or early dancing</li>
          <li>• Save current hits for peak party time</li>
          <li>• Consider a "decades medley" to engage everyone</li>
        </ul>
      </div>
    </div>
  )
}