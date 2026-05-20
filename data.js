/* ===========================================================
   ONE MEDIA — Données articles
   Charge les articles IA depuis /api/articles si disponibles,
   sinon utilise les articles statiques de secours.
   =========================================================== */

// Chargement dynamique des articles IA
(function loadAIArticles() {
  fetch('/api/articles')
    .then(r => r.ok ? r.json() : null)
    .then(data => {
      if (!data || !data.articles?.length) return;
      // Fusionne : articles IA en premier, statiques en complément
      const aiIds = new Set(data.articles.map(a => a.id));
      const staticFallback = ARTICLES.filter(a => !aiIds.has(a.id));
      ARTICLES.length = 0;
      ARTICLES.push(...data.articles, ...staticFallback);
      // Re-render si la page est déjà chargée
      if (document.readyState === 'complete') {
        window.dispatchEvent(new CustomEvent('articles-updated'));
      }
    })
    .catch(() => { /* Pas de serveur = articles statiques */ });
})();

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
    slug: 'abome-elephant-deces-cote-ivoire',
    title: 'Abomé l\'Éléphant nous a quittés : la Côte d\'Ivoire perd une voix qui ne s\'oublie pas',
    excerpt: 'Le rappeur ivoirien Anassin Boris Médard, dit Abomé l\'Éléphant, est décédé le 18 mai 2026 des suites d\'un malaise cardiaque au CHU de Treichville à Abidjan. Il avait 33 ans. Retour sur le parcours d\'un artiste qui a grandi entre Marcory et les studios de DJ Arafat, avant de s\'imposer seul.',
    category: 'musique',
    author: 'Rédaction ONE',
    authorImg: null,
    date: '2026-05-20',
    readTime: 5,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1400&q=85',
    featured: true,
    breaking: true,
    tags: ['abomé l\'éléphant', 'côte d\'ivoire', 'hommage', 'abidjan', 'rap ivoirien'],
    views: 142000,
  },
  {
    id: 'a-002',
    slug: 'didi-b-kiff-no-beat-universal-music',
    title: 'Didi B : de Kiff No Beat à Universal Music, l\'ascension tranquille d\'un géant du rap ivoirien',
    excerpt: 'Né le 3 avril 1992 dans le village artistique Ki-Yi d\'Abidjan, fils de pianiste et de chorégraphe, Bassa Zéréhoué Diyilem n\'avait pas le choix : la scène était son destin. Avec Kiff No Beat — premier groupe hip-hop africain signé par Universal Music en 2017 — puis en solo avec *Mojotrône II* et *Bazarhoff & Diyilem*, il est devenu une référence incontournable.',
    category: 'musique',
    author: 'Kofi A.',
    authorImg: null,
    date: '2026-05-19',
    readTime: 7,
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1400&q=85',
    featured: true,
    breaking: false,
    tags: ['didi b', 'kiff no beat', 'rap ivoirien', 'côte d\'ivoire', 'universal music'],
    views: 89400,
  },
  {
    id: 'a-003',
    slug: 'conakry-scene-culturelle-2026',
    title: 'Conakry debout : la renaissance culturelle qui fait vibrer toute l\'Afrique de l\'Ouest',
    excerpt: 'Musique, mode, art, gastronomie — Conakry n\'a jamais été aussi créative. Dans les rues de Kaloum et Kipé, une génération entière refuse d\'attendre. Azaya, Amaza, Djelykaba Bintou, AK4SEVEN : ces noms sonnent comme une promesse.',
    category: 'lifestyle',
    author: 'Marcus D.',
    authorImg: null,
    date: '2026-05-18',
    readTime: 9,
    image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1400&q=85',
    featured: true,
    breaking: false,
    tags: ['conakry', 'guinée', 'culture', 'renaissance', 'afrique de l\'ouest'],
    views: 67300,
  },

  /* ── BREAKING ─────────────────────────────────────── */
  {
    id: 'a-004',
    slug: 'himra-nouchi-hardcore-diamant',
    title: 'Himra, le gamin de Cocody qui a rendu le nouchi hardcore mondial',
    excerpt: 'Abdul Rahim Bakayoko, né le 28 mai 1998 à Cocody (Abidjan), a choisi le pseudo qui cache son vrai prénom réarrangé lettre par lettre. Son album *Jeune & Riche* — double platine puis disque de diamant en moins d\'un an — et son triple sacre aux African Talent Awards 2024 font de lui l\'artiste ivoirien le plus streamé de l\'histoire. Et il rappelle en nouchi, l\'argot d\'Abidjan, sans jamais s\'en excuser.',
    category: 'musique',
    author: 'Rédaction ONE',
    authorImg: null,
    date: '2026-05-20',
    readTime: 4,
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1400&q=85',
    featured: false,
    breaking: true,
    tags: ['himra', 'côte d\'ivoire', 'abidjan', 'nouchi', 'rap ivoirien', 'jeune & riche'],
    views: 118000,
  },

  /* ── MUSIQUE ──────────────────────────────────────── */
  {
    id: 'a-005',
    slug: 'trk-golden-boy-rap-ivoirien',
    title: 'TRK : le "Golden Boy" d\'Abidjan qui cartonne sur Apple Music Côte d\'Ivoire',
    excerpt: 'Il domine les charts d\'Apple Music Côte d\'Ivoire depuis des mois, accumule des millions de streams à chaque nouvelle sortie, et son titre *Name* tourne en boucle des quartiers de Yopougon aux clubs de Cocody. TRK, le rappeur ivoirien qu\'on ne peut plus ignorer, est en train d\'écrire son propre chapitre dans l\'histoire du Babi Tape.',
    category: 'musique',
    author: 'Amadou S.',
    authorImg: null,
    date: '2026-05-17',
    readTime: 6,
    image: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=1400&q=85',
    featured: false,
    breaking: false,
    tags: ['trk', 'rap ivoirien', 'côte d\'ivoire', 'abidjan', 'apple music'],
    views: 44100,
  },
  {
    id: 'a-006',
    slug: 'rap-ivoirien-generation-2026',
    title: 'Rap ivoirien 2026 : Didi B, Himra, TRK — la scène d\'Abidjan qui ne demande plus la permission',
    excerpt: 'Didi B le bâtisseur, Himra le phénomène nouchi, TRK le Golden Boy — la Côte d\'Ivoire a construit en silence l\'une des scènes rap les plus solides du continent. Et ce n\'est pas un hasard si c\'est Abidjan qui donne le tempo à toute l\'Afrique francophone aujourd\'hui.',
    category: 'musique',
    author: 'Fatou N.',
    authorImg: null,
    date: '2026-05-16',
    readTime: 8,
    image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=1400&q=85',
    featured: false,
    breaking: false,
    tags: ['rap ivoirien', 'abidjan', 'côte d\'ivoire', 'didi b', 'hip-hop africain'],
    views: 56800,
  },
  {
    id: 'a-007',
    slug: 'afrobeats-guinee-influence-mondiale',
    title: 'L\'Afrobeats made in Guinée : ces sons de Conakry qui font danser Paris et New York',
    excerpt: 'Sous les radars des grandes plateformes, des producteurs guinéens façonnent discrètement le son de l\'Afrique de l\'Ouest. Rencontre avec les architectes invisibles du groove.',
    category: 'musique',
    author: 'Marcus D.',
    authorImg: null,
    date: '2026-05-14',
    readTime: 7,
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1400&q=85',
    featured: false,
    breaking: false,
    tags: ['afrobeats', 'guinée', 'producteurs', 'conakry', 'world music'],
    views: 38200,
  },
  {
    id: 'a-008',
    slug: 'syli-stars-heritage-guineen',
    title: 'Les Amazones de Guinée, Balla et ses Balladins : le patrimoine musical guinéen mérite mieux',
    excerpt: 'Pendant que l\'Afrique du Sud et le Nigeria ont leurs musées du son, le patrimoine musical guinéen — l\'un des plus riches du continent — reste mal archivé. Il est temps de changer ça.',
    category: 'musique',
    author: 'Kofi A.',
    authorImg: null,
    date: '2026-05-12',
    readTime: 9,
    image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=1400&q=85',
    featured: false,
    breaking: false,
    tags: ['guinée', 'patrimoine', 'amazones', 'balla', 'musique traditionnelle'],
    views: 29700,
  },

  /* ── ARTISTES GUINÉENS ────────────────────────────── */
  {
    id: 'a-021',
    slug: 'azaya-messi-musique-guineenne-paris',
    title: 'Azaya : le "Messi de la musique guinéenne" conquiert Paris et l\'Afrique',
    excerpt: 'Né le 10 octobre 1989 à Kankan, Mamady Kamissoko — alias Azaya — a grandi avec les cordes d\'une basse entre les mains, apprenti dès ses débuts chez les Requins de Balakala. Aujourd\'hui, son afro-mandingue mélange traditions peules et mandingues, zouk et afrobeats. En 2022, il est sacré Meilleur Artiste d\'Afrique de l\'Ouest au PRIMUD. En 2025, il devient le premier artiste guinéen à remplir une grande salle à Paris. La Guinée a son ambassadeur mondial.',
    category: 'musique',
    author: 'Marcus D.',
    authorImg: null,
    date: '2026-05-19',
    readTime: 6,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1400&q=85',
    featured: false,
    breaking: false,
    tags: ['azaya', 'guinée', 'conakry', 'afro-mandingue', 'primud', 'paris'],
    views: 58300,
  },
  {
    id: 'a-022',
    slug: 'djelykaba-bintou-retrait-choc-guinee',
    title: 'Djelykaba Bintou claque la porte : l\'annonce choc qui a brisé la scène guinéenne',
    excerpt: 'Le 27 avril 2026, Djélykaba Bintou Kouyaté — née le 23 mars 1993 à Fria, fille du griot Djelykaba Kouyaté, sacrée Meilleure Artiste d\'Afrique de l\'Ouest au PRIMUD 2025 — publie un message qui secoue tout son pays. "Les attaques, les pièges, tout cela devient trop lourd à porter." Elle annonce son retrait de la musique. Le post sera supprimé quelques heures plus tard, mais la question reste entière : la plus grande voix féminine de Guinée est-elle vraiment partie ?',
    category: 'musique',
    author: 'Fatou N.',
    authorImg: null,
    date: '2026-05-18',
    readTime: 5,
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1400&q=85',
    featured: false,
    breaking: true,
    tags: ['djelykaba bintou', 'guinée', 'primud', 'retrait', 'musique guinéenne'],
    views: 93700,
  },
  {
    id: 'a-023',
    slug: 'amaza-gout-melange-conakry-star',
    title: 'Amaza : l\'enfant de Conakry qui a rendu le goût mélangé universel',
    excerpt: 'Amadou Mouctar Kaba est né le 12 juin 1992 dans une ruelle de Conakry. Inspiré par le reggaeman Takana à 17 ans, il s\'est mis à écrire des textes qui mélangent afrobeat, reggae et pop avec une sincérité désarmante. Son hit *Le Goût est Mélangé* a trôné en tête des charts guinéens pendant des mois. Son duo Amatala avec Talala est aujourd\'hui dissous, mais Amaza solo continue de porter haut les couleurs de la musique guinéenne populaire.',
    category: 'musique',
    author: 'Aminata C.',
    authorImg: null,
    date: '2026-05-16',
    readTime: 5,
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1400&q=85',
    featured: false,
    breaking: false,
    tags: ['amaza', 'guinée', 'conakry', 'afrobeat', 'amatala', 'le goût est mélangé'],
    views: 47200,
  },
  {
    id: 'a-024',
    slug: 'ak4seven-guineen-label-gims-france',
    title: 'AK4SEVEN : le rappeur de Kamsar qui a signé chez Gims et ouvre la voie aux artistes guinéens',
    excerpt: 'Mohamed Alpha Keita est né en 1998 à Kamsar, en Guinée maritime. En 2018, bac en maths en poche, il pose ses valises en France et commence à construire sa musique dans l\'ombre. Ses freestyles de la série *Alpha Beth* attirent l\'attention de RFI en 2021. Puis vient l\'annonce qui change tout : il signe chez Géant Rouge, le label de Maître Gims — premier artiste de la nouvelle génération guinéenne à franchir ce cap. Un symbole pour toute une scène.',
    category: 'musique',
    author: 'Kofi A.',
    authorImg: null,
    date: '2026-05-15',
    readTime: 5,
    image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=1400&q=85',
    featured: false,
    breaking: false,
    tags: ['ak4seven', 'guinée', 'kamsar', 'gims', 'rap guinéen', 'france'],
    views: 36800,
  },

  /* ── CINÉMA ───────────────────────────────────────── */
  {
    id: 'a-009',
    slug: 'cinema-guineen-renaissance-conakry',
    title: 'Le cinéma guinéen se réveille : ces films tournés à Conakry qui font le tour des festivals',
    excerpt: 'Après des décennies d\'absence sur la scène internationale, une nouvelle génération de cinéastes guinéens revient avec des œuvres puissantes. Cannes, Berlin, Toronto — ils arrivent.',
    category: 'cinema',
    author: 'Léa M.',
    authorImg: null,
    date: '2026-05-17',
    readTime: 7,
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1400&q=85',
    featured: false,
    breaking: false,
    tags: ['cinéma guinéen', 'conakry', 'festival', 'réalisateurs', 'afrique'],
    views: 34500,
  },
  {
    id: 'a-010',
    slug: 'nollywood-afrique-ouest-collaboration',
    title: 'Nollywood rencontre l\'Afrique de l\'Ouest francophone : une alliance cinématographique historique',
    excerpt: 'Les productions nigérianes et les cinéastes francophones d\'Afrique de l\'Ouest commencent à collaborer. Ce que ça change pour le cinéma africain dans son ensemble.',
    category: 'cinema',
    author: 'Kofi A.',
    authorImg: null,
    date: '2026-05-13',
    readTime: 8,
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1400&q=85',
    featured: false,
    breaking: false,
    tags: ['nollywood', 'cinéma africain', 'collaboration', 'francophone', 'nigeria'],
    views: 51200,
  },
  {
    id: 'a-011',
    slug: 'cannes-2026-afrique-au-sommet',
    title: 'Cannes 2026 : l\'Afrique n\'est plus un invité — elle prend la place qui lui revient',
    excerpt: 'Trois films africains en compétition officielle, une Quinzaine portée par des voix du continent. Analyse d\'un tournant historique pour le cinéma mondial.',
    category: 'cinema',
    author: 'Fatou N.',
    authorImg: null,
    date: '2026-05-10',
    readTime: 6,
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1400&q=85',
    featured: false,
    breaking: false,
    tags: ['cannes', 'afrique', 'cinéma', 'festival', 'palme d\'or'],
    views: 62100,
  },

  /* ── MODE ─────────────────────────────────────────── */
  {
    id: 'a-012',
    slug: 'createurs-mode-conakry-emergence',
    title: 'Les créateurs de mode de Conakry qui font craquer Paris',
    excerpt: 'Tissus Bazin brodés, coupe afro-minimaliste, couleurs saturées — de jeunes designers guinéens imposent une esthétique qui mélange tradition et modernité avec un talent rare.',
    category: 'mode',
    author: 'Awa D.',
    authorImg: null,
    date: '2026-05-18',
    readTime: 6,
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1400&q=85',
    featured: false,
    breaking: false,
    tags: ['mode guinéenne', 'conakry', 'designers', 'bazin', 'afrique'],
    views: 41800,
  },
  {
    id: 'a-013',
    slug: 'mode-africaine-streetwear-global',
    title: 'Streetwear africain vs grandes maisons : la guerre de l\'influence a commencé',
    excerpt: 'Quand Off-White et Balenciaga s\'inspirent des marchés de Lagos ou des sapeurs de Kinshasa, qui gagne vraiment ? Le débat qui déchire le monde de la mode.',
    category: 'mode',
    author: 'Inès K.',
    authorImg: null,
    date: '2026-05-15',
    readTime: 5,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=85',
    featured: false,
    breaking: false,
    tags: ['streetwear', 'afrique', 'mode', 'influence', 'tendances'],
    views: 37600,
  },
  {
    id: 'a-014',
    slug: 'fashion-week-abidjan-emergence',
    title: 'La Fashion Week d\'Abidjan est devenue le rendez-vous mode qu\'on ne peut plus ignorer',
    excerpt: 'Des acheteurs de Milan, des rédactrices de Vogue, des influenceurs de Lagos. La capitale ivoirienne s\'est imposée comme hub mode de l\'Afrique subsaharienne.',
    category: 'mode',
    author: 'Chloé B.',
    authorImg: null,
    date: '2026-05-11',
    readTime: 5,
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1400&q=85',
    featured: false,
    breaking: false,
    tags: ['abidjan', 'fashion week', 'mode africaine', 'côte d\'ivoire'],
    views: 28900,
  },

  /* ── ART ──────────────────────────────────────────── */
  {
    id: 'a-015',
    slug: 'art-urbain-conakry-murs-parlent',
    title: 'Les murs de Conakry parlent : le street art comme résistance et identité',
    excerpt: 'À Matam, Hamdallaye, Dixinn — des artistes guinéens transforment les murs de leur ville en galerie politique et culturelle. Une œuvre collective qui ne demande pas la permission.',
    category: 'art',
    author: 'Aminata C.',
    authorImg: null,
    date: '2026-05-16',
    readTime: 6,
    image: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=1400&q=85',
    featured: false,
    breaking: false,
    tags: ['street art', 'conakry', 'guinée', 'art urbain', 'identité'],
    views: 33400,
  },
  {
    id: 'a-016',
    slug: 'artistes-contemporains-guinee-diaspora',
    title: 'Ces artistes guinéens de la diaspora qui s\'exposent à Paris, Londres et New York',
    excerpt: 'Nés à Conakry, formés en Europe — ils naviguent entre deux mondes et produisent une œuvre qui n\'appartient qu\'à eux. Portrait de la création guinéenne en exil.',
    category: 'art',
    author: 'Yann F.',
    authorImg: null,
    date: '2026-05-13',
    readTime: 8,
    image: 'https://images.unsplash.com/photo-1578926375605-eaf7559b1458?w=1400&q=85',
    featured: false,
    breaking: false,
    tags: ['art guinéen', 'diaspora', 'exposition', 'paris', 'identité'],
    views: 27800,
  },
  {
    id: 'a-017',
    slug: 'street-art-abidjan-mouvement',
    title: 'Abidjan Street Art : la révolution silencieuse des murs ivoiriens',
    excerpt: 'À Cocody, Adjamé, Yopougon — une nouvelle génération de muralistes transforme la ville en galerie à ciel ouvert. Et ça commence à attirer l\'attention internationale.',
    category: 'art',
    author: 'Marcus D.',
    authorImg: null,
    date: '2026-05-09',
    readTime: 6,
    image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=1400&q=85',
    featured: false,
    breaking: false,
    tags: ['street art', 'abidjan', 'côte d\'ivoire', 'art urbain'],
    views: 24600,
  },

  /* ── LIFESTYLE ────────────────────────────────────── */
  {
    id: 'a-018',
    slug: 'conakry-nuit-clubs-culture',
    title: 'Conakry by night : l\'autre visage d\'une capitale qui ne dort plus',
    excerpt: 'Les clubs de Kipé, les restaurants de Kaloum, les after de Ratoma — Conakry a construit une vie nocturne qui n\'a rien à envier aux autres capitales africaines. On y était.',
    category: 'lifestyle',
    author: 'Sophie L.',
    authorImg: null,
    date: '2026-05-17',
    readTime: 7,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=85',
    featured: false,
    breaking: false,
    tags: ['conakry', 'nightlife', 'guinée', 'sortie', 'vie nocturne'],
    views: 52400,
  },
  {
    id: 'a-019',
    slug: 'cuisine-guinee-gastronomie-monde',
    title: 'Le fouti, le tiga dégué, la sauce feuilles : la cuisine guinéenne mérite sa place sur la carte du monde',
    excerpt: 'Alors que la cuisine sénégalaise et ivoirienne conquiert Paris, les saveurs guinéennes restent encore méconnues. Des chefs de Conakry et de la diaspora veulent changer ça.',
    category: 'lifestyle',
    author: 'Fatou N.',
    authorImg: null,
    date: '2026-05-14',
    readTime: 6,
    image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1400&q=85',
    featured: false,
    breaking: false,
    tags: ['cuisine guinéenne', 'gastronomie', 'conakry', 'diaspora', 'food'],
    views: 39800,
  },
  {
    id: 'a-020',
    slug: 'jeunesse-africaine-entrepreneuriat-culture',
    title: 'La jeunesse africaine n\'attend plus : elle crée, elle entreprend, elle impose',
    excerpt: 'De Dakar à Conakry, d\'Abidjan à Douala — une génération de créatifs africains refuse les schémas établis et bâtit son propre monde. Rencontres avec ceux qui font le futur maintenant.',
    category: 'lifestyle',
    author: 'Kofi A.',
    authorImg: null,
    date: '2026-05-11',
    readTime: 8,
    image: 'https://images.unsplash.com/photo-1527236438218-d82077ae1f85?w=1400&q=85',
    featured: false,
    breaking: false,
    tags: ['jeunesse africaine', 'entrepreneuriat', 'créativité', 'afrique', 'futur'],
    views: 61700,
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
