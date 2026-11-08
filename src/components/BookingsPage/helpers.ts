import type { Booking } from '@/types';

export const sortByDate = (bookings: Booking[]): Booking[] =>
  [...bookings].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
