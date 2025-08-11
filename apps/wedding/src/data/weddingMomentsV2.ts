import { WeddingMoment } from '@/types/wedding-v2';

/**
 * Wedding Moments matching the original working builder
 * These IDs match what's stored in the database from the old builder
 */
export const WEDDING_MOMENTS_V2: WeddingMoment[] = [
  {
    id: 'getting-ready',
    name: 'Getting Ready',
    duration: 30,
    icon: '💄',
    description: 'Pre-ceremony preparation music',
    order: 1
  },
  {
    id: 'ceremony',
    name: 'Ceremony',
    duration: 20,
    icon: '💒',
    description: 'Processional, vows, and recessional',
    order: 2
  },
  {
    id: 'cocktails',
    name: 'Cocktails',
    duration: 90,
    icon: '🥂',
    description: 'Sophisticated mingling music',
    order: 3
  },
  {
    id: 'dinner',
    name: 'Dinner',
    duration: 90,
    icon: '🍽️',
    description: 'Elegant background for dining',
    order: 4
  },
  {
    id: 'first-dance',
    name: 'First Dance',
    duration: 5,
    icon: '💕',
    description: 'Your special moment together',
    order: 5
  },
  {
    id: 'parent-dances',
    name: 'Parent Dances',
    duration: 10,
    icon: '👨‍👩‍👧',
    description: 'Mother-son and father-daughter',
    order: 6
  },
  {
    id: 'party',
    name: 'Party Time',
    duration: 180,
    icon: '🎉',
    description: 'Dance floor hits to keep everyone moving',
    order: 7
  },
  {
    id: 'last-dance',
    name: 'Last Dance',
    duration: 10,
    icon: '🌙',
    description: 'End the night on a perfect note',
    order: 8
  }
];

// Helper functions
export const getTotalDuration = (moments: WeddingMoment[]): number => {
  return moments.reduce((total, moment) => total + moment.duration, 0);
};

export const getMomentById = (id: string): WeddingMoment | undefined => {
  return WEDDING_MOMENTS_V2.find(moment => moment.id === id);
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins}min`;
  if (mins === 0) return `${hours}hr`;
  return `${hours}hr ${mins}min`;
};

// Energy level recommendations for each moment
export const MOMENT_ENERGY_PROFILES: Record<string, { min: number; max: number; ideal: number }> = {
  'getting-ready': { min: 2, max: 3, ideal: 2.5 },
  'ceremony': { min: 1, max: 3, ideal: 2 },
  'cocktails': { min: 2, max: 4, ideal: 3 },
  'dinner': { min: 2, max: 3, ideal: 2.5 },
  'first-dance': { min: 2, max: 4, ideal: 3 },
  'parent-dances': { min: 2, max: 3, ideal: 2.5 },
  'party': { min: 3, max: 5, ideal: 4.5 },
  'last-dance': { min: 3, max: 5, ideal: 4 }
};