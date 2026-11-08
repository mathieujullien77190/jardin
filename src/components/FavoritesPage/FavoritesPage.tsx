'use client';

import { ROUTES } from '@/constants';
import { ratingOf } from '@/helpers/listings';
import { useApp } from '@/hooks/useApp';
import ListingCard from '../ListingCard';
import RequireAuth from '../RequireAuth';
import Button from '../ui/Button';
import HeartIcon from '../ui/HeartIcon';
import EmptyState from '../ui/EmptyState';

const Content = () => {
  const { db, user, toggleFavorite } = useApp();
  if (!user) return null;
  const ids = db.favorites[user.id] ?? [];
  const favorites = db.listings.filter((listing) => ids.includes(listing.id));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Mes favoris</h1>
      {favorites.length === 0 ? (
        <EmptyState
          emoji={<HeartIcon className="h-12 w-12" />}
          title="Aucun favori"
          text="Touchez le cœur d’une annonce pour la retrouver ici."
          action={<Button href={ROUTES.home}>Explorer</Button>}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              rating={ratingOf(db.reviews, listing.id)}
              favorite
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const FavoritesPage = () => (
  <RequireAuth>
    <Content />
  </RequireAuth>
);
