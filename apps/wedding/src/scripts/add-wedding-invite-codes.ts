import { collection, getDocs, updateDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { generateInviteCode } from '@/lib/invitations'

// Script to add invite codes to existing weddings
async function addInviteCodesToWeddings() {
  try {
    console.log('Starting to add invite codes to weddings...')
    
    // Get all weddings
    const weddingsSnapshot = await getDocs(collection(db, 'weddings'))
    
    let updated = 0
    let skipped = 0
    
    for (const weddingDoc of weddingsSnapshot.docs) {
      const weddingData = weddingDoc.data()
      
      // Skip if wedding already has an invite code
      if (weddingData.inviteCode) {
        console.log(`Wedding ${weddingDoc.id} already has invite code: ${weddingData.inviteCode}`)
        skipped++
        continue
      }
      
      // Generate new invite code
      const inviteCode = generateInviteCode()
      
      // Update wedding with invite code
      await updateDoc(doc(db, 'weddings', weddingDoc.id), {
        inviteCode,
        updatedAt: new Date()
      })
      
      console.log(`Added invite code ${inviteCode} to wedding ${weddingDoc.id}`)
      updated++
    }
    
    console.log(`\nMigration complete!`)
    console.log(`Updated: ${updated} weddings`)
    console.log(`Skipped: ${skipped} weddings (already had invite codes)`)
    
  } catch (error) {
    console.error('Error adding invite codes:', error)
  }
}

// Run the migration
addInviteCodesToWeddings()