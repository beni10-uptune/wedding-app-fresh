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
      albumArt: 'https://i.scdn.co/image/ab67616d0000b273ba7fe7dd76cd4307e57dd75f',
      duration: 295,
      bpm: 139,
      energyLevel: 2,
      explicit: false,
      generationAppeal: ['millennial', 'gen_z'],
      genres: ['pop', 'contemporary'],
      previewUrl: 'https://p.scdn.co/mp3-preview/e7a8e9b4c7b5a40e1b5a5d5f3e5a5d5f3e5a5d5f',
      spotifyUri: 'spotify:track:3n3Ppam7vgaVa1iaRUc9Lp'
    },
    {
      id: 'spotify:track:1dGr1c8CrMLDpV6mPbImSI',
      title: 'Lover',
      artist: 'Taylor Swift',
      album: 'Lover',
      albumArt: 'https://i.scdn.co/image/ab67616d0000b273e787cffec20aa2a396a61647',
      duration: 221,
      bpm: 68,
      energyLevel: 2,
      explicit: false,
      generationAppeal: ['millennial', 'gen_z'],
      genres: ['pop', 'contemporary'],
      previewUrl: 'https://p.scdn.co/mp3-preview/ed4e3f3e7a8e9b4c7b5a40e1b5a5d5f3e5a5d5f',
      spotifyUri: 'spotify:track:1dGr1c8CrMLDpV6mPbImSI'
    },
    {
      id: 'spotify:track:0yLdNVWF3Srea0uzk55zFn',
      title: 'Speechless',
      artist: 'Dan + Shay',
      album: 'Dan + Shay',
      albumArt: 'https://i.scdn.co/image/ab67616d0000b27334e35d3f5e0b9c6e5c0e5f8e',
      duration: 211,
      bpm: 85,
      energyLevel: 2,
      explicit: false,
      generationAppeal: ['millennial', 'gen_x'],
      genres: ['country', 'pop'],
      previewUrl: 'https://p.scdn.co/mp3-preview/speechless-preview',
      spotifyUri: 'spotify:track:0yLdNVWF3Srea0uzk55zFn'
    },
    {
      id: 'spotify:track:6habFhsOp2NvshLv26DqMb',
      title: 'Marry Me',
      artist: 'Train',
      album: 'Save Me, San Francisco',
      albumArt: 'https://i.scdn.co/image/ab67616d0000b2736c0e18b0e8c0e5e0e8c0e5e0',
      duration: 214,
      bpm: 144,
      energyLevel: 3,
      explicit: false,
      generationAppeal: ['gen_x', 'millennial'],
      genres: ['pop', 'rock'],
      previewUrl: 'https://p.scdn.co/mp3-preview/marry-me-preview',
      spotifyUri: 'spotify:track:6habFhsOp2NvshLv26DqMb'
    },
    {
      id: 'spotify:track:6lanRgr6wXibZr8KgzXxBl',
      title: 'All of Me',
      artist: 'John Legend',
      album: 'Love in the Future',
      albumArt: 'https://i.scdn.co/image/ab67616d0000b2737b183222ef0b4a88a7d4a8c0',
      duration: 269,
      bpm: 120,
      energyLevel: 2,
      explicit: false,
      generationAppeal: ['millennial', 'gen_x', 'gen_z'],
      genres: ['r&b', 'soul', 'pop'],
      previewUrl: 'https://p.scdn.co/mp3-preview/all-of-me-preview',
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
      albumArt: 'https://i.scdn.co/image/ab67616d0000b273a6b8d7d8f8c8e7d8f8c8e7d8',
      duration: 343,
      bpm: 64,
      energyLevel: 2,
      explicit: false,
      generationAppeal: ['boomer', 'gen_x', 'millennial'],
      genres: ['classical'],
      previewUrl: 'https://p.scdn.co/mp3-preview/canon-in-d-preview',
      spotifyUri: 'spotify:track:5IVuqXILoxVWvWEPm82Jxr'
    },
    {
      id: 'spotify:track:4fPBB44eDH71YohayI4eKV',
      title: 'Bridal Chorus (Here Comes The Bride)',
      artist: 'Richard Wagner',
      album: 'Wedding Classics',
      albumArt: 'https://i.scdn.co/image/ab67616d0000b273b9c9d9e9f9d9e9f9d9e9f9d9',
      duration: 245,
      bpm: 69,
      energyLevel: 3,
      explicit: false,
      generationAppeal: ['boomer', 'gen_x'],
      genres: ['classical'],
      previewUrl: 'https://p.scdn.co/mp3-preview/bridal-chorus-preview',
      spotifyUri: 'spotify:track:4fPBB44eDH71YohayI4eKV'
    },
    {
      id: 'spotify:track:0BxE4FqsDD1Ot4YuBXwAPp',
      title: 'Heaven',
      artist: 'Kane Brown',
      album: 'Kane Brown',
      albumArt: 'https://i.scdn.co/image/ab67616d0000b273c9d9e9f9d9e9f9d9e9f9d9e9',
      duration: 213,
      bpm: 144,
      energyLevel: 3,
      explicit: false,
      generationAppeal: ['millennial', 'gen_z'],
      genres: ['country', 'pop'],
      previewUrl: 'https://p.scdn.co/mp3-preview/heaven-preview',
      spotifyUri: 'spotify:track:0BxE4FqsDD1Ot4YuBXwAPp'
    },
    {
      id: 'spotify:track:1CS7Sd1u5tWkstBhpssyjP',
      title: 'Perfect',
      artist: 'Ed Sheeran',
      album: '÷ (Divide)',
      albumArt: 'https://i.scdn.co/image/ab67616d0000b273ba025c59b0b8dfb88f0e8f0e',
      duration: 263,
      bpm: 95,
      energyLevel: 2,
      explicit: false,
      generationAppeal: ['millennial', 'gen_z', 'gen_x'],
      genres: ['pop'],
      previewUrl: 'https://p.scdn.co/mp3-preview/perfect-preview',
      spotifyUri: 'spotify:track:1CS7Sd1u5tWkstBhpssyjP'
    }
  ],

  // Ceremony Songs
  ceremony: [
    {
      id: 'spotify:track:ceremony1',
      title: 'Ave Maria',
      artist: 'Franz Schubert',
      album: 'Classical Wedding',
      albumArt: 'https://i.scdn.co/image/ab67616d0000b273aaaaaaaaaaaaaaaaaaaaaa',
      duration: 280,
      bpm: 68,
      energyLevel: 2,
      explicit: false,
      generationAppeal: ['boomer', 'gen_x', 'millennial'],
      genres: ['classical'],
      previewUrl: 'https://p.scdn.co/mp3-preview/ave-maria-preview',
      spotifyUri: 'spotify:track:ceremony1'
    },
    {
      id: 'spotify:track:ceremony2',
      title: 'The Prayer',
      artist: 'Celine Dion & Andrea Bocelli',
      album: 'These Are Special Times',
      albumArt: 'https://i.scdn.co/image/ab67616d0000b273bbbbbbbbbbbbbbbbbbbbbb',
      duration: 270,
      bpm: 72,
      energyLevel: 2,
      explicit: false,
      generationAppeal: ['gen_x', 'millennial'],
      genres: ['pop', 'classical'],
      previewUrl: 'https://p.scdn.co/mp3-preview/the-prayer-preview',
      spotifyUri: 'spotify:track:ceremony2'
    }
  ],

  // Recessional Songs
  recessional: [
    {
      id: 'spotify:track:recessional1',
      title: 'Signed, Sealed, Delivered',
      artist: 'Stevie Wonder',
      album: 'Signed, Sealed & Delivered',
      albumArt: 'https://i.scdn.co/image/ab67616d0000b273cccccccccccccccccccccc',
      duration: 174,
      bpm: 103,
      energyLevel: 4,
      explicit: false,
      generationAppeal: ['boomer', 'gen_x', 'millennial'],
      genres: ['soul', 'funk'],
      previewUrl: 'https://p.scdn.co/mp3-preview/signed-sealed-delivered-preview',
      spotifyUri: 'spotify:track:recessional1'
    },
    {
      id: 'spotify:track:recessional2',
      title: 'Love on Top',
      artist: 'Beyoncé',
      album: '4',
      albumArt: 'https://i.scdn.co/image/ab67616d0000b273dddddddddddddddddddddd',
      duration: 267,
      bpm: 88,
      energyLevel: 4,
      explicit: false,
      generationAppeal: ['millennial', 'gen_z'],
      genres: ['r&b', 'pop'],
      previewUrl: 'https://p.scdn.co/mp3-preview/love-on-top-preview',
      spotifyUri: 'spotify:track:recessional2'
    }
  ],

  // Cocktail Hour Songs
  cocktail: [
    {
      id: 'spotify:track:cocktail1',
      title: 'Sunday Morning',
      artist: 'Maroon 5',
      album: 'Songs About Jane',
      albumArt: 'https://i.scdn.co/image/ab67616d0000b273eeeeeeeeeeeeeeeeeeeeee',
      duration: 240,
      bpm: 91,
      energyLevel: 3,
      explicit: false,
      generationAppeal: ['millennial', 'gen_z'],
      genres: ['pop', 'rock'],
      previewUrl: 'https://p.scdn.co/mp3-preview/sunday-morning-preview',
      spotifyUri: 'spotify:track:cocktail1'
    },
    {
      id: 'spotify:track:cocktail2',
      title: 'Better Days',
      artist: 'OneRepublic',
      album: 'Oh My My',
      albumArt: 'https://i.scdn.co/image/ab67616d0000b273ffffffffffffffffffffff',
      duration: 232,
      bpm: 115,
      energyLevel: 3,
      explicit: false,
      generationAppeal: ['millennial', 'gen_z'],
      genres: ['pop', 'rock'],
      previewUrl: 'https://p.scdn.co/mp3-preview/better-days-preview',
      spotifyUri: 'spotify:track:cocktail2'
    }
  ],

  // Grand Entrance Songs
  entrance: [
    {
      id: 'spotify:track:entrance1',
      title: 'Crazy in Love',
      artist: 'Beyoncé ft. Jay-Z',
      album: 'Dangerously in Love',
      albumArt: 'https://i.scdn.co/image/ab67616d0000b273111111111111111111111',
      duration: 236,
      bpm: 99,
      energyLevel: 5,
      explicit: false,
      generationAppeal: ['millennial', 'gen_z'],
      genres: ['r&b', 'hip-hop'],
      previewUrl: 'https://p.scdn.co/mp3-preview/crazy-in-love-preview',
      spotifyUri: 'spotify:track:entrance1'
    },
    {
      id: 'spotify:track:entrance2',
      title: '24K Magic',
      artist: 'Bruno Mars',
      album: '24K Magic',
      albumArt: 'https://i.scdn.co/image/ab67616d0000b273222222222222222222222',
      duration: 226,
      bpm: 107,
      energyLevel: 5,
      explicit: false,
      generationAppeal: ['millennial', 'gen_z'],
      genres: ['funk', 'pop'],
      previewUrl: 'https://p.scdn.co/mp3-preview/24k-magic-preview',
      spotifyUri: 'spotify:track:entrance2'
    }
  ],

  // First Dance Songs
  firstDance: [
    {
      id: 'spotify:track:1BxfuPKGuaTgP7aM0Bbdwr',
      title: 'Thinking Out Loud',
      artist: 'Ed Sheeran',
      album: 'x',
      albumArt: 'https://i.scdn.co/image/ab67616d0000b2735abba7e2e2e5e2e5e2e5e2e5',
      duration: 281,
      bpm: 79,
      energyLevel: 2,
      explicit: false,
      generationAppeal: ['millennial', 'gen_z'],
      genres: ['pop', 'soul'],
      previewUrl: 'https://p.scdn.co/mp3-preview/thinking-out-loud-preview',
      spotifyUri: 'spotify:track:1BxfuPKGuaTgP7aM0Bbdwr'
    },
    {
      id: 'spotify:track:6PUIzFuCPMx1chpfOZnxgV',
      title: 'At Last',
      artist: 'Etta James',
      album: 'At Last!',
      albumArt: 'https://i.scdn.co/image/ab67616d0000b273f2f2f2f2f2f2f2f2f2f2f2f2',
      duration: 181,
      bpm: 65,
      energyLevel: 2,
      explicit: false,
      generationAppeal: ['boomer', 'gen_x', 'millennial'],
      genres: ['soul', 'jazz', 'blues'],
      previewUrl: 'https://p.scdn.co/mp3-preview/at-last-preview',
      spotifyUri: 'spotify:track:6PUIzFuCPMx1chpfOZnxgV'
    },
    {
      id: 'spotify:track:468j3V5Qxw5oEqL5PhcYlz',
      title: 'Make You Feel My Love',
      artist: 'Adele',
      album: '19',
      albumArt: 'https://i.scdn.co/image/ab67616d0000b2731919191919191919191919191',
      duration: 212,
      bpm: 72,
      energyLevel: 2,
      explicit: false,
      generationAppeal: ['millennial', 'gen_x', 'gen_z'],
      genres: ['pop', 'soul'],
      previewUrl: 'https://p.scdn.co/mp3-preview/make-you-feel-my-love-preview',
      spotifyUri: 'spotify:track:468j3V5Qxw5oEqL5PhcYlz'
    },
    {
      id: 'spotify:track:60nZcImufyMA1MKQY3dcCH',
      title: 'I Don\'t Want to Miss a Thing',
      artist: 'Aerosmith',
      album: 'Armageddon Soundtrack',
      albumArt: 'https://i.scdn.co/image/ab67616d0000b2732a2a2a2a2a2a2a2a2a2a2a2a',
      duration: 299,
      bpm: 68,
      energyLevel: 3,
      explicit: false,
      generationAppeal: ['gen_x', 'boomer'],
      genres: ['rock', 'power ballad'],
      previewUrl: 'https://p.scdn.co/mp3-preview/i-dont-want-to-miss-a-thing-preview',
      spotifyUri: 'spotify:track:60nZcImufyMA1MKQY3dcCH'
    },
    {
      id: 'spotify:track:3CeCwYWvdfXbZLXFhBrbnf',
      title: 'Stand by Me',
      artist: 'Ben E. King',
      album: 'Don\'t Play That Song!',
      albumArt: 'https://i.scdn.co/image/ab67616d0000b2733b3b3b3b3b3b3b3b3b3b3b3b',
      duration: 178,
      bpm: 118,
      energyLevel: 2,
      explicit: false,
      generationAppeal: ['boomer', 'gen_x', 'millennial'],
      genres: ['soul', 'r&b'],
      previewUrl: 'https://p.scdn.co/mp3-preview/stand-by-me-preview',
      spotifyUri: 'spotify:track:3CeCwYWvdfXbZLXFhBrbnf'
    }
  ],

  // Parent Dances Songs
  parentDances: [
    {
      id: 'spotify:track:parent1',
      title: 'My Girl',
      artist: 'The Temptations',
      album: 'The Temptations Sing Smokey',
      albumArt: 'https://i.scdn.co/image/ab67616d0000b273333333333333333333333',
      duration: 163,
      bpm: 103,
      energyLevel: 3,
      explicit: false,
      generationAppeal: ['boomer', 'gen_x'],
      genres: ['soul', 'motown'],
      previewUrl: 'https://p.scdn.co/mp3-preview/my-girl-preview',
      spotifyUri: 'spotify:track:parent1'
    },
    {
      id: 'spotify:track:parent2',
      title: 'Isn\'t She Lovely',
      artist: 'Stevie Wonder',
      album: 'Songs in the Key of Life',
      albumArt: 'https://i.scdn.co/image/ab67616d0000b273444444444444444444444',
      duration: 392,
      bpm: 116,
      energyLevel: 3,
      explicit: false,
      generationAppeal: ['boomer', 'gen_x', 'millennial'],
      genres: ['soul', 'r&b'],
      previewUrl: 'https://p.scdn.co/mp3-preview/isnt-she-lovely-preview',
      spotifyUri: 'spotify:track:parent2'
    }
  ],

  // Dance Floor Songs
  danceFloor: [
    {
      id: 'spotify:track:3BxWKCI06eQ5Od8TY2JBeA',
      title: 'Uptown Funk',
      artist: 'Mark Ronson ft. Bruno Mars',
      album: 'Uptown Special',
      albumArt: 'https://i.scdn.co/image/ab67616d0000b2734c4c4c4c4c4c4c4c4c4c4c4c',
      duration: 270,
      bpm: 115,
      energyLevel: 5,
      explicit: false,
      generationAppeal: ['millennial', 'gen_z', 'gen_x'],
      genres: ['funk', 'pop'],
      previewUrl: 'https://p.scdn.co/mp3-preview/uptown-funk-preview',
      spotifyUri: 'spotify:track:3BxWKCI06eQ5Od8TY2JBeA'
    },
    {
      id: 'spotify:track:6PCUP3dWmTjcTtXY02oFdT',
      title: 'September',
      artist: 'Earth, Wind & Fire',
      album: 'The Best of Earth, Wind & Fire, Vol. 1',
      albumArt: 'https://i.scdn.co/image/ab67616d0000b2735d5d5d5d5d5d5d5d5d5d5d5d',
      duration: 215,
      bpm: 126,
      energyLevel: 5,
      explicit: false,
      generationAppeal: ['boomer', 'gen_x', 'millennial'],
      genres: ['funk', 'disco', 'soul'],
      previewUrl: 'https://p.scdn.co/mp3-preview/september-preview',
      spotifyUri: 'spotify:track:6PCUP3dWmTjcTtXY02oFdT'
    },
    {
      id: 'spotify:track:32OlwWuMpZ6b0aN2RZOeMS',
      title: 'Shut Up and Dance',
      artist: 'WALK THE MOON',
      album: 'TALKING IS HARD',
      albumArt: 'https://i.scdn.co/image/ab67616d0000b273dddddeeeeeedddddeeeeeeee',
      duration: 199,
      bpm: 128,
      energyLevel: 5,
      explicit: false,
      generationAppeal: ['millennial', 'gen_z'],
      genres: ['pop', 'rock'],
      previewUrl: 'https://p.scdn.co/mp3-preview/shut-up-and-dance-preview',
      spotifyUri: 'spotify:track:32OlwWuMpZ6b0aN2RZOeMS'
    },
    {
      id: 'spotify:track:1WkMMavIMc4JZ8cfMmxHkI',
      title: 'CAN\'T STOP THE FEELING!',
      artist: 'Justin Timberlake',
      album: 'Trolls (Original Motion Picture Soundtrack)',
      albumArt: 'https://i.scdn.co/image/ab67616d0000b273eeeeefffffeeeeeffffffffffff',
      duration: 236,
      bpm: 113,
      energyLevel: 5,
      explicit: false,
      generationAppeal: ['millennial', 'gen_z', 'gen_x'],
      genres: ['pop', 'dance'],
      previewUrl: 'https://p.scdn.co/mp3-preview/cant-stop-the-feeling-preview',
      spotifyUri: 'spotify:track:1WkMMavIMc4JZ8cfMmxHkI'
    },
    {
      id: 'spotify:track:0DiWol3AO6WpXZgp0goxAV',
      title: 'Dancing Queen',
      artist: 'ABBA',
      album: 'Arrival',
      albumArt: 'https://i.scdn.co/image/ab67616d0000b273fffffgggggggfffffggggggggg',
      duration: 230,
      bpm: 101,
      energyLevel: 4,
      explicit: false,
      generationAppeal: ['boomer', 'gen_x', 'millennial'],
      genres: ['pop', 'disco'],
      previewUrl: 'https://p.scdn.co/mp3-preview/dancing-queen-preview',
      spotifyUri: 'spotify:track:0DiWol3AO6WpXZgp0goxAV'
    },
    {
      id: 'spotify:track:7tFiyTwD0nx5a1eklYtX2J',
      title: 'Levitating',
      artist: 'Dua Lipa',
      album: 'Future Nostalgia',
      albumArt: 'https://i.scdn.co/image/ab67616d0000b273ggggghhhhhhhhggggghhhhhhhhh',
      duration: 203,
      bpm: 103,
      energyLevel: 5,
      explicit: false,
      generationAppeal: ['gen_z', 'millennial'],
      genres: ['pop', 'dance'],
      previewUrl: 'https://p.scdn.co/mp3-preview/levitating-preview',
      spotifyUri: 'spotify:track:7tFiyTwD0nx5a1eklYtX2J'
    },
    {
      id: 'spotify:track:2grjqUT0Lcpk6eB4jaqYap',
      title: 'I Wanna Dance with Somebody',
      artist: 'Whitney Houston',
      album: 'Whitney',
      albumArt: 'https://i.scdn.co/image/ab67616d0000b273hhhhhjjjjjjjhhhhhjjjjjjjjjj',
      duration: 295,
      bpm: 119,
      energyLevel: 5,
      explicit: false,
      generationAppeal: ['gen_x', 'millennial', 'boomer'],
      genres: ['pop', 'dance'],
      previewUrl: 'https://p.scdn.co/mp3-preview/i-wanna-dance-with-somebody-preview',
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
      albumArt: 'https://i.scdn.co/image/ab67616d0000b273666666666666666666666',
      duration: 191,
      bpm: 174,
      energyLevel: 2,
      explicit: false,
      generationAppeal: ['boomer', 'gen_x'],
      genres: ['jazz', 'standards'],
      previewUrl: 'https://p.scdn.co/mp3-preview/the-way-you-look-tonight-preview',
      spotifyUri: 'spotify:track:0tgVpDi06FyKpA1z0VMD4v'
    },
    {
      id: 'spotify:track:19KlZwqlT3fguP2BeHF1Q1',
      title: 'Fly Me to the Moon',
      artist: 'Michael Bublé',
      album: 'To Be Loved',
      albumArt: 'https://i.scdn.co/image/ab67616d0000b273777777777777777777777',
      duration: 146,
      bpm: 119,
      energyLevel: 2,
      explicit: false,
      generationAppeal: ['gen_x', 'millennial'],
      genres: ['jazz', 'pop'],
      previewUrl: 'https://p.scdn.co/mp3-preview/fly-me-to-the-moon-preview',
      spotifyUri: 'spotify:track:19KlZwqlT3fguP2BeHF1Q1'
    },
    {
      id: 'spotify:track:5b8Ai5xHFoKZ8IYoLh9m2j',
      title: 'L-O-V-E',
      artist: 'Nat King Cole',
      album: 'L-O-V-E',
      albumArt: 'https://i.scdn.co/image/ab67616d0000b273888888888888888888888',
      duration: 152,
      bpm: 91,
      energyLevel: 2,
      explicit: false,
      generationAppeal: ['boomer', 'gen_x'],
      genres: ['jazz', 'standards'],
      previewUrl: 'https://p.scdn.co/mp3-preview/love-preview',
      spotifyUri: 'spotify:track:5b8Ai5xHFoKZ8IYoLh9m2j'
    },
    {
      id: 'spotify:track:26AYbQB7ahRdaL0KKJqZIZ',
      title: 'Beyond The Sea',
      artist: 'Bobby Darin',
      album: 'That\'s All',
      albumArt: 'https://i.scdn.co/image/ab67616d0000b273999999999999999999999',
      duration: 174,
      bpm: 134,
      energyLevel: 3,
      explicit: false,
      generationAppeal: ['boomer', 'gen_x'],
      genres: ['jazz', 'swing'],
      previewUrl: 'https://p.scdn.co/mp3-preview/beyond-the-sea-preview',
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
      albumArt: 'https://i.scdn.co/image/ab67616d0000b273aaaaabbbbbaaaaabbbbbaaa',
      duration: 287,
      bpm: 103,
      energyLevel: 4,
      explicit: false,
      generationAppeal: ['gen_x', 'boomer', 'millennial'],
      genres: ['pop', '80s'],
      previewUrl: 'https://p.scdn.co/mp3-preview/time-of-my-life-preview',
      spotifyUri: 'spotify:track:4VbDJmty3F3igRWsWDKREC'
    },
    {
      id: 'spotify:track:4LUipE7nTZy4nXVPCQ5JUl',
      title: 'Don\'t Stop Believin\'',
      artist: 'Journey',
      album: 'Escape',
      albumArt: 'https://i.scdn.co/image/ab67616d0000b273bbbbbccccccbbbbbccccccc',
      duration: 250,
      bpm: 119,
      energyLevel: 4,
      explicit: false,
      generationAppeal: ['gen_x', 'millennial'],
      genres: ['rock', '80s'],
      previewUrl: 'https://p.scdn.co/mp3-preview/dont-stop-believin-preview',
      spotifyUri: 'spotify:track:4LUipE7nTZy4nXVPCQ5JUl'
    },
    {
      id: 'spotify:track:3EYOJ48Et32uATr9ZmLnAo',
      title: 'Closing Time',
      artist: 'Semisonic',
      album: 'Feeling Strangely Fine',
      albumArt: 'https://i.scdn.co/image/ab67616d0000b273cccccddddddcccccdddddddd',
      duration: 269,
      bpm: 92,
      energyLevel: 3,
      explicit: false,
      generationAppeal: ['gen_x', 'millennial'],
      genres: ['rock', '90s'],
      previewUrl: 'https://p.scdn.co/mp3-preview/closing-time-preview',
      spotifyUri: 'spotify:track:3EYOJ48Et32uATr9ZmLnAo'
    }
  ]
};