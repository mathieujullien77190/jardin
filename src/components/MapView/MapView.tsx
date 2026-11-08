'use client';

import type { GeoJSONSource, Map as MapLibreMap } from 'maplibre-gl';
import { useEffect, useRef, useState } from 'react';
import { findCity } from '@/helpers/geo';
import { collapseAttribution, loadMapLibre } from '@/helpers/maplibre';
import {
  CADASTRE_MIN_ZOOM,
  CADASTRE_TILES_URL,
  CITY_ZOOM,
  CLUSTER_COLORS,
  CLUSTER_FONT,
  CLUSTER_MAX_ZOOM,
  CLUSTER_RADIUS,
  FIT_PADDING,
  FRANCE_BOUNDS,
  LAYER_CADASTRE_LINES,
  LAYER_CLUSTER_COUNT,
  LAYER_CLUSTERS,
  LAYER_PARCELS_FILL,
  LAYER_PARCELS_LINE,
  LAYER_POINT,
  MAP_STYLE_URL,
  PARCEL_COLORS,
  PARCEL_ZOOM,
  POINTS_MAX_ZOOM,
  SOURCE_CADASTRE,
  SOURCE_PARCELS,
  SOURCE_POINTS,
} from './constants';
import { parcelsToGeoJson, pointsToGeoJson } from './helpers';
import type { MapViewProps } from './types';

const MODE_COLOR = [
  'match',
  ['get', 'mode'],
  'cueillette',
  PARCEL_COLORS.cueillette,
  PARCEL_COLORS.location,
];

export const MapView = ({ gardens, selectedCity, focus, onOpenGarden }: MapViewProps) => {
  const container = useRef<HTMLDivElement>(null);
  const onOpenRef = useRef(onOpenGarden);
  const gardensRef = useRef(gardens);
  const [map, setMap] = useState<MapLibreMap | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    onOpenRef.current = onOpenGarden;
    gardensRef.current = gardens;
  });

  // Create the map once.
  useEffect(() => {
    let cancelled = false;
    let instance: MapLibreMap | undefined;
    void loadMapLibre().then((maplibre) => {
      if (cancelled || !container.current) return;
      instance = new maplibre.Map({
        container: container.current,
        style: MAP_STYLE_URL,
        bounds: FRANCE_BOUNDS,
        fitBoundsOptions: { padding: FIT_PADDING },
        attributionControl: { compact: true },
      });
      instance.addControl(
        new maplibre.NavigationControl({ showCompass: false }),
        'top-right',
      );
      instance.on('load', () => {
        collapseAttribution(instance as MapLibreMap);
        setLoaded(true);
      });
      instance.once('idle', () => collapseAttribution(instance as MapLibreMap));
      setMap(instance);
    });
    return () => {
      cancelled = true;
      instance?.remove();
      setMap(null);
      setLoaded(false);
    };
  }, []);

  // Sources and layers (added once the base style is ready).
  useEffect(() => {
    if (!map || !loaded) return;

    map.addSource(SOURCE_CADASTRE, {
      type: 'vector',
      tiles: [CADASTRE_TILES_URL],
      minzoom: 11,
      maxzoom: 16,
      attribution: '© DINUM · cadastre.data.gouv.fr',
    });
    map.addLayer({
      id: LAYER_CADASTRE_LINES,
      type: 'line',
      source: SOURCE_CADASTRE,
      'source-layer': 'parcelles',
      minzoom: CADASTRE_MIN_ZOOM,
      paint: { 'line-color': '#7a7a7a', 'line-width': 0.8, 'line-opacity': 0.7 },
    });

    map.addSource(SOURCE_PARCELS, {
      type: 'geojson',
      data: parcelsToGeoJson(gardensRef.current),
    });
    map.addLayer({
      id: LAYER_PARCELS_FILL,
      type: 'fill',
      source: SOURCE_PARCELS,
      paint: { 'fill-color': MODE_COLOR as never, 'fill-opacity': 0.5 },
    });
    map.addLayer({
      id: LAYER_PARCELS_LINE,
      type: 'line',
      source: SOURCE_PARCELS,
      paint: { 'line-color': MODE_COLOR as never, 'line-width': 2.5 },
    });

    // Clustered points: one per garden, merged into numbered clusters when zoomed out.
    map.addSource(SOURCE_POINTS, {
      type: 'geojson',
      data: pointsToGeoJson(gardensRef.current),
      cluster: true,
      clusterRadius: CLUSTER_RADIUS,
      clusterMaxZoom: CLUSTER_MAX_ZOOM,
    });
    map.addLayer({
      id: LAYER_CLUSTERS,
      type: 'circle',
      source: SOURCE_POINTS,
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': [
          'step',
          ['get', 'point_count'],
          CLUSTER_COLORS.small,
          10,
          CLUSTER_COLORS.medium,
          30,
          CLUSTER_COLORS.large,
        ],
        'circle-radius': ['step', ['get', 'point_count'], 16, 10, 21, 30, 27],
        'circle-stroke-width': 3,
        'circle-stroke-color': '#ffffff',
        'circle-opacity': 0.92,
      },
    });
    map.addLayer({
      id: LAYER_CLUSTER_COUNT,
      type: 'symbol',
      source: SOURCE_POINTS,
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': CLUSTER_FONT,
        'text-size': 13,
        'text-allow-overlap': true,
      },
      paint: { 'text-color': '#ffffff' },
    });
    map.addLayer({
      id: LAYER_POINT,
      type: 'circle',
      source: SOURCE_POINTS,
      maxzoom: POINTS_MAX_ZOOM,
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': MODE_COLOR as never,
        'circle-radius': 8,
        'circle-stroke-width': 2.5,
        'circle-stroke-color': '#ffffff',
      },
    });

    // Click a cluster to zoom into it, a garden to open its page.
    map.on('click', LAYER_CLUSTERS, async (event) => {
      const feature = event.features?.[0];
      if (!feature || feature.geometry.type !== 'Point') return;
      const clusterId = feature.properties?.cluster_id as number;
      const source = map.getSource<GeoJSONSource>(SOURCE_POINTS);
      const zoom = await source?.getClusterExpansionZoom(clusterId);
      if (zoom === undefined) return;
      map.easeTo({
        center: feature.geometry.coordinates as [number, number],
        zoom: zoom + 0.5,
      });
    });
    const open = (event: { features?: { properties?: Record<string, unknown> }[] }) => {
      const id = event.features?.[0]?.properties?.id;
      if (typeof id === 'string') onOpenRef.current(id);
    };
    map.on('click', LAYER_POINT, open);
    map.on('click', LAYER_PARCELS_FILL, open);
    [LAYER_CLUSTERS, LAYER_POINT, LAYER_PARCELS_FILL].forEach((layer) => {
      map.on('mouseenter', layer, () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', layer, () => {
        map.getCanvas().style.cursor = '';
      });
    });
  }, [map, loaded]);

  // Keep the data in sync with the filtered listings.
  useEffect(() => {
    if (!map || !loaded) return;
    map.getSource<GeoJSONSource>(SOURCE_POINTS)?.setData(pointsToGeoJson(gardens));
    map.getSource<GeoJSONSource>(SOURCE_PARCELS)?.setData(parcelsToGeoJson(gardens));
  }, [map, loaded, gardens]);

  // Zoom on the selected commune, back to France otherwise.
  useEffect(() => {
    if (!map) return;
    const city = findCity(selectedCity);
    if (city) map.flyTo({ center: [city.lng, city.lat], zoom: CITY_ZOOM });
    else map.fitBounds(FRANCE_BOUNDS, { padding: FIT_PADDING });
  }, [map, selectedCity]);

  // Zoom on one garden on demand.
  useEffect(() => {
    if (!map || !focus) return;
    const garden = gardensRef.current.find((candidate) => candidate.id === focus.id);
    if (garden) map.flyTo({ center: garden.center, zoom: PARCEL_ZOOM });
  }, [map, focus]);

  return (
    <div
      ref={container}
      className="border-line aspect-[4/3] w-full overflow-hidden rounded-2xl border sm:aspect-[16/9] lg:aspect-square"
      role="region"
      aria-label="Carte des jardins"
    />
  );
};
