import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { WeddingInvitationEmail } from '@/emails/wedding-invitation'
import { CoOwnerInvitationEmail } from '@/emails/co-owner-invitation'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, ...emailData } = body

    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured')
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      )
    }

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

  if (template === 'co-owner') {
    return new Response(
      CoOwnerInvitationEmail({
        partnerEmail: 'partner@example.com',
        inviterName: 'Sarah',
        coupleNames: ['Sarah', 'Michael'],
        weddingDate: 'Saturday, June 15, 2024',
        venue: 'The Grand Ballroom',
        inviteLink: 'https://example.com/join'
      }),
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    )
  }

  return new Response(
    WeddingInvitationEmail({
      guestEmail: 'guest@example.com',
      coupleNames: ['Sarah', 'Michael'],
      weddingDate: 'Saturday, June 15, 2024',
      venue: 'The Grand Ballroom',
      inviteLink: 'https://example.com/join',
      personalizedPrompt: 'What songs always get you on the dance floor?'
    }),
    {
      headers: {
        'Content-Type': 'text/html',
      },
    }
  )
}