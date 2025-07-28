'use client'

import { useState } from 'react'
import { Music, Clock, Activity, Users, Search, Sparkles } from 'lucide-react'
import { ProcessionalTimer } from '@/components/ProcessionalTimer'
import { EnergyFlowVisualizer } from '@/components/EnergyFlowVisualizer'
import { GenerationMixer } from '@/components/GenerationMixer'
import { EnhancedSongSearch } from '@/components/EnhancedSongSearch'
import { CuratedSongCollections, SongDatabaseStats } from '@/components/CuratedSongCollections'
import { SongPreviewPlayer } from '@/components/SongPreviewPlayer'
import { Song, WeddingMoment } from '@/types/wedding-v2'
import { weddingMoments } from '@/data/weddingMoments'

export default function SongToolsPage() {
  const [activeTab, setActiveTab] = useState<'search' | 'timer' | 'energy' | 'generation' | 'collections'>('search')
  const [selectedSongs, setSelectedSongs] = useState<Record<string, Song[]>>({})
  const [currentPreviewSong, setCurrentPreviewSong] = useState<Song | null>(null)

  const handleSelectSong = (song: Song, moment?: string) => {
    // Add song to the appropriate moment
    const targetMoment = moment || 'general'
    setSelectedSongs(prev => ({
      ...prev,
      [targetMoment]: [...(prev[targetMoment] || []), song]
    }))
    
    // Preview the song
    setCurrentPreviewSong(song)
  }

  const handleAddMultipleSongs = (songs: Song[], moment?: string) => {
    const targetMoment = moment || 'general'
    setSelectedSongs(prev => ({
      ...prev,
      [targetMoment]: [...(prev[targetMoment] || []), ...songs]
    }))
  }

  // Get all selected songs
  const allSelectedSongs = Object.values(selectedSongs).flat()

  const tabs = [
    { id: 'search', label: 'Search', icon: Search },
    { id: 'collections', label: 'Collections', icon: Sparkles },
    { id: 'timer', label: 'Processional Timer', icon: Clock },
    { id: 'energy', label: 'Energy Flow', icon: Activity },
    { id: 'generation', label: 'Generation Mix', icon: Users },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Music className="w-8 h-8 text-purple-600" />
                Wedding Song Tools
              </h1>
              <p className="text-gray-600 mt-1">
                Advanced tools to create the perfect wedding soundtrack
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Songs selected</p>
              <p className="text-2xl font-bold text-purple-600">{allSelectedSongs.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Database Stats */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <SongDatabaseStats />
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'search' && (
          <EnhancedSongSearch
            onSelectSong={(song) => handleSelectSong(song)}
            existingSongs={allSelectedSongs.map(s => s.id)}
          />
        )}

        {activeTab === 'collections' && (
          <CuratedSongCollections
            onSelectCollection={(songs, collectionName) => {
              handleAddMultipleSongs(songs)
              alert(`Added ${songs.length} songs from ${collectionName}`)
            }}
          />
        )}

        {activeTab === 'timer' && (
          <ProcessionalTimer
            onSelectSong={(song) => handleSelectSong(song, 'processional')}
          />
        )}

        {activeTab === 'energy' && (
          <EnergyFlowVisualizer
            weddingMoments={weddingMoments}
            selectedSongs={selectedSongs}
            onSuggestSong={(moment, song) => handleSelectSong(song, moment)}
          />
        )}

        {activeTab === 'generation' && (
          <GenerationMixer
            currentSongs={allSelectedSongs}
            onAddSongs={(songs) => handleAddMultipleSongs(songs)}
          />
        )}
      </div>

      {/* Preview Player (Floating) */}
      {currentPreviewSong && (
        <div className="fixed bottom-4 right-4 z-50 max-w-md">
          <SongPreviewPlayer
            song={currentPreviewSong}
            autoPlay={true}
            onEnded={() => setCurrentPreviewSong(null)}
          />
        </div>
      )}
    </div>
  )
}