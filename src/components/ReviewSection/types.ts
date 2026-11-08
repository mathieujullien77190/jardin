import type { Review } from '@/types';

export type ReviewWithAuthor = { review: Review; authorName: string };

export type ReviewSectionProps = {
  reviews: ReviewWithAuthor[];
  canReview: boolean;
  onSubmit: (rating: number, text: string) => void;
};
