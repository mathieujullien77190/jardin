import Link from 'next/link';
import { ROUTES } from '@/constants';

export const Footer = () => (
  <footer className="border-line text-mute border-t px-4 py-8 text-center text-sm">
    <p>
      © Adopte un jardin · Démo : données stockées dans votre navigateur, connexion et
      paiement simulés.
    </p>
    <p className="mt-1">
      <Link href={ROUTES.guide} className="underline">
        Guide du jardinier
      </Link>
    </p>
  </footer>
);
