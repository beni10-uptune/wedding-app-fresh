'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { TrendingUp, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Song } from '@/types'

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
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-green-100 rounded-lg">
          <TrendingUp className="w-5 h-5 text-green-600" />
        </div>
        <h3 className="font-semibold">Trending Wedding Songs</h3>
      </div>
      
      <div className="space-y-3 mb-4">
        {songs.map((song, index) => (
          <div key={song.id} className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm font-medium text-purple-700">
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{song.title}</p>
              <p className="text-xs text-gray-600 truncate">{song.artist}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="flex-shrink-0"
              onClick={() => window.open(song.spotifyUrl, '_blank')}
            >
              <Play className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      <Link href="/signup">
        <Button variant="outline" className="w-full">
          Create Your Playlist
        </Button>
      </Link>
    </div>
  )
}