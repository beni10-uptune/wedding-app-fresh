'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getWeddingBySlug } from '@/lib/slug-utils'

export default function WeddingSlugPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  
  useEffect(() => {
    const redirectToWedding = async () => {
      try {
        const wedding = await getWeddingBySlug(params.slug)
        
        if (wedding) {
          // Redirect to the guest join page
          router.replace(`/join/${wedding.id}`)
        } else {
          // Wedding not found, redirect to 404
          router.replace('/404')
        }
      } catch (error) {
        console.error('Error loading wedding:', error)
        router.replace('/404')
      }
    }
    
    redirectToWedding()
  }, [params.slug, router])
  
  // Show loading state while redirecting
  return (
    <div className="min-h-screen dark-gradient flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/60">Loading wedding...</p>
      </div>
    </div>
  )
}