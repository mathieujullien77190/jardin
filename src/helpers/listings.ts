import type { Listing, ListingMode, Review } from '@/types';
import type { SortId } from '@/constants';
import { cityDistance } from './geo';

export type ListingFilters = {
  query: string;
  mode: ListingMode | 'all';
  city: string;
  radius: number;
  maxPrice: number | null;
  tools: boolean;
  water: boolean;
  toilets: boolean;
  sort: SortId;
};

export type Rating = { avg: number; count: number };

export const ratingOf = (reviews: Review[], listingId: string): Rating => {
  const own = reviews.filter((review) => review.listingId === listingId);
  if (own.length === 0) return { avg: 0, count: 0 };
  const sum = own.reduce((total, review) => total + review.rating, 0);
  return { avg: sum / own.length, count: own.length };
};

export const filterListings = (
  listings: Listing[],
  reviews: Review[],
  filters: ListingFilters,
): Listing[] => {
  const query = filters.query.trim().toLowerCase();
  const filtered = listings.filter((listing) => {
    if (listing.status !== 'publiee') return false;
    if (filters.mode !== 'all' && listing.mode !== filters.mode) return false;
    if (filters.maxPrice !== null && listing.price > filters.maxPrice) return false;
    if (filters.tools && !listing.toolsProvided) return false;
    if (filters.water && listing.water === 'aucune') return false;
    if (filters.toilets && !listing.toilets) return false;
    if (filters.city) {
      const distance = cityDistance(filters.city, listing.city);
      if (distance === null || distance > filters.radius) return false;
    }
    if (!query) return true;
    const haystack = [
      listing.title,
      listing.city,
      listing.description,
      ...listing.produce,
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(query);
  });

  const distanceOf = (listing: Listing): number =>
    filters.city ? (cityDistance(filters.city, listing.city) ?? Infinity) : 0;

  return [...filtered].sort((a, b) => {
    switch (filters.sort) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating':
        return ratingOf(reviews, b.id).avg - ratingOf(reviews, a.id).avg;
      case 'distance':
        return distanceOf(a) - distanceOf(b);
      default:
        return b.createdAt.localeCompare(a.createdAt);
    }
  });
};

export const countByCity = (listings: Listing[]): Record<string, number> =>
  listings.reduce<Record<string, number>>((acc, listing) => {
    acc[listing.city] = (acc[listing.city] ?? 0) + 1;
    return acc;
  }, {});
