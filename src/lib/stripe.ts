import { loadStripe } from '@stripe/stripe-js'

// Initialize Stripe - you'll need to add your publishable key to env
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default stripePromise

// Stripe configuration
export const STRIPE_CONFIG = {
  currency: 'gbp',
  amount: 2500, // £25 in pence
  productName: 'UpTune Wedding Music Platform',
  description: 'One-time payment for unlimited access to create and manage your wedding playlists'
}