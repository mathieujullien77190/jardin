import { SEED_PARCELS, STARTER_TEMPLATES } from '@/constants';
import type {
  Booking,
  BookingStatus,
  Db,
  Listing,
  Message,
  Plant,
  Review,
} from '@/types';
import { createId } from './ids';
import { computeQuote } from './pricing';

// Fake content generated once per account so every page has something to show.

const FAVORITE_IDS = [
  'g-melun-1',
  'g-melun-2',
  'g-dammarie-les-lys-1',
  'g-fontainebleau-1',
  'l-fraises',
  'l-tomates',
  'l-pommes',
  'l-fleuri',
  'l-rouges',
  'l-courges',
  'g-nice-1',
  'g-lyon-1',
  'g-bordeaux-2',
  'g-paris-1',
  'g-nantes-1',
  'g-biarritz-2',
];

type GardenerBooking = {
  listingId: string;
  quantity: number;
  status: BookingStatus;
  date: string;
  code: string;
};

const GARDENER_BOOKINGS: GardenerBooking[] = [
  {
    listingId: 'l-fraises',
    quantity: 3,
    status: 'payee',
    date: '2026-11-21',
    code: '482913',
  },
  {
    listingId: 'l-pommes',
    quantity: 5,
    status: 'validee',
    date: '2026-10-04',
    code: '730155',
  },
  {
    listingId: 'l-rouges',
    quantity: 2,
    status: 'annulee',
    date: '2026-09-12',
    code: '115902',
  },
];

type OwnerBooking = {
  gardenerId: string;
  quantity: number;
  status: BookingStatus;
  date: string;
  code: string;
};

// One incoming booking per own garden: to validate, validated, cancelled.
const OWNER_BOOKINGS: OwnerBooking[] = [
  {
    gardenerId: 'u-lea',
    quantity: 1,
    status: 'payee',
    date: '2026-11-02',
    code: '271828',
  },
  {
    gardenerId: 'u-jean',
    quantity: 2,
    status: 'validee',
    date: '2026-10-18',
    code: '314159',
  },
  {
    gardenerId: 'u-samir',
    quantity: 4,
    status: 'annulee',
    date: '2026-09-27',
    code: '161803',
  },
];

// 3 gardens offered to every account, with real cadastral parcels.
export const buildStarterListings = (ownerId: string): Listing[] =>
  STARTER_TEMPLATES.map(({ templateId, ...template }) => ({
    ...template,
    id: createId('l'),
    ownerId,
    status: 'publiee',
    createdAt: new Date().toISOString(),
    parcel: SEED_PARCELS[templateId],
  }));

const message = (
  id: string,
  listingId: string,
  fromId: string,
  toId: string,
  text: string,
  createdAt: string,
): Message => ({ id, listingId, fromId, toId, text, createdAt });

export const fillUserActivity = (db: Db, userId: string): Db => {
  if (db.seededUsers?.includes(userId)) return db;

  let listings = db.listings;
  if (!listings.some((listing) => listing.ownerId === userId)) {
    listings = [...buildStarterListings(userId), ...listings];
  }
  const mine = listings.filter((listing) => listing.ownerId === userId);
  const find = (id: string): Listing | undefined =>
    listings.find((listing) => listing.id === id);
  const prefix = `${userId}-demo`;

  // Favorites.
  const favorites = Object.hasOwn(db.favorites, userId)
    ? db.favorites[userId]
    : FAVORITE_IDS.filter((id) => find(id));

  // Bookings made as a gardener.
  const asGardener: Booking[] = GARDENER_BOOKINGS.flatMap((row, index) => {
    const listing = find(row.listingId);
    if (!listing || listing.ownerId === userId) return [];
    const at = `${row.date}T09:00:00.000Z`;
    return [
      {
        id: `b-${prefix}-g${index}`,
        listingId: listing.id,
        gardenerId: userId,
        ownerId: listing.ownerId,
        season: 2026,
        date: row.date,
        quantity: row.quantity,
        ...computeQuote(listing, row.quantity),
        status: row.status,
        code: row.code,
        validatedAt: row.status === 'validee' ? at : undefined,
        cancelledAt: row.status === 'annulee' ? at : undefined,
        payoutsRequested: [],
        createdAt: at,
      },
    ];
  });

  // Bookings received on the account's own gardens.
  const asOwner: Booking[] = mine
    .slice(0, OWNER_BOOKINGS.length)
    .flatMap((listing, index) => {
      const row = OWNER_BOOKINGS[index];
      if (row.gardenerId === userId) return [];
      const location = listing.mode === 'location';
      const at = `${row.date}T10:30:00.000Z`;
      return [
        {
          id: `b-${prefix}-o${index}`,
          listingId: listing.id,
          gardenerId: row.gardenerId,
          ownerId: userId,
          season: 2026,
          date: location ? null : row.date,
          quantity: location ? 1 : row.quantity,
          ...computeQuote(listing, location ? 1 : row.quantity),
          status: row.status,
          code: row.code,
          validatedAt: row.status === 'validee' ? at : undefined,
          cancelledAt: row.status === 'annulee' ? at : undefined,
          payoutsRequested: [],
          createdAt: at,
        },
      ];
    });

  // A location with an active booking is no longer open for rent.
  const booked = new Set(
    asOwner
      .filter((booking) => booking.status !== 'annulee' && booking.date === null)
      .map((booking) => booking.listingId),
  );
  listings = listings.map((listing) =>
    booked.has(listing.id) ? { ...listing, status: 'reservee' } : listing,
  );

  // Messages.
  const messages: Message[] = [];
  const first = mine[0];
  const second = mine[1];
  if (userId !== 'u-marie' && find('l-fraises')) {
    messages.push(
      message(
        `m-${prefix}-1`,
        'l-fraises',
        userId,
        'u-marie',
        'Bonjour, serait-il possible de venir à quatre samedi matin ?',
        '2026-11-03T18:10:00.000Z',
      ),
      message(
        `m-${prefix}-2`,
        'l-fraises',
        'u-marie',
        userId,
        'Bonjour, oui sans souci ! Venez vers 9h30, le portillon sera ouvert.',
        '2026-11-03T19:02:00.000Z',
      ),
      message(
        `m-${prefix}-3`,
        'l-fraises',
        userId,
        'u-marie',
        'Parfait, merci beaucoup, à samedi !',
        '2026-11-03T19:15:00.000Z',
      ),
    );
  }
  if (userId !== 'u-jean' && find('l-pommes')) {
    messages.push(
      message(
        `m-${prefix}-4`,
        'l-pommes',
        'u-jean',
        userId,
        'Merci pour votre venue ! Les pommes étaient à votre goût ?',
        '2026-10-05T08:40:00.000Z',
      ),
      message(
        `m-${prefix}-5`,
        'l-pommes',
        userId,
        'u-jean',
        'Excellentes, on revient l’an prochain avec les enfants.',
        '2026-10-05T12:05:00.000Z',
      ),
    );
  }
  if (first && userId !== 'u-lea') {
    messages.push(
      message(
        `m-${prefix}-6`,
        first.id,
        'u-lea',
        userId,
        'Bonjour, je viens de réserver votre potager pour la saison. Mon code de validation : 271828.',
        '2026-11-02T10:45:00.000Z',
      ),
      message(
        `m-${prefix}-7`,
        first.id,
        userId,
        'u-lea',
        'Bienvenue ! Passez samedi matin, je vous montre les outils et le composteur.',
        '2026-11-02T11:20:00.000Z',
      ),
    );
  }
  if (second && userId !== 'u-jean') {
    messages.push(
      message(
        `m-${prefix}-8`,
        second.id,
        'u-jean',
        userId,
        'Les cerises étaient délicieuses, merci pour l’accueil !',
        '2026-10-18T16:30:00.000Z',
      ),
    );
  }

  // A review left on a garden visited.
  const reviews: Review[] =
    find('l-pommes') && find('l-pommes')?.ownerId !== userId
      ? [
          {
            id: `r-${prefix}-1`,
            listingId: 'l-pommes',
            userId,
            rating: 5,
            text: 'Un verger magnifique, cueillette très bien organisée.',
            createdAt: '2026-10-06T09:00:00.000Z',
          },
        ]
      : [];

  // A couple of plant donations.
  const hasPlants = db.plants.some((plant) => plant.ownerId === userId);
  const plants: Plant[] = hasPlants
    ? []
    : [
        {
          id: `p-${prefix}-1`,
          ownerId: userId,
          title: 'Boutures de géranium',
          description: 'Géraniums lierres rouges, boutures racinées, prêtes à rempoter.',
          kind: 'bouture',
          quantity: 8,
          city: 'Melun',
          phone: '',
          photos: [],
          status: 'disponible',
          createdAt: '2026-10-20T10:00:00.000Z',
        },
        {
          id: `p-${prefix}-2`,
          ownerId: userId,
          title: 'Graines de capucines',
          description: 'Récolte de cette année, sachets d’une trentaine de graines.',
          kind: 'graines',
          quantity: 30,
          city: 'Melun',
          phone: '',
          photos: [],
          status: 'disponible',
          createdAt: '2026-10-22T10:00:00.000Z',
        },
      ];

  return {
    ...db,
    listings,
    favorites: { ...db.favorites, [userId]: favorites },
    bookings: [...asOwner, ...asGardener, ...db.bookings],
    messages: [...db.messages, ...messages],
    reviews: [...db.reviews, ...reviews],
    plants: [...plants, ...db.plants],
    seededUsers: [...(db.seededUsers ?? []), userId],
  };
};
