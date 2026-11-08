import { CADASTRE_API_URL, MAX_PARCEL_POINTS } from '@/constants';
import type { Parcel } from '@/types';

type Ring = [number, number][];

type CadastreFeature = {
  geometry: { type: 'Polygon' | 'MultiPolygon'; coordinates: unknown };
  properties: { contenance: number; section: string; numero: string; nom_com?: string };
};

type CadastreResponse = { features?: CadastreFeature[] };

const round6 = (value: number): number => Math.round(value * 1e6) / 1e6;

const ringArea = (ring: Ring): number =>
  Math.abs(
    ring.reduce((sum, [x1, y1], index) => {
      const [x2, y2] = ring[(index + 1) % ring.length];
      return sum + (x1 * y2 - x2 * y1);
    }, 0),
  ) / 2;

const largestOuterRing = (geometry: CadastreFeature['geometry']): Ring => {
  const polygons =
    geometry.type === 'MultiPolygon'
      ? (geometry.coordinates as Ring[][])
      : [geometry.coordinates as Ring[]];
  return polygons
    .map((polygon) => polygon[0])
    .sort((a, b) => ringArea(b) - ringArea(a))[0];
};

// Keeps stored polygons small: big rural parcels can have thousands of points.
const thin = (ring: Ring): Ring => {
  if (ring.length <= MAX_PARCEL_POINTS) return ring;
  const step = Math.ceil(ring.length / MAX_PARCEL_POINTS);
  const kept = ring.filter((_, index) => index % step === 0);
  return [...kept, kept[0]];
};

// Real cadastral parcel at a point (IGN API Carto), or null when none is found.
export const fetchParcelAt = async (lng: number, lat: number): Promise<Parcel | null> => {
  const geom = JSON.stringify({ type: 'Point', coordinates: [lng, lat] });
  try {
    const response = await fetch(`${CADASTRE_API_URL}?geom=${encodeURIComponent(geom)}`);
    if (!response.ok) return null;
    const data = (await response.json()) as CadastreResponse;
    const feature = data.features?.[0];
    if (!feature) return null;
    const ring = thin(largestOuterRing(feature.geometry)).map(
      ([x, y]): [number, number] => [round6(x), round6(y)],
    );
    const xs = ring.map(([x]) => x);
    const ys = ring.map(([, y]) => y);
    return {
      ref: `${feature.properties.section} ${Number(feature.properties.numero)}`,
      commune: feature.properties.nom_com ?? '',
      area: feature.properties.contenance,
      center: [
        round6((Math.min(...xs) + Math.max(...xs)) / 2),
        round6((Math.min(...ys) + Math.max(...ys)) / 2),
      ],
      ring,
    };
  } catch {
    return null;
  }
};
