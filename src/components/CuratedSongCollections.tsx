'use client'

import { Heart, Music, Clock, Zap, Star, Globe } from 'lucide-react'
import { SPOTIFY_WEDDING_SONGS, ALL_WEDDING_SONGS } from '@/data/spotify-wedding-songs'
import { Song } from '@/types/wedding-v2'

interface Collection {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  gradient: string
  getSongs: () => Song[]
}

const CURATED_COLLECTIONS: Collection[] = [
  {
    id: 'perfect-first-dance',
    name: 'Perfect First Dance',
    description: 'Romantic songs for your special moment',
    icon: Heart,
    gradient: 'from-pink-500 to-rose-500',
    getSongs: () => SPOTIFY_WEDDING_SONGS['first-dance']?.slice(0, 20) || []
  },
  {
    id: 'dance-floor-hits',
    name: 'Dance Floor Hits',
    description: 'Get everyone moving with these crowd pleasers',
    icon: Zap,
    gradient: 'from-purple-500 to-indigo-500',
    getSongs: () => ALL_WEDDING_SONGS.filter(s => s.energyLevel >= 4).slice(0, 20)
  },
  {
    id: 'timeless-classics',
    name: 'Timeless Classics',
    description: 'Songs that never go out of style',
    icon: Star,
    gradient: 'from-amber-500 to-orange-500',
    getSongs: () => ALL_WEDDING_SONGS.filter(s => 
      ['Sinatra', 'Beatles', 'Elvis', 'Wonder'].some(artist => s.artist.includes(artist))
    ).slice(0, 20)
  },
  {
    id: 'dinner-ambiance',
    name: 'Dinner Ambiance',
    description: 'Elegant background music for dining',
    icon: Clock,
    gradient: 'from-emerald-500 to-teal-500',
    getSongs: () => ALL_WEDDING_SONGS.filter(s => s.energyLevel <= 2).slice(0, 20)
  },
  {
    id: 'modern-love',
    name: 'Modern Love',
    description: "Today's hits for contemporary couples",
    icon: Music,
    gradient: 'from-blue-500 to-cyan-500',
    getSongs: () => ALL_WEDDING_SONGS.filter(s => 
      s.title.includes('2024') || s.title.includes('2025') || 
      ['Sheeran', 'Swift', 'Mars'].some(artist => s.artist.includes(artist))
    ).slice(0, 20)
  },
  {
    id: 'global-celebration',
    name: 'Global Celebration',
    description: 'International favorites for diverse weddings',
    icon: Globe,
    gradient: 'from-violet-500 to-purple-500',
    getSongs: () => ALL_WEDDING_SONGS.filter(s => s.popularIn?.length > 1).slice(0, 20)
  }
]

interface CuratedSongCollectionsProps {
  onSelectCollection: (songs: Song[], collectionName: string) => void
}

export function CuratedSongCollections({ onSelectCollection }: CuratedSongCollectionsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {CURATED_COLLECTIONS.map(collection => {
        const Icon = collection.icon
        const songCount = collection.getSongs().length
        
        return (
          <button
            key={collection.id}
            onClick={() => onSelectCollection(collection.getSongs(), collection.name)}
            className="relative overflow-hidden rounded-xl p-6 text-left hover:shadow-lg transition-shadow group"
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${collection.gradient} opacity-90`} />
            
            {/* Content */}
            <div className="relative z-10 text-white">
              <Icon className="w-8 h-8 mb-3" />
              <h3 className="text-xl font-bold mb-1">{collection.name}</h3>
              <p className="text-sm opacity-90 mb-3">{collection.description}</p>
              <p className="text-xs opacity-75">{songCount} songs</p>
            </div>
            
            {/* Hover Effect */}
            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                <Music className="w-4 h-4 text-white" />
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}

// Quick Stats Component
export function SongDatabaseStats() {
  const totalSongs = ALL_WEDDING_SONGS.length
  const firstDanceSongs = SPOTIFY_WEDDING_SONGS['first-dance']?.length || 0
  const partySongs = ALL_WEDDING_SONGS.filter(s => s.energyLevel >= 4).length
  const cleanSongs = ALL_WEDDING_SONGS.filter(s => !s.explicit).length
  
  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Your Song Database</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-3xl font-bold text-purple-600">{totalSongs}</p>
          <p className="text-sm text-gray-600">Total Songs</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-pink-600">{firstDanceSongs}</p>
          <p className="text-sm text-gray-600">First Dance</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-indigo-600">{partySongs}</p>
          <p className="text-sm text-gray-600">Party Songs</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-green-600">{cleanSongs}</p>
          <p className="text-sm text-gray-600">Family Friendly</p>
        </div>
      </div>
    </div>
  )
}