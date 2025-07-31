import * as admin from 'firebase-admin'

let auth: admin.auth.Auth | null = null
let adminDb: admin.firestore.Firestore | null = null

// Only initialize if we have the required environment variables
if (
  process.env.FIREBASE_PROJECT_ID && 
  process.env.FIREBASE_CLIENT_EMAIL && 
  process.env.FIREBASE_PRIVATE_KEY
) {
  try {
    const firebaseAdminConfig = {
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      })
    }

    // Initialize Firebase Admin
    if (admin.apps.length === 0) {
      admin.initializeApp(firebaseAdminConfig)
    }

    auth = admin.auth()
    adminDb = admin.firestore()
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error)
    // Continue without admin SDK - will fall back to client SDK
  }
} else {
  console.log('Firebase Admin SDK not configured - some features may be limited')
}

export { auth, adminDb }