import type { AccessSlot, Listing } from '@/types';
import { WEEK_DAYS } from '@/constants';

export const formatEuro = (amount: number): string =>
  `${amount.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} €`;

export const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

export const formatDateTime = (iso: string): string =>
  new Date(iso).toLocaleString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

export const initials = (name: string): string =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

export const formatPrice = (listing: Pick<Listing, 'price' | 'unit'>): string =>
  `${formatEuro(listing.price)} / ${listing.unit}`;

export const summarizeAccess = (slots: AccessSlot[]): string => {
  if (slots.length === 0) return 'Sur rendez-vous';
  const sorted = [...slots].sort((a, b) => a.day - b.day);
  return sorted
    .map((slot) => `${WEEK_DAYS[slot.day]} ${slot.from}-${slot.to}`)
    .join(' · ');
};

export const todayIso = (): string => new Date().toISOString().slice(0, 10);
