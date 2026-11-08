'use client';

import { useApp } from '@/hooks/useApp';

export const Toasts = () => {
  const { toasts } = useApp();
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed right-4 bottom-4 z-50 flex flex-col gap-2"
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
