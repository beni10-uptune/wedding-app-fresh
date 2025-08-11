'use client'

import { useState, useEffect, use } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { WeddingV2 } from '@/types/wedding-v2'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import EnhancedBuilder from './components/EnhancedBuilder'
import { initializeTimeline, validateAndFixTimeline } from '@/lib/timeline-service'

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
      localStorage.setItem('spotify_access_token', spotifyToken)
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
      console.log('🔄 Loading wedding:', weddingId);
      
      const weddingDoc = await getDoc(doc(db, 'weddings', weddingId))
      if (!weddingDoc.exists()) {
        console.error('Wedding not found:', weddingId);
        router.push('/builder')
        return
      }

      const rawData = weddingDoc.data()
      console.log('📄 Raw wedding data keys:', Object.keys(rawData))
      
      // Get user preferences for filtering
      const userCountry = rawData.selectedCountry || 'US';
      const userGenres = rawData.selectedGenres || [];
      
      console.log('🌍 User preferences:', { country: userCountry, genres: userGenres });
      
      // Handle timeline - check for timelineV2 first, then timeline, then initialize
      let timeline = rawData.timelineV2;
      
      // If no timelineV2, check for old timeline format
      if (!timeline && rawData.timeline) {
        if (Array.isArray(rawData.timeline)) {
          console.log('⚠️ Converting old array timeline to V2 format');
          // Convert array to object format
          const timelineObj: any = {};
          rawData.timeline.forEach((moment: any, index: number) => {
            if (moment && moment.id) {
              timelineObj[moment.id] = {
                id: moment.id,
                name: moment.title || moment.name || moment.id,
                order: index,
                duration: parseInt(moment.duration) || 30,
                songs: (moment.songs || []).map((song: any, idx: number) => ({
                  id: `${moment.id}_${song.id}_${idx}`,
                  spotifyId: song.spotifyId || song.id,
                  title: song.title || 'Unknown Song',
                  artist: song.artist || 'Unknown Artist',
                  album: song.album || '',
                  albumArt: song.albumArt || `https://source.unsplash.com/300x300/?music,wedding`,
                  previewUrl: song.previewUrl || null,
                  duration: song.duration || 180,
                  addedBy: 'couple',
                  addedAt: Timestamp.now(),
                  energy: 3,
                  explicit: false
                }))
              };
            }
          });
          timeline = timelineObj;
        } else {
          // Already object format
          timeline = rawData.timeline;
        }
      }
      
      // ALWAYS initialize or validate timeline to ensure songs exist
      if (!timeline || Object.keys(timeline).length === 0) {
        console.log('🎆 Initializing brand new timeline with default songs');
        timeline = initializeTimeline(userCountry, userGenres);
      } else {
        console.log('✅ Validating and fixing existing timeline');
        timeline = validateAndFixTimeline(timeline);
      }
      
      // Count total songs
      const totalSongs = Object.values(timeline).reduce((count, moment: any) => 
        count + (moment?.songs?.length || 0), 0
      );
      
      console.log('🎵 Timeline ready with', totalSongs, 'songs across', Object.keys(timeline).length, 'moments');
      
      // Create the wedding data object
      const weddingData: WeddingV2 = {
        id: weddingDoc.id,
        ...rawData,
        timeline,
        // Ensure all required V2 fields
        slug: rawData.slug || weddingDoc.id,
        coupleNames: rawData.coupleNames || (rawData.weddingName ? rawData.weddingName.split(' & ') : ['Partner 1', 'Partner 2']),
        weddingDate: rawData.weddingDate || Timestamp.now(),
        owners: rawData.owners || [rawData.userId || user?.uid || 'unknown'],
        paymentStatus: rawData.paymentStatus || 'pending',
        createdAt: rawData.createdAt || Timestamp.now(),
        updatedAt: rawData.updatedAt || Timestamp.now(),
        preferences: rawData.preferences || {
          avoidExplicit: true,
          genres: userGenres,
          eras: [],
          energyProfile: 'balanced'
        }
      }
      
      // Save the properly formatted timeline back to Firebase
      if (timeline !== rawData.timelineV2) {
        console.log('💾 Saving updated timeline to Firebase');
        try {
          await updateDoc(doc(db, 'weddings', weddingId), {
            timelineV2: timeline,
            updatedAt: Timestamp.now()
          });
          console.log('✅ Timeline saved successfully');
        } catch (error) {
          console.error('❌ Failed to save timeline:', error);
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