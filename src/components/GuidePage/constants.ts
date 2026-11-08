export const GUIDE_SECTIONS = [
  {
    emoji: '🥕',
    title: 'Louer une parcelle',
    items: [
      'Choisissez une année culturale et payez la participation annuelle (+ frais de service).',
      'Vous recevez un code de validation personnel dans « Mes réservations ».',
      'À la première rencontre, donnez ce code au propriétaire : il valide votre réservation.',
      'L’adresse exacte et le téléphone du propriétaire s’affichent après paiement.',
    ],
  },
  {
    emoji: '🍓',
    title: 'Venir cueillir',
    items: [
      'Réservez une date et un nombre de paniers ou un poids estimé.',
      'Respectez les plages d’accès et le nombre maximum de personnes présentes.',
      'Apportez vos contenants si l’annonce ne les fournit pas.',
    ],
  },
  {
    emoji: '🏡',
    title: 'Proposer mon jardin',
    items: [
      'Décrivez la surface, l’eau, les outils, les toilettes et vos équipements.',
      'Indiquez vos plages d’accès jour par jour et ajoutez des photos.',
      'Après validation du code, demandez vos versements en mars, juin et octobre.',
    ],
  },
  {
    emoji: '🪴',
    title: 'Échanger des plantes',
    items: [
      'Les dons de plants, semis, graines et boutures sont gratuits.',
      'Marquez un don comme « donné » pour le retirer de la liste publique.',
    ],
  },
] as const;

export const SEASON_CALENDAR = [
  { season: 'Printemps', crops: '🥬 Salades · 🥕 Carottes · 🌱 Semis' },
  { season: 'Début d’été', crops: '🍓 Fraises · 🍒 Cerises' },
  { season: 'Plein été', crops: '🍅 Tomates · 🥒 Courgettes · 🫐 Fruits rouges' },
  { season: 'Automne', crops: '🍎 Pommes · 🍐 Poires · 🎃 Courges' },
] as const;
