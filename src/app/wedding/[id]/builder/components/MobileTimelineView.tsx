'use client'

import { useState } from 'react'
import { Song, Timeline } from '@/types/wedding-v2'
import { WEDDING_MOMENTS } from '@/data/weddingMoments'
import { 
  ChevronDown, ChevronUp, Play, Pause, X, 
  GripVertical, ExternalLink, Plus, AlertCircle 
} from 'lucide-react'
import { formatDuration } from '@/lib/spotify-client'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface MobileTimelineViewProps {
  timeline: Timeline
  selectedMoment: string | null
  onSelectMoment: (momentId: string | null) => void
  onRemoveSong: (songId: string, momentId: string) => void
  onReorderSongs: (momentId: string, songs: Song[]) => void
  onPlaySong: (song: Song) => void
  onPauseSong: () => void
  playingId: string | null
  onAddSongs: () => void
}

export default function MobileTimelineView({
  timeline,
  selectedMoment,
  onSelectMoment,
  onRemoveSong,
  onReorderSongs,
  onPlaySong,
  onPauseSong,
  playingId,
  onAddSongs
}: MobileTimelineViewProps) {
  // Touch-friendly drag sensors
  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5
      }
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const handleDragEnd = (event: DragEndEvent, momentId: string) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const songs = timeline[momentId]?.songs || []
      const oldIndex = songs.findIndex(s => s.id === active.id)
      const newIndex = songs.findIndex(s => s.id === over?.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        const newSongs = arrayMove(songs, oldIndex, newIndex)
        onReorderSongs(momentId, newSongs as any)
      }
    }
  }

  return (
    <div className="h-full overflow-y-auto pb-20">
      {WEDDING_MOMENTS.map((moment) => {
        const songs = timeline[moment.id]?.songs || []
        const totalDuration = songs.reduce((acc, song) => acc + song.duration, 0)
        const targetDuration = moment.duration * 60
        const durationPercentage = (totalDuration / targetDuration) * 100
        const isExpanded = selectedMoment === moment.id

        return (
          <div key={moment.id} className="border-b border-white/10">
            {/* Moment Header */}
            <button
              onClick={() => onSelectMoment(isExpanded ? null : moment.id)}
              className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="text-2xl">{moment.icon}</span>
                <div className="text-left">
                  <h3 className="font-semibold text-white">{moment.name}</h3>
                  <p className="text-xs text-white/60">
                    {songs.length} songs • {formatDuration(totalDuration * 1000)} / {moment.duration}min
                  </p>
                </div>
              </div>
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-white/40" />
              ) : (
                <ChevronDown className="w-5 h-5 text-white/40" />
              )}
            </button>

            {/* Duration Progress */}
            <div className="px-4 pb-2">
              <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
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
              {durationPercentage < 50 && (
                <p className="text-xs text-yellow-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Needs {formatDuration((targetDuration - totalDuration) * 1000)} more
                </p>
              )}
            </div>

            {/* Expanded Song List */}
            {isExpanded && (
              <div className="px-4 pb-4">
                {songs.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-white/40 mb-4">No songs added yet</p>
                    <button
                      onClick={onAddSongs}
                      className="btn-primary text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add Songs
                    </button>
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={(event) => handleDragEnd(event, moment.id)}
                  >
                    <SortableContext
                      items={songs.map(s => s.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-2">
                        {songs.map((song) => (
                          <SortableSongItem
                            key={song.id}
                            song={song as any}
                            momentId={moment.id}
                            isPlaying={playingId === song.id}
                            onPlay={() => onPlaySong(song as any)}
                            onPause={onPauseSong}
                            onRemove={() => onRemoveSong(song.id, moment.id)}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}

                {songs.length > 0 && (
                  <button
                    onClick={onAddSongs}
                    className="w-full mt-3 py-2 border border-white/20 rounded-lg text-sm text-white/60 hover:bg-white/5 transition-colors"
                  >
                    <Plus className="w-4 h-4 inline mr-1" />
                    Add More Songs
                  </button>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

interface SortableSongItemProps {
  song: Song
  momentId: string
  isPlaying: boolean
  onPlay: () => void
  onPause: () => void
  onRemove: () => void
}

function SortableSongItem({
  song,
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
    isDragging
  } = useSortable({ id: song.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  const handleSpotifyClick = () => {
    if ((song as any).spotifyUri || (song as any).spotifyId) {
      const spotifyId = (song as any).spotifyUri?.replace('spotify:track:', '') || (song as any).spotifyId
      window.open(`https://open.spotify.com/track/${spotifyId}`, '_blank')
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`glass-darker rounded-lg p-3 ${isDragging ? 'shadow-2xl' : ''}`}
    >
      <div className="flex items-center gap-3">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing touch-none p-1"
        >
          <GripVertical className="w-4 h-4 text-white/40" />
        </div>

        {/* Song Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {song.title}
            {song.explicit && (
              <span className="ml-1 text-xs bg-red-500/20 text-red-400 px-1 py-0.5 rounded">E</span>
            )}
          </p>
          <p className="text-xs text-white/60 truncate">{song.artist}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {/* Play/Pause */}
          {song.previewUrl && (
            <button
              onClick={isPlaying ? onPause : onPlay}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-white" />
              ) : (
                <Play className="w-4 h-4 text-white ml-0.5" />
              )}
            </button>
          )}

          {/* Spotify Link */}
          {((song as any).spotifyUri || (song as any).spotifyId) && (
            <button
              onClick={handleSpotifyClick}
              className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center"
              title="Listen on Spotify"
            >
              <ExternalLink className="w-4 h-4 text-green-400" />
            </button>
          )}

          {/* Remove */}
          <button
            onClick={onRemove}
            className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center"
          >
            <X className="w-4 h-4 text-red-400" />
          </button>
        </div>
      </div>
    </div>
  )
}