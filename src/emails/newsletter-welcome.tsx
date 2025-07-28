import * as React from 'react'

interface NewsletterWelcomeEmailProps {
  email: string
}

export const NewsletterWelcomeEmail: React.FC<NewsletterWelcomeEmailProps> = ({
  email,
}) => {
  const previewText = `Welcome to UpTune's Wedding Music Newsletter!`

  return (
    <html>
      <head>
        <meta content="text/html; charset=UTF-8" httpEquiv="Content-Type" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{previewText}</title>
      </head>
      <body style={main}>
        <div style={container}>
          {/* Logo */}
          <div style={logoContainer}>
            <div style={logoGradient}>
              <span style={logoText}>♪</span>
            </div>
            <h1 style={brandName}>UpTune</h1>
          </div>

          {/* Welcome Section */}
          <div style={card}>
            <h2 style={heading}>Welcome to Your Weekly Wedding Music Tips! 🎵</h2>
            <p style={text}>
              Hi there!
            </p>
            <p style={text}>
              Thanks for joining our wedding music community! Every week, we'll send you:
            </p>
            
            <ul style={list}>
              <li style={listItem}>
                <strong style={purple}>Curated Playlists</strong> - Hand-picked songs for every wedding moment
              </li>
              <li style={listItem}>
                <strong style={purple}>Expert Tips</strong> - From professional wedding DJs and planners
              </li>
              <li style={listItem}>
                <strong style={purple}>Real Stories</strong> - How couples created their perfect soundtracks
              </li>
              <li style={listItem}>
                <strong style={purple}>Trending Songs</strong> - What's hot on dance floors right now
              </li>
            </ul>

            <p style={text}>
              While you're here, why not start planning your wedding music? It's free to try!
            </p>

            <div style={buttonContainer}>
              <a href="https://uptune.xyz/auth/signup" style={button}>
                Start Planning Your Music
              </a>
            </div>
          </div>

          {/* Recent Articles */}
          <div style={card}>
            <h3 style={subheading}>Popular Articles to Get You Started</h3>
            
            <a href="https://uptune.xyz/blog/complete-guide-wedding-music-planning" style={articleLink}>
              📖 The Complete Guide to Wedding Music Planning
            </a>
            
            <a href="https://uptune.xyz/blog/perfect-wedding-timeline" style={articleLink}>
              ⏰ How to Create the Perfect Wedding Timeline with Music
            </a>
            
            <a href="https://uptune.xyz/blog/10-ways-guest-music-selection" style={articleLink}>
              👥 10 Ways to Get Your Guests Involved in Music Selection
            </a>
          </div>

          {/* Footer */}
          <div style={footer}>
            <p style={footerText}>
              You're receiving this because you subscribed at uptune.xyz
            </p>
            <p style={footerText}>
              <a href="https://uptune.xyz/unsubscribe" style={link}>
                Unsubscribe
              </a>
              {' • '}
              <a href="https://uptune.xyz/privacy" style={link}>
                Privacy Policy
              </a>
            </p>
            <p style={footerText}>
              © 2025 UpTune. All rights reserved.
            </p>
          </div>
        </div>
      </body>
    </html>
  )
}

// Styles
const main = {
  backgroundColor: '#0a0a0a',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}

const container = {
  maxWidth: '560px',
  margin: '0 auto',
  padding: '20px',
}

const logoContainer = {
  textAlign: 'center' as const,
  marginBottom: '40px',
  marginTop: '40px',
}

const logoGradient = {
  width: '60px',
  height: '60px',
  background: 'linear-gradient(to right, #a855f7, #ec4899)',
  borderRadius: '12px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '16px',
}

const logoText = {
  fontSize: '32px',
  color: 'white',
}

const brandName = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#ffffff',
  margin: '0',
}

const card = {
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '12px',
  padding: '32px',
  marginBottom: '24px',
}

const heading = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#ffffff',
  marginTop: '0',
  marginBottom: '24px',
}

const subheading = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#ffffff',
  marginTop: '0',
  marginBottom: '20px',
}

const text = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#e5e5e5',
  marginBottom: '16px',
}

const list = {
  paddingLeft: '24px',
  marginBottom: '24px',
}

const listItem = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#e5e5e5',
  marginBottom: '12px',
}

const purple = {
  color: '#a855f7',
}

const buttonContainer = {
  textAlign: 'center' as const,
  marginTop: '32px',
}

const button = {
  display: 'inline-block',
  padding: '12px 32px',
  backgroundColor: '#a855f7',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  borderRadius: '8px',
  backgroundImage: 'linear-gradient(to right, #a855f7, #ec4899)',
}

const articleLink = {
  display: 'block',
  padding: '16px',
  marginBottom: '12px',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '8px',
  color: '#ffffff',
  textDecoration: 'none',
  fontSize: '16px',
  transition: 'all 0.2s',
}

const footer = {
  textAlign: 'center' as const,
  marginTop: '40px',
  paddingTop: '24px',
  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
}

const footerText = {
  fontSize: '14px',
  color: 'rgba(255, 255, 255, 0.6)',
  marginBottom: '8px',
}

const link = {
  color: '#a855f7',
  textDecoration: 'none',
}