import type { Listing } from '@/types';
import type { Rating } from '@/helpers/listings';

export type ListingCardProps = {
  listing: Listing;
  rating: Rating;
  favorite: boolean;
  distance?: number | null;
  onToggleFavorite: (listingId: string) => void;
  onShowOnMap?: (listingId: string) => void;
};
