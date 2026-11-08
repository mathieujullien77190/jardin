import type { ListingMode } from '@/types';

export type MapParcel = {
  id: string;
  title: string;
  mode: ListingMode;
  center: [number, number];
  ring: [number, number][];
};

export type MapFocus = { id: string; seq: number };

export type MapViewProps = {
  counts: Record<string, number>;
  selectedCity: string;
  parcels: MapParcel[];
  focus: MapFocus | null;
  onSelectCity: (city: string) => void;
  onOpenParcel: (listingId: string) => void;
};
