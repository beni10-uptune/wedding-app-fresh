/**
 * Environment Variable Validation
 * Ensures all required environment variables are present at startup
 */

type EnvConfig = {
  // Firebase Client
  NEXT_PUBLIC_FIREBASE_API_KEY: string
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: string
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: string
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string
  NEXT_PUBLIC_FIREBASE_APP_ID: string
  
  // Stripe
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string
  
  // Spotify
  NEXT_PUBLIC_SPOTIFY_CLIENT_ID: string
  
  // App
  NEXT_PUBLIC_APP_URL: string
  NEXT_PUBLIC_WEDDING_PRICE: string
}

type ServerEnvConfig = {
  // Firebase Admin
  FIREBASE_PROJECT_ID?: string
  FIREBASE_CLIENT_EMAIL?: string
  FIREBASE_PRIVATE_KEY?: string
  
  // Stripe
  STRIPE_SECRET_KEY?: string
  STRIPE_WEBHOOK_SECRET?: string
  
  // Spotify
  SPOTIFY_CLIENT_ID?: string
  SPOTIFY_CLIENT_SECRET?: string
  
  // Email
  RESEND_API_KEY?: string
  
  // Redis (Optional)
  UPSTASH_REDIS_REST_URL?: string
  UPSTASH_REDIS_REST_TOKEN?: string
}

const requiredClientEnvVars: (keyof EnvConfig)[] = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'NEXT_PUBLIC_SPOTIFY_CLIENT_ID',
  'NEXT_PUBLIC_APP_URL',
  'NEXT_PUBLIC_WEDDING_PRICE'
]

const requiredServerEnvVars: (keyof ServerEnvConfig)[] = [
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'SPOTIFY_CLIENT_ID',
  'SPOTIFY_CLIENT_SECRET'
]

export function validateEnv() {
  const missingVars: string[] = []
  const warnings: string[] = []

  // Check client-side environment variables
  requiredClientEnvVars.forEach(key => {
    if (!process.env[key]) {
      missingVars.push(key)
    }
  })

  // Check server-side environment variables (only on server)
  if (typeof window === 'undefined') {
    requiredServerEnvVars.forEach(key => {
      if (!process.env[key]) {
        missingVars.push(key)
      }
    })

    // Check optional but recommended variables
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
      warnings.push('Firebase Admin SDK not configured. Some features may be limited.')
    }

    if (!process.env.RESEND_API_KEY) {
      warnings.push('Email sending not configured. Invitations will not be sent.')
    }

    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      warnings.push('Redis not configured. Rate limiting will be disabled.')
    }
  }

  // Check for placeholder values
  const placeholderPatterns = ['your_', 'xxx', 'placeholder', 'example']
  Object.entries(process.env).forEach(([key, value]) => {
    if (value && placeholderPatterns.some(pattern => value.toLowerCase().includes(pattern))) {
      warnings.push(`${key} appears to contain a placeholder value`)
    }
  })

  return {
    isValid: missingVars.length === 0,
    missingVars,
    warnings
  }
}

export function getEnvVar<K extends keyof EnvConfig | keyof ServerEnvConfig>(
  key: K
): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

export function getOptionalEnvVar<K extends keyof ServerEnvConfig>(
  key: K,
  defaultValue?: string
): string | undefined {
  return process.env[key] || defaultValue
}