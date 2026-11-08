import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Chip } from '../../src';
import { prose } from '../prose';
import { source } from '../source';
import fr from './Chip.fr.md?raw';
import filterGroupCode from './FilterGroup.source.md?raw';

const OPTIONS = ['Outils', 'Eau', 'Toilettes'];

const Filters = () => {
  const [selected, setSelected] = useState<string[]>(['Eau']);
  const toggle = (option: string): void =>
    setSelected((current) =>
      current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option],
    );

  return (
    <div className="flex gap-2">
      {OPTIONS.map((option) => (
        <Chip
          key={option}
          label={option}
          active={selected.includes(option)}
          onClick={() => toggle(option)}
        />
      ))}
    </div>
  );
};

const meta: Meta<typeof Chip> = {
  title: 'Primitives/Chip',
  component: Chip,
  parameters: prose(fr),
};

export default meta;

export const FilterGroup: StoryObj<typeof Chip> = {
  parameters: source(filterGroupCode),
  render: () => <Filters />,
};
