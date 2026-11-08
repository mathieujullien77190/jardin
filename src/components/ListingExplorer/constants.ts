import type { ListingFilters } from '@/helpers/listings';
import { DEFAULT_RADIUS } from '@/constants';

export const DEFAULT_FILTERS: ListingFilters = {
  query: '',
  mode: 'all',
  city: '',
  radius: DEFAULT_RADIUS,
  maxPrice: null,
  tools: false,
  water: false,
  toilets: false,
  sort: 'recent',
};

export const PAGE_SIZE = 12;

export const ALL_MODES_INFO = {
  emoji: '🌿',
  title: 'Tous les jardins',
  description: 'Cueillette et location de parcelle.',
} as const;

// Équipements : un critère à part du type d'annonce (cueillette / location).
export const EQUIPMENT_FILTERS = [
  { key: 'tools', label: '🧰 Outils fournis' },
  { key: 'water', label: '💧 Accès à l’eau' },
  { key: 'toilets', label: '🚻 Toilettes' },
] as const;
