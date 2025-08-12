import * as admin from 'firebase-admin'

let auth: admin.auth.Auth | null = null
let adminDb: admin.firestore.Firestore | null = null

// Log initialization status for debugging
const initStatus = {
  hasProjectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
  hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
  privateKeyLength: process.env.FIREBASE_PRIVATE_KEY?.length || 0
}

console.log('[Firebase Admin] Initialization check:', initStatus)

// Only initialize if we have the required environment variables
if (
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && 
  process.env.FIREBASE_CLIENT_EMAIL && 
  process.env.FIREBASE_PRIVATE_KEY
) {
  try {
    // Ensure private key has proper line breaks
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
      .replace(/\\n/g, '\n')  // Replace escaped newlines
      .replace(/\n\n/g, '\n') // Remove double newlines
    
    const firebaseAdminConfig = {
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey
      })
    }

    // Initialize Firebase Admin
    if (admin.apps.length === 0) {
      console.log('[Firebase Admin] Initializing new app...')
      admin.initializeApp(firebaseAdminConfig)
      console.log('[Firebase Admin] App initialized successfully')
    } else {
      console.log('[Firebase Admin] Using existing app')
    }

    auth = admin.auth()
    adminDb = admin.firestore()
    
    console.log('[Firebase Admin] ✅ Successfully initialized')
  } catch (error) {
    console.error('[Firebase Admin] ❌ Initialization failed:', error)
    // Log more details about the error
    if (error instanceof Error) {
      console.error('[Firebase Admin] Error message:', error.message)
      console.error('[Firebase Admin] Error stack:', error.stack)
    }
  }
} else {
  console.warn('[Firebase Admin] ⚠️ Missing required environment variables')
  console.warn('[Firebase Admin] Required vars:', {
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID': !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    'FIREBASE_CLIENT_EMAIL': !!process.env.FIREBASE_CLIENT_EMAIL,
    'FIREBASE_PRIVATE_KEY': !!process.env.FIREBASE_PRIVATE_KEY
  })
}

export { auth as adminAuth, adminDb }