'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import { formatDuration } from '@/lib/spotify'

interface MusicPlayerProps {
  trackId: string
  trackName: string
  artistName: string
  previewUrl?: string | null
  spotifyUrl?: string
  imageUrl?: string
  duration?: number
  onPlay?: () => void
  className?: string
}

export default function MusicPlayer({
  trackId,
  trackName,
  artistName,
  previewUrl,
  spotifyUrl,
  imageUrl,
  duration,
  onPlay,
  className = ''
}: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(0.5)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressInterval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = isMuted ? 0 : volume

    const handleEnded = () => {
      setIsPlaying(false)
      setProgress(0)
    }

    audio.addEventListener('ended', handleEnded)
    return () => {
      audio.removeEventListener('ended', handleEnded)
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }
  }, [volume, isMuted])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio || !previewUrl) return

    if (isPlaying) {
      audio.pause()
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    } else {
      // Pause all other audio elements
      document.querySelectorAll('audio').forEach(a => {
        if (a !== audio) a.pause()
      })
      
      audio.play()
      onPlay?.()
      
      // Update progress
      progressInterval.current = setInterval(() => {
        setProgress((audio.currentTime / audio.duration) * 100)
      }, 100)
    }

    setIsPlaying(!isPlaying)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  return (
    <div className={`glass rounded-xl p-4 ${className}`}>
      <div className="flex items-center gap-4">
        {/* Album Art */}
        {imageUrl && (
          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={imageUrl}
              alt={`${trackName} album art`}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white truncate">{trackName}</h4>
          <p className="text-sm text-white/60 truncate">{artistName}</p>
          
          {/* Progress Bar */}
          {previewUrl && (
            <div className="mt-2">
              <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Volume Control */}
          {previewUrl && (
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-white/60" />
                ) : (
                  <Volume2 className="w-4 h-4 text-white/60" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 accent-purple-500"
              />
            </div>
          )}

          {/* Play/Pause Button */}
          {previewUrl ? (
            <button
              onClick={togglePlay}
              className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white hover:shadow-lg transition-all transform hover:scale-105"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </button>
          ) : (
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
              <Play className="w-5 h-5 text-white/30" />
            </div>
          )}

          {/* Spotify Link */}
          {spotifyUrl && (
            <a
              href={spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Open in Spotify"
            >
              <ExternalLink className="w-5 h-5 text-white/60" />
            </a>
          )}
        </div>
      </div>

      {/* Duration */}
      {duration && (
        <div className="text-xs text-white/40 mt-2 text-right">
          {formatDuration(duration)}
        </div>
      )}

      {/* Hidden Audio Element */}
      {previewUrl && (
        <audio
          ref={audioRef}
          src={previewUrl}
          preload="metadata"
        />
      )}
    </div>
  )
}