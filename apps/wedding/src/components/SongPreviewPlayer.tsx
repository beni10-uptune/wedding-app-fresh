'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, SkipForward } from 'lucide-react'
import { Song } from '@/types/wedding-v2'

interface SongPreviewPlayerProps {
  song: Song | null
  autoPlay?: boolean
  onEnded?: () => void
}

export function SongPreviewPlayer({ song, autoPlay = false, onEnded }: SongPreviewPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(30) // 30 second preview
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressInterval = useRef<NodeJS.Timeout | null>(null)

  // Handle song change
  useEffect(() => {
    if (song?.previewUrl && audioRef.current) {
      audioRef.current.src = song.previewUrl
      audioRef.current.volume = volume
      if (autoPlay) {
        audioRef.current.play()
        setIsPlaying(true)
      }
    } else {
      setIsPlaying(false)
      setCurrentTime(0)
    }
  }, [song, autoPlay, volume])

  // Update progress
  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime)
        }
      }, 100)
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }
  }, [isPlaying])

  const togglePlay = () => {
    if (!audioRef.current || !song?.previewUrl) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value)
    setCurrentTime(newTime)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!song) return null

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onEnded={() => {
          setIsPlaying(false)
          setCurrentTime(0)
          onEnded?.()
        }}
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration)
        }}
      />

      {/* Player UI */}
      <div className="flex items-center gap-4">
        {/* Album Art */}
        <div className="relative">
          {song.albumImage ? (
            <img 
              src={song.albumImage} 
              alt={song.album}
              className="w-16 h-16 rounded-lg"
            />
          ) : (
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg" />
          )}
          {!song.previewUrl && (
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
              <p className="text-white text-xs">No preview</p>
            </div>
          )}
        </div>

        {/* Song Info & Controls */}
        <div className="flex-1">
          <div className="mb-2">
            <p className="font-medium text-sm truncate">{song.title}</p>
            <p className="text-xs text-gray-600 truncate">{song.artist}</p>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-500 w-10">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              disabled={!song.previewUrl}
              className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
              style={{
                background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${(currentTime / duration) * 100}%, #E5E7EB ${(currentTime / duration) * 100}%, #E5E7EB 100%)`
              }}
            />
            <span className="text-xs text-gray-500 w-10">
              {formatTime(duration)}
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              disabled={!song.previewUrl}
              className="p-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 ml-0.5" />
              )}
            </button>

            {/* Volume */}
            <button
              onClick={toggleMute}
              className="p-1 text-gray-600 hover:text-gray-800"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />

            {/* Song details */}
            <div className="ml-auto flex items-center gap-2 text-xs text-gray-500">
              {song.popularity && (
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  {song.popularity}% popular
                </span>
              )}
              {song.explicit && (
                <span className="px-1 bg-gray-200 rounded text-xs font-medium">E</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Mini player for inline use
export function MiniSongPlayer({ song }: { song: Song }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!audioRef.current || !song.previewUrl) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      // Pause any other playing audio
      document.querySelectorAll('audio').forEach(audio => {
        if (audio !== audioRef.current) audio.pause()
      })
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={song.previewUrl || ''}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <button
        onClick={togglePlay}
        disabled={!song.previewUrl}
        className="p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        title={song.previewUrl ? 'Preview song' : 'No preview available'}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4" />
        )}
      </button>
    </>
  )
}