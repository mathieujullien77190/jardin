import { SEASONS_AHEAD } from '@/constants';

export const seasonOptions = (): number[] => {
  const year = new Date().getFullYear();
  return Array.from({ length: SEASONS_AHEAD }, (_, index) => year + index);
};
