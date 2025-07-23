import { User } from 'firebase/auth'
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore'
import { db } from './firebase'
import { ensureUserDocument } from './auth-utils'

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
        return '/create-wedding'
      }
      
      // For freemium model, all users go to dashboard
      // They can upgrade from there if they want
      return '/dashboard'
    } catch (queryError) {
      console.error('Compound query failed:', queryError)
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
        // User has a wedding, go to dashboard
        return '/dashboard'
      } else {
        // No wedding found, create one
        return '/create-wedding'
      }
    } catch (simpleError) {
      console.error('Simple query also failed:', simpleError)
    }
    
  } catch (error) {
    console.error('Error in smart redirect:', error)
  }
  
  // Default fallback
  return '/dashboard'
}