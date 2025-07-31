import { WeddingMoment } from '@/types/wedding-v2';

export const WEDDING_MOMENTS: WeddingMoment[] = [
  {
    id: 'prelude',
    name: 'Prelude',
    duration: 30,
    icon: '🎵',
    description: 'Guest arrival and seating music',
    order: 1
  },
  {
    id: 'processional',
    name: 'Processional',
    duration: 5,
    icon: '💐',
    description: 'Wedding party and bride entrance',
    order: 2
  },
  {
    id: 'ceremony',
    name: 'Ceremony',
    duration: 20,
    icon: '💍',
    description: 'Background music for vows and rings',
    order: 3
  },
  {
    id: 'recessional',
    name: 'Recessional',
    duration: 5,
    icon: '🎉',
    description: 'Celebration music for the exit',
    order: 4
  },
  {
    id: 'cocktail',
    name: 'Cocktail Hour',
    duration: 60,
    icon: '🥂',
    description: 'Sophisticated mingling music',
    order: 5
  },
  {
    id: 'entrance',
    name: 'Grand Entrance',
    duration: 5,
    icon: '🌟',
    description: 'Make a statement at reception',
    order: 6
  },
  {
    id: 'dinner',
    name: 'Dinner',
    duration: 60,
    icon: '🍽️',
    description: 'Elegant background for dining',
    order: 7
  },
  {
    id: 'firstDance',
    name: 'First Dance',
    duration: 4,
    icon: '❤️',
    description: 'Your special moment together',
    order: 8
  },
  {
    id: 'parentDances',
    name: 'Parent Dances',
    duration: 8,
    icon: '👨‍👩‍👧‍👦',
    description: 'Mother-son and father-daughter',
    order: 9
  },
  {
    id: 'danceFloor',
    name: 'Dance Floor',
    duration: 120,
    icon: '🕺',
    description: 'Party time! Get everyone dancing',
    order: 10
  },
  {
    id: 'lastDance',
    name: 'Last Dance',
    duration: 5,
    icon: '✨',
    description: 'End on a perfect note',
    order: 11
  }
];

// Helper functions
export const getTotalDuration = (moments: WeddingMoment[]): number => {
  return moments.reduce((total, moment) => total + moment.duration, 0);
};

export const getMomentById = (id: string): WeddingMoment | undefined => {
  return WEDDING_MOMENTS.find(moment => moment.id === id);
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
  prelude: { min: 2, max: 3, ideal: 2.5 },
  processional: { min: 2, max: 4, ideal: 3 },
  ceremony: { min: 1, max: 3, ideal: 2 },
  recessional: { min: 4, max: 5, ideal: 4.5 },
  cocktail: { min: 2, max: 4, ideal: 3 },
  entrance: { min: 4, max: 5, ideal: 5 },
  dinner: { min: 2, max: 3, ideal: 2.5 },
  firstDance: { min: 2, max: 4, ideal: 3 },
  parentDances: { min: 2, max: 3, ideal: 2.5 },
  danceFloor: { min: 3, max: 5, ideal: 4.5 },
  lastDance: { min: 3, max: 5, ideal: 4 }
};