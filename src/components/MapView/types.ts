import type { ListingMode } from '@/types';

export type MapGarden = {
  id: string;
  title: string;
  mode: ListingMode;
  center: [number, number];
  ring?: [number, number][];
};

export type MapFocus = { id: string; seq: number };

export type MapViewProps = {
  gardens: MapGarden[];
  selectedCity: string;
  focus: MapFocus | null;
  onOpenGarden: (listingId: string) => void;
};
