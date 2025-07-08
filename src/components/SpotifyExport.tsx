'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getSpotifyAuthUrl } from '@/lib/spotify'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Image from 'next/image'

interface SpotifyExportProps {
  weddingId: string
  playlistId: string
  playlistName: string
  songs: Array<{
    spotifyId?: string
    title: string
    artist: string
  }>
}

export default function SpotifyExport({ 
  weddingId, 
  playlistId, 
  playlistName, 
  songs 
}: SpotifyExportProps) {
  const { user } = useAuth()
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSpotifyConnect = () => {
    if (!user) return
    
    // Generate state parameter with userId and weddingId
    const state = `${user.uid}:${weddingId}`
    const authUrl = getSpotifyAuthUrl(state)
    
    // Redirect to Spotify auth
    window.location.href = authUrl
  }

  const handleExport = async () => {
    if (!user) return

    setExporting(true)
    setError('')
    setSuccess('')

    try {
      // Check if user has Spotify connected
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (!userDoc.exists() || !userDoc.data().spotifyConnected) {
        handleSpotifyConnect()
        return
      }

      // Filter songs that have Spotify IDs
      const spotifyUris = songs
        .filter(song => song.spotifyId)
        .map(song => `spotify:track:${song.spotifyId}`)

      if (spotifyUris.length === 0) {
        setError('No songs in this playlist have Spotify IDs')
        setExporting(false)
        return
      }

      // Create playlist via API
      const response = await fetch('/api/spotify/create-playlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          weddingId,
          playlistName: `${playlistName} - UpTune Wedding`,
          description: `Wedding playlist created with UpTune. ${songs.length} songs for your special day!`,
          trackUris: spotifyUris
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create playlist')
      }

      setSuccess(`Playlist created! ${data.totalTracks} songs added.`)
      
      // Open Spotify playlist in new tab
      window.open(data.playlistUrl, '_blank')
    } catch (err) {
      console.error('Export error:', err)
      setError((err as Error).message || 'Failed to export playlist')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-4">
      <button
        onClick={handleExport}
        disabled={exporting}
        className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-[#1DB954] hover:bg-[#1aa34a] text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
      >
        {exporting ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Exporting...
          </>
        ) : (
          <>
            <Image
              src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_White.png"
              alt="Spotify"
              width={70}
              height={21}
              className="h-5 w-auto"
            />
            Export to Spotify
          </>
        )}
      </button>

      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
          <p className="text-sm text-green-300">{success}</p>
        </div>
      )}

      <p className="text-xs text-white/50 text-center">
        Connect your Spotify account to export playlists directly
      </p>
    </div>
  )
}