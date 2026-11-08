'use client';

import { useState } from 'react';
import { MAX_PHOTOS } from '@/constants';
import { fileToResizedDataUrl } from '@/helpers/photos';
import { useApp } from '@/hooks/useApp';
import type { PhotoPickerProps } from './types';

export const PhotoPicker = ({ photos, onChange }: PhotoPickerProps) => {
  const { notify } = useApp();
  const [busy, setBusy] = useState(false);

  const addFiles = async (files: FileList | null): Promise<void> => {
    if (!files) return;
    setBusy(true);
    try {
      const room = MAX_PHOTOS - photos.length;
      const converted = await Promise.all(
        Array.from(files)
          .slice(0, room)
          .map((file) => fileToResizedDataUrl(file)),
      );
      onChange([...photos, ...converted]);
    } catch {
      notify('Image illisible.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <p className="mb-1 text-sm font-semibold">
        Photos ({photos.length}/{MAX_PHOTOS})
      </p>
      <div className="flex flex-wrap gap-3">
        {photos.map((photo, index) => (
          <div
            key={index}
            className="border-line relative h-24 w-24 overflow-hidden rounded-xl border"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo}
              alt={`Photo ${index + 1}`}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              aria-label="Retirer la photo"
              onClick={() => onChange(photos.filter((_, position) => position !== index))}
              className="bg-ink/80 text-cream absolute top-1 right-1 grid h-6 w-6 place-items-center rounded-full text-xs"
            >
              ✕
            </button>
            {index === 0 && (
              <span className="bg-ink/70 text-cream absolute inset-x-0 bottom-0 text-center text-[10px]">
                Vignette
              </span>
            )}
          </div>
        ))}
        {photos.length < MAX_PHOTOS && (
          <label className="border-line text-mute hover:border-brand grid h-24 w-24 cursor-pointer place-items-center rounded-xl border border-dashed text-2xl">
            {busy ? '…' : '＋'}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(event) => {
                void addFiles(event.target.files);
                event.target.value = '';
              }}
            />
          </label>
        )}
      </div>
    </div>
  );
};
