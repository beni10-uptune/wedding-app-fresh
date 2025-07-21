export interface PlaylistTemplate {
  id: string
  name: string
  description: string
  style: string
  icon: string
  playlists: {
    name: string
    description: string
    moment: string
    targetSongCount: number
    suggestedGenres?: string[]
    suggestedMood?: string[]
  }[]
}

export const playlistTemplates: PlaylistTemplate[] = [
  {
    id: 'classic-elegant',
    name: 'Classic & Elegant',
    description: 'Timeless sophistication with jazz standards, classical pieces, and refined pop',
    style: 'Traditional weddings with a touch of class',
    icon: '🎩',
    playlists: [
      {
        name: 'Prelude & Processional',
        description: 'Classical and instrumental pieces for guest arrival and ceremony',
        moment: 'ceremony',
        targetSongCount: 15,
        suggestedGenres: ['Classical', 'Instrumental', 'Piano'],
        suggestedMood: ['Romantic', 'Peaceful', 'Elegant']
      },
      {
        name: 'Cocktail Hour Jazz',
        description: 'Smooth jazz and standards for mingling',
        moment: 'cocktail',
        targetSongCount: 20,
        suggestedGenres: ['Jazz', 'Bossa Nova', 'Lounge'],
        suggestedMood: ['Sophisticated', 'Relaxed', 'Conversational']
      },
      {
        name: 'Dinner Elegance',
        description: 'Soft background music for dining',
        moment: 'dinner',
        targetSongCount: 25,
        suggestedGenres: ['Acoustic', 'Light Jazz', 'Classical Crossover'],
        suggestedMood: ['Gentle', 'Warm', 'Refined']
      },
      {
        name: 'First Dance & Special Moments',
        description: 'Romantic songs for key moments',
        moment: 'first-dance',
        targetSongCount: 10,
        suggestedGenres: ['Love Songs', 'Ballads'],
        suggestedMood: ['Romantic', 'Emotional', 'Meaningful']
      },
      {
        name: 'Dance Floor Classics',
        description: 'Timeless hits that everyone knows',
        moment: 'party',
        targetSongCount: 40,
        suggestedGenres: ['Motown', 'Classic Rock', 'Disco', '80s'],
        suggestedMood: ['Energetic', 'Fun', 'Nostalgic']
      }
    ]
  },
  {
    id: 'modern-party',
    name: 'Modern Party Vibes',
    description: 'Current hits, EDM, and high-energy tracks for the ultimate celebration',
    style: 'Contemporary weddings with non-stop dancing',
    icon: '🎉',
    playlists: [
      {
        name: 'Modern Ceremony',
        description: 'Contemporary acoustic and indie for a fresh take',
        moment: 'ceremony',
        targetSongCount: 10,
        suggestedGenres: ['Indie', 'Acoustic Pop', 'Alternative'],
        suggestedMood: ['Modern', 'Heartfelt', 'Unique']
      },
      {
        name: 'Cocktail Chill',
        description: 'Trendy lounge and chill electronic',
        moment: 'cocktail',
        targetSongCount: 20,
        suggestedGenres: ['Chill House', 'Lo-fi', 'Indie Electronic'],
        suggestedMood: ['Cool', 'Trendy', 'Relaxed']
      },
      {
        name: 'Dinner Vibes',
        description: 'Modern soul and R&B for dining',
        moment: 'dinner',
        targetSongCount: 25,
        suggestedGenres: ['Neo-Soul', 'R&B', 'Indie Pop'],
        suggestedMood: ['Smooth', 'Contemporary', 'Groovy']
      },
      {
        name: 'Epic First Dance',
        description: 'Modern love songs and power ballads',
        moment: 'first-dance',
        targetSongCount: 8,
        suggestedGenres: ['Pop Ballads', 'Alternative Rock'],
        suggestedMood: ['Epic', 'Passionate', 'Modern Romance']
      },
      {
        name: 'Dance Floor Fire',
        description: 'EDM, hip-hop, and current chart-toppers',
        moment: 'party',
        targetSongCount: 50,
        suggestedGenres: ['EDM', 'Hip-Hop', 'Pop', 'Latin'],
        suggestedMood: ['High Energy', 'Party', 'Current']
      }
    ]
  },
  {
    id: 'rustic-folk',
    name: 'Rustic & Folk',
    description: 'Indie folk, country, and Americana for a warm, intimate celebration',
    style: 'Barn weddings, outdoor ceremonies, and bohemian vibes',
    icon: '🌻',
    playlists: [
      {
        name: 'Acoustic Ceremony',
        description: 'Folk and acoustic guitar for a natural setting',
        moment: 'ceremony',
        targetSongCount: 12,
        suggestedGenres: ['Folk', 'Acoustic', 'Singer-Songwriter'],
        suggestedMood: ['Natural', 'Intimate', 'Heartfelt']
      },
      {
        name: 'Bluegrass Cocktails',
        description: 'Upbeat folk and bluegrass for mingling',
        moment: 'cocktail',
        targetSongCount: 20,
        suggestedGenres: ['Bluegrass', 'Folk Rock', 'Americana'],
        suggestedMood: ['Lively', 'Friendly', 'Rustic']
      },
      {
        name: 'Country Dinner',
        description: 'Modern country and folk for dining',
        moment: 'dinner',
        targetSongCount: 25,
        suggestedGenres: ['Country', 'Alt-Country', 'Folk Pop'],
        suggestedMood: ['Warm', 'Comfortable', 'Down-to-earth']
      },
      {
        name: 'Sweet First Dance',
        description: 'Heartfelt folk and country love songs',
        moment: 'first-dance',
        targetSongCount: 10,
        suggestedGenres: ['Country Love Songs', 'Folk Ballads'],
        suggestedMood: ['Sweet', 'Genuine', 'Touching']
      },
      {
        name: 'Barn Dance Party',
        description: 'Country hits and folk rock to get everyone moving',
        moment: 'party',
        targetSongCount: 40,
        suggestedGenres: ['Country Rock', 'Southern Rock', 'Folk Rock'],
        suggestedMood: ['Fun', 'Energetic', 'Feel-good']
      }
    ]
  },
  {
    id: 'cultural-fusion',
    name: 'Cultural Fusion',
    description: 'Blend traditional and modern music from multiple cultures',
    style: 'Multicultural celebrations and diverse weddings',
    icon: '🌍',
    playlists: [
      {
        name: 'Traditional Ceremony Mix',
        description: 'Cultural ceremony music with modern touches',
        moment: 'ceremony',
        targetSongCount: 15,
        suggestedGenres: ['Traditional', 'World Music', 'Fusion'],
        suggestedMood: ['Cultural', 'Meaningful', 'Heritage']
      },
      {
        name: 'Global Cocktail Hour',
        description: 'International lounge and world music',
        moment: 'cocktail',
        targetSongCount: 20,
        suggestedGenres: ['World Beat', 'Latin Jazz', 'Afrobeat'],
        suggestedMood: ['Worldly', 'Vibrant', 'Eclectic']
      },
      {
        name: 'Fusion Dinner',
        description: 'Cross-cultural dining music',
        moment: 'dinner',
        targetSongCount: 25,
        suggestedGenres: ['World Fusion', 'Global Pop', 'Crossover'],
        suggestedMood: ['Diverse', 'Harmonious', 'Interesting']
      },
      {
        name: 'Love Across Cultures',
        description: 'Romantic songs from around the world',
        moment: 'first-dance',
        targetSongCount: 10,
        suggestedGenres: ['International Love Songs', 'Multilingual'],
        suggestedMood: ['Universal Love', 'Cross-cultural', 'Beautiful']
      },
      {
        name: 'Global Dance Party',
        description: 'Dancing music from every continent',
        moment: 'party',
        targetSongCount: 45,
        suggestedGenres: ['Latin', 'Bollywood', 'Afrobeat', 'K-Pop', 'Reggaeton'],
        suggestedMood: ['International', 'Celebratory', 'Unity']
      }
    ]
  },
  {
    id: 'vintage-retro',
    name: 'Vintage & Retro',
    description: '50s through 80s classics for a nostalgic celebration',
    style: 'Retro-themed weddings and vintage lovers',
    icon: '📻',
    playlists: [
      {
        name: 'Classical Romance',
        description: 'Timeless classical pieces for the ceremony',
        moment: 'ceremony',
        targetSongCount: 12,
        suggestedGenres: ['Classical', 'Orchestral'],
        suggestedMood: ['Timeless', 'Grand', 'Traditional']
      },
      {
        name: 'Rat Pack Cocktails',
        description: 'Sinatra, Martin, and the classics',
        moment: 'cocktail',
        targetSongCount: 20,
        suggestedGenres: ['Rat Pack', 'Big Band', 'Swing'],
        suggestedMood: ['Classy', 'Smooth', 'Vintage Cool']
      },
      {
        name: 'Dinner Standards',
        description: 'Jazz standards and easy listening',
        moment: 'dinner',
        targetSongCount: 25,
        suggestedGenres: ['Standards', 'Easy Listening', 'Crooners'],
        suggestedMood: ['Nostalgic', 'Elegant', 'Comfortable']
      },
      {
        name: 'Classic First Dance',
        description: 'Timeless love songs from the golden era',
        moment: 'first-dance',
        targetSongCount: 10,
        suggestedGenres: ['Classic Love Songs', 'Standards'],
        suggestedMood: ['Romantic', 'Classic', 'Timeless']
      },
      {
        name: 'Decades Dance Party',
        description: 'Best hits from the 50s through 80s',
        moment: 'party',
        targetSongCount: 50,
        suggestedGenres: ['50s Rock', '60s Pop', '70s Disco', '80s Hits'],
        suggestedMood: ['Nostalgic', 'Fun', 'Crowd-pleasing']
      }
    ]
  },
  {
    id: 'intimate-minimal',
    name: 'Intimate & Minimal',
    description: 'Carefully curated for small, personal celebrations',
    style: 'Micro weddings and intimate gatherings',
    icon: '🕯️',
    playlists: [
      {
        name: 'Gentle Ceremony',
        description: 'Soft instrumentals for an intimate setting',
        moment: 'ceremony',
        targetSongCount: 8,
        suggestedGenres: ['Piano', 'String Quartet', 'Ambient'],
        suggestedMood: ['Gentle', 'Intimate', 'Personal']
      },
      {
        name: 'Quiet Conversations',
        description: 'Background music that doesn\'t overpower',
        moment: 'cocktail',
        targetSongCount: 15,
        suggestedGenres: ['Ambient Jazz', 'Soft Instrumental'],
        suggestedMood: ['Subtle', 'Conversational', 'Peaceful']
      },
      {
        name: 'Intimate Dinner',
        description: 'Carefully selected dinner accompaniment',
        moment: 'dinner',
        targetSongCount: 20,
        suggestedGenres: ['Chamber Music', 'Acoustic', 'Soft Jazz'],
        suggestedMood: ['Intimate', 'Warm', 'Close']
      },
      {
        name: 'Personal Moments',
        description: 'Meaningful songs for special dances',
        moment: 'first-dance',
        targetSongCount: 6,
        suggestedGenres: ['Singer-Songwriter', 'Acoustic Love Songs'],
        suggestedMood: ['Personal', 'Meaningful', 'Touching']
      },
      {
        name: 'Close Friends Dancing',
        description: 'Feel-good favorites for your inner circle',
        moment: 'party',
        targetSongCount: 30,
        suggestedGenres: ['Indie', 'Alternative', 'Feel-good Pop'],
        suggestedMood: ['Joyful', 'Personal', 'Memorable']
      }
    ]
  }
]