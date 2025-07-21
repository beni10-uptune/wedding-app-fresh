import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore'
import { db } from './firebase'
import { Invitation, Collaborator, CollaboratorPermissions } from '@/types/wedding'

// Generate a unique invitation code
export function generateInviteCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// Create an invitation
export async function createInvitation(
  inviteData: {
    weddingId: string
    email: string
    role: Invitation['role']
    userId: string
    personalizedPrompt?: string
  }
): Promise<Invitation> {
  const inviteCode = generateInviteCode()
  const invitationData: Omit<Invitation, 'id'> = {
    weddingId: inviteData.weddingId,
    email: inviteData.email,
    role: inviteData.role,
    inviteCode,
    invitedBy: inviteData.userId,
    invitedAt: Timestamp.now(),
    expiresAt: Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)), // 7 days
    status: 'pending',
    personalizedPrompt: inviteData.personalizedPrompt
  }

  const invitationRef = doc(collection(db, 'invitations'))
  await setDoc(invitationRef, invitationData)

  return {
    id: invitationRef.id,
    ...invitationData
  }
}

// Get invitation by code
export async function getInvitationByCode(inviteCode: string): Promise<Invitation | null> {
  const q = query(
    collection(db, 'invitations'),
    where('inviteCode', '==', inviteCode),
    where('status', '==', 'pending')
  )
  
  const querySnapshot = await getDocs(q)
  if (querySnapshot.empty) {
    return null
  }

  const doc = querySnapshot.docs[0]
  return {
    id: doc.id,
    ...doc.data()
  } as Invitation
}

// Accept an invitation
export async function acceptInvitation(
  invitationId: string,
  userId: string
): Promise<void> {
  const invitationRef = doc(db, 'invitations', invitationId)
  const invitationDoc = await getDoc(invitationRef)
  
  if (!invitationDoc.exists()) {
    throw new Error('Invitation not found')
  }

  const invitation = invitationDoc.data() as Invitation
  
  // Check if invitation is expired
  if (invitation.expiresAt.toDate() < new Date()) {
    await updateDoc(invitationRef, { status: 'expired' })
    throw new Error('Invitation has expired')
  }

  // Update invitation status
  await updateDoc(invitationRef, {
    status: 'accepted',
    userId: userId
  })

  // Create collaborator record
  const permissions: CollaboratorPermissions = {
    canSuggestSongs: true,
    canVote: true,
    canComment: true,
    canViewAllPlaylists: invitation.role !== 'guest'
  }

  const collaboratorData: Omit<Collaborator, 'id'> = {
    weddingId: invitation.weddingId,
    userId: userId,
    role: invitation.role === 'partner' ? 'wedding-party' : invitation.role,
    permissions,
    invitedBy: invitation.invitedBy,
    invitedAt: invitation.invitedAt,
    joinedAt: Timestamp.now(),
    status: 'joined'
  }

  const collaboratorRef = doc(collection(db, 'collaborators'))
  await setDoc(collaboratorRef, collaboratorData)

  // Update wedding document to add collaborator
  const weddingRef = doc(db, 'weddings', invitation.weddingId)
  const weddingDoc = await getDoc(weddingRef)
  
  if (weddingDoc.exists()) {
    const weddingData = weddingDoc.data()
    const collaborators = weddingData.collaborators || []
    
    if (invitation.role === 'partner') {
      // Partner should be added as owner
      const owners = weddingData.owners || []
      if (!owners.includes(userId)) {
        await updateDoc(weddingRef, {
          owners: [...owners, userId],
          updatedAt: serverTimestamp()
        })
      }
    } else {
      // Guest should be added as collaborator
      if (!collaborators.includes(userId)) {
        await updateDoc(weddingRef, {
          collaborators: [...collaborators, userId],
          updatedAt: serverTimestamp()
        })
      }
    }
  }
}

// Get all invitations for a wedding
export async function getWeddingInvitations(weddingId: string): Promise<Invitation[]> {
  const q = query(
    collection(db, 'invitations'),
    where('weddingId', '==', weddingId)
  )
  
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Invitation))
}

// Cancel an invitation
export async function cancelInvitation(invitationId: string): Promise<void> {
  const invitationRef = doc(db, 'invitations', invitationId)
  await updateDoc(invitationRef, {
    status: 'declined'
  })
}

// Check if user has access to a wedding
export async function checkUserWeddingAccess(
  userId: string,
  weddingId: string
): Promise<boolean> {
  // Check if user is owner
  const weddingRef = doc(db, 'weddings', weddingId)
  const weddingDoc = await getDoc(weddingRef)
  
  if (weddingDoc.exists()) {
    const weddingData = weddingDoc.data()
    if (weddingData.owners?.includes(userId)) {
      return true
    }
    if (weddingData.collaborators?.includes(userId)) {
      return true
    }
  }

  // Check if user is a collaborator
  const q = query(
    collection(db, 'collaborators'),
    where('weddingId', '==', weddingId),
    where('userId', '==', userId),
    where('status', '==', 'joined')
  )
  
  const querySnapshot = await getDocs(q)
  return !querySnapshot.empty
}