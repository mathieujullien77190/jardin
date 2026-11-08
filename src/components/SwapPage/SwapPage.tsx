'use client';

import Link from 'next/link';
import { useState } from 'react';
import { INPUT_CLASS, PLANT_KINDS, ROUTES, plantRoute } from '@/constants';
import { useApp } from '@/hooks/useApp';
import type { PlantKind } from '@/types';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Chip from '../ui/Chip';
import EmptyState from '../ui/EmptyState';

export const SwapPage = () => {
  const { db, user } = useApp();
  const [kind, setKind] = useState<PlantKind | 'all'>('all');
  const [query, setQuery] = useState('');
  const text = query.trim().toLowerCase();

  const plants = db.plants.filter(
    (plant) =>
      (plant.status === 'disponible' || plant.ownerId === user?.id) &&
      (kind === 'all' || plant.kind === kind) &&
      (!text ||
        `${plant.title} ${plant.city} ${plant.description}`.toLowerCase().includes(text)),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Échanges de plantes</h1>
          <p className="text-mute text-sm">
            Dons gratuits de plants, semis, graines et boutures entre membres.
          </p>
        </div>
        <Button href={user ? ROUTES.newPlant : ROUTES.login}>+ Proposer un don</Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Chip label="Tout" active={kind === 'all'} onClick={() => setKind('all')} />
        {(Object.keys(PLANT_KINDS) as PlantKind[]).map((id) => (
          <Chip
            key={id}
            label={`${PLANT_KINDS[id].emoji} ${PLANT_KINDS[id].label}`}
            active={kind === id}
            onClick={() => setKind(id)}
          />
        ))}
        <input
          className={`${INPUT_CLASS} ml-auto !w-56`}
          placeholder="Rechercher…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {plants.length === 0 ? (
        <EmptyState
          emoji="🪴"
          title="Aucun don pour le moment"
          text="Soyez le premier à partager !"
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {plants.map((plant) => (
            <Link
              key={plant.id}
              href={plantRoute(plant.id)}
              className="border-line bg-surface overflow-hidden rounded-2xl border transition hover:shadow-md"
            >
              <div className="bg-brand-soft grid h-36 place-items-center text-5xl">
                {plant.photos[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={plant.photos[0]}
                    alt={plant.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  PLANT_KINDS[plant.kind].emoji
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold">{plant.title}</h3>
                  {plant.status === 'donne' && <Badge tone="red">Donné</Badge>}
                </div>
                <p className="text-mute text-sm">
                  {PLANT_KINDS[plant.kind].label} · ×{plant.quantity} · {plant.city}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
