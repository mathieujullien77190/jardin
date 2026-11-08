import type { GuideArticle } from '@/types';
import { ROUTES } from './index';

export const GUIDE_ARTICLES: GuideArticle[] = [
  {
    slug: 'louer-une-parcelle',
    emoji: '🥕',
    title: 'Louer une parcelle',
    summary:
      'Choisir un jardin, réserver une année culturale, comprendre le prix et le code de validation.',
    readTime: '4 min',
    ctaLabel: 'Voir les parcelles à louer',
    ctaHref: ROUTES.home,
    sections: [
      {
        id: 'principe',
        title: 'Le principe',
        paragraphs: [
          'Vous n’avez pas de balcon assez grand, pas de terrain, mais l’envie de faire pousser vos propres légumes ? En louant une parcelle, vous disposez d’un morceau de jardin pour toute une année culturale, chez un particulier qui ne l’utilise pas ou plus.',
          'Vous cultivez ce que vous voulez, quand vous voulez, dans les plages d’accès prévues par le propriétaire. Il garde la terre, vous gardez la récolte.',
        ],
      },
      {
        id: 'choisir',
        title: 'Choisir la bonne parcelle',
        paragraphs: [
          'Utilisez la recherche de la page d’accueil et le mode « Location ». Plusieurs critères comptent vraiment avant de réserver :',
        ],
        bullets: [
          'La surface : 20 à 40 m² suffisent pour une famille de 2 à 3 personnes sur un potager de saison.',
          'L’eau : robinet, cuve de récupération ou rien du tout. Un compteur d’eau individuel évite les discussions sur la consommation.',
          'Les outils : fournis ou non, avec une éventuelle participation annuelle.',
          'Les toilettes et les équipements : abri, composteur, serre, table de pique-nique…',
          'Les plages d’accès, jour par jour, et le nombre maximum de personnes présentes en même temps.',
        ],
        tip: 'Ouvrez la fiche et regardez la parcelle cadastrale sur la photo aérienne : vous voyez l’exposition, les arbres voisins et l’état du terrain avant de vous déplacer.',
      },
      {
        id: 'reserver',
        title: 'Réserver en 4 étapes',
        steps: [
          {
            title: 'Ouvrir la fiche',
            text: 'Vérifiez le descriptif, les photos, les avis des autres jardiniers et les équipements.',
          },
          {
            title: 'Choisir l’année culturale',
            text: 'Sélectionnez la saison qui vous intéresse. Une parcelle ne peut être réservée qu’une fois par année.',
          },
          {
            title: 'Vérifier le prix',
            text: 'Le total affiche la participation annuelle, la participation aux outils si elle existe, puis les frais de service (8 %, 1 € minimum) payés par le jardinier.',
          },
          {
            title: 'Payer',
            text: 'Cliquez sur « Réserver et payer ». Dans cette démo, le paiement est simulé : la réservation est confirmée immédiatement.',
          },
        ],
      },
      {
        id: 'code',
        title: 'Le code de validation',
        paragraphs: [
          'Une fois la réservation payée, vous recevez un code à 6 chiffres. Vous le retrouvez à tout moment dans « Mes réservations ».',
          'Lors de votre première rencontre avec le propriétaire, donnez-lui ce code. Il le saisit de son côté : la réservation passe alors au statut « Validée » et tout est officiellement lancé.',
        ],
        note: 'Ne communiquez pas votre code avant la rencontre : c’est la preuve que vous vous êtes bien vus.',
      },
      {
        id: 'sur-place',
        title: 'Adresse, accès et bonnes pratiques',
        paragraphs: [
          'L’adresse exacte et le téléphone du propriétaire restent masqués tant que vous n’avez pas réservé. Ils s’affichent dès le paiement, sur la fiche et dans « Mes réservations ».',
        ],
        bullets: [
          'Respectez les plages d’accès et le nombre de personnes maximum.',
          'Arrosez avec mesure, surtout si l’eau est comptée.',
          'Entretenez votre parcelle : une parcelle abandonnée finit en friche pour tout le monde.',
          'Rendez le terrain propre et les outils rangés en fin de saison.',
        ],
      },
      {
        id: 'probleme',
        title: 'Un imprévu ?',
        paragraphs: [
          'Écrivez au propriétaire depuis la fiche : la messagerie du site garde l’historique de la discussion. Si vous devez renoncer, le bouton « Annuler » de « Mes réservations » libère la parcelle pour quelqu’un d’autre.',
          'En fin de saison, pensez à laisser un avis : c’est précieux pour les prochains jardiniers.',
        ],
      },
    ],
  },
  {
    slug: 'venir-cueillir',
    emoji: '🍓',
    title: 'Venir cueillir',
    summary:
      'Trouver un verger ou un potager, réserver un créneau et profiter d’une cueillette respectueuse.',
    readTime: '3 min',
    ctaLabel: 'Voir les jardins à cueillir',
    ctaHref: ROUTES.home,
    sections: [
      {
        id: 'principe',
        title: 'Le principe',
        paragraphs: [
          'Fraises, cerises, pommes, tomates, courges : des particuliers ouvrent leur jardin pour que vous veniez cueillir directement sur place. Pas d’intermédiaire, pas d’emballage, et un produit à maturité.',
          'Vous payez au panier ou au kilo, selon l’annonce.',
        ],
      },
      {
        id: 'trouver',
        title: 'Trouver un jardin',
        paragraphs: [
          'Sur la page d’accueil, passez en mode « Cueillette », puis affinez :',
        ],
        bullets: [
          'Par commune et rayon, pour rester près de chez vous.',
          'Par prix maximum.',
          'Par équipements : eau, toilettes, outils.',
          'Sur la carte : les cercles regroupent les jardins proches, cliquez pour zoomer.',
        ],
        tip: 'Le bouton « 📍 Voir la parcelle » d’une annonce zoome la carte directement sur le jardin, avec son tracé cadastral.',
      },
      {
        id: 'reserver',
        title: 'Réserver un créneau',
        steps: [
          {
            title: 'Choisir la date',
            text: 'Une date à venir, dans les plages d’accès du jardin (souvent le week-end).',
          },
          {
            title: 'Indiquer la quantité',
            text: 'Nombre de paniers ou poids estimé : le prix s’ajuste en direct.',
          },
          {
            title: 'Payer',
            text: 'Participation du propriétaire + frais de service (8 %, 1 € minimum). Paiement simulé dans cette démo.',
          },
        ],
      },
      {
        id: 'jour-j',
        title: 'Le jour de la cueillette',
        bullets: [
          'Présentez votre code à 6 chiffres au propriétaire (dans « Mes réservations ») : il valide votre venue.',
          'Apportez vos contenants si le jardin n’en fournit pas.',
          'Cueillez ce que vous avez réservé, sans abîmer les plants ni piétiner les rangs.',
          'Refermez les portillons et respectez le nombre de personnes autorisé.',
        ],
        note: 'L’adresse exacte et le téléphone s’affichent dès que la réservation est payée.',
      },
      {
        id: 'saisons',
        title: 'Que cueille-t-on et quand ?',
        bullets: [
          'Printemps : salades, radis, premières fraises.',
          'Début d’été : fraises, cerises, framboises.',
          'Plein été : tomates, courgettes, fruits rouges, prunes.',
          'Automne : pommes, poires, courges.',
        ],
        tip: 'Le calendrier complet est en bas de la page Guide.',
      },
      {
        id: 'apres',
        title: 'Après la cueillette',
        paragraphs: [
          'Laissez un avis pour remercier le propriétaire et aider les autres cueilleurs. Si vous avez aimé, ajoutez le jardin à vos favoris pour y revenir la saison prochaine.',
        ],
      },
    ],
  },
  {
    slug: 'proposer-mon-jardin',
    emoji: '🏡',
    title: 'Proposer mon jardin',
    summary:
      'Créer une annonce, fixer un prix, valider les réservations et demander vos versements.',
    readTime: '5 min',
    ctaLabel: 'Publier mon annonce',
    ctaHref: ROUTES.newListing,
    sections: [
      {
        id: 'pourquoi',
        title: 'Pourquoi proposer son jardin ?',
        paragraphs: [
          'Un jardin non utilisé, un verger dont les fruits tombent, un coin de potager trop grand : autant de terre qui peut rendre service à d’autres, tout en vous apportant un complément et du lien avec vos voisins.',
          'Vous choisissez le mode : la cueillette (les visiteurs viennent chercher des fruits et légumes) ou la location de parcelle (un jardinier cultive une partie du terrain à l’année).',
        ],
      },
      {
        id: 'creer',
        title: 'Créer votre annonce',
        steps: [
          {
            title: 'Choisir le mode',
            text: 'Cueillette au panier ou au kilo, ou location de parcelle à l’année.',
          },
          {
            title: 'Titre et description',
            text: 'Soyez concret : ce qui pousse, l’ambiance, ce que vous fournissez.',
          },
          {
            title: 'Adresse',
            text: 'Saisissez l’adresse et choisissez-la dans la liste proposée. Le site retrouve automatiquement la parcelle cadastrale correspondante.',
          },
          {
            title: 'Surface et prix',
            text: 'La surface réellement cultivable, puis le prix par panier, par kilo ou par an.',
          },
          {
            title: 'Équipements',
            text: 'Eau, compteur individuel, outils (et leur participation), toilettes, abri, serre…',
          },
          {
            title: 'Plages d’accès',
            text: 'Cochez les jours et fixez les horaires d’ouverture, ainsi que le nombre de personnes maximum.',
          },
          {
            title: 'Photos et coordonnées',
            text: 'Jusqu’à 4 photos. L’adresse exacte et le téléphone ne sont visibles qu’après une réservation payée.',
          },
        ],
      },
      {
        id: 'prix',
        title: 'Fixer le bon prix',
        paragraphs: ['Quelques repères pour démarrer, à adapter à votre région :'],
        bullets: [
          'Cueillette : 2 à 5 € le kilo, ou 4 à 8 € le panier pour les petits fruits.',
          'Location : de 60 à 120 € par an pour un petit potager, 150 à 400 € pour un grand terrain avec eau et abri.',
          'Outils fournis : une petite participation annuelle (5 à 25 €) suffit en général.',
        ],
        tip: 'Les jardins bien photographiés, avec un descriptif précis, sont réservés bien plus vite.',
      },
      {
        id: 'valider',
        title: 'Recevoir et valider une réservation',
        paragraphs: [
          'Quand quelqu’un réserve, la demande apparaît dans « Mes parcelles ». La réservation est déjà payée : elle est au statut « Payée · à valider ».',
          'Rencontrez le jardinier, demandez-lui son code à 6 chiffres et saisissez-le dans « Valider la rencontre ». Si le code est correct, la réservation passe au statut « Validée ».',
        ],
        note: 'Une location réservée passe automatiquement en « Réservée » et n’apparaît plus dans la recherche.',
      },
      {
        id: 'verser',
        title: 'Être payé',
        paragraphs: [
          'Pour une location validée, la participation annuelle vous est versée en trois fois, à raison d’un tiers par échéance : mars, juin et octobre.',
          'Depuis « Mes parcelles », demandez chaque versement quand l’échéance arrive. Les frais de service sont payés par le jardinier, pas par vous.',
        ],
      },
      {
        id: 'gerer',
        title: 'Gérer votre annonce',
        bullets: [
          'Modifier : prix, horaires, photos, description à tout moment.',
          'Retirer : l’annonce disparaît de la recherche, vous pouvez la republier plus tard.',
          'Supprimer : définitif, les réservations non validées sont annulées.',
        ],
      },
    ],
  },
  {
    slug: 'echanger-des-plantes',
    emoji: '🪴',
    title: 'Échanger des plantes',
    summary:
      'Donner ou récupérer des plants, semis, graines et boutures, gratuitement entre membres.',
    readTime: '2 min',
    ctaLabel: 'Voir les dons de plantes',
    ctaHref: ROUTES.swap,
    sections: [
      {
        id: 'principe',
        title: 'Le principe',
        paragraphs: [
          'Trop de tomates à repiquer, une menthe qui envahit tout, des graines en surplus : la page « Échanges » permet de les donner gratuitement à d’autres jardiniers, ou d’en récupérer.',
        ],
      },
      {
        id: 'quoi',
        title: 'Que peut-on donner ?',
        bullets: [
          '🪴 Plants : déjà enracinés, prêts à être mis en terre.',
          '🌱 Semis : jeunes pousses à repiquer.',
          '🫘 Graines : sachets de la récolte précédente.',
          '🌿 Boutures : menthe, romarin, géranium, fraisiers…',
        ],
      },
      {
        id: 'proposer',
        title: 'Proposer un don',
        steps: [
          {
            title: 'Décrire le don',
            text: 'Titre, type, quantité et commune. Précisez la variété et la date si vous les connaissez.',
          },
          {
            title: 'Ajouter des photos',
            text: 'Une photo vaut mieux qu’un long texte.',
          },
          {
            title: 'Laisser un téléphone (facultatif)',
            text: 'Il n’est visible que des membres connectés.',
          },
        ],
      },
      {
        id: 'recuperer',
        title: 'Récupérer un don',
        paragraphs: [
          'Ouvrez la fiche du don, appelez le donateur pour convenir d’un moment, puis récupérez vos plants. C’est gratuit et sans engagement.',
        ],
        tip: 'Une fois le don récupéré, le donateur le marque « Donné » : il disparaît de la liste publique.',
      },
      {
        id: 'bonnes-pratiques',
        title: 'Bonnes pratiques',
        bullets: [
          'N’offrez que des plantes saines, sans maladie ni parasites.',
          'Évitez les espèces envahissantes.',
          'Indiquez si la plante est issue de variétés anciennes ou traitée.',
        ],
      },
    ],
  },
];

export const findGuideArticle = (slug: string): GuideArticle | undefined =>
  GUIDE_ARTICLES.find((article) => article.slug === slug);

export const guideRoute = (slug: string): string => `/guide/${slug}`;

export const SEASON_CALENDAR = [
  { season: 'Printemps', crops: '🥬 Salades · 🥕 Carottes · 🌱 Semis' },
  { season: 'Début d’été', crops: '🍓 Fraises · 🍒 Cerises' },
  { season: 'Plein été', crops: '🍅 Tomates · 🥒 Courgettes · 🫐 Fruits rouges' },
  { season: 'Automne', crops: '🍎 Pommes · 🍐 Poires · 🎃 Courges' },
] as const;
