'use client'

import { useEffect, useState } from 'react'
import { Music, Clock, Copy, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import Link from 'next/link'

interface PlaylistShowcaseProps {
  playlistId: string
  title?: string
  allowClone?: boolean
}

interface Song {
  id: string
  title: string
  artist: string
  duration: number
}

interface Playlist {
  id: string
  name: string
  description?: string
  songs: Song[]
  moment: string
  totalDuration: number
}

export default function PlaylistShowcase({ 
  playlistId, 
  title,
  allowClone = true 
}: PlaylistShowcaseProps) {
  const [playlist, setPlaylist] = useState<Playlist | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchPlaylist()
  }, [playlistId])

  const fetchPlaylist = async () => {
    try {
      // In a real implementation, this would fetch from your API
      // For now, we'll use mock data
      setPlaylist({
        id: playlistId,
        name: title || 'Perfect Reception Playlist',
        description: 'A carefully curated mix of classics and modern hits',
        moment: 'reception',
        totalDuration: 180,
        songs: [
          { id: '1', title: 'Perfect', artist: 'Ed Sheeran', duration: 263 },
          { id: '2', title: 'Marry You', artist: 'Bruno Mars', duration: 230 },
          { id: '3', title: 'A Thousand Years', artist: 'Christina Perri', duration: 285 },
          { id: '4', title: "Can't Stop the Feeling!", artist: 'Justin Timberlake', duration: 236 },
          { id: '5', title: 'All of Me', artist: 'John Legend', duration: 269 },
        ]
      })
    } catch (error) {
      console.error('Failed to fetch playlist:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClonePlaylist = async () => {
    if (!user) {
      toast.error('Please sign in to clone playlists')
      return
    }

    try {
      // Clone playlist logic
      toast.success('Playlist cloned to your wedding!')
    } catch (error) {
      toast.error('Failed to clone playlist')
    }
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="my-8 p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl">
        <div className="animate-pulse">
          <div className="h-8 bg-white/20 rounded w-3/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-white/10 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!playlist) return null

  return (
    <div className="my-8 overflow-hidden rounded-xl bg-white/5 backdrop-blur-md border border-white/10">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Music className="w-8 h-8" />
          <h3 className="text-2xl font-bold">{playlist.name}</h3>
        </div>
        {playlist.description && (
          <p className="text-white/80 mb-4">{playlist.description}</p>
        )}
        <div className="flex items-center gap-4 text-sm text-white/70">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {Math.floor(playlist.totalDuration / 60)} minutes
          </span>
          <span>{playlist.songs.length} songs</span>
        </div>
      </div>
      
      <div className="bg-white/5 backdrop-blur-sm p-6">
        <div className="space-y-2 mb-6">
          {playlist.songs.map((song, index) => (
            <div key={song.id} className="flex items-center gap-3 p-2 hover:bg-white/10 rounded transition-colors">
              <span className="text-white/50 w-6 text-center">{index + 1}</span>
              <div className="flex-1">
                <p className="font-medium text-white">{song.title}</p>
                <p className="text-sm text-white/60">{song.artist}</p>
              </div>
              <span className="text-sm text-white/50">{formatDuration(song.duration)}</span>
            </div>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {allowClone && user && (
            <Button 
              onClick={handleClonePlaylist}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Copy className="w-4 h-4 mr-2" />
              Clone to My Wedding
            </Button>
          )}
          {!user && (
            <Link href="/auth/signup" className="flex-1">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Sign Up to Use This Playlist
              </Button>
            </Link>
          )}
          <Button variant="outline" className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30">
            <ExternalLink className="w-4 h-4 mr-2" />
            View Full Playlist
          </Button>
        </div>
      </div>
    </div>
  )
}