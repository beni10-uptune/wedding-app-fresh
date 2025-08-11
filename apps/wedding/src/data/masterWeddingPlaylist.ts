/**
 * Master Wedding Playlist Database
 * 
 * This is our comprehensive, curated collection of wedding songs.
 * Each song includes full metadata for filtering and display.
 * Songs are pre-categorized by moment, genre, country popularity, and energy level.
 */

import { Song } from '@/types/wedding-v2';

export interface MasterSong extends Song {
  popularIn: string[]; // Countries where this song is popular
  moments: string[]; // Which wedding moments this fits
  decade: string; // For era filtering
  moodTags: string[]; // Additional mood/vibe tags
  spotifyPopularity?: number; // 0-100 popularity score
  audioFeatures?: {
    danceability: number; // 0-1
    energy: number; // 0-1
    valence: number; // 0-1 (happiness)
    acousticness: number; // 0-1
    tempo: number; // BPM
  };
}

// Helper function to create a song with all required fields
function createSong(
  id: string,
  title: string,
  artist: string,
  album: string,
  {
    duration,
    bpm,
    energyLevel,
    genres,
    moments,
    popularIn,
    decade,
    moodTags = [],
    explicit = false,
    spotifyPopularity = 75,
    previewUrl = null,
    albumArt = null
  }: Partial<MasterSong> & { 
    duration: number; 
    bpm: number; 
    energyLevel: 1 | 2 | 3 | 4 | 5;
    genres: string[];
    moments: string[];
    popularIn: string[];
    decade: string;
  }
): MasterSong {
  // Generate placeholder album art if not provided
  const artUrl = albumArt || `https://source.unsplash.com/300x300/?music,${encodeURIComponent(artist)}`;
  
  return {
    id: `spotify:track:${id}`,
    title,
    artist,
    album,
    albumArt: artUrl,
    duration,
    bpm,
    energyLevel,
    explicit,
    generationAppeal: getGenerationAppeal(decade),
    genres,
    previewUrl,
    spotifyUri: `spotify:track:${id}`,
    moments,
    popularIn,
    decade,
    moodTags,
    spotifyPopularity,
    audioFeatures: {
      danceability: getDanceability(bpm, genres),
      energy: energyLevel / 5,
      valence: getValence(moodTags, energyLevel),
      acousticness: getAcousticness(genres),
      tempo: bpm
    }
  };
}

// Helper functions for audio features
function getGenerationAppeal(decade: string): ('boomer' | 'gen_x' | 'millennial' | 'gen_z')[] {
  switch(decade) {
    case '1960s':
    case '1970s':
      return ['boomer'];
    case '1980s':
      return ['gen_x', 'boomer'];
    case '1990s':
      return ['gen_x', 'millennial'];
    case '2000s':
      return ['millennial'];
    case '2010s':
      return ['millennial', 'gen_z'];
    case '2020s':
      return ['gen_z', 'millennial'];
    default:
      return ['millennial'];
  }
}

function getDanceability(bpm: number, genres: string[]): number {
  if (genres.includes('dance') || genres.includes('disco')) return 0.8;
  if (genres.includes('funk') || genres.includes('hip-hop')) return 0.75;
  if (bpm >= 120 && bpm <= 130) return 0.7;
  if (bpm >= 100 && bpm < 120) return 0.6;
  if (genres.includes('ballad') || genres.includes('classical')) return 0.3;
  return 0.5;
}

function getValence(moodTags: string[], energyLevel: number): number {
  if (moodTags.includes('happy') || moodTags.includes('celebration')) return 0.9;
  if (moodTags.includes('romantic')) return 0.7;
  if (moodTags.includes('emotional')) return 0.5;
  return Math.min(0.9, energyLevel * 0.2);
}

function getAcousticness(genres: string[]): number {
  if (genres.includes('acoustic') || genres.includes('folk')) return 0.8;
  if (genres.includes('classical')) return 0.7;
  if (genres.includes('electronic') || genres.includes('dance')) return 0.1;
  return 0.4;
}

/**
 * MASTER SONG DATABASE
 * Pre-populated with the best wedding songs, organized by moment
 */
export const MASTER_WEDDING_SONGS: MasterSong[] = [
  // ========== PRELUDE / GUEST ARRIVAL ==========
  createSong('3n3Ppam7vgaVa1iaRUc9Lp', 'A Thousand Years', 'Christina Perri', 'The Twilight Saga: Breaking Dawn', {
    duration: 295,
    bpm: 139,
    energyLevel: 2,
    genres: ['pop', 'contemporary'],
    moments: ['prelude', 'processional'],
    popularIn: ['US', 'UK', 'Australia', 'Canada'],
    decade: '2010s',
    moodTags: ['romantic', 'emotional', 'timeless'],
    albumArt: 'https://i.scdn.co/image/ab67616d0000b273ba7fe7dd76cd4307e57dd75f'
  }),
  
  createSong('1dGr1c8CrMLDpV6mPbImSI', 'Lover', 'Taylor Swift', 'Lover', {
    duration: 221,
    bpm: 68,
    energyLevel: 2,
    genres: ['pop', 'contemporary'],
    moments: ['prelude', 'firstDance'],
    popularIn: ['US', 'UK', 'Australia', 'Canada', 'Ireland'],
    decade: '2010s',
    moodTags: ['romantic', 'sweet', 'intimate'],
    albumArt: 'https://i.scdn.co/image/ab67616d0000b273e787cffec20aa2a396a61647'
  }),

  createSong('6lanRgr6wXibZr8KgzXxBl', 'All of Me', 'John Legend', 'Love in the Future', {
    duration: 269,
    bpm: 120,
    energyLevel: 2,
    genres: ['r&b', 'soul', 'pop'],
    moments: ['prelude', 'dinner', 'firstDance'],
    popularIn: ['US', 'UK', 'Australia', 'Canada', 'Ireland'],
    decade: '2010s',
    moodTags: ['romantic', 'emotional', 'dedication'],
    albumArt: 'https://i.scdn.co/image/ab67616d0000b273b5d4b4ed17ec86c4b3944af2'
  }),

  createSong('sunday-morning', 'Sunday Morning', 'Maroon 5', 'Songs About Jane', {
    duration: 240,
    bpm: 91,
    energyLevel: 2,
    genres: ['pop', 'rock'],
    moments: ['prelude', 'cocktail'],
    popularIn: ['US', 'UK', 'Australia'],
    decade: '2000s',
    moodTags: ['relaxed', 'happy', 'sunny']
  }),

  // ========== PROCESSIONAL ==========
  createSong('5IVuqXILoxVWvWEPm82Jxr', 'Canon in D', 'Johann Pachelbel', 'Classical Wedding Music', {
    duration: 343,
    bpm: 64,
    energyLevel: 2,
    genres: ['classical'],
    moments: ['processional', 'ceremony'],
    popularIn: ['US', 'UK', 'Australia', 'Canada', 'Ireland'],
    decade: 'classical',
    moodTags: ['traditional', 'elegant', 'timeless']
  }),

  createSong('1CS7Sd1u5tWkstBhpssyjP', 'Perfect', 'Ed Sheeran', '÷ (Divide)', {
    duration: 263,
    bpm: 95,
    energyLevel: 2,
    genres: ['pop'],
    moments: ['processional', 'firstDance'],
    popularIn: ['UK', 'Ireland', 'US', 'Australia', 'Canada'],
    decade: '2010s',
    moodTags: ['romantic', 'perfect', 'emotional'],
    albumArt: 'https://i.scdn.co/image/ab67616d0000b273ba025c59b0b8dfb88f0e8f0e'
  }),

  // ========== FIRST DANCE ==========
  createSong('1BxfuPKGuaTgP7aM0Bbdwr', 'Thinking Out Loud', 'Ed Sheeran', 'x', {
    duration: 281,
    bpm: 79,
    energyLevel: 2,
    genres: ['pop', 'soul'],
    moments: ['firstDance', 'dinner'],
    popularIn: ['UK', 'Ireland', 'US', 'Australia', 'Canada'],
    decade: '2010s',
    moodTags: ['romantic', 'slow dance', 'intimate'],
    albumArt: 'https://i.scdn.co/image/ab67616d0000b273860f6c5860b6a59855412b60'
  }),

  createSong('6PUIzFuCPMx1chpfOZnxgV', 'At Last', 'Etta James', 'At Last!', {
    duration: 181,
    bpm: 65,
    energyLevel: 2,
    genres: ['soul', 'jazz', 'blues'],
    moments: ['firstDance', 'dinner'],
    popularIn: ['US', 'UK'],
    decade: '1960s',
    moodTags: ['classic', 'romantic', 'timeless']
  }),

  createSong('make-you-feel', 'Make You Feel My Love', 'Adele', '19', {
    duration: 212,
    bpm: 72,
    energyLevel: 2,
    genres: ['pop', 'soul'],
    moments: ['firstDance', 'ceremony'],
    popularIn: ['UK', 'Ireland', 'US', 'Australia'],
    decade: '2000s',
    moodTags: ['emotional', 'powerful', 'romantic']
  }),

  // ========== DANCE FLOOR ==========
  createSong('32OlwWuMpZ6b0aN2RZOeMS', 'Uptown Funk', 'Mark Ronson ft. Bruno Mars', 'Uptown Special', {
    duration: 270,
    bpm: 115,
    energyLevel: 5,
    genres: ['funk', 'pop'],
    moments: ['danceFloor', 'party'],
    popularIn: ['US', 'UK', 'Australia', 'Canada', 'Ireland'],
    decade: '2010s',
    moodTags: ['party', 'fun', 'energetic'],
    albumArt: 'https://i.scdn.co/image/ab67616d0000b273b3744b3817e17e90113e93e8'
  }),

  createSong('6PCUP3dWmTjcTtXY02oFdT', 'September', 'Earth, Wind & Fire', 'The Best of Earth, Wind & Fire', {
    duration: 215,
    bpm: 126,
    energyLevel: 5,
    genres: ['funk', 'disco', 'soul'],
    moments: ['danceFloor', 'party'],
    popularIn: ['US', 'UK', 'Australia'],
    decade: '1970s',
    moodTags: ['celebration', 'classic', 'fun']
  }),

  createSong('0DiWol3AO6WpXZgp0goxAV', 'Dancing Queen', 'ABBA', 'Arrival', {
    duration: 230,
    bpm: 101,
    energyLevel: 4,
    genres: ['pop', 'disco'],
    moments: ['danceFloor', 'party'],
    popularIn: ['UK', 'Ireland', 'Australia', 'Sweden'],
    decade: '1970s',
    moodTags: ['classic', 'dance', 'celebration']
  }),

  createSong('2grjqUT0Lcpk6eB4jaqYap', 'I Wanna Dance with Somebody', 'Whitney Houston', 'Whitney', {
    duration: 295,
    bpm: 119,
    energyLevel: 5,
    genres: ['pop', 'dance'],
    moments: ['danceFloor', 'party'],
    popularIn: ['US', 'UK', 'Australia'],
    decade: '1980s',
    moodTags: ['party', 'dance', 'energetic']
  }),

  createSong('mr-brightside', 'Mr. Brightside', 'The Killers', 'Hot Fuss', {
    duration: 222,
    bpm: 148,
    energyLevel: 5,
    genres: ['rock', 'indie'],
    moments: ['danceFloor', 'party'],
    popularIn: ['UK', 'Ireland', 'US', 'Australia'],
    decade: '2000s',
    moodTags: ['anthem', 'singalong', 'energetic']
  }),

  createSong('sweet-caroline', 'Sweet Caroline', 'Neil Diamond', 'Sweet Caroline', {
    duration: 204,
    bpm: 128,
    energyLevel: 4,
    genres: ['pop', 'rock'],
    moments: ['danceFloor', 'party'],
    popularIn: ['US', 'UK', 'Ireland'],
    decade: '1960s',
    moodTags: ['singalong', 'classic', 'crowd-pleaser']
  }),

  createSong('dont-stop-believin', "Don't Stop Believin'", 'Journey', 'Escape', {
    duration: 251,
    bpm: 119,
    energyLevel: 4,
    genres: ['rock', '80s'],
    moments: ['danceFloor', 'lastDance'],
    popularIn: ['US', 'UK', 'Canada'],
    decade: '1980s',
    moodTags: ['anthem', 'singalong', 'classic']
  }),

  createSong('wonderwall', 'Wonderwall', 'Oasis', "(What's the Story) Morning Glory?", {
    duration: 258,
    bpm: 89,
    energyLevel: 3,
    genres: ['rock', 'britpop'],
    moments: ['danceFloor', 'singalong'],
    popularIn: ['UK', 'Ireland', 'Australia'],
    decade: '1990s',
    moodTags: ['anthem', 'singalong', 'british']
  }),

  // ========== DINNER ==========
  createSong('fly-me-moon', 'Fly Me to the Moon', 'Frank Sinatra', 'It Might as Well Be Swing', {
    duration: 148,
    bpm: 116,
    energyLevel: 2,
    genres: ['jazz', 'standards'],
    moments: ['dinner', 'cocktail'],
    popularIn: ['US', 'UK'],
    decade: '1960s',
    moodTags: ['classic', 'elegant', 'sophisticated']
  }),

  createSong('wonderful-tonight', 'Wonderful Tonight', 'Eric Clapton', 'Slowhand', {
    duration: 219,
    bpm: 96,
    energyLevel: 2,
    genres: ['rock', 'ballad'],
    moments: ['dinner', 'firstDance'],
    popularIn: ['UK', 'US'],
    decade: '1970s',
    moodTags: ['romantic', 'classic', 'gentle']
  }),

  // ========== COCKTAIL HOUR ==========
  createSong('valerie', 'Valerie', 'Amy Winehouse', 'Back to Black', {
    duration: 210,
    bpm: 123,
    energyLevel: 3,
    genres: ['soul', 'jazz'],
    moments: ['cocktail', 'dinner'],
    popularIn: ['UK', 'Ireland', 'US'],
    decade: '2000s',
    moodTags: ['groovy', 'sophisticated', 'cool']
  }),

  createSong('golden', 'Golden', 'Harry Styles', 'Fine Line', {
    duration: 208,
    bpm: 90,
    energyLevel: 3,
    genres: ['pop', 'rock'],
    moments: ['cocktail', 'prelude'],
    popularIn: ['UK', 'US', 'Australia'],
    decade: '2020s',
    moodTags: ['happy', 'sunny', 'feel-good']
  }),

  // ========== PARENT DANCES ==========
  createSong('my-girl', 'My Girl', 'The Temptations', 'The Temptations Sing Smokey', {
    duration: 163,
    bpm: 103,
    energyLevel: 3,
    genres: ['soul', 'motown'],
    moments: ['parentDances'],
    popularIn: ['US', 'UK'],
    decade: '1960s',
    moodTags: ['classic', 'sweet', 'father-daughter']
  }),

  createSong('isnt-she-lovely', "Isn't She Lovely", 'Stevie Wonder', 'Songs in the Key of Life', {
    duration: 392,
    bpm: 116,
    energyLevel: 3,
    genres: ['soul', 'r&b'],
    moments: ['parentDances'],
    popularIn: ['US', 'UK'],
    decade: '1970s',
    moodTags: ['joyful', 'celebration', 'father-daughter']
  }),

  // ========== LAST DANCE ==========
  createSong('time-of-my-life', 'Time of My Life', 'Bill Medley & Jennifer Warnes', 'Dirty Dancing', {
    duration: 287,
    bpm: 103,
    energyLevel: 4,
    genres: ['pop', '80s'],
    moments: ['lastDance'],
    popularIn: ['US', 'UK', 'Australia'],
    decade: '1980s',
    moodTags: ['romantic', 'finale', 'memorable']
  }),

  createSong('closing-time', 'Closing Time', 'Semisonic', 'Feeling Strangely Fine', {
    duration: 269,
    bpm: 92,
    energyLevel: 3,
    genres: ['rock', '90s'],
    moments: ['lastDance'],
    popularIn: ['US', 'UK', 'Canada'],
    decade: '1990s',
    moodTags: ['ending', 'bittersweet', 'finale']
  })
];

/**
 * Get songs filtered by criteria
 */
export function getFilteredSongs(
  moment?: string,
  country?: string,
  genres?: string[],
  energyLevel?: number
): MasterSong[] {
  let filtered = [...MASTER_WEDDING_SONGS];

  if (moment) {
    filtered = filtered.filter(song => song.moments.includes(moment));
  }

  if (country) {
    // Prioritize songs popular in the selected country
    filtered = filtered.sort((a, b) => {
      const aPopular = a.popularIn.includes(country) ? 1 : 0;
      const bPopular = b.popularIn.includes(country) ? 1 : 0;
      return bPopular - aPopular;
    });
  }

  if (genres && genres.length > 0) {
    filtered = filtered.filter(song => 
      song.genres.some(g => genres.includes(g))
    );
  }

  if (energyLevel) {
    // Filter within 1 level of requested energy
    filtered = filtered.filter(song => 
      Math.abs(song.energyLevel - energyLevel) <= 1
    );
  }

  return filtered;
}

/**
 * Get a complete wedding timeline with songs
 */
export function getDefaultWeddingTimeline(
  country: string = 'US',
  genres: string[] = []
): Record<string, MasterSong[]> {
  const timeline: Record<string, MasterSong[]> = {};
  
  const moments = [
    { id: 'prelude', count: 5 },
    { id: 'processional', count: 2 },
    { id: 'ceremony', count: 3 },
    { id: 'cocktail', count: 8 },
    { id: 'dinner', count: 6 },
    { id: 'firstDance', count: 1 },
    { id: 'parentDances', count: 2 },
    { id: 'danceFloor', count: 15 },
    { id: 'lastDance', count: 2 }
  ];

  moments.forEach(({ id, count }) => {
    const songs = getFilteredSongs(id, country, genres);
    timeline[id] = songs.slice(0, count);
    
    // If not enough songs, fill with any songs from that moment
    if (timeline[id].length < count) {
      const allMomentSongs = getFilteredSongs(id);
      timeline[id] = allMomentSongs.slice(0, count);
    }
  });

  return timeline;
}