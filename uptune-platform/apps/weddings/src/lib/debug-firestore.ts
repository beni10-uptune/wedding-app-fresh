// Debug helper for Firestore index issues
// This file helps identify if Firestore queries are failing due to missing indexes

import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { db } from './firebase'

export async function debugFirestoreIndexes(userId: string) {
  console.log('=== Firestore Debug Start ===')
  console.log('Testing queries for user:', userId)
  
  try {
    // Test 1: Simple query without orderBy
    console.log('\nTest 1: Simple query (no orderBy)')
    const simpleQuery = query(
      collection(db, 'weddings'),
      where('owners', 'array-contains', userId)
    )
    const simpleResult = await getDocs(simpleQuery)
    console.log('✓ Simple query succeeded. Found:', simpleResult.size, 'weddings')
    
    // Test 2: Query with orderBy (requires composite index)
    console.log('\nTest 2: Query with orderBy (requires composite index)')
    try {
      const complexQuery = query(
        collection(db, 'weddings'),
        where('owners', 'array-contains', userId),
        orderBy('updatedAt', 'desc')
      )
      const complexResult = await getDocs(complexQuery)
      console.log('✓ Complex query succeeded. Found:', complexResult.size, 'weddings')
    } catch (indexError: any) {
      console.error('✗ Complex query failed:', indexError.message)
      if (indexError.code === 'failed-precondition') {
        console.error('⚠️  Missing composite index! Create an index for:')
        console.error('   Collection: weddings')
        console.error('   Fields: owners (Arrays), updatedAt (Descending)')
        console.error('   Visit the URL in the error message to create the index')
      }
    }
    
    // Test 3: List all weddings for debugging
    console.log('\nTest 3: Listing wedding details')
    const allWeddings = await getDocs(simpleQuery)
    allWeddings.forEach((doc) => {
      const data = doc.data()
      console.log(`- Wedding ${doc.id}:`)
      console.log(`  Owners: ${data.owners?.join(', ') || 'MISSING'}`)
      console.log(`  Payment Status: ${data.paymentStatus || 'MISSING'}`)
      console.log(`  Updated At: ${data.updatedAt?.toDate?.()?.toISOString() || 'MISSING'}`)
      console.log(`  Couple Names: ${data.coupleNames?.join(' & ') || 'MISSING'}`)
    })
    
  } catch (error: any) {
    console.error('Unexpected error during debug:', error)
  }
  
  console.log('\n=== Firestore Debug End ===')
}

// Usage instructions:
// 1. Import this function in your component
// 2. Call it with the user ID when debugging: debugFirestoreIndexes(user.uid)
// 3. Check the console for results
// 4. If you see index errors, follow the URL in the error to create the required index