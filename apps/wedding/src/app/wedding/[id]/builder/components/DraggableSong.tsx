'use client'

import React from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Song } from '@/types/wedding-v2'
import { Play, Pause, GripVertical, Plus, MoreVertical } from 'lucide-react'
import { formatDuration } from '@/lib/spotify-client'

interface DraggableSongProps {
  song: Song
  onPlay?: () => void
  onPause?: () => void
  isPlaying?: boolean
  source: 'search' | 'collection' | 'timeline'
  momentId?: string
  index?: number
  showAddButton?: boolean
  onAddToMoment?: (momentId: string) => void
}

export default function DraggableSong({
  song,
  onPlay,
  onPause,
  isPlaying = false,
  source,
  momentId,
  index,
  showAddButton = true,
  onAddToMoment
}: DraggableSongProps) {
  const [showMomentMenu, setShowMomentMenu] = React.useState(false)
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `${source}-${song.id}-${index || 0}`,
    data: {
      song,
      source,
      momentId,
      index
    }
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${isDragging ? 'z-50' : ''}`}
    >
      <div className={`
        flex items-center gap-3 p-3 rounded-lg
        ${source === 'timeline' ? 'bg-white/5' : 'glass-darker'}
        hover:bg-white/10 transition-all
        ${isDragging ? 'shadow-2xl ring-2 ring-purple-400' : ''}
      `}>
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing touch-none"
        >
          <GripVertical className="w-4 h-4 text-white/40 hover:text-white/60" />
        </div>

        {/* Song Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {song.title}
            {song.explicit && (
              <span className="ml-2 text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">E</span>
            )}
          </p>
          <p className="text-xs text-white/60 truncate">{song.artist}</p>
        </div>

        {/* Duration */}
        <span className="text-xs text-white/40 flex-shrink-0">
          {formatDuration(song.duration * 1000)}
        </span>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Play/Pause Button */}
          {song.previewUrl && (
            <button
              onClick={isPlaying ? onPause : onPlay}
              className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors opacity-0 group-hover:opacity-100"
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 text-white" />
              ) : (
                <Play className="w-3.5 h-3.5 text-white ml-0.5" />
              )}
            </button>
          )}

          {/* Add Button / Menu */}
          {showAddButton && source !== 'timeline' && (
            <div className="relative">
              <button
                onClick={() => setShowMomentMenu(!showMomentMenu)}
                className="w-7 h-7 rounded-full bg-purple-500/20 flex items-center justify-center hover:bg-purple-500/30 transition-colors opacity-0 group-hover:opacity-100"
              >
                {onAddToMoment ? (
                  <MoreVertical className="w-3.5 h-3.5 text-purple-400" />
                ) : (
                  <Plus className="w-3.5 h-3.5 text-purple-400" />
                )}
              </button>

              {/* Moment Selection Menu */}
              {showMomentMenu && onAddToMoment && (
                <MomentMenu
                  onSelect={(momentId) => {
                    onAddToMoment(momentId)
                    setShowMomentMenu(false)
                  }}
                  onClose={() => setShowMomentMenu(false)}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MomentMenu({ 
  onSelect, 
  onClose 
}: { 
  onSelect: (momentId: string) => void
  onClose: () => void 
}) {
  const moments = [
    { id: 'prelude', name: 'Prelude', icon: '🎵' },
    { id: 'processional', name: 'Processional', icon: '👰' },
    { id: 'ceremony', name: 'Ceremony', icon: '💍' },
    { id: 'recessional', name: 'Recessional', icon: '🎊' },
    { id: 'cocktail', name: 'Cocktail Hour', icon: '🥂' },
    { id: 'dinner', name: 'Dinner', icon: '🍽️' },
    { id: 'first-dance', name: 'First Dance', icon: '💃' },
    { id: 'parent-dances', name: 'Parent Dances', icon: '👨‍👩‍👧' },
    { id: 'cake-cutting', name: 'Cake Cutting', icon: '🎂' },
    { id: 'party', name: 'Party', icon: '🎉' },
    { id: 'last-dance', name: 'Last Dance', icon: '✨' }
  ]

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.moment-menu')) {
        onClose()
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [onClose])

  return (
    <div className="moment-menu absolute right-0 top-full mt-2 w-56 bg-slate-900 border border-white/20 rounded-lg shadow-2xl z-50 overflow-hidden">
      <div className="py-1 max-h-64 overflow-y-auto">
        {moments.map((moment) => (
          <button
            key={moment.id}
            onClick={() => onSelect(moment.id)}
            className="w-full px-4 py-2.5 text-left hover:bg-white/10 transition-colors flex items-center gap-3"
          >
            <span className="text-lg">{moment.icon}</span>
            <span className="text-sm text-white">{moment.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}