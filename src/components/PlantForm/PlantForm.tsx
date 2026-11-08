'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CITIES, INPUT_CLASS, PLANT_KINDS, plantRoute } from '@/constants';
import { useApp } from '@/hooks/useApp';
import { useQueryId } from '@/hooks/useQueryId';
import type { PlantKind } from '@/types';
import PhotoPicker from '../PhotoPicker';
import RequireAuth from '../RequireAuth';
import Button from '../ui/Button';
import Chip from '../ui/Chip';
import EmptyState from '../ui/EmptyState';
import Field from '../ui/Field';
import { draftFromPlant, emptyPlantDraft, isPlantDraftValid } from './helpers';
import type { PlantDraft, PlantFormProps } from './types';

type FormProps = { initial: PlantDraft; plantId?: string };

const Form = ({ initial, plantId }: FormProps) => {
  const { savePlant } = useApp();
  const router = useRouter();
  const [draft, setDraft] = useState<PlantDraft>(initial);
  const [touched, setTouched] = useState(false);
  const patch = (change: Partial<PlantDraft>): void =>
    setDraft((current) => ({ ...current, ...change }));

  return (
    <form
      className="mx-auto max-w-2xl space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        setTouched(true);
        if (!isPlantDraftValid(draft)) return;
        const id = savePlant(draft, plantId);
        if (id) router.push(plantRoute(id));
      }}
    >
      <h1 className="text-2xl font-extrabold">
        {plantId ? 'Modifier mon don' : 'Proposer un don'}
      </h1>
      <div className="flex flex-wrap gap-2">
        {(Object.keys(PLANT_KINDS) as PlantKind[]).map((id) => (
          <Chip
            key={id}
            label={`${PLANT_KINDS[id].emoji} ${PLANT_KINDS[id].label}`}
            active={draft.kind === id}
            onClick={() => patch({ kind: id })}
          />
        ))}
      </div>
      <Field
        label="Titre"
        error={touched && !draft.title.trim() ? 'Titre requis.' : undefined}
      >
        <input
          className={INPUT_CLASS}
          value={draft.title}
          onChange={(e) => patch({ title: e.target.value })}
        />
      </Field>
      <Field label="Description">
        <textarea
          rows={4}
          className={INPUT_CLASS}
          value={draft.description}
          onChange={(e) => patch({ description: e.target.value })}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Quantité">
          <input
            type="number"
            min={1}
            className={INPUT_CLASS}
            value={draft.quantity}
            onChange={(e) => patch({ quantity: Number(e.target.value) })}
          />
        </Field>
        <Field
          label="Commune"
          error={touched && !draft.city ? 'Commune requise.' : undefined}
        >
          <select
            className={INPUT_CLASS}
            value={draft.city}
            onChange={(e) => patch({ city: e.target.value })}
          >
            <option value="">Choisir…</option>
            {CITIES.map((city) => (
              <option key={city.name}>{city.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Téléphone (facultatif)" hint="Visible des membres connectés.">
          <input
            className={INPUT_CLASS}
            value={draft.phone}
            onChange={(e) => patch({ phone: e.target.value })}
          />
        </Field>
      </div>
      <PhotoPicker photos={draft.photos} onChange={(photos) => patch({ photos })} />
      <div className="flex gap-3">
        <Button type="submit">{plantId ? 'Enregistrer' : 'Publier le don'}</Button>
        <Button variant="ghost" onClick={() => router.back()}>
          Annuler
        </Button>
      </div>
    </form>
  );
};

const EditLoader = () => {
  const { db, user } = useApp();
  const id = useQueryId();
  const plant = db.plants.find((candidate) => candidate.id === id);
  if (!plant || plant.ownerId !== user?.id) {
    return (
      <EmptyState
        emoji="🤷"
        title="Don introuvable"
        text="Il n’existe pas ou n’est pas à vous."
      />
    );
  }
  return <Form key={plant.id} initial={draftFromPlant(plant)} plantId={plant.id} />;
};

const NewLoader = () => {
  const { user } = useApp();
  return <Form initial={emptyPlantDraft(user?.city ?? '')} />;
};

export const PlantForm = ({ editing = false }: PlantFormProps) => (
  <RequireAuth>{editing ? <EditLoader /> : <NewLoader />}</RequireAuth>
);
