/**
 * Firestore helper functions with retry logic and error handling
 */

import { 
  doc, 
  setDoc, 
  getDoc, 
  DocumentReference,
  FirestoreError 
} from 'firebase/firestore'

// Retry configuration
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // Start with 1 second

/**
 * Sleep helper for retry logic
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Determines if an error is retryable
 */
const isRetryableError = (error: any): boolean => {
  const retryableCodes = [
    'unavailable',
    'deadline-exceeded',
    'resource-exhausted',
    'aborted',
    'internal',
    'unknown'
  ]
  
  return error?.code && retryableCodes.includes(error.code)
}

/**
 * Set a document with retry logic
 */
export async function setDocWithRetry<T>(
  docRef: DocumentReference,
  data: T,
  options?: { merge?: boolean }
): Promise<void> {
  let lastError: any
  
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      await setDoc(docRef, data as any, options || {})
      return // Success
    } catch (error) {
      lastError = error
      console.error(`Firestore setDoc attempt ${attempt + 1} failed:`, error)
      
      if (!isRetryableError(error) || attempt === MAX_RETRIES - 1) {
        throw error
      }
      
      // Exponential backoff
      const delay = RETRY_DELAY * Math.pow(2, attempt)
      console.log(`Retrying in ${delay}ms...`)
      await sleep(delay)
    }
  }
  
  throw lastError
}

/**
 * Get a document with retry logic
 */
export async function getDocWithRetry<T>(
  docRef: DocumentReference
): Promise<T | null> {
  let lastError: any
  
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        return docSnap.data() as T
      }
      return null
    } catch (error) {
      lastError = error
      console.error(`Firestore getDoc attempt ${attempt + 1} failed:`, error)
      
      if (!isRetryableError(error) || attempt === MAX_RETRIES - 1) {
        throw error
      }
      
      // Exponential backoff
      const delay = RETRY_DELAY * Math.pow(2, attempt)
      console.log(`Retrying in ${delay}ms...`)
      await sleep(delay)
    }
  }
  
  throw lastError
}

/**
 * Format Firestore error for user display
 */
export function formatFirestoreError(error: any): string {
  if (!error) return 'An unknown error occurred'
  
  // Common Firestore error codes and user-friendly messages
  const errorMessages: Record<string, string> = {
    'permission-denied': 'You don\'t have permission to perform this action.',
    'not-found': 'The requested data was not found.',
    'already-exists': 'This data already exists.',
    'failed-precondition': 'Operation failed. Please try again.',
    'unavailable': 'The service is temporarily unavailable. Please try again.',
    'unauthenticated': 'You must be logged in to perform this action.',
    'resource-exhausted': 'Too many requests. Please try again later.',
    'invalid-argument': 'Invalid data provided.',
    'deadline-exceeded': 'Operation timed out. Please try again.',
    'aborted': 'Operation was cancelled. Please try again.',
    'out-of-range': 'Operation is out of valid range.',
    'unimplemented': 'This feature is not implemented yet.',
    'internal': 'Internal server error. Please try again.',
    'data-loss': 'Data loss detected. Please contact support.',
    'unknown': 'An unknown error occurred. Please try again.'
  }
  
  // Check if it's a Firestore error with a code
  if (error.code && errorMessages[error.code]) {
    return errorMessages[error.code]
  }
  
  // Check for network errors
  if (error.message?.includes('Failed to get document because the client is offline')) {
    return 'You appear to be offline. Please check your internet connection.'
  }
  
  // Check for Firebase config errors
  if (error.message?.includes('Missing or insufficient permissions')) {
    return 'Database access denied. Please try logging in again.'
  }
  
  // Return the original message if we can't format it
  return error.message || 'An error occurred. Please try again.'
}