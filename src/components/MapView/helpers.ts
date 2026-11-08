import type { FeatureCollection, Polygon } from 'geojson';
import { CITIES } from '@/constants';
import { BUBBLE_BASE_CLASS, BUBBLE_IDLE_CLASS, BUBBLE_SELECTED_CLASS } from './constants';
import type { MapParcel } from './types';

export type Bubble = {
  name: string;
  count: number;
  lng: number;
  lat: number;
  size: number;
};

export const buildBubbles = (counts: Record<string, number>): Bubble[] =>
  CITIES.filter((city) => (counts[city.name] ?? 0) > 0).map((city) => {
    const count = counts[city.name] ?? 0;
    return {
      name: city.name,
      count,
      lng: city.lng,
      lat: city.lat,
      size: 30 + Math.min(count, 5) * 6,
    };
  });

export const bubbleClass = (selected: boolean): string =>
  `${BUBBLE_BASE_CLASS} ${selected ? BUBBLE_SELECTED_CLASS : BUBBLE_IDLE_CLASS}`;

export const parcelsToGeoJson = (
  parcels: MapParcel[],
): FeatureCollection<Polygon, { id: string; title: string; mode: string }> => ({
  type: 'FeatureCollection',
  features: parcels.map((parcel) => ({
    type: 'Feature',
    properties: { id: parcel.id, title: parcel.title, mode: parcel.mode },
    geometry: { type: 'Polygon', coordinates: [parcel.ring] },
  })),
});
