import { ROUTES } from '@/constants';

export const NAV_LINKS = [
  { href: ROUTES.home, label: 'Explorer', auth: false },
  { href: ROUTES.swap, label: 'Échanges', auth: false },
  { href: ROUTES.guide, label: 'Guide', auth: false },
  { href: ROUTES.favorites, label: 'Favoris', auth: true },
  { href: ROUTES.myBookings, label: 'Réservations', auth: true },
  { href: ROUTES.myListings, label: 'Mes parcelles', auth: true },
  { href: ROUTES.messages, label: 'Messages', auth: true },
] as const;
