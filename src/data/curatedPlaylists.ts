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
  },
  {
    id: 'indie-romance',
    name: 'Indie Love Stories',
    description: 'Alternative and indie gems for the non-traditional couple',
    momentId: 'first-dance',
    icon: '🎸',
    vibe: ['indie', 'alternative', 'unique'],
    totalDuration: 3200,
    curator: 'Wedding Music Expert',
    popularityScore: 84,
    songs: [
      createSong('105', 'First Day of My Life', 'Bright Eyes', 188, 2, ['indie', 'folk']),
      createSong('106', 'Such Great Heights', 'The Postal Service', 266, 2, ['indie', 'electronic']),
      createSong('107', 'Falling Slowly', 'Glen Hansard & Marketa Irglova', 237, 2, ['indie', 'folk']),
      createSong('108', 'The Book of Love', 'The Magnetic Fields', 155, 2, ['indie', 'alternative']),
      createSong('109', 'Sea of Love', 'Cat Power', 143, 2, ['indie', 'alternative']),
      createSong('110', 'To Build a Home', 'The Cinematic Orchestra', 347, 2, ['ambient', 'indie']),
      createSong('111', 'Lover', 'First Aid Kit', 244, 2, ['indie', 'folk']),
      createSong('112', 'Rivers and Roads', 'The Head and the Heart', 290, 2, ['indie', 'folk']),
      createSong('113', 'Heartbeats', 'José González', 152, 2, ['indie', 'acoustic']),
      createSong('114', 'Skinny Love', 'Bon Iver', 238, 2, ['indie', 'folk']),
      createSong('115', 'Real Love Baby', 'Father John Misty', 182, 2, ['indie', 'rock']),
      createSong('116', 'Dreams Tonite', 'Alvvays', 192, 2, ['indie', 'dream pop'])
    ]
  },
  {
    id: 'country-wedding',
    name: 'Country Wedding Classics',
    description: 'Boot-scootin' favorites for a down-home celebration',
    momentId: 'party',
    icon: '🤠',
    vibe: ['country', 'fun', 'line-dance'],
    totalDuration: 3600,
    curator: 'Wedding Music Expert',
    popularityScore: 86,
    songs: [
      createSong('117', 'Wagon Wheel', 'Darius Rucker', 235, 4, ['country']),
      createSong('118', 'Cotton Eyed Joe', 'Rednex', 193, 5, ['country', 'dance']),
      createSong('119', 'Friends in Low Places', 'Garth Brooks', 278, 4, ['country']),
      createSong('120', 'Boot Scootin\' Boogie', 'Brooks & Dunn', 221, 5, ['country']),
      createSong('121', 'Chicken Fried', 'Zac Brown Band', 238, 3, ['country']),
      createSong('122', 'Cruise', 'Florida Georgia Line', 209, 4, ['country', 'pop']),
      createSong('123', 'Copperhead Road', 'Steve Earle', 262, 4, ['country', 'rock']),
      createSong('124', 'Save a Horse (Ride a Cowboy)', 'Big & Rich', 200, 5, ['country']),
      createSong('125', 'Achy Breaky Heart', 'Billy Ray Cyrus', 203, 4, ['country']),
      createSong('126', 'Man! I Feel Like a Woman!', 'Shania Twain', 232, 4, ['country', 'pop']),
      createSong('127', 'Watermelon Crawl', 'Tracy Byrd', 199, 4, ['country']),
      createSong('128', 'Honey Bee', 'Blake Shelton', 216, 3, ['country'])
    ]
  },
  {
    id: 'soul-motown-ceremony',
    name: 'Soul & Motown Ceremony',
    description: 'Soulful classics for a ceremony filled with joy and meaning',
    momentId: 'ceremony',
    icon: '🎤',
    vibe: ['soul', 'joyful', 'classic'],
    totalDuration: 2400,
    curator: 'Wedding Music Expert',
    popularityScore: 88,
    songs: [
      createSong('129', 'Chapel of Love', 'The Dixie Cups', 171, 3, ['soul', 'oldies']),
      createSong('130', 'You Send Me', 'Sam Cooke', 177, 2, ['soul', 'r&b']),
      createSong('131', 'For Once in My Life', 'Stevie Wonder', 172, 3, ['soul', 'motown']),
      createSong('132', 'Ain\'t No Mountain High Enough', 'Marvin Gaye & Tammi Terrell', 149, 4, ['soul', 'motown']),
      createSong('133', 'This Will Be (An Everlasting Love)', 'Natalie Cole', 168, 3, ['soul', 'r&b']),
      createSong('134', 'Natural Woman', 'Aretha Franklin', 169, 2, ['soul', 'r&b']),
      createSong('135', 'I Say a Little Prayer', 'Aretha Franklin', 217, 3, ['soul', 'pop']),
      createSong('136', 'Ribbon in the Sky', 'Stevie Wonder', 409, 2, ['soul', 'r&b']),
      createSong('137', 'All I Need', 'Method Man ft. Mary J. Blige', 235, 3, ['hip hop', 'soul']),
      createSong('138', 'Cupid', 'Sam Cooke', 153, 3, ['soul', 'oldies'])
    ]
  },
  {
    id: 'latin-fiesta',
    name: 'Latin Fiesta',
    description: 'Salsa, reggaeton, and Latin hits to spice up the dance floor',
    momentId: 'party',
    icon: '💃',
    vibe: ['latin', 'energetic', 'dance'],
    totalDuration: 3300,
    curator: 'Wedding Music Expert',
    popularityScore: 91,
    songs: [
      createSong('139', 'Vivir Mi Vida', 'Marc Anthony', 252, 5, ['salsa', 'latin']),
      createSong('140', 'Despacito', 'Luis Fonsi ft. Daddy Yankee', 228, 4, ['reggaeton', 'latin']),
      createSong('141', 'La Bamba', 'Ritchie Valens', 126, 4, ['latin', 'rock']),
      createSong('142', 'Suavemente', 'Elvis Crespo', 278, 5, ['merengue', 'latin']),
      createSong('143', 'Danza Kuduro', 'Lucenzo & Don Omar', 197, 5, ['reggaeton', 'latin']),
      createSong('144', 'Bailando', 'Enrique Iglesias', 242, 4, ['latin', 'pop']),
      createSong('145', 'Gasolina', 'Daddy Yankee', 192, 5, ['reggaeton', 'latin']),
      createSong('146', 'Conga', 'Gloria Estefan', 262, 5, ['latin', 'pop']),
      createSong('147', 'Livin\' la Vida Loca', 'Ricky Martin', 244, 5, ['latin', 'pop']),
      createSong('148', 'Bamboleo', 'Gipsy Kings', 206, 4, ['flamenco', 'latin']),
      createSong('149', 'Oye Como Va', 'Santana', 254, 4, ['latin', 'rock']),
      createSong('150', 'La Vida Es Un Carnaval', 'Celia Cruz', 242, 4, ['salsa', 'latin'])
    ]
  },
  {
    id: 'acoustic-sunset',
    name: 'Acoustic Sunset Vibes',
    description: 'Gentle acoustic melodies perfect for golden hour moments',
    momentId: 'cocktail',
    icon: '🌅',
    vibe: ['acoustic', 'mellow', 'sunset'],
    totalDuration: 2800,
    curator: 'Wedding Music Expert',
    popularityScore: 83,
    songs: [
      createSong('151', 'Banana Pancakes', 'Jack Johnson', 191, 1, ['acoustic', 'beach']),
      createSong('152', 'Better Together', 'Jack Johnson', 207, 2, ['acoustic', 'folk']),
      createSong('153', 'Budapest', 'George Ezra', 201, 2, ['pop', 'acoustic']),
      createSong('154', 'Riptide', 'Vance Joy', 204, 2, ['indie', 'folk']),
      createSong('155', 'Fire and Rain', 'James Taylor', 200, 1, ['folk', 'acoustic']),
      createSong('156', 'The Scientist', 'Coldplay', 309, 2, ['alternative', 'acoustic']),
      createSong('157', 'Wonderwall', 'Oasis', 258, 2, ['rock', 'acoustic']),
      createSong('158', 'I\'m Yours', 'Jason Mraz', 242, 2, ['pop', 'acoustic']),
      createSong('159', 'Hey There Delilah', 'Plain White T\'s', 232, 2, ['rock', 'acoustic']),
      createSong('160', 'Fast Car', 'Tracy Chapman', 296, 2, ['folk', 'acoustic']),
      createSong('161', 'Hallelujah', 'Jeff Buckley', 414, 2, ['alternative', 'acoustic']),
      createSong('162', 'Blackbird', 'The Beatles', 138, 1, ['rock', 'acoustic'])
    ]
  },
  {
    id: 'r&b-slow-jams',
    name: 'R&B Slow Jams',
    description: 'Smooth R&B for when you want to slow it down',
    momentId: 'party',
    icon: '🎶',
    vibe: ['r&b', 'smooth', 'romantic'],
    totalDuration: 3100,
    curator: 'Wedding Music Expert',
    popularityScore: 89,
    songs: [
      createSong('163', 'Let\'s Get Married', 'Jagged Edge', 241, 3, ['r&b']),
      createSong('164', 'Best Part', 'Daniel Caesar ft. H.E.R.', 209, 2, ['r&b', 'soul']),
      createSong('165', 'Adorn', 'Miguel', 193, 3, ['r&b']),
      createSong('166', 'Sure Thing', 'Miguel', 196, 3, ['r&b']),
      createSong('167', 'All My Life', 'K-Ci & JoJo', 331, 2, ['r&b']),
      createSong('168', 'I Swear', 'All-4-One', 262, 2, ['r&b', 'pop']),
      createSong('169', 'End of the Road', 'Boyz II Men', 350, 2, ['r&b']),
      createSong('170', 'I\'ll Make Love to You', 'Boyz II Men', 234, 2, ['r&b']),
      createSong('171', 'Drunk in Love', 'Beyoncé ft. Jay-Z', 323, 3, ['r&b', 'hip hop']),
      createSong('172', 'Love', 'Keyshia Cole', 252, 2, ['r&b']),
      createSong('173', 'We Belong Together', 'Mariah Carey', 200, 2, ['r&b', 'pop']),
      createSong('174', 'No Scrubs', 'TLC', 214, 3, ['r&b', 'hip hop'])
    ]
  },
  {
    id: 'hidden-gems',
    name: 'Hidden Wedding Gems',
    description: 'Lesser-known songs that will make your wedding unique',
    momentId: 'general',
    icon: '💎',
    vibe: ['unique', 'discovery', 'eclectic'],
    totalDuration: 2900,
    curator: 'Wedding Music Expert',
    popularityScore: 79,
    songs: [
      createSong('175', 'Northern Wind', 'City and Colour', 296, 2, ['indie', 'folk']),
      createSong('176', 'Flightless Bird, American Mouth', 'Iron & Wine', 241, 2, ['indie', 'folk']),
      createSong('177', 'Dancing in the Dark', 'Rihanna', 247, 2, ['alternative', 'electronic']),
      createSong('178', 'Cosmic Love', 'Florence + The Machine', 281, 3, ['indie', 'alternative']),
      createSong('179', 'Into the Mystic', 'Van Morrison', 209, 2, ['rock', 'folk']),
      createSong('180', 'The Night We Met', 'Lord Huron', 208, 2, ['indie', 'folk']),
      createSong('181', 'I Choose You', 'The Teskey Brothers', 241, 2, ['soul', 'blues']),
      createSong('182', 'Love Like This', 'Ben Rector', 208, 2, ['pop', 'indie']),
      createSong('183', 'Calypso', 'John Denver', 219, 2, ['folk', 'country']),
      createSong('184', 'Electric Love', 'BØRNS', 218, 3, ['indie', 'electropop']),
      createSong('185', 'Bloom', 'The Paper Kites', 331, 2, ['indie', 'folk']),
      createSong('186', 'In My Life', 'The Beatles', 147, 2, ['rock', 'pop'])
    ]
  },
  {
    id: 'cultural-fusion',
    name: 'Cultural Fusion Celebration',
    description: 'A world music journey celebrating diverse traditions',
    momentId: 'general',
    icon: '🌍',
    vibe: ['multicultural', 'diverse', 'global'],
    totalDuration: 3400,
    curator: 'Wedding Music Expert',
    popularityScore: 81,
    songs: [
      createSong('187', 'Could You Be Loved', 'Bob Marley', 237, 3, ['reggae']),
      createSong('188', 'Mas Que Nada', 'Sergio Mendes', 181, 3, ['bossa nova', 'brazilian']),
      createSong('189', 'Mundian To Bach Ke', 'Panjabi MC', 236, 4, ['bhangra', 'indian']),
      createSong('190', 'Alors on Danse', 'Stromae', 205, 4, ['french', 'electronic']),
      createSong('191', 'Didi', 'Khaled', 278, 4, ['arabic', 'world']),
      createSong('192', 'Jerusalema', 'Master KG', 324, 4, ['afrobeat', 'african']),
      createSong('193', 'Chan Chan', 'Buena Vista Social Club', 256, 2, ['cuban', 'latin']),
      createSong('194', 'Zorba\'s Dance', 'Mikis Theodorakis', 246, 4, ['greek', 'traditional']),
      createSong('195', 'Bella Ciao', 'Traditional Italian', 193, 3, ['italian', 'folk']),
      createSong('196', 'Hava Nagila', 'Traditional Jewish', 189, 4, ['jewish', 'traditional']),
      createSong('197', 'Gangnam Style', 'PSY', 219, 5, ['k-pop', 'korean']),
      createSong('198', 'Ai Se Eu Te Pego', 'Michel Teló', 163, 4, ['brazilian', 'sertanejo'])
    ]
  },
  {
    id: 'jazz-brunch',
    name: 'Sunday Jazz Brunch',
    description: 'Smooth jazz perfect for a morning or brunch reception',
    momentId: 'dinner',
    icon: '☕',
    vibe: ['jazz', 'brunch', 'relaxed'],
    totalDuration: 2600,
    curator: 'Wedding Music Expert',
    popularityScore: 80,
    songs: [
      createSong('199', 'Sunday Morning', 'The Velvet Underground', 177, 1, ['rock', 'alternative']),
      createSong('200', 'Blue in Green', 'Miles Davis', 327, 1, ['jazz']),
      createSong('201', 'Lullaby of Birdland', 'Sarah Vaughan', 238, 2, ['jazz', 'vocal']),
      createSong('202', 'Misty', 'Erroll Garner', 177, 1, ['jazz', 'piano']),
      createSong('203', 'Body and Soul', 'Coleman Hawkins', 181, 1, ['jazz']),
      createSong('204', 'In a Sentimental Mood', 'Duke Ellington & John Coltrane', 262, 1, ['jazz']),
      createSong('205', 'Autumn in New York', 'Billie Holiday', 198, 1, ['jazz', 'vocal']),
      createSong('206', 'Wave', 'Antonio Carlos Jobim', 177, 1, ['bossa nova', 'jazz']),
      createSong('207', 'My Funny Valentine', 'Chet Baker', 140, 1, ['jazz', 'vocal']),
      createSong('208', 'Round Midnight', 'Thelonious Monk', 197, 1, ['jazz', 'bebop']),
      createSong('209', 'Embraceable You', 'Nat King Cole', 217, 1, ['jazz', 'standards']),
      createSong('210', 'When Sunny Gets Blue', 'Johnny Mathis', 213, 1, ['jazz', 'vocal'])
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