'use client'

import { useState, useEffect, useCallback } from 'react'
import { Timestamp } from 'firebase/firestore'
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverEvent,
  useDroppable
} from '@dnd-kit/core'
import {
  arrayMove
} from '@dnd-kit/sortable'
import { WeddingV2, Song, Timeline, TimelineSong } from '@/types/wedding-v2'
import { WEDDING_MOMENTS } from '@/data/weddingMoments'
import EnhancedSongSearch from './EnhancedSongSearch'
import EnhancedCollectionBrowser from './EnhancedCollectionBrowser'
import EnhancedTimeline from './EnhancedTimeline'
import GuestSubmissions from './GuestSubmissions'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Save, Undo, Redo, Trash2, FileMusic, BookOpen } from 'lucide-react'
import SpotifyExport from './SpotifyExport'
import MobileBuilder from './MobileBuilder'
import WelcomeFlow from './WelcomeFlow'
import InteractiveTutorial from './InteractiveTutorial'
import GuideViewer from './GuideViewer'
import CuratedPlaylistBrowser from './CuratedPlaylistBrowser'
import { debounce } from 'lodash'
import { useHotkeys } from 'react-hotkeys-hook'

interface EnhancedBuilderProps {
  wedding: WeddingV2
  onUpdate: (wedding: WeddingV2) => void
}

// Convert Song to TimelineSong
function songToTimelineSong(song: Song): TimelineSong {
  return {
    id: song.id,
    spotifyId: song.id,
    title: song.title,
    artist: song.artist,
    album: song.album,
    albumArt: song.albumArt,
    previewUrl: song.previewUrl,
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
    album: tlSong.album,
    albumArt: tlSong.albumArt,
    duration: tlSong.duration,
    energyLevel: (tlSong.energy || 3) as 1 | 2 | 3 | 4 | 5,
    explicit: tlSong.explicit || false,
    generationAppeal: [],
    genres: [],
    spotifyUri: `spotify:track:${tlSong.spotifyId}`,
    previewUrl: tlSong.previewUrl
  }
}

export default function EnhancedBuilder({ wedding, onUpdate }: EnhancedBuilderProps) {
  const [timeline, setTimeline] = useState<Timeline>(wedding.timeline || {})
  const [activeTab, setActiveTab] = useState<'search' | 'collections' | 'guests'>('collections')
  const [selectedMoment, setSelectedMoment] = useState('first-dance')
  const [draggedSong, setDraggedSong] = useState<Song | null>(null) // Still needed for drag state
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)
  const [isDraggingToTrash, setIsDraggingToTrash] = useState(false)
  const [history, setHistory] = useState<Timeline[]>([timeline])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [showSpotifyExport, setShowSpotifyExport] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showWelcomeFlow, setShowWelcomeFlow] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false)
  const [showGuideViewer, setShowGuideViewer] = useState(false)
  const [selectedGuideMoment, setSelectedGuideMoment] = useState<string | undefined>()

  // Calculate total songs
  const totalSongs = Object.values(timeline).reduce((count, moment) => {
    return count + (moment?.songs?.length || 0)
  }, 0)

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Check if user has seen welcome flow
  useEffect(() => {
    const hasSeenKey = `wedding_${wedding.id}_welcome_seen`
    const hasSeen = localStorage.getItem(hasSeenKey)
    
    if (!hasSeen && totalSongs === 0) {
      // New user with empty timeline
      setShowWelcomeFlow(true)
    } else {
      setHasSeenWelcome(true)
    }
  }, [wedding.id, totalSongs])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  // Keyboard shortcuts
  useHotkeys('cmd+z, ctrl+z', () => undo(), [historyIndex])
  useHotkeys('cmd+shift+z, ctrl+shift+z', () => redo(), [historyIndex])
  useHotkeys('cmd+s, ctrl+s', (e) => {
    e.preventDefault()
    saveTimeline(timeline)
  }, [timeline])

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

  // Update timeline with history tracking
  const updateTimeline = (newTimeline: Timeline, saveToHistory = true) => {
    setTimeline(newTimeline)
    saveTimeline(newTimeline)
    
    if (saveToHistory) {
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push(newTimeline)
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
    }
  }

  // Undo/Redo functionality
  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setTimeline(history[newIndex])
      saveTimeline(history[newIndex])
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setTimeline(history[newIndex])
      saveTimeline(history[newIndex])
    }
  }

  // Play/Pause functionality
  const handlePlaySong = (song: Song) => {
    if (audioElement) {
      audioElement.pause()
    }

    if (song.previewUrl) {
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
    }
  }

  const handlePauseSong = () => {
    if (audioElement) {
      audioElement.pause()
      setPlayingId(null)
    }
  }

  // Add song to specific moment
  const handleAddSong = (song: Song, momentId: string) => {
    // Check free tier limits before adding
    if (wedding.paymentStatus !== 'paid') {
      if (totalSongs >= 25) {
        alert('You\'ve reached the 25 song limit on the free plan. Upgrade to add unlimited songs!')
        return
      }
      
      // Warning at 80% (20 songs)
      if (totalSongs >= 20 && totalSongs < 25) {
        const remaining = 25 - totalSongs
        if (!confirm(`⚠️ You have ${remaining} songs left on your free plan. Continue adding this song?`)) {
          return
        }
      }
    }
    
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
  }

  // Remove song from timeline
  const handleRemoveSong = (songId: string, momentId: string) => {
    const newTimeline = { ...timeline }
    if (newTimeline[momentId]) {
      newTimeline[momentId].songs = newTimeline[momentId].songs.filter(
        s => s.id !== songId
      )
    }
    updateTimeline(newTimeline)
  }

  // Reorder songs within a moment
  const handleReorderSongs = (momentId: string, songs: TimelineSong[]) => {
    const newTimeline = { ...timeline }
    if (newTimeline[momentId]) {
      newTimeline[momentId].songs = songs
    }
    updateTimeline(newTimeline)
  }

  // Welcome flow handlers
  const handleWelcomeComplete = (preferences: any) => {
    // Save preferences
    localStorage.setItem(`wedding_${wedding.id}_welcome_seen`, 'true')
    setShowWelcomeFlow(false)
    setHasSeenWelcome(true)
    setShowTutorial(true)
    
    // TODO: Save preferences to Firebase
    console.log('User preferences:', preferences)
  }

  const handleWelcomeSkip = () => {
    localStorage.setItem(`wedding_${wedding.id}_welcome_seen`, 'true')
    setShowWelcomeFlow(false)
    setHasSeenWelcome(true)
  }

  const handleTutorialComplete = () => {
    localStorage.setItem(`wedding_${wedding.id}_tutorial_seen`, 'true')
    setShowTutorial(false)
  }

  const handleTutorialSkip = () => {
    localStorage.setItem(`wedding_${wedding.id}_tutorial_seen`, 'true')
    setShowTutorial(false)
  }

  // Guide viewer handlers
  const handleOpenGuide = (momentId?: string) => {
    setSelectedGuideMoment(momentId)
    setShowGuideViewer(true)
  }

  const handleCloseGuide = () => {
    setShowGuideViewer(false)
    setSelectedGuideMoment(undefined)
  }

  // Drag and Drop handlers
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const song = active.data.current?.song as Song
    if (song) {
      setDraggedSong(song)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event
    setIsDraggingToTrash(over?.id === 'trash-zone')
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setDraggedSong(null)
    setIsDraggingToTrash(false)

    if (!over) return

    const activeData = active.data.current
    const overData = over.data.current

    // Handle dropping on trash
    if (over.id === 'trash-zone' && activeData?.source === 'timeline') {
      handleRemoveSong(activeData.song.id, activeData.momentId)
      return
    }

    // Handle dropping on a moment
    if (overData?.type === 'moment') {
      const song = activeData?.song as Song
      const targetMomentId = overData.momentId

      if (activeData?.source === 'timeline') {
        // Moving from one moment to another
        const sourceMomentId = activeData.momentId
        if (sourceMomentId !== targetMomentId) {
          const newTimeline = { ...timeline }
          
          // Remove from source
          if (newTimeline[sourceMomentId]) {
            newTimeline[sourceMomentId].songs = newTimeline[sourceMomentId].songs.filter(
              s => s.id !== song.id
            )
          }
          
          // Add to target
          if (!newTimeline[targetMomentId]) {
            const targetMoment = WEDDING_MOMENTS.find(m => m.id === targetMomentId)
            if (!targetMoment) return
            
            newTimeline[targetMomentId] = {
              id: targetMomentId,
              name: targetMoment.name,
              order: targetMoment.order,
              duration: targetMoment.duration,
              songs: []
            }
          }
          newTimeline[targetMomentId].songs.push(songToTimelineSong(song))
          
          updateTimeline(newTimeline)
        }
      } else {
        // Adding new song to moment
        handleAddSong(song, targetMomentId)
      }
    }

    // Handle reordering within same moment
    if (
      activeData?.source === 'timeline' && 
      overData?.source === 'timeline' &&
      activeData.momentId === overData.momentId
    ) {
      const momentId = activeData.momentId
      const oldIndex = activeData.index
      const newIndex = overData.index

      const newTimeline = { ...timeline }
      if (newTimeline[momentId]) {
        const newSongs = arrayMove(
          newTimeline[momentId].songs,
          oldIndex,
          newIndex
        )
        newTimeline[momentId].songs = newSongs
        updateTimeline(newTimeline)
      }
    }
  }

  // Use mobile builder for small screens
  if (isMobile) {
    return (
      <MobileBuilder
        wedding={wedding}
        onUpdate={onUpdate}
      />
    )
  }

  return (
    <>
      {/* Welcome Flow */}
      {showWelcomeFlow && (
        <WelcomeFlow
          wedding={wedding}
          onComplete={handleWelcomeComplete}
          onSkip={handleWelcomeSkip}
        />
      )}

      {/* Interactive Tutorial */}
      {showTutorial && !showWelcomeFlow && (
        <InteractiveTutorial
          onComplete={handleTutorialComplete}
          onSkip={handleTutorialSkip}
        />
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex h-full">
        {/* Left Panel - Search */}
        <div className="w-1/3 border-r border-white/10 flex flex-col">
          <div className="p-4 border-b border-white/10">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('search')}
                className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors text-sm ${
                  activeTab === 'search'
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Search
              </button>
              <button
                onClick={() => setActiveTab('collections')}
                className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors text-sm ${
                  activeTab === 'collections'
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'text-white/60 hover:text-white'
                }`}
                data-tutorial="collections-tab"
              >
                Collections
              </button>
              <button
                onClick={() => setActiveTab('guests')}
                className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors text-sm ${
                  activeTab === 'guests'
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Guest Songs
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            {activeTab === 'search' && (
              <EnhancedSongSearch
                onAddSong={handleAddSong}
                selectedMoment={selectedMoment}
              />
            )}
            {activeTab === 'collections' && (
              <CuratedPlaylistBrowser
                selectedMoment={selectedMoment}
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
                }}
                onOpenGuide={handleOpenGuide}
              />
            )}
            {activeTab === 'guests' && (
              <GuestSubmissions
                weddingId={wedding.id}
                onAddSong={handleAddSong}
              />
            )}
          </div>
        </div>

        {/* Right Panel - Timeline */}
        <div className="flex-1 flex flex-col bg-black/20">
          {/* Timeline Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Your Timeline</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-sm ${wedding.paymentStatus === 'paid' ? 'text-white/60' : totalSongs >= 25 ? 'text-red-400' : totalSongs >= 20 ? 'text-yellow-400' : 'text-white/60'}`}>
                  {totalSongs} songs
                  {wedding.paymentStatus !== 'paid' && ' / 25 free'}
                </span>
                {wedding.paymentStatus !== 'paid' && totalSongs >= 20 && totalSongs < 25 && (
                  <span className="text-xs text-yellow-400">• {25 - totalSongs} left</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={undo}
                disabled={historyIndex === 0}
                className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Undo (Cmd+Z)"
              >
                <Undo className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={redo}
                disabled={historyIndex === history.length - 1}
                className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Redo (Cmd+Shift+Z)"
              >
                <Redo className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={() => setShowSpotifyExport(true)}
                className="p-2 rounded-lg hover:bg-white/10 text-green-400 hover:text-green-300"
                title="Export to Spotify"
              >
                <FileMusic className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleOpenGuide()}
                className="p-2 rounded-lg hover:bg-white/10 text-purple-400 hover:text-purple-300"
                title="Wedding Music Guides"
              >
                <BookOpen className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Timeline Moments */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4" data-tutorial="timeline">
            {WEDDING_MOMENTS.map((moment, index) => (
              <div key={moment.id} data-tutorial={index === 0 ? "timeline-moment" : undefined}>
                <EnhancedTimeline
                moment={moment}
                songs={(timeline[moment.id]?.songs || []).map(timelineSongToSong)}
                onRemoveSong={handleRemoveSong}
                onReorderSongs={(momentId, songs) => {
                  handleReorderSongs(momentId, songs.map(songToTimelineSong))
                }}
                playingId={playingId}
                onPlaySong={handlePlaySong}
                onPauseSong={handlePauseSong}
                onAddSong={(momentId) => {
                  setSelectedMoment(momentId)
                  setActiveTab('search')
                }}
                />
              </div>
            ))}
          </div>

          {/* Trash Zone */}
          <TrashZone isDraggingToTrash={isDraggingToTrash} />
        </div>
      </div>

      {/* Removed DragOverlay to prevent duplication */}
    </DndContext>

    {/* Spotify Export Modal */}
    {showSpotifyExport && (
      <SpotifyExport
        wedding={wedding}
        timeline={timeline}
        onClose={() => setShowSpotifyExport(false)}
      />
    )}

    {/* Guide Viewer */}
    {showGuideViewer && (
      <GuideViewer
        momentId={selectedGuideMoment}
        onClose={handleCloseGuide}
        onSelectGuide={() => {}}
      />
    )}
  </>
  )
}

function TrashZone({ isDraggingToTrash }: { isDraggingToTrash: boolean }) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'trash-zone',
    data: { type: 'trash' }
  })

  return (
    <div
      ref={setNodeRef}
      className={`
        border-t border-white/10 p-4 transition-all
        ${isDraggingToTrash || isOver ? 'bg-red-500/20 border-red-500/50' : ''}
      `}
    >
      <div className="flex items-center justify-center gap-2 text-white/40">
        <Trash2 className={`w-5 h-5 ${isDraggingToTrash || isOver ? 'text-red-400' : ''}`} />
        <span className={`text-sm ${isDraggingToTrash || isOver ? 'text-red-400' : ''}`}>
          Drop here to remove
        </span>
      </div>
    </div>
  )
}