/**
 * Essential US/UK Wedding Songs
 * These are the must-have songs for any wedding playlist
 */

import { Song } from '@/types/wedding-v2'

export const ESSENTIAL_UK_SONGS: Partial<Song>[] = [
  // Ed Sheeran - UK's wedding king
  {
    id: '0tgVpDi06FyKpA1z0VMD4v',
    title: 'Perfect',
    artist: 'Ed Sheeran',
    album: '÷ (Divide)',
    duration: 263,
    energyLevel: 2,
    explicit: false,
    genres: ['pop', 'acoustic'],
    generationAppeal: ['millennial', 'gen_z'],
  },
  {
    id: '1HNkqx9Ahdgi1Ixy2xkKkL',
    title: 'Thinking Out Loud',
    artist: 'Ed Sheeran',
    album: 'x (Multiply)',
    duration: 281,
    energyLevel: 2,
    explicit: false,
    genres: ['pop', 'soul'],
    generationAppeal: ['millennial', 'gen_x'],
  },
  
  // Elton John - British classic
  {
    id: '38zsOOcu31XbbYj9BIPUF1',
    title: 'Your Song',
    artist: 'Elton John',
    album: 'Elton John',
    duration: 241,
    energyLevel: 2,
    explicit: false,
    genres: ['pop', 'rock'],
    generationAppeal: ['boomer', 'gen_x', 'millennial'],
  },
  
  // Adele - UK powerhouse
  {
    id: '3wfShwUA6idkPMZfEbNfNf',
    title: 'Make You Feel My Love',
    artist: 'Adele',
    album: '19',
    duration: 212,
    energyLevel: 1,
    explicit: false,
    genres: ['pop', 'soul'],
    generationAppeal: ['gen_x', 'millennial'],
  },
  
  // The Beatles - Timeless
  {
    id: '0NeJjNlprGfZpeaIIwExZ0',
    title: 'Here Comes the Sun',
    artist: 'The Beatles',
    album: 'Abbey Road',
    duration: 185,
    energyLevel: 3,
    explicit: false,
    genres: ['rock', 'pop'],
    generationAppeal: ['boomer', 'gen_x', 'millennial'],
  },
  
  // Coldplay - Modern British
  {
    id: '7LVHVU3tWfcxj5aiPFEW4T',
    title: 'Yellow',
    artist: 'Coldplay',
    album: 'Parachutes',
    duration: 269,
    energyLevel: 3,
    explicit: false,
    genres: ['alternative', 'rock'],
    generationAppeal: ['gen_x', 'millennial'],
  },
]

export const ESSENTIAL_US_SONGS: Partial<Song>[] = [
  // John Legend - US wedding staple
  {
    id: '5Qe7NHxvbUmvcHdVgwXvH5',
    title: 'All of Me',
    artist: 'John Legend',
    album: 'Love in the Future',
    duration: 269,
    energyLevel: 2,
    explicit: false,
    genres: ['pop', 'soul', 'r&b'],
    generationAppeal: ['millennial', 'gen_z'],
  },
  
  // Bruno Mars - Party starter
  {
    id: '6FRLCMO5TUHTexlWo8ym1W',
    title: 'Marry You',
    artist: 'Bruno Mars',
    album: 'Doo-Wops & Hooligans',
    duration: 230,
    energyLevel: 5,
    explicit: false,
    genres: ['pop', 'funk'],
    generationAppeal: ['millennial', 'gen_z'],
  },
  
  // Etta James - American classic
  {
    id: '2vxb9oZJxjEq2UfWLZMZ7N',
    title: 'At Last',
    artist: 'Etta James',
    album: 'At Last!',
    duration: 180,
    energyLevel: 2,
    explicit: false,
    genres: ['soul', 'jazz', 'blues'],
    generationAppeal: ['boomer', 'gen_x', 'millennial'],
  },
  
  // Elvis - Vegas wedding essential
  {
    id: '44AyOl4qVkzS48vBsbNXaC',
    title: "Can't Help Falling in Love",
    artist: 'Elvis Presley',
    album: 'Blue Hawaii',
    duration: 178,
    energyLevel: 2,
    explicit: false,
    genres: ['pop', 'rock'],
    generationAppeal: ['boomer', 'gen_x'],
  },
  
  // Christina Perri - Modern US favorite
  {
    id: '6lanRgr6wXibZr8KgzXxBl',
    title: 'A Thousand Years',
    artist: 'Christina Perri',
    album: 'The Twilight Saga: Breaking Dawn - Part 1',
    duration: 285,
    energyLevel: 2,
    explicit: false,
    genres: ['pop'],
    generationAppeal: ['millennial', 'gen_z'],
  },
  
  // Country favorite
  {
    id: '1lueOLdC2gICX6tXFdH0qW',
    title: 'Speechless',
    artist: 'Dan + Shay',
    album: 'Dan + Shay',
    duration: 218,
    energyLevel: 2,
    explicit: false,
    genres: ['country', 'pop'],
    generationAppeal: ['millennial', 'gen_z'],
  },
]

export const PARTY_FAVORITES: Partial<Song>[] = [
  // Universal party starters
  {
    id: '32OlwWuMpZ6b0aN2RZOeMS',
    title: 'Uptown Funk',
    artist: 'Mark Ronson ft. Bruno Mars',
    album: 'Uptown Special',
    duration: 269,
    energyLevel: 5,
    explicit: false,
    genres: ['funk', 'pop'],
    generationAppeal: ['gen_x', 'millennial', 'gen_z'],
  },
  {
    id: '0DiDStADDVh3SvAsoJAFMk',
    title: 'Shut Up and Dance',
    artist: 'WALK THE MOON',
    album: 'TALKING IS HARD',
    duration: 198,
    energyLevel: 5,
    explicit: false,
    genres: ['pop', 'rock'],
    generationAppeal: ['millennial', 'gen_z'],
  },
  {
    id: '2Zo1PcszsT9WQ0ANntJbID',
    title: "I Wanna Dance with Somebody",
    artist: 'Whitney Houston',
    album: 'Whitney',
    duration: 291,
    energyLevel: 5,
    explicit: false,
    genres: ['pop', 'dance'],
    generationAppeal: ['gen_x', 'millennial'],
  },
  
  // UK party favorite
  {
    id: '5VJWQvRcyLjS5eHQUtvKkF',
    title: 'Valerie (Version Revisited)',
    artist: 'Amy Winehouse & Mark Ronson',
    album: 'Version',
    duration: 233,
    energyLevel: 4,
    explicit: false,
    genres: ['soul', 'pop'],
    generationAppeal: ['gen_x', 'millennial'],
  },
  
  // US party classic
  {
    id: '6FXZN3mYYtMvdOqTqNvNQC',
    title: 'September',
    artist: 'Earth, Wind & Fire',
    album: 'The Best of Earth, Wind & Fire, Vol. 1',
    duration: 215,
    energyLevel: 5,
    explicit: false,
    genres: ['funk', 'disco', 'soul'],
    generationAppeal: ['boomer', 'gen_x', 'millennial'],
  },
]

// Helper function to get songs by moment
export function getEssentialSongsForMoment(moment: string, region?: 'uk' | 'us') {
  const allSongs = [
    ...ESSENTIAL_UK_SONGS,
    ...ESSENTIAL_US_SONGS,
    ...PARTY_FAVORITES
  ]
  
  // Map moments to appropriate energy levels
  const momentEnergy: Record<string, number[]> = {
    'processional': [1, 2, 3],
    'first-dance': [1, 2],
    'dinner': [1, 2, 3],
    'dancing': [4, 5],
    'last-dance': [2, 3, 4]
  }
  
  const appropriateEnergy = momentEnergy[moment] || [1, 2, 3, 4, 5]
  
  return allSongs.filter(song => 
    song.energyLevel && appropriateEnergy.includes(song.energyLevel)
  )
}