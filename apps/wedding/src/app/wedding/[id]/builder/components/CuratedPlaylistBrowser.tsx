'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Music, Clock, Sparkles, ChevronRight, 
  Play, Plus, Check, TrendingUp,
  BookOpen, Heart
} from 'lucide-react'
import { Song } from '@/types/wedding-v2'
import { 
  CuratedPlaylist, 
  getPlaylistsByMoment, 
  getPopularPlaylists 
} from '@/data/curatedPlaylists'
import { formatDuration } from '@/lib/spotify-client'
import UnifiedSongCard from './UnifiedSongCard'

interface CuratedPlaylistBrowserProps {
  selectedMoment?: string
  onAddSong: (song: Song, momentId: string) => void
  onAddAllSongs: (songs: Song[], momentId: string) => void
  onOpenGuide?: (momentId: string) => void
}

export default function CuratedPlaylistBrowser({
  selectedMoment,
  onAddSong,
  onAddAllSongs,
  onOpenGuide
}: CuratedPlaylistBrowserProps) {
  const [selectedPlaylist, setSelectedPlaylist] = useState<CuratedPlaylist | null>(null)
  const [expandedSongs, setExpandedSongs] = useState(false)
  const [addedPlaylists, setAddedPlaylists] = useState<Set<string>>(new Set())
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)

  // Get playlists for selected moment or show popular ones
  const playlists = selectedMoment 
    ? getPlaylistsByMoment(selectedMoment)
    : getPopularPlaylists()

  const handlePlayPreview = (song: Song) => {
    if (playingId === song.id) {
      audioElement?.pause()
      setPlayingId(null)
    } else {
      audioElement?.pause()
      if (song.previewUrl) {
        const audio = new Audio(song.previewUrl)
        audio.volume = 0.5
        audio.play()
        setAudioElement(audio)
        setPlayingId(song.id)
        
        audio.addEventListener('ended', () => {
          setPlayingId(null)
        })
      }
    }
  }

  const handleAddPlaylist = (playlist: CuratedPlaylist) => {
    onAddAllSongs(playlist.songs, playlist.momentId)
    setAddedPlaylists(new Set([...addedPlaylists, playlist.id]))
    
    // Visual feedback
    setTimeout(() => {
      setAddedPlaylists(prev => {
        const next = new Set(prev)
        next.delete(playlist.id)
        return next
      })
    }, 2000)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Curated Collections</h3>
          {selectedMoment && onOpenGuide && (
            <button
              onClick={() => onOpenGuide(selectedMoment)}
              className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <BookOpen className="w-4 h-4" />
              Guides
            </button>
          )}
        </div>
        <p className="text-sm text-white/60">
          Expertly curated playlists for every wedding moment
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {!selectedPlaylist ? (
          // Playlist Grid
          <div className="p-4 space-y-4">
            {!selectedMoment && (
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <p className="text-sm text-purple-300 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Select a moment in your timeline to see curated playlists, or browse our most popular collections below.</span>
                </p>
              </div>
            )}

            {playlists.map((playlist) => (
              <motion.div
                key={playlist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-colors cursor-pointer group"
                onClick={() => setSelectedPlaylist(playlist)}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{playlist.icon}</div>
                      <div>
                        <h4 className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                          {playlist.name}
                        </h4>
                        <p className="text-sm text-white/60">{playlist.description}</p>
                      </div>
                    </div>
                    {addedPlaylists.has(playlist.id) ? (
                      <div className="flex items-center gap-1 text-green-400">
                        <Check className="w-5 h-5" />
                        <span className="text-sm">Added!</span>
                      </div>
                    ) : (
                      <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-purple-400 transition-colors" />
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-white/60">
                    <span className="flex items-center gap-1">
                      <Music className="w-3.5 h-3.5" />
                      {playlist.songs.length} songs
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDuration(playlist.totalDuration * 1000)}
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {playlist.popularityScore}% popular
                    </span>
                  </div>

                  {playlist.vibe.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {playlist.vibe.map((vibe) => (
                        <span
                          key={vibe}
                          className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/60"
                        >
                          {vibe}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="border-t border-white/10 p-3 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAddPlaylist(playlist)
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add All to {playlist.momentId}
                  </button>
                </div>
              </motion.div>
            ))}

            {playlists.length === 0 && (
              <div className="text-center py-12">
                <Music className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <p className="text-white/60">No curated playlists available for this moment yet.</p>
                <p className="text-sm text-white/40 mt-2">Check back soon or browse other moments!</p>
              </div>
            )}
          </div>
        ) : (
          // Playlist Detail View
          <div className="flex flex-col h-full">
            {/* Playlist Header */}
            <div className="p-4 bg-gradient-to-b from-white/10 to-transparent">
              <button
                onClick={() => setSelectedPlaylist(null)}
                className="text-sm text-white/60 hover:text-white mb-4 flex items-center gap-2"
              >
                ← Back to playlists
              </button>

              <div className="flex items-start gap-4">
                <div className="text-5xl">{selectedPlaylist.icon}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{selectedPlaylist.name}</h3>
                  <p className="text-white/60 mb-3">{selectedPlaylist.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-white/60">
                    <span className="flex items-center gap-1">
                      <Music className="w-4 h-4" />
                      {selectedPlaylist.songs.length} songs
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatDuration(selectedPlaylist.totalDuration * 1000)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      Curated by {selectedPlaylist.curator}
                    </span>
                  </div>

                  {selectedPlaylist.vibe.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {selectedPlaylist.vibe.map((vibe) => (
                        <span
                          key={vibe}
                          className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/60"
                        >
                          {vibe}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleAddPlaylist(selectedPlaylist)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                    addedPlaylists.has(selectedPlaylist.id)
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-purple-500 hover:bg-purple-600 text-white'
                  }`}
                >
                  {addedPlaylists.has(selectedPlaylist.id) ? (
                    <>
                      <Check className="w-4 h-4" />
                      Added to Timeline!
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Add All Songs to {selectedPlaylist.momentId}
                    </>
                  )}
                </button>
                <button
                  onClick={() => setExpandedSongs(!expandedSongs)}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors"
                >
                  {expandedSongs ? 'Collapse' : 'Preview'} Songs
                </button>
              </div>
            </div>

            {/* Song List */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {(expandedSongs ? selectedPlaylist.songs : selectedPlaylist.songs.slice(0, 3)).map((song, index) => (
                  <motion.div
                    key={song.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <UnifiedSongCard
                      song={song}
                      source="collection"
                      index={index}
                      isPlaying={playingId === song.id}
                      onPlay={() => handlePlayPreview(song)}
                      onPause={() => {
                        audioElement?.pause()
                        setPlayingId(null)
                      }}
                      onAddToMoment={(momentId) => onAddSong(song, momentId)}
                      variant="compact"
                    />
                  </motion.div>
                ))}
                
                {!expandedSongs && selectedPlaylist.songs.length > 3 && (
                  <button
                    onClick={() => setExpandedSongs(true)}
                    className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white/60 hover:text-white transition-colors"
                  >
                    Show {selectedPlaylist.songs.length - 3} more songs
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}