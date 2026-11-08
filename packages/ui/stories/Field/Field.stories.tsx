import type { Meta, StoryObj } from '@storybook/react-vite';
import { Field } from '../../src';
import { prose } from '../prose';
import { source } from '../source';
import fr from './Field.fr.md?raw';
import withHintAndErrorCode from './WithHintAndError.source.md?raw';

const INPUT = 'w-full rounded-xl border border-line px-3 py-2 text-sm';

const meta: Meta<typeof Field> = {
  title: 'Primitives/Field',
  component: Field,
  parameters: prose(fr),
};

export default meta;

export const WithHintAndError: StoryObj<typeof Field> = {
  parameters: source(withHintAndErrorCode),
  render: () => (
    <div className="w-80 space-y-4">
      <Field label="Téléphone" hint="Visible des membres connectés.">
        <input className={INPUT} />
      </Field>
      <Field label="Titre" error="Titre requis.">
        <input className={INPUT} />
      </Field>
    </div>
  ),
};
