# Guest Invite System Documentation

## How It Works

### 1. Invitation Methods

#### A. Personal Invitations (with email)
- Host sends invitation from `/wedding/[id]/guests` page
- Creates an `invitation` document in Firestore
- Generates unique `inviteCode`
- Sends email with link: `/join/{inviteCode}`
- Can include personalized message
- **Counts against guest limit when invitation is created**

#### B. Direct Share Link
- Available at: `/join/{weddingId}`
- No invitation document created
- Anyone with link can join
- **Now counts against guest limit when guest joins**

### 2. Free Tier Limits (5 Guests)

The system now enforces the 5 guest limit in two ways:

1. **When creating invitations**: 
   - Checks current invitation count
   - Blocks new invitations if limit reached

2. **When guests join** (NEW):
   - Counts actual joined guests
   - Prevents joining if 5 guests already joined
   - Shows error message to guest

### 3. Guest Tracking

Each guest record includes:
- `name`: Guest's name
- `email`: Guest's email (optional)
- `joinedAt`: Timestamp
- `inviteCode`: The code used to join
- `joinMethod`: 'invitation' or 'share-link' (NEW)

### 4. Email Configuration

For emails to work, you need:
- `RESEND_API_KEY` in Vercel environment variables
- Domain verification in Resend dashboard
- From address configured (currently `hello@weddings.uptune.xyz`)

### 5. Testing Email Setup

To verify Resend is working:
1. Check Vercel environment variables for `RESEND_API_KEY`
2. Check Vercel function logs for any errors
3. Check Resend dashboard for sent emails
4. Verify domain is verified in Resend

## Important URLs

- **Personal invite**: `/join/{inviteCode}` (8-character code)
- **Direct share**: `/join/{weddingId}` (longer Firebase ID)
- **Guest management**: `/wedding/{weddingId}/guests`

## Free vs Premium

### Free Tier (5 guests max)
- Can create up to 5 invitations
- Up to 5 guests can join (total)
- Both invitation and share link guests count

### Premium (Unlimited)
- Unlimited invitations
- Unlimited guests can join
- No restrictions on either method