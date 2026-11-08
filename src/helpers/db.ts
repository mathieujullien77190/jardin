import type { Db } from '@/types';
import {
  DEMO_USER_ID,
  SEED_DB,
  SEED_PARCELS,
  SEED_VERSION,
  STARTER_TEMPLATES,
} from '@/constants';

const missingById = <T extends { id: string }>(seed: T[], stored: T[]): T[] => {
  const known = new Set(stored.map((item) => item.id));
  return seed.filter((item) => !known.has(item.id));
};

// Starter gardens already copied into an account keep their own data (price, photos…)
// but move to the current template location and cadastral parcel.
const relocateStarters = (listings: Db['listings']): Db['listings'] => {
  const seedIds = new Set(SEED_DB.listings.map((listing) => listing.id));
  return listings.map((listing) => {
    const template = STARTER_TEMPLATES.find(
      (candidate) => candidate.title === listing.title,
    );
    if (!template || seedIds.has(listing.id)) return listing;
    return {
      ...listing,
      city: template.city,
      address: template.address,
      location: undefined,
      parcel: SEED_PARCELS[template.templateId],
    };
  });
};

// Adds demo items introduced by a newer seed without touching the user's own data.
const upgradeSeed = (stored: Db): Db => {
  if ((stored.seedVersion ?? 0) >= SEED_VERSION) return stored;
  return {
    ...stored,
    users: [...stored.users, ...missingById(SEED_DB.users, stored.users)].map((user) =>
      user.id === DEMO_USER_ID ? { ...user, city: 'Melun' } : user,
    ),
    listings: [
      ...relocateStarters(stored.listings),
      ...missingById(SEED_DB.listings, stored.listings),
    ],
    plants: [...stored.plants, ...missingById(SEED_DB.plants, stored.plants)],
    reviews: [...stored.reviews, ...missingById(SEED_DB.reviews, stored.reviews)],
    seedVersion: SEED_VERSION,
  };
};

export const parseDb = (raw: string | null | undefined): Db => {
  if (!raw) return SEED_DB;
  try {
    const parsed = JSON.parse(raw) as Partial<Db>;
    return upgradeSeed({
      ...SEED_DB,
      ...parsed,
      favorites: parsed.favorites ?? {},
      seedVersion: parsed.seedVersion ?? 0,
    });
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
