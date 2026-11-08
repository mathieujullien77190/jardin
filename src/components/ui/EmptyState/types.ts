import type { ReactNode } from 'react';

export type EmptyStateProps = {
  emoji: string;
  title: string;
  text?: string;
  action?: ReactNode;
};
