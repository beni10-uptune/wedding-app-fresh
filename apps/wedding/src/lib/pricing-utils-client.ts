export type Currency = 'GBP' | 'EUR' | 'USD'
export type CurrencySymbol = '£' | '€' | '$'

export interface PricingInfo {
  amount: number
  currency: Currency
  symbol: CurrencySymbol
  displayPrice: string
}

const CURRENCY_CONFIG = {
  GBP: { symbol: '£' as CurrencySymbol, amount: 25 },
  EUR: { symbol: '€' as CurrencySymbol, amount: 25 },
  USD: { symbol: '$' as CurrencySymbol, amount: 25 },
}

// Client-side pricing detection using browser APIs
export function getClientPricing(): PricingInfo {
  // Try to detect from browser
  let currency: Currency = 'USD'
  
  if (typeof window !== 'undefined') {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const locale = navigator.language
    
    // Simple detection based on locale
    if (locale.includes('en-GB') || timezone.includes('London')) {
      currency = 'GBP'
    } else if (locale.includes('de') || locale.includes('fr') || locale.includes('es') || 
               locale.includes('it') || locale.includes('nl') || timezone.includes('Europe/')) {
      // Check for European countries
      currency = 'EUR'
    }
  }
  
  const config = CURRENCY_CONFIG[currency]
  return {
    amount: config.amount,
    currency,
    symbol: config.symbol,
    displayPrice: `${config.symbol}${config.amount}`
  }
}