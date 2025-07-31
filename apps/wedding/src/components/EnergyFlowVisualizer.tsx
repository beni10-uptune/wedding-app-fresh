'use client'

import { useState, useEffect } from 'react'
import { Activity, Music, TrendingUp, TrendingDown, Zap } from 'lucide-react'
import { Song, WeddingMoment } from '@/types/wedding-v2'
import { ALL_WEDDING_SONGS } from '@/data/spotify-wedding-songs'

interface EnergyPoint {
  time: string
  energy: number
  moment: string
  songs: Song[]
}

interface EnergyFlowVisualizerProps {
  weddingMoments: WeddingMoment[]
  selectedSongs: Record<string, Song[]>
  onSuggestSong: (moment: string, song: Song) => void
}

export function EnergyFlowVisualizer({ 
  weddingMoments, 
  selectedSongs, 
  onSuggestSong 
}: EnergyFlowVisualizerProps) {
  const [energyFlow, setEnergyFlow] = useState<EnergyPoint[]>([])
  const [suggestions, setSuggestions] = useState<Record<string, Song[]>>({})

  // Calculate energy flow from selected songs
  useEffect(() => {
    const flow: EnergyPoint[] = weddingMoments.map((moment, index) => {
      const songs = selectedSongs[moment.id] || []
      const avgEnergy = songs.length > 0
        ? songs.reduce((sum, song) => sum + song.energyLevel, 0) / songs.length
        : 3 // Default middle energy

      // Simple time calculation (could be enhanced with actual timeline)
      const hour = 18 + Math.floor(index * 0.5) // Start at 6pm
      const minutes = (index % 2) * 30
      const time = `${hour}:${minutes.toString().padStart(2, '0')}`

      return {
        time,
        energy: avgEnergy,
        moment: moment.name,
        songs
      }
    })

    setEnergyFlow(flow)
    generateSuggestions(flow)
  }, [weddingMoments, selectedSongs])

  // Generate suggestions for better flow
  const generateSuggestions = (flow: EnergyPoint[]) => {
    const newSuggestions: Record<string, Song[]> = {}

    flow.forEach((point, index) => {
      const prevEnergy = index > 0 ? flow[index - 1].energy : point.energy
      const nextEnergy = index < flow.length - 1 ? flow[index + 1].energy : point.energy
      
      // Check for energy gaps
      const prevGap = Math.abs(point.energy - prevEnergy)
      const nextGap = Math.abs(point.energy - nextEnergy)

      if (prevGap > 2 || nextGap > 2) {
        // Need transition songs
        const targetEnergy = (prevEnergy + nextEnergy) / 2
        const transitionSongs = ALL_WEDDING_SONGS
          .filter(song => {
            const energyDiff = Math.abs(song.energyLevel - targetEnergy)
            return energyDiff <= 1 && !song.explicit
          })
          .sort((a, b) => {
            // Prefer songs with good transitions
            const aScore = Math.abs(a.energyLevel - targetEnergy)
            const bScore = Math.abs(b.energyLevel - targetEnergy)
            return aScore - bScore
          })
          .slice(0, 3)

        newSuggestions[point.moment] = transitionSongs
      }
    })

    setSuggestions(newSuggestions)
  }

  // Get energy level description
  const getEnergyDescription = (energy: number) => {
    if (energy <= 1.5) return 'Very Mellow'
    if (energy <= 2.5) return 'Relaxed'
    if (energy <= 3.5) return 'Moderate'
    if (energy <= 4.5) return 'Upbeat'
    return 'High Energy'
  }

  // Get energy color
  const getEnergyColor = (energy: number) => {
    if (energy <= 2) return 'from-blue-400 to-cyan-400'
    if (energy <= 3) return 'from-green-400 to-emerald-400'
    if (energy <= 4) return 'from-yellow-400 to-orange-400'
    return 'from-orange-400 to-red-400'
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-6">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Activity className="w-6 h-6" />
          Energy Flow Visualizer
        </h2>
        <p className="text-gray-600">
          Design the perfect energy journey for your reception
        </p>
      </div>

      {/* Energy Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="relative h-64 mb-4">
          {/* Grid */}
          <div className="absolute inset-0 grid grid-rows-5 border-l border-b">
            {[5, 4, 3, 2, 1].map(level => (
              <div key={level} className="border-t border-gray-100 relative">
                <span className="absolute -left-8 -top-2 text-xs text-gray-500">
                  {level}
                </span>
              </div>
            ))}
          </div>

          {/* Energy Line */}
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="50%" stopColor="#EC4899" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
            </defs>
            
            {/* Draw line connecting energy points */}
            <polyline
              fill="none"
              stroke="url(#energyGradient)"
              strokeWidth="3"
              points={energyFlow.map((point, index) => {
                const x = (index / (energyFlow.length - 1)) * 100
                const y = 100 - (point.energy / 5) * 100
                return `${x}%,${y}%`
              }).join(' ')}
            />
            
            {/* Draw points */}
            {energyFlow.map((point, index) => {
              const x = (index / (energyFlow.length - 1)) * 100
              const y = 100 - (point.energy / 5) * 100
              return (
                <circle
                  key={index}
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="6"
                  fill="white"
                  stroke="url(#energyGradient)"
                  strokeWidth="3"
                />
              )
            })}
          </svg>
        </div>

        {/* Timeline Labels */}
        <div className="flex justify-between text-xs text-gray-500 px-2">
          {energyFlow.map((point, index) => (
            <div key={index} className="text-center">
              <p className="font-medium">{point.time}</p>
              <p>{point.moment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Moment Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {energyFlow.map((point, index) => {
          const prevEnergy = index > 0 ? energyFlow[index - 1].energy : point.energy
          const energyChange = point.energy - prevEnergy
          const hasSuggestions = suggestions[point.moment]?.length > 0

          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{point.moment}</h3>
                <div className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getEnergyColor(point.energy)} text-white`}>
                  {getEnergyDescription(point.energy)}
                </div>
              </div>

              {/* Energy Change Indicator */}
              {index > 0 && Math.abs(energyChange) > 0.5 && (
                <div className="flex items-center gap-1 mb-2 text-sm">
                  {energyChange > 0 ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-green-600">Energy increasing</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-4 h-4 text-blue-500" />
                      <span className="text-blue-600">Energy decreasing</span>
                    </>
                  )}
                </div>
              )}

              {/* Current Songs */}
              <div className="mb-3">
                <p className="text-sm text-gray-600 mb-1">
                  {point.songs.length} songs selected
                </p>
                {point.songs.length === 0 && (
                  <p className="text-xs text-gray-400">No songs added yet</p>
                )}
              </div>

              {/* Suggestions */}
              {hasSuggestions && (
                <div className="border-t pt-3">
                  <p className="text-xs font-medium text-purple-600 mb-2 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Suggested for better flow
                  </p>
                  <div className="space-y-1">
                    {suggestions[point.moment].slice(0, 2).map(song => (
                      <button
                        key={song.id}
                        onClick={() => onSuggestSong(point.moment, song)}
                        className="w-full text-left p-2 rounded hover:bg-gray-50 text-xs"
                      >
                        <p className="font-medium truncate">{song.title}</p>
                        <p className="text-gray-500 truncate">{song.artist}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Energy Tips */}
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Smooth Transitions</h4>
          <p className="text-sm text-blue-800">
            Avoid jumping more than 2 energy levels between moments. Use transition songs to bridge gaps.
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
          <h4 className="font-medium text-purple-900 mb-2">Peak Timing</h4>
          <p className="text-sm text-purple-800">
            Plan your highest energy for 9-10pm when the dance floor is fullest and guests are ready to party.
          </p>
        </div>
      </div>
    </div>
  )
}