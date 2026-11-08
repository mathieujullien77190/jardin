export type MapViewProps = {
  counts: Record<string, number>;
  selectedCity: string;
  onSelectCity: (city: string) => void;
};
