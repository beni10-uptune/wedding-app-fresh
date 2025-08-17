// Subscription tier definitions and limits

export const SUBSCRIPTION_TIERS = {
  FREE: {
    name: 'Free',
    maxSongs: 10, // Reduced from 25 to create urgency
    maxGuests: 3, // Reduced from 5 to create urgency
    maxExports: 0, // No exports on free tier
    features: {
      timeline: true,
      basicBuilder: true,
      guestSuggestions: true,
      coOwner: true, // Now FREE - partner collaboration is free
      export: false,
      curatedLibrary: false,
      unlimitedSongs: false,
      unlimitedGuests: false,
      prioritySupport: false
    }
  },
  PREMIUM: {
    name: 'Premium',
    maxSongs: -1, // Unlimited
    maxGuests: -1, // Unlimited
    maxExports: -1, // Unlimited
    features: {
      timeline: true,
      basicBuilder: true,
      guestSuggestions: true,
      coOwner: true,
      export: true,
      curatedLibrary: true,
      unlimitedSongs: true,
      unlimitedGuests: true,
      prioritySupport: true
    }
  }
}

export const UPGRADE_TRIGGERS = {
  SONG_LIMIT: {
    title: 'Song Limit Reached',
    message: 'You\'ve added 10 songs! Upgrade to add unlimited songs to your wedding soundtrack.',
    cta: 'Upgrade to Continue'
  },
  GUEST_LIMIT: {
    title: 'Guest Limit Reached',
    message: 'You\'ve shared with 3 guests! Upgrade to invite unlimited guests to collaborate.',
    cta: 'Upgrade for Unlimited Guests'
  },
  EXPORT_BLOCKED: {
    title: 'Export Your Playlists',
    message: 'Ready to share with your DJ? Upgrade to export to Spotify and download PDFs.',
    cta: 'Upgrade to Export'
  },
  // CO_OWNER_BLOCKED removed - partner collaboration is now free
  LIBRARY_BLOCKED: {
    title: 'Access Curated Songs',
    message: 'Get instant access to 500+ wedding-tested songs organized by moment.',
    cta: 'Upgrade for Song Library'
  }
}

// Helper function to check if user has premium
export function isPremium(paymentStatus?: string): boolean {
  return paymentStatus === 'paid'
}

// Helper function to get user's tier
export function getUserTier(paymentStatus?: string) {
  return isPremium(paymentStatus) ? SUBSCRIPTION_TIERS.PREMIUM : SUBSCRIPTION_TIERS.FREE
}