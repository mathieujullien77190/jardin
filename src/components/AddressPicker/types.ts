import type { AddressResult } from '@/helpers/address';

export type AddressPickerProps = {
  value: string;
  placeholder?: string;
  onTextChange: (text: string) => void;
  onSelect: (result: AddressResult) => void;
};
