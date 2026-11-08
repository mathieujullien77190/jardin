import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, EmptyState } from '../../src';
import { prose } from '../prose';
import { source } from '../source';
import fr from './EmptyState.fr.md?raw';
import withActionCode from './WithAction.source.md?raw';

const meta: Meta<typeof EmptyState> = {
  title: 'Primitives/EmptyState',
  component: EmptyState,
  parameters: { layout: 'padded', ...prose(fr) },
};

export default meta;

export const WithAction: StoryObj<typeof EmptyState> = {
  parameters: { layout: 'padded', ...source(withActionCode) },
  render: () => (
    <EmptyState
      emoji="🧺"
      title="Aucune réservation"
      text="Réservez une cueillette ou une parcelle pour la retrouver ici."
      action={<Button href="/">Explorer les jardins</Button>}
    />
  ),
};
