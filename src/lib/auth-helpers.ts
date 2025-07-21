import { User } from 'firebase/auth'
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore'
import { db } from './firebase'

export async function getSmartRedirectPath(user: User): Promise<string> {
  try {
    // Query for user's weddings
    const weddingsRef = collection(db, 'weddings')
    const q = query(
      weddingsRef, 
      where('owners', 'array-contains', user.uid),
      orderBy('updatedAt', 'desc'),
      limit(5) // Get recent weddings
    )
    
    const snapshot = await getDocs(q)
    
    if (snapshot.empty) {
      // No weddings, go to create wedding
      return '/create-wedding'
    }
    
    // Check for paid weddings first
    const paidWedding = snapshot.docs.find(doc => 
      doc.data().paymentStatus === 'paid'
    )
    
    if (paidWedding) {
      // User has a paid wedding, go directly to builder
      return `/wedding/${paidWedding.id}/builder`
    }
    
    // Check for pending payment weddings
    const pendingWedding = snapshot.docs.find(doc => 
      doc.data().paymentStatus === 'pending' || !doc.data().paymentStatus
    )
    
    if (pendingWedding) {
      // Has wedding but needs to pay
      return `/wedding/${pendingWedding.id}/payment`
    }
    
    // Default to dashboard
    return '/dashboard'
    
  } catch (error) {
    console.error('Error in smart redirect:', error)
    // If query fails (maybe index not ready), try simpler query
    try {
      const simpleQuery = query(
        collection(db, 'weddings'),
        where('owners', 'array-contains', user.uid)
      )
      const simpleSnapshot = await getDocs(simpleQuery)
      
      if (!simpleSnapshot.empty) {
        const firstWedding = simpleSnapshot.docs[0]
        const data = firstWedding.data()
        
        if (data.paymentStatus === 'paid') {
          return `/wedding/${firstWedding.id}/builder`
        } else {
          return `/wedding/${firstWedding.id}/payment`
        }
      }
    } catch (simpleError) {
      console.error('Simple query also failed:', simpleError)
    }
    
    return '/dashboard'
  }
}