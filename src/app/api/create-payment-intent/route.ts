import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { STRIPE_CONFIG } from '@/lib/stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil'
})

export async function POST(request: NextRequest) {
  try {
    const { weddingId, userId, email } = await request.json()

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