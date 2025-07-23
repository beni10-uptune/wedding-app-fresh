import { NextRequest, NextResponse } from 'next/server'
import { addDoc, collection, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Add to newsletter subscribers collection
    await addDoc(collection(db, 'newsletterSubscribers'), {
      email,
      source: 'blog',
      subscribedAt: Timestamp.now(),
      status: 'active',
    })

    // TODO: Send welcome email via Resend
    // await sendWelcomeEmail(email)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error subscribing to newsletter:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    )
  }
}