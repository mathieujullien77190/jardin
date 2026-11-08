import type { ButtonProps, ButtonVariant } from './types';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-dark',
  accent: 'bg-accent text-ink hover:opacity-90',
  ghost: 'border border-line bg-surface text-ink hover:bg-brand-soft',
  danger: 'border border-danger bg-surface text-danger hover:bg-danger hover:text-white',
};

const Button = ({
  variant = 'primary',
  href,
  linkAs: LinkTag = 'a',
  small = false,
  className = '',
  children,
  type = 'button',
  ...rest
}: ButtonProps) => {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
    small ? 'px-3 py-1.5 text-xs' : 'px-5 py-2.5 text-sm'
  } ${VARIANTS[variant]} ${className}`;
  if (href) {
    return (
      <LinkTag href={href} className={classes}>
        {children}
      </LinkTag>
    );
  }
  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
};

export default Button;
