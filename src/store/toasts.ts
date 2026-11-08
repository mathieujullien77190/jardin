import { create } from 'zustand';
import { TOAST_DURATION_MS } from '@/constants';
import { createId } from '@/helpers/ids';
import type { ToastItem } from '@/types';

type ToastState = {
  toasts: ToastItem[];
  push: (message: string) => void;
};

// Kept apart from the app store: toasts are transient and never persisted.
export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (message) => {
    const id = createId('toast');
    set((state) => ({ toasts: [...state.toasts, { id, message }] }));
    window.setTimeout(
      () => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
      TOAST_DURATION_MS,
    );
  },
}));

export const notify = (message: string): void => useToastStore.getState().push(message);
