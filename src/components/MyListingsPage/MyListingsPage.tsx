'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  BOOKING_STATUS_LABELS,
  INPUT_CLASS,
  LISTING_STATUS_LABELS,
  PAYOUT_PERIODS,
  ROUTES,
  editListingRoute,
  listingRoute,
} from '@/constants';
import { formatDate, formatEuro, formatPrice } from '@/helpers/format';
import { payoutAmount } from '@/helpers/pricing';
import { useApp } from '@/hooks/useApp';
import RequireAuth from '../RequireAuth';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import EmptyState from '../ui/EmptyState';
import type { OwnerBookingProps } from './types';

const OwnerBooking = ({ booking, listing, gardener }: OwnerBookingProps) => {
  const { validateBooking, requestPayout, cancelBooking } = useApp();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const isLocation = listing?.mode === 'location';

  return (
    <li className="border-line rounded-xl border p-4 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span>
          <b>{gardener?.name ?? 'Membre'}</b> ·{' '}
          {isLocation
            ? `saison ${booking.season}`
            : booking.date
              ? formatDate(booking.date)
              : ''}{' '}
          · {formatEuro(booking.price)}
        </span>
        <Badge
          tone={
            booking.status === 'validee'
              ? 'green'
              : booking.status === 'annulee'
                ? 'red'
                : 'orange'
          }
        >
          {BOOKING_STATUS_LABELS[booking.status]}
        </Badge>
      </div>

      {booking.status === 'payee' && (
        <form
          className="mt-3 flex flex-wrap items-center gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            const result = validateBooking(booking.id, code);
            setError(result.ok ? '' : result.error);
          }}
        >
          <input
            className={`${INPUT_CLASS} !w-44`}
            placeholder="Code du jardinier"
            inputMode="numeric"
            value={code}
            onChange={(event) => setCode(event.target.value)}
          />
          <Button type="submit" small>
            Valider la rencontre
          </Button>
          <Button variant="danger" small onClick={() => cancelBooking(booking.id)}>
            Annuler
          </Button>
          {error && <span className="text-danger">{error}</span>}
        </form>
      )}

      {booking.status === 'validee' && isLocation && (
        <div className="mt-3">
          <p className="text-mute mb-1 text-xs">
            Versements en 3 fois ({formatEuro(payoutAmount(booking.price))} chacun)
          </p>
          <div className="flex flex-wrap gap-2">
            {PAYOUT_PERIODS.map((period) => {
              const done = booking.payoutsRequested.includes(period.id);
              return (
                <Button
                  key={period.id}
                  variant={done ? 'ghost' : 'primary'}
                  small
                  disabled={done}
                  onClick={() => requestPayout(booking.id, period.id)}
                >
                  {done ? `✔ ${period.label}` : `Demander ${period.label}`}
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </li>
  );
};

const Content = () => {
  const { db, user, setListingStatus, deleteListing } = useApp();
  if (!user) return null;
  const mine = db.listings.filter((listing) => listing.ownerId === user.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Mes parcelles</h1>
        <Button href={ROUTES.newListing}>+ Nouvelle annonce</Button>
      </div>

      {mine.length === 0 ? (
        <EmptyState
          emoji="🌾"
          title="Vous n’avez pas encore d’annonce"
          text="Publiez votre jardin en quelques minutes."
          action={<Button href={ROUTES.newListing}>Proposer mon jardin</Button>}
        />
      ) : (
        <ul className="space-y-5">
          {mine.map((listing) => {
            const bookings = db.bookings.filter(
              (booking) => booking.listingId === listing.id,
            );
            return (
              <li
                key={listing.id}
                className="border-line bg-surface rounded-2xl border p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <Link
                      href={listingRoute(listing.id)}
                      className="text-lg font-bold hover:underline"
                    >
                      {listing.emoji} {listing.title}
                    </Link>
                    <p className="text-mute text-sm">
                      {listing.city} · {formatPrice(listing)}
                    </p>
                  </div>
                  <Badge
                    tone={
                      listing.status === 'publiee'
                        ? 'green'
                        : listing.status === 'reservee'
                          ? 'orange'
                          : 'red'
                    }
                  >
                    {LISTING_STATUS_LABELS[listing.status]}
                  </Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button href={editListingRoute(listing.id)} variant="ghost" small>
                    Modifier
                  </Button>
                  <Button
                    variant="ghost"
                    small
                    onClick={() =>
                      setListingStatus(
                        listing.id,
                        listing.status === 'retiree' ? 'publiee' : 'retiree',
                      )
                    }
                  >
                    {listing.status === 'retiree' ? 'Republier' : 'Retirer'}
                  </Button>
                  <Button
                    variant="danger"
                    small
                    onClick={() => {
                      if (window.confirm('Supprimer cette annonce ?'))
                        deleteListing(listing.id);
                    }}
                  >
                    Supprimer
                  </Button>
                </div>
                {bookings.length > 0 && (
                  <div className="mt-4">
                    <h3 className="mb-2 text-sm font-bold">Réservations reçues</h3>
                    <ul className="space-y-2">
                      {bookings.map((booking) => (
                        <OwnerBooking
                          key={booking.id}
                          booking={booking}
                          listing={listing}
                          gardener={db.users.find(
                            (candidate) => candidate.id === booking.gardenerId,
                          )}
                        />
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export const MyListingsPage = () => (
  <RequireAuth>
    <Content />
  </RequireAuth>
);
