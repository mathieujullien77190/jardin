import type { Plant } from '@/types';
import type { PlantDraft } from './types';

export const emptyPlantDraft = (city: string): PlantDraft => ({
  title: '',
  description: '',
  kind: 'plant',
  quantity: 1,
  city,
  phone: '',
  photos: [],
});

export const draftFromPlant = (plant: Plant): PlantDraft => ({
  title: plant.title,
  description: plant.description,
  kind: plant.kind,
  quantity: plant.quantity,
  city: plant.city,
  phone: plant.phone,
  photos: plant.photos,
});

export const isPlantDraftValid = (draft: PlantDraft): boolean =>
  Boolean(draft.title.trim() && draft.city && draft.quantity > 0);
