import * as admin from 'firebase-admin'

const firebaseAdminConfig = {
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  })
}

// Initialize Firebase Admin
const app = admin.apps.length === 0 
  ? admin.initializeApp(firebaseAdminConfig) 
  : admin.apps[0]

export const auth = admin.auth()
export const adminDb = admin.firestore()