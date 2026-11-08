import type { ReactNode } from 'react';

export type BadgeTone = 'neutral' | 'green' | 'orange' | 'red';

export type BadgeProps = {
  tone?: BadgeTone;
  children: ReactNode;
};
