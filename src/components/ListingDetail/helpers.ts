import type { Booking, Listing, User } from '@/types';

export const canSeePrivateInfo = (
  listing: Listing,
  user: User | null,
  bookings: Booking[],
): boolean => {
  if (!user) return false;
  if (listing.ownerId === user.id) return true;
  return bookings.some(
    (booking) =>
      booking.listingId === listing.id &&
      booking.gardenerId === user.id &&
      booking.status !== 'annulee',
  );
};
