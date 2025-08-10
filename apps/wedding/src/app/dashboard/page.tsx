'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace('/builder')
  }, [router])
  
  return (
    <div className="min-h-screen flex items-center justify-center dark-gradient">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/60">Redirecting to builder...</p>
      </div>
    </div>
  )
}