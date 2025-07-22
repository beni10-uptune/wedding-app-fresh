'use client'

import { useState, useEffect, use } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { WeddingV2 } from '@/types/wedding-v2'
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
        router.push('/dashboard')
        return
      }

      const weddingData = { id: weddingDoc.id, ...weddingDoc.data() } as WeddingV2
      
      // Initialize timeline if it doesn't exist
      if (!weddingData.timeline) {
        weddingData.timeline = {}
      }

      setWedding(weddingData)
    } catch (error) {
      console.error('Error loading wedding:', error)
      router.push('/dashboard')
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
              href="/dashboard"
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Dashboard
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