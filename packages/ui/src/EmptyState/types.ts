import type { ReactNode } from 'react';

export type EmptyStateProps = {
  emoji: ReactNode;
  title: string;
  text?: string;
  action?: ReactNode;
};
