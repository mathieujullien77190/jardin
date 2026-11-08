'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ROUTES } from '@/constants';
import { initials } from '@/helpers/format';
import { useApp } from '@/hooks/useApp';
import Button from '../ui/Button';
import HeartIcon from '../ui/HeartIcon';
import { MAIN_LINKS, USER_LINKS } from './constants';
import { countPendingValidations, isActivePath } from './helpers';

const linkClass = (active: boolean): string =>
  `whitespace-nowrap rounded-full px-3.5 py-2 text-sm transition ${
    active ? 'bg-brand-soft font-semibold text-brand-dark' : 'hover:bg-brand-soft'
  }`;

export const Header = () => {
  const { user, db, logout } = useApp();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pending = user ? countPendingValidations(db, user.id) : 0;

  const closeAll = (): void => {
    setMobileOpen(false);
    setMenuOpen(false);
  };

  return (
    <header className="border-line bg-surface/95 sticky top-0 z-30 border-b backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link
          href={ROUTES.home}
          onClick={closeAll}
          className="text-brand shrink-0 text-lg font-extrabold whitespace-nowrap"
        >
          🌱 Adopte un jardin
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {MAIN_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={linkClass(isActivePath(pathname, link.href))}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden sm:block">
                <Button href={ROUTES.newListing} small className="whitespace-nowrap">
                  + Proposer mon jardin
                </Button>
              </div>

              <div className="relative hidden md:block">
                <button
                  type="button"
                  aria-label="Menu du compte"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((value) => !value)}
                  className="bg-brand relative grid h-10 w-10 place-items-center rounded-full text-sm font-bold text-white"
                >
                  {initials(user.name)}
                  {pending > 0 && (
                    <span className="bg-accent absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white" />
                  )}
                </button>
                {menuOpen && (
                  <>
                    <button
                      type="button"
                      aria-label="Fermer le menu"
                      className="fixed inset-0 z-10 cursor-default"
                      onClick={() => setMenuOpen(false)}
                    />
                    <div className="border-line bg-surface absolute top-full right-0 z-20 mt-2 w-64 rounded-2xl border p-2 shadow-lg">
                      <div className="border-line mb-1 border-b px-3 py-2">
                        <p className="truncate font-semibold">{user.name}</p>
                        <p className="text-mute truncate text-xs">{user.email}</p>
                      </div>
                      {USER_LINKS.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={closeAll}
                          className="hover:bg-brand-soft flex items-center gap-3 rounded-xl px-3 py-2 text-sm whitespace-nowrap"
                        >
                          <span>
                            {link.icon === 'heart' ? (
                              <HeartIcon filled className="h-4 w-4" />
                            ) : (
                              link.icon
                            )}
                          </span>
                          <span>{link.label}</span>
                          {link.href === ROUTES.myListings && pending > 0 && (
                            <span className="bg-accent ml-auto rounded-full px-2 text-[11px] font-bold">
                              {pending}
                            </span>
                          )}
                        </Link>
                      ))}
                      <div className="border-line mt-1 border-t pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            closeAll();
                            logout();
                          }}
                          className="hover:bg-brand-soft flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm"
                        >
                          <span>🚪</span>
                          <span>Déconnexion</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <Button href={ROUTES.login} small className="whitespace-nowrap">
              Connexion
            </Button>
          )}

          <button
            type="button"
            aria-label="Menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((value) => !value)}
            className="border-line grid h-10 w-10 place-items-center rounded-full border md:hidden"
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-line bg-surface space-y-1 border-t px-4 py-3 md:hidden">
          {MAIN_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeAll}
              className={`block ${linkClass(isActivePath(pathname, link.href))}`}
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <>
              <div className="border-line my-2 border-t" />
              <p className="text-mute px-3.5 text-xs font-semibold uppercase">
                {user.name}
              </p>
              {USER_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeAll}
                  className={`block ${linkClass(isActivePath(pathname, link.href))}`}
                >
                  {link.icon === 'heart' ? (
                    <HeartIcon filled className="inline h-4 w-4" />
                  ) : (
                    link.icon
                  )}{' '}
                  {link.label}
                </Link>
              ))}
              <Link
                href={ROUTES.newListing}
                onClick={closeAll}
                className={`block ${linkClass(false)}`}
              >
                ➕ Proposer mon jardin
              </Link>
              <button
                type="button"
                onClick={() => {
                  closeAll();
                  logout();
                }}
                className={`block w-full text-left ${linkClass(false)}`}
              >
                🚪 Déconnexion
              </button>
            </>
          )}
        </nav>
      )}
    </header>
  );
};
