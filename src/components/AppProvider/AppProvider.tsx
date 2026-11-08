'use client';

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { STORAGE_KEYS } from '@/constants';
import { AppContext } from '@/hooks/useApp';
import { parseDb, parseSession } from '@/helpers/db';
import { createCode, createId } from '@/helpers/ids';
import { computeQuote } from '@/helpers/pricing';
import { readRaw, subscribe, writeRaw } from '@/helpers/storage';
import type { ActionResult, AppContextValue, Db, ThemeName, ToastItem } from '@/types';
import {
  MIN_PASSWORD_LENGTH,
  STORAGE_FULL_MESSAGE,
  TOAST_DURATION_MS,
} from './constants';
import { hasActiveBooking, isValidEmail, normalizeEmail, withListing } from './helpers';
import type { AppProviderProps } from './types';

const useStored = (key: string): string | null | undefined =>
  useSyncExternalStore(
    subscribe,
    () => readRaw(key),
    () => undefined,
  );

const fail = (error: string): ActionResult => ({ ok: false, error });
const OK: ActionResult = { ok: true };

export const AppProvider = ({ children }: AppProviderProps) => {
  const rawDb = useStored(STORAGE_KEYS.db);
  const rawSession = useStored(STORAGE_KEYS.session);
  const rawTheme = useStored(STORAGE_KEYS.theme);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const ready = rawDb !== undefined;
  const db = useMemo(() => parseDb(rawDb), [rawDb]);
  const userId = parseSession(rawSession);
  const user = db.users.find((candidate) => candidate.id === userId) ?? null;
  const theme: ThemeName = rawTheme === 'dark' ? 'dark' : 'light';

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const notify = (message: string): void => {
    const id = createId('toast');
    setToasts((current) => [...current, { id, message }]);
    window.setTimeout(
      () => setToasts((current) => current.filter((toast) => toast.id !== id)),
      TOAST_DURATION_MS,
    );
  };

  const mutate = (change: (current: Db) => Db): boolean => {
    const current = parseDb(readRaw(STORAGE_KEYS.db));
    const saved = writeRaw(STORAGE_KEYS.db, JSON.stringify(change(current)));
    if (!saved) notify(STORAGE_FULL_MESSAGE);
    return saved;
  };

  const openSession = (id: string): void => {
    writeRaw(STORAGE_KEYS.session, JSON.stringify(id));
  };

  const value: AppContextValue = {
    ready,
    db,
    user,
    toasts,
    theme,
    notify,
    toggleTheme: () => writeRaw(STORAGE_KEYS.theme, theme === 'dark' ? 'light' : 'dark'),

    login: (email, password) => {
      if (password.length < MIN_PASSWORD_LENGTH)
        return fail('Saisissez un mot de passe.');
      const found = db.users.find(
        (candidate) => candidate.email === normalizeEmail(email),
      );
      if (!found) return fail('Aucun compte avec cet e-mail. Créez-en un.');
      openSession(found.id);
      return OK;
    },
    register: (name, email, city) => {
      const cleanEmail = normalizeEmail(email);
      if (!name.trim()) return fail('Indiquez votre nom.');
      if (!isValidEmail(cleanEmail)) return fail('E-mail invalide.');
      if (db.users.some((candidate) => candidate.email === cleanEmail)) {
        return fail('Cet e-mail a déjà un compte.');
      }
      const id = createId('u');
      const created = mutate((current) => ({
        ...current,
        users: [...current.users, { id, name: name.trim(), email: cleanEmail, city }],
      }));
      if (!created) return fail('Impossible d’enregistrer le compte.');
      openSession(id);
      return OK;
    },
    logout: () => writeRaw(STORAGE_KEYS.session, null),
    updateProfile: (name, city) => {
      if (!user) return;
      mutate((current) => ({
        ...current,
        users: current.users.map((candidate) =>
          candidate.id === user.id
            ? { ...candidate, name: name.trim() || candidate.name, city }
            : candidate,
        ),
      }));
      notify('Profil mis à jour.');
    },

    saveListing: (input, id) => {
      if (!user) return null;
      const targetId = id ?? createId('l');
      const saved = mutate((current) => {
        if (id) {
          return {
            ...current,
            listings: current.listings.map((listing) =>
              listing.id === id && listing.ownerId === user.id
                ? { ...listing, ...input }
                : listing,
            ),
          };
        }
        return {
          ...current,
          listings: [
            {
              ...input,
              id: targetId,
              ownerId: user.id,
              status: 'publiee',
              createdAt: new Date().toISOString(),
            },
            ...current.listings,
          ],
        };
      });
      if (!saved) return null;
      notify(id ? 'Annonce mise à jour.' : 'Annonce publiée.');
      return targetId;
    },
    setListingStatus: (id, status) => {
      mutate((current) => withListing(current, id, { status }));
    },
    deleteListing: (id) => {
      mutate((current) => ({
        ...current,
        listings: current.listings.filter((listing) => listing.id !== id),
        reviews: current.reviews.filter((review) => review.listingId !== id),
        messages: current.messages.filter((message) => message.listingId !== id),
        bookings: current.bookings.map((booking) =>
          booking.listingId === id && booking.status === 'payee'
            ? { ...booking, status: 'annulee', cancelledAt: new Date().toISOString() }
            : booking,
        ),
      }));
      notify('Annonce supprimée.');
    },

    toggleFavorite: (listingId) => {
      if (!user) {
        notify('Connectez-vous pour ajouter des favoris.');
        return;
      }
      mutate((current) => {
        const mine = current.favorites[user.id] ?? [];
        const next = mine.includes(listingId)
          ? mine.filter((id) => id !== listingId)
          : [...mine, listingId];
        return { ...current, favorites: { ...current.favorites, [user.id]: next } };
      });
    },

    createBooking: (input) => {
      if (!user) return fail('Connectez-vous pour réserver.');
      const listing = db.listings.find((candidate) => candidate.id === input.listingId);
      if (!listing || listing.status !== 'publiee') return fail('Annonce indisponible.');
      if (listing.ownerId === user.id)
        return fail('Vous ne pouvez pas réserver votre annonce.');
      if (input.quantity < 1) return fail('Quantité invalide.');
      if (listing.mode === 'cueillette' && !input.date)
        return fail('Choisissez une date.');
      if (hasActiveBooking(db.bookings, listing.id, input.season)) {
        return fail('Cette parcelle est déjà réservée pour cette saison.');
      }
      const quote = computeQuote(listing, input.quantity);
      const saved = mutate((current) => {
        const next: Db = {
          ...current,
          bookings: [
            {
              id: createId('b'),
              listingId: listing.id,
              gardenerId: user.id,
              ownerId: listing.ownerId,
              season: input.season,
              date: input.date,
              quantity: input.quantity,
              ...quote,
              status: 'payee',
              code: createCode(),
              payoutsRequested: [],
              createdAt: new Date().toISOString(),
            },
            ...current.bookings,
          ],
        };
        return listing.mode === 'location'
          ? withListing(next, listing.id, { status: 'reservee' })
          : next;
      });
      if (!saved) return fail('Réservation impossible.');
      notify('Paiement simulé accepté, réservation confirmée.');
      return OK;
    },
    cancelBooking: (id) => {
      mutate((current) => {
        const target = current.bookings.find((booking) => booking.id === id);
        if (!target || target.status === 'annulee') return current;
        const next: Db = {
          ...current,
          bookings: current.bookings.map((booking) =>
            booking.id === id
              ? { ...booking, status: 'annulee', cancelledAt: new Date().toISOString() }
              : booking,
          ),
        };
        const listing = current.listings.find(
          (candidate) => candidate.id === target.listingId,
        );
        return listing?.mode === 'location' && listing.status === 'reservee'
          ? withListing(next, listing.id, { status: 'publiee' })
          : next;
      });
      notify('Réservation annulée.');
    },
    validateBooking: (id, code) => {
      const target = db.bookings.find((booking) => booking.id === id);
      if (!target || target.ownerId !== user?.id) return fail('Réservation introuvable.');
      if (target.status !== 'payee') return fail('Réservation déjà traitée.');
      if (target.code !== code.trim()) return fail('Code incorrect.');
      mutate((current) => ({
        ...current,
        bookings: current.bookings.map((booking) =>
          booking.id === id
            ? { ...booking, status: 'validee', validatedAt: new Date().toISOString() }
            : booking,
        ),
      }));
      notify('Réservation validée.');
      return OK;
    },
    requestPayout: (id, period) => {
      mutate((current) => ({
        ...current,
        bookings: current.bookings.map((booking) =>
          booking.id === id && !booking.payoutsRequested.includes(period)
            ? { ...booking, payoutsRequested: [...booking.payoutsRequested, period] }
            : booking,
        ),
      }));
      notify('Versement demandé (simulé).');
    },

    sendMessage: (listingId, toId, text) => {
      if (!user || !text.trim()) return;
      mutate((current) => ({
        ...current,
        messages: [
          ...current.messages,
          {
            id: createId('m'),
            listingId,
            fromId: user.id,
            toId,
            text: text.trim(),
            createdAt: new Date().toISOString(),
          },
        ],
      }));
    },
    addReview: (listingId, rating, text) => {
      if (!user) return;
      mutate((current) => ({
        ...current,
        reviews: [
          ...current.reviews.filter(
            (review) => !(review.listingId === listingId && review.userId === user.id),
          ),
          {
            id: createId('r'),
            listingId,
            userId: user.id,
            rating,
            text: text.trim(),
            createdAt: new Date().toISOString(),
          },
        ],
      }));
      notify('Merci pour votre avis !');
    },

    savePlant: (input, id) => {
      if (!user) return null;
      const targetId = id ?? createId('p');
      const saved = mutate((current) => {
        if (id) {
          return {
            ...current,
            plants: current.plants.map((plant) =>
              plant.id === id && plant.ownerId === user.id
                ? { ...plant, ...input }
                : plant,
            ),
          };
        }
        return {
          ...current,
          plants: [
            {
              ...input,
              id: targetId,
              ownerId: user.id,
              status: 'disponible',
              createdAt: new Date().toISOString(),
            },
            ...current.plants,
          ],
        };
      });
      if (!saved) return null;
      notify(id ? 'Don mis à jour.' : 'Don publié.');
      return targetId;
    },
    setPlantStatus: (id, status) => {
      mutate((current) => ({
        ...current,
        plants: current.plants.map((plant) =>
          plant.id === id ? { ...plant, status } : plant,
        ),
      }));
    },
    deletePlant: (id) => {
      mutate((current) => ({
        ...current,
        plants: current.plants.filter((plant) => plant.id !== id),
      }));
      notify('Don supprimé.');
    },

    resetData: () => {
      writeRaw(STORAGE_KEYS.db, null);
      writeRaw(STORAGE_KEYS.session, null);
      notify('Données de démonstration réinitialisées.');
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
