import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Button,
  Link,
  Preview,
  Hr,
  Img
} from '@react-email/components'

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
    <Html>
      <Head />
      <Preview>
        {coupleNames.join(' & ')} would love you to contribute to their wedding playlist!
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <div style={logoWrapper}>
              <Text style={logoText}>♫ UpTune</Text>
              <Text style={tagline}>for Weddings</Text>
            </div>
          </Section>

          <Section style={contentSection}>
            <Heading style={heading}>
              You're Invited to Shape the Soundtrack! 🎵
            </Heading>

            <Text style={text}>
              Hi {guestName},
            </Text>

            <Text style={text}>
              {coupleNames.join(' & ')} are getting married and they want YOU to help create the perfect wedding playlist!
            </Text>

            {venue && (
              <Section style={detailsBox}>
                <Text style={detailsText}>
                  <strong>💍 {coupleNames.join(' & ')}'s Wedding</strong>
                </Text>
                <Text style={detailsText}>
                  📅 {weddingDate}
                </Text>
                <Text style={detailsText}>
                  📍 {venue}
                </Text>
              </Section>
            )}

            <Text style={promptText}>
              {personalizedPrompt || 
                "What songs get you on the dance floor? Share your favorite celebration songs, romantic classics, or party anthems that will make this wedding unforgettable!"
              }
            </Text>

            <Section style={buttonSection}>
              <Button style={button} href={inviteLink}>
                🎶 Suggest Your Songs
              </Button>
            </Section>

            <Text style={smallText}>
              No login required - just click and start adding your favorite songs!
            </Text>

            <Hr style={divider} />

            <Text style={footerText}>
              This invitation was sent by {coupleNames.join(' & ')} using{' '}
              <Link href="https://weddings.uptune.xyz" style={link}>
                UpTune for Weddings
              </Link>
            </Text>
            
            <Text style={footerText}>
              Create the perfect wedding soundtrack with help from your guests.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: '#0a0a0a',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
}

const logoSection = {
  padding: '32px 20px',
  textAlign: 'center' as const,
}

const logoWrapper = {
  display: 'inline-block',
}

const logoText = {
  fontSize: '24px',
  fontWeight: 'bold',
  background: 'linear-gradient(to right, #a855f7, #ec4899)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  margin: '0',
}

const tagline = {
  fontSize: '14px',
  color: '#a855f7',
  margin: '4px 0 0 0',
}

const contentSection = {
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  borderRadius: '12px',
  padding: '32px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
}

const heading = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#ffffff',
  margin: '0 0 24px 0',
  textAlign: 'center' as const,
}

const text = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#e5e5e5',
  margin: '0 0 16px 0',
}

const detailsBox = {
  backgroundColor: 'rgba(168, 85, 247, 0.1)',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
  border: '1px solid rgba(168, 85, 247, 0.3)',
}

const detailsText = {
  fontSize: '14px',
  color: '#ffffff',
  margin: '8px 0',
}

const promptText = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#ffffff',
  margin: '24px 0',
  padding: '20px',
  backgroundColor: 'rgba(236, 72, 153, 0.1)',
  borderRadius: '8px',
  border: '1px solid rgba(236, 72, 153, 0.3)',
}

const buttonSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#a855f7',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 32px',
  margin: '0 auto',
}

const smallText = {
  fontSize: '14px',
  color: '#a3a3a3',
  textAlign: 'center' as const,
  margin: '16px 0',
}

const divider = {
  borderColor: 'rgba(255, 255, 255, 0.1)',
  margin: '32px 0',
}

const footerText = {
  fontSize: '12px',
  color: '#737373',
  textAlign: 'center' as const,
  margin: '8px 0',
}

const link = {
  color: '#a855f7',
  textDecoration: 'underline',
}

export default WeddingInvitationEmail