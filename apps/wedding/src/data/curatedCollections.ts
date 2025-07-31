import { SongCollection } from '@/types/wedding-v2';
import { Timestamp } from 'firebase/firestore';
import { CURATED_SONGS } from './curatedSongs';

// Get current timestamp for mock data
const now = Timestamp.now();

export const CURATED_COLLECTIONS: SongCollection[] = [
  // Prelude Collections
  {
    id: 'elegant-arrivals',
    name: 'Elegant Arrivals',
    icon: '🎼',
    description: 'Sophisticated melodies for guest seating',
    moment: 'prelude',
    songIds: CURATED_SONGS.prelude.slice(0, 3).map(s => s.id),
    stats: {
      totalSongs: 25,
      avgRating: 4.8,
      timesUsed: 342
    },
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'modern-love-prelude',
    name: 'Modern Love',
    icon: '💕',
    description: 'Contemporary hits to set the romantic mood',
    moment: 'prelude',
    songIds: CURATED_SONGS.prelude.slice(2, 5).map(s => s.id),
    stats: {
      totalSongs: 30,
      avgRating: 4.9,
      timesUsed: 567
    },
    createdAt: now,
    updatedAt: now
  },

  // Processional Collections
  {
    id: 'classic-processional',
    name: 'Classic Processional',
    icon: '💐',
    description: 'Timeless elegance for your walk down the aisle',
    moment: 'processional',
    songIds: CURATED_SONGS.processional.slice(0, 2).map(s => s.id),
    stats: {
      totalSongs: 15,
      avgRating: 4.9,
      timesUsed: 891
    },
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'contemporary-processional',
    name: 'Contemporary Entrance',
    icon: '🌟',
    description: 'Modern songs for a memorable entrance',
    moment: 'processional',
    songIds: CURATED_SONGS.processional.slice(2, 4).map(s => s.id),
    stats: {
      totalSongs: 20,
      avgRating: 4.7,
      timesUsed: 456
    },
    createdAt: now,
    updatedAt: now
  },

  // First Dance Collections
  {
    id: 'romantic-first-dance',
    name: 'Romantic Classics',
    icon: '❤️',
    description: 'Timeless love songs for your first dance',
    moment: 'firstDance',
    songIds: CURATED_SONGS.firstDance.slice(0, 3).map(s => s.id),
    stats: {
      totalSongs: 40,
      avgRating: 4.9,
      timesUsed: 1234
    },
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'soulful-first-dance',
    name: 'Soulful Moments',
    icon: '🎤',
    description: 'R&B and soul for an emotional first dance',
    moment: 'firstDance',
    songIds: CURATED_SONGS.firstDance.slice(2, 5).map(s => s.id),
    stats: {
      totalSongs: 25,
      avgRating: 4.8,
      timesUsed: 678
    },
    createdAt: now,
    updatedAt: now
  },

  // Dance Floor Collections
  {
    id: 'dance-floor-guaranteed',
    name: 'Guaranteed Dance Hits',
    icon: '🕺',
    description: 'Songs that will pack the dance floor',
    moment: 'danceFloor',
    songIds: CURATED_SONGS.danceFloor.slice(0, 5).map(s => s.id),
    stats: {
      totalSongs: 150,
      avgRating: 4.9,
      timesUsed: 2345
    },
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'multi-generational-party',
    name: 'Multi-Generational Party',
    icon: '🎉',
    description: 'Hits that everyone from grandma to kids will love',
    moment: 'danceFloor',
    songIds: CURATED_SONGS.danceFloor.slice(1, 6).map(s => s.id),
    stats: {
      totalSongs: 100,
      avgRating: 4.8,
      timesUsed: 1890
    },
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'modern-dance-party',
    name: 'Modern Dance Party',
    icon: '💃',
    description: 'Current hits and trending tracks',
    moment: 'danceFloor',
    songIds: CURATED_SONGS.danceFloor.slice(3, 7).map(s => s.id),
    stats: {
      totalSongs: 80,
      avgRating: 4.7,
      timesUsed: 999
    },
    createdAt: now,
    updatedAt: now
  },

  // Dinner Collections
  {
    id: 'elegant-dinner-jazz',
    name: 'Elegant Jazz Standards',
    icon: '🍷',
    description: 'Sophisticated background music for dining',
    moment: 'dinner',
    songIds: CURATED_SONGS.dinner.slice(0, 3).map(s => s.id),
    stats: {
      totalSongs: 50,
      avgRating: 4.8,
      timesUsed: 567
    },
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'modern-dinner-ambiance',
    name: 'Modern Ambiance',
    icon: '🍽️',
    description: 'Contemporary easy listening for dinner',
    moment: 'dinner',
    songIds: CURATED_SONGS.dinner.slice(1, 4).map(s => s.id),
    stats: {
      totalSongs: 45,
      avgRating: 4.7,
      timesUsed: 432
    },
    createdAt: now,
    updatedAt: now
  },

  // Last Dance Collections
  {
    id: 'epic-send-off',
    name: 'Epic Send-Off',
    icon: '✨',
    description: 'End the night on a high note',
    moment: 'lastDance',
    songIds: CURATED_SONGS.lastDance.map(s => s.id),
    stats: {
      totalSongs: 20,
      avgRating: 4.9,
      timesUsed: 789
    },
    createdAt: now,
    updatedAt: now
  }
];

// Helper function to get collections by moment
export const getCollectionsByMoment = (momentId: string): SongCollection[] => {
  return CURATED_COLLECTIONS.filter(collection => collection.moment === momentId);
};

// Helper function to get all songs in a collection
export const getSongsInCollection = (collectionId: string) => {
  const collection = CURATED_COLLECTIONS.find(c => c.id === collectionId);
  if (!collection) return [];
  
  const allSongs = Object.values(CURATED_SONGS).flat();
  return collection.songIds
    .map(id => allSongs.find(song => song.id === id))
    .filter(Boolean);
};