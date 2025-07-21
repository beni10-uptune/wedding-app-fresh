import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { STRIPE_CONFIG } from '@/lib/stripe'
import { authenticateRequest, createAuthResponse } from '@/lib/auth-middleware'
import { paymentIntentSchema, validateData } from '@/lib/validations'
import { rateLimit, createRateLimitResponse } from '@/lib/rate-limit'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil'
})

export async function POST(request: NextRequest) {
  // Rate limiting
  const rateLimitResult = await rateLimit(request, 'payment')
  if (!rateLimitResult.success) {
    return createRateLimitResponse(rateLimitResult.reset || Date.now() + 60000)
  }

  // Authenticate the request
  const authResult = await authenticateRequest(request)
  
  if (!authResult.authenticated) {
    return createAuthResponse(authResult.error || 'Unauthorized', 401)
  }

  try {
    const body = await request.json()
    const userId = authResult.user!.uid // Use authenticated user's ID
    
    // Validate input
    const validation = validateData(paymentIntentSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.errors.format() },
        { status: 400 }
      )
    }
    
    const { weddingId, email } = validation.data

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: STRIPE_CONFIG.amount,
      currency: STRIPE_CONFIG.currency,
      metadata: {
        weddingId,
        userId,
        email
      },
      description: STRIPE_CONFIG.description
    })

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret 
    })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}