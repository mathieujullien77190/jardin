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

export const MODE_CHIPS = [
  { id: 'all', label: 'Tous' },
  { id: 'cueillette', label: '🍓 Cueillette' },
  { id: 'location', label: '🥕 Location' },
] as const;
