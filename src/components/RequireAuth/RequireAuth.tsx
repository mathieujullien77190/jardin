'use client';

import { ROUTES } from '@/constants';
import { useApp } from '@/hooks/useApp';
import Button from '../ui/Button';
import EmptyState from '../ui/EmptyState';
import type { RequireAuthProps } from './types';

export const RequireAuth = ({ children }: RequireAuthProps) => {
  const { ready, user } = useApp();
  if (!ready) return <p className="text-mute py-20 text-center">Chargement…</p>;
  if (!user) {
    return (
      <EmptyState
        emoji="🔒"
        title="Connexion requise"
        text="Connectez-vous (compte de démonstration possible) pour accéder à cette page."
        action={<Button href={ROUTES.login}>Se connecter</Button>}
      />
    );
  }
  return <>{children}</>;
};
