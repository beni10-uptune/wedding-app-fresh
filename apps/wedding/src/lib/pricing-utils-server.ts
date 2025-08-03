import { headers } from 'next/headers'
import { Currency, CurrencySymbol } from './pricing-utils-client'

interface PricingInfo {
  amount: number
  currency: Currency
  symbol: CurrencySymbol
  displayPrice: string
}

// Country to currency mapping
const COUNTRY_CURRENCY_MAP: Record<string, Currency> = {
  // UK
  GB: 'GBP',
  UK: 'GBP',
  
  // Eurozone countries
  AT: 'EUR', // Austria
  BE: 'EUR', // Belgium
  CY: 'EUR', // Cyprus
  EE: 'EUR', // Estonia
  FI: 'EUR', // Finland
  FR: 'EUR', // France
  DE: 'EUR', // Germany
  GR: 'EUR', // Greece
  IE: 'EUR', // Ireland
  IT: 'EUR', // Italy
  LV: 'EUR', // Latvia
  LT: 'EUR', // Lithuania
  LU: 'EUR', // Luxembourg
  MT: 'EUR', // Malta
  NL: 'EUR', // Netherlands
  PT: 'EUR', // Portugal
  SK: 'EUR', // Slovakia
  SI: 'EUR', // Slovenia
  ES: 'EUR', // Spain
  
  // US
  US: 'USD',
  
  // Default all others to USD
}

const CURRENCY_CONFIG = {
  GBP: { symbol: '£' as CurrencySymbol, amount: 25 },
  EUR: { symbol: '€' as CurrencySymbol, amount: 25 },
  USD: { symbol: '$' as CurrencySymbol, amount: 25 },
}

// Get country from various sources
export async function getUserCountry(): Promise<string | null> {
  try {
    const headersList = await headers()
    
    // Try Vercel's geo headers first
    const country = headersList.get('x-vercel-ip-country') || 
                   headersList.get('cf-ipcountry') || // Cloudflare
                   headersList.get('x-country-code') // Generic
    
    return country?.toUpperCase() || null
  } catch {
    return null
  }
}

// Get currency based on country
export function getCurrencyForCountry(country: string | null): Currency {
  if (!country) return 'USD' // Default to USD
  return COUNTRY_CURRENCY_MAP[country] || 'USD'
}

// Get complete pricing info
export async function getDynamicPricing(): Promise<PricingInfo> {
  const country = await getUserCountry()
  const currency = getCurrencyForCountry(country)
  const config = CURRENCY_CONFIG[currency]
  
  return {
    amount: config.amount,
    currency,
    symbol: config.symbol,
    displayPrice: `${config.symbol}${config.amount}`
  }
}

// Format price for Stripe (in smallest currency unit)
export function getStripePriceForCurrency(currency: Currency): number {
  // All amounts are 25 in their respective currencies
  // Stripe expects amounts in cents/pence
  return CURRENCY_CONFIG[currency].amount * 100
}

// Get currency code for Stripe
export function getStripeCurrencyCode(currency: Currency): string {
  return currency.toLowerCase()
}