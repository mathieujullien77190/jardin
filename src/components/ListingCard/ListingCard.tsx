import Link from 'next/link';
import { MODE_INFO, listingRoute } from '@/constants';
import { formatPrice } from '@/helpers/format';
import Badge from '../ui/Badge';
import HeartIcon from '../ui/HeartIcon';
import type { ListingCardProps } from './types';

export const ListingCard = ({
  listing,
  rating,
  favorite,
  distance,
  onToggleFavorite,
  onShowOnMap,
}: ListingCardProps) => (
  <article className="border-line bg-surface overflow-hidden rounded-2xl border transition hover:shadow-md">
    <div
      className="relative flex h-44 items-center justify-center text-6xl"
      style={{ background: listing.tone }}
    >
      {listing.photos[0] ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={listing.photos[0]}
          alt={listing.title}
          className="h-full w-full object-cover"
        />
      ) : (
        listing.emoji
      )}
      <span className="absolute top-3 left-3">
        <Badge tone={listing.mode === 'cueillette' ? 'orange' : 'green'}>
          {MODE_INFO[listing.mode].emoji} {MODE_INFO[listing.mode].title}
        </Badge>
      </span>
      <button
        type="button"
        aria-label={favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        onClick={() => onToggleFavorite(listing.id)}
        className="bg-surface/90 absolute top-2 right-2 grid h-9 w-9 place-items-center rounded-full text-lg"
      >
        <HeartIcon filled={favorite} className="h-5 w-5" />
      </button>
      {onShowOnMap && (
        <button
          type="button"
          onClick={() => onShowOnMap(listing.id)}
          className="bg-surface/90 absolute right-2 bottom-2 rounded-full px-3 py-1 text-xs font-semibold"
        >
          📍 Voir la parcelle
        </button>
      )}
    </div>
    <Link href={listingRoute(listing.id)} className="block p-4">
      <h3 className="font-bold">{listing.title}</h3>
      <p className="text-mute mt-0.5 text-sm">
        {listing.city} · {listing.area} m² · {listing.produce.slice(0, 2).join(', ')}
        {distance != null && ` · ${Math.round(distance)} km`}
      </p>
      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="text-mute">
          {rating.count > 0
            ? `★ ${rating.avg.toFixed(1)} (${rating.count})`
            : 'Pas encore d’avis'}
        </span>
        <b className="text-base">{formatPrice(listing)}</b>
      </div>
    </Link>
  </article>
);
