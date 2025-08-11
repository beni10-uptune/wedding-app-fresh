'use client'

import { useState, useEffect, use } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { doc, getDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { WeddingV2, TimelineSong } from '@/types/wedding-v2'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import EnhancedBuilder from './components/EnhancedBuilder'

export default function WeddingBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: weddingId } = use(params)
  const [wedding, setWedding] = useState<WeddingV2 | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Handle Spotify OAuth callback
  useEffect(() => {
    const spotifyToken = searchParams.get('spotify_token')
    const exportMoments = searchParams.get('export_moments')
    
    if (spotifyToken && exportMoments) {
      // Store in localStorage for SpotifyExport component to use
      localStorage.setItem('spotify_access_token', spotifyToken)
      
      // Clean up URL
      const newUrl = window.location.pathname
      window.history.replaceState({}, '', newUrl)
    }
  }, [searchParams])

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    loadWedding()
  }, [user, weddingId])

  const loadWedding = async () => {
    try {
      const weddingDoc = await getDoc(doc(db, 'weddings', weddingId))
      if (!weddingDoc.exists()) {
        router.push('/builder')
        return
      }

      const weddingData = { id: weddingDoc.id, ...weddingDoc.data() } as WeddingV2
      
      // Always ensure timeline exists with proper structure
      if (!weddingData.timeline) {
        weddingData.timeline = {}
      }
      
      // Import default songs for timeline
      const { CURATED_SONGS } = await import('@/data/curatedSongs')
      const { WEDDING_MOMENTS } = await import('@/data/weddingMoments')
      
      // Check if we need to populate with default songs
      const hasAnySongs = Object.values(weddingData.timeline).some(
        moment => moment?.songs && moment.songs.length > 0
      )
      
      // Initialize or update timeline structure
      const updatedTimeline: WeddingV2['timeline'] = {}
      let needsUpdate = false
      
      WEDDING_MOMENTS.forEach(moment => {
        // Use existing moment data if available
        if (weddingData.timeline[moment.id] && weddingData.timeline[moment.id].songs?.length > 0) {
          updatedTimeline[moment.id] = weddingData.timeline[moment.id]
        } else {
          // Create moment with default songs
          const momentSongs = CURATED_SONGS[moment.id as keyof typeof CURATED_SONGS] || []
          const timelineSongs: TimelineSong[] = []
          
          // Add 2-3 default songs if this is the first time or moment has no songs
          if (!hasAnySongs && momentSongs.length > 0) {
            const defaultSongs = momentSongs.slice(0, Math.min(2, momentSongs.length))
            defaultSongs.forEach((song, index) => {
              timelineSongs.push({
                id: `${moment.id}_${Date.now()}_${index}`,
                spotifyId: song.spotifyUri || song.id,
                title: song.title,
                artist: song.artist,
                album: song.album || '',
                albumArt: song.albumArt || `https://via.placeholder.com/300?text=${encodeURIComponent(song.title)}`,
                previewUrl: song.previewUrl || null,
                duration: song.duration,
                addedBy: 'couple',
                addedAt: Timestamp.now(),
                energy: song.energyLevel,
                explicit: song.explicit || false
              })
            })
            needsUpdate = true
          }
          
          updatedTimeline[moment.id] = {
            id: moment.id,
            name: moment.name,
            order: moment.order,
            duration: moment.duration,
            songs: timelineSongs
          }
        }
      })
      
      weddingData.timeline = updatedTimeline
      
      // Save to database if we added new songs
      if (needsUpdate) {
        const { updateDoc } = await import('firebase/firestore')
        try {
          await updateDoc(doc(db, 'weddings', weddingId), {
            timeline: updatedTimeline,
            updatedAt: Timestamp.now()
          })
          console.log('Timeline populated with default songs')
        } catch (error) {
          console.error('Failed to save timeline:', error)
        }
      }

      setWedding(weddingData)
    } catch (error) {
      console.error('Error loading wedding:', error)
      router.push('/builder')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen dark-gradient flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!wedding) {
    return null
  }

  return (
    <div className="min-h-screen dark-gradient flex flex-col">
      {/* Header */}
      <header className="glass border-b border-white/10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/builder"
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Builder
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-white">
                {wedding.coupleNames?.join(' & ') || 'Wedding'} Music
              </h1>
              <p className="text-sm text-white/60">
                {wedding.weddingDate.toDate().toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Builder */}
      <div className="flex-1 overflow-hidden">
        <EnhancedBuilder
          wedding={wedding}
          onUpdate={setWedding}
        />
      </div>
    </div>
  )
}