'use client'

import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Song, WeddingMoment } from '@/types/wedding-v2'
import { 
  Trash2, AlertCircle, Info, Plus, Music,
  Sparkles, Clock, TrendingUp
} from 'lucide-react'
import UnifiedSongCard from './UnifiedSongCard'
import { formatDuration } from '@/lib/spotify-client'

interface EnhancedTimelineProps {
  moment: WeddingMoment
  songs: Song[]
  onRemoveSong: (songId: string, momentId: string) => void
  onReorderSongs: (momentId: string, songs: Song[]) => void
  playingId: string | null
  onPlaySong: (song: Song) => void
  onPauseSong: () => void
  onAddSong?: (momentId: string) => void
}

// Moment metadata with helpful descriptions and tips
const momentMetadata: Record<string, {
  description: string
  tips: string[]
  suggestedGenres: string[]
  energyLevel: string
}> = {
  prelude: {
    description: "Background music as guests arrive and find their seats",
    tips: [
      "Keep it light and welcoming",
      "Avoid songs with strong associations",
      "Consider instrumental versions"
    ],
    suggestedGenres: ["Classical", "Jazz", "Acoustic", "Soft Pop"],
    energyLevel: "Low to Medium"
  },
  processional: {
    description: "The walk down the aisle - your grand entrance",
    tips: [
      "Choose something meaningful to you",
      "Consider the pace for walking",
      "Time it to match your aisle length"
    ],
    suggestedGenres: ["Classical", "Orchestral", "Acoustic Covers"],
    energyLevel: "Building"
  },
  ceremony: {
    description: "Background music during the ceremony proceedings",
    tips: [
      "Keep it subtle and non-distracting",
      "Instrumental works best",
      "Consider your venue's acoustics"
    ],
    suggestedGenres: ["Classical", "Ambient", "Soft Instrumental"],
    energyLevel: "Low"
  },
  recessional: {
    description: "Your triumphant exit as newlyweds!",
    tips: [
      "Go celebratory and upbeat",
      "This sets the party mood",
      "Consider a crowd favorite"
    ],
    suggestedGenres: ["Pop", "Rock", "Soul", "Feel-good Classics"],
    energyLevel: "High"
  },
  cocktail: {
    description: "Mingling music while guests enjoy drinks and appetizers",
    tips: [
      "Keep it conversational volume",
      "Mix genres to please everyone",
      "Build energy gradually"
    ],
    suggestedGenres: ["Jazz", "Bossa Nova", "Light Pop", "R&B"],
    energyLevel: "Medium"
  },
  dinner: {
    description: "Background music during the meal",
    tips: [
      "Keep it at conversation level",
      "Avoid songs with heavy beats",
      "Consider your menu theme"
    ],
    suggestedGenres: ["Jazz Standards", "Soul", "Soft Rock", "Acoustic"],
    energyLevel: "Low to Medium"
  },
  'first-dance': {
    description: "Your first dance as a married couple",
    tips: [
      "Choose a song that tells your story",
      "Consider taking dance lessons",
      "3-4 minutes is ideal length"
    ],
    suggestedGenres: ["Your favorite genre!"],
    energyLevel: "Romantic"
  },
  'parent-dances': {
    description: "Special dances with parents",
    tips: [
      "Ask parents for input",
      "Consider cultural traditions",
      "Can be split or combined"
    ],
    suggestedGenres: ["Classic Standards", "Country", "Pop Ballads"],
    energyLevel: "Emotional"
  },
  'cake-cutting': {
    description: "The cake cutting ceremony soundtrack",
    tips: [
      "Something sweet and fun",
      "Short songs work well",
      "Consider playful options"
    ],
    suggestedGenres: ["Pop", "Motown", "Fun Classics"],
    energyLevel: "Playful"
  },
  party: {
    description: "Time to hit the dance floor!",
    tips: [
      "Mix eras and genres",
      "Read the room energy",
      "Include crowd pleasers"
    ],
    suggestedGenres: ["Pop", "Dance", "Hip-Hop", "Rock", "Throwbacks"],
    energyLevel: "High Energy"
  },
  'last-dance': {
    description: "The final song of your celebration",
    tips: [
      "End on a high note",
      "Consider a sing-along",
      "Make it memorable"
    ],
    suggestedGenres: ["Classics", "Anthems", "Your Favorites"],
    energyLevel: "Epic Finale"
  }
}

export default function EnhancedTimeline({
  moment,
  songs,
  onRemoveSong,
  onReorderSongs,
  playingId,
  onPlaySong,
  onPauseSong,
  onAddSong
}: EnhancedTimelineProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `moment-${moment.id}`,
    data: {
      type: 'moment',
      momentId: moment.id
    }
  })

  const totalDuration = songs.reduce((acc, song) => acc + song.duration, 0)
  const targetDuration = moment.duration * 60 // Convert minutes to seconds
  const durationPercentage = (totalDuration / targetDuration) * 100
  const metadata = momentMetadata[moment.id] || {
    description: moment.name,
    tips: [],
    suggestedGenres: [],
    energyLevel: "Medium"
  }

  return (
    <div
      ref={setNodeRef}
      className={`
        relative rounded-xl transition-all
        ${isOver ? 'ring-2 ring-purple-400 scale-[1.02]' : ''}
        ${moment.id === 'first-dance' || moment.id === 'processional' 
          ? 'bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30' 
          : 'bg-slate-800/50 border-white/10'
        }
        border backdrop-blur-sm
      `}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{moment.icon}</span>
              <h3 className="text-lg font-semibold text-white">{moment.name}</h3>
              {(moment.id === 'first-dance' || moment.id === 'processional') && (
                <Sparkles className="w-4 h-4 text-purple-400" />
              )}
            </div>
            <p className="text-sm text-white/60">{metadata.description}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-white/80 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formatDuration(totalDuration * 1000)} / {moment.duration}min
            </div>
            <div className="text-xs text-white/40 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {metadata.energyLevel}
            </div>
          </div>
        </div>
        
        {/* Duration Progress Bar */}
        <div className="relative">
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all ${
                durationPercentage > 110
                  ? 'bg-red-500'
                  : durationPercentage > 90
                  ? 'bg-green-500'
                  : 'bg-yellow-500'
              }`}
              style={{ width: `${Math.min(durationPercentage, 100)}%` }}
            />
          </div>
          {durationPercentage >= 90 && durationPercentage <= 110 && (
            <div className="absolute -top-1 -right-1">
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          )}
        </div>
        
        {/* Duration Feedback */}
        {durationPercentage < 50 && (
          <p className="text-xs text-yellow-400 mt-2 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Needs {formatDuration((targetDuration - totalDuration) * 1000)} more music
          </p>
        )}
        {durationPercentage > 110 && (
          <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {formatDuration((totalDuration - targetDuration) * 1000)} over target
          </p>
        )}
        {durationPercentage >= 90 && durationPercentage <= 110 && (
          <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Perfect timing!
          </p>
        )}
      </div>

      {/* Drop Zone / Songs List */}
      <div className="p-3">
        {songs.length === 0 ? (
          <div 
            className={`
              border-2 border-dashed rounded-lg p-6 text-center transition-all
              ${isOver 
                ? 'border-purple-400 bg-purple-500/10' 
                : 'border-white/20 hover:border-white/30 bg-white/5'
              }
            `}
          >
            <Music className="w-8 h-8 text-white/30 mx-auto mb-3" />
            <p className="text-sm text-white/60 font-medium mb-2">
              Add songs to {moment.name}
            </p>
            <p className="text-xs text-white/40 mb-4">
              Drag songs here or click the button below
            </p>
            {onAddSong && (
              <button
                onClick={() => onAddSong(moment.id)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Browse Songs
              </button>
            )}
            
            {/* Helpful Tips */}
            <div className="mt-6 text-left bg-white/5 rounded-lg p-4">
              <div className="flex items-start gap-2 mb-2">
                <Info className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-white/80 mb-1">Tips for {moment.name}:</p>
                  <ul className="text-xs text-white/60 space-y-1">
                    {metadata.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="text-purple-400">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {metadata.suggestedGenres.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <p className="text-xs text-white/60">
                    <span className="font-medium">Suggested genres:</span> {metadata.suggestedGenres.join(", ")}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <SortableContext
            items={songs.map((s, i) => `timeline-${s.id}-${i}`)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {songs.map((song, index) => (
                <SortableSongItem
                  key={`${song.id}-${index}`}
                  song={song}
                  index={index}
                  momentId={moment.id}
                  isPlaying={playingId === song.id}
                  onPlay={() => onPlaySong(song)}
                  onPause={onPauseSong}
                  onRemove={() => onRemoveSong(song.id, moment.id)}
                />
              ))}
              
              {/* Add More Songs Button */}
              {onAddSong && (
                <button
                  onClick={() => onAddSong(moment.id)}
                  className={`
                    w-full border-2 border-dashed rounded-lg p-3 transition-all
                    ${isOver 
                      ? 'border-purple-400 bg-purple-500/10' 
                      : 'border-white/20 hover:border-white/30 bg-white/5'
                    }
                    flex items-center justify-center gap-2 text-sm text-white/60 hover:text-white/80
                  `}
                >
                  <Plus className="w-4 h-4" />
                  Add more songs
                </button>
              )}
            </div>
          </SortableContext>
        )}
      </div>

      {/* Drag Overlay Feedback */}
      {isOver && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-purple-500/10 rounded-xl animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg">
              Drop to add to {moment.name}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface SortableSongItemProps {
  song: Song
  index: number
  momentId: string
  isPlaying: boolean
  onPlay: () => void
  onPause: () => void
  onRemove: () => void
}

function SortableSongItem({
  song,
  index,
  momentId,
  isPlaying,
  onPlay,
  onPause,
  onRemove
}: SortableSongItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `timeline-${song.id}-${index}`,
    data: {
      song,
      source: 'timeline',
      momentId,
      index
    }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <UnifiedSongCard
        song={song}
        source="timeline"
        momentId={momentId}
        index={index}
        isPlaying={isPlaying}
        onPlay={onPlay}
        onPause={onPause}
        onRemove={onRemove}
        variant="timeline"
        isDraggingEnabled={true}
      />
    </div>
  )
}