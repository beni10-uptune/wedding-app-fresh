'use client'

import { useState } from 'react'
import { Globe, Music, Zap, RefreshCw } from 'lucide-react'
import { updateTimelineWithFilters } from '@/lib/timeline-service'
import { Timeline } from '@/types/wedding-v2'

interface TimelineFiltersProps {
  timeline: Timeline
  onTimelineUpdate: (timeline: Timeline) => void
  preferences?: {
    country?: string
    genres?: string[]
    energyProfile?: 'relaxed' | 'balanced' | 'high-energy'
  }
}

const COUNTRIES = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'Ireland', name: 'Ireland', flag: '🇮🇪' },
  { code: 'Australia', name: 'Australia', flag: '🇦🇺' },
  { code: 'Canada', name: 'Canada', flag: '🇨🇦' }
]

const GENRES = [
  { id: 'pop', label: 'Pop', emoji: '🎵' },
  { id: 'rock', label: 'Rock', emoji: '🎸' },
  { id: 'indie', label: 'Indie', emoji: '🎤' },
  { id: 'r&b', label: 'R&B', emoji: '💜' },
  { id: 'soul', label: 'Soul', emoji: '❤️' },
  { id: 'country', label: 'Country', emoji: '🤠' },
  { id: 'dance', label: 'Dance', emoji: '🕺' },
  { id: 'jazz', label: 'Jazz', emoji: '🎺' },
  { id: 'classical', label: 'Classical', emoji: '🎻' }
]

export default function TimelineFilters({ 
  timeline, 
  onTimelineUpdate,
  preferences = {} 
}: TimelineFiltersProps) {
  const [selectedCountry, setSelectedCountry] = useState(preferences.country || 'US')
  const [selectedGenres, setSelectedGenres] = useState<string[]>(preferences.genres || [])
  const [energyProfile, setEnergyProfile] = useState(preferences.energyProfile || 'balanced')
  const [isUpdating, setIsUpdating] = useState(false)

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country)
    applyFilters(country, selectedGenres)
  }

  const handleGenreToggle = (genreId: string) => {
    const newGenres = selectedGenres.includes(genreId)
      ? selectedGenres.filter(g => g !== genreId)
      : [...selectedGenres, genreId]
    
    setSelectedGenres(newGenres)
    applyFilters(selectedCountry, newGenres)
  }

  const applyFilters = async (country: string, genres: string[]) => {
    setIsUpdating(true)
    
    // Use the timeline service to update with filters
    const updatedTimeline = updateTimelineWithFilters(
      timeline,
      country,
      genres.length > 0 ? genres : undefined,
      false // Don't preserve manual songs for now
    )
    
    onTimelineUpdate(updatedTimeline)
    
    setTimeout(() => setIsUpdating(false), 500)
  }

  const handleRefresh = () => {
    applyFilters(selectedCountry, selectedGenres)
  }

  return (
    <div className="p-4 space-y-4">
      {/* Country Selection */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
          <Globe className="w-4 h-4 text-purple-400" />
          Music Region
        </label>
        <div className="grid grid-cols-3 gap-2">
          {COUNTRIES.map(country => (
            <button
              key={country.code}
              onClick={() => handleCountryChange(country.code)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCountry === country.code
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <span className="mr-1">{country.flag}</span>
              {country.name}
            </button>
          ))}
        </div>
      </div>

      {/* Genre Selection */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
          <Music className="w-4 h-4 text-purple-400" />
          Preferred Genres
        </label>
        <div className="flex flex-wrap gap-2">
          {GENRES.map(genre => (
            <button
              key={genre.id}
              onClick={() => handleGenreToggle(genre.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedGenres.includes(genre.id)
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <span className="mr-1">{genre.emoji}</span>
              {genre.label}
            </button>
          ))}
        </div>
        {selectedGenres.length === 0 && (
          <p className="text-xs text-white/50 mt-2">
            Select genres to filter your playlist
          </p>
        )}
      </div>

      {/* Energy Profile */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
          <Zap className="w-4 h-4 text-purple-400" />
          Energy Profile
        </label>
        <div className="grid grid-cols-3 gap-2">
          {['relaxed', 'balanced', 'high-energy'].map(profile => (
            <button
              key={profile}
              onClick={() => setEnergyProfile(profile as any)}
              className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                energyProfile === profile
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {profile}
            </button>
          ))}
        </div>
      </div>

      {/* Refresh Button */}
      <div className="pt-2">
        <button
          onClick={handleRefresh}
          disabled={isUpdating}
          className="w-full px-4 py-2.5 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isUpdating ? 'animate-spin' : ''}`} />
          {isUpdating ? 'Updating Playlist...' : 'Refresh Playlist'}
        </button>
        <p className="text-xs text-white/50 text-center mt-2">
          Updates your timeline with songs matching your preferences
        </p>
      </div>
    </div>
  )
}