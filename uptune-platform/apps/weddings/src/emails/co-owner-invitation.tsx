import * as React from 'react'

interface CoOwnerInvitationEmailProps {
  partnerEmail: string
  inviterName: string
  coupleNames: string[]
  weddingDate: string
  venue?: string
  inviteLink: string
}

export function CoOwnerInvitationEmail({
  partnerEmail,
  inviterName,
  coupleNames,
  weddingDate,
  venue,
  inviteLink
}: CoOwnerInvitationEmailProps) {
  const partnerName = partnerEmail.split('@')[0].charAt(0).toUpperCase() + partnerEmail.split('@')[0].slice(1)
  
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
              Let's Plan Our Wedding Together! 💑
            </h1>

            <p style={text}>
              Hi {partnerName},
            </p>

            <p style={text}>
              {inviterName} has started planning your wedding music on UpTune and wants you to join as a co-owner!
            </p>

            <div style={detailsBox}>
              <p style={detailsText}>
                <strong>💍 Your Wedding Details</strong>
              </p>
              <p style={detailsText}>
                👰‍♀️🤵 {coupleNames.join(' & ')}
              </p>
              <p style={detailsText}>
                📅 {weddingDate}
              </p>
              {venue && (
                <p style={detailsText}>
                  📍 {venue}
                </p>
              )}
            </div>

            <p style={highlightText}>
              As a co-owner, you'll be able to:
            </p>
            
            <ul style={featureList}>
              <li style={featureItem}>✨ Build your wedding playlist together</li>
              <li style={featureItem}>🎵 Add and organize songs for each moment</li>
              <li style={featureItem}>👥 Manage guest song suggestions</li>
              <li style={featureItem}>📊 Track your music planning progress</li>
              <li style={featureItem}>🎉 Create the perfect soundtrack for your special day</li>
            </ul>

            <div style={buttonSection}>
              <a style={button} href={inviteLink}>
                💕 Join as Co-Owner
              </a>
            </div>

            <p style={smallText}>
              You'll need to create an account or sign in to accept this invitation.
            </p>

            <hr style={divider} />

            <p style={footerText}>
              This invitation was sent by {inviterName} using{' '}
              <a href="https://weddings.uptune.xyz" style={link}>
                UpTune for Weddings
              </a>
            </p>
            
            <p style={footerText}>
              Build your perfect wedding soundtrack together.
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

const highlightText: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#ffffff',
  margin: '24px 0 16px 0',
}

const featureList: React.CSSProperties = {
  margin: '0 0 24px 0',
  paddingLeft: '20px',
}

const featureItem: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: '22px',
  color: '#e5e5e5',
  margin: '8px 0',
}

const buttonSection: React.CSSProperties = {
  textAlign: 'center',
  margin: '32px 0',
}

const button: React.CSSProperties = {
  backgroundColor: '#ec4899',
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

export default CoOwnerInvitationEmail