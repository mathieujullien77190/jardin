import type {
  BookingStatus,
  City,
  ListingMode,
  ListingStatus,
  ListingUnit,
  PayoutPeriod,
  PlantKind,
  WaterAccess,
} from '@/types';

export * from './seed';

export const STORAGE_KEYS = {
  db: 'auj:db:v2',
  session: 'auj:session:v2',
  theme: 'auj:theme:v1',
} as const;

export const ROUTES = {
  home: '/',
  login: '/connexion',
  newListing: '/parcelle/nouvelle',
  myListings: '/mes-parcelles',
  myBookings: '/mes-reservations',
  favorites: '/favoris',
  messages: '/messages',
  swap: '/echanges',
  newPlant: '/echanges/proposer',
  guide: '/guide',
  profile: '/profil',
} as const;

// Static export (GitHub Pages): detail pages read the id from the query string.
export const listingRoute = (id: string): string => `/parcelle?id=${id}`;
export const editListingRoute = (id: string): string => `/parcelle/modifier?id=${id}`;
export const plantRoute = (id: string): string => `/echanges/detail?id=${id}`;
export const editPlantRoute = (id: string): string => `/echanges/modifier?id=${id}`;

export const CITIES: City[] = [
  { name: 'Paris', lat: 48.8566, lng: 2.3522 },
  { name: 'Montreuil', lat: 48.8638, lng: 2.4485 },
  { name: 'Versailles', lat: 48.8049, lng: 2.1204 },
  { name: 'Rouen', lat: 49.4432, lng: 1.0993 },
  { name: 'Lille', lat: 50.6292, lng: 3.0573 },
  { name: 'Strasbourg', lat: 48.5734, lng: 7.7521 },
  { name: 'Rennes', lat: 48.1173, lng: -1.6778 },
  { name: 'Nantes', lat: 47.2184, lng: -1.5536 },
  { name: 'Tours', lat: 47.3941, lng: 0.6848 },
  { name: 'Lyon', lat: 45.764, lng: 4.8357 },
  { name: 'Annecy', lat: 45.8992, lng: 6.1294 },
  { name: 'Bordeaux', lat: 44.8378, lng: -0.5792 },
  { name: 'Toulouse', lat: 43.6047, lng: 1.4442 },
  { name: 'Marseille', lat: 43.2965, lng: 5.3698 },
];

export const RADIUS_OPTIONS: number[] = [5, 10, 20, 50, 100, 300];
export const DEFAULT_RADIUS = 20;
export const MAP_BOUNDS = { minLat: 42.5, maxLat: 51.5, minLng: -3, maxLng: 9 } as const;

export const SERVICE_FEE_RATE = 0.08;
export const MIN_SERVICE_FEE = 1;
export const MAX_PEOPLE_BOOKING = 10;
export const SEASONS_AHEAD = 2;

export const MAX_PHOTOS = 4;
export const PHOTO_MAX_SIZE = 800;
export const PHOTO_QUALITY = 0.7;

export const MODE_LABELS: Record<ListingMode, string> = {
  cueillette: 'Cueillette',
  location: 'Location',
};
export const UNIT_BY_MODE: Record<ListingMode, ListingUnit[]> = {
  cueillette: ['panier', 'kg'],
  location: ['an'],
};
export const WATER_LABELS: Record<WaterAccess, string> = {
  aucune: 'Pas d’eau',
  robinet: 'Robinet',
  cuve: 'Cuve de récupération',
};
export const LISTING_STATUS_LABELS: Record<ListingStatus, string> = {
  publiee: 'Publiée',
  reservee: 'Réservée',
  retiree: 'Retirée',
};
export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  payee: 'Payée · à valider',
  validee: 'Validée',
  annulee: 'Annulée',
};
export const PAYOUT_PERIODS: { id: PayoutPeriod; label: string }[] = [
  { id: 'mars', label: 'Mars' },
  { id: 'juin', label: 'Juin' },
  { id: 'octobre', label: 'Octobre' },
];
export const PLANT_KINDS: Record<PlantKind, { label: string; emoji: string }> = {
  plant: { label: 'Plant', emoji: '🪴' },
  semis: { label: 'Semis', emoji: '🌱' },
  graines: { label: 'Graines', emoji: '🫘' },
  bouture: { label: 'Bouture', emoji: '🌿' },
};

export const WEEK_DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
export const DEFAULT_SLOT = { from: '09:00', to: '18:00' } as const;

export const PRODUCE_OPTIONS: { label: string; emoji: string }[] = [
  { label: 'Fraises', emoji: '🍓' },
  { label: 'Fruits rouges', emoji: '🫐' },
  { label: 'Cerises', emoji: '🍒' },
  { label: 'Pommes', emoji: '🍎' },
  { label: 'Poires', emoji: '🍐' },
  { label: 'Prunes', emoji: '🍑' },
  { label: 'Tomates', emoji: '🍅' },
  { label: 'Courgettes', emoji: '🥒' },
  { label: 'Salades', emoji: '🥬' },
  { label: 'Carottes', emoji: '🥕' },
  { label: 'Courges', emoji: '🎃' },
  { label: 'Aromatiques', emoji: '🌿' },
  { label: 'Fleurs', emoji: '🌻' },
];
export const DEFAULT_EMOJI = '🌱';
export const TONES = ['#fde8e8', '#e6f4dc', '#fff0d9', '#e1ecfb', '#efe3f7'];

export const SORT_OPTIONS = [
  { id: 'recent', label: 'Plus récents' },
  { id: 'price-asc', label: 'Prix croissant' },
  { id: 'price-desc', label: 'Prix décroissant' },
  { id: 'rating', label: 'Mieux notés' },
  { id: 'distance', label: 'Plus proches' },
] as const;
export type SortId = (typeof SORT_OPTIONS)[number]['id'];

export const INPUT_CLASS =
  'w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-brand';

export const DEMO_ACCOUNTS = [
  { name: 'Marie (propriétaire)', email: 'marie@demo.fr' },
  { name: 'Jean (propriétaire)', email: 'jean@demo.fr' },
  { name: 'Léa (jardinière)', email: 'lea@demo.fr' },
] as const;
