import { Song } from '@/types/wedding-v2';

// Curated songs for different wedding moments
// Note: In production, these would be stored in Firestore with real Spotify IDs

export const CURATED_SONGS: Record<string, Song[]> = {
  // Prelude Songs - Guest Arrival
  prelude: [
    {
      id: 'spotify:track:3n3Ppam7vgaVa1iaRUc9Lp',
      title: 'A Thousand Years',
      artist: 'Christina Perri',
      album: 'The Twilight Saga: Breaking Dawn',
      duration: 295,
      bpm: 139,
      energyLevel: 2,
      explicit: false,
      generationAppeal: ['millennial', 'gen_z'],
      genres: ['pop', 'contemporary'],
      previewUrl: '',
      spotifyUri: 'spotify:track:3n3Ppam7vgaVa1iaRUc9Lp'
    },
    {
      id: 'spotify:track:1dGr1c8CrMLDpV6mPbImSI',
      title: 'Lover',
      artist: 'Taylor Swift',
      album: 'Lover',
      duration: 221,
      bpm: 68,
      energyLevel: 2,
      explicit: false,
      generationAppeal: ['millennial', 'gen_z'],
      genres: ['pop', 'contemporary'],
      previewUrl: '',
      spotifyUri: 'spotify:track:1dGr1c8CrMLDpV6mPbImSI'
    },
    {
      id: 'spotify:track:0yLdNVWF3Srea0uzk55zFn',
      title: 'Speechless',
      artist: 'Dan + Shay',
      album: 'Dan + Shay',
      duration: 211,
      bpm: 85,
      energyLevel: 2,
      explicit: false,
      generationAppeal: ['millennial', 'gen_x'],
      genres: ['country', 'pop'],
      previewUrl: '',
      spotifyUri: 'spotify:track:0yLdNVWF3Srea0uzk55zFn'
    },
    {
      id: 'spotify:track:6habFhsOp2NvshLv26DqMb',
      title: 'Marry Me',
      artist: 'Train',
      album: 'Save Me, San Francisco',
      duration: 214,
      bpm: 144,
      energyLevel: 3,
      explicit: false,
      generationAppeal: ['gen_x', 'millennial'],
      genres: ['pop', 'rock'],
      previewUrl: '',
      spotifyUri: 'spotify:track:6habFhsOp2NvshLv26DqMb'
    },
    {
      id: 'spotify:track:6lanRgr6wXibZr8KgzXxBl',
      title: 'All of Me',
      artist: 'John Legend',
      album: 'Love in the Future',
      duration: 269,
      bpm: 120,
      energyLevel: 2,
      explicit: false,
      generationAppeal: ['millennial', 'gen_x', 'gen_z'],
      genres: ['r&b', 'soul', 'pop'],
      previewUrl: '',
      spotifyUri: 'spotify:track:6lanRgr6wXibZr8KgzXxBl'
    }
  ],

  // Processional Songs
  processional: [
    {
      id: 'spotify:track:5IVuqXILoxVWvWEPm82Jxr',
      title: 'Canon in D',
      artist: 'Johann Pachelbel',
      album: 'Classical Wedding Music',
      duration: 343,
      bpm: 64,
      energyLevel: 2,
      explicit: false,
      generationAppeal: ['boomer', 'gen_x', 'millennial'],
      genres: ['classical'],
      previewUrl: '',
      spotifyUri: 'spotify:track:5IVuqXILoxVWvWEPm82Jxr'
    },
    {
      id: 'spotify:track:4fPBB44eDH71YohayI4eKV',
      title: 'Bridal Chorus (Here Comes The Bride)',
      artist: 'Richard Wagner',
      album: 'Wedding Classics',
      duration: 245,
      bpm: 69,
      energyLevel: 3,
      explicit: false,
      generationAppeal: ['boomer', 'gen_x'],
      genres: ['classical'],
      previewUrl: '',
      spotifyUri: 'spotify:track:4fPBB44eDH71YohayI4eKV'
    },
    {
      id: 'spotify:track:0BxE4FqsDD1Ot4YuBXwAPp',
      title: 'Heaven',
      artist: 'Kane Brown',
      album: 'Kane Brown',
      duration: 213,
      bpm: 144,
      energyLevel: 3,
      explicit: false,
      generationAppeal: ['millennial', 'gen_z'],
      genres: ['country', 'pop'],
      previewUrl: '',
      spotifyUri: 'spotify:track:0BxE4FqsDD1Ot4YuBXwAPp'
    },
    {
      id: 'spotify:track:1CS7Sd1u5tWkstBhpssyjP',
      title: 'Perfect',
      artist: 'Ed Sheeran',
      album: '÷ (Divide)',
      duration: 263,
      bpm: 95,
      energyLevel: 2,
      explicit: false,
      generationAppeal: ['millennial', 'gen_z', 'gen_x'],
      genres: ['pop'],
      previewUrl: '',
      spotifyUri: 'spotify:track:1CS7Sd1u5tWkstBhpssyjP'
    }
  ],

  // First Dance Songs
  firstDance: [
    {
      id: 'spotify:track:1BxfuPKGuaTgP7aM0Bbdwr',
      title: 'Thinking Out Loud',
      artist: 'Ed Sheeran',
      album: 'x',
      duration: 281,
      bpm: 79,
      energyLevel: 2,
      explicit: false,
      generationAppeal: ['millennial', 'gen_z'],
      genres: ['pop', 'soul'],
      previewUrl: '',
      spotifyUri: 'spotify:track:1BxfuPKGuaTgP7aM0Bbdwr'
    },
    {
      id: 'spotify:track:6PUIzFuCPMx1chpfOZnxgV',
      title: 'At Last',
      artist: 'Etta James',
      album: 'At Last!',
      duration: 181,
      bpm: 65,
      energyLevel: 2,
      explicit: false,
      generationAppeal: ['boomer', 'gen_x', 'millennial'],
      genres: ['soul', 'jazz', 'blues'],
      previewUrl: '',
      spotifyUri: 'spotify:track:6PUIzFuCPMx1chpfOZnxgV'
    },
    {
      id: 'spotify:track:468j3V5Qxw5oEqL5PhcYlz',
      title: 'Make You Feel My Love',
      artist: 'Adele',
      album: '19',
      duration: 212,
      bpm: 72,
      energyLevel: 2,
      explicit: false,
      generationAppeal: ['millennial', 'gen_x', 'gen_z'],
      genres: ['pop', 'soul'],
      previewUrl: '',
      spotifyUri: 'spotify:track:468j3V5Qxw5oEqL5PhcYlz'
    },
    {
      id: 'spotify:track:60nZcImufyMA1MKQY3dcCH',
      title: 'I Don\'t Want to Miss a Thing',
      artist: 'Aerosmith',
      album: 'Armageddon Soundtrack',
      duration: 299,
      bpm: 68,
      energyLevel: 3,
      explicit: false,
      generationAppeal: ['gen_x', 'boomer'],
      genres: ['rock', 'power ballad'],
      previewUrl: '',
      spotifyUri: 'spotify:track:60nZcImufyMA1MKQY3dcCH'
    },
    {
      id: 'spotify:track:3CeCwYWvdfXbZLXFhBrbnf',
      title: 'Stand by Me',
      artist: 'Ben E. King',
      album: 'Don\'t Play That Song!',
      duration: 178,
      bpm: 118,
      energyLevel: 2,
      explicit: false,
      generationAppeal: ['boomer', 'gen_x', 'millennial'],
      genres: ['soul', 'r&b'],
      previewUrl: '',
      spotifyUri: 'spotify:track:3CeCwYWvdfXbZLXFhBrbnf'
    }
  ],

  // Dance Floor Songs
  danceFloor: [
    {
      id: 'spotify:track:3BxWKCI06eQ5Od8TY2JBeA',
      title: 'Uptown Funk',
      artist: 'Mark Ronson ft. Bruno Mars',
      album: 'Uptown Special',
      duration: 270,
      bpm: 115,
      energyLevel: 5,
      explicit: false,
      generationAppeal: ['millennial', 'gen_z', 'gen_x'],
      genres: ['funk', 'pop'],
      previewUrl: '',
      spotifyUri: 'spotify:track:3BxWKCI06eQ5Od8TY2JBeA'
    },
    {
      id: 'spotify:track:6PCUP3dWmTjcTtXY02oFdT',
      title: 'September',
      artist: 'Earth, Wind & Fire',
      album: 'The Best of Earth, Wind & Fire, Vol. 1',
      duration: 215,
      bpm: 126,
      energyLevel: 5,
      explicit: false,
      generationAppeal: ['boomer', 'gen_x', 'millennial'],
      genres: ['funk', 'disco', 'soul'],
      previewUrl: '',
      spotifyUri: 'spotify:track:6PCUP3dWmTjcTtXY02oFdT'
    },
    {
      id: 'spotify:track:32OlwWuMpZ6b0aN2RZOeMS',
      title: 'Shut Up and Dance',
      artist: 'WALK THE MOON',
      album: 'TALKING IS HARD',
      duration: 199,
      bpm: 128,
      energyLevel: 5,
      explicit: false,
      generationAppeal: ['millennial', 'gen_z'],
      genres: ['pop', 'rock'],
      previewUrl: '',
      spotifyUri: 'spotify:track:32OlwWuMpZ6b0aN2RZOeMS'
    },
    {
      id: 'spotify:track:1WkMMavIMc4JZ8cfMmxHkI',
      title: 'CAN\'T STOP THE FEELING!',
      artist: 'Justin Timberlake',
      album: 'Trolls (Original Motion Picture Soundtrack)',
      duration: 236,
      bpm: 113,
      energyLevel: 5,
      explicit: false,
      generationAppeal: ['millennial', 'gen_z', 'gen_x'],
      genres: ['pop', 'dance'],
      previewUrl: '',
      spotifyUri: 'spotify:track:1WkMMavIMc4JZ8cfMmxHkI'
    },
    {
      id: 'spotify:track:0DiWol3AO6WpXZgp0goxAV',
      title: 'Dancing Queen',
      artist: 'ABBA',
      album: 'Arrival',
      duration: 230,
      bpm: 101,
      energyLevel: 4,
      explicit: false,
      generationAppeal: ['boomer', 'gen_x', 'millennial'],
      genres: ['pop', 'disco'],
      previewUrl: '',
      spotifyUri: 'spotify:track:0DiWol3AO6WpXZgp0goxAV'
    },
    {
      id: 'spotify:track:7tFiyTwD0nx5a1eklYtX2J',
      title: 'Levitating',
      artist: 'Dua Lipa',
      album: 'Future Nostalgia',
      duration: 203,
      bpm: 103,
      energyLevel: 5,
      explicit: false,
      generationAppeal: ['gen_z', 'millennial'],
      genres: ['pop', 'dance'],
      previewUrl: '',
      spotifyUri: 'spotify:track:7tFiyTwD0nx5a1eklYtX2J'
    },
    {
      id: 'spotify:track:2grjqUT0Lcpk6eB4jaqYap',
      title: 'I Wanna Dance with Somebody',
      artist: 'Whitney Houston',
      album: 'Whitney',
      duration: 295,
      bpm: 119,
      energyLevel: 5,
      explicit: false,
      generationAppeal: ['gen_x', 'millennial', 'boomer'],
      genres: ['pop', 'dance'],
      previewUrl: '',
      spotifyUri: 'spotify:track:2grjqUT0Lcpk6eB4jaqYap'
    }
  ],

  // Dinner Music
  dinner: [
    {
      id: 'spotify:track:0tgVpDi06FyKpA1z0VMD4v',
      title: 'The Way You Look Tonight',
      artist: 'Frank Sinatra',
      album: 'Sinatra 80th: All the Best',
      duration: 191,
      bpm: 174,
      energyLevel: 2,
      explicit: false,
      generationAppeal: ['boomer', 'gen_x'],
      genres: ['jazz', 'standards'],
      previewUrl: '',
      spotifyUri: 'spotify:track:0tgVpDi06FyKpA1z0VMD4v'
    },
    {
      id: 'spotify:track:19KlZwqlT3fguP2BeHF1Q1',
      title: 'Fly Me to the Moon',
      artist: 'Michael Bublé',
      album: 'To Be Loved',
      duration: 146,
      bpm: 119,
      energyLevel: 2,
      explicit: false,
      generationAppeal: ['gen_x', 'millennial'],
      genres: ['jazz', 'pop'],
      previewUrl: '',
      spotifyUri: 'spotify:track:19KlZwqlT3fguP2BeHF1Q1'
    },
    {
      id: 'spotify:track:5b8Ai5xHFoKZ8IYoLh9m2j',
      title: 'L-O-V-E',
      artist: 'Nat King Cole',
      album: 'L-O-V-E',
      duration: 152,
      bpm: 91,
      energyLevel: 2,
      explicit: false,
      generationAppeal: ['boomer', 'gen_x'],
      genres: ['jazz', 'standards'],
      previewUrl: '',
      spotifyUri: 'spotify:track:5b8Ai5xHFoKZ8IYoLh9m2j'
    },
    {
      id: 'spotify:track:26AYbQB7ahRdaL0KKJqZIZ',
      title: 'Beyond The Sea',
      artist: 'Bobby Darin',
      album: 'That\'s All',
      duration: 174,
      bpm: 134,
      energyLevel: 3,
      explicit: false,
      generationAppeal: ['boomer', 'gen_x'],
      genres: ['jazz', 'swing'],
      previewUrl: '',
      spotifyUri: 'spotify:track:26AYbQB7ahRdaL0KKJqZIZ'
    }
  ],

  // Last Dance
  lastDance: [
    {
      id: 'spotify:track:4VbDJmty3F3igRWsWDKREC',
      title: 'Time of My Life',
      artist: 'Bill Medley & Jennifer Warnes',
      album: 'Dirty Dancing Soundtrack',
      duration: 287,
      bpm: 103,
      energyLevel: 4,
      explicit: false,
      generationAppeal: ['gen_x', 'boomer', 'millennial'],
      genres: ['pop', '80s'],
      previewUrl: '',
      spotifyUri: 'spotify:track:4VbDJmty3F3igRWsWDKREC'
    },
    {
      id: 'spotify:track:4LUipE7nTZy4nXVPCQ5JUl',
      title: 'Don\'t Stop Believin\'',
      artist: 'Journey',
      album: 'Escape',
      duration: 250,
      bpm: 119,
      energyLevel: 4,
      explicit: false,
      generationAppeal: ['gen_x', 'millennial'],
      genres: ['rock', '80s'],
      previewUrl: '',
      spotifyUri: 'spotify:track:4LUipE7nTZy4nXVPCQ5JUl'
    },
    {
      id: 'spotify:track:3EYOJ48Et32uATr9ZmLnAo',
      title: 'Closing Time',
      artist: 'Semisonic',
      album: 'Feeling Strangely Fine',
      duration: 269,
      bpm: 92,
      energyLevel: 3,
      explicit: false,
      generationAppeal: ['gen_x', 'millennial'],
      genres: ['rock', '90s'],
      previewUrl: '',
      spotifyUri: 'spotify:track:3EYOJ48Et32uATr9ZmLnAo'
    }
  ]
};