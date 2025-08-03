'use client'

import { useState } from 'react'
import { Music, Play, Clock, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface Song {
  title: string
  artist: string
  duration: string
}

interface SamplePlaylistProps {
  title?: string
  description?: string
  songs?: Song[]
  genre?: 'romantic' | 'party' | 'cocktail' | 'ceremony' | 'dinner'
}

const defaultPlaylists = {
  romantic: {
    title: "Romantic First Dance Classics",
    description: "Timeless love songs perfect for your first dance",
    songs: [
      { title: "At Last", artist: "Etta James", duration: "3:00" },
      { title: "Perfect", artist: "Ed Sheeran", duration: "4:23" },
      { title: "Make You Feel My Love", artist: "Adele", duration: "3:32" },
      { title: "All of Me", artist: "John Legend", duration: "4:29" },
      { title: "Thinking Out Loud", artist: "Ed Sheeran", duration: "4:41" },
      { title: "A Thousand Years", artist: "Christina Perri", duration: "4:45" },
      { title: "Can't Help Falling in Love", artist: "Elvis Presley", duration: "3:01" },
      { title: "Marry Me", artist: "Train", duration: "3:25" }
    ]
  },
  party: {
    title: "Dance Floor Favorites",
    description: "High-energy hits to keep the party going all night",
    songs: [
      { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", duration: "4:30" },
      { title: "I Wanna Dance with Somebody", artist: "Whitney Houston", duration: "4:51" },
      { title: "September", artist: "Earth, Wind & Fire", duration: "3:35" },
      { title: "Shut Up and Dance", artist: "Walk the Moon", duration: "3:17" },
      { title: "Dancing Queen", artist: "ABBA", duration: "3:51" },
      { title: "24K Magic", artist: "Bruno Mars", duration: "3:46" },
      { title: "Can't Stop the Feeling!", artist: "Justin Timberlake", duration: "4:19" },
      { title: "I Gotta Feeling", artist: "The Black Eyed Peas", duration: "4:49" }
    ]
  },
  cocktail: {
    title: "Cocktail Hour Elegance",
    description: "Sophisticated background music for mingling",
    songs: [
      { title: "Fly Me to the Moon", artist: "Frank Sinatra", duration: "2:27" },
      { title: "La Vie En Rose", artist: "Édith Piaf", duration: "3:07" },
      { title: "Dream a Little Dream of Me", artist: "Ella Fitzgerald", duration: "3:15" },
      { title: "Beyond the Sea", artist: "Bobby Darin", duration: "2:45" },
      { title: "Cheek to Cheek", artist: "Tony Bennett & Lady Gaga", duration: "2:51" },
      { title: "The Girl from Ipanema", artist: "Stan Getz & Astrud Gilberto", duration: "5:24" },
      { title: "What a Wonderful World", artist: "Louis Armstrong", duration: "2:21" },
      { title: "Sway", artist: "Michael Bublé", duration: "3:14" }
    ]
  },
  ceremony: {
    title: "Ceremony Processional Music",
    description: "Beautiful instrumental pieces for your walk down the aisle",
    songs: [
      { title: "Canon in D", artist: "Pachelbel", duration: "5:01" },
      { title: "Bridal Chorus", artist: "Wagner", duration: "2:30" },
      { title: "Ave Maria", artist: "Schubert", duration: "4:42" },
      { title: "Clair de Lune", artist: "Debussy", duration: "5:08" },
      { title: "Here Comes the Sun", artist: "The Beatles (Instrumental)", duration: "3:05" },
      { title: "Somewhere Over the Rainbow", artist: "IZ (Instrumental)", duration: "3:33" },
      { title: "River Flows in You", artist: "Yiruma", duration: "3:38" },
      { title: "Wedding March", artist: "Mendelssohn", duration: "4:15" }
    ]
  },
  dinner: {
    title: "Dinner Music Selection",
    description: "Pleasant background music for dining",
    songs: [
      { title: "Sunday Morning", artist: "The Velvet Underground", duration: "2:56" },
      { title: "Better Days", artist: "OneRepublic", duration: "3:34" },
      { title: "Budapest", artist: "George Ezra", duration: "3:20" },
      { title: "Home", artist: "Edward Sharpe & The Magnetic Zeros", duration: "5:06" },
      { title: "Ho Hey", artist: "The Lumineers", duration: "2:43" },
      { title: "Riptide", artist: "Vance Joy", duration: "3:24" },
      { title: "I'm Yours", artist: "Jason Mraz", duration: "4:03" },
      { title: "Banana Pancakes", artist: "Jack Johnson", duration: "3:12" }
    ]
  }
}

export default function SamplePlaylist({ 
  title,
  description,
  songs,
  genre = 'romantic'
}: SamplePlaylistProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const playlist = {
    title: title || defaultPlaylists[genre].title,
    description: description || defaultPlaylists[genre].description,
    songs: songs || defaultPlaylists[genre].songs
  }

  const visibleSongs = isExpanded ? playlist.songs : playlist.songs.slice(0, 4)
  const totalDuration = playlist.songs.reduce((acc, song) => {
    const [min, sec] = song.duration.split(':').map(Number)
    return acc + min * 60 + sec
  }, 0)
  const formattedDuration = `${Math.floor(totalDuration / 60)} min`

  return (
    <div className="my-8 glass rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Music className="w-5 h-5 text-purple-400" />
            {playlist.title}
          </h3>
          <p className="text-white/70 text-sm mt-1">{playlist.description}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-white/60">{playlist.songs.length} songs</p>
          <p className="text-sm text-white/60">{formattedDuration}</p>
        </div>
      </div>

      <div className="space-y-2">
        {visibleSongs.map((song, index) => (
          <div 
            key={index} 
            className="flex items-center gap-3 p-3 glass-darker rounded-lg hover:bg-white/5 transition-colors"
          >
            <button className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center hover:bg-purple-600/30 transition-colors">
              <Play className="w-4 h-4 text-purple-400" />
            </button>
            <div className="flex-1">
              <p className="font-medium text-white">{song.title}</p>
              <p className="text-sm text-white/60">{song.artist}</p>
            </div>
            <div className="flex items-center gap-1 text-sm text-white/40">
              <Clock className="w-3 h-3" />
              <span>{song.duration}</span>
            </div>
          </div>
        ))}
      </div>

      {playlist.songs.length > 4 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center gap-1 transition-colors"
        >
          {isExpanded ? 'Show less' : `Show ${playlist.songs.length - 4} more songs`}
          <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
        </button>
      )}

      <div className="mt-6 flex gap-3">
        <Link href="/auth/signup" className="flex-1">
          <Button className="btn-primary w-full">
            Create Your Own Playlist
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Link>
        <Button 
          variant="outline" 
          className="text-white/70 hover:text-white"
          onClick={() => {
            // Create CSV download
            const csv = [
              ['Title', 'Artist', 'Duration'],
              ...playlist.songs.map(s => [s.title, s.artist, s.duration])
            ].map(row => row.join(',')).join('\n')
            
            const blob = new Blob([csv], { type: 'text/csv' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${playlist.title.toLowerCase().replace(/\s+/g, '-')}.csv`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
          }}
        >
          Export List
        </Button>
      </div>
    </div>
  )
}