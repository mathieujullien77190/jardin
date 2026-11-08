import { ROUTES } from '@/constants';

// Tabs of the mobile bottom bar (signed-in users).
export const TABS = [
  { href: ROUTES.home, label: 'Explorer', icon: '🔎' },
  { href: ROUTES.favorites, label: 'Favoris', icon: 'heart' },
  { href: ROUTES.myBookings, label: 'Réservations', icon: '🧺' },
  { href: ROUTES.messages, label: 'Messages', icon: '💬' },
  { href: ROUTES.myListings, label: 'Parcelles', icon: '🏡' },
] as const;
