import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { WeddingInvitationEmail } from '@/emails/wedding-invitation'
import { CoOwnerInvitationEmail } from '@/emails/co-owner-invitation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, ...emailData } = body

    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured - email will not be sent')
      // Return success but indicate email was not sent
      return NextResponse.json({ 
        success: true,
        emailSent: false,
        message: 'Invitation created but email not sent (email service not configured)' 
      })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    let emailResponse

    if (type === 'co-owner') {
      // Send co-owner invitation
      const { 
        partnerEmail, 
        inviterName, 
        coupleNames, 
        weddingDate, 
        venue, 
        inviteLink 
      } = emailData

      emailResponse = await resend.emails.send({
        from: 'UpTune Weddings <hello@weddings.uptune.xyz>',
        to: [partnerEmail],
        subject: `${inviterName} invited you to co-plan your wedding! 💑`,
        react: CoOwnerInvitationEmail({
          partnerEmail,
          inviterName,
          coupleNames,
          weddingDate,
          venue,
          inviteLink
        })
      })
    } else {
      // Send guest invitation
      const { 
        email, 
        coupleNames, 
        weddingDate, 
        venue, 
        inviteLink, 
        personalizedPrompt,
        role 
      } = emailData

      emailResponse = await resend.emails.send({
        from: 'UpTune Weddings <hello@weddings.uptune.xyz>',
        to: [email],
        subject: `You're invited to ${coupleNames.join(' & ')}'s wedding playlist! 🎵`,
        react: WeddingInvitationEmail({
          guestEmail: email,
          coupleNames,
          weddingDate,
          venue,
          inviteLink,
          personalizedPrompt,
          role
        })
      })
    }

    if (emailResponse.error) {
      console.error('Resend error:', emailResponse.error)
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 400 }
      )
    }

    return NextResponse.json({ 
      success: true,
      data: emailResponse.data 
    })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// For testing the email templates locally
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const template = searchParams.get('template')

  // For testing, we'll just return a simple HTML preview
  const html = template === 'co-owner' ? `
    <html>
      <body style="background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="max-width: 560px; margin: 0 auto; padding: 20px;">
          <h1 style="color: white;">Co-Owner Invitation Email Preview</h1>
          <p style="color: #e5e5e5;">This is a preview of the co-owner invitation email.</p>
          <p style="color: #a855f7;">To see the actual email, check your inbox after sending an invitation.</p>
        </div>
      </body>
    </html>
  ` : `
    <html>
      <body style="background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="max-width: 560px; margin: 0 auto; padding: 20px;">
          <h1 style="color: white;">Guest Invitation Email Preview</h1>
          <p style="color: #e5e5e5;">This is a preview of the guest invitation email.</p>
          <p style="color: #a855f7;">To see the actual email, check your inbox after sending an invitation.</p>
        </div>
      </body>
    </html>
  `
  
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}