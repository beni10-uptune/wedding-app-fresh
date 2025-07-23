'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { TrendingUp, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Song } from '@/types/wedding'

export function TrendingSongsWidget() {
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrendingSongs()
  }, [])

  const fetchTrendingSongs = async () => {
    try {
      const response = await fetch('/api/blog/trending-songs')
      const data = await response.json()
      setSongs(data.songs.slice(0, 5))
    } catch (error) {
      console.error('Failed to fetch trending songs:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-white/20 rounded w-1/2 mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-white/10 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-white/10 rounded-lg">
          <TrendingUp className="w-5 h-5 text-purple-400" />
        </div>
        <h3 className="font-semibold text-white">Trending Wedding Songs</h3>
      </div>
      
      <div className="space-y-3 mb-4">
        {songs.map((song, index) => (
          <div key={song.id} className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-sm font-medium text-white shadow-md">
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate text-white">{song.title}</p>
              <p className="text-xs text-white/60 truncate">{song.artist}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="flex-shrink-0"
              onClick={() => song.spotifyId && window.open(`https://open.spotify.com/track/${song.spotifyId}`, '_blank')}
            >
              <Play className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      <Link href="/signup">
        <Button variant="outline" className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30">
          Create Your Playlist
        </Button>
      </Link>
    </div>
  )
}