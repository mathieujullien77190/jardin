export type ListingMode = 'cueillette' | 'location';
export type ListingUnit = 'panier' | 'kg' | 'an';
export type ListingStatus = 'publiee' | 'reservee' | 'retiree';
export type WaterAccess = 'aucune' | 'robinet' | 'cuve';
export type BookingStatus = 'payee' | 'validee' | 'annulee';
export type PayoutPeriod = 'mars' | 'juin' | 'octobre';
export type PlantKind = 'plant' | 'semis' | 'graines' | 'bouture';
export type PlantStatus = 'disponible' | 'donne';
export type ThemeName = 'light' | 'dark';

export type City = { name: string; lat: number; lng: number };

export type User = { id: string; name: string; email: string; city: string };

export type AccessSlot = { day: number; from: string; to: string };

// Real cadastral parcel (IGN API Carto): outer ring in [lng, lat].
export type Parcel = {
  ref: string;
  commune: string;
  area: number;
  center: [number, number];
  ring: [number, number][];
};

export type Listing = {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  city: string;
  mode: ListingMode;
  area: number;
  price: number;
  unit: ListingUnit;
  toolsProvided: boolean;
  toolsPrice: number;
  water: WaterAccess;
  waterMeter: boolean;
  accessSlots: AccessSlot[];
  maxPeople: number;
  toilets: boolean;
  equipment: string;
  produce: string[];
  photos: string[];
  address: string;
  phone: string;
  parcel?: Parcel;
  status: ListingStatus;
  emoji: string;
  tone: string;
  createdAt: string;
};

export type ListingInput = Omit<Listing, 'id' | 'ownerId' | 'createdAt' | 'status'> & {
  status?: ListingStatus;
};

export type Booking = {
  id: string;
  listingId: string;
  gardenerId: string;
  ownerId: string;
  season: number;
  date: string | null;
  quantity: number;
  price: number;
  fee: number;
  total: number;
  status: BookingStatus;
  code: string;
  validatedAt?: string;
  cancelledAt?: string;
  payoutsRequested: PayoutPeriod[];
  createdAt: string;
};

export type BookingInput = {
  listingId: string;
  season: number;
  date: string | null;
  quantity: number;
};

export type Message = {
  id: string;
  listingId: string;
  fromId: string;
  toId: string;
  text: string;
  createdAt: string;
};

export type Review = {
  id: string;
  listingId: string;
  userId: string;
  rating: number;
  text: string;
  createdAt: string;
};

export type Plant = {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  kind: PlantKind;
  quantity: number;
  city: string;
  phone: string;
  photos: string[];
  status: PlantStatus;
  createdAt: string;
};

export type PlantInput = Omit<Plant, 'id' | 'ownerId' | 'createdAt' | 'status'>;

export type Db = {
  users: User[];
  listings: Listing[];
  bookings: Booking[];
  messages: Message[];
  reviews: Review[];
  plants: Plant[];
  favorites: Record<string, string[]>;
};

export type ToastItem = { id: string; message: string };

export type ActionResult = { ok: true } | { ok: false; error: string };

export type AppContextValue = {
  ready: boolean;
  db: Db;
  user: User | null;
  toasts: ToastItem[];
  theme: ThemeName;
  toggleTheme: () => void;
  login: (email: string, password: string) => ActionResult;
  register: (name: string, email: string, city: string) => ActionResult;
  logout: () => void;
  updateProfile: (name: string, city: string) => void;
  saveListing: (input: ListingInput, id?: string) => string | null;
  setListingStatus: (id: string, status: ListingStatus) => void;
  deleteListing: (id: string) => void;
  toggleFavorite: (listingId: string) => void;
  createBooking: (input: BookingInput) => ActionResult;
  cancelBooking: (id: string) => void;
  validateBooking: (id: string, code: string) => ActionResult;
  requestPayout: (id: string, period: PayoutPeriod) => void;
  sendMessage: (listingId: string, toId: string, text: string) => void;
  addReview: (listingId: string, rating: number, text: string) => void;
  savePlant: (input: PlantInput, id?: string) => string | null;
  setPlantStatus: (id: string, status: PlantStatus) => void;
  deletePlant: (id: string) => void;
  notify: (message: string) => void;
  resetData: () => void;
};
