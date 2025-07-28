'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, Music, Heart, Sparkles, Play, Pause, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

// Sample songs for demo
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

export function InteractiveDemo() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMoment, setSelectedMoment] = useState('ceremony')
  const [addedSongs, setAddedSongs] = useState<Array<{
    song: typeof DEMO_SONGS[0]
    moment: string
  }>>([])
  const [showResults, setShowResults] = useState(false)
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [showLimitReached, setShowLimitReached] = useState(false)

  const filteredSongs = DEMO_SONGS.filter(song => 
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddSong = (song: typeof DEMO_SONGS[0]) => {
    if (addedSongs.length >= 5) {
      setShowLimitReached(true)
      return
    }
    
    setAddedSongs(prev => [...prev, { song, moment: selectedMoment }])
    setSearchQuery('')
    setShowResults(false)
  }

  const getSongsForMoment = (momentId: string) => {
    return addedSongs.filter(item => item.moment === momentId)
  }

  useEffect(() => {
    setShowResults(searchQuery.length > 0)
  }, [searchQuery])

  return (
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
                  {filteredSongs.map((song) => (
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
                  ))}
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
            <h3 className="text-lg font-semibold text-white mb-4">
              Your Wedding Timeline ({addedSongs.length}/5 demo songs)
            </h3>
            
            {WEDDING_MOMENTS.map((moment) => {
              const songs = getSongsForMoment(moment.id)
              return (
                <div key={moment.id} className="glass-darker rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${moment.color} flex items-center justify-center`}>
                      <moment.icon className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="font-medium text-white">{moment.label}</h4>
                    <span className="text-sm text-white/60">({songs.length} songs)</span>
                  </div>
                  
                  {songs.length > 0 ? (
                    <div className="space-y-2">
                      {songs.map((item, index) => (
                        <motion.div
                          key={`${item.song.id}-${index}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5"
                        >
                          <img
                            src={item.song.image}
                            alt={item.song.album}
                            className="w-8 h-8 rounded"
                          />
                          <div className="flex-1">
                            <p className="text-sm text-white">{item.song.title}</p>
                            <p className="text-xs text-white/60">{item.song.artist}</p>
                          </div>
                          <span className="text-xs text-white/40">{item.song.duration}</span>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-white/40 italic">No songs added yet</p>
                  )}
                </div>
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
    </div>
  )
}