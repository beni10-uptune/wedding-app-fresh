/**
 * Auth utility functions for robust user management
 */

import { User } from 'firebase/auth'
import { doc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'
import { setDocWithRetry, getDocWithRetry } from './firestore-helpers'
import { logger, logError } from './logger'

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
      logger.debug('User document already exists', { userId: user.uid })
      
      // Update lastLogin timestamp
      await setDocWithRetry(userRef, {
        updatedAt: serverTimestamp()
      }, { merge: true })
      
      return existingUser
    }
    
    // Create new user document
      logger.info('Creating new user document', { userId: user.uid })
    
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
    logger.info('User document created successfully', { userId: user.uid })
    
    return userData
  } catch (error) {
    logError(error, { context: 'Error ensuring user document', userId: user.uid })
    
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
      logger.warn('Created minimal user document as fallback', { userId: user.uid })
      return minimalUserData
    } catch (fallbackError) {
      logError(fallbackError, { context: 'Failed to create minimal user document', userId: user.uid })
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
    logError(error, { context: 'Error getting user document', userId })
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