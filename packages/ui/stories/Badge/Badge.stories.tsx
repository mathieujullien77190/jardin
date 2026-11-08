import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../../src';
import { prose } from '../prose';
import { source } from '../source';
import fr from './Badge.fr.md?raw';
import tonesCode from './Tones.source.md?raw';

const meta: Meta<typeof Badge> = {
  title: 'Primitives/Badge',
  component: Badge,
  parameters: prose(fr),
};

export default meta;

export const Tones: StoryObj<typeof Badge> = {
  parameters: source(tonesCode),
  render: () => (
    <div className="flex gap-2">
      <Badge tone="green">Validée</Badge>
      <Badge tone="orange">Payée · à valider</Badge>
      <Badge tone="red">Annulée</Badge>
      <Badge>Brouillon</Badge>
    </div>
  ),
};
