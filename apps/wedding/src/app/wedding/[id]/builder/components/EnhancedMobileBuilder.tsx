'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Timestamp } from 'firebase/firestore'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { WeddingV2, Song, Timeline, TimelineSong } from '@/types/wedding-v2'
import { WEDDING_MOMENTS } from '@/data/weddingMoments'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { debounce } from 'lodash'
import EnhancedSongSearch from './EnhancedSongSearch'
import CuratedPlaylistBrowser from './CuratedPlaylistBrowser'
import GuestSubmissions from './GuestSubmissions'
import GuideViewer from './GuideViewer'
import WelcomeFlow from './WelcomeFlow'
import UnifiedSongCard from './UnifiedSongCard'
import { formatDuration } from '@/lib/spotify-client'
import { 
  Music, Search, Users, BookOpen, ChevronLeft,
  Plus, Play, Pause, MoreVertical, Check,
  Sparkles, Clock, TrendingUp, X, Menu,
  Home, Library, Mic
} from 'lucide-react'

interface EnhancedMobileBuilderProps {
  wedding: WeddingV2
  onUpdate: (wedding: WeddingV2) => void
}

type ViewMode = 'timeline' | 'search' | 'library' | 'guests'

// Convert functions
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

export default function EnhancedMobileBuilder({ wedding, onUpdate }: EnhancedMobileBuilderProps) {
  const [timeline, setTimeline] = useState<Timeline>(wedding.timeline || {})
  const [viewMode, setViewMode] = useState<ViewMode>('timeline')
  const [selectedMoment, setSelectedMoment] = useState<string>('first-dance')
  const [expandedMoment, setExpandedMoment] = useState<string | null>(null)
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)
  const [showGuideViewer, setShowGuideViewer] = useState(false)
  const [showWelcomeFlow, setShowWelcomeFlow] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Calculate total songs
  const totalSongs = Object.values(timeline).reduce((count, moment) => {
    return count + (moment?.songs?.length || 0)
  }, 0)

  // Check for first-time user
  useEffect(() => {
    const hasSeenKey = `wedding_${wedding.id}_mobile_welcome_seen`
    const hasSeen = localStorage.getItem(hasSeenKey)
    
    if (!hasSeen && totalSongs === 0) {
      setShowWelcomeFlow(true)
    }
  }, [wedding.id, totalSongs])

  // Cleanup audio
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
    
    // Show visual feedback
    setSelectedMoment(momentId)
    setTimeout(() => setViewMode('timeline'), 500)
  }

  const handleRemoveSong = (songId: string, momentId: string) => {
    const newTimeline = { ...timeline }
    if (newTimeline[momentId]) {
      newTimeline[momentId].songs = newTimeline[momentId].songs.filter(s => s.id !== songId)
      updateTimeline(newTimeline)
    }
  }

  const handlePlaySong = (song: Song) => {
    if (playingId === song.id) {
      audioElement?.pause()
      setPlayingId(null)
    } else {
      audioElement?.pause()
      if (song.previewUrl) {
        const audio = new Audio(song.previewUrl)
        audio.volume = 0.5
        audio.play()
        setAudioElement(audio)
        setPlayingId(song.id)
        
        audio.addEventListener('ended', () => {
          setPlayingId(null)
        })
      }
    }
  }

  const handlePauseSong = () => {
    audioElement?.pause()
    setPlayingId(null)
  }

  // Swipe handlers for navigation
  const handleSwipe = (e: any, info: PanInfo) => {
    const threshold = 50
    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0) {
        // Swiped right
        navigateToPreviousView()
      } else {
        // Swiped left
        navigateToNextView()
      }
    }
  }

  const navigateToPreviousView = () => {
    const views: ViewMode[] = ['timeline', 'search', 'library', 'guests']
    const currentIndex = views.indexOf(viewMode)
    if (currentIndex > 0) {
      setViewMode(views[currentIndex - 1])
      setSwipeDirection('right')
    }
  }

  const navigateToNextView = () => {
    const views: ViewMode[] = ['timeline', 'search', 'library', 'guests']
    const currentIndex = views.indexOf(viewMode)
    if (currentIndex < views.length - 1) {
      setViewMode(views[currentIndex + 1])
      setSwipeDirection('left')
    }
  }

  const handleWelcomeComplete = (preferences: any) => {
    localStorage.setItem(`wedding_${wedding.id}_mobile_welcome_seen`, 'true')
    setShowWelcomeFlow(false)
    // TODO: Save preferences
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-900 to-black flex flex-col">
      {/* Header */}
      <header className="bg-slate-900/95 backdrop-blur-sm border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-white">
            {wedding.coupleNames.join(' & ')}'s Music
          </h1>
          <button
            onClick={() => setShowGuideViewer(true)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <BookOpen className="w-5 h-5 text-purple-400" />
          </button>
        </div>
        
        {/* Progress indicator */}
        <div className="mt-2 flex items-center gap-2 text-xs text-white/60">
          <span className="flex items-center gap-1">
            <Music className="w-3 h-3" />
            {totalSongs} songs
          </span>
          <span>•</span>
          <span>
            {Object.keys(timeline).length} of {WEDDING_MOMENTS.length} moments
          </span>
        </div>
      </header>

      {/* Main Content */}
      <motion.div
        ref={containerRef}
        className="flex-1 overflow-hidden relative"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleSwipe}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ 
              opacity: 0, 
              x: swipeDirection === 'left' ? 100 : swipeDirection === 'right' ? -100 : 0 
            }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ 
              opacity: 0, 
              x: swipeDirection === 'left' ? -100 : swipeDirection === 'right' ? 100 : 0 
            }}
            transition={{ duration: 0.3 }}
            className="h-full"
            onAnimationComplete={() => setSwipeDirection(null)}
          >
            {viewMode === 'timeline' && (
              <MobileTimelineView
                timeline={timeline}
                selectedMoment={selectedMoment}
                expandedMoment={expandedMoment}
                playingId={playingId}
                onSelectMoment={setSelectedMoment}
                onExpandMoment={setExpandedMoment}
                onRemoveSong={handleRemoveSong}
                onPlaySong={handlePlaySong}
                onPauseSong={handlePauseSong}
                onAddSong={() => setViewMode('search')}
              />
            )}
            
            {viewMode === 'search' && (
              <div className="h-full flex flex-col">
                <div className="p-4 bg-slate-800/50 border-b border-white/10">
                  <button
                    onClick={() => setViewMode('timeline')}
                    className="flex items-center gap-2 text-white/60 hover:text-white mb-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Timeline
                  </button>
                  <p className="text-sm text-white/60">
                    Adding to: <span className="text-purple-400 font-medium">
                      {WEDDING_MOMENTS.find(m => m.id === selectedMoment)?.name}
                    </span>
                  </p>
                </div>
                <div className="flex-1 overflow-hidden">
                  <EnhancedSongSearch
                    onAddSong={handleAddSong}
                    selectedMoment={selectedMoment}
                  />
                </div>
              </div>
            )}
            
            {viewMode === 'library' && (
              <div className="h-full flex flex-col">
                <div className="p-4 bg-slate-800/50 border-b border-white/10">
                  <button
                    onClick={() => setViewMode('timeline')}
                    className="flex items-center gap-2 text-white/60 hover:text-white mb-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Timeline
                  </button>
                  <p className="text-sm text-white/60">Browse curated collections</p>
                </div>
                <div className="flex-1 overflow-hidden">
                  <CuratedPlaylistBrowser
                    selectedMoment={selectedMoment}
                    onAddSong={handleAddSong}
                    onAddAllSongs={(songs, momentId) => {
                      songs.forEach(song => handleAddSong(song, momentId))
                    }}
                    onOpenGuide={() => setShowGuideViewer(true)}
                  />
                </div>
              </div>
            )}
            
            {viewMode === 'guests' && (
              <div className="h-full flex flex-col">
                <div className="p-4 bg-slate-800/50 border-b border-white/10">
                  <button
                    onClick={() => setViewMode('timeline')}
                    className="flex items-center gap-2 text-white/60 hover:text-white mb-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Timeline
                  </button>
                  <p className="text-sm text-white/60">Guest song suggestions</p>
                </div>
                <div className="flex-1 overflow-hidden">
                  <GuestSubmissions
                    weddingId={wedding.id}
                    onAddSong={handleAddSong}
                  />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Swipe indicators */}
        <div className="absolute top-1/2 left-2 -translate-y-1/2 pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: viewMode !== 'timeline' ? [0, 0.3, 0] : 0 
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              delay: 1
            }}
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </motion.div>
        </div>
        
        <div className="absolute top-1/2 right-2 -translate-y-1/2 pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: viewMode !== 'guests' ? [0, 0.3, 0] : 0 
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              delay: 1
            }}
          >
            <ChevronLeft className="w-8 h-8 text-white rotate-180" />
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom Navigation */}
      <nav className="bg-slate-900/95 backdrop-blur-sm border-t border-white/10">
        <div className="flex items-center justify-around py-2">
          <button
            onClick={() => setViewMode('timeline')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'timeline' 
                ? 'text-purple-400 bg-purple-500/20' 
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">Timeline</span>
          </button>
          
          <button
            onClick={() => setViewMode('search')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'search' 
                ? 'text-purple-400 bg-purple-500/20' 
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Search className="w-5 h-5" />
            <span className="text-xs">Search</span>
          </button>
          
          <button
            onClick={() => setViewMode('library')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'library' 
                ? 'text-purple-400 bg-purple-500/20' 
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Library className="w-5 h-5" />
            <span className="text-xs">Library</span>
          </button>
          
          <button
            onClick={() => setViewMode('guests')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'guests' 
                ? 'text-purple-400 bg-purple-500/20' 
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-xs">Guests</span>
          </button>
        </div>
      </nav>

      {/* Floating Player */}
      <AnimatePresence>
        {playingId && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="absolute bottom-20 left-4 right-4 bg-slate-800 rounded-lg shadow-lg p-3 border border-purple-500/50"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">Now Playing</p>
                <p className="text-xs text-white/60">Preview</p>
              </div>
              <button
                onClick={handlePauseSong}
                className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center"
              >
                <Pause className="w-5 h-5 text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Welcome Flow */}
      {showWelcomeFlow && (
        <WelcomeFlow
          wedding={wedding}
          onComplete={handleWelcomeComplete}
          onSkip={() => setShowWelcomeFlow(false)}
        />
      )}

      {/* Guide Viewer */}
      {showGuideViewer && (
        <GuideViewer
          momentId={selectedMoment}
          onClose={() => setShowGuideViewer(false)}
          onSelectGuide={() => {}}
        />
      )}
    </div>
  )
}

// Mobile Timeline View Component
interface MobileTimelineViewProps {
  timeline: Timeline
  selectedMoment: string
  expandedMoment: string | null
  playingId: string | null
  onSelectMoment: (momentId: string) => void
  onExpandMoment: (momentId: string | null) => void
  onRemoveSong: (songId: string, momentId: string) => void
  onPlaySong: (song: Song) => void
  onPauseSong: () => void
  onAddSong: () => void
}

function MobileTimelineView({
  timeline,
  selectedMoment,
  expandedMoment,
  playingId,
  onSelectMoment,
  onExpandMoment,
  onRemoveSong,
  onPlaySong,
  onPauseSong,
  onAddSong
}: MobileTimelineViewProps) {
  return (
    <div className="h-full overflow-y-auto pb-20">
      <div className="p-4 space-y-3">
        {WEDDING_MOMENTS.map((moment) => {
          const timelineMoment = timeline[moment.id]
          const songs = timelineMoment?.songs || []
          const totalDuration = songs.reduce((acc, song) => acc + song.duration, 0)
          const targetDuration = moment.duration * 60
          const durationPercentage = (totalDuration / targetDuration) * 100
          const isExpanded = expandedMoment === moment.id
          const isSelected = selectedMoment === moment.id

          return (
            <motion.div
              key={moment.id}
              layout
              className={`
                bg-slate-800/50 rounded-xl overflow-hidden border transition-all
                ${isSelected ? 'border-purple-500/50' : 'border-white/10'}
              `}
            >
              {/* Moment Header */}
              <button
                onClick={() => {
                  onSelectMoment(moment.id)
                  onExpandMoment(isExpanded ? null : moment.id)
                }}
                className="w-full p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{moment.icon}</span>
                  <div className="text-left">
                    <h3 className="font-medium text-white">{moment.name}</h3>
                    <p className="text-xs text-white/60">
                      {songs.length} songs • {formatDuration(totalDuration * 1000)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Duration indicator */}
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <div
                      className={`text-xs font-medium ${
                        durationPercentage > 110
                          ? 'text-red-400'
                          : durationPercentage > 90
                          ? 'text-green-400'
                          : 'text-yellow-400'
                      }`}
                    >
                      {Math.round(durationPercentage)}%
                    </div>
                  </div>
                  
                  <ChevronLeft 
                    className={`w-5 h-5 text-white/40 transition-transform ${
                      isExpanded ? '-rotate-90' : 'rotate-180'
                    }`}
                  />
                </div>
              </button>

              {/* Expanded Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-2">
                      {songs.length === 0 ? (
                        <div className="text-center py-8">
                          <Music className="w-12 h-12 text-white/20 mx-auto mb-3" />
                          <p className="text-sm text-white/60 mb-4">
                            No songs added yet
                          </p>
                          <button
                            onClick={onAddSong}
                            className="px-6 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
                          >
                            Add Songs
                          </button>
                        </div>
                      ) : (
                        <>
                          {songs.map((song, index) => (
                            <UnifiedSongCard
                              key={`${song.id}-${index}`}
                              song={timelineSongToSong(song)}
                              source="timeline"
                              momentId={moment.id}
                              index={index}
                              isPlaying={playingId === song.id}
                              onPlay={() => onPlaySong(timelineSongToSong(song))}
                              onPause={onPauseSong}
                              onRemove={() => onRemoveSong(song.id, moment.id)}
                              variant="compact"
                              isDraggingEnabled={false}
                            />
                          ))}
                          
                          <button
                            onClick={onAddSong}
                            className="w-full mt-2 p-3 border-2 border-dashed border-white/20 rounded-lg text-white/60 hover:text-white hover:border-white/40 transition-colors text-sm"
                          >
                            + Add more songs
                          </button>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}