import { db } from '@/lib/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

/**
 * Generate a URL-friendly slug from couple names
 * Examples:
 * - ["Sarah", "Jane"] => "sarah-and-jane"
 * - ["John Smith", "Mary"] => "john-and-mary"
 * - ["José", "María"] => "jose-and-maria"
 */
export function generateSlugFromNames(names: string[]): string {
  if (!names || names.length === 0) return ''
  
  // Take first name only (before any spaces)
  const firstNames = names.map(name => 
    name.trim().split(' ')[0].toLowerCase()
  )
  
  // Remove special characters and accents
  const cleanNames = firstNames.map(name =>
    name.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9]/g, '') // Keep only alphanumeric
  )
  
  // Join with 'and'
  return cleanNames.filter(n => n).join('-and-')
}

/**
 * Validate slug format
 * - Must be 3-50 characters
 * - Only lowercase letters, numbers, and hyphens
 * - Cannot start or end with hyphen
 * - No consecutive hyphens
 */
export function isValidSlug(slug: string): boolean {
  if (!slug || slug.length < 3 || slug.length > 50) return false
  
  const slugRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/
  return slugRegex.test(slug)
}

/**
 * Check if a slug is available in the database
 */
export async function isSlugAvailable(slug: string, excludeWeddingId?: string): Promise<boolean> {
  try {
    const weddingsRef = collection(db, 'weddings')
    const q = query(weddingsRef, where('slug', '==', slug))
    const snapshot = await getDocs(q)
    
    if (snapshot.empty) return true
    
    // If we're updating an existing wedding, check if the slug belongs to it
    if (excludeWeddingId) {
      const existingDoc = snapshot.docs[0]
      return existingDoc.id === excludeWeddingId
    }
    
    return false
  } catch (error) {
    console.error('Error checking slug availability:', error)
    return false
  }
}

/**
 * Generate a unique slug by appending numbers if needed
 */
export async function generateUniqueSlug(baseSlug: string, excludeWeddingId?: string): Promise<string> {
  let slug = baseSlug
  let counter = 1
  
  while (!(await isSlugAvailable(slug, excludeWeddingId))) {
    slug = `${baseSlug}-${counter}`
    counter++
    
    // Safety check to prevent infinite loop
    if (counter > 100) {
      throw new Error('Unable to generate unique slug')
    }
  }
  
  return slug
}

/**
 * Sanitize user input to create a valid slug
 */
export function sanitizeSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9-]/g, '-') // Replace invalid chars with hyphen
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
}

/**
 * Get wedding by slug
 */
export async function getWeddingBySlug(slug: string) {
  try {
    const weddingsRef = collection(db, 'weddings')
    const q = query(weddingsRef, where('slug', '==', slug))
    const snapshot = await getDocs(q)
    
    if (snapshot.empty) return null
    
    const doc = snapshot.docs[0]
    return {
      id: doc.id,
      ...doc.data()
    }
  } catch (error) {
    console.error('Error fetching wedding by slug:', error)
    return null
  }
}