'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, Music, Heart, Sparkles, Play, Pause, Clock, Loader2, GripVertical } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useDroppable } from '@dnd-kit/core'

// Type for Spotify track
interface SpotifyTrack {
  id: string
  title: string
  artist: string
  album: string
  duration: string
  image: string
  preview: string | null
}

// Sample songs for fallback
const DEMO_SONGS = [
  {
    id: '1',
    title: 'Perfect',
    artist: 'Ed Sheeran',
    album: 'Divide',
    duration: '4:23',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop',
    preview: 'https://p.scdn.co/mp3-preview/example1'
  },
  {
    id: '2',
    title: 'Thinking Out Loud',
    artist: 'Ed Sheeran',
    album: '×',
    duration: '4:41',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop',
    preview: 'https://p.scdn.co/mp3-preview/example2'
  },
  {
    id: '3',
    title: 'All of Me',
    artist: 'John Legend',
    album: 'Love in the Future',
    duration: '4:29',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop',
    preview: 'https://p.scdn.co/mp3-preview/example3'
  },
  {
    id: '4',
    title: 'Marry You',
    artist: 'Bruno Mars',
    album: 'Doo-Wops & Hooligans',
    duration: '3:50',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop',
    preview: 'https://p.scdn.co/mp3-preview/example4'
  },
  {
    id: '5',
    title: 'A Thousand Years',
    artist: 'Christina Perri',
    album: 'The Twilight Saga',
    duration: '4:45',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop',
    preview: 'https://p.scdn.co/mp3-preview/example5'
  }
]

const WEDDING_MOMENTS = [
  { id: 'ceremony', label: 'Ceremony', icon: Heart, color: 'from-pink-500 to-rose-500' },
  { id: 'first-dance', label: 'First Dance', icon: Heart, color: 'from-purple-500 to-pink-500' },
  { id: 'dinner', label: 'Dinner', icon: Clock, color: 'from-blue-500 to-purple-500' },
  { id: 'dancing', label: 'Dancing', icon: Music, color: 'from-green-500 to-blue-500' }
]

// Droppable moment section
interface DroppableMomentProps {
  moment: typeof WEDDING_MOMENTS[0]
  songs: Array<{
    song: SpotifyTrack
    moment: string
    uniqueId: string
  }>
}

function DroppableMoment({ moment, songs }: DroppableMomentProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: moment.id,
  })

  return (
    <div 
      ref={setNodeRef}
      className={`glass-darker rounded-lg p-4 transition-all ${
        isOver ? 'ring-2 ring-purple-400 bg-purple-500/10' : ''
      }`}
      data-moment-id={moment.id}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${moment.color} flex items-center justify-center`}>
          <moment.icon className="w-4 h-4 text-white" />
        </div>
        <h4 className="font-medium text-white">{moment.label}</h4>
        <span className="text-sm text-white/60">({songs.length} songs)</span>
      </div>
      
      {songs.length > 0 ? (
        <SortableContext
          items={songs.map(item => item.uniqueId)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-1">
            {songs.map((item) => (
              <SortableSong
                key={item.uniqueId}
                id={item.uniqueId}
                song={item.song}
                moment={item.moment}
              />
            ))}
          </div>
        </SortableContext>
      ) : (
        <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
          <p className="text-sm text-white/40 italic">
            Drag songs here or search to add
          </p>
        </div>
      )}
    </div>
  )
}

// Sortable song item component
interface SortableSongProps {
  id: string
  song: SpotifyTrack
  moment: string
}

function SortableSong({ id, song, moment }: SortableSongProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 group"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab hover:cursor-grabbing text-white/40 hover:text-white/60"
      >
        <GripVertical className="w-4 h-4" />
      </div>
      <img
        src={song.image}
        alt={song.album}
        className="w-8 h-8 rounded"
      />
      <div className="flex-1">
        <p className="text-sm text-white">{song.title}</p>
        <p className="text-xs text-white/60">{song.artist}</p>
      </div>
      <span className="text-xs text-white/40">{song.duration}</span>
    </div>
  )
}

export function InteractiveDemo() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMoment, setSelectedMoment] = useState('ceremony')
  const [addedSongs, setAddedSongs] = useState<Array<{
    song: SpotifyTrack
    moment: string
    uniqueId: string
  }>>([])
  const [showResults, setShowResults] = useState(false)
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [showLimitReached, setShowLimitReached] = useState(false)
  const [searchResults, setSearchResults] = useState<SpotifyTrack[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState(false)
  const [activeDragId, setActiveDragId] = useState<string | null>(null)
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  // Search Spotify
  useEffect(() => {
    const searchSpotify = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([])
        setShowResults(false)
        return
      }

      setIsSearching(true)
      setSearchError(false)
      
      try {
        const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(searchQuery)}&limit=5`)
        
        if (!response.ok) {
          const errorData = await response.json()
          console.error('API error:', errorData)
          throw new Error('Search failed')
        }
        
        const data = await response.json()
        console.log('API response:', data) // Debug log
        
        // Check if we have tracks in the response
        if (!data.tracks || !Array.isArray(data.tracks)) {
          console.error('Invalid response format:', data)
          throw new Error('Invalid response format')
        }
        
        const tracks: SpotifyTrack[] = data.tracks.map((track: any) => ({
          id: track.id,
          title: track.name,
          artist: track.artist || 'Unknown Artist',
          album: track.album,
          duration: formatDuration(track.duration_ms),
          image: track.image || '/placeholder-album.png',
          preview: track.preview_url
        }))
        
        setSearchResults(tracks)
        setShowResults(true)
      } catch (error) {
        console.error('Search error:', error)
        setSearchError(true)
        // Always show demo songs on error
        const filtered = searchQuery.length > 0 
          ? DEMO_SONGS.filter(song => 
              song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              song.artist.toLowerCase().includes(searchQuery.toLowerCase())
            )
          : DEMO_SONGS
        setSearchResults(filtered)
        setShowResults(true)
      } finally {
        setIsSearching(false)
      }
    }

    const debounceTimer = setTimeout(searchSpotify, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleAddSong = (song: SpotifyTrack) => {
    if (addedSongs.length >= 5) {
      setShowLimitReached(true)
      return
    }
    
    const uniqueId = `${song.id}-${Date.now()}`
    setAddedSongs(prev => [...prev, { song, moment: selectedMoment, uniqueId }])
    setSearchQuery('')
    setShowResults(false)
  }

  const getSongsForMoment = (momentId: string) => {
    return addedSongs.filter(item => item.moment === momentId)
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveDragId(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Find the dragged song
    const draggedItem = addedSongs.find(item => item.uniqueId === activeId)
    if (!draggedItem) return

    // Check if dropping on a different moment
    const targetMoment = WEDDING_MOMENTS.find(m => m.id === overId)
    if (targetMoment) {
      // Move song to different moment
      setAddedSongs(prev => 
        prev.map(item => 
          item.uniqueId === activeId 
            ? { ...item, moment: targetMoment.id }
            : item
        )
      )
    } else {
      // Reorder within the same moment
      const overItem = addedSongs.find(item => item.uniqueId === overId)
      if (!overItem || draggedItem.moment !== overItem.moment) return

      setAddedSongs(prev => {
        const oldIndex = prev.findIndex(item => item.uniqueId === activeId)
        const newIndex = prev.findIndex(item => item.uniqueId === overId)
        
        const newSongs = [...prev]
        const [removed] = newSongs.splice(oldIndex, 1)
        newSongs.splice(newIndex, 0, removed)
        
        return newSongs
      })
    }
  }

  const activeDragItem = addedSongs.find(item => item.uniqueId === activeDragId)


  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="relative">
        {/* Demo Container */}
        <div className="glass rounded-2xl p-8 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold text-white mb-4">
            Try It Now - No Signup Required
          </h2>
          <p className="text-white/70 text-lg">
            Search for songs and build your wedding timeline. See how easy it is!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Search and Add Songs */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Search for Songs
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Try 'Perfect' or 'Ed Sheeran'"
                  className="input pl-10 w-full"
                />
              </div>
            </div>

            {/* Search Results */}
            <AnimatePresence>
              {showResults && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-2"
                >
                  {isSearching ? (
                    <div className="text-center py-4">
                      <Loader2 className="w-6 h-6 animate-spin text-purple-400 mx-auto" />
                      <p className="text-sm text-white/60 mt-2">Searching songs...</p>
                    </div>
                  ) : searchError ? (
                    <div className="text-center py-4">
                      <p className="text-sm text-white/60">Using demo songs (Spotify unavailable)</p>
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-sm text-white/60">No songs found. Try another search.</p>
                    </div>
                  ) : (
                    searchResults.map((song) => (
                    <motion.div
                      key={song.id}
                      whileHover={{ scale: 1.02 }}
                      className="glass-darker rounded-lg p-4 flex items-center justify-between group cursor-pointer"
                      onClick={() => handleAddSong(song)}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={song.image}
                          alt={song.album}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-white">{song.title}</p>
                          <p className="text-sm text-white/60">{song.artist}</p>
                        </div>
                      </div>
                      <button
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAddSong(song)
                        }}
                      >
                        <Plus className="w-5 h-5 text-purple-400" />
                      </button>
                    </motion.div>
                  ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Moment Selector */}
            <div>
              <label className="block text-sm font-medium text-white mb-3">
                Add to Wedding Moment
              </label>
              <div className="grid grid-cols-2 gap-2">
                {WEDDING_MOMENTS.map((moment) => (
                  <button
                    key={moment.id}
                    onClick={() => setSelectedMoment(moment.id)}
                    className={`p-3 rounded-lg border transition-all ${
                      selectedMoment === moment.id
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    <moment.icon className="w-5 h-5 text-white mx-auto mb-1" />
                    <p className="text-sm text-white">{moment.label}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Timeline Preview */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">
                Your Wedding Timeline ({addedSongs.length}/5 demo songs)
              </h3>
              <p className="text-sm text-white/60 mb-4">
                Drag songs between moments to organize your perfect flow
              </p>
            </div>
            
            {WEDDING_MOMENTS.map((moment) => {
              const songs = getSongsForMoment(moment.id)
              return (
                <DroppableMoment
                  key={moment.id}
                  moment={moment}
                  songs={songs}
                />
              )
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 text-center">
          {addedSongs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <p className="text-white/80">
                Love what you've created? Save your playlist and continue building!
              </p>
              <Link href="/auth/signup">
                <button className="btn-primary px-8 py-3 text-lg">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Save My Playlist & Continue
                </button>
              </Link>
              <p className="text-sm text-white/60">
                Free account includes 10 songs • No credit card required
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Limit Reached Modal */}
      <AnimatePresence>
        {showLimitReached && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowLimitReached(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass rounded-2xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Ready for More?
                </h3>
                <p className="text-white/70 mb-6">
                  You've added 5 demo songs! Create a free account to save your playlist and add up to 10 songs.
                </p>
                <Link href="/auth/signup">
                  <button className="btn-primary w-full mb-3">
                    Sign Up Free & Continue
                  </button>
                </Link>
                <button
                  onClick={() => setShowLimitReached(false)}
                  className="text-white/60 hover:text-white text-sm"
                >
                  Keep Exploring Demo
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Drag Overlay */}
      <DragOverlay>
        {activeDragItem ? (
          <div className="bg-slate-800 rounded-lg p-3 shadow-2xl opacity-90 cursor-grabbing">
            <div className="flex items-center gap-3">
              <img
                src={activeDragItem.song.image}
                alt={activeDragItem.song.album}
                className="w-10 h-10 rounded"
              />
              <div>
                <p className="text-sm font-medium text-white">{activeDragItem.song.title}</p>
                <p className="text-xs text-white/60">{activeDragItem.song.artist}</p>
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </div>
    </DndContext>
  )
}