'use client'

import { useState } from 'react'
import { SongCollection, Song } from '@/types/wedding-v2'
import { ChevronDown, ChevronUp, Plus, Play, Pause } from 'lucide-react'
import { getSongsInCollection } from '@/data/curatedCollections'

interface CollectionCardProps {
  collection: SongCollection
  onAddSong: (song: Song, momentId: string) => void
  onAddAllSongs: (songs: Song[], momentId: string) => void
}

export default function CollectionCard({ 
  collection, 
  onAddSong, 
  onAddAllSongs 
}: CollectionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [playingId, setPlayingId] = useState<string | null>(null)
  const songs = getSongsInCollection(collection.id)

  const handlePlayPause = (songId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setPlayingId(playingId === songId ? null : songId)
    // In a real app, this would control actual audio playback
  }

  const handleAddSong = (song: Song, e: React.MouseEvent) => {
    e.stopPropagation()
    onAddSong(song, collection.moment)
  }

  const handleAddAll = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAddAllSongs(songs as Song[], collection.moment)
  }

  return (
    <div className="glass-darker rounded-lg overflow-hidden">
      <div 
        className="p-4 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <span className="text-2xl">{collection.icon}</span>
            <div className="flex-1">
              <h5 className="font-medium text-white">{collection.name}</h5>
              <p className="text-xs text-white/60 mt-0.5">{collection.description}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-white/40">
                <span>{collection.stats.totalSongs} songs</span>
                <span>⭐ {collection.stats.avgRating}</span>
                <span>Used {collection.stats.timesUsed} times</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAddAll}
              className="p-1.5 hover:bg-white/10 rounded transition-colors"
              title="Add all songs"
            >
              <Plus className="w-4 h-4 text-purple-400" />
            </button>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-white/40" />
            ) : (
              <ChevronDown className="w-4 h-4 text-white/40" />
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-white/10">
          <div className="max-h-64 overflow-y-auto">
            {songs.map((song, index) => (
              <div 
                key={song.id}
                className="px-4 py-3 hover:bg-white/5 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3 flex-1">
                  <button
                    onClick={(e) => handlePlayPause(song.id, e)}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    {playingId === song.id ? (
                      <Pause className="w-4 h-4 text-white" />
                    ) : (
                      <Play className="w-4 h-4 text-white ml-0.5" />
                    )}
                  </button>
                  <div className="flex-1">
                    <p className="text-sm text-white">{song.title}</p>
                    <p className="text-xs text-white/60">{song.artist}</p>
                  </div>
                  <div className="text-xs text-white/40">
                    {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                  </div>
                </div>
                <button
                  onClick={(e) => handleAddSong(song, e)}
                  className="ml-3 p-1.5 hover:bg-white/10 rounded opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Plus className="w-4 h-4 text-purple-400" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}