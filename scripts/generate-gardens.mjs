// Generates demo gardens all over France, each on a random real cadastral parcel
// (IGN API Carto). Writes src/constants/generated-gardens.ts. Run: npm run gardens
import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { hash, mulberry32, pickParcel } from './lib/cadastre.mjs';

// Keep in sync with the CITIES list of src/constants/index.ts (cities without hand-made gardens).
const CITIES = [
  ['Nice', 43.7102, 7.262],
  ['Montpellier', 43.6108, 3.8767],
  ['Grenoble', 45.1885, 5.7245],
  ['Dijon', 47.322, 5.0415],
  ['Reims', 49.2583, 4.0317],
  ['Metz', 49.1193, 6.1757],
  ['Nancy', 48.6921, 6.1844],
  ['Clermont-Ferrand', 45.7772, 3.087],
  ['Limoges', 45.8336, 1.2611],
  ['Poitiers', 46.5802, 0.3404],
  ['Angers', 47.4784, -0.5632],
  ['Le Mans', 48.0061, 0.1996],
  ['Caen', 49.1829, -0.3707],
  ['Amiens', 49.8941, 2.2958],
  ['Orléans', 47.9029, 1.9093],
  ['Besançon', 47.2378, 6.0241],
  ['Perpignan', 42.6887, 2.8948],
  ['Avignon', 43.9493, 4.8055],
  ['Pau', 43.2951, -0.3708],
  ['Brest', 48.3904, -4.4861],
  ['Quimper', 47.996, -4.097],
  ['Saint-Étienne', 45.4397, 4.3872],
  ['Toulon', 43.1242, 5.928],
  ['La Rochelle', 46.1603, -1.1511],
  ['Biarritz', 43.4832, -1.5586],
  ['Colmar', 48.0794, 7.3585],
  ['Chambéry', 45.5646, 5.9178],
  ['Valence', 44.9334, 4.8924],
  ['Nîmes', 43.8367, 4.3601],
  ['Ajaccio', 41.9192, 8.7386],
  ['Bourges', 47.081, 2.3987],
  ['Troyes', 48.2973, 4.0744],
  ['Lorient', 47.7482, -3.3702],
  ['Saint-Malo', 48.6493, -2.0257],
  ['Cherbourg', 49.6337, -1.6221],
  ['Albi', 43.9298, 2.148],
  // Around Melun (77): [name, lat, lng, gardens].
  ['Melun', 48.5395, 2.6606, 5],
  ['Dammarie-les-Lys', 48.5127, 2.6414, 3],
  ['Le Mée-sur-Seine', 48.5319, 2.6342, 3],
  ['Vaux-le-Pénil', 48.5282, 2.6872, 3],
  ['Savigny-le-Temple', 48.597, 2.5832, 2],
  ['Cesson', 48.5667, 2.5833, 2],
  ['Saint-Fargeau-Ponthierry', 48.556, 2.548, 2],
  ['Fontainebleau', 48.4047, 2.7016, 2],
  ['Moret-sur-Loing', 48.3733, 2.8167, 2],
  ['Brie-Comte-Robert', 48.6933, 2.609, 2],
  // Big cities and the hand-made ones get extra gardens too.
  ['Paris', 48.8566, 2.3522],
  ['Lyon', 45.764, 4.8357],
  ['Marseille', 43.2965, 5.3698],
  ['Toulouse', 43.6047, 1.4442],
  ['Bordeaux', 44.8378, -0.5792],
  ['Lille', 50.6292, 3.0573],
  ['Nantes', 47.2184, -1.5536],
  ['Strasbourg', 48.5734, 7.7521],
  ['Rennes', 48.1173, -1.6778],
];
const GARDENS_PER_CITY = 2;

const OWNERS = ['u-marie', 'u-jean', 'u-samir', 'u-lea'];
const STREETS = [
  'rue des Lilas',
  'chemin du Moulin',
  'allée des Tilleuls',
  'impasse du Verger',
  'route des Champs',
  'rue du Clos',
  'chemin des Vignes',
];
const EQUIPMENT = [
  '',
  'Abri de jardin',
  'Composteur',
  'Table de pique-nique',
  'Serre',
  'Poulailler',
  'Échelles',
  'Jeux pour enfants',
];
const WATER = ['aucune', 'robinet', 'robinet', 'cuve'];
const EMOJI = {
  Fraises: '🍓',
  'Fruits rouges': '🫐',
  Cerises: '🍒',
  Pommes: '🍎',
  Poires: '🍐',
  Prunes: '🍑',
  Tomates: '🍅',
  Courgettes: '🥒',
  Salades: '🥬',
  Carottes: '🥕',
  Courges: '🎃',
  Aromatiques: '🌿',
  Fleurs: '🌻',
};
const TONES = ['#fde8e8', '#e6f4dc', '#fff0d9', '#e1ecfb', '#efe3f7'];
const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];

const ARCHETYPES = [
  {
    mode: 'cueillette',
    titles: [
      'Verger des quatre saisons',
      'Clos des pommiers',
      'Le verger gourmand',
      'Verger du Moulin',
    ],
    produce: [
      ['Pommes', 'Poires'],
      ['Pommes', 'Prunes'],
      ['Cerises', 'Prunes'],
      ['Poires', 'Prunes'],
    ],
    price: [2, 5],
    units: ['kg'],
    text: 'Cueillette au poids dans un verger familial, échelles et caisses prêtées.',
  },
  {
    mode: 'cueillette',
    titles: ['Petits fruits rouges', 'Jardin des framboises', 'Les fraisiers du coteau'],
    produce: [['Fruits rouges'], ['Fraises', 'Fruits rouges'], ['Fraises']],
    price: [4, 8],
    units: ['panier'],
    text: 'Fraises et fruits rouges à cueillir en famille, panier fourni.',
  },
  {
    mode: 'cueillette',
    titles: ['Potager à cueillir', 'Ferme aux légumes', 'Le jardin gourmand'],
    produce: [
      ['Tomates', 'Courgettes'],
      ['Courges', 'Courgettes'],
      ['Salades', 'Carottes'],
      ['Tomates', 'Aromatiques'],
    ],
    price: [2, 4],
    units: ['kg', 'panier'],
    text: 'Légumes de saison en libre cueillette, cultivés sans traitement.',
  },
  {
    mode: 'location',
    titles: [
      'Parcelle potagère',
      'Mon petit potager',
      'Potager partagé',
      'Jardin ouvrier',
    ],
    produce: [
      ['Salades', 'Carottes', 'Tomates'],
      ['Tomates', 'Courgettes'],
      ['Carottes', 'Salades'],
    ],
    price: [60, 260],
    units: ['an'],
    text: 'Parcelle prête à cultiver, terre amendée, accès facile.',
  },
  {
    mode: 'location',
    titles: ['Jardin fleuri à louer', 'Verger à louer', 'Jardin aromatique'],
    produce: [
      ['Fleurs', 'Aromatiques'],
      ['Pommes', 'Prunes'],
      ['Aromatiques', 'Fleurs'],
    ],
    price: [80, 400],
    units: ['an'],
    text: 'Jardin calme à louer à l’année, idéal pour jardiner entre voisins.',
  },
];

const slug = (text) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const build = (city, lat, lng, index, parcel) => {
  const id = `g-${slug(city)}-${index + 1}`;
  const random = mulberry32(hash(`build-${id}`));
  const pick = (list) => list[Math.floor(random() * list.length)];
  const between = (min, max) => min + Math.floor(random() * (max - min + 1));

  const archetype = pick(ARCHETYPES);
  const produce = pick(archetype.produce);
  const isLocation = archetype.mode === 'location';
  const toolsProvided = random() < 0.5;
  const price = isLocation
    ? Math.round(between(...archetype.price) / 5) * 5
    : between(...archetype.price);
  const emoji = EMOJI[produce[0]];
  const days = isLocation
    ? random() < 0.5
      ? ALL_DAYS
      : [1, 3, 5, 6]
    : random() < 0.5
      ? [5, 6]
      : [2, 5, 6];
  const [from, to] = isLocation
    ? ['08:00', '20:00']
    : random() < 0.5
      ? ['09:00', '13:00']
      : ['10:00', '17:00'];
  const day = new Date(Date.UTC(2026, 0, 1) + between(0, 70) * 86400000);

  return {
    id,
    ownerId: OWNERS[(hash(id) >>> 0) % OWNERS.length],
    title: `${pick(archetype.titles)}`,
    description: `${archetype.text} Près de ${city}.`,
    city,
    mode: archetype.mode,
    area: Math.max(40, Math.min(parcel.area, between(4, 80) * 10)),
    price,
    unit: pick(archetype.units),
    toolsProvided,
    toolsPrice: isLocation && toolsProvided ? between(1, 5) * 5 : 0,
    water: pick(WATER),
    waterMeter: isLocation && random() < 0.5,
    accessSlots: days.map((d) => ({ day: d, from, to })),
    maxPeople: between(2, 10),
    toilets: random() < 0.5,
    equipment: pick(EQUIPMENT),
    produce,
    photos: [],
    address: `${between(1, 60)} ${pick(STREETS)}, ${city}`,
    phone: `06 ${between(10, 99)} ${between(10, 99)} ${between(10, 99)} ${between(10, 99)}`,
    parcel,
    status: 'publiee',
    emoji,
    tone: TONES[Object.values(EMOJI).indexOf(emoji) % TONES.length],
    createdAt: day.toISOString(),
  };
};

const gardens = [];
for (const [city, lat, lng, count = GARDENS_PER_CITY] of CITIES) {
  for (let index = 0; index < count; index += 1) {
    const parcel = await pickParcel(`gen-${slug(city)}-${index}`, city, lat, lng, {
      minArea: 100,
      maxArea: 2500,
      maxPoints: 40,
      attempts: 80,
      spreadLng: 0.03,
      spreadLat: 0.02,
    });
    if (!parcel) {
      console.warn(`skip ${city} #${index + 1}: no parcel`);
      continue;
    }
    gardens.push(build(city, lat, lng, index, parcel));
    console.log(
      `${city} #${index + 1}: ${parcel.commune} ${parcel.ref} (${parcel.area} m²)`,
    );
  }
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const body = `// Generated by scripts/generate-gardens.mjs (IGN API Carto, cadastre). Do not edit.
import type { Listing } from '@/types';

export const GENERATED_LISTINGS: Listing[] = ${JSON.stringify(gardens)};
`;
writeFileSync(resolve(root, 'src/constants/generated-gardens.ts'), body);
console.log(`written src/constants/generated-gardens.ts (${gardens.length} gardens)`);
