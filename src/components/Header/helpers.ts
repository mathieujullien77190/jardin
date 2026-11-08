import type { Db } from '@/types';

export const isActivePath = (pathname: string, href: string): boolean => {
  const clean = pathname.replace(/\/$/, '') || '/';
  return href === '/' ? clean === '/' : clean === href || clean.startsWith(`${href}/`);
};

export const countPendingValidations = (db: Db, userId: string): number =>
  db.bookings.filter(
    (booking) => booking.ownerId === userId && booking.status === 'payee',
  ).length;
