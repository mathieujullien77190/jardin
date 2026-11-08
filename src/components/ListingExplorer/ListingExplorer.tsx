'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import {
  CITIES,
  MODE_INFO,
  RADIUS_OPTIONS,
  SORT_OPTIONS,
  listingRoute,
} from '@/constants';
import type { SortId } from '@/constants';
import { distanceToListing, listingPoint } from '@/helpers/geo';
import { filterListings, ratingOf } from '@/helpers/listings';
import type { ListingFilters } from '@/helpers/listings';
import { useApp } from '@/hooks/useApp';
import ListingCard from '../ListingCard';
import MapView from '../MapView';
import type { MapFocus, MapGarden } from '../MapView/types';
import Button from '../ui/Button';
import Chip from '../ui/Chip';
import EmptyState from '../ui/EmptyState';
import {
  ALL_MODES_INFO,
  DEFAULT_FILTERS,
  EQUIPMENT_FILTERS,
  PAGE_SIZE,
} from './constants';

const MODE_OPTIONS = [
  { id: 'all', ...ALL_MODES_INFO },
  { id: 'cueillette', ...MODE_INFO.cueillette },
  { id: 'location', ...MODE_INFO.location },
] as const;

const inputClass = 'w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm';

export const ListingExplorer = () => {
  const { db, user, ready, toggleFavorite } = useApp();
  const router = useRouter();
  const [filters, setFilters] = useState<ListingFilters>(DEFAULT_FILTERS);
  const [focus, setFocus] = useState<MapFocus | null>(null);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const patch = (change: Partial<ListingFilters>): void => {
    setFilters((current) => ({ ...current, ...change }));
    setVisible(PAGE_SIZE);
  };

  const results = useMemo(
    () => filterListings(db.listings, db.reviews, filters),
    [db.listings, db.reviews, filters],
  );
  // Every result is a map point (cadastral parcel centre, else its commune).
  const mapGardens = useMemo<MapGarden[]>(
    () =>
      results.flatMap((listing) => {
        const center = listingPoint(listing);
        return center
          ? [
              {
                id: listing.id,
                title: listing.title,
                mode: listing.mode,
                center,
                ring: listing.parcel?.ring,
              },
            ]
          : [];
      }),
    [results],
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

      <div className="mt-5">
        <p className="text-mute mb-2 text-xs font-bold tracking-wide uppercase">
          Type d’annonce
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {MODE_OPTIONS.map((option) => {
            const active = filters.mode === option.id;
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={active}
                onClick={() => patch({ mode: option.id })}
                className={`rounded-2xl border-2 p-3 text-left transition ${
                  active
                    ? 'border-brand bg-brand-soft'
                    : 'border-line bg-surface hover:border-brand'
                }`}
              >
                <span className="font-bold">
                  {option.emoji} {option.title}
                </span>
                <span className="text-mute mt-0.5 block text-xs leading-snug">
                  {option.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-mute mr-1 text-xs font-bold tracking-wide uppercase">
          Équipements
        </span>
        {EQUIPMENT_FILTERS.map((filter) => (
          <Chip
            key={filter.key}
            label={filter.label}
            active={filters[filter.key]}
            onClick={() => patch({ [filter.key]: !filters[filter.key] })}
          />
        ))}
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
              {results.slice(0, visible).map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  rating={ratingOf(db.reviews, listing.id)}
                  favorite={favorites.includes(listing.id)}
                  distance={
                    filters.city ? distanceToListing(filters.city, listing) : null
                  }
                  onToggleFavorite={toggleFavorite}
                  onShowOnMap={(id) =>
                    setFocus((current) => ({ id, seq: (current?.seq ?? 0) + 1 }))
                  }
                />
              ))}
            </div>
          )}
          {results.length > visible && (
            <div className="mt-6 flex justify-center">
              <Button variant="ghost" onClick={() => setVisible((n) => n + PAGE_SIZE)}>
                Voir plus de jardins ({results.length - visible})
              </Button>
            </div>
          )}
        </div>
        <aside className="order-first lg:sticky lg:top-24 lg:order-none lg:self-start">
          <MapView
            gardens={mapGardens}
            selectedCity={filters.city}
            focus={focus}
            onOpenGarden={(id) => router.push(listingRoute(id))}
          />
          <p className="text-mute mt-2 text-xs">
            Cercles : jardins regroupés (clic pour zoomer). 📍 sur une annonce : zoom sur
            sa parcelle cadastrale.
          </p>
        </aside>
      </div>
    </section>
  );
};
