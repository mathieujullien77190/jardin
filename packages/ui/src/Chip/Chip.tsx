import type { ChipProps } from './types';

const Chip = ({ label, active = false, onClick }: ChipProps) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={`rounded-full border px-3.5 py-1.5 text-sm transition ${
      active
        ? 'border-ink bg-ink text-cream'
        : 'border-line bg-surface text-ink hover:border-brand'
    }`}
  >
    {label}
  </button>
);

export default Chip;
