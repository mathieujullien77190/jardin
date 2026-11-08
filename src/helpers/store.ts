import type { Booking, Db, Listing } from '@/types';

// "jean.dupont@mail.fr" -> "Jean Dupont" (fake login derives a display name).
export const nameFromEmail = (email: string): string => {
  const local = email.split('@')[0] ?? '';
  const words = local.split(/[._\-\s]+/).filter(Boolean);
  if (words.length === 0) return 'Jardinier';
  return words.map((word) => word[0].toUpperCase() + word.slice(1)).join(' ');
};

export const normalizeEmail = (email: string): string => email.trim().toLowerCase();

export const isValidEmail = (email: string): boolean => /^\S+@\S+\.\S+$/.test(email);

export const hasActiveBooking = (
  bookings: Booking[],
  listingId: string,
  season: number,
): boolean =>
  bookings.some(
    (booking) =>
      booking.listingId === listingId &&
      booking.season === season &&
      booking.status !== 'annulee',
  );

export const withListing = (db: Db, id: string, patch: Partial<Listing>): Db => ({
  ...db,
  listings: db.listings.map((listing) =>
    listing.id === id ? { ...listing, ...patch } : listing,
  ),
});
