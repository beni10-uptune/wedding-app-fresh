// Google Ads conversion tracking configuration
export const GOOGLE_ADS_ID = 'AW-17431723327'

// Conversion IDs
export const CONVERSIONS = {
  SIGN_UP: 'AW-17431723327/d46hCMqE5f4aEL_6i_hA',  // Sign-up conversion
  PURCHASE: 'AW-17431723327/ohB-CJnk8_4aEL_6i_hA', // Purchase conversion
} as const

// Helper to check if gtag is available
function isGtagAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.gtag === 'function'
}

// Track sign-up conversion
export function trackSignUpConversion(userId?: string) {
  if (!isGtagAvailable()) {
    return
  }

  // Check for cookie consent
  const consent = typeof window !== 'undefined' ? localStorage.getItem('cookieConsent') : null
  if (consent !== 'true') {
    return
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'conversion', {
      send_to: CONVERSIONS.SIGN_UP,
      value: 0, // Sign-up has no monetary value
      currency: 'GBP',
      transaction_id: userId || `signup_${Date.now()}`,
    })
  }

  // Sign-up conversion tracked
}

// Track purchase conversion with enhanced ecommerce data
export function trackPurchaseConversion(params: {
  transactionId: string
  value: number // in pounds
  currency?: string
  weddingName?: string
  userEmail?: string
}) {
  if (!isGtagAvailable()) {
    return
  }

  // Check for cookie consent
  const consent = typeof window !== 'undefined' ? localStorage.getItem('cookieConsent') : null
  if (consent !== 'true') {
    return
  }

  const { transactionId, value, currency = 'GBP', weddingName, userEmail } = params

  // Google Ads conversion
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'conversion', {
      send_to: CONVERSIONS.PURCHASE,
      value: value,
      currency: currency,
      transaction_id: transactionId,
    })
  }

  // Enhanced Ecommerce tracking for Google Analytics
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: value,
      currency: currency,
      items: [
        {
          item_id: 'uptune-wedding-platform',
          item_name: 'UpTune Wedding Music Platform',
          item_category: 'Wedding Planning',
          item_category2: 'Music',
          item_variant: 'one-time',
          price: value,
          quantity: 1,
        },
      ],
      // Additional parameters for better tracking
      wedding_name: weddingName,
      user_email: userEmail,
    })
  }

  // Purchase conversion tracked
}

// Initialize Google Ads (to be called after gtag is loaded)
export function initializeGoogleAds() {
  if (!isGtagAvailable()) {
    return
  }

  // Initialize Google Ads with the account ID
  if (typeof window.gtag === 'function') {
    window.gtag('config', GOOGLE_ADS_ID, {
      // Enable enhanced conversions if you have user data
      allow_enhanced_conversions: true,
    })
  }

  // Google Ads initialized
}