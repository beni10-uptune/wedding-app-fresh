/**
 * Auth utility functions for robust user management
 */

import { User } from 'firebase/auth'
import { doc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'
import { setDocWithRetry, getDocWithRetry } from './firestore-helpers'

export interface UserDocument {
  uid: string
  email: string
  displayName: string
  partnerName?: string
  photoURL?: string
  createdAt: any
  updatedAt?: any
  role: 'couple' | 'vendor'
  onboardingCompleted: boolean
  activeWeddingId?: string
}

/**
 * Creates or updates a user document with retry logic
 */
export async function ensureUserDocument(
  user: User,
  additionalData?: Partial<UserDocument>
): Promise<UserDocument> {
  const userRef = doc(db, 'users', user.uid)
  
  try {
    // Try to get existing user document
    const existingUser = await getDocWithRetry<UserDocument>(userRef)
    
    if (existingUser) {
      console.log('User document already exists:', user.uid)
      
      // Update lastLogin timestamp
      await setDocWithRetry(userRef, {
        updatedAt: serverTimestamp()
      }, { merge: true })
      
      return existingUser
    }
    
    // Create new user document
    console.log('Creating new user document:', user.uid)
    
    const userData: UserDocument = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || additionalData?.displayName || 'User',
      photoURL: user.photoURL || additionalData?.photoURL,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      role: 'couple',
      onboardingCompleted: false,
      ...additionalData
    }
    
    await setDocWithRetry(userRef, userData)
    console.log('User document created successfully')
    
    return userData
  } catch (error) {
    console.error('Error ensuring user document:', error)
    
    // If all retries failed, create a minimal user document
    // This ensures the user can at least access the app
    try {
      const minimalUserData: UserDocument = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'User',
        createdAt: serverTimestamp(),
        role: 'couple',
        onboardingCompleted: false
      }
      
      await setDocWithRetry(userRef, minimalUserData)
      console.log('Created minimal user document as fallback')
      return minimalUserData
    } catch (fallbackError) {
      console.error('Failed to create even minimal user document:', fallbackError)
      throw fallbackError
    }
  }
}

/**
 * Safely get user document with fallback creation
 */
export async function getUserDocument(userId: string): Promise<UserDocument | null> {
  const userRef = doc(db, 'users', userId)
  
  try {
    const userData = await getDocWithRetry<UserDocument>(userRef)
    return userData
  } catch (error) {
    console.error('Error getting user document:', error)
    return null
  }
}

/**
 * Update user onboarding status
 */
export async function updateUserOnboarding(
  userId: string, 
  completed: boolean,
  activeWeddingId?: string
): Promise<void> {
  const userRef = doc(db, 'users', userId)
  
  const updateData: any = {
    onboardingCompleted: completed,
    updatedAt: serverTimestamp()
  }
  
  if (activeWeddingId) {
    updateData.activeWeddingId = activeWeddingId
  }
  
  await setDocWithRetry(userRef, updateData, { merge: true })
}