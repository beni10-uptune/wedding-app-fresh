import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

const emailCaptureSchema = z.object({
  email: z.string().email(),
  trigger: z.enum(['export', 'save', 'share']),
  totalSongs: z.number().optional(),
  metadata: z.object({
    userAgent: z.string().optional(),
    referrer: z.string().optional(),
    timestamp: z.string()
  }).optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = emailCaptureSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { email, trigger, totalSongs, metadata } = validation.data;

    // Store in Firestore
    const captureData = {
      email,
      trigger,
      totalSongs: totalSongs || 0,
      metadata: {
        ...metadata,
        capturedAt: new Date(),
        source: 'wedding-builder'
      },
      converted: false,
      createdAt: new Date()
    };

    await addDoc(collection(db, 'email_captures'), captureData);

    // If you have a webhook or email service, call it here
    // Example: await sendToEmailService(email, trigger);

    // Track conversion funnel
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'generate_lead', {
        currency: 'GBP',
        value: trigger === 'export' ? 10 : 5, // Assign value to leads
        source: trigger
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Email captured successfully'
    });

  } catch (error) {
    console.error('Error capturing email:', error);
    return NextResponse.json(
      { error: 'Failed to capture email' },
      { status: 500 }
    );
  }
}