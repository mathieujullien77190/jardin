import type { ActionResult, BookingInput, Listing, User } from '@/types';

export type BookingFormProps = {
  listing: Listing;
  user: User | null;
  onSubmit: (input: BookingInput) => ActionResult;
};
