'use client'

import { useState, useMemo } from 'react'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Music, Clock, Users, Disc } from 'lucide-react'
import Link from 'next/link'

export default function MusicCalculator() {
  const [weddingDetails, setWeddingDetails] = useState({
    guestCount: 100,
    ceremonyDuration: 30,
    cocktailDuration: 60,
    dinnerDuration: 90,
    dancingDuration: 180,
  })

  const calculations = useMemo(() => {
    const totalMinutes = 
      weddingDetails.ceremonyDuration +
      weddingDetails.cocktailDuration +
      weddingDetails.dinnerDuration +
      weddingDetails.dancingDuration

    const totalHours = totalMinutes / 60

    return {
      totalSongs: Math.ceil(totalHours * 15), // ~15 songs per hour
      ceremonySongs: Math.ceil(weddingDetails.ceremonyDuration / 4),
      cocktailSongs: Math.ceil(weddingDetails.cocktailDuration / 3.5),
      dinnerSongs: Math.ceil(weddingDetails.dinnerDuration / 4),
      danceSongs: Math.ceil(weddingDetails.dancingDuration / 3),
      spotifyPlaylistHours: Math.floor(totalHours),
      spotifyPlaylistMinutes: Math.round((totalHours % 1) * 60),
    }
  }, [weddingDetails])

  const handleSliderChange = (key: keyof typeof weddingDetails) => (value: number[]) => {
    setWeddingDetails({ ...weddingDetails, [key]: value[0] })
  }

  return (
    <div className="my-8 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
      <h3 className="text-2xl font-bold mb-6 text-center">Wedding Music Calculator</h3>
      
      <div className="space-y-6 mb-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              Guest Count
            </label>
            <span className="text-sm font-semibold">{weddingDetails.guestCount}</span>
          </div>
          <Slider
            value={[weddingDetails.guestCount]}
            onValueChange={handleSliderChange('guestCount')}
            min={20}
            max={300}
            step={10}
            className="mb-4"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600" />
              Ceremony Duration
            </label>
            <span className="text-sm font-semibold">{weddingDetails.ceremonyDuration} min</span>
          </div>
          <Slider
            value={[weddingDetails.ceremonyDuration]}
            onValueChange={handleSliderChange('ceremonyDuration')}
            min={15}
            max={60}
            step={5}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Music className="w-4 h-4 text-pink-600" />
              Cocktail Hour
            </label>
            <span className="text-sm font-semibold">{weddingDetails.cocktailDuration} min</span>
          </div>
          <Slider
            value={[weddingDetails.cocktailDuration]}
            onValueChange={handleSliderChange('cocktailDuration')}
            min={30}
            max={120}
            step={15}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              Dinner Duration
            </label>
            <span className="text-sm font-semibold">{weddingDetails.dinnerDuration} min</span>
          </div>
          <Slider
            value={[weddingDetails.dinnerDuration]}
            onValueChange={handleSliderChange('dinnerDuration')}
            min={60}
            max={120}
            step={15}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Disc className="w-4 h-4 text-green-600" />
              Dancing Duration
            </label>
            <span className="text-sm font-semibold">{weddingDetails.dancingDuration} min</span>
          </div>
          <Slider
            value={[weddingDetails.dancingDuration]}
            onValueChange={handleSliderChange('dancingDuration')}
            min={60}
            max={300}
            step={30}
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h4 className="font-semibold mb-4 text-center">Your Wedding Music Needs</h4>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-purple-100 rounded-lg">
            <p className="text-3xl font-bold text-purple-700">{calculations.totalSongs}</p>
            <p className="text-sm text-gray-600">Total Songs Needed</p>
          </div>
          <div className="text-center p-4 bg-pink-100 rounded-lg">
            <p className="text-3xl font-bold text-pink-700">
              {calculations.spotifyPlaylistHours}h {calculations.spotifyPlaylistMinutes}m
            </p>
            <p className="text-sm text-gray-600">Playlist Duration</p>
          </div>
        </div>

        <div className="space-y-2 text-sm mb-6">
          <div className="flex justify-between">
            <span>Ceremony:</span>
            <span className="font-semibold">{calculations.ceremonySongs} songs</span>
          </div>
          <div className="flex justify-between">
            <span>Cocktail Hour:</span>
            <span className="font-semibold">{calculations.cocktailSongs} songs</span>
          </div>
          <div className="flex justify-between">
            <span>Dinner:</span>
            <span className="font-semibold">{calculations.dinnerSongs} songs</span>
          </div>
          <div className="flex justify-between">
            <span>Dancing:</span>
            <span className="font-semibold">{calculations.danceSongs} songs</span>
          </div>
        </div>

        <Link href="/signup" className="block">
          <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            Start Building Your Playlist
          </Button>
        </Link>
      </div>
    </div>
  )
}