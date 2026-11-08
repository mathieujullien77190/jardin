import type { ButtonHTMLAttributes, ElementType } from 'react';

export type ButtonVariant = 'primary' | 'accent' | 'ghost' | 'danger';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  /** Renders a link instead of a button. */
  href?: string;
  /** Component used for links, e.g. `next/link` (defaults to `a`). */
  linkAs?: ElementType;
  small?: boolean;
};
