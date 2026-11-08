import { ADDRESS_MAX_RESULTS, GEOCODER_URL } from '@/constants';

export type AddressResult = {
  label: string;
  city: string;
  postcode: string;
  lng: number;
  lat: number;
};

type GeocoderResponse = {
  features?: {
    geometry: { coordinates: [number, number] };
    properties: { label: string; city?: string; postcode?: string };
  }[];
};

// Free French address search (Géoplateforme geocoder, no API key).
export const searchAddresses = async (
  query: string,
  signal?: AbortSignal,
): Promise<AddressResult[]> => {
  const url = `${GEOCODER_URL}?q=${encodeURIComponent(query)}&limit=${ADDRESS_MAX_RESULTS}&autocomplete=1`;
  const response = await fetch(url, { signal });
  if (!response.ok) return [];
  const data = (await response.json()) as GeocoderResponse;
  return (data.features ?? []).map((feature) => ({
    label: feature.properties.label,
    city: feature.properties.city ?? '',
    postcode: feature.properties.postcode ?? '',
    lng: feature.geometry.coordinates[0],
    lat: feature.geometry.coordinates[1],
  }));
};
