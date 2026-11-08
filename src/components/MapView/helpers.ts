import { CITIES } from '@/constants';
import { projectToMap } from '@/helpers/geo';

export type Bubble = { name: string; count: number; x: number; y: number; size: number };

export const buildBubbles = (counts: Record<string, number>): Bubble[] =>
  CITIES.filter((city) => (counts[city.name] ?? 0) > 0).map((city) => {
    const count = counts[city.name] ?? 0;
    const { x, y } = projectToMap(city);
    return { name: city.name, count, x, y, size: 28 + Math.min(count, 5) * 6 };
  });
