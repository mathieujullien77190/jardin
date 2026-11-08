import type { Listing } from '@/types';
import { MIN_SERVICE_FEE, SERVICE_FEE_RATE } from '@/constants';

export type Quote = { price: number; fee: number; total: number };

const round2 = (value: number): number => Math.round(value * 100) / 100;

export const computeQuote = (listing: Listing, quantity: number): Quote => {
  const base =
    listing.mode === 'location'
      ? listing.price + (listing.toolsProvided ? listing.toolsPrice : 0)
      : listing.price * quantity;
  const price = round2(base);
  const fee =
    price === 0 ? 0 : round2(Math.max(MIN_SERVICE_FEE, price * SERVICE_FEE_RATE));
  return { price, fee, total: round2(price + fee) };
};

export const quantityLabel = (listing: Listing): string => {
  if (listing.mode === 'location') return 'Parcelle entière';
  return listing.unit === 'kg' ? 'Poids estimé (kg)' : 'Nombre de paniers';
};

export const payoutAmount = (price: number): number => round2(price / 3);
