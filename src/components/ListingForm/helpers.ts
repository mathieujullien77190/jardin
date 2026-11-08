import type { AccessSlot, Listing } from '@/types';
import { DEFAULT_EMOJI, DEFAULT_SLOT, PRODUCE_OPTIONS, TONES } from '@/constants';
import type { DraftErrors, ListingDraft } from './types';

export const emptyDraft = (city: string): ListingDraft => ({
  title: '',
  description: '',
  city,
  mode: 'cueillette',
  area: 100,
  price: 5,
  unit: 'panier',
  toolsProvided: false,
  toolsPrice: 0,
  water: 'robinet',
  waterMeter: false,
  accessSlots: [],
  maxPeople: 4,
  toilets: false,
  equipment: '',
  produce: [],
  photos: [],
  address: '',
  phone: '',
  emoji: DEFAULT_EMOJI,
  tone: TONES[1],
});

export const draftFromListing = (listing: Listing): ListingDraft => {
  const { id, ownerId, createdAt, ...rest } = listing;
  void id;
  void ownerId;
  void createdAt;
  return rest;
};

export const validateDraft = (draft: ListingDraft): DraftErrors => {
  const errors: DraftErrors = {};
  if (!draft.title.trim()) errors.title = 'Titre requis.';
  if (!draft.description.trim()) errors.description = 'Décrivez votre jardin.';
  if (!draft.city) errors.city = 'Choisissez une commune.';
  if (!(draft.area > 0)) errors.area = 'Surface invalide.';
  if (draft.price < 0) errors.price = 'Prix invalide.';
  if (draft.produce.length === 0) errors.produce = 'Choisissez au moins une culture.';
  if (!draft.address.trim()) errors.address = 'Adresse requise (visible après paiement).';
  return errors;
};

export const toggleValue = (values: string[], value: string): string[] =>
  values.includes(value) ? values.filter((item) => item !== value) : [...values, value];

export const toggleSlot = (slots: AccessSlot[], day: number): AccessSlot[] =>
  slots.some((slot) => slot.day === day)
    ? slots.filter((slot) => slot.day !== day)
    : [...slots, { day, ...DEFAULT_SLOT }].sort((a, b) => a.day - b.day);

export const updateSlot = (
  slots: AccessSlot[],
  day: number,
  patch: Partial<AccessSlot>,
): AccessSlot[] => slots.map((slot) => (slot.day === day ? { ...slot, ...patch } : slot));

export const appearanceFor = (produce: string[]): { emoji: string; tone: string } => {
  const first = PRODUCE_OPTIONS.find((option) => option.label === produce[0]);
  const index = Math.max(
    0,
    PRODUCE_OPTIONS.findIndex((option) => option.label === produce[0]),
  );
  return { emoji: first?.emoji ?? DEFAULT_EMOJI, tone: TONES[index % TONES.length] };
};
