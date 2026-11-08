import type { ReactNode } from 'react';

export type FieldProps = {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
};
