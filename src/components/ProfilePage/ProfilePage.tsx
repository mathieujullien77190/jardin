'use client';

import { useState } from 'react';
import { CITIES, INPUT_CLASS } from '@/constants';
import { useApp } from '@/hooks/useApp';
import RequireAuth from '../RequireAuth';
import Button from '../ui/Button';
import Field from '../ui/Field';

const Content = () => {
  const { user, db, updateProfile, logout, resetData } = useApp();
  const [name, setName] = useState(user?.name ?? '');
  const [city, setCity] = useState(user?.city ?? '');
  if (!user) return null;

  const stats = [
    ['Annonces', db.listings.filter((l) => l.ownerId === user.id).length],
    ['Réservations', db.bookings.filter((b) => b.gardenerId === user.id).length],
    ['Dons de plantes', db.plants.filter((p) => p.ownerId === user.id).length],
  ] as const;

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-extrabold">Mon profil</h1>
      <div className="grid grid-cols-3 gap-3 text-center">
        {stats.map(([label, value]) => (
          <div key={label} className="border-line bg-surface rounded-xl border p-3">
            <div className="text-brand text-2xl font-extrabold">{value}</div>
            <div className="text-mute text-xs">{label}</div>
          </div>
        ))}
      </div>
      <form
        className="border-line bg-surface space-y-3 rounded-2xl border p-5"
        onSubmit={(event) => {
          event.preventDefault();
          updateProfile(name, city);
        }}
      >
        <Field label="E-mail">
          <input className={INPUT_CLASS} value={user.email} disabled />
        </Field>
        <Field label="Nom">
          <input
            className={INPUT_CLASS}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>
        <Field label="Commune par défaut">
          <select
            className={INPUT_CLASS}
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="">—</option>
            {CITIES.map((candidate) => (
              <option key={candidate.name}>{candidate.name}</option>
            ))}
          </select>
        </Field>
        <Button type="submit">Enregistrer</Button>
      </form>
      <div className="flex flex-wrap gap-3">
        <Button variant="ghost" onClick={logout}>
          Se déconnecter
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            if (window.confirm('Réinitialiser toutes les données de démonstration ?'))
              resetData();
          }}
        >
          Réinitialiser les données
        </Button>
      </div>
    </div>
  );
};

export const ProfilePage = () => (
  <RequireAuth>
    <Content />
  </RequireAuth>
);
