'use client';

import { useState } from 'react';
import { INPUT_CLASS } from '@/constants';
import { formatDate } from '@/helpers/format';
import Button from '../ui/Button';
import Stars from '../ui/Stars';
import type { ReviewSectionProps } from './types';

export const ReviewSection = ({ reviews, canReview, onSubmit }: ReviewSectionProps) => {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const average =
    reviews.length > 0
      ? reviews.reduce((sum, item) => sum + item.review.rating, 0) / reviews.length
      : 0;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">
        Avis {reviews.length > 0 && `· ★ ${average.toFixed(1)} (${reviews.length})`}
      </h2>
      {reviews.length === 0 && (
        <p className="text-mute text-sm">Aucun avis pour le moment.</p>
      )}
      <ul className="space-y-3">
        {reviews.map(({ review, authorName }) => (
          <li key={review.id} className="border-line bg-surface rounded-xl border p-4">
            <div className="flex items-center justify-between text-sm">
              <b>{authorName}</b>
              <span className="text-mute">{formatDate(review.createdAt)}</span>
            </div>
            <Stars value={review.rating} />
            {review.text && <p className="mt-1 text-sm">{review.text}</p>}
          </li>
        ))}
      </ul>

      {canReview && (
        <form
          className="border-line bg-surface space-y-2 rounded-xl border p-4"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit(rating, text);
            setText('');
          }}
        >
          <p className="text-sm font-semibold">Laisser un avis</p>
          <Stars value={rating} onChange={setRating} />
          <textarea
            rows={2}
            className={INPUT_CLASS}
            placeholder="Votre expérience…"
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
          <Button type="submit" small>
            Publier
          </Button>
        </form>
      )}
    </section>
  );
};
