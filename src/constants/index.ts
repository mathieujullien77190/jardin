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

export * from './parcels';
export * from './seed';

export const STORAGE_KEYS = {
  db: 'auj:db:v3',
  session: 'auj:session:v3',
} as const;

export const TOAST_DURATION_MS = 3500;
export const STORAGE_FULL_MESSAGE = 'Stockage du navigateur plein : retirez des photos.';

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
  { name: 'Nice', lat: 43.7102, lng: 7.262 },
  { name: 'Montpellier', lat: 43.6108, lng: 3.8767 },
  { name: 'Grenoble', lat: 45.1885, lng: 5.7245 },
  { name: 'Dijon', lat: 47.322, lng: 5.0415 },
  { name: 'Reims', lat: 49.2583, lng: 4.0317 },
  { name: 'Metz', lat: 49.1193, lng: 6.1757 },
  { name: 'Nancy', lat: 48.6921, lng: 6.1844 },
  { name: 'Clermont-Ferrand', lat: 45.7772, lng: 3.087 },
  { name: 'Limoges', lat: 45.8336, lng: 1.2611 },
  { name: 'Poitiers', lat: 46.5802, lng: 0.3404 },
  { name: 'Angers', lat: 47.4784, lng: -0.5632 },
  { name: 'Le Mans', lat: 48.0061, lng: 0.1996 },
  { name: 'Caen', lat: 49.1829, lng: -0.3707 },
  { name: 'Amiens', lat: 49.8941, lng: 2.2958 },
  { name: 'Orléans', lat: 47.9029, lng: 1.9093 },
  { name: 'Besançon', lat: 47.2378, lng: 6.0241 },
  { name: 'Perpignan', lat: 42.6887, lng: 2.8948 },
  { name: 'Avignon', lat: 43.9493, lng: 4.8055 },
  { name: 'Pau', lat: 43.2951, lng: -0.3708 },
  { name: 'Brest', lat: 48.3904, lng: -4.4861 },
  { name: 'Quimper', lat: 47.996, lng: -4.097 },
  { name: 'Saint-Étienne', lat: 45.4397, lng: 4.3872 },
  { name: 'Toulon', lat: 43.1242, lng: 5.928 },
  { name: 'La Rochelle', lat: 46.1603, lng: -1.1511 },
  { name: 'Biarritz', lat: 43.4832, lng: -1.5586 },
  { name: 'Colmar', lat: 48.0794, lng: 7.3585 },
  { name: 'Chambéry', lat: 45.5646, lng: 5.9178 },
  { name: 'Valence', lat: 44.9334, lng: 4.8924 },
  { name: 'Nîmes', lat: 43.8367, lng: 4.3601 },
  { name: 'Ajaccio', lat: 41.9192, lng: 8.7386 },
  { name: 'Bourges', lat: 47.081, lng: 2.3987 },
  { name: 'Troyes', lat: 48.2973, lng: 4.0744 },
  { name: 'Lorient', lat: 47.7482, lng: -3.3702 },
  { name: 'Saint-Malo', lat: 48.6493, lng: -2.0257 },
  { name: 'Cherbourg', lat: 49.6337, lng: -1.6221 },
  { name: 'Albi', lat: 43.9298, lng: 2.148 },
  { name: 'Melun', lat: 48.5395, lng: 2.6606 },
  { name: 'Dammarie-les-Lys', lat: 48.5127, lng: 2.6414 },
  { name: 'Le Mée-sur-Seine', lat: 48.5319, lng: 2.6342 },
  { name: 'Vaux-le-Pénil', lat: 48.5282, lng: 2.6872 },
  { name: 'Savigny-le-Temple', lat: 48.597, lng: 2.5832 },
  { name: 'Cesson', lat: 48.5667, lng: 2.5833 },
  { name: 'Saint-Fargeau-Ponthierry', lat: 48.556, lng: 2.548 },
  { name: 'Fontainebleau', lat: 48.4047, lng: 2.7016 },
  { name: 'Moret-sur-Loing', lat: 48.3733, lng: 2.8167 },
  { name: 'Brie-Comte-Robert', lat: 48.6933, lng: 2.609 },
].sort((a, b) => a.name.localeCompare(b.name, 'fr'));

// Free public APIs (no key). Calls are made straight from the browser (CORS enabled).
export const GEOCODER_URL = 'https://data.geopf.fr/geocodage/search';
export const CADASTRE_API_URL = 'https://apicarto.ign.fr/api/cadastre/parcelle';
export const ADDRESS_MIN_CHARS = 3;
export const ADDRESS_DEBOUNCE_MS = 300;
export const ADDRESS_MAX_RESULTS = 6;
export const MAX_PARCEL_POINTS = 150;

export const RADIUS_OPTIONS: number[] = [5, 10, 20, 50, 100, 300];
export const DEFAULT_RADIUS = 20;

export const SERVICE_FEE_RATE = 0.08;
export const MIN_SERVICE_FEE = 1;
export const MAX_PEOPLE_BOOKING = 10;
export const SEASONS_AHEAD = 2;

export const MAX_PHOTOS = 4;
export const PHOTO_MAX_SIZE = 800;
export const PHOTO_QUALITY = 0.7;

export const MODE_LABELS: Record<ListingMode, string> = {
  cueillette: 'Cueillette',
  location: 'Location de parcelle',
};

// What each listing type means, shown wherever the user has to choose between them.
export const MODE_INFO: Record<
  ListingMode,
  { emoji: string; title: string; description: string }
> = {
  cueillette: {
    emoji: '🍓',
    title: 'Cueillette',
    description: 'Venir cueillir fruits et légumes sur place. Payé au panier ou au kilo.',
  },
  location: {
    emoji: '🥕',
    title: 'Location de parcelle',
    description: 'Louer un bout de jardin pour le cultiver soi-même toute l’année.',
  },
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
  { name: 'Camille (compte par défaut)', email: 'demo@demo.fr' },
  { name: 'Marie (propriétaire)', email: 'marie@demo.fr' },
  { name: 'Jean (propriétaire)', email: 'jean@demo.fr' },
  { name: 'Léa (jardinière)', email: 'lea@demo.fr' },
] as const;
