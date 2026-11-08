'use client';

import { useState } from 'react';
import {
  LISTING_STATUS_LABELS,
  MODE_LABELS,
  ROUTES,
  WATER_LABELS,
  editListingRoute,
} from '@/constants';
import { formatEuro, formatPrice, summarizeAccess } from '@/helpers/format';
import { useApp } from '@/hooks/useApp';
import { useQueryId } from '@/hooks/useQueryId';
import BookingForm from '../BookingForm';
import ContactBox from '../ContactBox';
import ParcelMap from '../ParcelMap';
import ReviewSection from '../ReviewSection';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import EmptyState from '../ui/EmptyState';
import { canSeePrivateInfo } from './helpers';

export const ListingDetail = () => {
  const app = useApp();
  const { db, user, ready } = app;
  const id = useQueryId();
  const [photoIndex, setPhotoIndex] = useState(0);
  const listing = db.listings.find((candidate) => candidate.id === id);

  if (!ready) return <p className="text-mute py-20 text-center">Chargement…</p>;
  if (!listing) {
    return (
      <EmptyState
        emoji="🥀"
        title="Jardin introuvable"
        action={<Button href={ROUTES.home}>Retour aux annonces</Button>}
      />
    );
  }

  const owner = db.users.find((candidate) => candidate.id === listing.ownerId);
  const isOwner = user?.id === listing.ownerId;
  const favorite = user ? (db.favorites[user.id] ?? []).includes(listing.id) : false;
  const privateVisible = canSeePrivateInfo(listing, user, db.bookings);
  const reviews = db.reviews
    .filter((review) => review.listingId === listing.id)
    .map((review) => ({
      review,
      authorName:
        db.users.find((candidate) => candidate.id === review.userId)?.name ?? 'Membre',
    }));
  const hasReviewed = reviews.some((item) => item.review.userId === user?.id);

  const specs: [string, string][] = [
    ['Surface', `${listing.area} m²`],
    [
      'Eau',
      WATER_LABELS[listing.water] + (listing.waterMeter ? ' · compteur individuel' : ''),
    ],
    [
      'Outils',
      listing.toolsProvided
        ? listing.toolsPrice > 0
          ? `Fournis (${formatEuro(listing.toolsPrice)} / an)`
          : 'Fournis'
        : 'Non fournis',
    ],
    ['Toilettes', listing.toilets ? 'Oui' : 'Non'],
    ['Présence simultanée', `${listing.maxPeople} personnes max`],
    ['Équipements', listing.equipment || '—'],
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-8">
        <div>
          <div
            className="flex h-72 items-center justify-center overflow-hidden rounded-3xl text-8xl"
            style={{ background: listing.tone }}
          >
            {listing.photos[photoIndex] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={listing.photos[photoIndex]}
                alt={listing.title}
                className="h-full w-full object-cover"
              />
            ) : (
              listing.emoji
            )}
          </div>
          {listing.photos.length > 1 && (
            <div className="mt-2 flex gap-2">
              {listing.photos.map((photo, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setPhotoIndex(index)}
                  className={`h-16 w-16 overflow-hidden rounded-lg border-2 ${index === photoIndex ? 'border-brand' : 'border-transparent'}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={listing.mode === 'cueillette' ? 'orange' : 'green'}>
              {MODE_LABELS[listing.mode]}
            </Badge>
            {listing.status !== 'publiee' && (
              <Badge tone="red">{LISTING_STATUS_LABELS[listing.status]}</Badge>
            )}
          </div>
          <h1 className="mt-2 text-3xl font-extrabold">{listing.title}</h1>
          <p className="text-mute">
            {listing.city} · par {owner?.name ?? 'un membre'}
          </p>
          <p className="mt-4">{listing.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {listing.produce.map((item) => (
              <Badge key={item} tone="green">
                {item}
              </Badge>
            ))}
          </div>
        </div>

        <section>
          <h2 className="mb-3 text-xl font-bold">Le jardin</h2>
          <dl className="grid gap-3 sm:grid-cols-2">
            {specs.map(([label, value]) => (
              <div key={label} className="border-line bg-surface rounded-xl border p-3">
                <dt className="text-mute text-xs font-semibold uppercase">{label}</dt>
                <dd className="text-sm">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="border-line bg-surface mt-3 rounded-xl border p-3">
            <p className="text-mute text-xs font-semibold uppercase">Plages d’accès</p>
            <p className="text-sm">{summarizeAccess(listing.accessSlots)}</p>
          </div>
        </section>

        {listing.parcel && (
          <section className="space-y-2">
            <h2 className="text-xl font-bold">Parcelle cadastrale</h2>
            <ParcelMap parcel={listing.parcel} />
            <p className="text-mute text-sm">
              {listing.parcel.commune} · section {listing.parcel.ref} ·{' '}
              {listing.parcel.area} m² (cadastre, parcelle tirée au hasard pour la démo)
            </p>
          </section>
        )}

        <section className="border-line bg-surface rounded-2xl border border-dashed p-4">
          <h2 className="font-bold">Adresse et contact</h2>
          {privateVisible ? (
            <p className="mt-1 text-sm">
              📍 {listing.address}
              <br />
              📞 {listing.phone || 'Non renseigné'}
            </p>
          ) : (
            <p className="text-mute mt-1 text-sm">
              🔒 L’adresse exacte et le téléphone sont visibles après réservation.
            </p>
          )}
        </section>

        <ReviewSection
          reviews={reviews}
          canReview={Boolean(user) && !isOwner}
          onSubmit={(rating, text) => app.addReview(listing.id, rating, text)}
        />
        {hasReviewed && (
          <p className="text-mute -mt-6 text-xs">
            Vous avez déjà noté ce jardin : un nouvel avis remplace le précédent.
          </p>
        )}
      </div>

      <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
        <div className="border-line bg-surface space-y-4 rounded-2xl border p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-2xl font-extrabold">{formatPrice(listing)}</p>
            <button
              type="button"
              aria-label="Favori"
              onClick={() => app.toggleFavorite(listing.id)}
              className="text-2xl"
            >
              {favorite ? '❤️' : '🤍'}
            </button>
          </div>
          {isOwner ? (
            <div className="space-y-2">
              <p className="text-mute text-sm">C’est votre annonce.</p>
              <Button href={editListingRoute(listing.id)} className="w-full">
                Modifier
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() =>
                  app.setListingStatus(
                    listing.id,
                    listing.status === 'retiree' ? 'publiee' : 'retiree',
                  )
                }
              >
                {listing.status === 'retiree' ? 'Republier' : 'Retirer de la liste'}
              </Button>
            </div>
          ) : (
            <BookingForm listing={listing} user={user} onSubmit={app.createBooking} />
          )}
        </div>

        {!isOwner && owner && (
          <div className="border-line bg-surface rounded-2xl border p-5">
            <ContactBox
              ownerName={owner.name}
              disabled={!user}
              onSend={(text) => {
                app.sendMessage(listing.id, owner.id, text);
                app.notify('Message envoyé.');
              }}
            />
          </div>
        )}
      </aside>
    </div>
  );
};
