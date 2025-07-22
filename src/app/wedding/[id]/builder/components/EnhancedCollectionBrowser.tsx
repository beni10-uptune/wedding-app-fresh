'use client'

import { useState } from 'react'
import { Song } from '@/types/wedding-v2'
import { CURATED_COLLECTIONS as SONG_COLLECTIONS } from '@/data/curatedCollections'
import CollectionCard from './CollectionCard'
import { Sparkles, Music, Heart, PartyPopper, Zap } from 'lucide-react'
import DraggableSong from './DraggableSong'
import { getSongsInCollection } from '@/data/curatedCollections'

interface EnhancedCollectionBrowserProps {
  onAddSong: (song: Song, momentId: string) => void
  onAddAllSongs: (songs: Song[], momentId: string) => void
}

const categoryIcons: Record<string, any> = {
  'processional': Heart,
  'first-dance': Heart,
  'party': PartyPopper,
  'cocktail': Music,
  'dinner': Music,
  'all': Sparkles
}

export default function EnhancedCollectionBrowser({ 
  onAddSong, 
  onAddAllSongs 
}: EnhancedCollectionBrowserProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [expandedCollection, setExpandedCollection] = useState<string | null>(null)
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)

  const categories = [
    { id: 'all', name: 'All Collections', icon: Sparkles },
    { id: 'processional', name: 'Ceremony', icon: Heart },
    { id: 'first-dance', name: 'First Dance', icon: Heart },
    { id: 'cocktail', name: 'Cocktail Hour', icon: Music },
    { id: 'dinner', name: 'Dinner', icon: Music },
    { id: 'party', name: 'Party', icon: PartyPopper }
  ]

  const filteredCollections = selectedCategory === 'all' 
    ? SONG_COLLECTIONS 
    : SONG_COLLECTIONS.filter(c => c.moment === selectedCategory)

  const handlePlaySong = (song: Song) => {
    if (audioElement) {
      audioElement.pause()
    }

    if (song.previewUrl && playingId !== song.id) {
      const audio = new Audio(song.previewUrl)
      audio.volume = 0.5
      audio.play().catch(err => {
        console.error('Failed to play preview:', err)
      })

      audio.addEventListener('ended', () => {
        setPlayingId(null)
      })

      setAudioElement(audio)
      setPlayingId(song.id)
    } else {
      setPlayingId(null)
    }
  }

  const handlePauseSong = () => {
    if (audioElement) {
      audioElement.pause()
      setPlayingId(null)
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          Curated Collections
        </h3>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => {
            const Icon = category.icon
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  px-3 py-1.5 rounded-full text-xs font-medium
                  flex items-center gap-1.5 transition-all
                  ${selectedCategory === category.id
                    ? 'bg-purple-500/30 text-purple-400 ring-1 ring-purple-400/50'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }
                `}
              >
                <Icon className="w-3.5 h-3.5" />
                {category.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Collections */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {filteredCollections.map((collection) => {
            const isExpanded = expandedCollection === collection.id
            const songs = getSongsInCollection(collection.id)
            
            return (
              <div key={collection.id} className="space-y-2">
                {/* Collection Header - Always visible */}
                <div
                  onClick={() => setExpandedCollection(isExpanded ? null : collection.id)}
                  className="cursor-pointer"
                >
                  <CollectionCard
                    collection={collection}
                    onAddSong={() => {}} // Handled by DraggableSong
                    onAddAllSongs={onAddAllSongs}
                  />
                </div>

                {/* Expanded Songs - Draggable */}
                {isExpanded && (
                  <div className="ml-4 space-y-1 animate-in slide-in-from-top-2">
                    {songs.map((song, index) => song ? (
                      <DraggableSong
                        key={`${collection.id}-${song.id}`}
                        song={song}
                        source="collection"
                        index={index}
                        isPlaying={playingId === song.id}
                        onPlay={() => handlePlaySong(song)}
                        onPause={handlePauseSong}
                        onAddToMoment={(momentId) => onAddSong(song, momentId)}
                      />
                    ) : null)}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}