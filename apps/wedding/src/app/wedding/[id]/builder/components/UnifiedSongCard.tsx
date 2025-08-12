'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Song } from '@/types/wedding-v2'
import { 
  Play, Pause, Plus, GripVertical, MoreHorizontal,
  Music, Clock, ChevronDown
} from 'lucide-react'
import { formatDuration } from '@/lib/spotify-client'

interface UnifiedSongCardProps {
  song: Song
  source: 'search' | 'collection' | 'timeline' | 'guest'
  momentId?: string
  index?: number
  isPlaying?: boolean
  onPlay?: () => void
  onPause?: () => void
  onAddToMoment?: (momentId: string) => void
  onRemove?: () => void
  isDraggingEnabled?: boolean
  variant?: 'default' | 'compact' | 'timeline'
}

export default function UnifiedSongCard({
  song,
  source,
  momentId,
  index,
  isPlaying = false,
  onPlay,
  onPause,
  onAddToMoment,
  onRemove,
  isDraggingEnabled = true,
  variant = 'default'
}: UnifiedSongCardProps) {
  const [showMomentMenu, setShowMomentMenu] = useState(false)
  const [showDragHandle, setShowDragHandle] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  
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
    },
    disabled: !isDraggingEnabled
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'auto'
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMomentMenu(false)
      }
    }
    
    if (showMomentMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMomentMenu])

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isPlaying && onPause) {
      onPause()
    } else if (!isPlaying && onPlay) {
      onPlay()
    }
  }

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowMomentMenu(!showMomentMenu)
  }

  // Use canonical moment IDs from WEDDING_MOMENTS_V2
  const moments = [
    { id: 'getting-ready', name: 'Getting Ready', icon: '💄', description: 'Pre-ceremony preparation' },
    { id: 'ceremony', name: 'Ceremony', icon: '💒', description: 'Processional, vows, recessional' },
    { id: 'cocktails', name: 'Cocktails', icon: '🥂', description: 'Sophisticated mingling' },
    { id: 'dinner', name: 'Dinner', icon: '🍽️', description: 'Elegant background dining' },
    { id: 'first-dance', name: 'First Dance', icon: '💕', description: 'Your special moment' },
    { id: 'parent-dances', name: 'Parent Dances', icon: '👨‍👩‍👧', description: 'Family dances' },
    { id: 'party', name: 'Party Time', icon: '🎉', description: 'Dance floor hits' },
    { id: 'last-dance', name: 'Last Dance', icon: '🌙', description: 'End on a perfect note' }
  ]

  const cardClasses = {
    default: `
      group relative rounded-lg transition-all
      ${source === 'timeline' ? 'bg-white/5' : 'bg-slate-800/50 hover:bg-slate-800/70'}
      ${isDragging ? 'shadow-2xl ring-2 ring-purple-400 scale-105' : ''}
      ${showDragHandle ? 'pl-10' : ''}
      hover:ring-1 hover:ring-white/20
    `,
    compact: `
      group relative rounded-lg transition-all
      bg-white/5 hover:bg-white/10
      ${isDragging ? 'shadow-xl ring-1 ring-purple-400' : ''}
    `,
    timeline: `
      group relative rounded-lg transition-all
      bg-transparent hover:bg-white/5
      ${isDragging ? 'shadow-xl ring-1 ring-purple-400' : ''}
    `
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative ${isDragging ? 'z-50' : ''}`}
      onMouseEnter={() => isDraggingEnabled && setShowDragHandle(true)}
      onMouseLeave={() => setShowDragHandle(false)}
    >
      <div className={cardClasses[variant]}>
        {/* Drag Handle - Always visible on hover */}
        {isDraggingEnabled && showDragHandle && (
          <div
            {...attributes}
            {...listeners}
            className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing touch-none z-10"
          >
            <GripVertical className="w-5 h-5 text-white/40 hover:text-white/60" />
          </div>
        )}

        <div className={`flex items-center gap-3 ${variant === 'compact' ? 'p-2' : 'p-3'}`}>
          {/* Album Art or Icon */}
          <div className={`flex-shrink-0 ${variant === 'compact' ? 'w-10 h-10' : 'w-12 h-12'} bg-white/10 rounded-lg overflow-hidden`}>
            {song.albumArt ? (
              <img 
                src={song.albumArt} 
                alt={song.album || song.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Music className={`${variant === 'compact' ? 'w-5 h-5' : 'w-6 h-6'} text-white/40`} />
              </div>
            )}
          </div>

          {/* Song Info - Click to Play */}
          <div 
            className="flex-1 min-w-0 cursor-pointer"
            onClick={handlePlayClick}
          >
            <p className={`${variant === 'compact' ? 'text-sm' : 'text-sm'} font-medium text-white truncate flex items-center gap-2`}>
              {song.title}
              {song.explicit && (
                <span className="text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">E</span>
              )}
            </p>
            <p className={`${variant === 'compact' ? 'text-xs' : 'text-xs'} text-white/60 truncate`}>
              {song.artist}
            </p>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-1 text-xs text-white/40">
            <Clock className="w-3 h-3" />
            <span>{formatDuration(song.duration * 1000)}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            {/* Play/Pause Indicator */}
            {isPlaying && (
              <div className="w-7 h-7 rounded-full bg-purple-500/20 flex items-center justify-center">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
              </div>
            )}

            {/* Add Button - Only show if not in timeline */}
            {source !== 'timeline' && onAddToMoment && (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={handleAddClick}
                  className={`
                    flex items-center gap-1 px-3 py-1.5 rounded-full
                    bg-purple-500/20 hover:bg-purple-500/30
                    text-purple-400 text-sm font-medium
                    transition-all opacity-100
                    ${showMomentMenu ? 'bg-purple-500/30' : ''}
                  `}
                  title="Add to timeline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${showMomentMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Moment Selection Menu */}
                {showMomentMenu && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-slate-900 border border-white/20 rounded-lg shadow-2xl z-50 overflow-hidden">
                    <div className="p-2">
                      <p className="text-xs text-white/60 px-2 py-1">Add to moment:</p>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {moments.map((moment) => (
                        <button
                          key={moment.id}
                          onClick={(e) => {
                            e.stopPropagation()
                            onAddToMoment(moment.id)
                            setShowMomentMenu(false)
                          }}
                          className="w-full px-3 py-2.5 text-left hover:bg-white/10 transition-colors flex items-center gap-3"
                        >
                          <span className="text-xl">{moment.icon}</span>
                          <div className="flex-1">
                            <p className="text-sm text-white font-medium">{moment.name}</p>
                            <p className="text-xs text-white/60">{moment.description}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* More Options for Timeline Items */}
            {source === 'timeline' && onRemove && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove()
                }}
                className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                title="More options"
              >
                <MoreHorizontal className="w-4 h-4 text-white/60" />
              </button>
            )}
          </div>
        </div>

        {/* Visual Feedback for Playing State */}
        {isPlaying && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-purple-500/10 rounded-lg animate-pulse" />
          </div>
        )}
      </div>

      {/* Drag Preview Tooltip */}
      {isDragging && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          Drag to a moment
        </div>
      )}
    </div>
  )
}