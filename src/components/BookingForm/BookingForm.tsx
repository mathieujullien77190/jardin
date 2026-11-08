'use client';

import { useState } from 'react';
import { INPUT_CLASS, MAX_PEOPLE_BOOKING, ROUTES } from '@/constants';
import { formatEuro, todayIso } from '@/helpers/format';
import { computeQuote, quantityLabel } from '@/helpers/pricing';
import Button from '../ui/Button';
import Field from '../ui/Field';
import { seasonOptions } from './helpers';
import type { BookingFormProps } from './types';

export const BookingForm = ({ listing, user, onSubmit }: BookingFormProps) => {
  const seasons = seasonOptions();
  const [season, setSeason] = useState(seasons[0]);
  const [date, setDate] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const isLocation = listing.mode === 'location';
  const quote = computeQuote(listing, isLocation ? 1 : quantity);

  if (listing.status !== 'publiee') {
    return <p className="text-mute text-sm">Cette annonce n’est plus disponible.</p>;
  }

  if (!user) {
    return (
      <Button href={ROUTES.login} className="w-full">
        Se connecter pour réserver
      </Button>
    );
  }

  const submit = (): void => {
    const result = onSubmit({
      listingId: listing.id,
      season: isLocation ? season : new Date(date || todayIso()).getFullYear(),
      date: isLocation ? null : date || null,
      quantity: isLocation ? 1 : quantity,
    });
    setError(result.ok ? '' : result.error);
  };

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      {isLocation ? (
        <Field label="Année culturale">
          <select
            className={INPUT_CLASS}
            value={season}
            onChange={(e) => setSeason(Number(e.target.value))}
          >
            {seasons.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </Field>
      ) : (
        <>
          <Field label="Date de cueillette">
            <input
              type="date"
              min={todayIso()}
              className={INPUT_CLASS}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Field>
          <Field label={quantityLabel(listing)}>
            <input
              type="number"
              min={1}
              max={MAX_PEOPLE_BOOKING * 10}
              className={INPUT_CLASS}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            />
          </Field>
        </>
      )}

      <dl className="bg-brand-soft space-y-1 rounded-xl p-3 text-sm">
        <div className="flex justify-between">
          <dt>{isLocation ? 'Participation annuelle' : 'Cueillette'}</dt>
          <dd>{formatEuro(quote.price)}</dd>
        </div>
        <div className="text-mute flex justify-between">
          <dt>Frais de service</dt>
          <dd>{formatEuro(quote.fee)}</dd>
        </div>
        <div className="border-line flex justify-between border-t pt-1 font-bold">
          <dt>Total</dt>
          <dd>{formatEuro(quote.total)}</dd>
        </div>
      </dl>

      {error && <p className="text-danger text-sm">{error}</p>}
      <Button type="submit" className="w-full">
        Réserver et payer (simulé)
      </Button>
    </form>
  );
};
