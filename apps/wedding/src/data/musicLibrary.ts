export interface Song {
  id: string
  title: string
  artist: string
  album?: string
  year?: number
  duration?: number
  genre: string
  mood: string
  energy: 'low' | 'medium' | 'high'
  moments: string[]
  popularity: number
  preview_url?: string
  spotify_id?: string
  story?: string
  why_recommended?: string
}

export const weddingMoments = [
  'ceremony',
  'cocktail', 
  'dinner',
  'dancing',
  'first-dance',
  'parent-dance'
] as const

export const musicLibrary: Song[] = [
  // Ceremony Songs
  {
    id: 'canon-in-d',
    title: 'Canon in D',
    artist: 'Johann Pachelbel',
    album: 'Classical Wedding Collection',
    year: 1680,
    duration: 360,
    genre: 'Classical',
    mood: 'Romantic',
    energy: 'low',
    moments: ['ceremony'],
    popularity: 95,
    spotify_id: '3jfr0TF6DQcOLat8gGn7E2',
    story: 'The most beloved wedding processional of all time. This baroque masterpiece has walked countless brides down the aisle.',
    why_recommended: 'Timeless elegance that never goes out of style. Perfect tempo for a graceful walk.'
  },
  {
    id: 'a-thousand-years',
    title: 'A Thousand Years',
    artist: 'Christina Perri',
    album: 'The Twilight Saga: Breaking Dawn – Part 1',
    year: 2011,
    duration: 285,
    genre: 'Pop',
    mood: 'Romantic',
    energy: 'medium',
    moments: ['ceremony', 'first-dance'],
    popularity: 92,
    spotify_id: '6lanRgr6wXibZr8KgzXxBl',
    story: 'Made famous by Twilight, this song captures the feeling of eternal love and commitment.',
    why_recommended: 'Modern lyrics that speak to forever love, perfect for contemporary ceremonies.'
  },
  {
    id: 'all-you-need-is-love',
    title: 'All You Need Is Love',
    artist: 'The Beatles',
    album: 'Magical Mystery Tour',
    year: 1967,
    duration: 237,
    genre: 'Pop Rock',
    mood: 'Joyful',
    energy: 'medium',
    moments: ['ceremony', 'cocktail'],
    popularity: 88,
    spotify_id: '3BQHpFgAp4l80e1XslIjNI',
    story: 'The Beatles\' universal message of love makes this perfect for celebrating unity and joy.',
    why_recommended: 'Everyone knows it, everyone loves it. Creates instant connection and smiles.'
  },

  // First Dance Songs
  {
    id: 'at-last',
    title: 'At Last',
    artist: 'Etta James',
    album: 'At Last!',
    year: 1960,
    duration: 180,
    genre: 'Soul',
    mood: 'Romantic',
    energy: 'low',
    moments: ['first-dance', 'dinner'],
    popularity: 94,
    spotify_id: '0vg4WnUWvze6pBOJDTq99k',
    story: 'Etta James\' soulful voice captures the relief and joy of finding your person.',
    why_recommended: 'Timeless romance with incredible vocal power. Perfect for intimate moments.'
  },
  {
    id: 'perfect-ed-sheeran',
    title: 'Perfect',
    artist: 'Ed Sheeran',
    album: '÷ (Divide)',
    year: 2017,
    duration: 263,
    genre: 'Pop',
    mood: 'Romantic',
    energy: 'medium',
    moments: ['first-dance', 'ceremony'],
    popularity: 96,
    spotify_id: '0tgVpDi06FyKpA1z0VMD4v',
    story: 'Written about finding your perfect person, this modern love song resonates with couples worldwide.',
    why_recommended: 'Contemporary romance that feels both intimate and grand. Perfect for modern couples.'
  },
  {
    id: 'thinking-out-loud',
    title: 'Thinking Out Loud',
    artist: 'Ed Sheeran',
    album: 'x (Multiply)',
    year: 2014,
    duration: 281,
    genre: 'Pop',
    mood: 'Romantic',
    energy: 'medium',
    moments: ['first-dance', 'dinner'],
    popularity: 93,
    spotify_id: '1jNQXLV0DVlLKTA7E5LaGW',
    story: 'A promise to love someone through all of life\'s changes, growing old together.',
    why_recommended: 'Beautiful lyrics about lasting love and commitment. Great for slow dancing.'
  },

  // Reception/Dancing Songs
  {
    id: 'i-wanna-dance-with-somebody',
    title: 'I Wanna Dance with Somebody (Who Loves Me)',
    artist: 'Whitney Houston',
    album: 'Whitney',
    year: 1987,
    duration: 290,
    genre: 'Pop',
    mood: 'Joyful',
    energy: 'high',
    moments: ['dancing'],
    popularity: 97,
    spotify_id: '2tUBqZG2AbRi7Q0BIrVrEj',
    story: 'Whitney\'s powerhouse vocals and infectious energy make this a guaranteed dance floor filler.',
    why_recommended: 'Impossible not to dance to. Gets every generation moving and singing along.'
  },
  {
    id: 'dont-stop-me-now',
    title: 'Don\'t Stop Me Now',
    artist: 'Queen',
    album: 'Jazz',
    year: 1978,
    duration: 210,
    genre: 'Rock',
    mood: 'Joyful',
    energy: 'high',
    moments: ['dancing', 'cocktail'],
    popularity: 95,
    spotify_id: '5T8EDUDqKcs6OSOwEsfqG7',
    story: 'Freddie Mercury\'s celebration of life and joy - pure energy and positivity.',
    why_recommended: 'Ultimate feel-good song. Creates instant party atmosphere and joy.'
  },
  {
    id: 'september',
    title: 'September',
    artist: 'Earth, Wind & Fire',
    album: 'The Best of Earth, Wind & Fire, Vol. 1',
    year: 1978,
    duration: 215,
    genre: 'Funk',
    mood: 'Joyful',
    energy: 'high',
    moments: ['dancing'],
    popularity: 96,
    spotify_id: '2grjqo0Frpf2okIBiifQKs',
    story: 'The ultimate celebration song - pure joy and funk that gets everyone moving.',
    why_recommended: 'Cross-generational appeal. Everyone knows the "ba-dee-ya" part!'
  },
  {
    id: 'uptown-funk',
    title: 'Uptown Funk',
    artist: 'Mark Ronson ft. Bruno Mars',
    album: 'Uptown Special',
    year: 2014,
    duration: 270,
    genre: 'Funk',
    mood: 'Joyful',
    energy: 'high',
    moments: ['dancing'],
    popularity: 94,
    spotify_id: '32OlwWuMpZ6b0aN2RZOeMS',
    story: 'Modern funk that brings retro vibes to contemporary celebrations.',
    why_recommended: 'Fresh energy with vintage appeal. Perfect for getting the party started.'
  },
  {
    id: 'dancing-queen',
    title: 'Dancing Queen',
    artist: 'ABBA',
    album: 'Arrival',
    year: 1976,
    duration: 230,
    genre: 'Pop',
    mood: 'Joyful',
    energy: 'high',
    moments: ['dancing'],
    popularity: 98,
    spotify_id: '0GjEHVFGC3m8SPNxMBzRTf',
    story: 'ABBA\'s disco masterpiece that makes everyone feel like royalty on the dance floor.',
    why_recommended: 'Universal appeal across all ages. Instant dance floor magic.'
  },

  // Cocktail Hour Songs
  {
    id: 'fly-me-to-the-moon',
    title: 'Fly Me to the Moon',
    artist: 'Frank Sinatra',
    album: 'It Might as Well Be Swing',
    year: 1964,
    duration: 150,
    genre: 'Jazz',
    mood: 'Romantic',
    energy: 'low',
    moments: ['cocktail', 'dinner'],
    popularity: 89,
    spotify_id: '5b7OgznPJJr1vHNYGyvxau',
    story: 'Sinatra\'s smooth vocals create the perfect sophisticated atmosphere for mingling.',
    why_recommended: 'Classic elegance that sets a refined tone. Perfect conversation music.'
  },
  {
    id: 'the-way-you-look-tonight',
    title: 'The Way You Look Tonight',
    artist: 'Frank Sinatra',
    album: 'Songs for Swingin\' Lovers!',
    year: 1956,
    duration: 201,
    genre: 'Jazz',
    mood: 'Romantic',
    energy: 'low',
    moments: ['cocktail', 'dinner'],
    popularity: 91,
    story: 'A timeless love song that captures the romance of the moment.',
    why_recommended: 'Sophisticated romance that enhances the wedding atmosphere without overwhelming.'
  },
  {
    id: 'isnt-she-lovely',
    title: 'Isn\'t She Lovely',
    artist: 'Stevie Wonder',
    album: 'Songs in the Key of Life',
    year: 1976,
    duration: 402,
    genre: 'Soul',
    mood: 'Joyful',
    energy: 'medium',
    moments: ['cocktail', 'dinner'],
    popularity: 88,
    story: 'Stevie Wonder\'s celebration of love and life brings warmth to any gathering.',
    why_recommended: 'Uplifting without being overwhelming. Perfect for background celebration.'
  },

  // Dinner Songs
  {
    id: 'make-you-feel-my-love',
    title: 'Make You Feel My Love',
    artist: 'Adele',
    album: '19',
    year: 2008,
    duration: 228,
    genre: 'Soul',
    mood: 'Romantic',
    energy: 'low',
    moments: ['dinner', 'ceremony'],
    popularity: 90,
    story: 'Bob Dylan\'s lyrics get new life through Adele\'s powerful, emotional delivery.',
    why_recommended: 'Intimate and powerful. Creates emotional connection during dinner.'
  },
  {
    id: 'wonderwall',
    title: 'Wonderwall',
    artist: 'Oasis',
    album: '(What\'s the Story) Morning Glory?',
    year: 1995,
    duration: 259,
    genre: 'Rock',
    mood: 'Nostalgic',
    energy: 'medium',
    moments: ['cocktail', 'dinner'],
    popularity: 87,
    story: 'A song about finding someone who saves you - perfect for wedding celebrations.',
    why_recommended: 'Everyone knows it and can sing along. Creates shared moments of joy.'
  },

  // Parent Dance Songs
  {
    id: 'what-a-wonderful-world',
    title: 'What a Wonderful World',
    artist: 'Louis Armstrong',
    album: 'What a Wonderful World',
    year: 1967,
    duration: 140,
    genre: 'Jazz',
    mood: 'Heartwarming',
    energy: 'low',
    moments: ['parent-dance', 'dinner'],
    popularity: 92,
    story: 'Louis Armstrong\'s optimistic view of life and love, perfect for family moments.',
    why_recommended: 'Brings tears of joy. Perfect for honoring family and the beauty of life.'
  },
  {
    id: 'unforgettable',
    title: 'Unforgettable',
    artist: 'Nat King Cole',
    album: 'Unforgettable',
    year: 1951,
    duration: 195,
    genre: 'Jazz',
    mood: 'Romantic',
    energy: 'low',
    moments: ['parent-dance', 'cocktail'],
    popularity: 85,
    story: 'A timeless classic about cherishing precious moments and people.',
    why_recommended: 'Perfect for honoring the love that raised you. Elegant and emotional.'
  },

  // Additional Modern Hits
  {
    id: 'all-of-me',
    title: 'All of Me',
    artist: 'John Legend',
    album: 'Love in the Future',
    year: 2013,
    duration: 269,
    genre: 'R&B',
    mood: 'Romantic',
    energy: 'medium',
    moments: ['first-dance', 'dinner'],
    popularity: 95,
    spotify_id: '3U4isOIWM3VvDubwSI3y7a',
    story: 'John Legend\'s personal love song to his wife, celebrating imperfections and complete acceptance.',
    why_recommended: 'Modern vulnerability and romance. Perfect for contemporary couples.'
  },
  {
    id: 'marry-me',
    title: 'Marry Me',
    artist: 'Train',
    album: 'Save Me, San Francisco',
    year: 2010,
    duration: 260,
    genre: 'Pop Rock',
    mood: 'Romantic',
    energy: 'medium',
    moments: ['ceremony', 'first-dance'],
    popularity: 89,
    story: 'A proposal song turned wedding classic, celebrating the decision to commit.',
    why_recommended: 'Perfect for the moment of saying "I do." Captures the wedding spirit.'
  },
  {
    id: 'count-on-me',
    title: 'Count on Me',
    artist: 'Bruno Mars',
    album: 'Doo-Wops & Hooligans',
    year: 2010,
    duration: 195,
    genre: 'Pop',
    mood: 'Heartwarming',
    energy: 'medium',
    moments: ['cocktail', 'dinner'],
    popularity: 88,
    story: 'About being there for each other through thick and thin - perfect for wedding celebrations.',
    why_recommended: 'Celebrates friendship and loyalty. Great for honoring your chosen family.'
  },

  // Feel-Good Classics
  {
    id: 'good-as-hell',
    title: 'Good as Hell',
    artist: 'Lizzo',
    album: 'Cuz I Love You',
    year: 2019,
    duration: 219,
    genre: 'Pop',
    mood: 'Confident',
    energy: 'high',
    moments: ['dancing'],
    popularity: 91,
    story: 'Lizzo\'s celebration of self-love and confidence brings empowerment to the dance floor.',
    why_recommended: 'Modern empowerment anthem. Gets everyone feeling amazing about themselves.'
  },
  {
    id: 'happy',
    title: 'Happy',
    artist: 'Pharrell Williams',
    album: 'Despicable Me 2',
    year: 2013,
    duration: 232,
    genre: 'Pop',
    mood: 'Joyful',
    energy: 'high',
    moments: ['dancing', 'cocktail'],
    popularity: 93,
    spotify_id: '60nZcImufyMA1MKQY3dcCH',
    story: 'Pure joy in musical form - impossible not to smile when this plays.',
    why_recommended: 'Universal happiness. Makes everyone feel like celebrating life.'
  },
  {
    id: 'cant-stop-the-feeling',
    title: 'Can\'t Stop the Feeling!',
    artist: 'Justin Timberlake',
    album: 'Trolls: Original Motion Picture Soundtrack',
    year: 2016,
    duration: 236,
    genre: 'Pop',
    mood: 'Joyful',
    energy: 'high',
    moments: ['dancing'],
    popularity: 92,
    spotify_id: '3n3Ppam7vgaVa1iaRUc9Lp',
    story: 'Infectious positivity that spreads joy throughout the celebration.',
    why_recommended: 'Impossible not to dance to. Creates instant party atmosphere.'
  }
]

export const getFilteredSongs = (filters: {
  moment?: string
  genre?: string
  mood?: string
  energy?: string
  search?: string
}) => {
  return musicLibrary.filter(song => {
    if (filters.moment && !song.moments.includes(filters.moment)) return false
    if (filters.genre && song.genre !== filters.genre) return false
    if (filters.mood && song.mood !== filters.mood) return false
    if (filters.energy && song.energy !== filters.energy) return false
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      return (
        song.title.toLowerCase().includes(searchLower) ||
        song.artist.toLowerCase().includes(searchLower) ||
        song.genre.toLowerCase().includes(searchLower)
      )
    }
    return true
  })
}

export const getGenres = () => {
  const genres = new Set(musicLibrary.map(song => song.genre))
  return Array.from(genres).sort()
}

export const getMoods = () => {
  const moods = new Set(musicLibrary.map(song => song.mood))
  return Array.from(moods).sort()
}

export const getEnergyLevels = () => {
  return ['low', 'medium', 'high']
}