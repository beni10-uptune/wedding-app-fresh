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
import { Clock, Trash2, AlertCircle } from 'lucide-react'
import DraggableSong from './DraggableSong'
import { formatDuration } from '@/lib/spotify-client'

interface DroppableTimelineProps {
  moment: WeddingMoment
  songs: Song[]
  onRemoveSong: (songId: string, momentId: string) => void
  onReorderSongs: (momentId: string, songs: Song[]) => void
  playingId: string | null
  onPlaySong: (song: Song) => void
  onPauseSong: () => void
}

export default function DroppableTimeline({
  moment,
  songs,
  onRemoveSong,
  onReorderSongs,
  playingId,
  onPlaySong,
  onPauseSong
}: DroppableTimelineProps) {
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

  return (
    <div
      ref={setNodeRef}
      className={`
        glass-darker rounded-xl overflow-hidden transition-all
        ${isOver ? 'ring-2 ring-purple-400 bg-purple-500/10' : ''}
      `}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{moment.icon}</span>
            <h3 className="font-semibold text-white">{moment.name}</h3>
          </div>
          <span className="text-sm text-white/60">
            {formatDuration(totalDuration * 1000)} / {moment.duration}min
          </span>
        </div>
        
        {/* Duration Progress Bar */}
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
        
        {/* Duration Warning */}
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
      </div>

      {/* Songs List */}
      <div className="p-2">
        {songs.length === 0 ? (
          <div className="py-8 text-center text-white/40">
            <p className="text-sm">Drag songs here</p>
            <p className="text-xs mt-1">or use the + button to add</p>
          </div>
        ) : (
          <SortableContext
            items={songs.map((s, i) => `timeline-${s.id}-${i}`)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-1">
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
            </div>
          </SortableContext>
        )}
      </div>
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
    <div ref={setNodeRef} style={style} className="relative group">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <DraggableSong
            song={song}
            source="timeline"
            momentId={momentId}
            index={index}
            isPlaying={isPlaying}
            onPlay={onPlay}
            onPause={onPause}
            showAddButton={false}
          />
        </div>
        
        {/* Remove Button */}
        <button
          onClick={onRemove}
          className="w-7 h-7 rounded-full bg-red-500/10 flex items-center justify-center hover:bg-red-500/20 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-3.5 h-3.5 text-red-400" />
        </button>
      </div>
    </div>
  )
}