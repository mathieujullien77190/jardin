import Link from 'next/link';
import { Button as BaseButton } from '@adopte-un-jardin/ui';
import type { ButtonProps } from '@adopte-un-jardin/ui';

// App button: same primitive, with client-side navigation for links.
const Button = (props: ButtonProps) => <BaseButton linkAs={Link} {...props} />;

export default Button;
