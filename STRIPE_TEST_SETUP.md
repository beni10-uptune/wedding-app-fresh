# Stripe Test Mode Setup

## Getting Your Test Keys

1. **Log in to Stripe Dashboard**
   - Go to https://dashboard.stripe.com
   - Make sure you're in **TEST MODE** (toggle in the top right)

2. **Get Your Test API Keys**
   - Go to Developers → API keys
   - Copy your **test** keys (they start with `pk_test_` and `sk_test_`)
   - NOT the live keys (which start with `pk_live_` and `sk_live_`)

3. **Update .env.local**
   Replace the placeholder test keys in your `.env.local` with your actual test keys:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_TEST_KEY
   STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_TEST_SECRET_KEY
   ```

4. **Update Vercel Environment Variables**
   - Go to your Vercel project settings
   - Navigate to Settings → Environment Variables
   - Update these variables with your test keys:
     - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
     - `STRIPE_SECRET_KEY`
   - Redeploy for changes to take effect

## Test Credit Cards

Use these test card numbers in test mode:

### Successful Payment Cards:
- **4242 4242 4242 4242** - Visa (most common test card)
- **5555 5555 5555 4444** - Mastercard
- **3782 822463 10005** - American Express

### Cards for Testing Specific Scenarios:
- **4000 0000 0000 9995** - Card declined (insufficient funds)
- **4000 0000 0000 0002** - Card declined (generic)
- **4000 0000 0000 3220** - 3D Secure authentication required

### Test Card Details:
- **Expiry**: Any future date (e.g., 12/34)
- **CVC**: Any 3 digits (e.g., 123)
- **ZIP**: Any valid ZIP code (e.g., 12345)

## Testing Webhooks Locally

For local webhook testing, use Stripe CLI:

1. Install Stripe CLI:
   ```bash
   brew install stripe/stripe-cli/stripe
   ```

2. Login to Stripe:
   ```bash
   stripe login
   ```

3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe-webhook
   ```

4. Copy the webhook signing secret and add to `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
   ```

## Switching Between Test and Production

To switch between test and production modes:

1. **For Test Mode**: Use test keys (pk_test_, sk_test_)
2. **For Production**: Use live keys (pk_live_, sk_live_)

Never commit real keys to version control!