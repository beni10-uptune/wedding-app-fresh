import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { adminDb } from '@/lib/firebase-admin'
import { logger, logError } from '@/lib/logger'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      logError(err, { context: 'Webhook signature verification failed' })
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        logger.info('Payment succeeded', { paymentIntentId: paymentIntent.id })
        
        // Extract metadata
        const { weddingId, userId, email } = paymentIntent.metadata

        if (!weddingId || !userId) {
          logger.error('Missing metadata in payment intent', { paymentIntentId: paymentIntent.id })
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

          logger.info('Wedding marked as paid', { weddingId, paymentIntentId: paymentIntent.id })
        } catch (error) {
          logError(error, { context: 'Error updating wedding payment status', weddingId })
          // Don't return error to Stripe - we'll handle this separately
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        logger.info('Payment failed', { paymentIntentId: paymentIntent.id })
        
        const { weddingId } = paymentIntent.metadata

        if (weddingId) {
          try {
            // Log the failure but don't update payment status
            logger.warn('Payment failed for wedding', { weddingId, paymentIntentId: paymentIntent.id })
          } catch (error) {
            logError(error, { context: 'Error handling payment failure', weddingId })
          }
        }
        break
      }

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        logger.info('Checkout session completed', { sessionId: session.id })
        
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
            
            // Purchase tracked server-side via logs/analytics pipeline
          } catch (error) {
            logError(error, { context: 'Error updating wedding from checkout session', weddingId: session.metadata.weddingId })
          }
        }
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        logger.info('Charge refunded', { chargeId: charge.id, refunded: charge.refunded })
        
        const paymentIntentId = charge.payment_intent as string
        
        // Find wedding by payment intent
        if (paymentIntentId) {
          try {
            // Query for wedding with this payment intent
            const weddingsRef = collection(db, 'weddings')
            const q = query(weddingsRef, where('paymentIntentId', '==', paymentIntentId))
            const snapshot = await getDocs(q)
            
            if (!snapshot.empty) {
              const weddingDoc = snapshot.docs[0]
              const weddingId = weddingDoc.id
              
              if (adminDb) {
                await adminDb.collection('weddings').doc(weddingId).update({
                  paymentStatus: 'refunded',
                  refundedAt: new Date(),
                  refundAmount: charge.amount_refunded,
                  updatedAt: new Date()
                })
              } else {
                await updateDoc(doc(db, 'weddings', weddingId), {
                  paymentStatus: 'refunded',
                  refundedAt: new Date(),
                  refundAmount: charge.amount_refunded,
                  updatedAt: new Date()
                })
              }

              logger.info('Wedding marked as refunded', { 
                weddingId, 
                refundAmount: charge.amount_refunded 
              })
            }
          } catch (error) {
            logError(error, { context: 'Error updating wedding refund status', paymentIntentId })
          }
        }
        break
      }

      default:
        logger.debug('Unhandled webhook event type', { eventType: event.type })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    logError(error, { context: 'Webhook handler failed' })
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

// Stripe webhooks must use raw body
export const runtime = 'nodejs'