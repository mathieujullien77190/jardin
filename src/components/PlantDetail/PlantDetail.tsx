'use client';

import { useRouter } from 'next/navigation';
import { PLANT_KINDS, ROUTES, editPlantRoute } from '@/constants';
import { formatDate } from '@/helpers/format';
import { useApp } from '@/hooks/useApp';
import { useQueryId } from '@/hooks/useQueryId';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import EmptyState from '../ui/EmptyState';

export const PlantDetail = () => {
  const { db, user, ready, setPlantStatus, deletePlant } = useApp();
  const router = useRouter();
  const id = useQueryId();
  const plant = db.plants.find((candidate) => candidate.id === id);

  if (!ready) return <p className="text-mute py-20 text-center">Chargement…</p>;
  if (!plant || (plant.status === 'donne' && plant.ownerId !== user?.id)) {
    return (
      <EmptyState
        emoji="🥀"
        title="Don introuvable"
        action={<Button href={ROUTES.swap}>Retour aux échanges</Button>}
      />
    );
  }

  const owner = db.users.find((candidate) => candidate.id === plant.ownerId);
  const isOwner = user?.id === plant.ownerId;
  const kind = PLANT_KINDS[plant.kind];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="bg-brand-soft grid h-64 place-items-center overflow-hidden rounded-3xl text-8xl">
        {plant.photos[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={plant.photos[0]}
            alt={plant.title}
            className="h-full w-full object-cover"
          />
        ) : (
          kind.emoji
        )}
      </div>
      {plant.photos.length > 1 && (
        <div className="flex gap-2">
          {plant.photos.slice(1).map((photo, index) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={index}
              src={photo}
              alt=""
              className="h-20 w-20 rounded-lg object-cover"
            />
          ))}
        </div>
      )}
      <div>
        <div className="flex gap-2">
          <Badge tone="green">{kind.label}</Badge>
          <Badge tone={plant.status === 'donne' ? 'red' : 'orange'}>
            {plant.status === 'donne' ? 'Donné' : 'Disponible'}
          </Badge>
        </div>
        <h1 className="mt-2 text-3xl font-extrabold">{plant.title}</h1>
        <p className="text-mute">
          {plant.city} · quantité {plant.quantity} · publié le{' '}
          {formatDate(plant.createdAt)} par {owner?.name ?? 'un membre'}
        </p>
        <p className="mt-4">{plant.description}</p>
      </div>

      <div className="border-line bg-surface rounded-2xl border border-dashed p-4 text-sm">
        {user ? (
          <p>
            📞{' '}
            {plant.phone ||
              'Pas de téléphone renseigné : contactez le membre via les annonces.'}
          </p>
        ) : (
          <p className="text-mute">
            🔒 Connectez-vous pour voir le téléphone du donateur.
          </p>
        )}
      </div>

      {isOwner && (
        <div className="flex flex-wrap gap-2">
          <Button href={editPlantRoute(plant.id)} variant="ghost">
            Modifier
          </Button>
          <Button
            variant="ghost"
            onClick={() =>
              setPlantStatus(plant.id, plant.status === 'donne' ? 'disponible' : 'donne')
            }
          >
            {plant.status === 'donne' ? 'Remettre disponible' : 'Marquer comme donné'}
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (window.confirm('Supprimer ce don ?')) {
                deletePlant(plant.id);
                router.push(ROUTES.swap);
              }
            }}
          >
            Supprimer
          </Button>
        </div>
      )}
    </div>
  );
};
