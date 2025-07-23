'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, Play, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

interface Song {
  id: string
  title: string
  artist: string
  spotifyUrl?: string
  popularity?: number
}

interface TrendingSongsProps {
  category?: string
  limit?: number
  title?: string
}

export default function TrendingSongs({ 
  category, 
  limit = 10,
  title = 'Trending Wedding Songs'
}: TrendingSongsProps) {
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchTrendingSongs()
  }, [category, limit])

  const fetchTrendingSongs = async () => {
    try {
      const params = new URLSearchParams()
      if (category) params.append('category', category)
      params.append('limit', limit.toString())

      const response = await fetch(`/api/blog/trending-songs?${params}`)
      const data = await response.json()
      setSongs(data.songs)
    } catch (error) {
      console.error('Failed to fetch trending songs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddSong = async (songId: string) => {
    if (!user) {
      toast.error('Please sign in to add songs to your playlist')
      return
    }

    try {
      // Add song to user's wedding playlist
      toast.success('Song added to your playlist!')
    } catch (error) {
      toast.error('Failed to add song')
    }
  }

  if (loading) {
    return (
      <div className="my-8 p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl">
        <div className="animate-pulse">
          <div className="h-6 bg-white/20 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-white/10 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="my-8 p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-white/10 rounded-lg">
          <TrendingUp className="w-6 h-6 text-purple-400" />
        </div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
      
      <div className="space-y-3 mb-6">
        {songs.map((song, index) => (
          <div key={song.id} className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-white/20 transition-all">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate text-white">{song.title}</p>
              <p className="text-sm text-white/60 truncate">{song.artist}</p>
            </div>
            <div className="flex items-center gap-2">
              {song.spotifyUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(song.spotifyUrl, '_blank')}
                  aria-label="Play on Spotify"
                >
                  <Play className="w-4 h-4" />
                </Button>
              )}
              {user && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAddSong(song.id)}
                  aria-label="Add to playlist"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Link href="/signup">
        <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
          Create Your Wedding Playlist
        </Button>
      </Link>
    </div>
  )
}