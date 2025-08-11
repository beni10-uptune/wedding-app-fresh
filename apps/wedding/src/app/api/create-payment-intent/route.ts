import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { STRIPE_CONFIG } from '@/lib/stripe'
import { authenticateRequest, createAuthResponse } from '@/lib/auth-middleware'
import { paymentIntentSchema, validateData } from '@/lib/validations'
import { rateLimit, createRateLimitResponse } from '@/lib/rate-limit'
import { logError } from '@/lib/logger'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia' as any
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
    // Stripe will automatically handle currency based on customer's location
    const paymentIntent = await stripe.paymentIntents.create({
      amount: STRIPE_CONFIG.amount,
      currency: 'gbp', // Base currency - Stripe can present in customer's local currency
      automatic_payment_methods: {
        enabled: true,
      },
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
    logError(error, { context: 'Payment intent creation failed' })
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}