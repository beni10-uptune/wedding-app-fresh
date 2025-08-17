/**
 * Server-side tier enforcement utilities
 * Ensures free tier limits are properly enforced in the backend
 */

import { db } from '@/lib/firebase'
import { adminDb } from '@/lib/firebase-admin'
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore'
import { getUserTier } from './subscription-tiers'

export interface TierCheckResult {
  allowed: boolean
  reason?: string
  currentCount?: number
  limit?: number
}

/**
 * Check if a wedding can add more songs
 */
export async function canAddSong(weddingId: string): Promise<TierCheckResult> {
  try {
    // Get wedding document
    let weddingData: any
    let exists = false
    
    if (adminDb) {
      const weddingRef = adminDb.collection('weddings').doc(weddingId)
      const weddingDoc = await weddingRef.get()
      exists = weddingDoc.exists
      weddingData = weddingDoc.data()
    } else {
      const weddingRef = doc(db, 'weddings', weddingId)
      const weddingDoc = await getDoc(weddingRef)
      exists = weddingDoc.exists()
      weddingData = weddingDoc.data()
    }
    
    if (!exists) {
      return { allowed: false, reason: 'Wedding not found' }
    }
    
    const paymentStatus = weddingData?.paymentStatus || 'pending'
    const tier = getUserTier(paymentStatus)
    
    // Premium users have unlimited songs
    if (tier.maxSongs === -1) {
      return { allowed: true }
    }
    
    // Count current songs in timeline
    const timeline = weddingData?.timeline || {}
    let currentSongCount = 0
    
    Object.values(timeline).forEach((moment: any) => {
      if (moment?.songs && Array.isArray(moment.songs)) {
        currentSongCount += moment.songs.length
      }
    })
    
    if (currentSongCount >= tier.maxSongs) {
      return {
        allowed: false,
        reason: `Free tier limit reached (${tier.maxSongs} songs)`,
        currentCount: currentSongCount,
        limit: tier.maxSongs
      }
    }
    
    return {
      allowed: true,
      currentCount: currentSongCount,
      limit: tier.maxSongs
    }
  } catch (error) {
    console.error('Error checking song limit:', error)
    // Fail open in case of error
    return { allowed: true }
  }
}

/**
 * Check if a wedding can invite more guests
 */
export async function canInviteGuest(weddingId: string): Promise<TierCheckResult> {
  try {
    // Get wedding document
    let weddingData: any
    let exists = false
    
    if (adminDb) {
      const weddingRef = adminDb.collection('weddings').doc(weddingId)
      const weddingDoc = await weddingRef.get()
      exists = weddingDoc.exists
      weddingData = weddingDoc.data()
    } else {
      const weddingRef = doc(db, 'weddings', weddingId)
      const weddingDoc = await getDoc(weddingRef)
      exists = weddingDoc.exists()
      weddingData = weddingDoc.data()
    }
    
    if (!exists) {
      return { allowed: false, reason: 'Wedding not found' }
    }
    
    const paymentStatus = weddingData?.paymentStatus || 'pending'
    const tier = getUserTier(paymentStatus)
    
    // Premium users have unlimited guests
    if (tier.maxGuests === -1) {
      return { allowed: true }
    }
    
    // Count current invitations
    let guestInvitations: any[] = []
    
    if (adminDb) {
      const invitationsSnapshot = await adminDb
        .collection('invitations')
        .where('weddingId', '==', weddingId)
        .where('type', '==', 'guest')
        .get()
      guestInvitations = invitationsSnapshot.docs
    } else {
      const invitationsQuery = query(
        collection(db, 'invitations'),
        where('weddingId', '==', weddingId),
        where('type', '==', 'guest')
      )
      const invitationsSnapshot = await getDocs(invitationsQuery)
      guestInvitations = invitationsSnapshot.docs
    }
    
    const currentGuestCount = guestInvitations.length
    
    if (currentGuestCount >= tier.maxGuests) {
      return {
        allowed: false,
        reason: `Free tier limit reached (${tier.maxGuests} guests)`,
        currentCount: currentGuestCount,
        limit: tier.maxGuests
      }
    }
    
    return {
      allowed: true,
      currentCount: currentGuestCount,
      limit: tier.maxGuests
    }
  } catch (error) {
    console.error('Error checking guest limit:', error)
    // Fail open in case of error
    return { allowed: true }
  }
}

/**
 * Check if a wedding can export playlists
 */
export async function canExport(weddingId: string): Promise<TierCheckResult> {
  try {
    // Get wedding document
    let weddingData: any
    let exists = false
    
    if (adminDb) {
      const weddingRef = adminDb.collection('weddings').doc(weddingId)
      const weddingDoc = await weddingRef.get()
      exists = weddingDoc.exists
      weddingData = weddingDoc.data()
    } else {
      const weddingRef = doc(db, 'weddings', weddingId)
      const weddingDoc = await getDoc(weddingRef)
      exists = weddingDoc.exists()
      weddingData = weddingDoc.data()
    }
    
    if (!exists) {
      return { allowed: false, reason: 'Wedding not found' }
    }
    
    const paymentStatus = weddingData?.paymentStatus || 'pending'
    const tier = getUserTier(paymentStatus)
    
    if (tier.maxExports === 0) {
      return {
        allowed: false,
        reason: 'Exports require premium plan',
        currentCount: 0,
        limit: 0
      }
    }
    
    return { allowed: true }
  } catch (error) {
    console.error('Error checking export permission:', error)
    return { allowed: false, reason: 'Error checking permissions' }
  }
}

/**
 * Check if a wedding can add co-owners
 */
export async function canAddCoOwner(weddingId: string): Promise<TierCheckResult> {
  try {
    // Get wedding document
    let weddingData: any
    let exists = false
    
    if (adminDb) {
      const weddingRef = adminDb.collection('weddings').doc(weddingId)
      const weddingDoc = await weddingRef.get()
      exists = weddingDoc.exists
      weddingData = weddingDoc.data()
    } else {
      const weddingRef = doc(db, 'weddings', weddingId)
      const weddingDoc = await getDoc(weddingRef)
      exists = weddingDoc.exists()
      weddingData = weddingDoc.data()
    }
    
    if (!exists) {
      return { allowed: false, reason: 'Wedding not found' }
    }
    
    // Partner collaboration is now FREE for all users
    return { allowed: true }
  } catch (error) {
    console.error('Error checking co-owner permission:', error)
    return { allowed: false, reason: 'Error checking permissions' }
  }
}

/**
 * Get current usage stats for a wedding
 */
export async function getWeddingUsageStats(weddingId: string) {
  try {
    // Get wedding document
    let weddingData: any
    let exists = false
    
    if (adminDb) {
      const weddingRef = adminDb.collection('weddings').doc(weddingId)
      const weddingDoc = await weddingRef.get()
      exists = weddingDoc.exists
      weddingData = weddingDoc.data()
    } else {
      const weddingRef = doc(db, 'weddings', weddingId)
      const weddingDoc = await getDoc(weddingRef)
      exists = weddingDoc.exists()
      weddingData = weddingDoc.data()
    }
    
    if (!exists) {
      throw new Error('Wedding not found')
    }
    
    const paymentStatus = weddingData?.paymentStatus || 'pending'
    const tier = getUserTier(paymentStatus)
    
    // Count songs
    const timeline = weddingData?.timeline || {}
    let songCount = 0
    
    Object.values(timeline).forEach((moment: any) => {
      if (moment?.songs && Array.isArray(moment.songs)) {
        songCount += moment.songs.length
      }
    })
    
    // Count guest invitations
    let guestInvitations: any[] = []
    
    if (adminDb) {
      const invitationsSnapshot = await adminDb
        .collection('invitations')
        .where('weddingId', '==', weddingId)
        .where('type', '==', 'guest')
        .get()
      guestInvitations = invitationsSnapshot.docs
    } else {
      const invitationsQuery = query(
        collection(db, 'invitations'),
        where('weddingId', '==', weddingId),
        where('type', '==', 'guest')
      )
      const invitationsSnapshot = await getDocs(invitationsQuery)
      guestInvitations = invitationsSnapshot.docs
    }
    
    return {
      tier: paymentStatus === 'paid' ? 'premium' : 'free',
      songs: {
        current: songCount,
        limit: tier.maxSongs,
        percentage: tier.maxSongs === -1 ? 0 : Math.round((songCount / tier.maxSongs) * 100)
      },
      guests: {
        current: guestInvitations.length,
        limit: tier.maxGuests,
        percentage: tier.maxGuests === -1 ? 0 : Math.round((guestInvitations.length / tier.maxGuests) * 100)
      },
      exports: {
        allowed: tier.maxExports !== 0
      },
      coOwner: {
        allowed: tier.features.coOwner
      }
    }
  } catch (error) {
    console.error('Error getting usage stats:', error)
    throw error
  }
}