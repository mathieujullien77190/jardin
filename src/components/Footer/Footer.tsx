import Link from 'next/link';
import { ROUTES } from '@/constants';

export const Footer = () => (
  <footer className="border-line text-mute border-t px-4 pt-8 pb-24 text-center text-sm md:pb-8">
    <p>
      © Adopte un jardin · Démo : données stockées dans votre navigateur, connexion et
      paiement simulés.
    </p>
    <p className="mt-2 text-xs">
      Cartes © contributeurs OpenStreetMap · fond OpenFreeMap · cadastre DINUM
      (data.gouv.fr) · photos aériennes et API Carto IGN · géocodage Géoplateforme
    </p>
    <p className="mt-1">
      <Link href={ROUTES.guide} className="underline">
        Guide du jardinier
      </Link>
    </p>
  </footer>
);
