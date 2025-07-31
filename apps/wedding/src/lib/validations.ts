import { z } from 'zod'

// User validation schemas
export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  displayName: z.string().min(2, 'Name must be at least 2 characters')
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

// Wedding validation schemas
export const weddingSchema = z.object({
  coupleName1: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  coupleName2: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  weddingDate: z.string().refine((date) => {
    const weddingDate = new Date(date)
    const today = new Date()
    return weddingDate > today
  }, 'Wedding date must be in the future'),
  venue: z.string()
    .min(2, 'Venue name must be at least 2 characters')
    .max(100, 'Venue name must be less than 100 characters'),
  city: z.string()
    .min(2, 'City must be at least 2 characters')
    .max(50, 'City must be less than 50 characters'),
  guestCount: z.number()
    .min(2, 'Must have at least 2 guests')
    .max(1000, 'Guest count seems too high'),
  weddingStyle: z.string().min(1, 'Please select a wedding style'),
  moments: z.array(z.string()).min(1, 'Select at least one moment'),
  playlistTemplate: z.string().optional()
})

// Song validation schemas
export const songSchema = z.object({
  spotify_id: z.string().min(1, 'Spotify ID is required'),
  title: z.string()
    .min(1, 'Song title is required')
    .max(200, 'Song title is too long'),
  artist: z.string()
    .min(1, 'Artist name is required')
    .max(200, 'Artist name is too long'),
  album: z.string().optional(),
  duration_ms: z.number()
    .min(0)
    .max(3600000, 'Song duration seems incorrect')
    .optional(),
  preview_url: z.string().url().nullable().optional(),
  image: z.string().url().optional()
})

// Playlist validation schemas
export const playlistSchema = z.object({
  name: z.string()
    .min(2, 'Playlist name must be at least 2 characters')
    .max(50, 'Playlist name must be less than 50 characters'),
  description: z.string()
    .max(200, 'Description must be less than 200 characters')
    .optional(),
  moment: z.string().min(1, 'Please select a moment'),
  targetSongCount: z.number()
    .min(1, 'Must have at least 1 song')
    .max(200, 'Playlist seems too large')
    .optional()
})

// Guest invitation schemas
export const invitationSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['partner', 'guest', 'family', 'friend', 'wedding-party']),
  personalizedPrompt: z.string()
    .max(500, 'Prompt is too long')
    .optional()
})

// Payment schemas
export const paymentIntentSchema = z.object({
  weddingId: z.string().min(1, 'Wedding ID is required'),
  email: z.string().email('Invalid email address')
})

// Helper function to validate data
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data)
  
  if (result.success) {
    return { success: true, data: result.data }
  } else {
    return { success: false, errors: result.error }
  }
}

// Format validation errors for display
export function formatValidationErrors(errors: z.ZodError): string[] {
  return errors.errors.map(err => {
    const field = err.path.join('.')
    return `${field}: ${err.message}`
  })
}