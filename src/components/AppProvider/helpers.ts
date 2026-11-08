import type { Booking, Db, Listing } from '@/types';

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
