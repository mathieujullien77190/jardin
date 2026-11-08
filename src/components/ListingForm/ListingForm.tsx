'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import {
  INPUT_CLASS,
  MODE_INFO,
  PRODUCE_OPTIONS,
  UNIT_BY_MODE,
  WATER_LABELS,
  WEEK_DAYS,
  listingRoute,
} from '@/constants';
import type { AddressResult } from '@/helpers/address';
import { fetchParcelAt } from '@/helpers/cadastre';
import { useApp } from '@/hooks/useApp';
import { useQueryId } from '@/hooks/useQueryId';
import type { ListingMode, WaterAccess } from '@/types';
import AddressPicker from '../AddressPicker';
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

type ParcelState = 'idle' | 'loading' | 'found' | 'none';

const Form = ({ initial, listingId }: FormProps) => {
  const { saveListing } = useApp();
  const router = useRouter();
  const [draft, setDraft] = useState<ListingDraft>(initial);
  const [errors, setErrors] = useState<DraftErrors>({});
  const [parcelState, setParcelState] = useState<ParcelState>(
    initial.parcel ? 'found' : 'idle',
  );
  const requestId = useRef(0);
  const patch = (change: Partial<ListingDraft>): void =>
    setDraft((current) => ({ ...current, ...change }));

  // Typing again invalidates the previous pick: an address must be chosen from the list.
  const changeAddressText = (text: string): void => {
    if (text === draft.address) return;
    requestId.current += 1;
    setParcelState('idle');
    patch({ address: text, city: '', location: undefined, parcel: undefined });
  };

  const selectAddress = (result: AddressResult): void => {
    requestId.current += 1;
    const current = requestId.current;
    patch({
      address: result.label,
      city: result.city,
      location: [result.lng, result.lat],
      parcel: undefined,
    });
    setParcelState('loading');
    void fetchParcelAt(result.lng, result.lat).then((parcel) => {
      if (requestId.current !== current) return;
      patch({ parcel: parcel ?? undefined });
      setParcelState(parcel ? 'found' : 'none');
    });
  };

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
        <div>
          <p className="mb-2 text-sm font-semibold">Type d’annonce</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {(Object.keys(MODE_INFO) as ListingMode[]).map((mode) => {
              const info = MODE_INFO[mode];
              const active = draft.mode === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  aria-pressed={active}
                  onClick={() => changeMode(mode)}
                  className={`rounded-2xl border-2 p-4 text-left transition ${
                    active
                      ? 'border-brand bg-brand-soft'
                      : 'border-line bg-surface hover:border-brand'
                  }`}
                >
                  <span className="font-bold">
                    {info.emoji} {info.title}
                  </span>
                  <span className="text-mute mt-1 block text-sm leading-snug">
                    {info.description}
                  </span>
                </button>
              );
            })}
          </div>
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
        <div className="space-y-2">
          <p className="text-sm font-semibold">Adresse du jardin</p>
          <AddressPicker
            value={draft.address}
            onTextChange={changeAddressText}
            onSelect={selectAddress}
          />
          {errors.address && <p className="text-danger text-xs">{errors.address}</p>}
          {parcelState === 'loading' && (
            <p className="text-mute text-xs">Recherche de la parcelle cadastrale…</p>
          )}
          {parcelState === 'found' && draft.parcel && (
            <p className="text-brand-dark text-xs">
              ✅ Parcelle cadastrale trouvée : section {draft.parcel.ref} ·{' '}
              {draft.parcel.area} m² ({draft.parcel.commune})
            </p>
          )}
          {parcelState === 'none' && (
            <p className="text-mute text-xs">
              Aucune parcelle trouvée à cette adresse : le jardin sera placé sur
              l’adresse.
            </p>
          )}
          <p className="text-mute text-xs">
            L’adresse exacte reste privée : elle n’est visible qu’après une réservation
            payée.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
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

const NewLoader = () => <Form initial={emptyDraft()} />;

export const ListingForm = ({ editing = false }: ListingFormProps) => (
  <RequireAuth>{editing ? <EditLoader /> : <NewLoader />}</RequireAuth>
);
