import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { auth } from '@/lib/firebase-admin'
import { logger } from '@/lib/logger'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil'
})

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!auth) {
      return NextResponse.json({ error: 'Authentication service unavailable' }, { status: 503 })
    }

    const token = authHeader.split('Bearer ')[1]
    const decodedToken = await auth.verifyIdToken(token)
    const userId = decodedToken.uid

    const body = await request.json()
    const { weddingId, reason } = body

    if (!weddingId) {
      return NextResponse.json({ error: 'Wedding ID required' }, { status: 400 })
    }

    // Get wedding document
    const weddingDoc = await getDoc(doc(db, 'weddings', weddingId))
    if (!weddingDoc.exists()) {
      return NextResponse.json({ error: 'Wedding not found' }, { status: 404 })
    }

    const weddingData = weddingDoc.data()

    // Verify user owns this wedding
    if (!weddingData.owners?.includes(userId)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Check if already refunded
    if (weddingData.paymentStatus === 'refunded') {
      return NextResponse.json({ error: 'Already refunded' }, { status: 400 })
    }

    // Check payment intent exists
    if (!weddingData.paymentIntentId) {
      return NextResponse.json({ error: 'No payment found' }, { status: 400 })
    }

    // Create refund in Stripe
    const refund = await stripe.refunds.create({
      payment_intent: weddingData.paymentIntentId,
      reason: reason || 'requested_by_customer',
      metadata: {
        weddingId,
        userId,
        refundedAt: new Date().toISOString()
      }
    })

    // Update wedding document
    await updateDoc(doc(db, 'weddings', weddingId), {
      paymentStatus: 'refunded',
      refundId: refund.id,
      refundedAt: new Date(),
      refundReason: reason
    })

    logger.info('Refund processed', {
      weddingId,
      userId,
      refundId: refund.id,
      amount: refund.amount
    })

    return NextResponse.json({
      success: true,
      refundId: refund.id,
      status: refund.status,
      amount: refund.amount
    })
  } catch (error: any) {
    logger.error('Refund failed:', { error })

    if (error.type === 'StripeInvalidRequestError') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to process refund' },
      { status: 500 }
    )
  }
}