import type { ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'accent' | 'ghost' | 'danger';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  href?: string;
  small?: boolean;
};
