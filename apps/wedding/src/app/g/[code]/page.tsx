'use client'

import { useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function GuestShortLinkPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params)
  const router = useRouter()

  useEffect(() => {
    async function redirectToGuestPage() {
      try {
        // Look up wedding by invite code
        const weddingDoc = await getDoc(doc(db, 'weddings', code))
        
        if (weddingDoc.exists()) {
          // Direct link using wedding ID
          router.push(`/guest/${code}/simple`)
        } else {
          // Try to find by general invite code
          const wedding = weddingDoc.data()
          if (wedding?.inviteCode === code) {
            router.push(`/guest/${weddingDoc.id}/simple`)
          } else {
            // Invalid code
            router.push('/')
          }
        }
      } catch (error) {
        console.error('Error finding wedding:', error)
        router.push('/')
      }
    }

    redirectToGuestPage()
  }, [code, router])

  return (
    <div className="min-h-screen dark-gradient flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-400 border-t-transparent"></div>
    </div>
  )
}