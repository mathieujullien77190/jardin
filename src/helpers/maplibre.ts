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

// Keep the credits one click away (ℹ️ button) instead of printed over the map.
// Full credits are listed in the site footer.
export const collapseAttribution = (map: { getContainer: () => HTMLElement }): void => {
  const attribution = map.getContainer().querySelector('.maplibregl-ctrl-attrib');
  attribution?.classList.remove('maplibregl-compact-show');
  attribution?.removeAttribute('open');
};
