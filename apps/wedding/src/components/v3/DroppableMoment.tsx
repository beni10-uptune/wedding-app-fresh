'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { SortableSong } from './SortableSong';

interface Song {
  id: string;
  title: string;
  artist: string;
  bpm?: number;
  label?: string;
  previewUrl?: string;
  duration?: number;
}

interface TimelineMoment {
  id: string;
  time: string;
  duration: string;
  title: string;
  emoji: string;
  songs: Song[];
}

interface DroppableMomentProps {
  moment: TimelineMoment;
  isExpanded: boolean;
  onToggle: () => void;
  onAddSong: () => void;
  onPlaySong: (song: Song, songId: string) => void;
  onPauseSong: () => void;
  playingId: string | null;
}

export function DroppableMoment({
  moment,
  isExpanded,
  onToggle,
  onAddSong,
  onPlaySong,
  onPauseSong,
  playingId
}: DroppableMomentProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `moment-${moment.id}`,
    data: {
      type: 'moment',
      momentId: moment.id
    }
  });

  const songIds = moment.songs.map((_, index) => `${moment.id}-song-${index}`);

  return (
    <div 
      ref={setNodeRef}
      className={`glass-card rounded-xl overflow-hidden transition-all ${
        isOver ? 'ring-2 ring-purple-500 bg-purple-500/10' : ''
      }`}
    >
      {/* Moment Header */}
      <button
        onClick={onToggle}
        className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">{moment.emoji}</span>
          <div className="text-left">
            <h3 className="text-xl font-bold text-white">{moment.title}</h3>
            <p className="text-sm text-white/60">
              {moment.time} • {moment.duration} • {moment.songs?.length || 0} songs
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAddSong();
            }}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5 text-white/60" />
          </button>
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-white/40" />
          ) : (
            <ChevronRight className="w-5 h-5 text-white/40" />
          )}
        </div>
      </button>
      
      {/* Songs List - Collapsible */}
      {isExpanded && (
        <div className="px-6 pb-6">
          {moment.songs.length > 0 ? (
            <SortableContext items={songIds} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {moment.songs.map((song, idx) => {
                  const songKey = `${moment.id}-${song.id}-${idx}`;
                  const songId = `${moment.id}-song-${idx}`;
                  return (
                    <SortableSong
                      key={songKey}
                      id={songId}
                      song={song}
                      momentId={moment.id}
                      index={idx}
                      onPlay={() => onPlaySong(song, songKey)}
                      onPause={onPauseSong}
                      isPlaying={playingId === songKey}
                    />
                  );
                })}
              </div>
            </SortableContext>
          ) : (
            <div className="py-8 text-center">
              <p className="text-white/40 mb-3">No songs yet</p>
              <button
                onClick={onAddSong}
                className="px-4 py-2 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-colors"
              >
                Add First Song
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}