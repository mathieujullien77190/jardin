import type { StarsProps } from './types';

const STAR_VALUES = [1, 2, 3, 4, 5];

const Stars = ({ value, onChange }: StarsProps) => (
  <span className="inline-flex" aria-label={`Note ${value} sur 5`}>
    {STAR_VALUES.map((star) => (
      <button
        key={star}
        type="button"
        disabled={!onChange}
        onClick={() => onChange?.(star)}
        className={`text-lg leading-none ${star <= Math.round(value) ? 'text-accent' : 'text-line'} ${
          onChange ? 'cursor-pointer' : 'cursor-default'
        }`}
      >
        ★
      </button>
    ))}
  </span>
);

export default Stars;
