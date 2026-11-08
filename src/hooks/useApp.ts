'use client';

import { useAppStore } from '@/store/app';
import { notify, useToastStore } from '@/store/toasts';
import type { AppContextValue } from '@/types';

// Same shape the pages already use, now backed by the Zustand stores.
export const useApp = (): AppContextValue => {
  const { db, session, hydrated, ...actions } = useAppStore();
  const toasts = useToastStore((state) => state.toasts);
  const user = db.users.find((candidate) => candidate.id === session) ?? null;
  return { ready: hydrated, db, user, toasts, notify, ...actions };
};
