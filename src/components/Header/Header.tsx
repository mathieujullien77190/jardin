'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ROUTES } from '@/constants';
import { initials } from '@/helpers/format';
import { useApp } from '@/hooks/useApp';
import Button from '../ui/Button';
import { NAV_LINKS } from './constants';
import { countPendingValidations, isActivePath } from './helpers';

export const Header = () => {
  const { user, db, theme, toggleTheme, logout } = useApp();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const pending = user ? countPendingValidations(db, user.id) : 0;
  const links = NAV_LINKS.filter((link) => !link.auth || user);

  return (
    <header className="border-line bg-surface/90 sticky top-0 z-20 border-b backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href={ROUTES.home} className="text-brand text-lg font-extrabold">
          🌱 Adopte un jardin
        </Link>

        <button
          type="button"
          aria-label="Menu"
          className="border-line rounded-lg border px-3 py-1.5 lg:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          ☰
        </button>

        <nav
          className={`${
            open ? 'flex' : 'hidden'
          } border-line bg-surface absolute inset-x-0 top-full flex-col gap-1 border-b p-4 lg:static lg:flex lg:flex-row lg:items-center lg:border-0 lg:bg-transparent lg:p-0`}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`rounded-full px-3 py-1.5 text-sm ${
                isActivePath(pathname, link.href)
                  ? 'bg-brand-soft text-brand-dark font-semibold'
                  : 'text-ink hover:bg-brand-soft'
              }`}
            >
              {link.label}
              {link.href === ROUTES.myListings && pending > 0 && (
                <span className="bg-accent text-ink ml-1.5 rounded-full px-1.5 text-[10px] font-bold">
                  {pending}
                </span>
              )}
            </Link>
          ))}

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Changer de thème"
            className="hover:bg-brand-soft rounded-full px-3 py-1.5 text-sm"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {user ? (
            <div className="flex items-center gap-2 lg:ml-2">
              <Link
                href={ROUTES.profile}
                onClick={() => setOpen(false)}
                title={user.name}
                className="bg-brand grid h-9 w-9 place-items-center rounded-full text-xs font-bold text-white"
              >
                {initials(user.name)}
              </Link>
              <Button variant="ghost" small onClick={logout}>
                Déconnexion
              </Button>
              <Button href={ROUTES.newListing} small>
                Proposer mon jardin
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 lg:ml-2">
              <Button href={ROUTES.login} small>
                Connexion
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};
