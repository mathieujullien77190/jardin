'use client';

import { useEffect, useRef } from 'react';
import { collapseAttribution, loadMapLibre } from '@/helpers/maplibre';
import { ORTHO_STYLE, PARCEL_FIT_PADDING, PARCEL_MAP_ZOOM } from './constants';
import { boundsOf } from './helpers';
import type { ParcelMapProps } from './types';

export const ParcelMap = ({ parcel }: ParcelMapProps) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let instance: { remove: () => void } | undefined;
    void loadMapLibre().then((maplibre) => {
      if (cancelled || !container.current) return;
      const map = new maplibre.Map({
        container: container.current,
        style: ORTHO_STYLE,
        center: parcel.center,
        zoom: PARCEL_MAP_ZOOM,
        attributionControl: { compact: true },
      });
      instance = map;
      map.addControl(new maplibre.NavigationControl({ showCompass: false }), 'top-right');
      map.fitBounds(boundsOf(parcel.ring), {
        padding: PARCEL_FIT_PADDING,
        maxZoom: PARCEL_MAP_ZOOM + 1,
        animate: false,
      });
      map.once('idle', () => collapseAttribution(map));
      map.on('load', () => {
        collapseAttribution(map);
        map.addSource('parcel', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: { type: 'Polygon', coordinates: [parcel.ring] },
          },
        });
        map.addLayer({
          id: 'parcel-fill',
          type: 'fill',
          source: 'parcel',
          paint: { 'fill-color': '#f2994a', 'fill-opacity': 0.3 },
        });
        map.addLayer({
          id: 'parcel-line',
          type: 'line',
          source: 'parcel',
          paint: { 'line-color': '#f2994a', 'line-width': 3 },
        });
      });
    });
    return () => {
      cancelled = true;
      instance?.remove();
    };
  }, [parcel]);

  return (
    <div
      ref={container}
      className="border-line aspect-[16/10] w-full overflow-hidden rounded-2xl border"
      role="region"
      aria-label="Parcelle cadastrale sur photo aérienne"
    />
  );
};
