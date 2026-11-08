'use client';

import { useMemo, useState } from 'react';
import { CITIES, RADIUS_OPTIONS, SORT_OPTIONS } from '@/constants';
import type { SortId } from '@/constants';
import { cityDistance } from '@/helpers/geo';
import { countByCity, filterListings, ratingOf } from '@/helpers/listings';
import type { ListingFilters } from '@/helpers/listings';
import { useApp } from '@/hooks/useApp';
import ListingCard from '../ListingCard';
import MapView from '../MapView';
import Chip from '../ui/Chip';
import EmptyState from '../ui/EmptyState';
import { DEFAULT_FILTERS, MODE_CHIPS } from './constants';

const inputClass = 'w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm';

export const ListingExplorer = () => {
  const { db, user, ready, toggleFavorite } = useApp();
  const [filters, setFilters] = useState<ListingFilters>(DEFAULT_FILTERS);
  const patch = (change: Partial<ListingFilters>): void =>
    setFilters((current) => ({ ...current, ...change }));

  const results = useMemo(
    () => filterListings(db.listings, db.reviews, filters),
    [db.listings, db.reviews, filters],
  );
  const mapCounts = useMemo(
    () => countByCity(filterListings(db.listings, db.reviews, { ...filters, city: '' })),
    [db.listings, db.reviews, filters],
  );
  const favorites = user ? (db.favorites[user.id] ?? []) : [];

  return (
    <section>
      <div className="border-line bg-surface grid gap-3 rounded-2xl border p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-5">
        <input
          className={`${inputClass} lg:col-span-2`}
          placeholder="Rechercher : ville, fruit, légume…"
          value={filters.query}
          onChange={(event) => patch({ query: event.target.value })}
        />
        <select
          className={inputClass}
          value={filters.city}
          onChange={(event) => patch({ city: event.target.value })}
          aria-label="Commune"
        >
          <option value="">Toute la France</option>
          {CITIES.map((city) => (
            <option key={city.name} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
        <select
          className={inputClass}
          disabled={!filters.city}
          value={filters.radius}
          onChange={(event) => patch({ radius: Number(event.target.value) })}
          aria-label="Rayon"
        >
          {RADIUS_OPTIONS.map((radius) => (
            <option key={radius} value={radius}>
              Rayon {radius} km
            </option>
          ))}
        </select>
        <input
          className={inputClass}
          type="number"
          min={0}
          placeholder="Prix max (€)"
          value={filters.maxPrice ?? ''}
          onChange={(event) =>
            patch({
              maxPrice: event.target.value === '' ? null : Number(event.target.value),
            })
          }
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {MODE_CHIPS.map((chip) => (
          <Chip
            key={chip.id}
            label={chip.label}
            active={filters.mode === chip.id}
            onClick={() => patch({ mode: chip.id })}
          />
        ))}
        <span className="bg-line mx-1 hidden h-5 w-px sm:block" />
        <Chip
          label="🧰 Outils"
          active={filters.tools}
          onClick={() => patch({ tools: !filters.tools })}
        />
        <Chip
          label="💧 Eau"
          active={filters.water}
          onClick={() => patch({ water: !filters.water })}
        />
        <Chip
          label="🚻 Toilettes"
          active={filters.toilets}
          onClick={() => patch({ toilets: !filters.toilets })}
        />
        {user?.city && filters.city !== user.city && (
          <Chip
            label={`📍 Près de moi (${user.city})`}
            onClick={() => patch({ city: user.city })}
          />
        )}
        <select
          className="border-line bg-surface ml-auto rounded-xl border px-3 py-2 text-sm"
          value={filters.sort}
          onChange={(event) => patch({ sort: event.target.value as SortId })}
          aria-label="Tri"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div>
          <h2 className="mb-3 text-lg font-bold">
            {ready ? results.length : '…'} jardin{results.length > 1 ? 's' : ''}
            {filters.city && ` autour de ${filters.city}`}
          </h2>
          {results.length === 0 ? (
            <EmptyState
              emoji="🔎"
              title="Aucun jardin trouvé"
              text="Élargissez le rayon ou retirez un filtre."
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-2">
              {results.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  rating={ratingOf(db.reviews, listing.id)}
                  favorite={favorites.includes(listing.id)}
                  distance={
                    filters.city ? cityDistance(filters.city, listing.city) : null
                  }
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          )}
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <MapView
            counts={mapCounts}
            selectedCity={filters.city}
            onSelectCity={(city) => patch({ city })}
          />
          <p className="text-mute mt-2 text-xs">
            Cliquez sur une bulle pour filtrer par commune.
          </p>
        </aside>
      </div>
    </section>
  );
};
