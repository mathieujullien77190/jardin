'use client';

import type { GeoJSONSource, Map as MapLibreMap, Marker } from 'maplibre-gl';
import { useEffect, useRef, useState } from 'react';
import { findCity } from '@/helpers/geo';
import { loadMapLibre } from '@/helpers/maplibre';
import {
  BUBBLE_LABEL_CLASS,
  CADASTRE_MIN_ZOOM,
  CADASTRE_TILES_URL,
  CITY_ZOOM,
  FIT_PADDING,
  FRANCE_BOUNDS,
  LAYER_CADASTRE_LINES,
  LAYER_PARCELS_FILL,
  LAYER_PARCELS_LINE,
  MAP_STYLE_URL,
  PARCEL_COLORS,
  PARCEL_ZOOM,
  SOURCE_CADASTRE,
  SOURCE_PARCELS,
} from './constants';
import { buildBubbles, bubbleClass, parcelsToGeoJson } from './helpers';
import type { MapViewProps } from './types';

type MapLibre = Awaited<ReturnType<typeof loadMapLibre>>;

export const MapView = ({
  counts,
  selectedCity,
  parcels,
  focus,
  onSelectCity,
  onOpenParcel,
}: MapViewProps) => {
  const container = useRef<HTMLDivElement>(null);
  const library = useRef<MapLibre | null>(null);
  const onSelectRef = useRef(onSelectCity);
  const onOpenRef = useRef(onOpenParcel);
  const parcelsRef = useRef(parcels);
  const [map, setMap] = useState<MapLibreMap | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    onSelectRef.current = onSelectCity;
    onOpenRef.current = onOpenParcel;
    parcelsRef.current = parcels;
  });

  // Create the map once.
  useEffect(() => {
    let cancelled = false;
    let instance: MapLibreMap | undefined;
    void loadMapLibre().then((maplibre) => {
      if (cancelled || !container.current) return;
      library.current = maplibre;
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
      instance.on('load', () => setLoaded(true));
      setMap(instance);
    });
    return () => {
      cancelled = true;
      instance?.remove();
      setMap(null);
      setLoaded(false);
    };
  }, []);

  // Cadastre lines + garden polygons (added once the base style is ready).
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
      data: parcelsToGeoJson(parcelsRef.current),
    });
    const color = [
      'match',
      ['get', 'mode'],
      'cueillette',
      PARCEL_COLORS.cueillette,
      PARCEL_COLORS.location,
    ] as const;
    map.addLayer({
      id: LAYER_PARCELS_FILL,
      type: 'fill',
      source: SOURCE_PARCELS,
      paint: { 'fill-color': color as never, 'fill-opacity': 0.5 },
    });
    map.addLayer({
      id: LAYER_PARCELS_LINE,
      type: 'line',
      source: SOURCE_PARCELS,
      paint: { 'line-color': color as never, 'line-width': 2.5 },
    });
    map.on('click', LAYER_PARCELS_FILL, (event) => {
      const id = event.features?.[0]?.properties?.id;
      if (typeof id === 'string') onOpenRef.current(id);
    });
    map.on('mouseenter', LAYER_PARCELS_FILL, () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', LAYER_PARCELS_FILL, () => {
      map.getCanvas().style.cursor = '';
    });
  }, [map, loaded]);

  // Keep the polygons in sync with the filtered listings.
  useEffect(() => {
    if (!map || !loaded) return;
    const source = map.getSource<GeoJSONSource>(SOURCE_PARCELS);
    source?.setData(parcelsToGeoJson(parcels));
  }, [map, loaded, parcels]);

  // One bubble marker per commune that has listings.
  useEffect(() => {
    const maplibre = library.current;
    if (!map || !maplibre) return;
    const markers: Marker[] = buildBubbles(counts).map((bubble) => {
      const selected = bubble.name === selectedCity;
      const element = document.createElement('button');
      element.type = 'button';
      element.title = `${bubble.name} · ${bubble.count} jardin(s)`;
      element.className = bubbleClass(selected);
      element.style.width = `${bubble.size}px`;
      element.style.height = `${bubble.size}px`;
      element.textContent = String(bubble.count);
      const label = document.createElement('span');
      label.className = BUBBLE_LABEL_CLASS;
      label.textContent = bubble.name;
      element.append(label);
      element.addEventListener('click', () =>
        onSelectRef.current(selected ? '' : bubble.name),
      );
      return new maplibre.Marker({ element })
        .setLngLat([bubble.lng, bubble.lat])
        .addTo(map);
    });
    return () => markers.forEach((marker) => marker.remove());
  }, [map, counts, selectedCity]);

  // Zoom on the selected commune, back to France otherwise.
  useEffect(() => {
    if (!map) return;
    const city = findCity(selectedCity);
    if (city) map.flyTo({ center: [city.lng, city.lat], zoom: CITY_ZOOM });
    else map.fitBounds(FRANCE_BOUNDS, { padding: FIT_PADDING });
  }, [map, selectedCity]);

  // Zoom on one garden parcel on demand.
  useEffect(() => {
    if (!map || !focus) return;
    const parcel = parcelsRef.current.find((candidate) => candidate.id === focus.id);
    if (parcel) map.flyTo({ center: parcel.center, zoom: PARCEL_ZOOM });
  }, [map, focus]);

  return (
    <div
      ref={container}
      className="border-line aspect-square w-full overflow-hidden rounded-2xl border"
      role="region"
      aria-label="Carte des jardins"
    />
  );
};
