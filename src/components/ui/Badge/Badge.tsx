import type { BadgeProps, BadgeTone } from './types';

const TONES: Record<BadgeTone, string> = {
  neutral: 'bg-line text-ink',
  green: 'bg-brand-soft text-brand-dark',
  orange: 'bg-accent/25 text-ink',
  red: 'bg-danger/15 text-danger',
};

const Badge = ({ tone = 'neutral', children }: BadgeProps) => (
  <span
    className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${TONES[tone]}`}
  >
    {children}
  </span>
);

export default Badge;
