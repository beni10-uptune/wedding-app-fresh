// Central export for all genre wedding songs
export { 
  HIP_HOP_WEDDING_SONGS, 
  HIP_HOP_SONGS_BY_MOMENT,
  hipHopWeddingSongsCollection 
} from './hip-hop-wedding-songs'

export { 
  COUNTRY_WEDDING_SONGS,
  COUNTRY_SONGS_BY_MOMENT,
  countryWeddingSongsCollection 
} from './country-wedding-songs'

export { 
  RNB_WEDDING_SONGS,
  RNB_SONGS_BY_MOMENT,
  rnbWeddingSongsCollection 
} from './rnb-wedding-songs'

export { 
  ROCK_WEDDING_SONGS,
  ROCK_SONGS_BY_MOMENT,
  rockWeddingSongsCollection 
} from './rock-wedding-songs'

export { 
  INDIE_WEDDING_SONGS,
  INDIE_SONGS_BY_MOMENT,
  indieWeddingSongsCollection 
} from './indie-wedding-songs'

// Combined exports
import { HIP_HOP_WEDDING_SONGS } from './hip-hop-wedding-songs'
import { COUNTRY_WEDDING_SONGS } from './country-wedding-songs'
import { RNB_WEDDING_SONGS } from './rnb-wedding-songs'
import { ROCK_WEDDING_SONGS } from './rock-wedding-songs'
import { INDIE_WEDDING_SONGS } from './indie-wedding-songs'

export const ALL_GENRE_WEDDING_SONGS = [
  ...HIP_HOP_WEDDING_SONGS,
  ...COUNTRY_WEDDING_SONGS,
  ...RNB_WEDDING_SONGS,
  ...ROCK_WEDDING_SONGS,
  ...INDIE_WEDDING_SONGS
]

export const GENRE_COLLECTIONS = {
  'hip-hop': HIP_HOP_WEDDING_SONGS,
  'country': COUNTRY_WEDDING_SONGS,
  'r&b': RNB_WEDDING_SONGS,
  'rock': ROCK_WEDDING_SONGS,
  'indie': INDIE_WEDDING_SONGS
}

export const GENRE_NAMES = {
  'hip-hop': 'Hip Hop',
  'country': 'Country',
  'r&b': 'R&B',
  'rock': 'Rock',
  'indie': 'Indie'
} as const