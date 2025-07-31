'use client'

import { Music } from 'lucide-react'

interface Song {
  id: string
  title: string
  artist: string
}

interface Playlist {
  id: string
  name: string
  songs: Song[]
  moment?: string
}

interface PlaylistEmbedProps {
  id?: string
  playlist?: Playlist
  showSpotifyPreview?: boolean
}

export function PlaylistEmbed({ id, playlist, showSpotifyPreview }: PlaylistEmbedProps) {
  // In a real implementation, this would fetch the playlist if only ID is provided
  const displayPlaylist = playlist || {
    id: id || '1',
    name: 'Sample Wedding Playlist',
    songs: [
      { id: '1', title: 'Perfect', artist: 'Ed Sheeran' },
      { id: '2', title: 'All of Me', artist: 'John Legend' },
      { id: '3', title: 'A Thousand Years', artist: 'Christina Perri' },
    ],
    moment: 'First Dance'
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 my-4">
      <div className="flex items-center gap-3 mb-4">
        <Music className="w-6 h-6 text-purple-600" />
        <h3 className="text-lg font-semibold">{displayPlaylist.name}</h3>
        {displayPlaylist.moment && (
          <span className="text-sm text-gray-600">({displayPlaylist.moment})</span>
        )}
      </div>
      <div className="space-y-2">
        {displayPlaylist.songs.map((song, index) => (
          <div key={song.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
            <span className="text-gray-500 w-6">{index + 1}</span>
            <div className="flex-1">
              <p className="font-medium">{song.title}</p>
              <p className="text-sm text-gray-600">{song.artist}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}