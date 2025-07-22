import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { adminDb } from '@/lib/firebase-admin'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil'
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('Payment succeeded:', paymentIntent.id)
        
        // Extract metadata
        const { weddingId, userId, email } = paymentIntent.metadata

        if (!weddingId || !userId) {
          console.error('Missing metadata in payment intent')
          return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
        }

        try {
          // Update wedding payment status using admin SDK for server-side
          if (adminDb) {
            await adminDb.collection('weddings').doc(weddingId).update({
              paymentStatus: 'paid',
              paymentDate: new Date(),
              paymentIntentId: paymentIntent.id,
              paymentAmount: paymentIntent.amount,
              paymentEmail: email,
              updatedAt: new Date()
            })
          } else {
            // Fallback to client SDK
            await updateDoc(doc(db, 'weddings', weddingId), {
              paymentStatus: 'paid',
              paymentDate: new Date(),
              paymentIntentId: paymentIntent.id,
              paymentAmount: paymentIntent.amount,
              paymentEmail: email,
              updatedAt: new Date()
            })
          }

          console.log(`Wedding ${weddingId} marked as paid`)
        } catch (error) {
          console.error('Error updating wedding payment status:', error)
          // Don't return error to Stripe - we'll handle this separately
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('Payment failed:', paymentIntent.id)
        
        const { weddingId } = paymentIntent.metadata

        if (weddingId) {
          try {
            // Log the failure but don't update payment status
            console.error(`Payment failed for wedding ${weddingId}`)
          } catch (error) {
            console.error('Error handling payment failure:', error)
          }
        }
        break
      }

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        console.log('Checkout session completed:', session.id)
        
        // Handle checkout session if using Stripe Checkout
        if (session.metadata?.weddingId) {
          try {
            if (adminDb) {
              await adminDb.collection('weddings').doc(session.metadata.weddingId).update({
                paymentStatus: 'paid',
                paymentDate: new Date(),
                checkoutSessionId: session.id,
                paymentAmount: session.amount_total,
                paymentEmail: session.customer_email,
                updatedAt: new Date()
              })
            } else {
              await updateDoc(doc(db, 'weddings', session.metadata.weddingId), {
                paymentStatus: 'paid',
                paymentDate: new Date(),
                checkoutSessionId: session.id,
                paymentAmount: session.amount_total,
                paymentEmail: session.customer_email,
                updatedAt: new Date()
              })
            }
          } catch (error) {
            console.error('Error updating wedding from checkout session:', error)
          }
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

// Stripe webhooks must use raw body
export const runtime = 'nodejs'