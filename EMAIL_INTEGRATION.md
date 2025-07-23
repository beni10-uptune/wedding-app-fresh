# Email Integration Guide

## Current State
The app currently creates invitations but doesn't send actual emails. To enable email sending, you'll need to integrate an email service provider.

## Recommended Email Providers

### 1. **SendGrid** (Recommended for production)
- Free tier: 100 emails/day
- Easy integration with Next.js
- Good deliverability rates
- Built-in templates

### 2. **Resend** (Great for developers)
- Free tier: 100 emails/day
- React Email support
- Simple API
- Good for transactional emails

### 3. **AWS SES** (Cost-effective at scale)
- Pay per email ($0.10 per 1000 emails)
- Requires domain verification
- More complex setup

## Implementation Steps

### Step 1: Choose a Provider
For UpTune, I recommend **Resend** for its simplicity and React Email support.

### Step 2: Sign Up and Get API Keys
1. Go to [resend.com](https://resend.com)
2. Create an account
3. Get your API key
4. Add to `.env.local`:
   ```
   RESEND_API_KEY
   =re_xxxxxxxxxxxx
   ```

### Step 3: Install Dependencies
```bash
npm install resend @react-email/components
```

### Step 4: Create Email Templates
Create `/src/emails/wedding-invitation.tsx`:
```typescript
import { Html, Button, Text } from '@react-email/components'

export function WeddingInvitationEmail({ 
  guestName, 
  coupleNames, 
  weddingDate, 
  inviteLink 
}: {
  guestName: string
  coupleNames: string[]
  weddingDate: string
  inviteLink: string
}) {
  return (
    <Html>
      <Text>Hi {guestName},</Text>
      <Text>
        {coupleNames.join(' & ')} would love you to contribute 
        to their wedding playlist!
      </Text>
      <Button href={inviteLink}>
        Suggest Songs
      </Button>
    </Html>
  )
}
```

### Step 5: Create Email API Route
Create `/src/app/api/send-invitation/route.ts`:
```typescript
import { Resend } from 'resend'
import { WeddingInvitationEmail } from '@/emails/wedding-invitation'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const { email, guestName, coupleNames, weddingDate, inviteLink } = 
    await request.json()

  const { data, error } = await resend.emails.send({
    from: 'UpTune <weddings@uptune.xyz>',
    to: [email],
    subject: `You're invited to suggest songs for ${coupleNames.join(' & ')}'s wedding!`,
    react: WeddingInvitationEmail({ 
      guestName, 
      coupleNames, 
      weddingDate, 
      inviteLink 
    })
  })

  if (error) {
    return Response.json({ error }, { status: 400 })
  }

  return Response.json({ data })
}
```

### Step 6: Update Invitation Creation
Modify the `createInvitation` function in `/src/lib/invitations.ts` to send emails:
```typescript
// After creating the invitation in Firestore
await fetch('/api/send-invitation', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: inviteData.email,
    guestName: inviteData.email.split('@')[0],
    coupleNames: wedding.coupleNames,
    weddingDate: wedding.weddingDate,
    inviteLink: `${window.location.origin}/join/${inviteCode}`
  })
})
```

## Email Templates Needed

1. **Guest Invitation** - When inviting guests to suggest songs
2. **Co-owner Invitation** - When inviting partner to collaborate
3. **Song Submission Confirmation** - When guest submits songs
4. **Wedding Reminder** - X days before wedding

## Domain Setup (for production)

1. Add your domain to email provider
2. Add DNS records (SPF, DKIM, DMARC)
3. Verify domain ownership
4. Update from address to use your domain

## Testing

1. Use provider's test mode during development
2. Test with personal emails first
3. Check spam folders
4. Monitor delivery rates

## Costs

- SendGrid: Free up to 100 emails/day, then $19.95/month
- Resend: Free up to 100 emails/day, then $20/month
- AWS SES: $0.10 per 1000 emails + data transfer

## Next Steps

1. Choose email provider based on your needs
2. Set up account and get API keys
3. Implement email templates
4. Test with a small group
5. Monitor delivery rates