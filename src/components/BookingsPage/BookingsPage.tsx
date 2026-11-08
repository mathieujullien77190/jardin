'use client';

import Link from 'next/link';
import { ROUTES, BOOKING_STATUS_LABELS, listingRoute } from '@/constants';
import { formatDate, formatEuro } from '@/helpers/format';
import { useApp } from '@/hooks/useApp';
import RequireAuth from '../RequireAuth';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import EmptyState from '../ui/EmptyState';
import { sortByDate } from './helpers';

const Content = () => {
  const { db, user, cancelBooking } = useApp();
  if (!user) return null;
  const mine = sortByDate(
    db.bookings.filter((booking) => booking.gardenerId === user.id),
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Mes réservations</h1>
      {mine.length === 0 ? (
        <EmptyState
          emoji="🧺"
          title="Aucune réservation"
          text="Réservez une cueillette ou une parcelle pour la retrouver ici."
          action={<Button href={ROUTES.home}>Explorer les jardins</Button>}
        />
      ) : (
        <ul className="space-y-4">
          {mine.map((booking) => {
            const listing = db.listings.find(
              (candidate) => candidate.id === booking.listingId,
            );
            const owner = db.users.find((candidate) => candidate.id === booking.ownerId);
            return (
              <li
                key={booking.id}
                className="border-line bg-surface rounded-2xl border p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <Link
                      href={listing ? listingRoute(listing.id) : ROUTES.home}
                      className="text-lg font-bold hover:underline"
                    >
                      {listing?.emoji} {listing?.title ?? 'Annonce supprimée'}
                    </Link>
                    <p className="text-mute text-sm">
                      {listing?.mode === 'location'
                        ? `Saison ${booking.season}`
                        : `Le ${booking.date ? formatDate(booking.date) : '—'} · ${booking.quantity} ${listing?.unit ?? ''}`}
                      {' · '}
                      {owner?.name}
                    </p>
                  </div>
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

                <p className="mt-2 text-sm">
                  Total payé : <b>{formatEuro(booking.total)}</b>{' '}
                  <span className="text-mute">
                    (dont {formatEuro(booking.fee)} de frais de service)
                  </span>
                </p>

                {booking.status === 'payee' && (
                  <div className="bg-brand-soft mt-3 rounded-xl p-3 text-sm">
                    Votre code de validation :{' '}
                    <b className="text-lg tracking-widest">{booking.code}</b>
                    <br />
                    <span className="text-mute">
                      À donner au propriétaire lors de votre première visite.
                    </span>
                  </div>
                )}
                {booking.status !== 'annulee' && listing && (
                  <p className="mt-3 text-sm">
                    📍 {listing.address} · 📞 {listing.phone || 'Non renseigné'}
                  </p>
                )}
                {booking.status !== 'annulee' && (
                  <div className="mt-3">
                    <Button
                      variant="danger"
                      small
                      onClick={() => cancelBooking(booking.id)}
                    >
                      Annuler
                    </Button>
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

export const BookingsPage = () => (
  <RequireAuth>
    <Content />
  </RequireAuth>
);
