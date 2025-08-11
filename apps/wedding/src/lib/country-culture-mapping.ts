/**
 * Country to Cultural Context Mapping
 * Maps countries to cultural contexts for song filtering
 */

import { CulturalContext } from '@/types/music-ai';

export function mapCountryToCulture(country: string): CulturalContext[] {
  const countryToCulture: Record<string, CulturalContext[]> = {
    // UK & Ireland
    'UK': [CulturalContext.WESTERN, CulturalContext.EUROPEAN],
    'Ireland': [CulturalContext.WESTERN, CulturalContext.EUROPEAN],
    
    // North America
    'US': [CulturalContext.WESTERN, CulturalContext.MULTICULTURAL],
    'Canada': [CulturalContext.WESTERN, CulturalContext.MULTICULTURAL],
    
    // Oceania
    'Australia': [CulturalContext.WESTERN],
    'New Zealand': [CulturalContext.WESTERN],
    
    // Latin America
    'Mexico': [CulturalContext.LATIN],
    'Brazil': [CulturalContext.LATIN],
    'Argentina': [CulturalContext.LATIN],
    'Colombia': [CulturalContext.LATIN],
    
    // Europe
    'France': [CulturalContext.EUROPEAN, CulturalContext.WESTERN],
    'Germany': [CulturalContext.EUROPEAN, CulturalContext.WESTERN],
    'Italy': [CulturalContext.EUROPEAN, CulturalContext.WESTERN],
    'Spain': [CulturalContext.EUROPEAN, CulturalContext.WESTERN, CulturalContext.LATIN],
    'Netherlands': [CulturalContext.EUROPEAN, CulturalContext.WESTERN],
    'Belgium': [CulturalContext.EUROPEAN, CulturalContext.WESTERN],
    'Switzerland': [CulturalContext.EUROPEAN, CulturalContext.WESTERN],
    'Austria': [CulturalContext.EUROPEAN, CulturalContext.WESTERN],
    'Poland': [CulturalContext.EUROPEAN],
    'Greece': [CulturalContext.EUROPEAN],
    
    // Asia
    'India': [CulturalContext.INDIAN, CulturalContext.ASIAN],
    'Pakistan': [CulturalContext.INDIAN, CulturalContext.ASIAN],
    'Bangladesh': [CulturalContext.INDIAN, CulturalContext.ASIAN],
    'Japan': [CulturalContext.ASIAN],
    'China': [CulturalContext.ASIAN],
    'South Korea': [CulturalContext.ASIAN],
    'Thailand': [CulturalContext.ASIAN],
    'Vietnam': [CulturalContext.ASIAN],
    'Philippines': [CulturalContext.ASIAN],
    
    // Middle East
    'Israel': [CulturalContext.JEWISH, CulturalContext.MIDDLE_EASTERN],
    'UAE': [CulturalContext.MIDDLE_EASTERN],
    'Saudi Arabia': [CulturalContext.MIDDLE_EASTERN],
    'Egypt': [CulturalContext.MIDDLE_EASTERN, CulturalContext.AFRICAN],
    'Turkey': [CulturalContext.MIDDLE_EASTERN, CulturalContext.EUROPEAN],
    
    // Africa
    'Nigeria': [CulturalContext.AFRICAN],
    'South Africa': [CulturalContext.AFRICAN, CulturalContext.WESTERN],
    'Kenya': [CulturalContext.AFRICAN],
    'Ghana': [CulturalContext.AFRICAN],
    'Ethiopia': [CulturalContext.AFRICAN],
    
    // Caribbean
    'Jamaica': [CulturalContext.CARIBBEAN],
    'Trinidad and Tobago': [CulturalContext.CARIBBEAN],
    'Barbados': [CulturalContext.CARIBBEAN],
    'Cuba': [CulturalContext.CARIBBEAN, CulturalContext.LATIN],
    'Dominican Republic': [CulturalContext.CARIBBEAN, CulturalContext.LATIN]
  };
  
  return countryToCulture[country] || [CulturalContext.MULTICULTURAL];
}

/**
 * Map region to preferred genres
 * Returns genre preferences based on country/region
 */
export function getRegionalGenrePreferences(country: string): string[] {
  const regionGenres: Record<string, string[]> = {
    // UK & Ireland
    'UK': ['pop', 'rock', 'indie', 'electronic', 'rnb', 'garage', 'grime'],
    'Ireland': ['pop', 'rock', 'indie', 'folk', 'traditional'],
    
    // North America
    'US': ['pop', 'hip-hop', 'rnb', 'country', 'rock', 'electronic'],
    'Canada': ['pop', 'rock', 'indie', 'hip-hop', 'country'],
    
    // Oceania
    'Australia': ['pop', 'rock', 'indie', 'electronic', 'country'],
    'New Zealand': ['pop', 'rock', 'indie', 'reggae'],
    
    // Latin America
    'Mexico': ['pop', 'reggaeton', 'latin', 'rock', 'mariachi'],
    'Brazil': ['pop', 'samba', 'bossa-nova', 'funk', 'electronic'],
    
    // Europe
    'France': ['pop', 'electronic', 'house', 'rock', 'chanson'],
    'Germany': ['pop', 'electronic', 'techno', 'rock', 'schlager'],
    'Italy': ['pop', 'rock', 'opera', 'electronic'],
    'Spain': ['pop', 'flamenco', 'reggaeton', 'rock', 'electronic'],
    'Netherlands': ['electronic', 'dance', 'pop', 'rock'],
    
    // Asia
    'India': ['bollywood', 'pop', 'classical', 'bhangra', 'electronic'],
    'Japan': ['j-pop', 'rock', 'electronic', 'jazz'],
    'South Korea': ['k-pop', 'hip-hop', 'electronic', 'rock'],
    
    // Caribbean
    'Jamaica': ['reggae', 'dancehall', 'ska', 'pop'],
    'Trinidad and Tobago': ['soca', 'calypso', 'pop', 'reggae']
  };
  
  return regionGenres[country] || ['pop', 'rock', 'electronic'];
}

/**
 * Get popular wedding songs by region
 * Returns commonly requested songs for weddings in specific regions
 */
export function getRegionalWeddingFavorites(country: string): string[] {
  const regionalFavorites: Record<string, string[]> = {
    'UK': [
      'Mr. Brightside - The Killers',
      'Wonderwall - Oasis',
      'Angels - Robbie Williams',
      'Sweet Caroline - Neil Diamond',
      'Come On Eileen - Dexys Midnight Runners'
    ],
    'Ireland': [
      'Galway Girl - Steve Earle',
      'The Foggy Dew - The Chieftains',
      'Whiskey in the Jar - Thin Lizzy',
      'Brown Eyed Girl - Van Morrison',
      'Fairytale of New York - The Pogues'
    ],
    'US': [
      'September - Earth, Wind & Fire',
      'Uptown Funk - Bruno Mars',
      'I Wanna Dance with Somebody - Whitney Houston',
      'Don\'t Stop Believin\' - Journey',
      'Shut Up and Dance - Walk the Moon'
    ],
    'Australia': [
      'Eagle Rock - Daddy Cool',
      'Horses - Daryl Braithwaite',
      'You\'re the Voice - John Farnham',
      'Down Under - Men at Work',
      'Khe Sanh - Cold Chisel'
    ]
  };
  
  return regionalFavorites[country] || [];
}