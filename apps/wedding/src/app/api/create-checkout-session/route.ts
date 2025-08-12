import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { authenticateRequest } from '@/lib/auth-middleware'
import { getStripePriceId } from '@/config/stripe-prices'
import { z } from 'zod'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const checkoutSchema = z.object({
  product: z.enum(['professional', 'djPack', 'printPack']),
  currency: z.enum(['GBP', 'USD', 'EUR']),
  weddingId: z.string(),
  successUrl: z.string().url(),
  cancelUrl: z.string().url()
})

export async function POST(request: NextRequest) {
  try {
    // Authenticate request
    const authResult = await authenticateRequest(request)
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse and validate request
    const body = await request.json()
    const validation = checkoutSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { product, currency, weddingId, successUrl, cancelUrl } = validation.data
    
    // Get the appropriate Stripe Price ID
    const priceId = getStripePriceId(product, currency)
    
    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: authResult.user.email || undefined,
      client_reference_id: weddingId,
      metadata: {
        userId: authResult.user.uid,
        weddingId: weddingId,
        product: product
      },
      // Enable automatic tax calculation if configured
      automatic_tax: {
        enabled: false // Set to true if you've configured tax in Stripe
      },
      // Allow promotion codes
      allow_promotion_codes: true,
      // Collect billing address for fraud prevention
      billing_address_collection: 'auto',
      // Set payment intent data for better tracking
      payment_intent_data: {
        metadata: {
          userId: authResult.user.uid,
          weddingId: weddingId,
          product: product
        }
      }
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url
    })

  } catch (error) {
    console.error('Error creating checkout session:', error)
    
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}