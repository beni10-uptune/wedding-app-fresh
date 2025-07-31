import * as React from 'react'

interface WeddingInvitationEmailProps {
  guestEmail: string
  coupleNames: string[]
  weddingDate: string
  venue?: string
  inviteLink: string
  personalizedPrompt?: string
  role?: string
}

export function WeddingInvitationEmail({
  guestEmail,
  coupleNames,
  weddingDate,
  venue,
  inviteLink,
  personalizedPrompt,
  role = 'guest'
}: WeddingInvitationEmailProps) {
  const guestName = guestEmail.split('@')[0].charAt(0).toUpperCase() + guestEmail.split('@')[0].slice(1)
  
  return (
    <html>
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <meta content="text/html; charset=UTF-8" httpEquiv="Content-Type" />
      </head>
      <body style={main}>
        <div style={container}>
          <div style={logoSection}>
            <div style={logoWrapper}>
              <p style={logoText}>♫ UpTune</p>
              <p style={tagline}>for Weddings</p>
            </div>
          </div>

          <div style={contentSection}>
            <h1 style={heading}>
              You're Invited to Shape the Soundtrack! 🎵
            </h1>

            <p style={text}>
              Hi {guestName},
            </p>

            <p style={text}>
              {coupleNames.join(' & ')} are getting married and they want YOU to help create the perfect wedding playlist!
            </p>

            {venue && (
              <div style={detailsBox}>
                <p style={detailsText}>
                  <strong>💍 {coupleNames.join(' & ')}'s Wedding</strong>
                </p>
                <p style={detailsText}>
                  📅 {weddingDate}
                </p>
                <p style={detailsText}>
                  📍 {venue}
                </p>
              </div>
            )}

            <p style={promptText}>
              {personalizedPrompt || 
                "What songs get you on the dance floor? Share your favorite celebration songs, romantic classics, or party anthems that will make this wedding unforgettable!"
              }
            </p>

            <div style={buttonSection}>
              <a style={button} href={inviteLink}>
                🎶 Suggest Your Songs
              </a>
            </div>

            <p style={smallText}>
              No login required - just click and start adding your favorite songs!
            </p>

            <hr style={divider} />

            <p style={footerText}>
              This invitation was sent by {coupleNames.join(' & ')} using{' '}
              <a href="https://weddings.uptune.xyz" style={link}>
                UpTune for Weddings
              </a>
            </p>
            
            <p style={footerText}>
              Create the perfect wedding soundtrack with help from your guests.
            </p>
          </div>
        </div>
      </body>
    </html>
  )
}

// Styles
const main: React.CSSProperties = {
  backgroundColor: '#0a0a0a',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}

const container: React.CSSProperties = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
}

const logoSection: React.CSSProperties = {
  padding: '32px 20px',
  textAlign: 'center',
}

const logoWrapper: React.CSSProperties = {
  display: 'inline-block',
}

const logoText: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 'bold',
  background: 'linear-gradient(to right, #a855f7, #ec4899)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  margin: '0',
}

const tagline: React.CSSProperties = {
  fontSize: '14px',
  color: '#a855f7',
  margin: '4px 0 0 0',
}

const contentSection: React.CSSProperties = {
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  borderRadius: '12px',
  padding: '32px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
}

const heading: React.CSSProperties = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#ffffff',
  margin: '0 0 24px 0',
  textAlign: 'center',
}

const text: React.CSSProperties = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#e5e5e5',
  margin: '0 0 16px 0',
}

const detailsBox: React.CSSProperties = {
  backgroundColor: 'rgba(168, 85, 247, 0.1)',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
  border: '1px solid rgba(168, 85, 247, 0.3)',
}

const detailsText: React.CSSProperties = {
  fontSize: '14px',
  color: '#ffffff',
  margin: '8px 0',
}

const promptText: React.CSSProperties = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#ffffff',
  margin: '24px 0',
  padding: '20px',
  backgroundColor: 'rgba(236, 72, 153, 0.1)',
  borderRadius: '8px',
  border: '1px solid rgba(236, 72, 153, 0.3)',
}

const buttonSection: React.CSSProperties = {
  textAlign: 'center',
  margin: '32px 0',
}

const button: React.CSSProperties = {
  backgroundColor: '#a855f7',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'inline-block',
  padding: '16px 32px',
  margin: '0 auto',
}

const smallText: React.CSSProperties = {
  fontSize: '14px',
  color: '#a3a3a3',
  textAlign: 'center',
  margin: '16px 0',
}

const divider: React.CSSProperties = {
  borderColor: 'rgba(255, 255, 255, 0.1)',
  margin: '32px 0',
}

const footerText: React.CSSProperties = {
  fontSize: '12px',
  color: '#737373',
  textAlign: 'center',
  margin: '8px 0',
}

const link: React.CSSProperties = {
  color: '#a855f7',
  textDecoration: 'underline',
}

export default WeddingInvitationEmail