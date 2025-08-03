export const PRICING_CONFIG = {
  currency: 'gbp',
  plans: {
    free: {
      name: 'Free',
      price: 0,
      features: {
        songs: 50,
        guests: 5,
        exports: false,
        support: 'community',
        timeline: true,
        spotifyIntegration: true,
        pdfExport: false,
        advancedFeatures: false
      },
      description: 'Perfect for getting started'
    },
    paid: {
      name: 'Full Access',
      price: 25, // £25 one-time payment
      features: {
        songs: 'unlimited',
        guests: 'unlimited',
        exports: true,
        support: 'priority',
        timeline: true,
        spotifyIntegration: true,
        pdfExport: true,
        advancedFeatures: true
      },
      description: 'One-time payment for lifetime access'
    }
  },
  // Legacy pricing mentions for consistency
  legacy: {
    starter: {
      price: 12,
      songs: 200,
      note: 'No longer offered - redirects to paid plan'
    },
    professional: {
      price: 29,
      songs: 'unlimited',
      note: 'No longer offered - redirects to paid plan'
    }
  }
}

export const getPriceDisplay = (price: number, currency = 'gbp') => {
  const symbol = currency === 'gbp' ? '£' : '$'
  return `${symbol}${price}`
}

export const getFeatureDisplay = (feature: string | number | boolean) => {
  if (typeof feature === 'boolean') return feature ? 'Yes' : 'No'
  if (typeof feature === 'string') return feature.charAt(0).toUpperCase() + feature.slice(1)
  return feature.toString()
}