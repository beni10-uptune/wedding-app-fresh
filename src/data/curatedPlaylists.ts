import { Song } from '@/types/wedding-v2'

export interface CuratedPlaylist {
  id: string
  name: string
  description: string
  momentId: string
  icon: string
  vibe: string[]
  songs: Song[]
  totalDuration: number // seconds
  curator: string
  popularityScore: number // 1-100
}

// IMPORTANT: These songs currently use PLACEHOLDER IDs (1, 2, 3, etc.)
// For Spotify previews to work, these need to be replaced with real Spotify Track IDs
// Real Spotify IDs are 22 characters long (e.g., '2tpWsVSb9UEmDRxAl1zhX1')
// 
// To update with real Spotify data:
// 1. Replace the 'id' parameter with the actual Spotify track ID
// 2. The spotifyUri will automatically be generated correctly
// 3. Consider adding real album, albumArt, and previewUrl data from Spotify API
//
// Example format for real Spotify data:
// createSong('2tpWsVSb9UEmDRxAl1zhX1', 'At Last', 'Etta James', 182, 2, ['soul', 'jazz'])

const createSong = (
  id: string,
  title: string,
  artist: string,
  duration: number,
  energyLevel: 1 | 2 | 3 | 4 | 5,
  genres: string[]
): Song => ({
  id,
  title,
  artist,
  duration,
  energyLevel,
  explicit: false,
  generationAppeal: ['millennial', 'gen_z', 'gen_x'],
  genres,
  spotifyUri: `spotify:track:${id}`,
  previewUrl: undefined, // Will be populated when using real Spotify IDs
  bpm: undefined,
  audioFeatures: undefined
})

export const curatedPlaylists: CuratedPlaylist[] = [
  {
    id: 'classic-first-dance',
    name: 'Timeless First Dance',
    description: 'Classic romantic songs that have stood the test of time',
    momentId: 'first-dance',
    icon: '💕',
    vibe: ['romantic', 'classic', 'elegant'],
    totalDuration: 3600,
    curator: 'Wedding Music Expert',
    popularityScore: 95,
    songs: [
      createSong('1', 'At Last', 'Etta James', 182, 2, ['soul', 'jazz']),
      createSong('2', 'The Way You Look Tonight', 'Frank Sinatra', 221, 2, ['jazz', 'standards']),
      createSong('3', 'Unchained Melody', 'The Righteous Brothers', 217, 2, ['oldies', 'soul']),
      createSong('4', "Can't Help Falling in Love", 'Elvis Presley', 181, 2, ['rock', 'oldies']),
      createSong('5', 'L-O-V-E', 'Nat King Cole', 152, 2, ['jazz', 'standards']),
      createSong('56', 'Fly Me to the Moon', 'Frank Sinatra', 146, 2, ['jazz', 'standards']),
      createSong('57', 'What a Wonderful World', 'Louis Armstrong', 140, 2, ['jazz', 'standards']),
      createSong('58', 'Stand by Me', 'Ben E. King', 178, 2, ['soul', 'r&b']),
      createSong('59', 'Let\'s Stay Together', 'Al Green', 197, 2, ['soul', 'r&b']),
      createSong('60', 'My Girl', 'The Temptations', 165, 2, ['soul', 'motown']),
      createSong('61', 'Wonderful Tonight', 'Eric Clapton', 238, 2, ['rock', 'soft rock']),
      createSong('62', 'Your Song', 'Elton John', 241, 2, ['pop', 'rock']),
      createSong('63', 'Make You Feel My Love', 'Bob Dylan', 212, 2, ['folk', 'rock']),
      createSong('64', 'The Luckiest', 'Ben Folds', 263, 2, ['alternative', 'piano rock']),
      createSong('65', 'Endless Love', 'Diana Ross & Lionel Richie', 267, 2, ['soul', 'pop']),
      createSong('66', 'I Don\'t Want to Miss a Thing', 'Aerosmith', 298, 3, ['rock', 'ballad']),
      createSong('67', 'Everything', 'Michael Bublé', 213, 2, ['pop', 'jazz']),
      createSong('68', 'Have I Told You Lately', 'Rod Stewart', 239, 2, ['pop', 'rock'])
    ]
  },
  {
    id: 'modern-first-dance',
    name: 'Modern Romance',
    description: "Contemporary love songs for today's couples",
    momentId: 'first-dance',
    icon: '✨',
    vibe: ['modern', 'romantic', 'contemporary'],
    totalDuration: 3900,
    curator: 'Wedding Music Expert',
    popularityScore: 92,
    songs: [
      createSong('6', 'Perfect', 'Ed Sheeran', 263, 2, ['pop']),
      createSong('7', 'All of Me', 'John Legend', 269, 2, ['pop', 'r&b']),
      createSong('8', 'Marry Me', 'Train', 220, 2, ['pop', 'rock']),
      createSong('9', 'A Thousand Years', 'Christina Perri', 285, 2, ['pop']),
      createSong('10', 'Thinking Out Loud', 'Ed Sheeran', 281, 2, ['pop']),
      createSong('69', 'Speechless', 'Dan + Shay', 218, 2, ['country', 'pop']),
      createSong('70', 'Die a Happy Man', 'Thomas Rhett', 227, 2, ['country']),
      createSong('71', 'Marry You', 'Bruno Mars', 230, 3, ['pop']),
      createSong('72', 'XO', 'Beyoncé', 213, 2, ['pop', 'r&b']),
      createSong('73', 'Lover', 'Taylor Swift', 221, 2, ['pop']),
      createSong('74', 'Better Days', 'OneRepublic', 205, 2, ['pop', 'rock']),
      createSong('75', 'Say You Won\'t Let Go', 'James Arthur', 211, 2, ['pop']),
      createSong('76', 'Heaven', 'Kane Brown', 169, 2, ['country']),
      createSong('77', 'Amazed', 'Lonestar', 240, 2, ['country']),
      createSong('78', 'I Get to Love You', 'Ruelle', 214, 2, ['indie', 'alternative']),
      createSong('79', 'Grow Old With Me', 'Tom Odell', 189, 2, ['alternative', 'indie']),
      createSong('80', 'Love Someone', 'Lukas Graham', 194, 2, ['pop']),
      createSong('81', 'Yours', 'Russell Dickerson', 231, 2, ['country']),
      createSong('82', 'From the Ground Up', 'Dan + Shay', 236, 2, ['country'])
    ]
  },
  {
    id: 'upbeat-processional',
    name: 'Joyful Entrance',
    description: 'Uplifting processional music to celebrate your walk',
    momentId: 'processional',
    icon: '🎊',
    vibe: ['joyful', 'uplifting', 'celebratory'],
    totalDuration: 3000,
    curator: 'Wedding Music Expert',
    popularityScore: 88,
    songs: [
      createSong('11', 'Marry You', 'Bruno Mars', 230, 4, ['pop']),
      createSong('12', 'Signed, Sealed, Delivered', 'Stevie Wonder', 181, 4, ['soul', 'motown']),
      createSong('13', 'I Choose You', 'Sara Bareilles', 244, 3, ['pop']),
      createSong('14', 'Home', 'Edward Sharpe & The Magnetic Zeros', 245, 3, ['indie', 'folk']),
      createSong('83', 'Good Day Sunshine', 'The Beatles', 129, 3, ['rock', 'pop']),
      createSong('84', 'Here Comes the Sun', 'The Beatles', 185, 3, ['rock', 'pop']),
      createSong('85', 'Beautiful Day', 'U2', 248, 3, ['rock']),
      createSong('86', 'Walking on Sunshine', 'Katrina and the Waves', 239, 4, ['pop', 'new wave']),
      createSong('87', 'Lovely Day', 'Bill Withers', 254, 3, ['soul', 'r&b']),
      createSong('88', 'Best Day of My Life', 'American Authors', 194, 4, ['indie', 'pop']),
      createSong('89', 'On Top of the World', 'Imagine Dragons', 192, 4, ['pop', 'rock']),
      createSong('90', 'Brighter Than the Sun', 'Colbie Caillat', 231, 3, ['pop']),
      createSong('91', 'Love on Top', 'Beyoncé', 267, 4, ['pop', 'r&b']),
      createSong('92', 'A Sky Full of Stars', 'Coldplay', 268, 3, ['pop', 'rock']),
      createSong('93', 'Sugar', 'Maroon 5', 235, 4, ['pop']),
      createSong('94', 'Ho Hey', 'The Lumineers', 163, 3, ['indie', 'folk'])
    ]
  },
  {
    id: 'elegant-dinner',
    name: 'Sophisticated Dining',
    description: 'Refined background music for dinner conversation',
    momentId: 'dinner',
    icon: '🍷',
    vibe: ['sophisticated', 'elegant', 'background'],
    totalDuration: 3600,
    curator: 'Wedding Music Expert',
    popularityScore: 85,
    songs: [
      createSong('15', 'Fly Me to the Moon', 'Michael Bublé', 206, 2, ['jazz', 'standards']),
      createSong('16', 'Come Away With Me', 'Norah Jones', 198, 1, ['jazz', 'pop']),
      createSong('17', 'The Girl from Ipanema', 'Stan Getz & Astrud Gilberto', 285, 1, ['bossa nova', 'jazz']),
      createSong('18', 'Beyond the Sea', 'Bobby Darin', 173, 2, ['jazz', 'standards']),
      createSong('19', 'Dream a Little Dream of Me', 'Ella Fitzgerald', 188, 1, ['jazz']),
      createSong('20', 'Cheek to Cheek', 'Tony Bennett & Lady Gaga', 191, 2, ['jazz', 'standards']),
      createSong('21', 'What a Wonderful World', 'Louis Armstrong', 140, 1, ['jazz', 'standards']),
      createSong('22', 'Moondance', 'Van Morrison', 273, 2, ['rock', 'soul']),
      createSong('23', 'La Vie En Rose', 'Édith Piaf', 207, 1, ['french', 'chanson']),
      createSong('24', 'Feeling Good', 'Michael Bublé', 236, 2, ['jazz', 'pop']),
      createSong('25', 'Sway', 'Michael Bublé', 190, 2, ['latin', 'jazz']),
      createSong('26', 'Save the Last Dance for Me', 'Michael Bublé', 224, 2, ['jazz', 'pop'])
    ]
  },
  {
    id: 'party-starters',
    name: 'Dance Floor Igniters',
    description: 'Guaranteed crowd-pleasers to pack the dance floor',
    momentId: 'party',
    icon: '🔥',
    vibe: ['high-energy', 'fun', 'crowd-pleaser'],
    totalDuration: 4200,
    curator: 'Wedding Music Expert',
    popularityScore: 98,
    songs: [
      createSong('27', 'Uptown Funk', 'Mark Ronson ft. Bruno Mars', 269, 5, ['funk', 'pop']),
      createSong('28', 'September', 'Earth, Wind & Fire', 215, 5, ['funk', 'disco']),
      createSong('29', 'I Wanna Dance with Somebody', 'Whitney Houston', 291, 5, ['pop', 'dance']),
      createSong('30', 'Shut Up and Dance', 'Walk the Moon', 198, 5, ['pop', 'rock']),
      createSong('31', "Can't Stop the Feeling!", 'Justin Timberlake', 236, 5, ['pop', 'dance']),
      createSong('32', 'Happy', 'Pharrell Williams', 233, 4, ['pop']),
      createSong('33', 'Celebration', 'Kool & The Gang', 218, 5, ['funk', 'disco']),
      createSong('34', 'Dancing Queen', 'ABBA', 232, 4, ['pop', 'disco']),
      createSong('35', 'Mr. Brightside', 'The Killers', 222, 4, ['rock', 'indie']),
      createSong('36', 'Shake It Off', 'Taylor Swift', 219, 4, ['pop']),
      createSong('95', '24K Magic', 'Bruno Mars', 226, 5, ['funk', 'pop']),
      createSong('96', 'Levitating', 'Dua Lipa', 203, 5, ['pop', 'disco']),
      createSong('97', 'Blinding Lights', 'The Weeknd', 200, 4, ['pop', 'synth']),
      createSong('98', 'I Gotta Feeling', 'The Black Eyed Peas', 289, 5, ['pop', 'dance']),
      createSong('99', 'Dynamite', 'Taio Cruz', 202, 5, ['pop', 'dance']),
      createSong('100', 'Timber', 'Pitbull ft. Ke$ha', 204, 5, ['pop', 'country']),
      createSong('101', 'Yeah!', 'Usher ft. Lil Jon & Ludacris', 250, 5, ['hip hop', 'crunk']),
      createSong('102', 'Crazy in Love', 'Beyoncé ft. Jay-Z', 236, 5, ['pop', 'r&b']),
      createSong('103', 'Pump It', 'The Black Eyed Peas', 213, 5, ['hip hop', 'dance']),
      createSong('104', 'Get Lucky', 'Daft Punk ft. Pharrell Williams', 369, 4, ['disco', 'funk'])
    ]
  },
  {
    id: 'multi-gen-party',
    name: 'All Ages Dance Party',
    description: 'Songs that get every generation on the dance floor',
    momentId: 'party',
    icon: '🎉',
    vibe: ['inclusive', 'nostalgic', 'fun'],
    totalDuration: 2100,
    curator: 'Wedding Music Expert',
    popularityScore: 90,
    songs: [
      createSong('37', 'Sweet Caroline', 'Neil Diamond', 201, 3, ['pop', 'rock']),
      createSong('38', "Don't Stop Believin'", 'Journey', 250, 4, ['rock']),
      createSong('39', 'Twist and Shout', 'The Beatles', 156, 4, ['rock', 'oldies']),
      createSong('40', 'Build Me Up Buttercup', 'The Foundations', 178, 3, ['oldies', 'soul']),
      createSong('41', 'Footloose', 'Kenny Loggins', 226, 4, ['rock', 'pop']),
      createSong('42', 'Love Shack', 'The B-52s', 249, 4, ['rock', 'new wave']),
      createSong('43', 'We Are Family', 'Sister Sledge', 218, 4, ['disco', 'funk']),
      createSong('44', 'Respect', 'Aretha Franklin', 147, 4, ['soul', 'r&b']),
      createSong('45', 'Brown Eyed Girl', 'Van Morrison', 185, 3, ['rock'])
    ]
  },
  {
    id: 'cocktail-jazz',
    name: 'Cocktail Hour Jazz',
    description: 'Sophisticated jazz for mingling and conversation',
    momentId: 'cocktail',
    icon: '🥂',
    vibe: ['sophisticated', 'jazz', 'conversational'],
    totalDuration: 2700,
    curator: 'Wedding Music Expert',
    popularityScore: 82,
    songs: [
      createSong('46', 'Take Five', 'Dave Brubeck Quartet', 324, 2, ['jazz']),
      createSong('47', 'Autumn Leaves', 'Bill Evans Trio', 342, 1, ['jazz']),
      createSong('48', 'Blue Bossa', 'Joe Henderson', 376, 2, ['jazz', 'latin']),
      createSong('49', 'So What', 'Miles Davis', 565, 2, ['jazz']),
      createSong('50', 'Georgia on My Mind', 'Ray Charles', 218, 2, ['jazz', 'soul']),
      createSong('51', 'Summertime', 'Ella Fitzgerald', 179, 1, ['jazz']),
      createSong('52', 'All of Me', 'Billie Holiday', 195, 1, ['jazz'])
    ]
  },
  {
    id: 'epic-last-dance',
    name: 'Grand Finale',
    description: 'End your celebration on the highest note',
    momentId: 'last-dance',
    icon: '🌟',
    vibe: ['epic', 'memorable', 'emotional'],
    totalDuration: 600,
    curator: 'Wedding Music Expert',
    popularityScore: 87,
    songs: [
      createSong('53', 'Time of My Life', 'Bill Medley & Jennifer Warnes', 289, 4, ['pop', 'rock']),
      createSong('54', 'Closing Time', 'Semisonic', 264, 3, ['rock', 'alternative']),
      createSong('55', 'Save the Last Dance for Me', 'The Drifters', 152, 3, ['oldies', 'r&b'])
    ]
  }
]

export function getPlaylistsByMoment(momentId: string): CuratedPlaylist[] {
  return curatedPlaylists.filter(playlist => playlist.momentId === momentId)
}

export function getPlaylistsByVibe(vibe: string): CuratedPlaylist[] {
  return curatedPlaylists.filter(playlist => playlist.vibe.includes(vibe))
}

export function getPopularPlaylists(limit: number = 5): CuratedPlaylist[] {
  return [...curatedPlaylists]
    .sort((a, b) => b.popularityScore - a.popularityScore)
    .slice(0, limit)
}