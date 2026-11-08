import type { HeartIconProps } from './types';

// Flat design heart: one solid colour (or a plain outline), no gradient, no shadow.
const PATH =
  'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z';

const HeartIcon = ({ filled = false, className = 'h-5 w-5' }: HeartIconProps) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={`${filled ? 'text-heart' : 'text-mute'} ${className}`}
  >
    <path
      d={PATH}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 2}
      strokeLinejoin="round"
    />
  </svg>
);

export default HeartIcon;
