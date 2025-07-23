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

// Sample songs for playlists (in production, these would come from Spotify API)
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
  previewUrl: undefined,
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
    totalDuration: 1200,
    curator: 'Wedding Music Expert',
    popularityScore: 95,
    songs: [
      createSong('1', 'At Last', 'Etta James', 182, 2, ['soul', 'jazz']),
      createSong('2', 'The Way You Look Tonight', 'Frank Sinatra', 221, 2, ['jazz', 'standards']),
      createSong('3', 'Unchained Melody', 'The Righteous Brothers', 217, 2, ['oldies', 'soul']),
      createSong('4', "Can't Help Falling in Love", 'Elvis Presley', 181, 2, ['rock', 'oldies']),
      createSong('5', 'L-O-V-E', 'Nat King Cole', 152, 2, ['jazz', 'standards'])
    ]
  },
  {
    id: 'modern-first-dance',
    name: 'Modern Romance',
    description: "Contemporary love songs for today's couples",
    momentId: 'first-dance',
    icon: '✨',
    vibe: ['modern', 'romantic', 'contemporary'],
    totalDuration: 1350,
    curator: 'Wedding Music Expert',
    popularityScore: 92,
    songs: [
      createSong('6', 'Perfect', 'Ed Sheeran', 263, 2, ['pop']),
      createSong('7', 'All of Me', 'John Legend', 269, 2, ['pop', 'r&b']),
      createSong('8', 'Marry Me', 'Train', 220, 2, ['pop', 'rock']),
      createSong('9', 'A Thousand Years', 'Christina Perri', 285, 2, ['pop']),
      createSong('10', 'Thinking Out Loud', 'Ed Sheeran', 281, 2, ['pop'])
    ]
  },
  {
    id: 'upbeat-processional',
    name: 'Joyful Entrance',
    description: 'Uplifting processional music to celebrate your walk',
    momentId: 'processional',
    icon: '🎊',
    vibe: ['joyful', 'uplifting', 'celebratory'],
    totalDuration: 900,
    curator: 'Wedding Music Expert',
    popularityScore: 88,
    songs: [
      createSong('11', 'Marry You', 'Bruno Mars', 230, 4, ['pop']),
      createSong('12', 'Signed, Sealed, Delivered', 'Stevie Wonder', 181, 4, ['soul', 'motown']),
      createSong('13', 'I Choose You', 'Sara Bareilles', 244, 3, ['pop']),
      createSong('14', 'Home', 'Edward Sharpe & The Magnetic Zeros', 245, 3, ['indie', 'folk'])
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
    totalDuration: 2400,
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
      createSong('36', 'Shake It Off', 'Taylor Swift', 219, 4, ['pop'])
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