import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Stars } from '../../src';
import { prose } from '../prose';
import { source } from '../source';
import fr from './Stars.fr.md?raw';
import ratingCode from './Rating.source.md?raw';

const ReviewForm = () => {
  const [rating, setRating] = useState(4);
  return (
    <div className="space-y-2">
      <Stars value={rating} onChange={setRating} />
      <p>Aperçu en lecture seule :</p>
      <Stars value={rating} />
    </div>
  );
};

const meta: Meta<typeof Stars> = {
  title: 'Primitives/Stars',
  component: Stars,
  parameters: prose(fr),
};

export default meta;

export const Rating: StoryObj<typeof Stars> = {
  parameters: source(ratingCode),
  render: () => <ReviewForm />,
};
