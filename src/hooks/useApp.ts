'use client';

import { createContext, useContext } from 'react';
import type { AppContextValue } from '@/types';

export const AppContext = createContext<AppContextValue | null>(null);

export const useApp = (): AppContextValue => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider');
  return context;
};
