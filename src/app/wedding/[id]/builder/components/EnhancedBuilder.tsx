'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { WeddingV2, Song, Timeline } from '@/types/wedding-v2'
import { WEDDING_MOMENTS } from '@/data/weddingMoments'
import EnhancedSongSearch from './EnhancedSongSearch'
import EnhancedCollectionBrowser from './EnhancedCollectionBrowser'
import DroppableTimeline from './DroppableTimeline'
import DraggableSong from './DraggableSong'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Save, Undo, Redo, Trash2 } from 'lucide-react'
import { debounce } from 'lodash'
import { useHotkeys } from 'react-hotkeys-hook'

interface EnhancedBuilderProps {
  wedding: WeddingV2
  onUpdate: (wedding: WeddingV2) => void
}

export default function EnhancedBuilder({ wedding, onUpdate }: EnhancedBuilderProps) {
  const [timeline, setTimeline] = useState<Timeline>(wedding.timeline || {})
  const [activeTab, setActiveTab] = useState<'search' | 'collections'>('collections')
  const [selectedMoment, setSelectedMoment] = useState('first-dance')
  const [draggedSong, setDraggedSong] = useState<Song | null>(null)
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)
  const [isDraggingToTrash, setIsDraggingToTrash] = useState(false)
  const [history, setHistory] = useState<Timeline[]>([timeline])
  const [historyIndex, setHistoryIndex] = useState(0)

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
    const newTimeline = { ...timeline }
    if (!newTimeline[momentId]) {
      newTimeline[momentId] = { songs: [] }
    }
    newTimeline[momentId].songs.push(song)
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
  const handleReorderSongs = (momentId: string, songs: Song[]) => {
    const newTimeline = { ...timeline }
    if (newTimeline[momentId]) {
      newTimeline[momentId].songs = songs
    }
    updateTimeline(newTimeline)
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
            newTimeline[targetMomentId] = { songs: [] }
          }
          newTimeline[targetMomentId].songs.push(song)
          
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

  return (
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
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  activeTab === 'search'
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Search
              </button>
              <button
                onClick={() => setActiveTab('collections')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  activeTab === 'collections'
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Collections
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            {activeTab === 'search' ? (
              <EnhancedSongSearch
                onAddSong={handleAddSong}
                selectedMoment={selectedMoment}
              />
            ) : (
              <EnhancedCollectionBrowser
                onAddSong={handleAddSong}
                onAddAllSongs={(songs, momentId) => {
                  const newTimeline = { ...timeline }
                  if (!newTimeline[momentId]) {
                    newTimeline[momentId] = { songs: [] }
                  }
                  newTimeline[momentId].songs.push(...songs)
                  updateTimeline(newTimeline)
                }}
              />
            )}
          </div>
        </div>

        {/* Right Panel - Timeline */}
        <div className="flex-1 flex flex-col bg-black/20">
          {/* Timeline Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Your Timeline</h2>
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
            </div>
          </div>

          {/* Timeline Moments */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {WEDDING_MOMENTS.map((moment) => (
              <DroppableTimeline
                key={moment.id}
                moment={moment}
                songs={timeline[moment.id]?.songs || []}
                onRemoveSong={handleRemoveSong}
                onReorderSongs={handleReorderSongs}
                playingId={playingId}
                onPlaySong={handlePlaySong}
                onPauseSong={handlePauseSong}
              />
            ))}
          </div>

          {/* Trash Zone */}
          <TrashZone isDraggingToTrash={isDraggingToTrash} />
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {draggedSong && (
          <div className="shadow-2xl opacity-90">
            <DraggableSong
              song={draggedSong}
              source="timeline"
              showAddButton={false}
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
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