'use client'

import { useState, useEffect } from 'react'
import { Play, Pause, ExternalLink, Music } from 'lucide-react'
import Image from 'next/image'
import { getSpotifyTrack } from '@/lib/spotify'

interface SongCardProps {
  title: string
  artist: string
  spotifyId?: string
  variant?: 'default' | 'compact' | 'minimal'
  showPreview?: boolean
  showSpotifyLink?: boolean
  className?: string
  onPlay?: () => void
}

interface SpotifyData {
  preview_url?: string
  image?: string
  external_urls?: { spotify: string }
  duration_ms?: number
}

export default function SongCard({
  title,
  artist,
  spotifyId,
  variant = 'default',
  showPreview = true,
  showSpotifyLink = true,
  className = '',
  onPlay
}: SongCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [spotifyData, setSpotifyData] = useState<SpotifyData | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (spotifyId && showPreview) {
      loadSpotifyData()
    }

    return () => {
      if (audio) {
        audio.pause()
        audio.src = ''
      }
    }
  }, [spotifyId])

  const loadSpotifyData = async () => {
    if (!spotifyId) return
    
    setLoading(true)
    try {
      const data = await getSpotifyTrack(spotifyId)
      if (data) {
        setSpotifyData({
          preview_url: data.preview_url || undefined,
          image: data.image,
          external_urls: data.external_urls,
          duration_ms: data.duration_ms
        })
      }
    } catch (error) {
      console.error('Error loading Spotify data:', error)
    } finally {
      setLoading(false)
    }
  }

  const togglePlay = () => {
    if (!spotifyData?.preview_url) return

    if (isPlaying && audio) {
      audio.pause()
      setIsPlaying(false)
    } else {
      // Pause all other audio elements
      document.querySelectorAll('audio').forEach(a => a.pause())
      
      const newAudio = new Audio(spotifyData.preview_url)
      newAudio.volume = 0.5
      newAudio.play()
      
      newAudio.addEventListener('ended', () => {
        setIsPlaying(false)
      })
      
      setAudio(newAudio)
      setIsPlaying(true)
      onPlay?.()
    }
  }

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="font-medium text-white">{title}</span>
        <span className="text-white/60">·</span>
        <span className="text-white/60">{artist}</span>
        {showSpotifyLink && spotifyData?.external_urls?.spotify && (
          <a
            href={spotifyData.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-white/40 hover:text-white/60 transition-colors"
            title="Open in Spotify"
          >
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors ${className}`}>
        {/* Album Art or Icon */}
        {spotifyData?.image ? (
          <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
            <Image
              src={spotifyData.image}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center flex-shrink-0">
            <Music className="w-5 h-5 text-white/40" />
          </div>
        )}

        {/* Song Info */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-white truncate">{title}</p>
          <p className="text-sm text-white/60 truncate">{artist}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {showPreview && spotifyData?.preview_url && (
            <button
              onClick={togglePlay}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              title={isPlaying ? 'Pause' : 'Play preview'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-white" />
              ) : (
                <Play className="w-4 h-4 text-white ml-0.5" />
              )}
            </button>
          )}
          
          {showSpotifyLink && spotifyData?.external_urls?.spotify && (
            <a
              href={spotifyData.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              title="Open in Spotify"
            >
              <ExternalLink className="w-3.5 h-3.5 text-white" />
            </a>
          )}
        </div>
      </div>
    )
  }

  // Default variant
  return (
    <div className={`glass rounded-lg p-4 ${className}`}>
      <div className="flex items-center gap-4">
        {/* Album Art */}
        {spotifyData?.image ? (
          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={spotifyData.image}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Music className="w-8 h-8 text-white/40" />
          </div>
        )}

        {/* Song Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white truncate">{title}</h4>
          <p className="text-white/60 truncate">{artist}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {showPreview && spotifyData?.preview_url && (
            <button
              onClick={togglePlay}
              className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white hover:shadow-lg transition-all transform hover:scale-105"
              title={isPlaying ? 'Pause' : 'Play preview'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </button>
          )}
          
          {showSpotifyLink && spotifyData?.external_urls?.spotify && (
            <a
              href={spotifyData.external_urls.spotify}
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
    </div>
  )
}