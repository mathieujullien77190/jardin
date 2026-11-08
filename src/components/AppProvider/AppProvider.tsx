'use client';

import { useEffect } from 'react';
import { STORAGE_KEYS } from '@/constants';
import { useAppStore } from '@/store/app';
import type { AppProviderProps } from './types';

const hydrate = (): void => {
  void Promise.resolve(useAppStore.persist.rehydrate()).then(() =>
    useAppStore.getState().bootstrap(),
  );
};

// Loads the persisted Zustand store on the client and keeps tabs in sync.
export const AppProvider = ({ children }: AppProviderProps) => {
  useEffect(() => {
    hydrate();
    const onStorage = (event: StorageEvent): void => {
      if (event.key === STORAGE_KEYS.db || event.key === STORAGE_KEYS.session) hydrate();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return <>{children}</>;
};
