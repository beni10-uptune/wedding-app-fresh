'use client'

import { useState, useEffect, useCallback } from 'react'
import { Timestamp } from 'firebase/firestore'
import { WeddingV2, Song, Timeline, TimelineSong } from '@/types/wedding-v2'
import { WEDDING_MOMENTS_V2 as WEDDING_MOMENTS } from '@/data/weddingMomentsV2'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { debounce } from 'lodash'
import EnhancedSongSearch from './EnhancedSongSearch'
import EnhancedCollectionBrowser from './EnhancedCollectionBrowser'
import MobileTimelineView from './MobileTimelineView'
import GuestSubmissions from './GuestSubmissions'
import { formatDuration } from '@/lib/spotify-client'

interface MobileBuilderProps {
  wedding: WeddingV2
  onUpdate: (wedding: WeddingV2) => void
}

type ViewMode = 'timeline' | 'search' | 'collections' | 'guests'

// Convert Song to TimelineSong
function songToTimelineSong(song: Song): TimelineSong {
  return {
    id: song.id,
    spotifyId: song.id,
    title: song.title,
    artist: song.artist,
    duration: song.duration,
    addedBy: 'couple',
    addedAt: Timestamp.now(),
    energy: song.energyLevel,
    explicit: song.explicit
  }
}

// Convert TimelineSong to Song for components
function timelineSongToSong(tlSong: TimelineSong): Song {
  return {
    id: tlSong.id,
    title: tlSong.title,
    artist: tlSong.artist,
    duration: tlSong.duration,
    energyLevel: (tlSong.energy || 3) as 1 | 2 | 3 | 4 | 5,
    explicit: tlSong.explicit || false,
    generationAppeal: [],
    genres: [],
    spotifyUri: `spotify:track:${tlSong.spotifyId}`,
    previewUrl: ''
  }
}

export default function MobileBuilder({ wedding, onUpdate }: MobileBuilderProps) {
  const [timeline, setTimeline] = useState<Timeline>(wedding.timeline || {})
  const [viewMode, setViewMode] = useState<ViewMode>('timeline')
  const [selectedMoment, setSelectedMoment] = useState<string | null>(null)
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioElement) {
        audioElement.pause()
        audioElement.src = ''
      }
    }
  }, [audioElement])

  // Auto-save timeline changes
  const saveTimeline = useCallback(
    debounce(async (newTimeline: Timeline) => {
      try {
        await updateDoc(doc(db, 'weddings', wedding.id), {
          timeline: newTimeline,
          updatedAt: new Date()
        })
      } catch (error) {
        console.error('Failed to save timeline:', error)
      }
    }, 1000),
    [wedding.id]
  )

  const updateTimeline = (newTimeline: Timeline) => {
    setTimeline(newTimeline)
    saveTimeline(newTimeline)
    onUpdate({ ...wedding, timeline: newTimeline })
  }

  const handleAddSong = (song: Song, momentId: string) => {
    const newTimeline = { ...timeline }
    if (!newTimeline[momentId]) {
      const moment = WEDDING_MOMENTS.find(m => m.id === momentId)
      if (!moment) return
      
      newTimeline[momentId] = {
        id: momentId,
        name: moment.name,
        order: moment.order,
        duration: moment.duration,
        songs: []
      }
    }
    newTimeline[momentId].songs.push(songToTimelineSong(song))
    updateTimeline(newTimeline)
    
    // Switch back to timeline view after adding
    setViewMode('timeline')
    setSelectedMoment(momentId)
  }

  const handleRemoveSong = (songId: string, momentId: string) => {
    const newTimeline = { ...timeline }
    if (newTimeline[momentId]) {
      newTimeline[momentId].songs = newTimeline[momentId].songs.filter(
        s => s.id !== songId
      )
    }
    updateTimeline(newTimeline)
  }

  const handleReorderSongs = (momentId: string, songs: Song[]) => {
    const newTimeline = { ...timeline }
    if (!newTimeline[momentId]) {
      const moment = WEDDING_MOMENTS.find(m => m.id === momentId)
      if (!moment) return
      
      newTimeline[momentId] = {
        id: momentId,
        name: moment.name,
        order: moment.order,
        duration: moment.duration,
        songs: []
      }
    }
    newTimeline[momentId].songs = songs.map(songToTimelineSong)
    updateTimeline(newTimeline)
  }

  const handlePlaySong = (song: Song) => {
    if (audioElement) {
      audioElement.pause()
    }

    if (song.previewUrl && playingId !== song.id) {
      const audio = new Audio(song.previewUrl)
      audio.volume = 0.5
      audio.play().catch(err => {
        console.error('Failed to play preview:', err)
      })

      audio.addEventListener('ended', () => {
        setPlayingId(null)
      })

      setAudioElement(audio)
      setPlayingId(song.id)
    } else {
      setPlayingId(null)
    }
  }

  const handlePauseSong = () => {
    if (audioElement) {
      audioElement.pause()
      setPlayingId(null)
    }
  }

  const getTotalDuration = () => {
    return Object.values(timeline).reduce((total, moment) => {
      return total + moment.songs.reduce((sum, song) => sum + song.duration, 0)
    }, 0)
  }

  const getTotalSongs = () => {
    return Object.values(timeline).reduce((total, moment) => {
      return total + moment.songs.length
    }, 0)
  }

  return (
    <div className="flex flex-col h-full bg-black/20">
      {/* Mobile Header */}
      <div className="glass border-b border-white/10 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white">Music Builder</h2>
          <div className="text-sm text-white/60">
            {getTotalSongs()} songs • {formatDuration(getTotalDuration() * 1000)}
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="grid grid-cols-4 gap-1">
          <button
            onClick={() => setViewMode('timeline')}
            className={`py-2 px-2 rounded-lg text-xs font-medium transition-colors ${
              viewMode === 'timeline'
                ? 'bg-purple-500/20 text-purple-400'
                : 'bg-white/10 text-white/60'
            }`}
          >
            Timeline
          </button>
          <button
            onClick={() => setViewMode('search')}
            className={`py-2 px-2 rounded-lg text-xs font-medium transition-colors ${
              viewMode === 'search'
                ? 'bg-purple-500/20 text-purple-400'
                : 'bg-white/10 text-white/60'
            }`}
          >
            Search
          </button>
          <button
            onClick={() => setViewMode('collections')}
            className={`py-2 px-2 rounded-lg text-xs font-medium transition-colors ${
              viewMode === 'collections'
                ? 'bg-purple-500/20 text-purple-400'
                : 'bg-white/10 text-white/60'
            }`}
          >
            Curated
          </button>
          <button
            onClick={() => setViewMode('guests')}
            className={`py-2 px-2 rounded-lg text-xs font-medium transition-colors ${
              viewMode === 'guests'
                ? 'bg-purple-500/20 text-purple-400'
                : 'bg-white/10 text-white/60'
            }`}
          >
            Guests
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'timeline' && (
          <MobileTimelineView
            timeline={timeline as any}
            selectedMoment={selectedMoment}
            onSelectMoment={setSelectedMoment}
            onRemoveSong={handleRemoveSong}
            onReorderSongs={handleReorderSongs}
            onPlaySong={handlePlaySong}
            onPauseSong={handlePauseSong}
            playingId={playingId}
            onAddSongs={() => setViewMode('search')}
          />
        )}

        {viewMode === 'search' && (
          <div className="h-full">
            <EnhancedSongSearch
              onAddSong={handleAddSong}
              selectedMoment={selectedMoment || 'first-dance'}
            />
          </div>
        )}

        {viewMode === 'collections' && (
          <div className="h-full">
            <EnhancedCollectionBrowser
              onAddSong={handleAddSong}
              onAddAllSongs={(songs, momentId) => {
                const newTimeline = { ...timeline }
                if (!newTimeline[momentId]) {
                  const moment = WEDDING_MOMENTS.find(m => m.id === momentId)
                  if (!moment) return
                  
                  newTimeline[momentId] = {
                    id: momentId,
                    name: moment.name,
                    order: moment.order,
                    duration: moment.duration,
                    songs: []
                  }
                }
                newTimeline[momentId].songs.push(...songs.map(songToTimelineSong))
                updateTimeline(newTimeline)
                setViewMode('timeline')
                setSelectedMoment(momentId)
              }}
            />
          </div>
        )}

        {viewMode === 'guests' && (
          <div className="h-full">
            <GuestSubmissions
              weddingId={wedding.id}
              onAddSong={handleAddSong}
            />
          </div>
        )}
      </div>
    </div>
  )
}