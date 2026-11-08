import type { City, Listing } from '@/types';
import { CITIES } from '@/constants';

const EARTH_RADIUS_KM = 6371;

export const findCity = (name: string): City | undefined =>
  CITIES.find((city) => city.name === name);

const toRad = (deg: number): number => (deg * Math.PI) / 180;

export const distanceKm = (from: City, to: City): number => {
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
};

// Best known point of a garden: cadastral parcel, else picked address, else its commune.
export const listingPoint = (
  listing: Pick<Listing, 'parcel' | 'location' | 'city'>,
): [number, number] | null => {
  if (listing.parcel) return listing.parcel.center;
  if (listing.location) return listing.location;
  const city = findCity(listing.city);
  return city ? [city.lng, city.lat] : null;
};

export const distanceToListing = (
  cityName: string,
  listing: Pick<Listing, 'parcel' | 'location' | 'city'>,
): number | null => {
  const from = findCity(cityName);
  const point = listingPoint(listing);
  if (!from || !point) return null;
  return distanceKm(from, { name: '', lng: point[0], lat: point[1] });
};
