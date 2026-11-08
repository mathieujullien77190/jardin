import type { Booking, Listing, User } from '@/types';

export type OwnerBookingProps = {
  booking: Booking;
  listing: Listing | undefined;
  gardener: User | undefined;
};
