import { ROUTES } from '@/constants';

// Always visible in the top bar.
export const MAIN_LINKS = [
  { href: ROUTES.home, label: 'Explorer' },
  { href: ROUTES.swap, label: 'Échanges' },
  { href: ROUTES.guide, label: 'Guide' },
] as const;

// Inside the account menu (signed-in users only).
export const USER_LINKS = [
  { href: ROUTES.myListings, label: 'Mes parcelles', icon: '🏡' },
  { href: ROUTES.myBookings, label: 'Mes réservations', icon: '🧺' },
  { href: ROUTES.favorites, label: 'Mes favoris', icon: 'heart' },
  { href: ROUTES.messages, label: 'Messages', icon: '💬' },
  { href: ROUTES.profile, label: 'Mon profil', icon: '👤' },
] as const;
