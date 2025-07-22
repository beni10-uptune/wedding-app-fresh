'use client'

import { useState } from 'react'
import { auth, db } from '@/lib/firebase'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'

export default function TestFirebasePage() {
  const [status, setStatus] = useState<string[]>([])
  const [error, setError] = useState<string>('')

  const addStatus = (message: string) => {
    setStatus(prev => [...prev, `${new Date().toISOString()}: ${message}`])
  }

  const testFirebase = async () => {
    setStatus([])
    setError('')
    
    try {
      // Test 1: Check Firebase Config
      addStatus('Testing Firebase configuration...')
      const config = {
        apiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: !!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID
      }
      addStatus(`Config check: ${JSON.stringify(config)}`)
      
      // Test 2: Check Auth
      addStatus('Checking Firebase Auth...')
      const currentUser = auth.currentUser
      addStatus(`Current user: ${currentUser ? currentUser.email : 'Not logged in'}`)
      
      // Test 3: Test Firestore Write
      addStatus('Testing Firestore write...')
      const testId = `test-${Date.now()}`
      await setDoc(doc(db, 'test-collection', testId), {
        test: true,
        timestamp: serverTimestamp(),
        message: 'Test from mobile browser'
      })
      addStatus('Write successful')
      
      // Test 4: Test Firestore Read
      addStatus('Testing Firestore read...')
      const testDoc = await getDoc(doc(db, 'test-collection', testId))
      if (testDoc.exists()) {
        addStatus(`Read successful: ${JSON.stringify(testDoc.data())}`)
      } else {
        addStatus('Read failed: Document does not exist')
      }
      
      addStatus('All tests completed successfully!')
      
    } catch (err) {
      console.error('Firebase test error:', err)
      const error = err as any
      setError(`Error: ${error.message || 'Unknown error'}`)
      
      if (error.code) {
        setError(prev => `${prev}\nError code: ${error.code}`)
      }
      
      // Log the full error details
      addStatus(`Error details: ${JSON.stringify(error, null, 2)}`)
    }
  }

  return (
    <div className="min-h-screen dark-gradient p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Firebase Connection Test</h1>
        
        <button 
          onClick={testFirebase}
          className="btn-primary mb-4"
        >
          Run Firebase Tests
        </button>
        
        {error && (
          <div className="bg-red-500/20 text-red-300 p-4 rounded-lg mb-4 border border-red-500/30">
            <pre className="whitespace-pre-wrap">{error}</pre>
          </div>
        )}
        
        <div className="bg-white/10 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Test Results:</h2>
          <div className="space-y-1 font-mono text-sm">
            {status.map((s, i) => (
              <div key={i} className="text-white/80">{s}</div>
            ))}
          </div>
        </div>
        
        <div className="mt-8 text-sm text-white/60">
          <p>This page tests:</p>
          <ul className="list-disc list-inside mt-2">
            <li>Firebase configuration</li>
            <li>Authentication status</li>
            <li>Firestore write permissions</li>
            <li>Firestore read permissions</li>
          </ul>
        </div>
      </div>
    </div>
  )
}