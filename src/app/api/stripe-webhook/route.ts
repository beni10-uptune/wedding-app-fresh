import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia'
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      
      // Update wedding payment status
      if (paymentIntent.metadata.weddingId) {
        try {
          await updateDoc(doc(db, 'weddings', paymentIntent.metadata.weddingId), {
            paymentStatus: 'paid',
            paymentId: paymentIntent.id,
            paymentAmount: paymentIntent.amount,
            paymentDate: new Date(),
            updatedAt: new Date()
          })
          console.log('Wedding payment status updated:', paymentIntent.metadata.weddingId)
        } catch (error) {
          console.error('Error updating wedding payment status:', error)
        }
      }
      break

    case 'payment_intent.payment_failed':
      const failedIntent = event.data.object as Stripe.PaymentIntent
      console.error('Payment failed for wedding:', failedIntent.metadata.weddingId)
      break

    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return NextResponse.json({ received: true })
}