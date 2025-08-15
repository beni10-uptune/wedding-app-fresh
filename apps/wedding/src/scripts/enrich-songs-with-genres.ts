#!/usr/bin/env npx tsx
/**
 * Enrich Songs with Spotify Genres
 * Fetches genre information from Spotify API for all songs in our database
 * 
 * Usage: npx tsx src/scripts/enrich-songs-with-genres.ts
 */

import SpotifyWebApi from 'spotify-web-api-node';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { ALL_WEDDING_SONGS, SPOTIFY_WEDDING_SONGS } from '../data/spotify-wedding-songs';
import { Song } from '@/types/wedding-v2';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

// Initialize Spotify client
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
});

// We'll track audio features separately since Song type doesn't have this field
interface AudioFeatures {
  danceability: number;
  energy: number;
  valence: number;
  acousticness: number;
  tempo: number;
  loudness: number;
  speechiness: number;
  instrumentalness: number;
  liveness: number;
}

/**
 * Get access token from Spotify
 */
async function getSpotifyToken() {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    console.log('✅ Spotify access token obtained');
    spotifyApi.setAccessToken(data.body['access_token']);
    return data.body['access_token'];
  } catch (error) {
    console.error('❌ Error getting Spotify token:', error);
    throw error;
  }
}

/**
 * Process songs in batches to avoid rate limits
 */
async function processBatch<T>(
  items: T[],
  batchSize: number,
  processor: (batch: T[]) => Promise<void>,
  delayMs: number = 100
) {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    await processor(batch);
    
    // Progress indicator
    const progress = Math.min(i + batchSize, items.length);
    console.log(`Progress: ${progress}/${items.length} (${Math.round(progress/items.length * 100)}%)`);
    
    // Rate limiting delay
    if (i + batchSize < items.length) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
}

/**
 * Fetch track details including artist information
 */
async function fetchTrackDetails(trackIds: string[]) {
  try {
    const response = await spotifyApi.getTracks(trackIds);
    return response.body.tracks;
  } catch (error) {
    console.error('Error fetching track details:', error);
    return [];
  }
}

/**
 * Fetch audio features for tracks
 */
async function fetchAudioFeatures(trackIds: string[]) {
  try {
    const response = await spotifyApi.getAudioFeaturesForTracks(trackIds);
    return response.body.audio_features;
  } catch (error) {
    console.error('Error fetching audio features:', error);
    return [];
  }
}

/**
 * Fetch artist details including genres
 */
async function fetchArtistDetails(artistIds: string[]) {
  try {
    const response = await spotifyApi.getArtists(artistIds);
    return response.body.artists;
  } catch (error) {
    console.error('Error fetching artist details:', error);
    return [];
  }
}

/**
 * Infer genres based on audio features
 */
function inferGenresFromFeatures(features: AudioFeatures): string[] {
  const genres: string[] = [];
  
  if (!features) return genres;
  
  // Energy and danceability based inference
  if (features.energy > 0.8 && features.danceability > 0.7) {
    genres.push('party', 'dance');
  }
  if (features.energy > 0.7 && features.tempo > 120) {
    genres.push('upbeat');
  }
  
  // Acousticness based
  if (features.acousticness > 0.7) {
    genres.push('acoustic');
    if (features.energy < 0.4) {
      genres.push('folk', 'singer-songwriter');
    }
  }
  
  // Instrumentalness
  if (features.instrumentalness > 0.7) {
    genres.push('instrumental');
    if (features.energy < 0.3 && features.tempo < 80) {
      genres.push('ambient', 'classical');
    }
  }
  
  // Valence (happiness)
  if (features.valence > 0.7) {
    genres.push('happy', 'feel-good');
  } else if (features.valence < 0.3) {
    genres.push('melancholic', 'emotional');
  }
  
  // Danceability patterns
  if (features.danceability > 0.8) {
    if (features.tempo >= 120 && features.tempo <= 130) {
      genres.push('house', 'electronic');
    } else if (features.tempo >= 95 && features.tempo <= 115) {
      genres.push('hip-hop', 'r&b');
    }
  }
  
  // Speech patterns (rap/hip-hop detection)
  if (features.speechiness > 0.3) {
    genres.push('hip-hop', 'rap');
  } else if (features.speechiness < 0.05 && features.instrumentalness < 0.5) {
    genres.push('pop');
  }
  
  return [...new Set(genres)]; // Remove duplicates
}

/**
 * Map Spotify genres to our simplified genre categories
 */
function mapSpotifyGenres(spotifyGenres: string[]): string[] {
  const genreMap: Record<string, string[]> = {
    'pop': ['pop', 'dance pop', 'indie pop', 'electropop', 'pop rock', 'power pop'],
    'rock': ['rock', 'classic rock', 'hard rock', 'indie rock', 'alternative rock', 'soft rock'],
    'r&b': ['r&b', 'soul', 'neo soul', 'contemporary r&b', 'new jack swing'],
    'hip-hop': ['hip hop', 'rap', 'trap', 'conscious hip hop', 'old school hip hop'],
    'country': ['country', 'country pop', 'contemporary country', 'country rock', 'outlaw country'],
    'indie': ['indie', 'indie folk', 'indie rock', 'indie pop', 'lo-fi'],
    'electronic': ['electronic', 'edm', 'house', 'techno', 'trance', 'dubstep', 'electro'],
    'jazz': ['jazz', 'smooth jazz', 'jazz fusion', 'bebop', 'swing'],
    'soul': ['soul', 'neo soul', 'motown', 'funk', 'disco'],
    'classical': ['classical', 'orchestra', 'chamber music', 'opera', 'symphonic'],
    'acoustic': ['acoustic', 'singer-songwriter', 'folk', 'unplugged'],
    'latin': ['latin', 'reggaeton', 'salsa', 'bachata', 'latin pop', 'bossa nova'],
    'reggae': ['reggae', 'dancehall', 'dub', 'ska'],
    'funk': ['funk', 'disco', 'boogie', 'p-funk'],
    'blues': ['blues', 'electric blues', 'blues rock', 'chicago blues'],
    'metal': ['metal', 'heavy metal', 'death metal', 'black metal', 'power metal'],
    'punk': ['punk', 'punk rock', 'pop punk', 'hardcore punk', 'emo'],
    'folk': ['folk', 'contemporary folk', 'folk rock', 'traditional folk'],
    'gospel': ['gospel', 'contemporary gospel', 'christian', 'worship'],
    'world': ['world', 'afrobeat', 'celtic', 'k-pop', 'j-pop']
  };
  
  const mappedGenres: Set<string> = new Set();
  
  for (const spotifyGenre of spotifyGenres) {
    const lowerGenre = spotifyGenre.toLowerCase();
    
    // Check each of our categories
    for (const [category, patterns] of Object.entries(genreMap)) {
      if (patterns.some(pattern => lowerGenre.includes(pattern))) {
        mappedGenres.add(category);
      }
    }
  }
  
  // If no genres mapped, try to infer from genre name
  if (mappedGenres.size === 0 && spotifyGenres.length > 0) {
    for (const genre of spotifyGenres) {
      const words = genre.toLowerCase().split(/[\s-]+/);
      for (const word of words) {
        if (genreMap[word]) {
          mappedGenres.add(word);
        }
      }
    }
  }
  
  return Array.from(mappedGenres);
}

/**
 * Main enrichment function
 */
async function enrichSongsWithGenres() {
  console.log('🎵 Starting Spotify genre enrichment...\n');
  
  // Get Spotify token
  await getSpotifyToken();
  
  // Prepare songs for processing
  const songsToProcess = [...ALL_WEDDING_SONGS];
  const enrichedSongs: Song[] = [];
  const trackDataMap = new Map<string, any>();
  const artistDataMap = new Map<string, any>();
  const audioFeaturesMap = new Map<string, AudioFeatures>();
  
  console.log(`\n📊 Processing ${songsToProcess.length} songs...\n`);
  
  // Step 1: Fetch track details in batches
  console.log('Step 1: Fetching track details...');
  await processBatch(songsToProcess, 50, async (batch) => {
    const trackIds = batch.map(s => s.id).filter(id => id && id.length === 22);
    if (trackIds.length === 0) return;
    
    const tracks = await fetchTrackDetails(trackIds);
    tracks.forEach(track => {
      if (track) {
        trackDataMap.set(track.id, track);
      }
    });
  });
  
  // Step 2: Fetch audio features in batches
  console.log('\nStep 2: Fetching audio features...');
  await processBatch(songsToProcess, 100, async (batch) => {
    const trackIds = batch.map(s => s.id).filter(id => id && id.length === 22);
    if (trackIds.length === 0) return;
    
    const features = await fetchAudioFeatures(trackIds);
    features.forEach(feature => {
      if (feature) {
        audioFeaturesMap.set(feature.id, feature);
      }
    });
  });
  
  // Step 3: Collect unique artist IDs and fetch artist details
  console.log('\nStep 3: Fetching artist genres...');
  const uniqueArtistIds = new Set<string>();
  trackDataMap.forEach(track => {
    if (track.artists && track.artists.length > 0) {
      uniqueArtistIds.add(track.artists[0].id);
    }
  });
  
  const artistIds = Array.from(uniqueArtistIds);
  await processBatch(artistIds, 50, async (batch) => {
    const artists = await fetchArtistDetails(batch);
    artists.forEach(artist => {
      if (artist) {
        artistDataMap.set(artist.id, artist);
      }
    });
  });
  
  // Step 4: Enrich songs with collected data
  console.log('\nStep 4: Enriching songs with genre data...');
  for (const song of songsToProcess) {
    const enrichedSong: Song = { ...song };
    
    // Get track data
    const track = trackDataMap.get(song.id);
    if (track) {
      // Update basic info if needed
      enrichedSong.popularity = track.popularity;
      enrichedSong.explicit = track.explicit;
      enrichedSong.duration = Math.round(track.duration_ms / 1000);
      
      // Get artist genres
      if (track.artists && track.artists.length > 0) {
        const artist = artistDataMap.get(track.artists[0].id);
        if (artist && artist.genres) {
          // Map Spotify genres to our simplified categories
          enrichedSong.genres = mapSpotifyGenres(artist.genres);
        }
      }
    }
    
    // Get audio features and use them to infer genres if needed
    const features = audioFeaturesMap.get(song.id);
    if (features) {
      // Update energy level based on actual energy
      enrichedSong.energyLevel = Math.ceil(features.energy * 5) as 1 | 2 | 3 | 4 | 5;
      
      // Infer additional genres from audio features
      const inferredGenres = inferGenresFromFeatures(features);
      
      // Combine genres
      if (!enrichedSong.genres || enrichedSong.genres.length === 0) {
        enrichedSong.genres = inferredGenres;
      } else {
        // Add inferred genres that aren't already present
        const combined = new Set([...enrichedSong.genres, ...inferredGenres]);
        enrichedSong.genres = Array.from(combined);
      }
    }
    
    enrichedSongs.push(enrichedSong);
  }
  
  // Step 5: Generate the updated TypeScript file
  console.log('\nStep 5: Writing enriched data to file...');
  const outputPath = path.join(process.cwd(), 'src/data/spotify-wedding-songs-enriched.ts');
  
  const fileContent = `// Auto-generated from Spotify API enrichment
// Generated on ${new Date().toISOString()}
// Total songs: ${enrichedSongs.length}

import { Song } from '@/types/wedding-v2'

export const SPOTIFY_WEDDING_SONGS_ENRICHED: Record<string, Song[]> = {
${Object.entries(SPOTIFY_WEDDING_SONGS).map(([moment, songs]) => {
  const enrichedMomentSongs = songs.map(song => {
    const enriched = enrichedSongs.find(s => s.id === song.id) || song;
    return enriched;
  });
  
  return `  "${moment}": ${JSON.stringify(enrichedMomentSongs, null, 2).split('\n').join('\n  ')}`
}).join(',\n')}
};

export const ALL_WEDDING_SONGS_ENRICHED: Song[] = [
${enrichedSongs.map(song => '  ' + JSON.stringify(song, null, 2).split('\n').join('\n  ')).join(',\n')}
];

// Genre statistics
export const GENRE_STATS = {
  totalSongs: ${enrichedSongs.length},
  songsWithGenres: ${enrichedSongs.filter(s => s.genres && s.genres.length > 0).length},
  songsWithAudioFeatures: ${enrichedSongs.filter(s => s.audioFeatures).length},
  uniqueGenres: ${JSON.stringify(Array.from(new Set(enrichedSongs.flatMap(s => s.genres || []))))}
};
`;
  
  fs.writeFileSync(outputPath, fileContent);
  
  // Step 6: Generate summary report
  const stats = {
    totalSongs: enrichedSongs.length,
    songsWithGenres: enrichedSongs.filter(s => s.genres && s.genres.length > 0).length,
    songsWithAudioFeatures: enrichedSongs.filter(s => audioFeaturesMap.has(s.id)).length,
    genreDistribution: {} as Record<string, number>
  };
  
  // Count genre distribution
  enrichedSongs.forEach(song => {
    (song.genres || []).forEach(genre => {
      stats.genreDistribution[genre] = (stats.genreDistribution[genre] || 0) + 1;
    });
  });
  
  console.log('\n✅ Enrichment complete!\n');
  console.log('📊 Statistics:');
  console.log(`   Total songs: ${stats.totalSongs}`);
  console.log(`   Songs with genres: ${stats.songsWithGenres} (${Math.round(stats.songsWithGenres/stats.totalSongs * 100)}%)`);
  console.log(`   Songs with audio features: ${stats.songsWithAudioFeatures} (${Math.round(stats.songsWithAudioFeatures/stats.totalSongs * 100)}%)`);
  console.log('\n📈 Genre Distribution:');
  
  Object.entries(stats.genreDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([genre, count]) => {
      console.log(`   ${genre}: ${count} songs`);
    });
  
  console.log(`\n💾 Enriched data saved to: ${outputPath}`);
}

// Run the enrichment
enrichSongsWithGenres()
  .then(() => {
    console.log('\n🎉 All done! Your songs now have proper genre tags.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error during enrichment:', error);
    process.exit(1);
  });