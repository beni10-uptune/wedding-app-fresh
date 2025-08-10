import { User } from 'firebase/auth'
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore'
import { db } from './firebase'
import { ensureUserDocument } from './auth-utils'
import { logger, logError } from './logger'

export async function getSmartRedirectPath(user: User): Promise<string> {
  try {
    // First ensure user document exists
    await ensureUserDocument(user)
    
    // Try to get weddings with compound query
    try {
      const weddingsRef = collection(db, 'weddings')
      const q = query(
        weddingsRef, 
        where('owners', 'array-contains', user.uid),
        orderBy('updatedAt', 'desc'),
        limit(5)
      )
      
      const snapshot = await getDocs(q)
      
      if (snapshot.empty) {
        return '/builder'
      }
      
      // For freemium model, all users go to builder
      // They can upgrade from there if they want
      return '/builder'
    } catch (queryError) {
      logger.debug('Compound query failed, falling back to simple query', { error: queryError })
      // Fall through to simple query
    }
    
    // If compound query failed, try simpler query
    try {
      const simpleQuery = query(
        collection(db, 'weddings'),
        where('owners', 'array-contains', user.uid)
      )
      const simpleSnapshot = await getDocs(simpleQuery)
      
      if (!simpleSnapshot.empty) {
        // User has a wedding, go to builder
        return '/builder'
      } else {
        // No wedding found, create one
        return '/builder'
      }
    } catch (simpleError) {
      logError(simpleError, { context: 'Simple query failed in smart redirect' })
    }
    
  } catch (error) {
    logError(error, { context: 'Smart redirect failed', userId: user.uid })
  }
  
  // Default fallback
  return '/builder'
}