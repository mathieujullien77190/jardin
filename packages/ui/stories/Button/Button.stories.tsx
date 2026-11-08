import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../src';
import { prose } from '../prose';
import { source } from '../source';
import fr from './Button.fr.md?raw';
import variantsCode from './Variants.source.md?raw';

const meta: Meta<typeof Button> = {
  title: 'Primitives/Button',
  component: Button,
  parameters: prose(fr),
};

export default meta;

export const Variants: StoryObj<typeof Button> = {
  parameters: source(variantsCode),
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Réserver</Button>
      <Button variant="accent">Publier une annonce</Button>
      <Button variant="ghost">Annuler</Button>
      <Button variant="danger">Supprimer</Button>
      <Button small>Petit</Button>
      <Button disabled>Indisponible</Button>
    </div>
  ),
};
