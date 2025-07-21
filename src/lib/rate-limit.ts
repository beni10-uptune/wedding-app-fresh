import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { NextRequest, NextResponse } from 'next/server'

// Create Redis instance - you'll need to set these env vars in Vercel
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || ''
})

// Create different rate limiters for different endpoints
export const rateLimiters = {
  // API rate limiter: 100 requests per minute
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 m'),
    prefix: 'api'
  }),
  
  // Auth rate limiter: 5 attempts per 15 minutes
  auth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '15 m'),
    prefix: 'auth'
  }),
  
  // Spotify search: 30 requests per minute
  spotify: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, '1 m'),
    prefix: 'spotify'
  }),
  
  // Payment: 10 requests per hour
  payment: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 h'),
    prefix: 'payment'
  })
}

export async function rateLimit(
  request: NextRequest,
  limiter: keyof typeof rateLimiters = 'api'
) {
  // Skip rate limiting in development
  if (process.env.NODE_ENV === 'development') {
    return { success: true }
  }

  // Skip if Redis is not configured
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    console.warn('Rate limiting skipped: Redis not configured')
    return { success: true }
  }

  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwardedFor?.split(',')[0] ?? realIp ?? 'anonymous'
  
  try {
    const { success, limit, reset, remaining } = await rateLimiters[limiter].limit(ip)
    
    return {
      success,
      limit,
      reset,
      remaining,
      headers: {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': new Date(reset).toISOString()
      }
    }
  } catch (error) {
    console.error('Rate limiting error:', error)
    // Fail open - allow request if rate limiting fails
    return { success: true }
  }
}

export function createRateLimitResponse(reset: number) {
  return NextResponse.json(
    { 
      error: 'Too many requests', 
      retryAfter: Math.ceil((reset - Date.now()) / 1000) 
    },
    { 
      status: 429,
      headers: {
        'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString()
      }
    }
  )
}