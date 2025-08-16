import { createClient } from './client'

/**
 * Generate a URL-friendly slug from couple names
 * Examples:
 * - "Sarah & Jane" => "sarah-and-jane"
 * - "John & Mary" => "john-and-mary"
 * - "José & María" => "jose-and-maria"
 */
export function generateSlugFromNames(coupleNames: string): string {
  if (!coupleNames) return ''
  
  // Split by & or and
  const names = coupleNames.split(/\s*[&]\s*|\s+and\s+/i)
  
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
  
  // Join with hyphen
  return cleanNames.filter(n => n).join('-')
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
 * Check if a slug is available in Supabase
 */
export async function isSlugAvailable(slug: string, excludeWeddingId?: string): Promise<boolean> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('wedding_weddings')
      .select('id, slug')
      .eq('slug', slug)
      .single()
    
    // If no data found, slug is available
    if (error && error.code === 'PGRST116') {
      return true
    }
    
    // If we're updating an existing wedding, check if the slug belongs to it
    if (data && excludeWeddingId) {
      return data.id === excludeWeddingId
    }
    
    // Slug exists and doesn't belong to current wedding
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
    slug = `${baseSlug}${counter}`
    counter++
    
    // Safety check to prevent infinite loop
    if (counter > 100) {
      // Generate a random suffix as fallback
      const randomSuffix = Date.now().toString(36)
      return `${baseSlug}-${randomSuffix}`
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
 * Get wedding by slug from Supabase
 */
export async function getWeddingBySlug(slug: string) {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('wedding_weddings')
      .select('*')
      .eq('slug', slug)
      .single()
    
    if (error) {
      console.error('Error fetching wedding by slug:', error)
      return null
    }
    
    return data
  } catch (error) {
    console.error('Error fetching wedding by slug:', error)
    return null
  }
}

/**
 * Suggest alternative slugs if the desired one is taken
 */
export function suggestAlternativeSlugs(baseSlug: string): string[] {
  const suggestions: string[] = []
  const year = new Date().getFullYear()
  const month = new Date().toLocaleDateString('en', { month: 'short' }).toLowerCase()
  
  suggestions.push(
    `${baseSlug}${year}`,
    `${baseSlug}-wedding`,
    `${baseSlug}-${month}`,
    `${baseSlug}-${month}${year}`,
    `${baseSlug}-celebration`
  )
  
  return suggestions.slice(0, 5)
}