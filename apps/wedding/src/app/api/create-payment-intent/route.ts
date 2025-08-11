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

    // Get customer country from request headers for currency detection
    const country = request.headers.get('cf-ipcountry') || 
                   request.headers.get('x-vercel-ip-country') || 
                   'GB'
    
    // Determine currency based on country
    let currency = 'gbp'
    let amount = STRIPE_CONFIG.amount
    
    // EU countries use EUR
    const euCountries = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE']
    
    if (euCountries.includes(country)) {
      currency = 'eur'
      // Convert GBP to EUR (approximate rate, you might want to use a real-time rate)
      amount = Math.round(amount * 1.17)
    } else if (country === 'US') {
      currency = 'usd'
      // Convert GBP to USD
      amount = Math.round(amount * 1.27)
    }

    // Create a payment intent with proper currency and payment methods
    // Note: Can't use both automatic_payment_methods and payment_method_types
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'always' // Allow redirect-based payment methods for EU
      },
      metadata: {
        weddingId,
        userId,
        email,
        country,
        originalCurrency: 'gbp',
        originalAmount: STRIPE_CONFIG.amount.toString()
      },
      description: STRIPE_CONFIG.description
    })

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      currency,
      amount 
    })
  } catch (error) {
    logError(error, { context: 'Payment intent creation failed', error })
    
    // More detailed error response for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to create payment intent', details: errorMessage },
      { status: 500 }
    )
  }
}