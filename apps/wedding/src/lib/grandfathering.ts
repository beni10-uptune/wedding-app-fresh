/**
 * Grandfathering logic for existing users
 * Users who already have more than 10 songs get to keep the 25 song limit
 */

import { WeddingV2 } from '@/types/wedding-v2'

/**
 * Check if a wedding should be grandfathered with the old 25 song limit
 */
export function isGrandfathered(wedding: WeddingV2): boolean {
  // If paid, no need to grandfather
  if (wedding.paymentStatus === 'paid') {
    return false
  }
  
  // Count total songs in timeline
  const totalSongs = Object.values(wedding.timeline || {}).reduce((count, moment) => {
    return count + (moment?.songs?.length || 0)
  }, 0)
  
  // If they already have more than 10 songs, grandfather them with 25 limit
  return totalSongs > 10
}

/**
 * Get the effective song limit for a wedding
 */
export function getEffectiveSongLimit(wedding: WeddingV2): number {
  // Paid users have unlimited
  if (wedding.paymentStatus === 'paid') {
    return -1
  }
  
  // Check if grandfathered
  if (isGrandfathered(wedding)) {
    return 25
  }
  
  // Otherwise use new limit
  return 10
}

/**
 * Get a display message for the song limit
 */
export function getSongLimitMessage(wedding: WeddingV2, currentSongs: number): string {
  const limit = getEffectiveSongLimit(wedding)
  
  if (limit === -1) {
    return 'Unlimited songs'
  }
  
  const remaining = limit - currentSongs
  
  if (remaining <= 0) {
    return `You've reached the ${limit} song limit on the free plan`
  }
  
  if (remaining <= Math.floor(limit * 0.2)) {
    return `${remaining} songs left on your free plan`
  }
  
  return `${currentSongs} / ${limit} songs`
}