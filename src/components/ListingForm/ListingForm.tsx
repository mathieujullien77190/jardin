'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  CITIES,
  INPUT_CLASS,
  MODE_LABELS,
  PRODUCE_OPTIONS,
  UNIT_BY_MODE,
  WATER_LABELS,
  WEEK_DAYS,
  listingRoute,
} from '@/constants';
import { useApp } from '@/hooks/useApp';
import { useQueryId } from '@/hooks/useQueryId';
import type { ListingMode, WaterAccess } from '@/types';
import PhotoPicker from '../PhotoPicker';
import RequireAuth from '../RequireAuth';
import Button from '../ui/Button';
import Chip from '../ui/Chip';
import EmptyState from '../ui/EmptyState';
import Field from '../ui/Field';
import {
  appearanceFor,
  draftFromListing,
  emptyDraft,
  toggleSlot,
  toggleValue,
  updateSlot,
  validateDraft,
} from './helpers';
import type { DraftErrors, ListingDraft, ListingFormProps } from './types';

type FormProps = { initial: ListingDraft; listingId?: string };

const Form = ({ initial, listingId }: FormProps) => {
  const { saveListing } = useApp();
  const router = useRouter();
  const [draft, setDraft] = useState<ListingDraft>(initial);
  const [errors, setErrors] = useState<DraftErrors>({});
  const patch = (change: Partial<ListingDraft>): void =>
    setDraft((current) => ({ ...current, ...change }));

  const changeMode = (mode: ListingMode): void =>
    patch({
      mode,
      unit: UNIT_BY_MODE[mode][0],
      price: mode === 'location' ? 120 : 5,
    });

  const submit = (): void => {
    const found = validateDraft(draft);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    const id = saveListing({ ...draft, ...appearanceFor(draft.produce) }, listingId);
    if (id) router.push(listingRoute(id));
  };

  return (
    <form
      className="mx-auto max-w-3xl space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <h1 className="text-2xl font-extrabold">
        {listingId ? 'Modifier mon annonce' : 'Proposer mon jardin'}
      </h1>

      <section className="border-line bg-surface space-y-4 rounded-2xl border p-5">
        <div className="flex gap-2">
          {(Object.keys(MODE_LABELS) as ListingMode[]).map((mode) => (
            <Chip
              key={mode}
              label={mode === 'cueillette' ? '🍓 Cueillette' : '🥕 Location de parcelle'}
              active={draft.mode === mode}
              onClick={() => changeMode(mode)}
            />
          ))}
        </div>
        <Field label="Titre" error={errors.title}>
          <input
            className={INPUT_CLASS}
            value={draft.title}
            onChange={(e) => patch({ title: e.target.value })}
          />
        </Field>
        <Field label="Description" error={errors.description}>
          <textarea
            rows={4}
            className={INPUT_CLASS}
            value={draft.description}
            onChange={(e) => patch({ description: e.target.value })}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Commune" error={errors.city}>
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
          <Field label="Surface cultivable (m²)" error={errors.area}>
            <input
              type="number"
              min={1}
              className={INPUT_CLASS}
              value={draft.area}
              onChange={(e) => patch({ area: Number(e.target.value) })}
            />
          </Field>
          <Field
            label={draft.mode === 'location' ? 'Participation annuelle (€)' : 'Prix (€)'}
            error={errors.price}
          >
            <input
              type="number"
              min={0}
              className={INPUT_CLASS}
              value={draft.price}
              onChange={(e) => patch({ price: Number(e.target.value) })}
            />
          </Field>
          {draft.mode === 'cueillette' && (
            <Field label="Unité">
              <select
                className={INPUT_CLASS}
                value={draft.unit}
                onChange={(e) => patch({ unit: e.target.value as ListingDraft['unit'] })}
              >
                {UNIT_BY_MODE.cueillette.map((unit) => (
                  <option key={unit} value={unit}>
                    par {unit}
                  </option>
                ))}
              </select>
            </Field>
          )}
        </div>
        <div>
          <p className="mb-1 text-sm font-semibold">Cultures</p>
          <div className="flex flex-wrap gap-2">
            {PRODUCE_OPTIONS.map((option) => (
              <Chip
                key={option.label}
                label={`${option.emoji} ${option.label}`}
                active={draft.produce.includes(option.label)}
                onClick={() =>
                  patch({ produce: toggleValue(draft.produce, option.label) })
                }
              />
            ))}
          </div>
          {errors.produce && <p className="text-danger mt-1 text-xs">{errors.produce}</p>}
        </div>
      </section>

      <section className="border-line bg-surface space-y-4 rounded-2xl border p-5">
        <h2 className="font-bold">Équipements</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Accès à l’eau">
            <select
              className={INPUT_CLASS}
              value={draft.water}
              onChange={(e) => patch({ water: e.target.value as WaterAccess })}
            >
              {(Object.keys(WATER_LABELS) as WaterAccess[]).map((water) => (
                <option key={water} value={water}>
                  {WATER_LABELS[water]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Personnes présentes en même temps (max)">
            <input
              type="number"
              min={1}
              className={INPUT_CLASS}
              value={draft.maxPeople}
              onChange={(e) => patch({ maxPeople: Number(e.target.value) })}
            />
          </Field>
        </div>
        <div className="flex flex-wrap gap-2">
          <Chip
            label="🚰 Compteur d’eau individuel"
            active={draft.waterMeter}
            onClick={() => patch({ waterMeter: !draft.waterMeter })}
          />
          <Chip
            label="🧰 Outils fournis"
            active={draft.toolsProvided}
            onClick={() => patch({ toolsProvided: !draft.toolsProvided })}
          />
          <Chip
            label="🚻 Toilettes"
            active={draft.toilets}
            onClick={() => patch({ toilets: !draft.toilets })}
          />
        </div>
        {draft.toolsProvided && draft.mode === 'location' && (
          <Field
            label="Participation annuelle aux outils (€)"
            hint="0 = gratuit ou symbolique"
          >
            <input
              type="number"
              min={0}
              className={INPUT_CLASS}
              value={draft.toolsPrice}
              onChange={(e) => patch({ toolsPrice: Number(e.target.value) })}
            />
          </Field>
        )}
        <Field label="Autres équipements" hint="Abri, piscine, jeux, composteur…">
          <input
            className={INPUT_CLASS}
            value={draft.equipment}
            onChange={(e) => patch({ equipment: e.target.value })}
          />
        </Field>
      </section>

      <section className="border-line bg-surface space-y-3 rounded-2xl border p-5">
        <h2 className="font-bold">Plages d’accès</h2>
        <div className="space-y-2">
          {WEEK_DAYS.map((label, day) => {
            const slot = draft.accessSlots.find((candidate) => candidate.day === day);
            return (
              <div key={label} className="flex flex-wrap items-center gap-3">
                <label className="flex w-20 items-center gap-2 text-sm font-semibold">
                  <input
                    type="checkbox"
                    checked={Boolean(slot)}
                    onChange={() =>
                      patch({ accessSlots: toggleSlot(draft.accessSlots, day) })
                    }
                  />
                  {label}
                </label>
                {slot && (
                  <>
                    <input
                      type="time"
                      className={`${INPUT_CLASS} !w-auto`}
                      value={slot.from}
                      onChange={(e) =>
                        patch({
                          accessSlots: updateSlot(draft.accessSlots, day, {
                            from: e.target.value,
                          }),
                        })
                      }
                    />
                    <span>→</span>
                    <input
                      type="time"
                      className={`${INPUT_CLASS} !w-auto`}
                      value={slot.to}
                      onChange={(e) =>
                        patch({
                          accessSlots: updateSlot(draft.accessSlots, day, {
                            to: e.target.value,
                          }),
                        })
                      }
                    />
                  </>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-line bg-surface space-y-4 rounded-2xl border p-5">
        <PhotoPicker photos={draft.photos} onChange={(photos) => patch({ photos })} />
        <h2 className="font-bold">Coordonnées privées</h2>
        <p className="text-mute text-xs">
          Visibles uniquement par vous et par le jardinier ayant payé.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Adresse exacte" error={errors.address}>
            <input
              className={INPUT_CLASS}
              value={draft.address}
              onChange={(e) => patch({ address: e.target.value })}
            />
          </Field>
          <Field label="Téléphone">
            <input
              className={INPUT_CLASS}
              value={draft.phone}
              onChange={(e) => patch({ phone: e.target.value })}
            />
          </Field>
        </div>
      </section>

      <div className="flex gap-3">
        <Button type="submit">{listingId ? 'Enregistrer' : 'Publier l’annonce'}</Button>
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
  const listing = db.listings.find((candidate) => candidate.id === id);
  if (!listing || listing.ownerId !== user?.id) {
    return (
      <EmptyState
        emoji="🤷"
        title="Annonce introuvable"
        text="Elle n’existe pas ou n’est pas à vous."
      />
    );
  }
  return (
    <Form key={listing.id} initial={draftFromListing(listing)} listingId={listing.id} />
  );
};

const NewLoader = () => {
  const { user } = useApp();
  return <Form initial={emptyDraft(user?.city ?? '')} />;
};

export const ListingForm = ({ editing = false }: ListingFormProps) => (
  <RequireAuth>{editing ? <EditLoader /> : <NewLoader />}</RequireAuth>
);
