import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { HeartIcon } from '../../src';
import { prose } from '../prose';
import { source } from '../source';
import fr from './HeartIcon.fr.md?raw';
import statesCode from './States.source.md?raw';

const FavoriteButton = () => {
  const [favorite, setFavorite] = useState(false);
  return (
    <button
      type="button"
      aria-label={favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      onClick={() => setFavorite((value) => !value)}
    >
      <HeartIcon filled={favorite} className="h-8 w-8" />
    </button>
  );
};

const meta: Meta<typeof HeartIcon> = {
  title: 'Primitives/HeartIcon',
  component: HeartIcon,
  parameters: prose(fr),
};

export default meta;

export const States: StoryObj<typeof HeartIcon> = {
  parameters: source(statesCode),
  render: () => <FavoriteButton />,
};
