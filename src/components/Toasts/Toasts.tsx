'use client';

import { useToastStore } from '@/store/toasts';

export const Toasts = () => {
  const toasts = useToastStore((state) => state.toasts);
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed right-4 bottom-20 z-50 flex flex-col gap-2 md:bottom-4"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-ink text-cream rounded-xl px-4 py-3 text-sm shadow-lg"
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};
