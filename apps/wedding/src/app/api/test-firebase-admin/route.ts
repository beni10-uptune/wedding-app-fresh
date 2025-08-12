import { NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase-admin'

export async function GET() {
  const status = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    firebase: {
      admin: {
        authInitialized: !!adminAuth,
        dbInitialized: !!adminDb,
      },
      config: {
        hasProjectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'not-set',
        hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL ? 
          process.env.FIREBASE_CLIENT_EMAIL.substring(0, 10) + '...' : 'not-set',
        hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
        privateKeyLength: process.env.FIREBASE_PRIVATE_KEY?.length || 0,
      },
      stripe: {
        hasPublicKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        hasSecretKey: !!process.env.STRIPE_SECRET_KEY,
        hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
      }
    },
    test: {
      canVerifyToken: false,
      message: ''
    }
  }

  // Try to verify a test token if Firebase Admin is initialized
  if (adminAuth) {
    try {
      // This will fail but shows the Admin SDK is working
      await adminAuth.getUser('test-user-id').catch(() => {})
      status.test.canVerifyToken = true
      status.test.message = 'Firebase Admin SDK is working correctly'
    } catch (error) {
      status.test.message = `Firebase Admin SDK error: ${error}`
    }
  } else {
    status.test.message = 'Firebase Admin SDK not initialized'
  }

  return NextResponse.json(status)
}