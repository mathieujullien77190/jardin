'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/hooks/useApp';
import { isActivePath } from '../Header/helpers';
import HeartIcon from '../ui/HeartIcon';
import { TABS } from './constants';

// App-like navigation for phones; the top header menu is used from tablet up.
export const BottomNav = () => {
  const { user } = useApp();
  const pathname = usePathname();
  if (!user) return null;

  return (
    <nav
      aria-label="Navigation principale"
      className="border-line bg-surface/95 fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      {TABS.map((tab) => {
        const active = isActivePath(pathname, tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] ${
              active ? 'text-brand-dark font-bold' : 'text-mute'
            }`}
          >
            <span className="text-xl leading-none">
              {tab.icon === 'heart' ? <HeartIcon filled className="h-5 w-5" /> : tab.icon}
            </span>
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
