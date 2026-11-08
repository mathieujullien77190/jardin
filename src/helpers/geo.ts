import type { City } from '@/types';
import { CITIES, MAP_BOUNDS } from '@/constants';

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

export const cityDistance = (a: string, b: string): number | null => {
  const from = findCity(a);
  const to = findCity(b);
  return from && to ? distanceKm(from, to) : null;
};

export const projectToMap = (city: City): { x: number; y: number } => ({
  x: ((city.lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * 100,
  y: (1 - (city.lat - MAP_BOUNDS.minLat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * 100,
});
