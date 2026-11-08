import type { Feature, FeatureCollection, Point, Polygon } from 'geojson';
import type { MapGarden } from './types';

type GardenProps = { id: string; title: string; mode: string };

export const pointsToGeoJson = (
  gardens: MapGarden[],
): FeatureCollection<Point, GardenProps> => ({
  type: 'FeatureCollection',
  features: gardens.map((garden) => ({
    type: 'Feature',
    properties: { id: garden.id, title: garden.title, mode: garden.mode },
    geometry: { type: 'Point', coordinates: garden.center },
  })),
});

export const parcelsToGeoJson = (
  gardens: MapGarden[],
): FeatureCollection<Polygon, GardenProps> => ({
  type: 'FeatureCollection',
  features: gardens.flatMap((garden): Feature<Polygon, GardenProps>[] =>
    garden.ring
      ? [
          {
            type: 'Feature',
            properties: { id: garden.id, title: garden.title, mode: garden.mode },
            geometry: { type: 'Polygon', coordinates: [garden.ring] },
          },
        ]
      : [],
  ),
});
