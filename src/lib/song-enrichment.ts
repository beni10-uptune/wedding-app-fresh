import { Song } from '@/types/wedding-v2'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface EnrichmentData {
  audioFeatures?: {
    tempo: number
    energy: number
    danceability: number
    valence: number
    acousticness: number
  }
  popularity?: number
  releaseDate?: string
  genres?: string[]
  weddingData?: {
    timesAdded: number
    averageRating?: number
    commonMoments: string[]
    lastUpdated: Date
  }
}

/**
 * Fetch additional data from Spotify for a song
 */
async function fetchSpotifyEnrichment(spotifyId: string): Promise<EnrichmentData> {
  try {
    const response = await fetch(`/api/spotify/enrich/${spotifyId}`)
    if (!response.ok) throw new Error('Failed to fetch enrichment data')
    return await response.json()
  } catch (error) {
    console.error('Error fetching Spotify enrichment:', error)
    return {}
  }
}

/**
 * Calculate which wedding moments this song fits based on its features
 */
function calculateMoments(song: Song, audioFeatures?: any): string[] {
  const moments: string[] = []
  
  if (!audioFeatures) {
    // Use basic heuristics
    if (song.title.toLowerCase().includes('love') || 
        song.title.toLowerCase().includes('marry')) {
      moments.push('first-dance')
    }
    if (song.energyLevel >= 4) {
      moments.push('dancing')
    }
    if (song.energyLevel <= 2) {
      moments.push('dinner')
    }
  } else {
    // Use audio features for better categorization
    const { tempo, energy, danceability, acousticness } = audioFeatures
    
    // Processional: 60-80 BPM, low-medium energy
    if (tempo >= 60 && tempo <= 80 && energy < 0.6) {
      moments.push('processional')
    }
    
    // First Dance: Romantic, slower tempo
    if (tempo < 100 && energy < 0.5 && acousticness > 0.3) {
      moments.push('first-dance')
    }
    
    // Dancing: High energy, high danceability
    if (energy > 0.7 && danceability > 0.7) {
      moments.push('dancing')
    }
    
    // Dinner: Low energy, acoustic
    if (energy < 0.4 && acousticness > 0.5) {
      moments.push('dinner')
    }
    
    // Last Dance: Medium energy, emotional
    if (energy > 0.4 && energy < 0.7 && tempo < 120) {
      moments.push('last-dance')
    }
  }
  
  // Default to general if no specific moments
  if (moments.length === 0) {
    moments.push('general')
  }
  
  return moments
}

/**
 * Determine generation appeal based on release date and artist
 */
function calculateGenerationAppeal(releaseDate?: string, artist?: string): string[] {
  const generations: string[] = []
  
  if (releaseDate) {
    const year = parseInt(releaseDate.substring(0, 4))
    
    if (year < 1980) {
      generations.push('boomer')
      if (year > 1970) generations.push('gen_x')
    } else if (year < 1995) {
      generations.push('gen_x')
      if (year > 1990) generations.push('millennial')
    } else if (year < 2010) {
      generations.push('millennial')
      if (year > 2005) generations.push('gen_z')
    } else {
      generations.push('gen_z')
      if (year < 2015) generations.push('millennial')
    }
  }
  
  // Add based on artist patterns
  if (artist) {
    const artistLower = artist.toLowerCase()
    if (artistLower.includes('beatles') || artistLower.includes('sinatra')) {
      if (!generations.includes('boomer')) generations.push('boomer')
    }
    if (artistLower.includes('swift') || artistLower.includes('eilish')) {
      if (!generations.includes('gen_z')) generations.push('gen_z')
    }
  }
  
  return generations.length > 0 ? generations : ['millennial'] // Default
}

/**
 * Enrich a song with additional data and store in community database
 */
export async function enrichAndStoreSong(
  basicSong: Partial<Song>,
  moment?: string
): Promise<Song> {
  // Fetch enrichment data from Spotify
  const enrichmentData = await fetchSpotifyEnrichment(basicSong.id!)
  
  // Calculate derived fields
  const moments = calculateMoments(basicSong as Song, enrichmentData.audioFeatures)
  if (moment && !moments.includes(moment)) {
    moments.push(moment) // Add the moment it was added to
  }
  
  const generationAppeal = calculateGenerationAppeal(
    enrichmentData.releaseDate,
    basicSong.artist
  )
  
  // Convert audio energy to our 1-5 scale
  const energyLevel = enrichmentData.audioFeatures?.energy
    ? Math.ceil(enrichmentData.audioFeatures.energy * 5) as 1 | 2 | 3 | 4 | 5
    : basicSong.energyLevel || 3
  
  // Create enriched song object
  const enrichedSong: Song = {
    id: basicSong.id!,
    title: basicSong.title!,
    artist: basicSong.artist!,
    album: basicSong.album,
    albumArt: basicSong.albumArt,
    albumImage: basicSong.albumImage,
    duration: basicSong.duration!,
    bpm: enrichmentData.audioFeatures?.tempo,
    energyLevel,
    explicit: basicSong.explicit || false,
    generationAppeal,
    genres: enrichmentData.genres || [],
    previewUrl: basicSong.previewUrl,
    spotifyUri: basicSong.spotifyUri || `spotify:track:${basicSong.id}`,
    moments,
    popularity: enrichmentData.popularity,
    releaseDate: enrichmentData.releaseDate,
    audioFeatures: enrichmentData.audioFeatures
  }
  
  // Store in community database
  await storeSongInCommunityDB(enrichedSong, moment)
  
  return enrichedSong
}

/**
 * Store song in Firestore community database
 */
async function storeSongInCommunityDB(song: Song, addedToMoment?: string) {
  try {
    const songRef = doc(db, 'communitySongs', song.id)
    const existingDoc = await getDoc(songRef)
    
    if (existingDoc.exists()) {
      // Update existing song with new data
      const existingData = existingDoc.data()
      const weddingData = existingData.weddingData || {
        timesAdded: 0,
        commonMoments: {}
      }
      
      // Increment usage count
      weddingData.timesAdded++
      
      // Track moment usage
      if (addedToMoment) {
        weddingData.commonMoments[addedToMoment] = 
          (weddingData.commonMoments[addedToMoment] || 0) + 1
      }
      
      await setDoc(songRef, {
        ...song,
        weddingData: {
          ...weddingData,
          lastUpdated: serverTimestamp()
        }
      }, { merge: true })
    } else {
      // Create new song entry
      await setDoc(songRef, {
        ...song,
        weddingData: {
          timesAdded: 1,
          commonMoments: addedToMoment ? { [addedToMoment]: 1 } : {},
          firstAdded: serverTimestamp(),
          lastUpdated: serverTimestamp()
        }
      })
    }
  } catch (error) {
    console.error('Error storing song in community DB:', error)
  }
}

/**
 * Get trending songs from community database
 */
export async function getTrendingSongs(limit = 10): Promise<Song[]> {
  // In a real implementation, this would query Firestore
  // ordered by timesAdded and filtered by recent additions
  return []
}