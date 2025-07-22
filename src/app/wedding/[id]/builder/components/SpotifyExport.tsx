'use client'

import { useState } from 'react'
import { WeddingV2, Timeline } from '@/types/wedding-v2'
import { WEDDING_MOMENTS } from '@/data/weddingMoments'
import { Music, ExternalLink, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import { getSpotifyAuthUrl } from '@/lib/spotify'

interface SpotifyExportProps {
  wedding: WeddingV2
  timeline: Timeline
  onClose: () => void
}

interface ExportStatus {
  momentId: string
  status: 'pending' | 'exporting' | 'success' | 'error'
  playlistUrl?: string
  error?: string
}

export default function SpotifyExport({ wedding, timeline, onClose }: SpotifyExportProps) {
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [exportStatuses, setExportStatuses] = useState<ExportStatus[]>([])
  const [selectedMoments, setSelectedMoments] = useState<string[]>([])

  // Get moments that have songs
  const momentsWithSongs = WEDDING_MOMENTS.filter(
    moment => timeline[moment.id]?.songs.length > 0
  )

  const handleSelectMoment = (momentId: string) => {
    setSelectedMoments(prev => 
      prev.includes(momentId) 
        ? prev.filter(id => id !== momentId)
        : [...prev, momentId]
    )
  }

  const handleSelectAll = () => {
    if (selectedMoments.length === momentsWithSongs.length) {
      setSelectedMoments([])
    } else {
      setSelectedMoments(momentsWithSongs.map(m => m.id))
    }
  }

  const handleExport = async () => {
    // Check if user is authenticated with Spotify
    const spotifyToken = localStorage.getItem('spotify_access_token')
    
    if (!spotifyToken) {
      // Need to authenticate first
      setIsAuthenticating(true)
      const state = btoa(JSON.stringify({ 
        weddingId: wedding.id, 
        action: 'export',
        moments: selectedMoments 
      }))
      const authUrl = getSpotifyAuthUrl(state)
      window.location.href = authUrl
      return
    }

    // Export playlists
    setExportStatuses(selectedMoments.map(id => ({ 
      momentId: id, 
      status: 'pending' 
    })))

    for (const momentId of selectedMoments) {
      const moment = WEDDING_MOMENTS.find(m => m.id === momentId)
      const songs = timeline[momentId]?.songs || []
      
      if (!moment || songs.length === 0) continue

      setExportStatuses(prev => prev.map(s => 
        s.momentId === momentId ? { ...s, status: 'exporting' } : s
      ))

      try {
        const response = await fetch('/api/spotify/create-playlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${spotifyToken}`
          },
          body: JSON.stringify({
            name: `${wedding.coupleNames.join(' & ')} - ${moment.name}`,
            description: `Wedding playlist for ${moment.name}. Created with UpTune.`,
            trackUris: songs.map(s => `spotify:track:${s.spotifyId}`).filter(Boolean),
            weddingId: wedding.id,
            momentId
          })
        })

        if (!response.ok) {
          throw new Error('Failed to create playlist')
        }

        const data = await response.json()
        
        setExportStatuses(prev => prev.map(s => 
          s.momentId === momentId 
            ? { ...s, status: 'success', playlistUrl: data.playlistUrl } 
            : s
        ))
      } catch (error) {
        console.error('Export error:', error)
        setExportStatuses(prev => prev.map(s => 
          s.momentId === momentId 
            ? { ...s, status: 'error', error: 'Failed to create playlist' } 
            : s
        ))
      }
    }
  }

  const getStatusIcon = (status: ExportStatus['status']) => {
    switch (status) {
      case 'exporting':
        return <Loader className="w-4 h-4 text-purple-400 animate-spin" />
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />
      default:
        return null
    }
  }

  const exportInProgress = exportStatuses.some(s => s.status === 'exporting')
  const allExported = exportStatuses.length > 0 && 
    exportStatuses.every(s => s.status === 'success')

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-gradient rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-serif font-bold text-white mb-2">
            Export to Spotify
          </h2>
          <p className="text-white/60">
            Create Spotify playlists for your wedding moments
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {momentsWithSongs.length === 0 ? (
            <div className="text-center py-8">
              <Music className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/60">No songs in your timeline yet</p>
            </div>
          ) : (
            <>
              {/* Select All */}
              <button
                onClick={handleSelectAll}
                className="w-full text-left mb-4 text-sm text-purple-400 hover:text-purple-300"
              >
                {selectedMoments.length === momentsWithSongs.length 
                  ? 'Deselect all' 
                  : 'Select all'}
              </button>

              {/* Moment List */}
              <div className="space-y-2">
                {momentsWithSongs.map((moment) => {
                  const songs = timeline[moment.id]?.songs || []
                  const status = exportStatuses.find(s => s.momentId === moment.id)
                  const isSelected = selectedMoments.includes(moment.id)

                  return (
                    <div
                      key={moment.id}
                      className={`rounded-lg p-4 border transition-all ${
                        isSelected 
                          ? 'bg-purple-500/10 border-purple-500/50' 
                          : 'bg-white/5 border-white/10'
                      }`}
                    >
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectMoment(moment.id)}
                          disabled={exportInProgress}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{moment.icon}</span>
                            <span className="font-medium text-white">
                              {moment.name}
                            </span>
                            {status && getStatusIcon(status.status)}
                          </div>
                          <p className="text-sm text-white/60 mt-1">
                            {songs.length} songs
                          </p>
                          {status?.playlistUrl && (
                            <a
                              href={status.playlistUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 mt-2 text-sm text-green-400 hover:text-green-300"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Open in Spotify
                            </a>
                          )}
                          {status?.error && (
                            <p className="text-sm text-red-400 mt-1">
                              {status.error}
                            </p>
                          )}
                        </div>
                      </label>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 flex gap-3">
          <button
            onClick={onClose}
            className="btn-secondary flex-1"
            disabled={exportInProgress}
          >
            {allExported ? 'Done' : 'Cancel'}
          </button>
          {!allExported && momentsWithSongs.length > 0 && (
            <button
              onClick={handleExport}
              disabled={selectedMoments.length === 0 || exportInProgress}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAuthenticating ? (
                <>Connecting to Spotify...</>
              ) : exportInProgress ? (
                <>Exporting...</>
              ) : (
                <>Export {selectedMoments.length} Playlist{selectedMoments.length !== 1 ? 's' : ''}</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}