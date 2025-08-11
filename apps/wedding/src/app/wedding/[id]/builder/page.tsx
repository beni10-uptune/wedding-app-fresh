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

      const rawData = weddingDoc.data()
      
      // Check if we have the new timelineV2 format, otherwise use timeline
      let timeline = rawData.timelineV2 || rawData.timeline
      
      // If timeline is an array (old format), convert it to object format
      if (Array.isArray(timeline)) {
        console.log('Converting old array timeline to V2 format')
        const timelineObj: any = {}
        timeline.forEach((moment: any, index: number) => {
          const timelineSongs = (moment.songs || []).map((song: any, songIndex: number) => ({
            id: `${moment.id}_${song.id}_${songIndex}`,
            spotifyId: song.spotifyId || song.id,
            title: song.title,
            artist: song.artist,
            album: song.album || '',
            albumArt: song.albumArt || 'https://via.placeholder.com/300x300?text=' + encodeURIComponent(song.title || 'Song'),
            previewUrl: song.previewUrl || null,
            duration: song.duration || 0,
            addedBy: 'couple',
            addedAt: rawData.updatedAt || new Date(),
            energy: song.bpm ? Math.min(5, Math.max(1, Math.round((song.bpm - 60) / 40))) : 3,
            explicit: false
          }))

          timelineObj[moment.id] = {
            id: moment.id,
            name: moment.title,
            order: index,
            duration: parseInt(moment.duration) || 30,
            songs: timelineSongs
          }
        })
        timeline = timelineObj
      }
      
      const weddingData = { 
        id: weddingDoc.id, 
        ...rawData,
        timeline,
        // Ensure required V2 fields exist
        coupleNames: rawData.coupleNames || (rawData.weddingName ? rawData.weddingName.split(' & ') : ['Partner 1', 'Partner 2']),
        weddingDate: rawData.weddingDate || new Date(),
        createdAt: rawData.createdAt || new Date(),
        updatedAt: rawData.updatedAt || new Date(),
        paymentStatus: rawData.paymentStatus || 'unpaid',
        slug: rawData.slug || weddingDoc.id
      } as WeddingV2
      
      console.log('🔍 RAW WEDDING DATA FROM FIREBASE:', {
        id: weddingDoc.id,
        hasTimeline: !!weddingData.timeline,
        timelineKeys: weddingData.timeline ? Object.keys(weddingData.timeline) : [],
        firstMoment: weddingData.timeline ? Object.keys(weddingData.timeline)[0] : null,
        firstMomentData: weddingData.timeline && Object.keys(weddingData.timeline)[0] ? 
          weddingData.timeline[Object.keys(weddingData.timeline)[0]] : null
      });
      
      // Import default songs for timeline
      const { CURATED_SONGS } = await import('@/data/curatedSongs')
      const { WEDDING_MOMENTS } = await import('@/data/weddingMoments')
      const { updateDoc } = await import('firebase/firestore')
      
      // Check if timeline needs initialization - count total songs
      let totalExistingSongs = 0;
      let hasEmptyTimeline = false;
      
      if (weddingData.timeline && typeof weddingData.timeline === 'object') {
        const timelineKeys = Object.keys(weddingData.timeline);
        hasEmptyTimeline = timelineKeys.length === 0;
        
        Object.values(weddingData.timeline).forEach(moment => {
          if (moment && moment.songs && Array.isArray(moment.songs)) {
            totalExistingSongs += moment.songs.length;
          }
        });
      }
      
      const needsTimeline = !weddingData.timeline || hasEmptyTimeline || totalExistingSongs === 0
      
      console.log('Timeline check:', {
        hasTimeline: !!weddingData.timeline,
        hasEmptyTimeline,
        totalExistingSongs,
        needsTimeline,
        weddingId,
        timelineType: typeof weddingData.timeline,
        timelineKeys: weddingData.timeline ? Object.keys(weddingData.timeline) : []
      });
      
      if (needsTimeline) {
        console.log('Initializing timeline with default songs for wedding:', weddingId)
        
        // Create fresh timeline with default songs
        const newTimeline: WeddingV2['timeline'] = {}
        
        WEDDING_MOMENTS.forEach(moment => {
          const momentSongs = CURATED_SONGS[moment.id as keyof typeof CURATED_SONGS] || []
          const timelineSongs: TimelineSong[] = []
          
          // Add first 2 songs from curated list
          if (momentSongs.length > 0) {
            momentSongs.slice(0, 2).forEach((song, index) => {
              timelineSongs.push({
                id: `${moment.id}_${song.id}_${index}`,
                spotifyId: song.id,
                title: song.title,
                artist: song.artist,
                album: song.album || '',
                albumArt: song.albumArt || 'https://via.placeholder.com/300x300?text=' + encodeURIComponent(song.title || 'Song'),
                previewUrl: song.previewUrl || null,
                duration: song.duration,
                addedBy: 'couple',
                addedAt: Timestamp.now(),
                energy: song.energyLevel || 3,
                explicit: song.explicit || false
              })
            })
          }
          
          newTimeline[moment.id] = {
            id: moment.id,
            name: moment.name,
            order: moment.order,
            duration: moment.duration,
            songs: timelineSongs
          }
        })
        
        // Update local data
        weddingData.timeline = newTimeline
        
        // Save to database
        try {
          await updateDoc(doc(db, 'weddings', weddingId), {
            timeline: newTimeline,
            updatedAt: Timestamp.now()
          })
          const savedSongCount = Object.values(newTimeline).reduce((acc, m) => acc + m.songs.length, 0);
          console.log('✅ Timeline saved to Firebase with', savedSongCount, 'songs');
          console.log('📊 Moments with songs:', Object.entries(newTimeline).map(([id, m]) => 
            `${id}: ${m.songs.length} songs`
          ).join(', '))
        } catch (error) {
          console.error('Failed to save timeline:', error)
        }
      } else {
        const existingSongCount = Object.values(weddingData.timeline || {}).reduce((acc, m: any) => 
          acc + (m?.songs?.length || 0), 0
        );
        console.log('ℹ️ Timeline already exists with', existingSongCount, 'songs');
        console.log('📊 Existing moments:', Object.entries(weddingData.timeline || {}).map(([id, m]: [string, any]) => 
          `${id}: ${m?.songs?.length || 0} songs`
        ).join(', '));
      }

      console.log('🎯 FINAL WEDDING DATA BEING SET:', {
        hasTimeline: !!weddingData.timeline,
        totalMoments: weddingData.timeline ? Object.keys(weddingData.timeline).length : 0,
        totalSongs: weddingData.timeline ? 
          Object.values(weddingData.timeline).reduce((acc, m: any) => acc + (m?.songs?.length || 0), 0) : 0
      });
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