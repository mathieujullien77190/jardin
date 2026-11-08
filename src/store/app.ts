import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PersistStorage } from 'zustand/middleware';
import { DEMO_USER_ID, SEED_DB, STORAGE_FULL_MESSAGE, STORAGE_KEYS } from '@/constants';
import { fillUserActivity } from '@/helpers/activity';
import { parseDb, parseSession } from '@/helpers/db';
import { createCode, createId } from '@/helpers/ids';
import { computeQuote } from '@/helpers/pricing';
import { readRaw, writeRaw } from '@/helpers/storage';
import {
  hasActiveBooking,
  isValidEmail,
  nameFromEmail,
  normalizeEmail,
  withListing,
} from '@/helpers/store';
import type { ActionResult, AppContextValue, Db, User } from '@/types';
import { notify } from './toasts';

// session: null = no visit yet (auto sign-in), '' = signed out, otherwise a user id.
type PersistedState = { db: Db; session: string | null };

type AppActions = Omit<AppContextValue, 'ready' | 'db' | 'user' | 'toasts' | 'notify'>;

export type AppState = PersistedState &
  AppActions & {
    hydrated: boolean;
    bootstrap: () => void;
  };

const fail = (error: string): ActionResult => ({ ok: false, error });
const OK: ActionResult = { ok: true };

// Same localStorage keys and formats as before the Zustand migration.
const storage: PersistStorage<PersistedState> = {
  getItem: () => {
    const rawSession = readRaw(STORAGE_KEYS.session);
    return {
      state: {
        db: parseDb(readRaw(STORAGE_KEYS.db)),
        session: rawSession === null ? null : (parseSession(rawSession) ?? ''),
      },
      version: 0,
    };
  },
  setItem: (_name, value) => {
    const saved = writeRaw(STORAGE_KEYS.db, JSON.stringify(value.state.db));
    writeRaw(
      STORAGE_KEYS.session,
      value.state.session === null ? null : JSON.stringify(value.state.session),
    );
    if (!saved) notify(STORAGE_FULL_MESSAGE);
  },
  removeItem: () => {
    writeRaw(STORAGE_KEYS.db, null);
    writeRaw(STORAGE_KEYS.session, null);
  },
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => {
      const update = (change: (db: Db) => Db): void => {
        set((state) => ({ db: change(state.db) }));
      };
      const currentUser = (): User | null => {
        const { db, session } = get();
        return db.users.find((candidate) => candidate.id === session) ?? null;
      };
      // Every account is filled once with fake gardens, favorites, bookings and messages.
      const openSession = (db: Db, id: string): PersistedState => ({
        db: fillUserActivity(db, id),
        session: id,
      });

      const signUp = (name: string, email: string, city: string): ActionResult => {
        const id = createId('u');
        set((state) =>
          openSession(
            { ...state.db, users: [...state.db.users, { id, name, email, city }] },
            id,
          ),
        );
        return OK;
      };

      return {
        db: SEED_DB,
        session: null,
        hydrated: false,

        // First visit: sign in with the fake demo account.
        bootstrap: () =>
          set((state) => {
            const session = state.session === null ? DEMO_USER_ID : state.session;
            const known = state.db.users.some((candidate) => candidate.id === session);
            return {
              hydrated: true,
              session,
              db: known ? fillUserActivity(state.db, session) : state.db,
            };
          }),

        // Fake login: any identifier / password works. Unknown ones get an account
        // created on the fly. The password is never checked.
        login: (email) => {
          const cleanEmail = normalizeEmail(email);
          if (!cleanEmail) return fail('Saisissez un e-mail ou un identifiant.');
          const found = get().db.users.find(
            (candidate) => candidate.email === cleanEmail,
          );
          if (found) {
            set((state) => openSession(state.db, found.id));
            return OK;
          }
          return signUp(nameFromEmail(cleanEmail), cleanEmail, '');
        },
        // Registration signs the new user in right away.
        register: (name, email, city) => {
          const cleanEmail = normalizeEmail(email);
          if (!name.trim()) return fail('Indiquez votre nom.');
          if (!isValidEmail(cleanEmail)) return fail('E-mail invalide.');
          if (get().db.users.some((candidate) => candidate.email === cleanEmail)) {
            return fail('Cet e-mail a déjà un compte.');
          }
          return signUp(name.trim(), cleanEmail, city);
        },
        // An empty id (not null) keeps the visitor signed out on reload.
        logout: () => set({ session: '' }),
        updateProfile: (name, city) => {
          const user = currentUser();
          if (!user) return;
          update((db) => ({
            ...db,
            users: db.users.map((candidate) =>
              candidate.id === user.id
                ? { ...candidate, name: name.trim() || candidate.name, city }
                : candidate,
            ),
          }));
          notify('Profil mis à jour.');
        },

        saveListing: (input, id) => {
          const user = currentUser();
          if (!user) return null;
          const targetId = id ?? createId('l');
          update((db) => {
            if (id) {
              return {
                ...db,
                listings: db.listings.map((listing) =>
                  listing.id === id && listing.ownerId === user.id
                    ? { ...listing, ...input }
                    : listing,
                ),
              };
            }
            return {
              ...db,
              listings: [
                {
                  ...input,
                  id: targetId,
                  ownerId: user.id,
                  status: 'publiee',
                  createdAt: new Date().toISOString(),
                },
                ...db.listings,
              ],
            };
          });
          notify(id ? 'Annonce mise à jour.' : 'Annonce publiée.');
          return targetId;
        },
        setListingStatus: (id, status) => update((db) => withListing(db, id, { status })),
        deleteListing: (id) => {
          update((db) => ({
            ...db,
            listings: db.listings.filter((listing) => listing.id !== id),
            reviews: db.reviews.filter((review) => review.listingId !== id),
            messages: db.messages.filter((message) => message.listingId !== id),
            bookings: db.bookings.map((booking) =>
              booking.listingId === id && booking.status === 'payee'
                ? { ...booking, status: 'annulee', cancelledAt: new Date().toISOString() }
                : booking,
            ),
          }));
          notify('Annonce supprimée.');
        },

        toggleFavorite: (listingId) => {
          const user = currentUser();
          if (!user) {
            notify('Connectez-vous pour ajouter des favoris.');
            return;
          }
          update((db) => {
            const mine = db.favorites[user.id] ?? [];
            const next = mine.includes(listingId)
              ? mine.filter((id) => id !== listingId)
              : [...mine, listingId];
            return { ...db, favorites: { ...db.favorites, [user.id]: next } };
          });
        },

        createBooking: (input) => {
          const user = currentUser();
          if (!user) return fail('Connectez-vous pour réserver.');
          const { db } = get();
          const listing = db.listings.find(
            (candidate) => candidate.id === input.listingId,
          );
          if (!listing || listing.status !== 'publiee')
            return fail('Annonce indisponible.');
          if (listing.ownerId === user.id)
            return fail('Vous ne pouvez pas réserver votre annonce.');
          if (input.quantity < 1) return fail('Quantité invalide.');
          if (listing.mode === 'cueillette' && !input.date)
            return fail('Choisissez une date.');
          if (hasActiveBooking(db.bookings, listing.id, input.season)) {
            return fail('Cette parcelle est déjà réservée pour cette saison.');
          }
          const quote = computeQuote(listing, input.quantity);
          update((current) => {
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
          notify('Paiement simulé accepté, réservation confirmée.');
          return OK;
        },
        cancelBooking: (id) => {
          update((db) => {
            const target = db.bookings.find((booking) => booking.id === id);
            if (!target || target.status === 'annulee') return db;
            const next: Db = {
              ...db,
              bookings: db.bookings.map((booking) =>
                booking.id === id
                  ? {
                      ...booking,
                      status: 'annulee',
                      cancelledAt: new Date().toISOString(),
                    }
                  : booking,
              ),
            };
            const listing = db.listings.find(
              (candidate) => candidate.id === target.listingId,
            );
            return listing?.mode === 'location' && listing.status === 'reservee'
              ? withListing(next, listing.id, { status: 'publiee' })
              : next;
          });
          notify('Réservation annulée.');
        },
        validateBooking: (id, code) => {
          const user = currentUser();
          const target = get().db.bookings.find((booking) => booking.id === id);
          if (!target || target.ownerId !== user?.id)
            return fail('Réservation introuvable.');
          if (target.status !== 'payee') return fail('Réservation déjà traitée.');
          if (target.code !== code.trim()) return fail('Code incorrect.');
          update((db) => ({
            ...db,
            bookings: db.bookings.map((booking) =>
              booking.id === id
                ? { ...booking, status: 'validee', validatedAt: new Date().toISOString() }
                : booking,
            ),
          }));
          notify('Réservation validée.');
          return OK;
        },
        requestPayout: (id, period) => {
          update((db) => ({
            ...db,
            bookings: db.bookings.map((booking) =>
              booking.id === id && !booking.payoutsRequested.includes(period)
                ? { ...booking, payoutsRequested: [...booking.payoutsRequested, period] }
                : booking,
            ),
          }));
          notify('Versement demandé (simulé).');
        },

        sendMessage: (listingId, toId, text) => {
          const user = currentUser();
          if (!user || !text.trim()) return;
          update((db) => ({
            ...db,
            messages: [
              ...db.messages,
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
          const user = currentUser();
          if (!user) return;
          update((db) => ({
            ...db,
            reviews: [
              ...db.reviews.filter(
                (review) =>
                  !(review.listingId === listingId && review.userId === user.id),
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
          const user = currentUser();
          if (!user) return null;
          const targetId = id ?? createId('p');
          update((db) => {
            if (id) {
              return {
                ...db,
                plants: db.plants.map((plant) =>
                  plant.id === id && plant.ownerId === user.id
                    ? { ...plant, ...input }
                    : plant,
                ),
              };
            }
            return {
              ...db,
              plants: [
                {
                  ...input,
                  id: targetId,
                  ownerId: user.id,
                  status: 'disponible',
                  createdAt: new Date().toISOString(),
                },
                ...db.plants,
              ],
            };
          });
          notify(id ? 'Don mis à jour.' : 'Don publié.');
          return targetId;
        },
        setPlantStatus: (id, status) =>
          update((db) => ({
            ...db,
            plants: db.plants.map((plant) =>
              plant.id === id ? { ...plant, status } : plant,
            ),
          })),
        deletePlant: (id) => {
          update((db) => ({
            ...db,
            plants: db.plants.filter((plant) => plant.id !== id),
          }));
          notify('Don supprimé.');
        },

        resetData: () => {
          set({ db: SEED_DB, session: null });
          get().bootstrap();
          notify('Données de démonstration réinitialisées.');
        },
      };
    },
    {
      name: 'auj',
      storage,
      // Rehydrated on the client by <AppProvider/> (static export: no server state).
      skipHydration: true,
      partialize: (state): PersistedState => ({ db: state.db, session: state.session }),
    },
  ),
);
