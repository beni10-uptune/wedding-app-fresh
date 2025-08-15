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
import { WEDDING_MOMENTS_V2 as WEDDING_MOMENTS } from '@/data/weddingMomentsV2'
import EnhancedSongSearch from './EnhancedSongSearch'
import EnhancedCollectionBrowser from './EnhancedCollectionBrowser'
import EnhancedTimeline from './EnhancedTimeline'
import GuestSubmissions from './GuestSubmissions'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Save, Undo, Redo, Trash2, FileMusic, BookOpen, Music, Sparkles } from 'lucide-react'
import SpotifyExport from './SpotifyExport'
import UpgradePrompt from '@/components/UpgradePrompt'
import { useFeatureAccess } from '@/app/builder/BuilderFixes'
import EnhancedMobileBuilder from './EnhancedMobileBuilder'
import WelcomeFlow from './WelcomeFlow'
import InteractiveTutorial from './InteractiveTutorial'
import GuideViewer from './GuideViewer'
import CuratedPlaylistBrowser from './CuratedPlaylistBrowser'
import { debounce } from 'lodash'
import { useHotkeys } from 'react-hotkeys-hook'
import { logError, logger } from '@/lib/logger'
import { getEffectiveSongLimit, getSongLimitMessage } from '@/lib/grandfathering'
import { useSmartPlaylist } from '@/hooks/useSmartPlaylist'
import GenreFilter from './GenreFilter'

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
  const [activeTab, setActiveTab] = useState<'search' | 'collections' | 'guests' | 'genres'>('collections')
  const [selectedMoment, setSelectedMoment] = useState('first-dance')
  const [draggedSong, setDraggedSong] = useState<Song | null>(null) // Still needed for drag state
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)
  const [isDraggingToTrash, setIsDraggingToTrash] = useState(false)
  const [history, setHistory] = useState<Timeline[]>([wedding.timeline || {}])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [showSpotifyExport, setShowSpotifyExport] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showWelcomeFlow, setShowWelcomeFlow] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false)
  const [showGuideViewer, setShowGuideViewer] = useState(false)
  const [selectedGuideMoment, setSelectedGuideMoment] = useState<string | undefined>()
  const [showUpgradePrompt, setShowUpgradePrompt] = useState<string | null>(null)
  
  // Smart playlist generation
  const {
    selectedGenres,
    availableGenres,
    availableSongs,
    isLoading: isLoadingGenres,
    timeline: smartTimeline,
    stats: playlistStats,
    toggleGenre,
    clearGenres,
    regeneratePlaylist,
    loadSongsFromFirestore,
    applySmartSelection
  } = useSmartPlaylist({
    initialTimeline: timeline,
    autoLoad: false
  })
  
  // Check feature access
  const { hasAccess: canExport } = useFeatureAccess('export', wedding.id)
  const { hasAccess: canAddCoOwner } = useFeatureAccess('add-coowner', wedding.id)
  const { hasAccess: hasUnlimitedSongs } = useFeatureAccess('unlimited-songs', wedding.id)
  
  // Sync timeline when wedding prop changes
  useEffect(() => {
    if (wedding.timeline && Object.keys(wedding.timeline).length > 0) {
      setTimeline(wedding.timeline)
      setHistory([wedding.timeline])
      setHistoryIndex(0)
    }
  }, [wedding.timeline])

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

  // Check if user has seen welcome flow and auto-populate for new users
  useEffect(() => {
    const hasSeenKey = `wedding_${wedding.id}_welcome_seen`
    const hasSeen = localStorage.getItem(hasSeenKey)
    
    // Skip WelcomeFlow if user completed create-wedding wizard (has venue or guest count)
    // or if they've already seen the welcome flow
    const hasCompletedWizard = wedding.guestCount !== undefined || wedding.venueType !== undefined
    
    const autoPopulateForNewUser = async () => {
      // Load songs if not already loaded
      if (availableSongs.length === 0) {
        await loadSongsFromFirestore()
      }
      
      // Wait a bit for songs to load
      setTimeout(() => {
        // Auto-select default genres for balanced playlist
        const defaultGenres = ['pop', 'r&b', 'indie', 'soul']
        defaultGenres.forEach(genre => {
          if (!selectedGenres.includes(genre) && availableGenres.includes(genre)) {
            toggleGenre(genre)
          }
        })
        
        // Apply smart selection after genres are set
        setTimeout(() => {
          const newTimeline = applySmartSelection()
          if (newTimeline) {
            updateTimeline(newTimeline)
          }
        }, 500)
      }, 1000)
    }
    
    if (hasCompletedWizard || hasSeen || totalSongs > 0) {
      setHasSeenWelcome(true)
      // If they completed wizard but haven't seen tutorial, show it directly
      if (hasCompletedWizard && !hasSeen && totalSongs === 0) {
        // Auto-populate with default playlist for users who skip welcome flow
        autoPopulateForNewUser()
        setShowTutorial(true)
        localStorage.setItem(hasSeenKey, 'true')
      }
    } else if (!hasSeen && totalSongs === 0) {
      // Only show WelcomeFlow for users who didn't complete create-wedding
      setShowWelcomeFlow(true)
    }
  }, [wedding.id, totalSongs, wedding.guestCount, wedding.venueType])

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
        logError(error, { context: 'Failed to save timeline', weddingId: wedding.id })
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
        // Preview play failures are common and expected (user interaction required)
        logger.debug('Failed to play preview', { error: err })
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
      const songLimit = getEffectiveSongLimit(wedding)
      
      if (totalSongs >= songLimit) {
        alert(`You've reached the ${songLimit} song limit on the free plan. Upgrade to add unlimited songs!`)
        return
      }
      
      // Warning at 80%
      const warningThreshold = Math.floor(songLimit * 0.8)
      if (totalSongs >= warningThreshold && totalSongs < songLimit) {
        const remaining = songLimit - totalSongs
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
  const handleWelcomeComplete = async (preferences: any) => {
    // Save preferences
    localStorage.setItem(`wedding_${wedding.id}_welcome_seen`, 'true')
    setShowWelcomeFlow(false)
    setHasSeenWelcome(true)
    
    // Auto-populate timeline based on preferences
    if (availableSongs.length === 0) {
      await loadSongsFromFirestore()
    }
    
    // Map music styles to genres
    const genreMap: Record<string, string[]> = {
      'classic': ['classical', 'jazz', 'soul'],
      'modern': ['pop', 'indie', 'electronic'],
      'rustic': ['country', 'acoustic', 'indie'],
      'party': ['pop', 'hip-hop', 'electronic', 'rock'],
      'romantic': ['r&b', 'soul', 'acoustic'],
      'cultural': ['latin', 'reggae', 'world']
    }
    
    // Select genres based on preferences
    const selectedGenresList: string[] = []
    preferences.musicStyle?.forEach((style: string) => {
      const genres = genreMap[style] || []
      selectedGenresList.push(...genres)
    })
    
    // Remove avoided genres
    const filteredGenres = selectedGenresList.filter(
      g => !preferences.avoidGenres?.map((ag: string) => ag.toLowerCase()).includes(g)
    )
    
    // Set selected genres for the smart playlist
    filteredGenres.forEach(genre => {
      if (!selectedGenres.includes(genre) && availableGenres.includes(genre)) {
        toggleGenre(genre)
      }
    })
    
    // Generate and apply smart playlist
    setTimeout(() => {
      const newTimeline = applySmartSelection()
      if (newTimeline) {
        updateTimeline(newTimeline)
      }
      setShowTutorial(true)
    }, 500)
    
    logger.info('User preferences saved and playlist generated', { preferences, weddingId: wedding.id })
  }

  const handleWelcomeSkip = async () => {
    localStorage.setItem(`wedding_${wedding.id}_welcome_seen`, 'true')
    setShowWelcomeFlow(false)
    setHasSeenWelcome(true)
    
    // Auto-populate with default songs when skipping
    if (availableSongs.length === 0) {
      await loadSongsFromFirestore()
    }
    
    // Wait for songs to load then apply defaults
    setTimeout(() => {
      const defaultGenres = ['pop', 'r&b', 'indie', 'soul']
      defaultGenres.forEach(genre => {
        if (!selectedGenres.includes(genre) && availableGenres.includes(genre)) {
          toggleGenre(genre)
        }
      })
      
      setTimeout(() => {
        const newTimeline = applySmartSelection()
        if (newTimeline) {
          updateTimeline(newTimeline)
        }
        setShowTutorial(true)
      }, 500)
    }, 1000)
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

  // Use enhanced mobile builder for small screens
  if (isMobile) {
    return (
      <EnhancedMobileBuilder
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
              <button
                onClick={() => {
                  setActiveTab('genres')
                  // Load songs if not already loaded
                  if (availableGenres.length === 0) {
                    loadSongsFromFirestore()
                  }
                }}
                className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors text-sm ${
                  activeTab === 'genres'
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Genres
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
            {activeTab === 'genres' && (
              <div className="h-full overflow-y-auto p-4">
                <GenreFilter
                  availableGenres={availableGenres}
                  selectedGenres={selectedGenres}
                  onToggleGenre={toggleGenre}
                  onClearGenres={clearGenres}
                  onApplyFilters={() => {
                    // Apply smart selection and update timeline
                    const newTimeline = applySmartSelection()
                    if (newTimeline) {
                      updateTimeline(newTimeline)
                    }
                  }}
                  isLoading={isLoadingGenres}
                  songCount={availableSongs?.length || 0}
                />
              </div>
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
                <span className={`text-sm ${wedding.paymentStatus === 'paid' ? 'text-white/60' : totalSongs >= getEffectiveSongLimit(wedding) ? 'text-red-400' : totalSongs >= Math.floor(getEffectiveSongLimit(wedding) * 0.8) ? 'text-yellow-400' : 'text-white/60'}`}>
                  {getSongLimitMessage(wedding, totalSongs)}
                </span>
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
                onClick={() => {
                  if (canExport) {
                    setShowSpotifyExport(true)
                  } else {
                    setShowUpgradePrompt('export')
                  }
                }}
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
            {/* Show populate button if timeline is empty */}
            {totalSongs === 0 && (
              <div className="glass-card rounded-xl p-6 text-center">
                <Music className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">Start Your Wedding Playlist</h3>
                <p className="text-white/60 text-sm mb-4">
                  Get started with our curated collection of wedding songs
                </p>
                <button
                  onClick={async () => {
                    // Import and populate with default songs
                    const { CURATED_SONGS } = await import('@/data/curatedSongs')
                    const newTimeline = { ...timeline }
                    
                    WEDDING_MOMENTS.forEach(moment => {
                      const momentSongs = CURATED_SONGS[moment.id as keyof typeof CURATED_SONGS]
                      if (!newTimeline[moment.id]) {
                        newTimeline[moment.id] = {
                          id: moment.id,
                          name: moment.name,
                          order: moment.order,
                          duration: moment.duration,
                          songs: []
                        }
                      }
                      
                      if (momentSongs && momentSongs.length > 0) {
                        // Add 2-3 default songs
                        const defaultSongs = momentSongs.slice(0, Math.min(3, momentSongs.length))
                        newTimeline[moment.id].songs = defaultSongs.map(songToTimelineSong)
                      }
                    })
                    
                    updateTimeline(newTimeline)
                  }}
                  className="btn-primary"
                >
                  <Sparkles className="w-4 h-4" />
                  Add Recommended Songs
                </button>
              </div>
            )}
            
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

    {/* Upgrade Prompt */}
    {showUpgradePrompt && (
      <UpgradePrompt
        trigger={showUpgradePrompt as any}
        weddingId={wedding.id}
        onClose={() => setShowUpgradePrompt(null)}
        onUpgrade={() => setShowUpgradePrompt(null)}
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