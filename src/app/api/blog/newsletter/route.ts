import { NextRequest, NextResponse } from 'next/server'
import { addDoc, collection, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Resend } from 'resend'
import { NewsletterWelcomeEmail } from '@/emails/newsletter-welcome'
import { logger } from '@/lib/logger'

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

    // Send welcome email if Resend is configured
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY)
        await resend.emails.send({
          from: 'UpTune Blog <blog@uptune.xyz>',
          to: [email],
          subject: 'Welcome to UpTune Wedding Music Tips! 🎵',
          react: NewsletterWelcomeEmail({ email })
        })
      } catch (emailError) {
        logger.error('Failed to send welcome email:', { error: emailError, email })
        // Don't fail the subscription if email fails
      }
    } else {
      logger.warn('RESEND_API_KEY not configured - welcome email not sent')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Error subscribing to newsletter:', { error })
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    )
  }
}