import type { ListingInput } from '@/types';

export type ListingFormProps = {
  editing?: boolean;
};

export type ListingDraft = ListingInput;

export type DraftErrors = Partial<Record<keyof ListingDraft, string>>;
