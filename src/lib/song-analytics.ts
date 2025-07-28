import { ALL_WEDDING_SONGS } from '@/data/spotify-wedding-songs'
import { Song } from '@/types/wedding-v2'

// Wedding-specific song analytics
interface SongAnalytics {
  popularity: number
  weddingScore: number  // Our custom metric
  generationAppeal: string[]
  moodTags: string[]
  tempoCategory: 'slow' | 'medium' | 'fast'
}

// Analyze songs for better recommendations
export function analyzeSongs() {
  const analytics = new Map<string, SongAnalytics>()
  
  ALL_WEDDING_SONGS.forEach(song => {
    // Estimate tempo category from duration and energy
    const tempoCategory = getTempoCategory(song)
    
    // Calculate wedding score based on multiple factors
    const weddingScore = calculateWeddingScore(song)
    
    // Determine mood tags
    const moodTags = getMoodTags(song)
    
    analytics.set(song.id, {
      popularity: Math.floor(Math.random() * 100), // TODO: Get from Spotify
      weddingScore,
      generationAppeal: song.generationAppeal || [],
      moodTags,
      tempoCategory
    })
  })
  
  return analytics
}

function getTempoCategory(song: Song): 'slow' | 'medium' | 'fast' {
  // Estimate based on energy level and typical patterns
  if (song.energyLevel <= 2) return 'slow'
  if (song.energyLevel >= 4) return 'fast'
  return 'medium'
}

function calculateWeddingScore(song: Song): number {
  let score = 50 // Base score
  
  // Boost for wedding-specific keywords
  const weddingKeywords = ['love', 'marry', 'forever', 'wedding', 'yours', 'heart', 'together']
  const titleLower = song.title.toLowerCase()
  weddingKeywords.forEach(keyword => {
    if (titleLower.includes(keyword)) score += 10
  })
  
  // Boost for clean songs
  if (!song.explicit) score += 10
  
  // Boost for appropriate moments
  if (song.moments?.includes('first-dance')) score += 15
  if (song.moments?.includes('processional')) score += 10
  
  // Normalize to 0-100
  return Math.min(100, score)
}

function getMoodTags(song: Song): string[] {
  const tags: string[] = []
  const titleLower = song.title.toLowerCase()
  
  // Romantic moods
  if (titleLower.includes('love') || titleLower.includes('heart')) {
    tags.push('romantic')
  }
  
  // Party moods
  if (titleLower.includes('dance') || titleLower.includes('party')) {
    tags.push('party')
  }
  
  // Classic moods
  if (song.artist.includes('Sinatra') || song.artist.includes('Beatles')) {
    tags.push('classic')
  }
  
  // Energy-based moods
  if (song.energyLevel >= 4) tags.push('upbeat')
  if (song.energyLevel <= 2) tags.push('mellow')
  
  return tags
}

// Get song recommendations based on context
export function getSmartRecommendations(
  moment: string,
  existingSongs: string[],
  preferences?: {
    era?: string[]
    energy?: number
    genres?: string[]
  }
): Song[] {
  const analytics = analyzeSongs()
  
  return ALL_WEDDING_SONGS
    .filter(song => {
      // Filter by moment
      if (moment && !song.moments?.includes(moment)) return false
      
      // Avoid duplicates
      if (existingSongs.includes(song.id)) return false
      
      // Apply preferences
      if (preferences?.energy) {
        const diff = Math.abs(song.energyLevel - preferences.energy)
        if (diff > 2) return false
      }
      
      return true
    })
    .sort((a, b) => {
      // Sort by wedding score
      const scoreA = analytics.get(a.id)?.weddingScore || 0
      const scoreB = analytics.get(b.id)?.weddingScore || 0
      return scoreB - scoreA
    })
    .slice(0, 20)
}

// Group songs by various criteria
export function groupSongsByEra() {
  const groups: Record<string, Song[]> = {
    'classics': [],      // Pre-1980
    '80s-90s': [],      // 1980-1999  
    '2000s': [],        // 2000-2009
    '2010s': [],        // 2010-2019
    'modern': []        // 2020+
  }
  
  // For now, estimate era from artist/title patterns
  ALL_WEDDING_SONGS.forEach(song => {
    // Classic artists
    if (['Elvis', 'Sinatra', 'Beatles'].some(a => song.artist.includes(a))) {
      groups.classics.push(song)
    }
    // Modern indicators
    else if (song.title.includes('2024') || song.title.includes('2025')) {
      groups.modern.push(song)
    }
    // Default to 2010s for now
    else {
      groups['2010s'].push(song)
    }
  })
  
  return groups
}

// Get trending songs (simulated for now)
export function getTrendingSongs(limit = 10): Song[] {
  // In reality, this would use actual play data
  return ALL_WEDDING_SONGS
    .filter(song => song.moments?.includes('first-dance'))
    .sort(() => Math.random() - 0.5)
    .slice(0, limit)
}