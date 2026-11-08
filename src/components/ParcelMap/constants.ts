import type { StyleSpecification } from 'maplibre-gl';

// IGN orthophotos (Géoplateforme WMTS, free, no API key).
export const ORTHO_TILES_URL =
  'https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&STYLE=normal&FORMAT=image/jpeg&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}';

export const PARCEL_MAP_ZOOM = 18;
export const PARCEL_FIT_PADDING = 60;

export const ORTHO_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    ortho: {
      type: 'raster',
      tiles: [ORTHO_TILES_URL],
      tileSize: 256,
      maxzoom: 19,
      attribution: '© IGN · Géoplateforme',
    },
  },
  layers: [{ id: 'ortho', type: 'raster', source: 'ortho' }],
};
