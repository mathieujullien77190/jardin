// Shared helpers: pick a random real cadastral parcel near a point (IGN API Carto).
const API = 'https://apicarto.ign.fr/api/cadastre/parcelle';

export const hash = (text) =>
  [...text].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) | 0, 7);

export const mulberry32 = (seed) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const round6 = (n) => Math.round(n * 1e6) / 1e6;

const ringArea = (ring) =>
  Math.abs(
    ring.reduce((sum, [x1, y1], i) => {
      const [x2, y2] = ring[(i + 1) % ring.length];
      return sum + (x1 * y2 - x2 * y1);
    }, 0),
  ) / 2;

const outerRing = (geometry) => {
  const polygons =
    geometry.type === 'MultiPolygon' ? geometry.coordinates : [geometry.coordinates];
  return polygons
    .map((polygon) => polygon[0])
    .sort((a, b) => ringArea(b) - ringArea(a))[0];
};

const fetchParcel = async (lng, lat) => {
  const geom = JSON.stringify({ type: 'Point', coordinates: [lng, lat] });
  try {
    const response = await fetch(`${API}?geom=${encodeURIComponent(geom)}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data.features?.[0] ?? null;
  } catch {
    return null;
  }
};

export const pickParcel = async (id, city, lat, lng, options = {}) => {
  const {
    minArea = 150,
    maxArea = 2500,
    maxPoints = 80,
    attempts = 60,
    spreadLng = 0.07,
    spreadLat = 0.05,
  } = options;
  const random = mulberry32(hash(id));
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const pointLng = lng + (random() - 0.5) * spreadLng;
    const pointLat = lat + (random() - 0.5) * spreadLat;
    const feature = await fetchParcel(pointLng, pointLat);
    if (!feature) continue;
    const { contenance, section, numero, nom_com: commune } = feature.properties;
    const ring = outerRing(feature.geometry).map(([x, y]) => [round6(x), round6(y)]);
    if (contenance < minArea || contenance > maxArea || ring.length > maxPoints) continue;
    const xs = ring.map(([x]) => x);
    const ys = ring.map(([, y]) => y);
    return {
      ref: `${section} ${Number(numero)}`,
      commune: commune ?? city,
      area: contenance,
      center: [
        round6((Math.min(...xs) + Math.max(...xs)) / 2),
        round6((Math.min(...ys) + Math.max(...ys)) / 2),
      ],
      ring,
    };
  }
  return null;
};
