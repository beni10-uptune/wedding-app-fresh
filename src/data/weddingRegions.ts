export interface WeddingRegion {
  code: string
  name: string
  emoji: string
  defaultMoments: string[]
  traditions: string[]
  popularGenres: string[]
  currencyCode: string
  spotifyMarket: string
}

export const WEDDING_REGIONS: Record<string, WeddingRegion> = {
  'uk': {
    code: 'uk',
    name: 'United Kingdom',
    emoji: '🇬🇧',
    defaultMoments: ['ceremony', 'drinks-reception', 'wedding-breakfast', 'first-dance', 'evening-party'],
    traditions: ['Church hymns', 'Ceilidh dancing', 'Last dance'],
    popularGenres: ['Pop', 'Rock', 'Indie', 'Folk'],
    currencyCode: 'GBP',
    spotifyMarket: 'GB'
  },
  'nl': {
    code: 'nl',
    name: 'Netherlands',
    emoji: '🇳🇱',
    defaultMoments: ['ceremony-city-hall', 'ceremony-venue', 'dinner', 'party', 'midnight-snacks'],
    traditions: ['Polonaise', 'Dutch sing-alongs', 'Closing circle'],
    popularGenres: ['Nederlandstalig', 'Pop', 'Dance', 'Top 40'],
    currencyCode: 'EUR',
    spotifyMarket: 'NL'
  },
  'us-east': {
    code: 'us-east',
    name: 'USA - East Coast',
    emoji: '🇺🇸',
    defaultMoments: ['processional', 'recessional', 'cocktail-hour', 'reception-entrance', 'first-dance', 'parent-dances', 'open-dancing'],
    traditions: ['Hora (Jewish)', 'Money dance', 'Anniversary dance'],
    popularGenres: ['Pop', 'Rock', 'Motown', 'Hip-Hop'],
    currencyCode: 'USD',
    spotifyMarket: 'US'
  },
  'us-south': {
    code: 'us-south',
    name: 'USA - Southern',
    emoji: '🇺🇸',
    defaultMoments: ['prelude', 'processional', 'recessional', 'cocktail-hour', 'grand-entrance', 'first-dance', 'father-daughter', 'mother-son', 'dancing'],
    traditions: ['Line dancing', 'Sparkler send-off', 'Second line'],
    popularGenres: ['Country', 'Pop', 'Rock', 'Soul', 'Blues'],
    currencyCode: 'USD',
    spotifyMarket: 'US'
  },
  'ie': {
    code: 'ie',
    name: 'Ireland',
    emoji: '🇮🇪',
    defaultMoments: ['ceremony', 'drinks-reception', 'meal', 'first-dance', 'dancing', 'late-night'],
    traditions: ['Irish dancing', 'Sing-songs', 'Residents bar'],
    popularGenres: ['Irish Traditional', 'Pop', 'Rock', 'Country'],
    currencyCode: 'EUR',
    spotifyMarket: 'IE'
  },
  'au': {
    code: 'au',
    name: 'Australia',
    emoji: '🇦🇺',
    defaultMoments: ['ceremony', 'canapes', 'reception-entrance', 'first-dance', 'party'],
    traditions: ['Aussie BBQ', 'Beach ceremonies', 'Barefoot dancing'],
    popularGenres: ['Pop', 'Rock', 'Indie', 'Electronic'],
    currencyCode: 'AUD',
    spotifyMarket: 'AU'
  }
}

export const getRegionFromTimezone = (): string => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  
  if (timezone.includes('London')) return 'uk'
  if (timezone.includes('Amsterdam')) return 'nl'
  if (timezone.includes('Dublin')) return 'ie'
  if (timezone.includes('Sydney')) return 'au'
  if (timezone.includes('New_York')) return 'us-east'
  if (timezone.includes('Chicago') || timezone.includes('Houston')) return 'us-south'
  
  // Default to UK for now
  return 'uk'
}