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
  Hr
} from '@react-email/components'

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
    <Html>
      <Head />
      <Preview>
        {inviterName} invited you to co-plan your wedding on UpTune!
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
              Let's Plan Our Wedding Together! 💑
            </Heading>

            <Text style={text}>
              Hi {partnerName},
            </Text>

            <Text style={text}>
              {inviterName} has started planning your wedding music on UpTune and wants you to join as a co-owner!
            </Text>

            <Section style={detailsBox}>
              <Text style={detailsText}>
                <strong>💍 Your Wedding Details</strong>
              </Text>
              <Text style={detailsText}>
                👰‍♀️🤵 {coupleNames.join(' & ')}
              </Text>
              <Text style={detailsText}>
                📅 {weddingDate}
              </Text>
              {venue && (
                <Text style={detailsText}>
                  📍 {venue}
                </Text>
              )}
            </Section>

            <Text style={highlightText}>
              As a co-owner, you'll be able to:
            </Text>
            
            <ul style={featureList}>
              <li style={featureItem}>✨ Build your wedding playlist together</li>
              <li style={featureItem}>🎵 Add and organize songs for each moment</li>
              <li style={featureItem}>👥 Manage guest song suggestions</li>
              <li style={featureItem}>📊 Track your music planning progress</li>
              <li style={featureItem}>🎉 Create the perfect soundtrack for your special day</li>
            </ul>

            <Section style={buttonSection}>
              <Button style={button} href={inviteLink}>
                💕 Join as Co-Owner
              </Button>
            </Section>

            <Text style={smallText}>
              You'll need to create an account or sign in to accept this invitation.
            </Text>

            <Hr style={divider} />

            <Text style={footerText}>
              This invitation was sent by {inviterName} using{' '}
              <Link href="https://weddings.uptune.xyz" style={link}>
                UpTune for Weddings
              </Link>
            </Text>
            
            <Text style={footerText}>
              Build your perfect wedding soundtrack together.
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

const highlightText = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#ffffff',
  margin: '24px 0 16px 0',
}

const featureList = {
  margin: '0 0 24px 0',
  paddingLeft: '20px',
}

const featureItem = {
  fontSize: '14px',
  lineHeight: '22px',
  color: '#e5e5e5',
  margin: '8px 0',
}

const buttonSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#ec4899',
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

export default CoOwnerInvitationEmail