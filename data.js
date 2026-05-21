/* ===========================================================
   ONE MEDIA — Données articles
   Charge les articles IA depuis /api/articles si disponibles,
   sinon utilise les articles statiques de secours.
   =========================================================== */

// Chargement dynamique des articles IA
const API_BASE = window.location.hostname === 'localhost'
  ? ''
  : 'https://one-media-production.up.railway.app';

(function loadAIArticles() {
  fetch(`${API_BASE}/api/articles`)
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
  { id: 'musique',   label: 'Musique',    color: '#00F5FF' },
  { id: 'cinema',    label: 'Cinéma',     color: '#FF2D55' },
  { id: 'mode',      label: 'Mode',       color: '#FFE500' },
  { id: 'art',       label: 'Art',        color: '#BF5AF2' },
  { id: 'lifestyle', label: 'Lifestyle',  color: '#30D158' },
  { id: 'interview', label: 'Interviews', color: '#FF9500' },
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
    image: 'https://www.7info.ci/wp-content/uploads/2026/05/abome-lelephant-670x360.jpg',
    featured: true,
    breaking: true,
    tags: ['abomé l\'éléphant', 'côte d\'ivoire', 'hommage', 'abidjan', 'rap ivoirien'],
    views: 142000,
    body: `
      <h2>De Marcory aux sommets du rap ivoirien</h2>
      <p>Anassin Boris Médard est né le 22 juin 1992 dans le quartier populaire de Marcory, à Abidjan. Fils d'un père passionné de musique — détenteur du groupe TP Audiorama — il grandit entouré de sons. La scène n'est pas un choix pour lui, c'est une évidence. À 18 ans, il intègre le groupe Fiesta Parade dont il deviendra le leader vocal pendant sept ans, de 2010 à 2017.</p>
      <p>C'est dans ce creuset qu'il forge son style : une voix puissante, un sens inné de la mélodie, une capacité à fusionner le rap, l'afrobeat et le coupé-décalé avec une aisance déconcertante. Quand Fiesta Parade se sépare, Abomé l'Éléphant ne perd pas une seconde. En 2016, il rejoint Yôrô Gang Production, le label fondé par DJ Arafat, le roi incontesté du coupé-décalé ivoirien.</p>
      <blockquote>« Il avait cette façon de chanter qui te touchait directement au ventre. Pas besoin de comprendre les paroles — tu ressentais. »<br><em>— Un proche de l'artiste</em></blockquote>
      <h2>L'envol solo : "Côcô" et la CAN</h2>
      <p>En 2020, il quitte Yôrô Gang pour voler de ses propres ailes. La décision est risquée, mais elle paie. Son titre <em>Côcô</em> explose sur YouTube avec plus de 5,3 millions de vues. Puis vient le coup de maître : <em>La CAN c'est chez nous</em>, en featuring avec les légendes Yodé & Siro. Le clip dépasse les 16 millions de vues, un record pour un artiste de sa génération. La même année, il est sacré Meilleure Révélation Afro Rap/Rap-Ivoir. En 2021, il décroche le titre de Meilleur Rappeur Masculin.</p>
      <h2>Une mort qui laisse la Côte d'Ivoire sans voix</h2>
      <p>Le 18 mai 2026, à 33 ans, Abomé l'Éléphant est victime d'un malaise cardiaque. Transporté d'urgence au CHU de Treichville à Abidjan, il n'en reviendra pas. La nouvelle se répand en quelques minutes sur les réseaux sociaux. Des milliers de fans envahissent les commentaires. Artistes, producteurs, journalistes — toute la scène musicale ivoirienne s'arrête. Il laisse derrière lui une famille, une discographie inachevée, et un pays en deuil.</p>
    `,
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
    image: 'https://cdn-images.dzcdn.net/images/artist/7ff0f0c21c16e60194e48395a79347e4/500x500-000000-80-0-0.jpg',
    featured: true,
    breaking: false,
    tags: ['didi b', 'kiff no beat', 'rap ivoirien', 'côte d\'ivoire', 'universal music'],
    views: 89400,
    body: `
      <h2>Né dans un village d'artistes</h2>
      <p>Bassa Zéréhoué Diyilem voit le jour le 3 avril 1992 dans le village artistique Ki-Yi d'Abidjan, fondé par l'écrivaine camerounaise Werewere Liking. Son père est pianiste et arrangeur, sa mère chorégraphe et danseuse. À 3 ans, il apparaît déjà dans le clip <em>Death Society</em> de Meiway. Le destin est écrit. En 2009, avec ses cousins, il crée Kiff No Beat — un groupe qui va changer l'histoire du hip-hop africain.</p>
      <h2>Universal Music, la consécration continentale</h2>
      <p>En 2017, Kiff No Beat devient le premier groupe hip-hop africain signé par Universal Music. Un tournant historique. Mais Didi B ne s'arrête pas là. En 2022, il sort son premier album solo <em>Mojotrône II: History</em> — plus de 50 millions de streams, 5 000 CD certifiés, prix du Meilleur Artiste Francophone aux PRIMUD et prix de la Chanson de l'Année aux AFRIMA à Dakar. Son album <em>History</em> devient disque de diamant, une première absolue dans l'histoire de la musique ivoirienne.</p>
      <blockquote>« Didi B a réussi quelque chose de rare : être populaire dans la rue et respecté par la critique. Les deux en même temps. »<br><em>— Pan-African Music</em></blockquote>
      <h2>2025-2026 : le Zénith et l'éternité</h2>
      <p>En 2025, <em>Bazarhoff & Diyilem</em>, son deuxième album solo, est certifié disque de platine en moins de cinq mois. Il enchaîne avec un concert historique au Parc des Expositions d'Abidjan — une première pour un rappeur ivoirien. Puis vient l'annonce qui électrise toute la diaspora : un concert au Zénith de Paris, le 19 avril 2026. La salle se remplit en quelques heures. Didi B n'est plus seulement le meilleur rappeur ivoirien. Il est devenu une institution.</p>
    `,
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
    image: 'https://cdn-images.dzcdn.net/images/artist/a00bc6dcc86b10c1b03aa2372ab71a30/500x500-000000-80-0-0.jpg',
    featured: false,
    breaking: true,
    tags: ['himra', 'côte d\'ivoire', 'abidjan', 'nouchi', 'rap ivoirien', 'jeune & riche'],
    views: 118000,
    body: `
      <h2>Le nom caché dans le prénom</h2>
      <p>Abdul Rahim Bakayoko naît le 28 mai 1998 à Cocody, l'un des quartiers les plus animés d'Abidjan. Son pseudo, Himra, n'est pas choisi au hasard : ce sont exactement les mêmes lettres que "Rahim", réarrangées. Un jeu d'identité qui dit beaucoup sur cet artiste — tout est dans les détails, dans ce qui se cache sous la surface. Très jeune, il forme le groupe SBS avec des amis d'école et commence à plonger dans l'univers du hip-hop ivoirien, du coupé-décalé et des classiques américains.</p>
      <h2>Le nouchi hardcore comme langue maternelle</h2>
      <p>Ce qui distingue Himra de ses contemporains, c'est un choix radical : rapper exclusivement en nouchi, l'argot populaire des rues d'Abidjan. Pas pour faire "authentique", mais parce que c'est vraiment sa langue. Il appelle son style "nouchi hardcore" — et ça colle parfaitement. Des textes bruts, une énergie explosive, un flow qui s'adapte aux rythmes urbains tout en restant ancré dans le quotidien ivoirien.</p>
      <blockquote>« Je rappe pour ceux qui vivent dans la rue, qui comprennent le nouchi, qui n'ont pas besoin de traduction pour ressentir ce que je dis. »<br><em>— Himra</em></blockquote>
      <h2>Disque de diamant et records historiques</h2>
      <p>En 2024, il sort l'album <em>Jeune & Riche</em>. Le succès est immédiat et phénoménal. L'album est certifié double disque de platine en Côte d'Ivoire, puis disque de diamant — une première absolue — moins d'un an après sa sortie. Aux African Talent Awards 2024, il est sacré triple lauréat : Meilleur Album Francophone, Meilleur Artiste Francophone, et le prestigieux Black Trophy. Les plateformes confirment ce que les fans savent depuis longtemps : Himra est officiellement l'artiste ivoirien le plus streamé de l'histoire, toutes plateformes confondues.</p>
    `,
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
    image: 'https://cdn-images.dzcdn.net/images/artist/d3b9fc41bcaa5456830567d10d649251/500x500-000000-80-0-0.jpg',
    featured: false,
    breaking: false,
    tags: ['trk', 'rap ivoirien', 'côte d\'ivoire', 'abidjan', 'apple music'],
    views: 44100,
    body: `
      <h2>Le Golden Boy qui fait tourner les charts</h2>
      <p>Dans le rap ivoirien, les générations se succèdent vite. TRK fait partie de ceux qui n'ont pas attendu qu'on leur ouvre une porte — ils l'ont enfoncée. Pendant plusieurs mois consécutifs, il a dominé le top Apple Music Côte d'Ivoire, cumulant des millions de streams et de vues à chaque nouvelle sortie. Dans les quartiers de Yopougon comme dans les clubs de Cocody, son titre <em>Name</em> tourne en boucle.</p>
      <h2>Babi Tape et l'identité abidjanaise</h2>
      <p>TRK assume pleinement son ADN abidjanais. Son EP <em>BABI TAPE Vol. 1</em>, sorti en 2025, est une déclaration d'amour à Abidjan — "Babi" dans le langage de la rue. Le projet mélange trap, afrobeats et rap ivoirien avec une cohérence remarquable pour un artiste de sa génération. Il ne cherche pas à copier Lagos ou Atlanta. Il cherche à sonner comme Abidjan, et il y réussit.</p>
      <blockquote>« TRK a compris quelque chose que beaucoup ratent : l'authenticité locale, c'est ce qui te rend universel. »<br><em>— Canal+ Afrique</em></blockquote>
      <h2>La prochaine génération est déjà là</h2>
      <p>Après Didi B et Himra, beaucoup pensaient que le rap ivoirien avait trouvé son équilibre. TRK prouve que la scène ne s'arrête pas. Chaque sortie est un événement, chaque stream un bulletin de vote. Le rap ivoirien n'a pas de plafond — et TRK est peut-être celui qui s'en approche le plus vite.</p>
    `,
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
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1400&q=85',
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
    image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1400&q=85',
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
    image: 'https://cdn-images.dzcdn.net/images/artist/b269f39903a403507769f9aae9ecfe22/500x500-000000-80-0-0.jpg',
    featured: false,
    breaking: false,
    tags: ['azaya', 'guinée', 'conakry', 'afro-mandingue', 'primud', 'paris'],
    views: 58300,
    body: `
      <h2>Un gamin de Kankan avec une basse entre les mains</h2>
      <p>Mamady Kamissoko naît le 10 octobre 1989 à Kankan, ville de l'intérieur de la Guinée réputée pour sa culture mandingue. Dès ses premières années, il est immergé dans la musique : à peine adolescent, il apprend la basse auprès de Les Requins de Balakala, l'ensemble fondé par son grand-oncle Balakala Kouyaté. Ce n'est pas un loisir — c'est une école de vie. Il joue avec des musiciens chevronnés, développe son oreille, forge sa sensibilité musicale dans la tradition.</p>
      <p>En 2006, il rejoint Conakry pour ses études universitaires. Pendant trois ans, il est à la fois étudiant et musicien professionnel, jouant comme bassiste pour les orchestres de Yahoumba Sékou, Saydou Sow et la légende Sékouba Kandia Kouyaté. Cette période forge définitivement son identité artistique : une fusion entre les traditions peules et mandingues, le zouk, l'afrobeat et la pop contemporaine — ce qu'il appelle lui-même l'afro-mandingue.</p>
      <h2>Le "Messi de la musique guinéenne"</h2>
      <p>Le 1er décembre 2012, il sort son maxi-single <em>My Love</em> sous le nom Azaya. La réception critique est excellente. En 2013, il crée sa propre structure, Musik 100 Frontières, dont il prend la tête. Les surnoms s'accumulent : "le Messi de la musique guinéenne", "la gueule musicale bénie", "la nouvelle révélation de la romance mandingue". Pas des mots en l'air — en 2022, le PRIMUD (Prix International de la Musique Urbaine et du Coupé-Décalé) le sacre Meilleur Artiste d'Afrique de l'Ouest, une reconnaissance panafricaine de son talent.</p>
      <blockquote>« Azaya a réussi à faire quelque chose d'extraordinaire : prendre les racines profondes de la musique guinéenne et les faire vibrer partout en Afrique. »<br><em>— Africa Guinée</em></blockquote>
      <h2>Paris, une page historique de la musique guinéenne</h2>
      <p>En décembre 2025, Azaya devient le premier artiste guinéen à remplir une grande salle à Paris. Un soir historique que Le Djely qualifie d'<em>"une page historique de la musique guinéenne"</em>. La diaspora guinéenne de France est venue en masse. Sur scène avec lui, sa femme et complice artistique Djelykaba Bintou. Une soirée qui restera gravée dans les mémoires.</p>
    `,
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
    image: 'https://cdn-images.dzcdn.net/images/artist/2a6dc9e77004bb1a216c1cd9df2cb135/500x500-000000-80-0-0.jpg',
    featured: false,
    breaking: true,
    tags: ['djelykaba bintou', 'guinée', 'primud', 'retrait', 'musique guinéenne'],
    views: 93700,
    body: `
      <h2>Fille de griot, destinée à chanter</h2>
      <p>Djélykaba Bintou Kouyaté naît le 23 mars 1993 à Fria, une ville industrielle au nord de Conakry. Elle est la fille du célèbre griot Djelykaba Kouyaté — dans la tradition mandingue, les griots sont les gardiens de la mémoire, les voix de l'histoire. Grandir dans cette famille, c'est grandir avec la musique comme langue première. Elle obtient plus tard un diplôme en commerce international, mais la scène reste son vrai territoire.</p>
      <p>C'est par le biais de son mari, Mamady Kamissoko alias Azaya, qu'elle est formellement lancée sur scène. Signée sous le label Musik 100 Frontières, elle sort son premier album <em>M'ma affaire Mara</em>, puis <em>Love Story</em> en 2019. Sa voix, qui navigue entre tradition griotte, zouk et afrobeats, s'impose immédiatement. En 2021, les All Africa Awards lui décernent deux prix : Révélation Africaine de l'Année et Meilleure Artiste Féminine d'Afrique de l'Ouest.</p>
      <h2>PRIMUD 2025 : la reine de l'Afrique de l'Ouest</h2>
      <p>En octobre 2025, à Abidjan, Djélykaba Bintou est sacrée Meilleure Artiste d'Afrique de l'Ouest au PRIMUD — le prix le plus prestigieux de la musique urbaine africaine. Une consécration absolue. Elle entre dans l'histoire comme la première Guinéenne à décrocher ce titre deux fois dans les mêmes années. La presse guinéenne et internationale salue unanimement.</p>
      <blockquote>« Les attaques, les pièges, tout cela devient trop lourd à porter. Je refuse de continuer dans un environnement où la dignité n'a plus sa place. »<br><em>— Djelykaba Bintou, Facebook, 27 avril 2026</em></blockquote>
      <h2>L'annonce choc d'avril 2026</h2>
      <p>Le 27 avril 2026, quelques mois seulement après son triomphe, Djélykaba Bintou publie un message qui paralyse la scène musicale guinéenne. Elle annonce son retrait définitif de la musique, évoquant des "attaques, des pièges" et un environnement "devenu insoutenable". Le post sera supprimé quelques heures plus tard, sans explication. Des millions de fans retiennent leur souffle. Est-elle vraiment partie ? L'histoire n'est peut-être pas terminée.</p>
    `,
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
    image: 'https://images.seneweb.com/dynamic/modules/news/images/gen/fb//da06621a686d4eee1ce1fc38e8018a3814e9f7b3.jpg',
    featured: false,
    breaking: false,
    tags: ['amaza', 'guinée', 'conakry', 'afrobeat', 'amatala', 'le goût est mélangé'],
    views: 47200,
    body: `
      <h2>Un enfant de Conakry inspiré par Takana</h2>
      <p>Amadou Mouctar Kaba naît le 12 juin 1992 dans l'un des quartiers populaires de Conakry. Autour de lui : le théâtre, la percussion, la danse et la musique — les arts font partie du décor quotidien. Le déclic vient en 2009, lors d'un concert de Takana, la grande figure du reggae guinéen. Ce soir-là, quelque chose se réveille. Amadou commence à écrire, à composer, à chercher son propre son — un mélange d'afrobeat, de reggae et de pop qui porte les couleurs de Conakry sans jamais les singer.</p>
      <h2>Amatala, le duo qui a electrisé la Guinée</h2>
      <p>Avec Mohamed Camara dit Talala, il forme le duo Amatala. Leur premier titre <em>Ana Yolo Yala</em>, sorti en 2019, marque les esprits. Mais c'est <em>Le Goût est Mélangé</em> qui explose tout. Le titre trône en tête des charts guinéens pendant plusieurs mois consécutifs et dépasse les 4 millions de vues sur YouTube. La presse africaine salue "le chanteur guinéen adoubé par la presse africaine". Il devient l'artiste le plus streamé de Guinée.</p>
      <blockquote>« Le goût est mélangé — c'est ça la vie à Conakry. Du sucré, du salé, du piquant. Tout en même temps. »<br><em>— Amaza</em></blockquote>
      <h2>La rupture Amatala et la suite en solo</h2>
      <p>En mai 2026, la nouvelle tombe : le divorce est acté entre Amaza et Talala. Le duo Amatala, qui avait porté deux générations de Guinéens, n'existe plus. "Repose en paix Amatala", titrent les médias. Mais Amaza solo continue — Meilleur Album et Meilleure Musique Urbaine 2024, concerts mémorables, une carrière qui s'écrit désormais seule, avec la même générosité et la même ferveur populaire.</p>
    `,
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
    image: 'https://cdn-images.dzcdn.net/images/artist/604dccdd4ef71094d4a3cc8a5764b161/500x500-000000-80-0-0.jpg',
    featured: false,
    breaking: false,
    tags: ['ak4seven', 'guinée', 'kamsar', 'gims', 'rap guinéen', 'france'],
    views: 36800,
    body: `
      <h2>De Kamsar à Paris : le chemin d'un pionnier</h2>
      <p>Mohamed Alpha Keita naît en 1998 à Kamsar, une ville portuaire de l'ouest de la Guinée, connue pour ses mines de bauxite. Rien ne prédestine particulièrement ce gamin à devenir rappeur — sinon une oreille fine, une soif d'expression et un bac en mathématiques décroché avec brio. En 2018, il pose ses valises en France. Il a 20 ans. Il n'a pas encore de label, pas encore de manager. Juste sa musique.</p>
      <h2>Alpha Beth et la reconnaissance</h2>
      <p>Il construit sa carrière brique par brique. En août 2019, son premier clip <em>Sauce on the Beat</em> sort. Puis <em>Scred</em>. Mais c'est avec sa série de freestyles <em>Alpha Beth</em> que tout bascule. En août 2021, <em>Alpha Beth 2</em> intègre le hit-parade de RFI — une consécration pour tout artiste africain francophone. La presse guinéenne de Conakry à la diaspora commence à parler de lui. Le nom AK4SEVEN s'installe.</p>
      <blockquote>« Je voulais prouver qu'un artiste de Kamsar pouvait exister à l'international. Pas juste exister — s'imposer. »<br><em>— AK4SEVEN</em></blockquote>
      <h2>Géant Rouge : la signature historique</h2>
      <p>L'annonce fait l'effet d'une bombe dans la communauté guinéenne : AK4SEVEN signe chez Géant Rouge, le label de Maître Gims, l'un des artistes les plus écoutés de France. Il devient ainsi le premier rappeur de la nouvelle génération guinéenne à franchir ce cap avec un label français majeur. En avril 2023, il est en première partie du concert de Gims à Conakry devant des milliers de fans. Un symbole fort pour toute une scène qui attendait ce moment depuis longtemps.</p>
    `,
  },

  {
    id: 'a-025',
    slug: 'straiker-poullosophie-rap-guineen-pita',
    title: 'Straiker : le fils de Pita qui a donné une âme philosophique au rap guinéen',
    excerpt: 'Ibrahima Sory Bah, né en 1998 à Pita, fils d\'un journaliste de radio rurale et d\'une enseignante, a troqué les études de lettres pour devenir l\'une des voix les plus singulières du rap guinéen. Son album "Poullosophie" et ses Victoires de la Musique Guinéenne en font un pilier de la nouvelle vague.',
    category: 'musique',
    author: 'Amadou S.',
    authorImg: null,
    date: '2026-05-21',
    readTime: 5,
    image: 'https://cdn-images.dzcdn.net/images/artist/aa7ffbc5507204c67b602b77fd53e8cb/500x500-000000-80-0-0.jpg',
    featured: false,
    breaking: false,
    tags: ['straiker', 'guinée', 'pita', 'rap guinéen', 'poullosophie', 'hip-hop'],
    views: 31400,
    body: `
      <h2>Le fils du journaliste de radio qui a choisi les rimes</h2>
      <p>Ibrahima Sory Bah naît en 1998 à Pita, ville de Moyenne Guinée nichée dans le Fouta-Djallon. Son père, Thierno Maadjou Bah, était journaliste à la radio rurale de Labé. Sa mère, Aissatou Diallo, enseignante. Dans une fratrie de dix enfants, Ibrahima est le benjamin. Il grandit dans un foyer où la parole compte — et où on écoute. L'influence paternelle, même si elle passe par les ondes radiophoniques et non le rap, forge chez lui un rapport particulier au langage et au récit.</p>
      <p>En 2018, alors qu'il est étudiant en lettres modernes à l'Université Général Lansana Conté de Sonfonia à Conakry, il commence à rapper. Il obtient sa licence en 2019, mais la musique a déjà pris le dessus. Son premier single marque le début d'une trajectoire remarquable.</p>
      <h2>Poullosophie : la philosophie peule mise en musique</h2>
      <p>En janvier 2023, Straiker sort son premier album, <em>Poullosophie</em> — une contraction de "Peuhl" et "philosophie". L'œuvre est une plongée dans les profondeurs de la pensée mandingue et peule, portée par des rythmes contemporains et des paroles d'une densité rare dans le rap guinéen. Le projet reçoit un accueil critique enthousiaste et confirme ce que beaucoup pressentaient déjà : Straiker n'est pas un rappeur ordinaire.</p>
      <blockquote>« Je rappe ce que je pense, ce que je vis, ce que ma culture m'a transmis. Le rap, c'est juste le véhicule — la destination, c'est la vérité. »<br><em>— Straiker</em></blockquote>
      <h2>Victoires, Paris et la controverse de mai 2026</h2>
      <p>Aux Victoires de la Musique Guinéenne 2021, il est sacré Meilleur Artiste Révélation de l'Année. En 2022, sa collaboration avec Dépotoir sur le titre <em>Rap guinéen</em> lui vaut le titre de Meilleure Collaboration Musicale. Il se produit au Cabaret Sauvage à Paris — une salle mythique pour les artistes africains de la diaspora. En mai 2026, il crée la surprise en retirant deux morceaux de YouTube, sans explication officielle. La curiosité de ses fans n'en est que plus grande.</p>
    `,
  },
  {
    id: 'a-026',
    slug: 'djanii-alpha-rap-guineen-pionnier-activiste',
    title: 'Djanii Alpha : 25 ans de rap guinéen, un album "Chef Rebel" et une voix qui ne se tait pas',
    excerpt: 'Né en 1985 à Koundara, Alpha Midiaou Bah a tout fait : fondé un label, sorti des albums primés, et pris position contre l\'injustice politique en Guinée. Djanii Alpha est le doyen du rap guinéen — et l\'un de ses plus grands.',
    category: 'musique',
    author: 'Marcus D.',
    authorImg: null,
    date: '2026-05-20',
    readTime: 6,
    image: 'https://cdn-images.dzcdn.net/images/artist/7539d7952d976c3d52691a176e4476ac/500x500-000000-80-0-0.jpg',
    featured: false,
    breaking: false,
    tags: ['djanii alpha', 'guinée', 'rap guinéen', 'conakry', 'chef rebel', 'fndc'],
    views: 28600,
    body: `
      <h2>Koundara, Pita, Dakar : une jeunesse en mouvement</h2>
      <p>Alpha Midiaou Bah naît le 24 février 1985 à Koundara, à l'extrême nord-ouest de la Guinée, près de la frontière sénégalaise. Fils de fonctionnaires, il grandit entre Koundara, Pita et Conakry — trois villes, trois atmosphères, une seule curiosité insatiable. Sa grand-mère l'envoie à Dakar pour le tenir loin de la rue et lui offrir une formation sérieuse. Il y décroche un DST en multimédias et une attestation commerciale. Mais ce qui l'attire vraiment, c'est la musique qu'il découvre dans les bacs — IAM, NTM, Wu-Tang Clan.</p>
      <p>En 1998, alors que le rap français et américain déferlent partout, il enregistre son premier single à Conakry, au studio BBC, avec quelques amis. En 2002, il fonde le groupe Katen Decha avec Stéphane Mario alias Mr Butcho. La graine est plantée.</p>
      <h2>Retour au pays, label indépendant, "G For Life"</h2>
      <p>En 2009, Djanii Alpha rentre en Guinée. Il n'attend pas qu'une maison de disques le signe — il crée son propre label indépendant avec l'ingénieur de son Bob Dynaa. En 2012, il sort son premier album <em>G For Life</em>. La critique guinéenne reconnaît en lui un artiste complet : textes engagés, flow maîtrisé, production ambitieuse. En 2018, Guinée Hit Music le consacre Meilleur Rappeur Guinéen de l'Année.</p>
      <blockquote>« Le rap, c'est ma façon de tenir un miroir devant la société. Ce que les gens voient dans ce miroir, c'est leur problème. »<br><em>— Djanii Alpha</em></blockquote>
      <h2>"Chef Rebel" et l'engagement politique</h2>
      <p>En 2022, son album <em>Chef Rebel</em> remporte le prix du Meilleur Album Urbain aux Victoires de la Musique Guinéenne. Mais Djanii Alpha dépasse le cadre de la musique : après la chute d'Alpha Condé en septembre 2021, il devient porte-parole du collectif des artistes du FNDC (Front National pour la Défense de la Constitution), puis membre de la coordination nationale. Sa musique, mélange de hip-hop, d'afro-funk et de pop, porte haut les valeurs démocratiques et dénonce l'injustice sociale. Une voix rare, qui ne se tait pas.</p>
    `,
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
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1400&q=85',
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
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1400&q=85',
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
    image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=1400&q=85',
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
    image: 'https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=1400&q=85',
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
    image: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=1400&q=85',
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
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1400&q=85',
    featured: false,
    breaking: false,
    tags: ['jeunesse africaine', 'entrepreneuriat', 'créativité', 'afrique', 'futur'],
    views: 61700,
  },

  /* ── INTERVIEWS ──────────────────────────────────────── */
  {
    id: 'a-027',
    slug: 'interview-azaya-guinee-paris-musique-mandingue',
    title: 'Azaya : "Quand je joue à Paris, je joue pour tout le peuple de Guinée"',
    excerpt: 'Rencontre avec Mamady Kamissoko alias Azaya, l\'homme qui a fait entrer la musique mandingue dans les grandes salles européennes. Il nous parle de son concert historique à Paris, de sa femme Djelykaba Bintou, et de ce que ça fait d\'être le porte-voix d\'une culture.',
    category: 'interview',
    author: 'Marcus D.',
    authorImg: null,
    date: '2026-05-21',
    readTime: 8,
    image: 'https://cdn-images.dzcdn.net/images/artist/b269f39903a403507769f9aae9ecfe22/500x500-000000-80-0-0.jpg',
    featured: false,
    breaking: false,
    tags: ['azaya', 'interview', 'guinée', 'paris', 'musique mandingue', 'djelykaba'],
    views: 67800,
    body: `
      <p><em>On le retrouve en fin de journée, calme, souriant, dans les coulisses d'une salle de répétition à Conakry. Azaya — Mamady Kamissoko pour l'état civil — vient de rentrer d'Europe. Son concert parisien de décembre 2025 a fait le tour de la toile. Il a bien voulu nous accorder une heure.</em></p>
      <h2>"Paris, c'était un rêve que je portais depuis Kankan"</h2>
      <p><strong>ONE MEDIA :</strong> Ce concert à Paris en décembre 2025, qu'est-ce que ça a représenté pour toi ?</p>
      <p><strong>Azaya :</strong> C'était immense. Je suis né à Kankan, j'ai grandi avec la basse de mon grand-oncle entre les mains, et là tu te retrouves à Paris, devant des milliers de personnes qui connaissent tes paroles, qui chantent avec toi. C'est pas juste un concert. C'est une validation. Pour moi, pour ma famille, pour toute la Guinée.</p>
      <h2>"La musique mandingue n'est pas régionale — elle est universelle"</h2>
      <p><strong>ONE MEDIA :</strong> Tu es souvent présenté comme "le Messi de la musique guinéenne". Ça t'embarrasse ou tu l'assumes ?</p>
      <p><strong>Azaya :</strong> <em>(rires)</em> Je l'assume totalement. Pas pour l'ego — mais parce que ça dit quelque chose d'important. La musique mandingue, l'afro-mandingue, ce que je fais — ça peut toucher tout le monde. Messi joue pour tout le monde, il transcende les frontières. C'est ce que je veux faire avec ma musique.</p>
      <blockquote>« Je ne veux pas que les Guinéens soient fiers de moi. Je veux qu'ils soient fiers d'eux-mêmes. Moi je suis juste le reflet. »<br><em>— Azaya</em></blockquote>
      <h2>"Djelykaba est ma partenaire dans tout"</h2>
      <p><strong>ONE MEDIA :</strong> Ta femme Djelykaba Bintou vient d'annoncer — puis de supprimer — un message de retrait de la musique. Comment vous vivez ça en famille ?</p>
      <p><strong>Azaya :</strong> C'est difficile. Elle a une pression énorme. Ce que les gens ne voient pas, c'est le travail derrière les récompenses. Le PRIMUD 2025, c'est magnifique. Mais derrière, il y a des jalousies, des attaques, des gens qui veulent te voir tomber. Elle est forte. Mais même les forts ont le droit d'être fatigués. Je suis là pour elle, comme elle a toujours été là pour moi.</p>
    `,
  },
  {
    id: 'a-028',
    slug: 'interview-ak4seven-gims-guinee-rap',
    title: 'AK4SEVEN : "Gims m\'a ouvert une porte — maintenant je dois y faire entrer toute la Guinée"',
    excerpt: 'Mohamed Alpha Keita, parti de Kamsar avec un bac en maths et des rimes plein la tête, est aujourd\'hui signé chez Géant Rouge, le label de Maître Gims. Premier rappeur guinéen à franchir ce cap. Il nous raconte comment.',
    category: 'interview',
    author: 'Kofi A.',
    authorImg: null,
    date: '2026-05-20',
    readTime: 7,
    image: 'https://cdn-images.dzcdn.net/images/artist/604dccdd4ef71094d4a3cc8a5764b161/500x500-000000-80-0-0.jpg',
    featured: false,
    breaking: false,
    tags: ['ak4seven', 'interview', 'guinée', 'gims', 'rap', 'géant rouge'],
    views: 54200,
    body: `
      <p><em>On l'a joint par appel vidéo depuis Paris. AK4SEVEN — Mohamed Alpha Keita dans le civil — est posé, direct. Il choisit ses mots avec soin. Le genre de mec qui a appris à réfléchir avant de parler, peut-être parce qu'il a grandi loin du bruit parisien, à Kamsar.</em></p>
      <h2>"J'ai quitté Kamsar avec mon bac en maths et mes instrus"</h2>
      <p><strong>ONE MEDIA :</strong> Tu es originaire de Kamsar, une ville que beaucoup ne connaissent même pas. Comment tu passes de là à un label parisien ?</p>
      <p><strong>AK4SEVEN :</strong> En travaillant. Il y a pas d'autre secret. Je suis arrivé en France en 2018, j'avais mon bac en maths, quelques instrus sur mon téléphone et la certitude que j'avais quelque chose à dire. J'ai commencé à poster des freestyles, à construire ma présence petit à petit. La série Alpha Beth, c'est ce qui a tout changé. Quand RFI a mis Alpha Beth 2 dans son hit-parade, là j'ai compris que ça pouvait vraiment se passer.</p>
      <h2>"Signer chez Géant Rouge, c'est une responsabilité"</h2>
      <p><strong>ONE MEDIA :</strong> La signature chez Géant Rouge, le label de Gims — comment ça s'est passé ?</p>
      <p><strong>AK4SEVEN :</strong> C'est une rencontre, une confiance. Gims a écouté ce que je faisais, il a vu quelque chose. Pour moi c'est plus qu'un contrat — c'est un symbole. Je suis le premier de la nouvelle génération guinéenne à signer dans un label français de ce niveau. Ça veut dire que maintenant, tous les rappeurs de Conakry, de Kamsar, de Labé — ils savent que c'est possible. Ma réussite doit ouvrir des portes, pas juste pour moi.</p>
      <blockquote>« Je rappe en français, parfois en pular, parfois en malinké. Ma langue c'est la Guinée entière. »<br><em>— AK4SEVEN</em></blockquote>
      <h2>"Le concert de Gims à Conakry, c'était magique"</h2>
      <p><strong>ONE MEDIA :</strong> En avril 2023, tu es en première partie de Gims à Conakry. Devant ton propre peuple. Qu'est-ce que tu as ressenti ?</p>
      <p><strong>AK4SEVEN :</strong> C'était la validation ultime. J'avais quitté Kamsar, construit quelque chose loin de chez moi — et là, je reviens sur scène à Conakry, présenté par Gims lui-même. Les gens dans la salle, c'était ma famille, mes amis d'enfance, des gens que je n'avais pas vus depuis des années. Je n'oublierai jamais ce soir-là.</p>
    `,
  },
  {
    id: 'a-029',
    slug: 'interview-straiker-poullosophie-rap-philosophique',
    title: 'Straiker : "Poullosophie n\'est pas un album — c\'est une manière de voir le monde"',
    excerpt: 'Ibrahima Sory Bah, le rappeur de Pita diplômé en lettres modernes, nous parle de son album "Poullosophie", de son père journaliste de radio rurale, et de ce que signifie rapper en Guinée quand on refuse de faire des concessions.',
    category: 'interview',
    author: 'Aminata C.',
    authorImg: null,
    date: '2026-05-19',
    readTime: 6,
    image: 'https://cdn-images.dzcdn.net/images/artist/aa7ffbc5507204c67b602b77fd53e8cb/500x500-000000-80-0-0.jpg',
    featured: false,
    breaking: false,
    tags: ['straiker', 'interview', 'guinée', 'poullosophie', 'rap philosophique', 'pita'],
    views: 41600,
    body: `
      <p><em>Straiker — Ibrahima Sory Bah — est le genre d'artiste qui prend son temps pour répondre. Pas par arrogance, mais parce que chaque mot compte. Fils d'un journaliste de radio rurale de Labé et d'une enseignante, il a grandi dans le respect de la parole juste. Ça s'entend dans sa musique. Ça se lit dans ses réponses.</em></p>
      <h2>"Mon père parlait à la radio. Moi je rap. C'est la même chose."</h2>
      <p><strong>ONE MEDIA :</strong> Ton père était journaliste à la radio rurale de Labé. Est-ce que c'est lui qui t'a appris l'importance des mots ?</p>
      <p><strong>Straiker :</strong> Totalement. Dans notre maison, les mots n'étaient pas des accessoires. Mon père choisissait ses mots à la radio comme on choisit des pierres précieuses. Moi j'ai pris ça et je l'ai mis dans le rap. Poullosophie, c'est ça — c'est la philosophie peule, la sagesse du Fouta-Djallon, mise en musique hip-hop. Ce n'est pas un paradoxe. C'est une continuation.</p>
      <h2>"Pita n'est pas une limitation — c'est une richesse"</h2>
      <p><strong>ONE MEDIA :</strong> Est-ce que venir de Pita — et non de Conakry — a changé ta façon de rapper ?</p>
      <p><strong>Straiker :</strong> Venir de Pita m'a tout donné. Le Fouta-Djallon, c'est une culture de la réflexion, de la patience, de la profondeur. Je n'aurais pas fait Poullosophie si j'avais grandi à Conakry dans le bruit. J'ai eu la chance de grandir dans le silence relatif d'une ville de province, avec des livres, avec la radio de mon père, avec la montagne. Ça forge.</p>
      <blockquote>« Je ne veux pas être populaire. Je veux être utile. Ce n'est pas la même chose. »<br><em>— Straiker</em></blockquote>
      <h2>"Les morceaux retirés de YouTube ? Je ne peux pas tout expliquer maintenant"</h2>
      <p><strong>ONE MEDIA :</strong> En mai 2026, tu as retiré deux morceaux de YouTube sans explication. Qu'est-ce qui s'est passé ?</p>
      <p><strong>Straiker :</strong> <em>(sourire)</em> Il y a des moments où l'artiste doit protéger son œuvre. Ces morceaux seront de retour — dans un format différent, dans un contexte différent. Je ne peux pas en dire plus pour l'instant. Mais ceux qui me suivent depuis le début comprendront quand le moment viendra.</p>
    `,
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
