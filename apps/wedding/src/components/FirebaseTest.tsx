'use client'

import { useEffect, useState } from 'react'
import { auth, db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function FirebaseTest() {
  const [firebaseStatus, setFirebaseStatus] = useState<{
    auth: 'loading' | 'connected' | 'error'
    firestore: 'loading' | 'connected' | 'error'
    config: 'loading' | 'connected' | 'error'
  }>({
    auth: 'loading',
    firestore: 'loading',
    config: 'loading'
  })

  useEffect(() => {
    const testFirebase = async () => {
      // Test Firebase configuration
      try {
        if (auth.app.options.projectId === 'weddings-uptune-d12fa') {
          setFirebaseStatus(prev => ({ ...prev, config: 'connected' }))
        } else {
          setFirebaseStatus(prev => ({ ...prev, config: 'error' }))
        }
      } catch (error) {
        setFirebaseStatus(prev => ({ ...prev, config: 'error' }))
      }

      // Test Auth
      try {
        // Just check if auth is initialized
        if (auth) {
          setFirebaseStatus(prev => ({ ...prev, auth: 'connected' }))
        }
      } catch (error) {
        setFirebaseStatus(prev => ({ ...prev, auth: 'error' }))
      }

      // Test Firestore
      try {
        // Try to access a collection (this will work even if empty)
        const testCollection = collection(db, 'test')
        await getDocs(testCollection)
        setFirebaseStatus(prev => ({ ...prev, firestore: 'connected' }))
      } catch (error) {
        console.error('Firestore test error:', error)
        setFirebaseStatus(prev => ({ ...prev, firestore: 'error' }))
      }
    }

    testFirebase()
  }, [])

  const StatusIcon = ({ status }: { status: 'loading' | 'connected' | 'error' }) => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-4 h-4 animate-spin text-white/50" />
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'error':
        return <XCircle className="w-4 h-4 text-red-400" />
    }
  }

  const allConnected = Object.values(firebaseStatus).every(status => status === 'connected')

  return (
    <div className="fixed bottom-4 right-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-4 max-w-sm">
      <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
        🔥 Firebase Status
        {allConnected && <span className="text-xs bg-green-500/20 text-green-300 border border-green-500/30 px-2 py-1 rounded">Ready</span>}
      </h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-white/80">Configuration</span>
          <StatusIcon status={firebaseStatus.config} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white/80">Authentication</span>
          <StatusIcon status={firebaseStatus.auth} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white/80">Firestore</span>
          <StatusIcon status={firebaseStatus.firestore} />
        </div>
      </div>

      {allConnected && (
        <div className="mt-3 text-xs text-white/60">
          Project: {auth.app.options.projectId}
        </div>
      )}
    </div>
  )
} 