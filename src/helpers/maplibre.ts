import 'maplibre-gl/dist/maplibre-gl.css';

type MapLibre = typeof import('maplibre-gl');

let loading: Promise<MapLibre> | null = null;

// Client only (maplibre touches `window`). The worker is served from /public/maplibre.
export const loadMapLibre = (): Promise<MapLibre> => {
  loading ??= import('maplibre-gl').then((maplibre) => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
    maplibre.setWorkerUrl(`${basePath}/maplibre/maplibre-gl-worker.mjs`);
    return maplibre;
  });
  return loading;
};
