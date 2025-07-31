'use client'

import { useState, useEffect } from 'react'
import { Clock, Music, Play, Info } from 'lucide-react'
import { SPOTIFY_WEDDING_SONGS, ALL_WEDDING_SONGS } from '@/data/spotify-wedding-songs'
import { Song } from '@/types/wedding-v2'

interface ProcessionalTimerProps {
  onSelectSong: (song: Song) => void
}

export function ProcessionalTimer({ onSelectSong }: ProcessionalTimerProps) {
  const [aisleLength, setAisleLength] = useState(30) // feet
  const [walkingPace, setWalkingPace] = useState<'slow' | 'normal' | 'fast'>('normal')
  const [recommendedSongs, setRecommendedSongs] = useState<Song[]>([])
  const [estimatedTime, setEstimatedTime] = useState(0)

  // Walking speeds in feet per second
  const WALKING_SPEEDS = {
    slow: 2.0,    // Formal, elegant pace
    normal: 2.5,  // Standard wedding pace
    fast: 3.0     // Rushed or casual pace
  }

  // Calculate time and find matching songs
  useEffect(() => {
    const timeInSeconds = Math.round(aisleLength / WALKING_SPEEDS[walkingPace])
    setEstimatedTime(timeInSeconds)

    // Find songs that match the timing
    // Look for songs that are at least as long as the walk time
    // and have appropriate energy for processional (1-3)
    const minDuration = timeInSeconds
    const maxDuration = timeInSeconds + 30 // Allow up to 30 seconds extra

    const matchingSongs = ALL_WEDDING_SONGS.filter(song => {
      const isGoodDuration = song.duration >= minDuration && song.duration <= maxDuration
      const isGoodEnergy = song.energyLevel <= 3
      const isClean = !song.explicit
      
      // Bonus points for classical/traditional
      const isProcessional = song.moments?.includes('processional')
      const hasProcessionalKeywords = song.title.toLowerCase().includes('wedding') ||
                                     song.title.toLowerCase().includes('processional') ||
                                     song.artist.toLowerCase().includes('pachelbel') ||
                                     song.artist.toLowerCase().includes('wagner')
      
      return isGoodDuration && isGoodEnergy && isClean && (isProcessional || hasProcessionalKeywords)
    })

    // If we don't have enough specific processional songs, add general romantic ones
    if (matchingSongs.length < 5) {
      const romanticSongs = ALL_WEDDING_SONGS.filter(song => {
        const isGoodDuration = song.duration >= minDuration && song.duration <= maxDuration
        const isGoodEnergy = song.energyLevel <= 3
        const isClean = !song.explicit
        const isRomantic = song.title.toLowerCase().includes('love') ||
                          song.title.toLowerCase().includes('beautiful') ||
                          song.moments?.includes('first-dance')
        
        return isGoodDuration && isGoodEnergy && isClean && isRomantic
      })
      
      matchingSongs.push(...romanticSongs.slice(0, 5 - matchingSongs.length))
    }

    // Sort by how close they are to the target duration
    matchingSongs.sort((a, b) => {
      const aDiff = Math.abs(a.duration - timeInSeconds)
      const bDiff = Math.abs(b.duration - timeInSeconds)
      return aDiff - bDiff
    })

    setRecommendedSongs(matchingSongs.slice(0, 10))
  }, [aisleLength, walkingPace])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 mb-6">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Clock className="w-6 h-6" />
          Processional Timer
        </h2>
        <p className="text-gray-600">
          Find the perfect song length for your walk down the aisle
        </p>
      </div>

      {/* Calculator */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Aisle Length */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Aisle Length
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="10"
                max="100"
                value={aisleLength}
                onChange={(e) => setAisleLength(Number(e.target.value))}
                className="flex-1"
              />
              <span className="w-16 text-right font-medium">{aisleLength} ft</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Typical: Church (50-75ft), Garden (30-50ft), Beach (20-40ft)
            </p>
          </div>

          {/* Walking Pace */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Walking Pace
            </label>
            <div className="flex gap-2">
              {(['slow', 'normal', 'fast'] as const).map(pace => (
                <button
                  key={pace}
                  onClick={() => setWalkingPace(pace)}
                  className={`flex-1 py-2 px-3 rounded-lg capitalize ${
                    walkingPace === pace
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {pace}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Slow: Formal & elegant | Normal: Traditional | Fast: Casual
            </p>
          </div>
        </div>

        {/* Result */}
        <div className="mt-6 p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Estimated walk time:</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatTime(estimatedTime)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Perfect song length:</p>
              <p className="text-lg font-medium">
                {formatTime(estimatedTime)} - {formatTime(estimatedTime + 30)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Music className="w-5 h-5" />
          Recommended Songs
        </h3>
        
        {recommendedSongs.length > 0 ? (
          <div className="space-y-2">
            {recommendedSongs.map((song) => (
              <div
                key={song.id}
                onClick={() => onSelectSong(song)}
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
              >
                {/* Album Art */}
                {song.albumImage ? (
                  <img 
                    src={song.albumImage} 
                    alt={song.album}
                    className="w-12 h-12 rounded"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-400 rounded flex items-center justify-center">
                    <Music className="w-6 h-6 text-white" />
                  </div>
                )}
                
                {/* Song Info */}
                <div className="flex-1">
                  <p className="font-medium">{song.title}</p>
                  <p className="text-sm text-gray-600">{song.artist}</p>
                </div>

                {/* Duration */}
                <div className="text-right">
                  <p className="font-medium text-purple-600">
                    {formatTime(song.duration)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {song.duration - estimatedTime > 0 ? '+' : ''}{song.duration - estimatedTime}s
                  </p>
                </div>

                {/* Preview */}
                {song.previewUrl && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      // TODO: Implement preview player
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Info className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No songs match your exact timing.</p>
            <p className="text-sm">Try adjusting your pace or aisle length.</p>
          </div>
        )}

        {/* Tips */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Pro Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Consider having music continue for 20-30 seconds after you reach the altar</li>
            <li>• Practice walking to your chosen song at least once</li>
            <li>• Have a backup plan if you walk faster/slower than expected</li>
            <li>• Classical pieces like Pachelbel's Canon are always safe choices</li>
          </ul>
        </div>
      </div>
    </div>
  )
}