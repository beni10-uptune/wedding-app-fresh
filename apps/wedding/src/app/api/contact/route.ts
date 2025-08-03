import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const CONTACT_EMAIL = 'ben@mindsparkdigitallabs.com'

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message, category } = await request.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured')
      return NextResponse.json(
        { error: 'Email service not configured. Please try again later.' },
        { status: 503 }
      )
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    // Map category to appropriate subject prefix
    const categoryPrefix = {
      general: '[General Inquiry]',
      support: '[Support Request]',
      privacy: '[Privacy Concern]',
      billing: '[Billing Issue]'
    }

    const prefix = categoryPrefix[category as keyof typeof categoryPrefix] || '[Contact Form]'
    const fullSubject = `${prefix} ${subject}`

    // Send email to support team
    await resend.emails.send({
      from: 'UpTune Support <hello@uptune.xyz>',
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: fullSubject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>From:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 10px 0;"><strong>Category:</strong> ${category}</p>
            <p style="margin: 10px 0;"><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h3 style="color: #666; margin-top: 0;">Message:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            This message was sent from the UpTune for Weddings contact form.
          </p>
        </div>
      `,
    })

    // Send confirmation email to user
    await resend.emails.send({
      from: 'UpTune Support <hello@uptune.xyz>',
      to: email,
      subject: 'We received your message - UpTune Support',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Thank you for contacting UpTune!</h2>
          
          <p style="line-height: 1.6;">Hi ${name},</p>
          
          <p style="line-height: 1.6;">
            We've received your message and our support team will get back to you within 24 hours.
          </p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #666; margin-top: 0;">Your Message:</h3>
            <p style="margin: 10px 0;"><strong>Subject:</strong> ${subject}</p>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          
          <p style="line-height: 1.6;">
            If you need immediate assistance, please check our 
            <a href="https://weddings.uptune.xyz/help" style="color: #8b5cf6;">Help Center</a>.
          </p>
          
          <p style="line-height: 1.6;">
            Best regards,<br>
            The UpTune Support Team
          </p>
          
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
          
          <p style="color: #666; font-size: 12px;">
            This is an automated response to confirm we received your message. 
            Please do not reply to this email.
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending contact form email:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}