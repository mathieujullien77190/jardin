import type { Db } from '@/types';
import { SEED_DB } from '@/constants';

export const parseDb = (raw: string | null | undefined): Db => {
  if (!raw) return SEED_DB;
  try {
    const parsed = JSON.parse(raw) as Partial<Db>;
    return { ...SEED_DB, ...parsed, favorites: parsed.favorites ?? {} };
  } catch {
    return SEED_DB;
  }
};

export const parseSession = (raw: string | null | undefined): string | null => {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    return typeof value === 'string' ? value : null;
  } catch {
    return null;
  }
};
