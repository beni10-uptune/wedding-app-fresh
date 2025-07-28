import { loadStripe } from '@stripe/stripe-js'
import { getEnvVar } from './env-validation'

// Initialize Stripe with validated environment variable
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

if (!stripePublishableKey || stripePublishableKey.includes('pk_test_') === false && stripePublishableKey.includes('pk_live_') === false) {
  console.warn('Invalid or missing Stripe publishable key')
}

const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null

export default stripePromise

// Stripe configuration
export const STRIPE_CONFIG = {
  // Price from environment variable or default
  amount: Number(process.env.NEXT_PUBLIC_WEDDING_PRICE) || 2500, // £25.00 in pence
  currency: 'gbp',
  productName: 'UpTune Wedding Music Platform',
  description: 'One-time payment for unlimited access to create and manage your wedding playlists'
}