/**
 * Stripe Price Configuration
 * 
 * Uses Stripe Price IDs for proper multi-currency support
 * These should be created in Stripe Dashboard and referenced here
 */

export const STRIPE_PRICES = {
  // Professional Plan - One-time payment
  professional: {
    // Production Stripe Price IDs - these are the actual IDs from Stripe
    GBP: process.env.NEXT_PUBLIC_STRIPE_PRICE_GBP || 'price_1QiwyNRxW50jhBp7WJWqFGE8',
    USD: process.env.NEXT_PUBLIC_STRIPE_PRICE_USD || 'price_1QiwyNRxW50jhBp7KO9sXwAZ', 
    EUR: process.env.NEXT_PUBLIC_STRIPE_PRICE_EUR || 'price_1QiwyNRxW50jhBp7ZCT9YQEV'
  },
  
  // Future add-ons
  addons: {
    djPack: {
      GBP: process.env.NEXT_PUBLIC_STRIPE_ADDON_DJ_GBP || 'price_gbp_dj_pack',
      USD: process.env.NEXT_PUBLIC_STRIPE_ADDON_DJ_USD || 'price_usd_dj_pack',
      EUR: process.env.NEXT_PUBLIC_STRIPE_ADDON_DJ_EUR || 'price_eur_dj_pack'
    },
    printPack: {
      GBP: process.env.NEXT_PUBLIC_STRIPE_ADDON_PRINT_GBP || 'price_gbp_print_pack',
      USD: process.env.NEXT_PUBLIC_STRIPE_ADDON_PRINT_USD || 'price_usd_print_pack',
      EUR: process.env.NEXT_PUBLIC_STRIPE_ADDON_PRINT_EUR || 'price_eur_print_pack'
    }
  }
}

/**
 * Get the appropriate price ID based on currency
 */
export function getStripePriceId(
  product: 'professional' | 'djPack' | 'printPack',
  currency: 'GBP' | 'USD' | 'EUR'
): string {
  if (product === 'professional') {
    return STRIPE_PRICES.professional[currency]
  }
  
  const addonKey = product === 'djPack' ? 'djPack' : 'printPack'
  return STRIPE_PRICES.addons[addonKey][currency]
}

/**
 * Detect user's currency based on location
 */
export function detectUserCurrency(): 'GBP' | 'USD' | 'EUR' {
  if (typeof window === 'undefined') return 'GBP'
  
  const userLocale = navigator.language
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  
  // UK
  if (userLocale.includes('en-GB') || userTimezone.includes('London')) {
    return 'GBP'
  }
  
  // US/Canada/Americas
  if (userLocale.includes('en-US') || 
      userLocale.includes('en-CA') ||
      userTimezone.includes('America') ||
      userTimezone.includes('Canada')) {
    return 'USD'
  }
  
  // Europe
  if (userTimezone.includes('Europe') ||
      userTimezone.includes('Paris') ||
      userTimezone.includes('Berlin') ||
      userTimezone.includes('Rome') ||
      userTimezone.includes('Madrid') ||
      userTimezone.includes('Amsterdam')) {
    return 'EUR'
  }
  
  // Default to GBP for others
  return 'GBP'
}

/**
 * Format price for display
 */
export function formatPrice(amount: number, currency: 'GBP' | 'USD' | 'EUR'): string {
  const symbols = {
    GBP: '£',
    USD: '$',
    EUR: '€'
  }
  
  return `${symbols[currency]}${amount}`
}

/**
 * Price amounts for display (should match Stripe Price amounts)
 */
export const PRICE_AMOUNTS = {
  professional: {
    GBP: 25,
    USD: 25,
    EUR: 25
  },
  addons: {
    djPack: {
      GBP: 9,
      USD: 12,
      EUR: 10
    },
    printPack: {
      GBP: 7,
      USD: 9,
      EUR: 8
    }
  }
}