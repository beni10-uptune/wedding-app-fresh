'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Play, Pause, GripVertical, X, ExternalLink } from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist: string;
  bpm?: number;
  label?: string;
  previewUrl?: string;
  spotifyId?: string;
  duration?: number;
}

interface SortableSongProps {
  id: string;
  song: Song;
  momentId: string;
  index: number;
  onPlay?: () => void;
  onPause?: () => void;
  onRemove?: () => void;
  isPlaying?: boolean;
}

export function SortableSong({
  id,
  song,
  momentId,
  index,
  onPlay,
  onPause,
  onRemove,
  isPlaying = false,
}: SortableSongProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id,
    data: {
      song,
      momentId,
      index
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all ${
        isDragging ? 'shadow-2xl ring-2 ring-purple-400 z-50' : ''
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing touch-none"
      >
        <GripVertical className="w-4 h-4 text-white/30 group-hover:text-white/60" />
      </div>
      
      <span className="text-white/40 text-sm w-6">{index + 1}</span>
      
      <div className="flex-1">
        <p className="font-medium text-white">
          {song.label && <span className="text-xs text-white/50 mr-2">{song.label}:</span>}
          {song.title}
        </p>
        <p className="text-sm text-white/60">
          {song.artist}
          {song.bpm && <span className="ml-2 text-xs text-white/40">• {song.bpm} BPM</span>}
          {song.duration && <span className="ml-2 text-xs text-white/40">• {formatDuration(song.duration)}</span>}
        </p>
      </div>
      
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {song.previewUrl ? (
          <button 
            onClick={isPlaying ? onPause : onPlay}
            className="p-1.5 hover:bg-white/10 rounded transition-all"
            title="Preview song"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-white/60" />
            ) : (
              <Play className="w-4 h-4 text-white/60" />
            )}
          </button>
        ) : song.spotifyId ? (
          <a
            href={`https://open.spotify.com/track/${song.spotifyId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 hover:bg-white/10 rounded transition-all"
            title="Open in Spotify"
          >
            <ExternalLink className="w-4 h-4 text-white/60" />
          </a>
        ) : null}
        
        {onRemove && (
          <button
            onClick={onRemove}
            className="p-1.5 hover:bg-white/10 rounded transition-all"
            title="Remove song"
          >
            <X className="w-4 h-4 text-white/60 hover:text-red-400" />
          </button>
        )}
      </div>
    </div>
  );
}