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
export const POINTS_MAX_ZOOM = 16;

export const CLUSTER_RADIUS = 55;
export const CLUSTER_MAX_ZOOM = 12;

export const SOURCE_POINTS = 'garden-points';
export const SOURCE_PARCELS = 'garden-parcels';
export const SOURCE_CADASTRE = 'cadastre';
export const LAYER_CLUSTERS = 'garden-clusters';
export const LAYER_CLUSTER_COUNT = 'garden-cluster-count';
export const LAYER_POINT = 'garden-point';
export const LAYER_PARCELS_FILL = 'garden-parcels-fill';
export const LAYER_PARCELS_LINE = 'garden-parcels-line';
export const LAYER_CADASTRE_LINES = 'cadastre-lines';

export const PARCEL_COLORS = { cueillette: '#f2994a', location: '#2f7d4f' } as const;
export const CLUSTER_COLORS = { small: '#5fbf86', medium: '#2f7d4f', large: '#1f5636' };
export const CLUSTER_FONT = ['Noto Sans Bold'];
