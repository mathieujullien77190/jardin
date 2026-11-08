'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CITIES, DEMO_ACCOUNTS, INPUT_CLASS, ROUTES } from '@/constants';
import { useApp } from '@/hooks/useApp';
import Button from '../ui/Button';
import Chip from '../ui/Chip';
import Field from '../ui/Field';

type Tab = 'login' | 'register';

const DEMO_PASSWORD = 'demo';

export const AuthForm = () => {
  const { login, register, user } = useApp();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');
  const [error, setError] = useState('');

  const finish = (result: { ok: boolean; error?: string }): void => {
    if (result.ok) router.push(ROUTES.home);
    else setError(result.error ?? 'Erreur');
  };

  const submit = (): void => {
    setError('');
    finish(tab === 'login' ? login(email, password) : register(name, email, city));
  };

  return (
    <div className="border-line bg-surface mx-auto max-w-md space-y-5 rounded-3xl border p-6">
      <h1 className="text-2xl font-extrabold">Bienvenue 🌱</h1>
      {user && <p className="text-brand text-sm">Connecté en tant que {user.name}.</p>}
      <div className="flex gap-2">
        <Chip
          label="Connexion"
          active={tab === 'login'}
          onClick={() => setTab('login')}
        />
        <Chip
          label="Créer un compte"
          active={tab === 'register'}
          onClick={() => setTab('register')}
        />
      </div>

      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        {tab === 'register' && (
          <Field label="Nom">
            <input
              className={INPUT_CLASS}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
        )}
        <Field label="E-mail">
          <input
            type="email"
            className={INPUT_CLASS}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        {tab === 'login' ? (
          <Field
            label="Mot de passe"
            hint="Connexion fictive : e-mail et mot de passe au choix, le compte est créé automatiquement."
          >
            <input
              type="password"
              className={INPUT_CLASS}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
        ) : (
          <Field label="Commune par défaut">
            <select
              className={INPUT_CLASS}
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option value="">Choisir…</option>
              {CITIES.map((candidate) => (
                <option key={candidate.name}>{candidate.name}</option>
              ))}
            </select>
          </Field>
        )}
        {error && <p className="text-danger text-sm">{error}</p>}
        <Button type="submit" className="w-full">
          {tab === 'login' ? 'Se connecter' : 'Créer mon compte'}
        </Button>
      </form>

      <div className="border-line border-t pt-4">
        <p className="text-mute mb-2 text-xs font-semibold uppercase">
          Comptes de démonstration
        </p>
        <div className="flex flex-wrap gap-2">
          {DEMO_ACCOUNTS.map((account) => (
            <Button
              key={account.email}
              variant="ghost"
              small
              onClick={() => finish(login(account.email, DEMO_PASSWORD))}
            >
              {account.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
