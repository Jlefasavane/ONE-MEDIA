/* ===========================================================
   ONE MEDIA — Données articles
   =========================================================== */

const CATEGORIES = [
  { id: 'musique',   label: 'Musique',   color: '#00F5FF' },
  { id: 'cinema',    label: 'Cinéma',    color: '#FF2D55' },
  { id: 'mode',      label: 'Mode',      color: '#FFE500' },
  { id: 'art',       label: 'Art',       color: '#BF5AF2' },
  { id: 'lifestyle', label: 'Lifestyle', color: '#30D158' },
];

const ARTICLES = [

  /* ── FEATURED / HERO ─────────────────────────────── */
  {
    id: 'a-001',
    slug: 'kendrick-lamar-not-like-us-anatomie',
    title: 'Kendrick Lamar et la destruction de Drake : anatomie d\'un chef-d\'œuvre',
    excerpt: 'Comment "Not Like Us" est devenu le diss track le plus dévastateur de l\'histoire du rap — et ce que ça dit de notre époque.',
    category: 'musique',
    author: 'Marcus D.',
    authorImg: null,
    date: '2026-05-18',
    readTime: 8,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1400&q=85',
    featured: true,
    breaking: false,
    tags: ['rap', 'kendrick lamar', 'analyse', 'hip-hop'],
    views: 84200,
  },
  {
    id: 'a-002',
    slug: 'cannes-2026-palme-dor-predictions',
    title: 'Cannes 2026 : les 5 films qui pourraient tout changer',
    excerpt: 'De Scorsese à une première œuvre sénégalaise, la Croisette s\'annonce comme un champ de bataille cinématographique sans précédent.',
    category: 'cinema',
    author: 'Léa M.',
    authorImg: null,
    date: '2026-05-17',
    readTime: 6,
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1400&q=85',
    featured: true,
    breaking: false,
    tags: ['cannes', 'festival', 'cinéma mondial', 'palme d\'or'],
    views: 61300,
  },
  {
    id: 'a-003',
    slug: 'afrobeats-domination-mondiale-2026',
    title: 'Afrobeats : comment Lagos est devenue la nouvelle capitale musicale du monde',
    excerpt: 'En 2026, le Nigeria exporte plus de musique que la France. Retour sur une décennie de conquête silencieuse qui a changé les règles du jeu.',
    category: 'musique',
    author: 'Kofi A.',
    authorImg: null,
    date: '2026-05-16',
    readTime: 10,
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1400&q=85',
    featured: true,
    breaking: false,
    tags: ['afrobeats', 'nigeria', 'burna boy', 'wizkid', 'world music'],
    views: 52800,
  },

  /* ── BREAKING ─────────────────────────────────────── */
  {
    id: 'a-004',
    slug: 'beyonce-album-surprise-annonce',
    title: 'Beyoncé annonce un album surprise pour juin — et ça ressemble à rien de connu',
    excerpt: 'Un post Instagram, 4 secondes de son, et internet s\'embrase. Ce qu\'on sait.',
    category: 'musique',
    author: 'Rédaction ONE',
    authorImg: null,
    date: '2026-05-20',
    readTime: 2,
    image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1400&q=85',
    featured: false,
    breaking: true,
    tags: ['beyoncé', 'album', 'breaking'],
    views: 128000,
  },

  /* ── MUSIQUE ──────────────────────────────────────── */
  {
    id: 'a-005',
    slug: 'jazz-nouvelle-generation-paris',
    title: 'Le jazz a 20 ans à Paris et il est en colère',
    excerpt: 'Camille Bertault, Amine Mraihi, le collectif KOKORO — une nouvelle scène hybride qui refuse toutes les cases.',
    category: 'musique',
    author: 'Sophie L.',
    authorImg: null,
    date: '2026-05-15',
    readTime: 7,
    image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=1400&q=85',
    featured: false,
    breaking: false,
    tags: ['jazz', 'paris', 'scène', 'nouvelle génération'],
    views: 18400,
  },
  {
    id: 'a-006',
    slug: 'electronic-music-dakar-scene',
    title: 'Dakar Electronic : la scène qui fait trembler les clubs de Berlin',
    excerpt: 'TAMA, l\'ex-DJane de l\'Institut Français, est maintenant en résidence à Berghain. Histoire d\'un voyage sonore.',
    category: 'musique',
    author: 'Amadou S.',
    authorImg: null,
    date: '2026-05-13',
    readTime: 5,
    image: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=1400&q=85',
    featured: false,
    breaking: false,
    tags: ['électro', 'dakar', 'berlin', 'afrique'],
    views: 24100,
  },
  {
    id: 'a-007',
    slug: 'vinyl-culture-renaissance',
    title: 'Le vinyle en 2026 : résistance ou nostalgie ?',
    excerpt: 'Les ventes de vinyles ont dépassé le CD pour la 4e année consécutive. Rencontre avec ceux qui pressent, vendent et écoutent encore.',
    category: 'musique',
    author: 'Pierre V.',
    authorImg: null,
    date: '2026-05-11',
    readTime: 6,
    image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=1400&q=85',
    featured: false,
    breaking: false,
    tags: ['vinyle', 'musique physique', 'culture', 'collection'],
    views: 31200,
  },

  /* ── CINÉMA ───────────────────────────────────────── */
  {
    id: 'a-008',
    slug: 'nollywood-oscar-campaign-2027',
    title: 'Nollywood à l\'assaut des Oscars — et cette fois c\'est sérieux',
    excerpt: 'Avec "The Weight of Stars" de Chukwuemeka Obi, le Nigeria entre dans la course internationale avec une œuvre qui bouleverse les codes.',
    category: 'cinema',
    author: 'Fatou N.',
    authorImg: null,
    date: '2026-05-14',
    readTime: 7,
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1400&q=85',
    featured: false,
    breaking: false,
    tags: ['nollywood', 'oscars', 'cinéma africain', 'nigeria'],
    views: 43700,
  },
  {
    id: 'a-009',
    slug: 'intelligence-artificielle-cinema-debat',
    title: 'IA et cinéma : quand Hollywood perd le contrôle de sa propre image',
    excerpt: 'Des acteurs synthétiques, des scénarios générés, des décors virtuels. On a rencontré les réalisateurs qui refusent de jouer le jeu.',
    category: 'cinema',
    author: 'Thomas R.',
    authorImg: null,
    date: '2026-05-12',
    readTime: 9,
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1400&q=85',
    featured: false,
    breaking: false,
    tags: ['IA', 'hollywood', 'cinéma', 'technologie', 'débat'],
    views: 67800,
  },
  {
    id: 'a-010',
    slug: 'cinema-afrique-nouvelle-vague',
    title: 'La nouvelle vague africaine qui réinvente le 7e art',
    excerpt: 'De Maïssa Mbow au Sénégal à Mati Diop en France, une génération réécrit l\'histoire du cinéma depuis le continent.',
    category: 'cinema',
    author: 'Kofi A.',
    authorImg: null,
    date: '2026-05-09',
    readTime: 8,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1400&q=85',
    featured: false,
    breaking: false,
    tags: ['afrique', 'cinéma', 'nouvelle vague', 'diaspora'],
    views: 38500,
  },

  /* ── MODE ─────────────────────────────────────────── */
  {
    id: 'a-011',
    slug: 'streetwear-luxe-frontiere-effacee',
    title: 'La frontière entre streetwear et luxe n\'existe plus — et c\'est tant mieux',
    excerpt: 'Supreme chez Vuitton, Balenciaga dans les sneaker drops, Jacquemus sur Instagram. La mode n\'a plus de camps.',
    category: 'mode',
    author: 'Inès K.',
    authorImg: null,
    date: '2026-05-16',
    readTime: 5,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=85',
    featured: false,
    breaking: false,
    tags: ['streetwear', 'luxe', 'mode', 'tendances'],
    views: 29300,
  },
  {
    id: 'a-012',
    slug: 'mode-africaine-paris-fashion-week',
    title: 'Paris Fashion Week : l\'Afrique prend enfin la place qu\'elle mérite',
    excerpt: 'Thebe Magugu, Tongoro, Kenneth Ize — comment les créateurs africains ont retourné la semaine de la mode.',
    category: 'mode',
    author: 'Awa D.',
    authorImg: null,
    date: '2026-05-10',
    readTime: 6,
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1400&q=85',
    featured: false,
    breaking: false,
    tags: ['mode africaine', 'paris', 'fashion week', 'designers'],
    views: 44600,
  },
  {
    id: 'a-013',
    slug: 'mode-durable-generation-z',
    title: 'La Gen Z et la mode durable : conviction ou tendance ?',
    excerpt: 'Ils achètent vintage, boycottent Shein et portent du thrifted. Mais est-ce vraiment un changement profond ou juste une esthétique ?',
    category: 'mode',
    author: 'Chloé B.',
    authorImg: null,
    date: '2026-05-07',
    readTime: 5,
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1400&q=85',
    featured: false,
    breaking: false,
    tags: ['mode durable', 'gen z', 'vintage', 'éco-responsable'],
    views: 21800,
  },

  /* ── ART ──────────────────────────────────────────── */
  {
    id: 'a-014',
    slug: 'art-numerique-nft-apres-la-bulle',
    title: 'L\'art numérique après la bulle NFT : ce qui reste vraiment',
    excerpt: 'La spéculation s\'est effondrée, mais les artistes digitaux ont survécu. Visite de l\'après avec ceux qui ont résisté.',
    category: 'art',
    author: 'Yann F.',
    authorImg: null,
    date: '2026-05-15',
    readTime: 8,
    image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=1400&q=85',
    featured: false,
    breaking: false,
    tags: ['art numérique', 'nft', 'digital', 'artistes'],
    views: 35900,
  },
  {
    id: 'a-015',
    slug: 'street-art-abidjan-mouvement',
    title: 'Abidjan Street Art : la révolution silencieuse des murs ivoiriens',
    excerpt: 'À Cocody, Adjamé, Yopougon — une nouvelle génération de muralistes transforme la ville en galerie à ciel ouvert.',
    category: 'art',
    author: 'Aminata C.',
    authorImg: null,
    date: '2026-05-13',
    readTime: 6,
    image: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=1400&q=85',
    featured: false,
    breaking: false,
    tags: ['street art', 'abidjan', 'côte d\'ivoire', 'art urbain'],
    views: 27400,
  },
  {
    id: 'a-016',
    slug: 'basquiat-exposition-retrospective',
    title: 'Basquiat au Centre Pompidou : la rétrospective qui remet les pendules à l\'heure',
    excerpt: 'La plus grande exposition jamais consacrée à Jean-Michel Basquiat en Europe. Ce qu\'elle dit de lui, et de nous.',
    category: 'art',
    author: 'Marcus D.',
    authorImg: null,
    date: '2026-05-08',
    readTime: 7,
    image: 'https://images.unsplash.com/photo-1578926375605-eaf7559b1458?w=1400&q=85',
    featured: false,
    breaking: false,
    tags: ['basquiat', 'pompidou', 'exposition', 'art contemporain'],
    views: 58200,
  },

  /* ── LIFESTYLE ────────────────────────────────────── */
  {
    id: 'a-017',
    slug: 'accra-nouvelle-capitale-creatives',
    title: 'Accra est devenue la ville où il faut être en 2026',
    excerpt: 'Restaurants, galeries, clubs, startups — la capitale ghanéenne attire les créatifs du monde entier. On y a passé deux semaines.',
    category: 'lifestyle',
    author: 'Kofi A.',
    authorImg: null,
    date: '2026-05-17',
    readTime: 9,
    image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1400&q=85',
    featured: false,
    breaking: false,
    tags: ['accra', 'ghana', 'travel', 'culture', 'créatifs'],
    views: 48700,
  },
  {
    id: 'a-018',
    slug: 'gastronomie-diaspora-cuisine-fusion',
    title: 'La cuisine de la diaspora : quand l\'entre-deux devient gastronomie',
    excerpt: 'Des chefs franco-maliens, afro-brésiliens, sino-congolais inventent une nouvelle cuisine monde. À table.',
    category: 'lifestyle',
    author: 'Fatou N.',
    authorImg: null,
    date: '2026-05-14',
    readTime: 6,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=85',
    featured: false,
    breaking: false,
    tags: ['gastronomie', 'diaspora', 'cuisine', 'fusion', 'chefs'],
    views: 33100,
  },
  {
    id: 'a-019',
    slug: 'sante-mentale-generation-creatives',
    title: 'Santé mentale et créativité : le tabou qui se fissure enfin',
    excerpt: 'De plus en plus d\'artistes, de musiciens et de réalisateurs parlent de leurs crises. Ce que ça change pour nous tous.',
    category: 'lifestyle',
    author: 'Sophie L.',
    authorImg: null,
    date: '2026-05-11',
    readTime: 7,
    image: 'https://images.unsplash.com/photo-1527236438218-d82077ae1f85?w=1400&q=85',
    featured: false,
    breaking: false,
    tags: ['santé mentale', 'créativité', 'artistes', 'témoignages'],
    views: 72300,
  },
  {
    id: 'a-020',
    slug: 'jeux-video-culture-legitimite',
    title: 'Les jeux vidéo ont enfin leur légitimité culturelle — et ça ne fait que commencer',
    excerpt: 'Du MoMA à la BNF, les institutions muséales intègrent le jeu vidéo. Mais à quel prix ?',
    category: 'lifestyle',
    author: 'Yann F.',
    authorImg: null,
    date: '2026-05-06',
    readTime: 6,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1400&q=85',
    featured: false,
    breaking: false,
    tags: ['jeux vidéo', 'culture', 'musée', 'légitimité'],
    views: 41500,
  },

];

/* ── Helpers ─────────────────────────────────────────── */

function getArticleById(id) {
  return ARTICLES.find(a => a.id === id) || null;
}

function getArticleBySlug(slug) {
  return ARTICLES.find(a => a.slug === slug) || null;
}

function getArticlesByCategory(cat, limit = 0) {
  const list = ARTICLES.filter(a => a.category === cat);
  return limit ? list.slice(0, limit) : list;
}

function getFeaturedArticles() {
  return ARTICLES.filter(a => a.featured);
}

function getBreakingArticles() {
  return ARTICLES.filter(a => a.breaking);
}

function getLatestArticles(limit = 10, excludeId = null) {
  return ARTICLES
    .filter(a => a.id !== excludeId)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
}

function getMostRead(limit = 5, excludeId = null) {
  return ARTICLES
    .filter(a => a.id !== excludeId)
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
}

function getRelatedArticles(article, limit = 3) {
  return ARTICLES
    .filter(a => a.id !== article.id && a.category === article.category)
    .slice(0, limit);
}

function getCategoryMeta(id) {
  return CATEGORIES.find(c => c.id === id) || { id, label: id, color: '#00F5FF' };
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatViews(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'k';
  return String(n);
}

function searchArticles(query) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return ARTICLES.filter(a =>
    a.title.toLowerCase().includes(q) ||
    a.excerpt.toLowerCase().includes(q) ||
    a.tags.some(t => t.includes(q)) ||
    a.category.includes(q)
  );
}
