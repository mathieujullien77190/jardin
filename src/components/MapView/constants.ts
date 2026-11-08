// OpenFreeMap: free vector tiles, no API key required.
export const MAP_STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty';
// Real French cadastre (DINUM / etalab), vector tiles with a `parcelles` layer.
export const CADASTRE_TILES_URL =
  'https://openmaptiles.data.gouv.fr/data/cadastre/{z}/{x}/{y}.pbf';

export const FRANCE_BOUNDS: [[number, number], [number, number]] = [
  [-5.5, 41.0],
  [10.0, 51.5],
];
export const FIT_PADDING = 24;
export const CITY_ZOOM = 11;
export const PARCEL_ZOOM = 17;
export const CADASTRE_MIN_ZOOM = 15.5;

export const SOURCE_PARCELS = 'garden-parcels';
export const SOURCE_CADASTRE = 'cadastre';
export const LAYER_PARCELS_FILL = 'garden-parcels-fill';
export const LAYER_PARCELS_LINE = 'garden-parcels-line';
export const LAYER_CADASTRE_LINES = 'cadastre-lines';

export const PARCEL_COLORS = { cueillette: '#f2994a', location: '#2f7d4f' } as const;

export const BUBBLE_BASE_CLASS =
  'grid cursor-pointer place-items-center rounded-full border-2 text-sm font-bold shadow-lg';
export const BUBBLE_IDLE_CLASS = 'border-brand bg-white text-brand-dark';
export const BUBBLE_SELECTED_CLASS = 'border-ink bg-accent text-ink';
export const BUBBLE_LABEL_CLASS =
  'pointer-events-none absolute top-full mt-0.5 rounded bg-white/80 px-1 text-[10px] font-semibold whitespace-nowrap text-ink';
