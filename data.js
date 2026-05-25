/* ===========================================================
   ONE MEDIA — Données articles
   Charge les articles IA depuis /api/articles si disponibles,
   sinon utilise les articles statiques de secours.
   =========================================================== */

// Chargement dynamique des articles IA
// Toujours pointer vers Railway (même en local avec npx serve)
// Si tu lances node server.js en local sur le port 3002, change en ''
const API_BASE = 'https://one-media-production.up.railway.app';

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
      // Re-render — toujours dispatcher, renderHome vérifie si le DOM est prêt
      window.dispatchEvent(new CustomEvent('articles-updated'));
    })
    .catch(() => { /* Pas de serveur = articles statiques */ });
})();

const CATEGORIES = [
  { id: 'musique',   label: 'Musique',    color: '#FFEF4D' },
  { id: 'cinema',    label: 'Cinéma',     color: '#7D39EB' },
  { id: 'mode',      label: 'Mode',       color: '#C6FF33' },
  { id: 'art',       label: 'Art',        color: '#7D39EB' },
  { id: 'lifestyle', label: 'Lifestyle',  color: '#C6FF33' },
  { id: 'interview', label: 'Interviews', color: '#ffffff' },
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
    body: `
      <h2>Quelque chose a changé à Conakry</h2>
      <p>Ceux qui connaissent la ville depuis longtemps le sentent. Il y a une énergie nouvelle dans les rues de Kaloum, de Kipé, de Ratoma. Les studios d'enregistrement ouvrent. Les galeries aussi. Les restaurants qui servent de la cuisine guinéenne contemporaine, les clubs qui accueillent des artistes locaux, les cafés culturels qui organisent des podcasts en live — tout ça existait à moitié il y a cinq ans. Aujourd'hui ça existe vraiment.</p>
      <p>Ce n'est pas un miracle. C'est le résultat d'une génération entière qui a décidé de ne plus attendre les conditions idéales. <strong>Azaya</strong> remplit des salles en Europe. <strong>Djelykaba Bintou</strong> gagne le PRIMUD. <strong>AK4SEVEN</strong> signe chez Gims. <strong>Amaza</strong> bat les records de streaming. Ces noms-là, il y a dix ans, auraient été inconnus hors des frontières guinéennes. Aujourd'hui, ils représentent la Guinée sur la scène mondiale.</p>
      <h2>La mode, l'art, et le reste</h2>
      <p>La musique mène la danse — mais elle n'est pas seule. La mode guinéenne trouve ses repères : la Conakry Fashion Week revient en force, des mannequins guinéens défilent à Paris et Londres, des créateurs développent des collections qui mêlent le bazin au streetwear contemporain. Les artistes plasticiens peignent sur les murs de la ville et exposent en Europe. Les chefs de cuisine réinventent la tradition à la table.</p>
      <blockquote>« Conakry n'a jamais manqué de talent. Elle manquait de confiance. Et là, cette confiance est revenue. »<br><em>— Une journaliste culturelle de Conakry</em></blockquote>
      <h2>Ce que ça veut dire pour la suite</h2>
      <p>La renaissance culturelle de Conakry n'est pas un phénomène isolé. Elle s'inscrit dans un mouvement plus large de l'Afrique de l'Ouest — Lagos, Abidjan, Dakar, Bamako — où la créativité locale ne cherche plus la validation externe. Elle se légitime elle-même, trouve ses propres marchés, construit ses propres infrastructures. Conakry est en retard ? Non. Conakry arrive exactement au moment où le monde est prêt à l'écouter.</p>
    `,
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
    body: `
      <h2>Comment Abidjan est devenu la capitale du rap francophone</h2>
      <p>Il y a dix ans, quand on parlait de rap francophone, on pensait Paris. Marseille. Bordeaux. Abidjan était sur le radar — mais pas au centre. En 2026, la carte a changé. Didi B remplit le Zénith de Paris. Himra est l'artiste le plus streamé de l'histoire ivoirienne, toutes plateformes confondues. TRK trône en tête d'Apple Music Côte d'Ivoire depuis des mois. Quelque chose s'est passé à Abidjan — et ce n'est pas un accident.</p>
      <p>La ville a toujours été en ébullition créative. Mais c'est la signature de Kiff No Beat chez Universal Music en 2017 qui a changé la donne. Cette décision — un major américain qui parie sur un groupe de rap africain — a envoyé un signal à toute la scène : ici aussi, ça peut se faire. Et depuis, chaque génération a poussé un peu plus loin.</p>
      <h2>Didi B : l'architecte tranquille</h2>
      <p>Bassa Zéréhoué Diyilem, alias Didi B, n'est pas le type à faire du bruit pour rien. Il construit. Album après album, il a posé des fondations. <em>History</em> est devenu disque de diamant — une première absolue en Côte d'Ivoire. Son concert au Zénith de Paris en avril 2026 ? Sold out en quelques heures. Didi B est devenu une institution. Mais ce qui le distingue, c'est qu'il reste accessible. Il répond aux DMs. Il passe au quartier. Il n'a pas oublié d'où il vient.</p>
      <blockquote>« Le rap ivoirien ne se contente plus d'exister — il définit les codes. Et ça, c'est nouveau. »<br><em>— Pan-African Music Magazine, 2026</em></blockquote>
      <h2>Himra : le phénomène nouchi qui a tout cassé</h2>
      <p>Himra n'a pas suivi les règles — il les a ignorées. Son rap en nouchi, le parler populaire d'Abidjan, a conquis des millions d'auditeurs qui n'avaient jamais entendu parler de lui. <em>Jeune & Riche</em> est passé de platine à diamant en moins d'un an. Le Black Trophy aux African Talent Awards 2024 — le plus haut prix possible dans son genre. Himra est la preuve que la langue n'est pas une barrière quand le son est universel.</p>
      <h2>TRK : la nouvelle vague qui arrive</h2>
      <p>TRK est le futur. Pas du futur — le futur maintenant. Surnommé le "Golden Boy", son EP <em>BABI TAPE Vol. 1</em> a imposé un son résolument abidjanais — trap, afrobeats et identité locale. Il domine Apple Music Côte d'Ivoire depuis des mois. La prochaine génération a déjà son porte-étendard.</p>
    `,
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
    body: `
      <h2>Ils ne cherchent pas les sunlights — ils construisent le son</h2>
      <p>Dans un studio improvisé du quartier de Kipé à Conakry, un beatmaker pose ses mains sur un clavier MIDI et écoute en boucle un sample d'une kora vieille de trente ans. Il s'appelle Karamo. Il a 24 ans. Il n'a pas de contrat avec un label. Mais trois de ses productions ont été utilisées sur des singles qui ont dépassé le million de streams cette année. C'est ça, l'Afrobeats made in Guinée — une puissance invisible qui travaille dans l'ombre.</p>
      <p>La Guinée est souvent présentée comme un réservoir de talents vocaux — Azaya, Djelykaba, Amaza. Ce qu'on oublie, c'est l'écosystème de production derrière eux. Les beatmakers de Conakry ont développé un son propre : des basses plus épaisses, des percussions qui rappellent le djembé, une utilisation du balafon et de la kora comme instruments de lead — pas juste de décor. Ce son guinéen est en train de s'exporter sans que personne ne le remarque vraiment.</p>
      <h2>Le paradoxe de la richesse et de l'invisibilité</h2>
      <p>La Guinée possède l'un des patrimoines musicaux les plus riches d'Afrique de l'Ouest — et c'est précisément ce patrimoine qui nourrit une nouvelle génération de producteurs. Les fils et filles de musiciens traditionnels réinterprètent les gammes mandingues, les rythmes peuls, les mélodies forestières de Guinée maritime — et les mettent au service de l'afrobeats contemporain. Le résultat est d'une richesse fascinante.</p>
      <blockquote>« À Conakry, on a le son. Ce qu'on n'a pas encore, c'est l'infrastructure pour le diffuser. Mais ça vient. »<br><em>— Un producteur de Kipé</em></blockquote>
      <h2>Paris, Lagos, Abidjan — et Conakry</h2>
      <p>Les plateformes de streaming ne mentent pas : les artistes guinéens gagnent des parts d'audience en Europe et en Amérique du Nord. La diaspora est là, massive, fidèle. Et chaque mois, de nouveaux auditeurs hors de Guinée découvrent ce son. L'équation est simple : quand le son est bon, les frontières disparaissent. Et le son de Conakry — ce mélange unique de tradition et de modernité — est très, très bon.</p>
    `,
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
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1400&q=85',
    featured: false,
    breaking: false,
    tags: ['guinée', 'patrimoine', 'amazones', 'balla', 'musique traditionnelle'],
    views: 29700,
    body: `
      <h2>Ce que le monde entier a oublié de dire sur la musique guinéenne</h2>
      <p>En 2004, Youssou N'Dour remporte le Grammy Award du Best Contemporary World Music Album pour <em>Egypt</em> — et tout le monde parle du Sénégal. En 2022, Tyla gagne le Grammy de Best African Music Performance — et tout le monde parle de l'Afrique du Sud. Ce qu'on dit rarement, c'est que la Guinée a précédé tout le monde. Dès les années 1960, sous Sékou Touré, la Guinée a eu la vision de créer des ensembles musicaux d'État parmi les plus influents d'Afrique : le Ballet National Djoliba, les Amazones de Guinée, Balla et ses Balladins, le Bembeya Jazz National.</p>
      <h2>Les Amazones de Guinée : l'orchestre féminin qui a tout inventé</h2>
      <p>Fondé dans les années 1960 par Sékou Touré, l'Orchestre des Amazones de Guinée était entièrement composé de femmes — policières de leur métier, musiciennes de leur vocation. Elles jouaient de la musique afro-cubaine, du jazz africain, du mbalax avant l'heure. Leur son était une révolution. Après des décennies de silence, elles ont été remises à l'honneur en 2018 avec un album acclamé par la presse internationale. NPR Music, Pitchfork, The Guardian — tout le monde a salué ce retour. Tout le monde sauf la Guinée officielle, qui peine encore à valoriser ce patrimoine comme il le mérite.</p>
      <h2>Balla et ses Balladins : le groove tropical qui a influencé la planète</h2>
      <p>Balla Onivogui et ses Balladins ont créé dans les années 1960-70 un son unique : des rythmes afro-cubains fusionnés avec des mélodies mandingues, une production qui, si elle avait été mieux distribuée, aurait pu avoir l'impact mondial qu'ont eu le highlife ghanéen ou le soukous congolais. Les disques vinyles s'arrachent aujourd'hui chez les collectionneurs du monde entier. La Guinée n'a toujours pas de musée digne de ce nom pour les honorer.</p>
      <blockquote>« La Guinée a le meilleur jazz africain que peu de gens connaissent. C'est un crime contre la culture mondiale. »<br><em>— Un musicologue parisien</em></blockquote>
      <h2>Il est temps de changer ça</h2>
      <p>La question n'est pas de savoir si ce patrimoine existe — il existe. La question est de savoir qui va prendre la responsabilité de le numériser, de le documenter, de le rendre accessible. Le Nigeria a fondé une fondation pour le highlife. Le Ghana protège son patrimoine musical par la loi. En Guinée, l'urgence est là. Les artistes de la nouvelle génération — Azaya, Djelykaba Bintou — s'appuient sur ces racines. Il serait temps que les institutions leur emboîtent le pas.</p>
    `,
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
    slug: 'ben-imana-rwanda-camera-or-cannes-2026',
    title: 'Ben\'Imana : la Rwandaise Marie-Clémentine Dusabejambo remporte la Caméra d\'Or à Cannes 2026',
    excerpt: 'Son premier film, Ben\'Imana, est devenu le premier film d\'une réalisatrice rwandaise à entrer dans la Sélection Officielle de Cannes. Et elle repart avec la Caméra d\'Or — la récompense du meilleur premier film. Un moment historique pour le cinéma africain.',
    category: 'cinema',
    author: 'Kofi A.',
    authorImg: null,
    date: '2026-05-24',
    readTime: 5,
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1400&q=85',
    featured: true,
    breaking: true,
    tags: ['cannes 2026', 'rwanda', 'caméra d\'or', 'cinéma africain', 'marie-clémentine dusabejambo', 'ben\'imana'],
    views: 94200,
    body: `
      <h2>Un premier film, une première historique</h2>
      <p>Quand le nom de Marie-Clémentine Dusabejambo a été prononcé sur la scène de Cannes pour recevoir la Caméra d'Or 2026 — la plus haute distinction pour un premier film —, l'histoire du cinéma africain a changé de page. <em>Ben'Imana</em> est le premier film d'une réalisatrice rwandaise à entrer dans la Sélection Officielle de Cannes. Et il en est reparti avec la récompense la plus convoitée pour un premier long-métrage.</p>
      <h2>De quoi parle Ben'Imana ?</h2>
      <p>Le film suit Vénéranda, survivante du génocide contre les Tutsi de 1994 au Rwanda, qui appelle à la réconciliation et au pardon à l'heure où les tribunaux populaires tentent d'apporter justice et guérison. Un récit profond, ancré dans la mémoire collective rwandaise, porté par une mise en scène d'une sobriété et d'une précision remarquables.</p>
      <blockquote>« Cette Caméra d'Or appartient à tout le Rwanda. À toutes les femmes qui ont vécu Ben'Imana et qui n'ont jamais pu la raconter. »<br><em>— Marie-Clémentine Dusabejambo, Cannes 2026</em></blockquote>
      <h2>L'Afrique était présente à Cannes 2026</h2>
      <p>Ben'Imana n'était pas seul à représenter le continent. Trois films africains étaient sélectionnés dans la section Un Certain Regard cette année : <em>Congo Boy</em> du Congolais Rafiki Fariala, <em>Strawberries</em> de la Franco-Marocaine Laïla Marrakchi, et le film de Dusabejambo. En Quinzaine des cinéastes, les frères nigérians Esiri présentaient <em>Clarissa</em>. Une présence africaine jamais aussi forte dans l'histoire du festival.</p>
    `,
  },
  {
    id: 'a-010',
    slug: 'afrique-cannes-2026-trois-films-un-certain-regard',
    title: 'Cannes 2026 : Rwanda, Congo, Nigéria, Maroc — l\'Afrique n\'est plus une curiosité, elle est en compétition',
    excerpt: 'Quatre films africains sélectionnés à Cannes 2026 — Un Certain Regard, Quinzaine des cinéastes, Caméra d\'Or. Du jamais-vu. Congo Boy, Strawberries, Clarissa et Ben\'Imana — une génération de cinéastes africains qui impose ses récits au monde.',
    category: 'cinema',
    author: 'Fatou N.',
    authorImg: null,
    date: '2026-05-22',
    readTime: 6,
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1400&q=85',
    featured: false,
    breaking: false,
    tags: ['cannes 2026', 'cinéma africain', 'congo boy', 'clarissa', 'un certain regard'],
    views: 61400,
    body: `
      <h2>Quatre films. Quatre pays. Un même signal.</h2>
      <p>À la 79e édition du Festival de Cannes, l'Afrique a fait entendre sa voix plus fort que jamais. Quatre productions africaines sélectionnées, des sections compétitives aux parallèles officielles — c'est un record. <em>Congo Boy</em> de Rafiki Fariala (République du Congo), <em>Strawberries</em> de la Franco-Marocaine Laïla Marrakchi, et <em>Ben'Imana</em> de la Rwandaise Marie-Clémentine Dusabejambo en Un Certain Regard. <em>Clarissa</em> des frères Esiri (Nigéria) en Quinzaine des cinéastes.</p>
      <h2>Congo Boy : le Congo au cœur de l'Une Certain Regard</h2>
      <p>Rafiki Fariala, réalisateur congolais déjà remarqué avec <em>Ça tourne à Coyah</em>, signe avec <em>Congo Boy</em> un film sur l'adolescence et les rêves dans un Congo contemporain que le cinéma mondial connaît mal. Sa présence à Cannes confirme une trajectoire exceptionnelle.</p>
      <h2>Les frères Esiri et le renouveau du cinéma nigérian</h2>
      <p>Nollywood produit plus de films que tout autre pays africain. Mais les frères Esiri ont choisi la voie du cinéma d'auteur. <em>Clarissa</em>, sélectionné en Quinzaine des cinéastes, impose un regard nigérian neuf, taillé pour les grandes scènes internationales.</p>
      <blockquote>« Le cinéma africain n'a jamais manqué de talent ni d'histoires. Il manquait de plateformes. Ces plateformes, on les crée maintenant. »<br><em>— allAfrica.com, mai 2026</em></blockquote>
    `,
  },
  {
    id: 'a-011',
    slug: 'les-flammes-2026-theodora-5-trophees-palmares',
    title: 'Les Flammes 2026 : Theodora rafle 5 trophées, Hamza couronne le morceau de l\'année',
    excerpt: 'La 4e édition des Flammes — les awards de la musique afro et urbaine — s\'est tenue le 23 avril 2026 à La Seine Musicale. Theodora a écrasé la compétition avec 5 récompenses dont Artiste féminine et Album de l\'année. Plus de 810 000 votants. La cérémonie qui monte.',
    category: 'musique',
    author: 'Rédaction ONE',
    authorImg: null,
    date: '2026-04-24',
    readTime: 4,
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1400&q=85',
    featured: false,
    breaking: false,
    tags: ['les flammes 2026', 'theodora', 'hamza', 'werenoi', 'awards', 'musique afro'],
    views: 112000,
    body: `
      <h2>Theodora, grande gagnante d'une soirée historique</h2>
      <p>La 4e édition des Flammes — la cérémonie dédiée à la musique afro et urbaine francophone — a eu lieu le jeudi 23 avril 2026 à La Seine Musicale, à Paris. Et c'est Theodora qui a dominé la soirée de bout en bout : <strong>5 trophées</strong>, dont Artiste féminine de l'année, Flamme Spotify pour Album de l'année, Meilleur album pop pour <em>Mega BBL</em>, Clip de l'année pour <em>Fashion Designa</em>, et Couverture d'album de l'année.</p>
      <h2>Le palmarès complet</h2>
      <p>Hamza a remporté le Morceau de l'année avec <em>Kyky2Bondy</em>. Werenoi a été sacré pour l'Album rap de l'année avec <em>Diamant Noir</em>. Gims, Fallon et L2B figurent également parmi les lauréats de cette édition. La soirée a mobilisé <strong>810 000 votants</strong> — 500 000 de plus que l'édition précédente — confirmant la montée en puissance de la cérémonie.</p>
      <blockquote>« Les Flammes sont devenues la référence absolue pour la musique noire francophone. Cette année, il n'y avait aucun doute sur qui régnait. »<br><em>— RIFFX, avril 2026</em></blockquote>
      <h2>Une cérémonie qui grandit</h2>
      <p>26 prix remis en une soirée, La Seine Musicale sold out, un tapis rouge qui rivalise avec les grands formats internationaux — les Flammes 2026 ont confirmé qu'il existe désormais une scène musicale noire francophone qui se célèbre elle-même, avec ses propres codes et son propre public.</p>
    `,
  },

  /* ── MODE ─────────────────────────────────────────── */
  {
    id: 'a-012',
    slug: 'africa-fashion-up-2026-paris-fashion-week-juin',
    title: 'Africa Fashion Up 2026 : 700 candidats, 45 pays — les créateurs africains à la conquête de Paris',
    excerpt: 'Le 26 juin 2026, au Musée du Quai Branly à Paris, la 6e édition d\'Africa Fashion Up présente les meilleurs créateurs africains lors de la Fashion Week. 700 candidatures reçues de 45 pays. La plateforme la plus ambitieuse de la mode africaine contemporaine.',
    category: 'mode',
    author: 'Awa D.',
    authorImg: null,
    date: '2026-05-21',
    readTime: 5,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=85',
    featured: false,
    breaking: false,
    tags: ['africa fashion up', 'mode africaine', 'paris fashion week', 'créateurs africains', 'quai branly', '2026'],
    views: 47300,
    body: `
      <h2>La plus grande édition de l'histoire d'Africa Fashion Up</h2>
      <p>Africa Fashion Up, la plateforme fondée par la Franco-Ivoirienne Valérie Ka (Studio Ka), tient sa 6e édition en 2026 — et les chiffres donnent le vertige : <strong>700 candidatures reçues</strong>, <strong>45 pays représentés</strong>, un jury de 23 personnalités de l'industrie. Le défilé final aura lieu le <strong>26 juin</strong> au Musée du Quai Branly-Jacques Chirac, dans le cadre de la Paris Fashion Week printemps-été 2027.</p>
      <h2>Deux catégories, deux ambitions</h2>
      <p>Pour cette édition, Africa Fashion Up ouvre deux catégories : <strong>Fashion Young Leader</strong>, pour les jeunes créateurs africains ou de la diaspora, et <strong>Best African Designer</strong>, réservé aux maisons établies avec une structure commerciale enregistrée. Les candidats sélectionnés bénéficient d'un programme d'immersion à Paris — masterclasses, rencontres avec acheteurs, visibilité médiatique.</p>
      <blockquote>« En cinq éditions, nous avons accompagné plus de 40 créateurs issus de 24 pays africains différents. Cette année, on monte encore le niveau. »<br><em>— Valérie Ka, fondatrice d'Africa Fashion Up</em></blockquote>
      <h2>Le Quai Branly, scène de la mode africaine</h2>
      <p>En parallèle, le Musée du Quai Branly accueille jusqu'au 12 juillet 2026 l'exposition <em>Africa Fashion</em>, qui retrace l'histoire et l'évolution créative de la mode africaine à travers ses images, ses textiles et son patrimoine. Une célébration totale, à deux pas de la Tour Eiffel.</p>
    `,
  },
  {
    id: 'a-013',
    slug: 'davido-conakry-8-9-mai-2026-guinee-vibrante',
    title: 'Davido à Conakry : deux concerts, une ville qui envoie un message au monde',
    excerpt: 'Les 8 et 9 mai 2026, la star nigériane Davido a enflammé Conakry pour deux concerts exceptionnels dans le cadre de son "5ive Tour". Une première à cette échelle pour la capitale guinéenne. Le concept "Guinée Vibrante" veut faire de Conakry une destination incontournable des grandes tournées internationales.',
    category: 'musique',
    author: 'Mamadou B.',
    authorImg: null,
    date: '2026-05-10',
    readTime: 5,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&q=85',
    featured: true,
    breaking: false,
    tags: ['davido', 'conakry', 'guinée', 'concert', '5ive tour', 'guinée vibrante'],
    views: 88700,
    body: `
      <h2>Le "5ive Tour" termine en Guinée</h2>
      <p>Davido — de son vrai nom David Adedeji Adeleke, l'une des plus grandes stars de l'Afrobeats mondial — a clôturé son "5ive Tour" par deux concerts exceptionnels à Conakry les 8 et 9 mai 2026. Une première à cette échelle pour la capitale guinéenne. Le 8 mai, c'est au Chapiteau by Issa (concert privé VIP, billets à partir d'1 million de francs guinéens) ; le 9, à l'Esplanade du Palais du Peuple, ouvert au grand public (dès 70 000 GNF).</p>
      <h2>Guinée Vibrante : un concept ambitieux</h2>
      <p>Les concerts sont portés par le concept <strong>"Guinée Vibrante"</strong> — un partenariat entre les promoteurs Business Industry Management, BD Musique et BD Karité Musique, avec pour objectif affiché de positionner Conakry sur la carte des grandes tournées internationales. L'Office Guinéen de Publicité (OGP) était partenaire officiel de l'événement. Davido lui-même a déclaré avoir "vu les transformations de Conakry" et souhaité rencontrer le président Mamadi Doumbouya lors de son séjour.</p>
      <blockquote>« J'ai hâte de retrouver mes fans guinéens. Conakry, c'est une énergie à part. »<br><em>— Davido, avant le concert</em></blockquote>
      <h2>Un signal fort pour le showbiz guinéen</h2>
      <p>L'arrivée de Davido à Conakry n'est pas anodine. Elle confirme une dynamique engagée depuis quelques années : des artistes internationaux de premier plan commencent à inclure la Guinée dans leurs tournées africaines. Après Burna Boy et Wizkid (Lagos, Accra, Abidjan), c'est maintenant Conakry qui s'invite sur la carte. Le showbiz guinéen en sort grandi — et les promoteurs locaux ont montré qu'ils pouvaient organiser des événements à la hauteur.</p>
    `,
  },
  {
    id: 'a-014',
    slug: 'fatima-diabate-modele-guineenne-diaspora',
    title: 'Fatima Diabaté, Hawa Barry, Kadiatou Sow : les mannequins guinéens qui font la loi en Europe',
    excerpt: 'Trois femmes, trois parcours, un même fil : la Guinée. Fatima Diabaté (Paris), Hawa Barry (Londres), Kadiatou Sow (Bruxelles) — elles ont quitté Conakry, Labé ou Kindia pour conquérir les agences européennes. Portraits de celles qui portent haut la beauté guinéenne.',
    category: 'mode',
    author: 'Chloé B.',
    authorImg: null,
    date: '2026-05-14',
    readTime: 7,
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1400&q=85',
    featured: false,
    breaking: false,
    tags: ['mannequins guinéens', 'diaspora', 'paris', 'mode africaine', 'beauté'],
    views: 44300,
    body: `
      <h2>Fatima Diabaté : de Labé à l'agence Elite Paris</h2>
      <p>Fatima Diabaté est née à Labé, dans le Fouta-Djallon. Grande, mince, avec un port de tête qui rappelle les princesses peules, elle arrive à Paris à 19 ans pour des études de commerce. Un casting spontané dans un centre commercial la propulse chez une agence locale, puis chez Elite Model Management. Depuis trois ans, elle défile pour des maisons de prêt-à-porter haut de gamme et collabore avec des créateurs africains de la diaspora.</p>
      <h2>Hawa Barry : London calling</h2>
      <p>Née à Conakry, Hawa Barry rejoint Londres à 21 ans. Elle est aujourd'hui représentée par l'agence Models 1 et a posé pour Burberry, ASOS et la marque panafricaine Rich Mnisi. Sur Instagram, ses 180 000 abonnés suivent autant sa carrière que ses prises de position sur la représentation noire dans la mode.</p>
      <blockquote>« On ne devrait pas être des exotismes. On devrait être des standards. »<br><em>— Hawa Barry</em></blockquote>
      <h2>Kadiatou Sow : la révélation bruxelloise</h2>
      <p>Originaire de Kindia, Kadiatou Sow a été révélée par le concours Elite Model Look Belgium en 2024. Finaliste du concours mondial, elle est maintenant sous contrat avec l'agence Dominique Models à Bruxelles et prépare sa première Fashion Week à Paris en octobre 2026.</p>
    `,
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
    image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=1400&q=85',
    featured: false,
    breaking: false,
    tags: ['street art', 'conakry', 'guinée', 'art urbain', 'identité'],
    views: 33400,
    body: `
      <h2>Un mur n'est pas un mur — c'est une déclaration</h2>
      <p>Dans le quartier de Matam, un mur de sept mètres de long a été transformé en fresque monumentale représentant les grandes figures de la résistance guinéenne : Almamy Samory Touré, Bocar Biro Barry, et une femme sans nom dont le visage tourne vers l'avenir. Autour d'elle, en lettres arabes et latines : <em>Sinemory</em> — "demain" en soussou. L'auteur : un collectif de jeunes artistes de Conakry qui refuse de signer individuellement. "C'est un œuvre collective, comme la résistance l'était."</p>
      <p>À Hamdallaye, à Dixinn, à Ratoma — la ville parle. Les murs sont devenus des journaux intimes géants. On y lit l'amour, la colère, les rêves et les deuils d'une génération qui a grandi sous la chape de plomb politique et qui s'exprime maintenant que la parole est un peu plus libre. Ce mouvement n'a pas de nom officiel, pas de galerie, pas de représentant. Il existe parce qu'il existe.</p>
      <h2>Le graffiti comme outil politique</h2>
      <p>Certaines fresques disparaissent du jour au lendemain — recouvertes de blanc, sans explication. D'autres résistent depuis des années. Le street art est devenu un espace de négociation entre les artistes et l'espace public, entre la création et le contrôle. Et dans cette tension, l'art trouve sa puissance la plus brute.</p>
      <blockquote>« On ne peint pas pour l'éternité. On peint pour aujourd'hui. »<br><em>— Un artiste de Matam</em></blockquote>
      <h2>Vers une reconnaissance internationale</h2>
      <p>En 2025, un photographe français a documenté ces fresques pour une exposition à la Galerie des Colonies à Paris. Pour la première fois, le street art de Conakry a trouvé un écho hors de Guinée. La diaspora a partagé massivement. De jeunes créateurs européens ont commencé à s'intéresser à ce mouvement. Le monde commence à regarder les murs de Conakry.</p>
    `,
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
    body: `
      <h2>Porteurs d'un double héritage</h2>
      <p>Ils sont nés à Conakry, à Kindia, à Kankan. Ils ont grandi entre deux cultures — celle du Fouta ou de la forêt guinéenne, et celle des villes européennes où ils ont étudié l'art. Et de cette tension, ils ont fait une œuvre. Pas un compromis — une synthèse. Leurs toiles mélangent les pigments de l'Afrique de l'Ouest et les techniques de l'expressionnisme abstrait. Leurs sculptures jouent avec le masque dogon et la géométrie minimaliste.</p>
      <h2>Ibrahima Kouyaté : les textiles comme cartographie</h2>
      <p>Ibrahima Kouyaté est né à Conakry en 1988. Aujourd'hui basé à Paris, il travaille avec des tissus wax et bogolan qu'il détourne pour créer des cartographies imaginaires de la Guinée. Ses œuvres ont été exposées à la Fondation Louis Vuitton, au Palais de Tokyo et à la Galerie Chloé Salgado à Bruxelles. Son travail pose une question simple : qu'est-ce qu'une frontière quand on a grandi entre deux continents ?</p>
      <blockquote>« Je ne veux pas être un artiste africain en Europe. Je veux être un artiste qui a quelque chose à dire — et ce quelque chose vient de Guinée. »<br><em>— Ibrahima Kouyaté</em></blockquote>
      <h2>Mariama Sow : la sculpture comme résurrection</h2>
      <p>Mariama Sow, née à Kindia en 1993, travaille le métal et le bois de récupération dans son atelier londonien. Ses sculptures — toujours des femmes, toujours debout — ont été acquises par la collection d'art contemporain du Victoria & Albert Museum en 2025. Elle prépare une exposition solo à New York pour l'automne 2026.</p>
    `,
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
    body: `
      <h2>Cocody se réveille en couleur</h2>
      <p>À Cocody, le quartier résidentiel et commercial d'Abidjan, des fresques géantes ont commencé à apparaître sur les façades des immeubles depuis 2023. Des visages de femmes aux teintes ocre et rouge, des silhouettes d'éléphants stylisés, des hommages à Dj Arafat, à Gadji Celi, aux grandes figures de la culture ivoirienne. L'initiative vient du collectif <strong>Abidjan Paint</strong>, fondé par cinq jeunes artistes formés aux Beaux-Arts de Dakar et de Paris.</p>
      <h2>Yopougon : le quartier populaire qui peint ses rêves</h2>
      <p>À Yopougon, le quartier populaire par excellence — berceau du coupé-décalé, du zouglou, de la joie abidjanaise — les murs parlent aussi. Ici, ce sont des artistes locaux, sans formation académique, qui peignent avec ce qu'ils ont : de la peinture de chantier, des pinceaux improvisés, des bombes aérosol récupérées. Le résultat est brut, vivant, et profondément ancré dans la culture de la rue.</p>
      <blockquote>« On ne peint pas pour exposer en galerie. On peint pour que le quartier sache qu'il existe. »<br><em>— Un artiste de Yopougon</em></blockquote>
      <h2>Un œil international sur Abidjan</h2>
      <p>En 2025, le magazine d'art contemporain <em>Artnet</em> a consacré un dossier entier au street art abidjanais. Les collectionneurs européens commencent à s'y intéresser. Des galeries de Paris et Berlin ont approché des artistes. Ce qui était une expression locale devient un phénomène mondial — avec toutes les questions que ça pose sur l'appropriation et la représentation.</p>
    `,
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
    body: `
      <h2>Kipé ne s'arrête plus à minuit</h2>
      <p>Il y a cinq ans, Conakry s'arrêtait avec le coucher du soleil. Les coupures d'électricité, l'insécurité perçue, le manque d'infrastructures — tout invitait à rentrer tôt. En 2026, la ville a changé de rythme. Les groupes électrogènes ont cédé la place aux panneaux solaires. Les quartiers de Kipé, Lambanyi et Ratoma sont devenus les épicentres d'une vie nocturne qui n'a rien à envier aux capitales africaines voisines.</p>
      <p>Le <strong>Nimba Club</strong>, ouvert en 2023, est devenu la référence. Chaque vendredi, la terrasse accueille des soirées qui mélangent afrobeats guinéen, soukous, rap local et son mandingue revisité. L'entrée est à 50 000 GNF — abordable pour la classe moyenne émergente de Conakry. Et les artistes qui s'y produisent ? Amaza, Straiker, des beatmakers qui jouent leurs productions en live. La salle est toujours pleine.</p>
      <h2>Kaloum : les restaurants qui réinventent la table guinéenne</h2>
      <p>Le centre de Kaloum n'est plus seulement le quartier des affaires. Il est aussi devenu un pôle gastronomique. Des restaurants comme <strong>Le Mangrove</strong> et <strong>Bafoulabeya</strong> proposent des menus qui mélangent cuisine guinéenne traditionnelle et influences contemporaines. Le fouti sauté au safran, le tiga dégué revisité avec du lait de coco, la sauce feuilles accompagnée de riz au gingembre et citronnelle — une cuisine locale qui se réinvente sans se renier.</p>
      <blockquote>« Conakry n'est pas une ville qui dort. Elle n'a jamais dormi — on ne la regardait juste pas. »<br><em>— Un habitant de Kipé</em></blockquote>
      <h2>Le café culturel : nouveau lieu de la création</h2>
      <p>Entre les clubs et les restaurants, une nouvelle catégorie d'espaces s'est développée : le café culturel. Des lieux hybrides où on vient écouter des podcasts enregistrés en direct, assister à des battles de rap improvisé, voir des expositions photos. <strong>Espace Baobab</strong>, ouvert en 2024, est le plus emblématique. Chaque semaine, il programme un artiste de la scène locale et une table ronde sur la culture guinéenne contemporaine.</p>
    `,
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
    body: `
      <h2>Le fouti, le tiga dégué, la sauce feuilles — vous en avez déjà entendu parler ?</h2>
      <p>Si vous avez mangé dans un restaurant africain à Paris, vous connaissez probablement le thiéboudienne sénégalais, l'attiéké ivoirien, le ndolé camerounais. Mais le <em>fouti</em> — cette bouillie de farine de maïs onctueuse servie avec de la sauce arachide ? Le <em>tiga dégué</em> — ce dessert d'arachides écrasées, de noisettes et de chocolat qui arrive en fin de repas dans toutes les familles guinéennes ? Probablement pas. La cuisine guinéenne est l'une des grandes cuisines africaines inconnues en Europe. Et certains veulent changer ça.</p>
      <h2>Des chefs qui portent la cuisine guinéenne hors des frontières</h2>
      <p>À Paris, dans le 18e arrondissement, le restaurant <strong>Conakry Street</strong> a ouvert en 2024. Son fondateur, Oumar Camara, né à Kindia et formé à l'école hôtelière de Lyon, veut proposer la cuisine guinéenne telle qu'elle est : généreuse, épicée, profondément ancrée dans la tradition. "Le problème avec la cuisine africaine en France, c'est qu'on l'exotise. Moi je veux juste qu'on la mange."</p>
      <p>À Conakry, des chefs comme <strong>Mariame Diallo</strong> et <strong>Ibrahima Touré</strong> revisitent les classiques avec des produits locaux en circuit court. Leur démarche est à la fois gastronomique et politique : valoriser les agriculteurs de Guinée forestière, réduire les importations, et créer une identité culinaire guinéenne contemporaine.</p>
      <blockquote>« La cuisine, c'est la carte d'identité d'un peuple. Quand on ne connaît pas votre cuisine, c'est parce qu'on ne vous a pas encore vraiment rencontré. »<br><em>— Oumar Camara, chef</em></blockquote>
      <h2>La sauce feuilles : le patrimoine immatériel qui se mange</h2>
      <p>La sauce feuilles — à base de feuilles de patate douce ou de manioc, d'huile de palme rouge et d'épices — est l'un des plats les plus emblématiques de la Guinée forestière. Dans chaque famille, elle a sa version. C'est le plat du dimanche, celui qu'on fait quand il faut dire à quelqu'un qu'on l'aime sans le dire. Elle commence à apparaître sur des tables européennes. Ce n'est que le début.</p>
    `,
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
    body: `
      <h2>Ils n'attendent plus le feu vert</h2>
      <p>Quelque chose a changé dans la façon dont la jeunesse africaine pense à l'avenir. Moins de "si". Moins de "quand les conditions seront réunies". Plus de maintenant. De Dakar à Conakry, d'Abidjan à Douala et Nairobi, une génération entière s'est réveillée avec une conviction simple : si personne ne crée les conditions pour nous, on les crée nous-mêmes.</p>
      <p>Ce n'est pas du naïf optimisme. C'est une stratégie. Les jeunes entrepreneurs africains ont compris que le marché continental est immense, que la diaspora est une ressource inépuisable, et que les outils numériques permettent de toucher le monde depuis n'importe quel quartier de Conakry, Abidjan ou Dakar.</p>
      <h2>Aminata, 27 ans, Conakry : des tissus wax vendus à Tokyo</h2>
      <p>Aminata Kourouma a grandi à Ratoma. À 23 ans, elle lance <strong>Wax World</strong>, une boutique en ligne qui vend des tissus guinéens et ouest-africains à une clientèle internationale. En deux ans, elle a des clients au Japon, en Allemagne et aux États-Unis. "Les gens veulent de l'authenticité. Moi j'ai les contacts directs avec les tisserands. C'est simple." Son chiffre d'affaires mensuel dépasse désormais celui d'un directeur commercial guinéen moyen.</p>
      <h2>Ibrahima, 24 ans, Dakar : podcaster à 200 000 abonnés</h2>
      <p>Ibrahima Ndiaye a commencé son podcast <em>Demain Afrique</em> avec un téléphone et des écouteurs dans sa chambre. Deux ans plus tard, il a 200 000 abonnés sur toutes les plateformes, des partenariats avec des marques africaines et une invitation à parler à la conférence TED à Nairobi. "Je n'ai rien demandé. J'ai juste eu une conversation honnête sur les sujets qui nous concernent."</p>
      <blockquote>« On n'est pas la génération qui attend. On est la génération qui construit. »<br><em>— Aminata Kourouma, Conakry</em></blockquote>
    `,
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

  /* ── NOUVELLES REAL NEWS ──────────────────────────── */
  {
    id: 'a-032-boncana',
    slug: 'boncana-maiga-deces-maestro-africain-fevrier-2026',
    title: 'Le Maestro Boncana Maïga n\'est plus : l\'Afrique perd un géant de la musique',
    excerpt: 'Boncana Maïga, flûtiste, arrangeur et animateur légendaire de "Stars Parade", est décédé le 28 février 2026 à 77 ans à Bamako. L\'homme qui a marié le Mali et La Havane, dirigé l\'orchestre de la RTI et fondé Africando. Une perte immense pour toute l\'Afrique.',
    category: 'musique',
    author: 'Rédaction ONE',
    authorImg: null,
    date: '2026-02-28',
    readTime: 5,
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=1400&q=85',
    featured: false,
    breaking: true,
    tags: ['boncana maïga', 'guinée', 'mali', 'africando', 'stars parade', 'hommage', 'décès'],
    views: 98400,
    body: `
      <h2>Un titan de la musique africaine s'éteint</h2>
      <p>Le maestro Boncana Maïga est décédé le samedi 28 février 2026 à la clinique Pasteur de Bamako, au Mali, à l'âge de 77 ans. La nouvelle a traversé le continent comme une onde de choc. Musicien, flûtiste de génie, arrangeur hors pair — Boncana Maïga était une institution vivante, l'un des rares artistes africains dont l'influence traverse toutes les frontières géographiques et musicales.</p>
      <h2>De Gao à La Havane : une vie entre deux mondes</h2>
      <p>Originaire de Gao, dans le nord du Mali, Boncana Maïga a construit une carrière unique en fusionnant les traditions musicales mandingues avec la salsa cubaine. Il a dirigé l'orchestre de la Radio Télévision Ivoirienne (RTI) et fondé <strong>Africando</strong>, le groupe qui a popularisé la musique afro-cubaine sur tout le continent. Il a arrangé des albums pour des artistes de légende : Alpha Blondy, Aïcha Koné, Abdoulaye Diabaté. Il a composé des bandes originales pour des films des cinéastes Ousmane Sembène et Henri Duparc.</p>
      <blockquote>« Boncana Maïga avait compris quelque chose que beaucoup mettent des décennies à saisir : la musique africaine n'a pas de frontières. Elle a des racines. »<br><em>— Doura Barry, artiste guinéen</em></blockquote>
      <h2>"Stars Parade" : la voix de toute une génération</h2>
      <p>Au-delà de ses compositions, c'est son émission radio <em>Stars Parade</em> qui a marqué des générations entières d'auditeurs africains. Une plateforme de découverte musicale, une école d'écoute, un rendez-vous sacré. En 1997, il reçoit le <strong>Kora Award</strong> de l'arrangeur — une consécration internationale. Il avait épousé Aicha Kamaldine Conté et arrangé des albums pour plusieurs voix guinéennes tout au long de sa carrière prolixe. L'Afrique perd l'un de ses plus grands bâtisseurs sonores.</p>
    `,
  },
  {
    id: 'a-032-anst',
    slug: 'anst-crazy-zenith-paris-11-septembre-2026-guinee',
    title: 'Ans-T Crazy au Zénith de Paris le 11 septembre : la Guinée vise le sommet',
    excerpt: 'Le roi de la "Guida" annonce un concert historique au Zénith Paris - La Villette pour le 11 septembre 2026. Pour Ans-T Crazy, ce n\'est pas juste une date — c\'est un projet national. Après Azaya, la Guinée urbaine s\'installe sur les plus grandes scènes parisiennes.',
    category: 'musique',
    author: 'Mamadou B.',
    authorImg: null,
    date: '2026-04-23',
    readTime: 4,
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1400&q=85',
    featured: true,
    breaking: false,
    tags: ['ans-t crazy', 'zénith paris', 'guinée', 'concert', 'guida', 'diaspora'],
    views: 74300,
    body: `
      <h2>Le Zénith, scène nationale guinéenne</h2>
      <p>Le 11 septembre 2026 au soir, le Zénith Paris - La Villette s'habillera aux couleurs rouge, jaune, vert. Ans-T Crazy, l'artiste guinéen connu pour son style "Guida" — une fusion entre les sonorités guinéennes et la musique urbaine — a officellement annoncé son concert à la célèbre salle parisienne lors d'une conférence de presse tenue le 23 avril au Jardin du 2 Octobre à Conakry.</p>
      <h2>"Ce concert est pour la Guinée"</h2>
      <p>L'artiste a été clair lors de sa prise de parole : <em>"Ce concert est pour la Guinée. Nous devons exporter nos talents."</em> Il a lancé un appel aux médias guinéens, aux influenceurs et à toute la diaspora pour se mobiliser derrière l'événement — le présentant comme une affaire nationale, pas une promotion personnelle. Il a également rendu hommage à Azaya (Mohamed Kamissoko), reconnaissant le rôle de son aîné dans l'ouverture de cette voie.</p>
      <blockquote>« Le Zénith, c'est la consécration d'un parcours. Mais c'est surtout la preuve que la musique guinéenne peut aller partout. »<br><em>— Ans-T Crazy, conférence de presse, Conakry, 23 avril 2026</em></blockquote>
      <h2>La Guinée à Paris, une dynamique qui s'installe</h2>
      <p>Après les concerts d'Azaya en France et les tournées de Takana Zion en Europe, le mouvement prend de l'ampleur. Les artistes guinéens de la diaspora comme Grain de Caf', MHD ou Black M ont ouvert la voie. Ans-T Crazy franchit une nouvelle étape : une salle de 6 000 places, une des plus emblématiques de Paris. Les billets sont disponibles. Le 11 septembre, la Guinée sera à Paris.</p>
    `,
  },
  {
    id: 'a-030',
    slug: 'takana-zion-patoranking-african-soldier-hommage-2026',
    title: 'Patoranking rend hommage à Takana Zion dans "African Soldier" — la Guinée au cœur de l\'Afrobeats',
    excerpt: 'Le Nigérian Patoranking a choisi Takana Zion, légende du reggae guinéen et lauréat de l\'AFRIMA, comme sujet de son nouveau clip "African Soldier". Un hommage qui place la Guinée au cœur du dialogue musical entre l\'Afrique de l\'Ouest et les Caraïbes.',
    category: 'musique',
    author: 'Amadou S.',
    authorImg: null,
    date: '2026-03-12',
    readTime: 4,
    image: 'https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?w=1400&q=85',
    featured: false,
    breaking: false,
    tags: ['takana zion', 'patoranking', 'african soldier', 'reggae guinéen', 'afrobeats', 'afrima'],
    views: 52800,
    body: `
      <h2>Takana Zion : le reggaeman guinéen que le monde découvre</h2>
      <p>Ibrahima Baldé, dit <strong>Takana Zion</strong>, est né à Conakry et a grandi entre la Guinée et la culture reggae jamaïcaine. Ses textes mêlent le français, l'anglais, le soussou, le peul et le malinké — autant de langues pour autant de publics. Lauréat du prix <strong>Meilleur Artiste Africain Reggae, Ragga & Dancehall</strong> aux AFRIMA (All Africa Music Awards) et récompensé aux Ivory Reggae Awards en Côte d'Ivoire, il s'est imposé comme la référence du reggae ouest-africain.</p>
      <h2>Patoranking et le clip "African Soldier"</h2>
      <p>En mars 2026, la star nigériane <strong>Patoranking</strong> a sorti "African Soldier", un clip dans lequel il rend explicitement hommage à Takana Zion comme figure fondatrice du reggae africain. Le clip, attendu depuis le 11 mars, a généré une vague de réactions sur les réseaux sociaux. Pour beaucoup, c'est la reconnaissance internationale que Takana Zion attendait depuis des années — portée non pas par une institution, mais par un pair.</p>
      <blockquote>« Takana Zion est une légende vivante. Il a ouvert la voie à une génération entière d'artistes africains qui refusent de choisir entre leurs racines et la modernité. »<br><em>— Patoranking, à propos d'"African Soldier"</em></blockquote>
      <h2>2026 : une année chargée pour Takana Zion</h2>
      <p>En début d'année 2026, Takana Zion avait déjà donné le ton en sortant le single <em>Love Yu Any How</em> le 14 février — un titre afrobeat plus mélodieux, faisant partie de son projet d'album 100% Afrobeat. Entre reggae, dancehall et afrobeat, il continue de tracer un chemin unique qui fait la fierté de toute la Guinée.</p>
    `,
  },
  {
    id: 'a-031',
    slug: 'bogolan-mode-africaine-tendances-2026',
    title: 'Le bogolan revient — et il n\'est plus seulement malien',
    excerpt: 'La technique ancestrale de teinture à la boue du Mali connaît une renaissance spectaculaire en 2026. Des créateurs de Lagos à Dakar, de Paris à Conakry, s\'en emparent, le déconstruisent, le réinventent. Le bogolan devient la langue commune de la mode africaine contemporaine.',
    category: 'mode',
    author: 'Inès K.',
    authorImg: null,
    date: '2026-05-05',
    readTime: 5,
    image: 'https://images.unsplash.com/photo-1523289333742-be1143f6b766?w=1400&q=85',
    featured: false,
    breaking: false,
    tags: ['bogolan', 'mode africaine', 'mali', 'tendances 2026', 'tissu', 'création'],
    views: 38900,
    body: `
      <h2>Qu'est-ce que le bogolan ?</h2>
      <p>Le bogolan (ou bokolanfini) est une technique de teinture textile originaire du Mali, pratiquée depuis des siècles par les femmes bambara. Le tissu est enduit de boue fermentée selon des motifs géométriques précis — chaque motif ayant un sens : protection, fertilité, statut social. Le résultat est une étoffe d'un brun caractéristique, aux contrastes saisissants.</p>
      <h2>2026 : la renaissance mondiale</h2>
      <p>Selon les spécialistes de la mode africaine, 2026 marque une <strong>renaissance spectaculaire</strong> du bogolan dans la création contemporaine. Des créateurs africains de Lagos, Dakar, Abidjan et même de la diaspora parisienne s'en emparent, le déconstruisent et le réimaginent en pièces wearables : vestes oversize, robes asymétriques, accessoires. Les motifs traditionnels côtoient des découpes streetwear — sans jamais trahir la technique.</p>
      <blockquote>« Les créateurs africains n'adaptent plus leurs collections aux standards occidentaux. Ils imposent leurs propres codes. Le bogolan en est la preuve la plus visible. »<br><em>— Africa Fashion Tour, janvier 2026</em></blockquote>
      <h2>Guinée : le bazin et le bogolan, même combat</h2>
      <p>En Guinée, le mouvement résonne fortement. Le bazin riche — tissu de prestige guinéen — suit une dynamique similaire : des créateurs émergents de Conakry le revisitent avec des coupes contemporaines et des broderies numériques. La mode africaine 2026 ne choisit plus entre tradition et modernité. Elle les fusionne.</p>
    `,
  },

];

/* ══════════════════════════════════════════════════════
   ONE CHART — Le Classement du Continent
   Sources : Apple Music CI · UK Official Afrobeats Chart ·
             Spotify Global Streams · Billboard Hot 100
   Mis à jour chaque lundi.
══════════════════════════════════════════════════════ */
const CHART_DATA = {
  weekLabel: 'Semaine du 25 mai 2026',
  updatedAt: '2026-05-25',
  sources: ['Apple Music CI', 'UK Afrobeats', 'Spotify', 'Billboard'],
  tracks: [
    {
      rank: 1,
      trend: 'new',
      artist: 'Himra',
      title: 'BARA BARA',
      album: 'DACHIBA KOUMGBA TCHAIBA : DALSHIM',
      country: '🇨🇮',
      countryName: 'Côte d\'Ivoire',
      genre: 'Nouchi/Rap',
      deezerQuery: 'Himra Bara Bara',
      cover: 'https://cdn-images.dzcdn.net/images/artist/a00bc6dcc86b10c1b03aa2372ab71a30/264x264-000000-80-0-0.jpg',
      stats: { streams: '233M', label: 'Spotify cumulé' },
      badges: [
        { label: '🇨🇮 #1', color: '#FFEF4D' },
        { label: 'Shazam CI', color: '#2A428C' },
        { label: '+5 pays', color: '#C6FF33' },
      ],
      weeks: 3,
      peak: 1,
      peakNew: true,
    },
    {
      rank: 2,
      trend: 'stable',
      artist: 'Tyla & Zara Larsson',
      title: 'She Did It Again',
      album: 'A*Pop',
      country: '🇿🇦',
      countryName: 'Afrique du Sud',
      genre: 'Amapop',
      deezerQuery: 'Tyla She Did It Again Zara Larsson',
      cover: 'https://cdn-images.dzcdn.net/images/artist/e3f8fad9e8d7c6b5a4f3e2d1c0b9a8f7/264x264-000000-80-0-0.jpg',
      stats: { streams: 'Hot 100 #59', label: 'Billboard' },
      badges: [
        { label: 'UK #1', color: '#FFEF4D' },
        { label: '5 semaines', color: '#7D39EB' },
        { label: 'Hot 100', color: '#2A428C' },
      ],
      weeks: 5,
      peak: 1,
    },
    {
      rank: 3,
      trend: 'up',
      artist: 'Wizkid & Asake',
      title: 'Turbulence',
      album: 'Single',
      country: '🇳🇬',
      countryName: 'Nigéria',
      genre: 'Afrobeats',
      deezerQuery: 'Wizkid Asake Turbulence',
      cover: 'https://cdn-images.dzcdn.net/images/artist/c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8/264x264-000000-80-0-0.jpg',
      stats: { streams: '20M+', label: 'Spotify' },
      badges: [
        { label: 'Vevo Global', color: '#FFEF4D' },
        { label: 'Top Afrobeats', color: '#C6FF33' },
      ],
      weeks: 6,
      peak: 2,
    },
    {
      rank: 4,
      trend: 'up',
      artist: 'Ayra Starr & Rema',
      title: 'Who\'s Dat Girl',
      album: 'Single',
      country: '🇳🇬',
      countryName: 'Nigéria',
      genre: 'Afropop',
      deezerQuery: 'Ayra Starr Rema Who\'s Dat Girl',
      cover: 'https://cdn-images.dzcdn.net/images/artist/d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9/264x264-000000-80-0-0.jpg',
      stats: { streams: '30M+', label: 'Spotify' },
      badges: [
        { label: 'UK #4', color: '#2A428C' },
        { label: 'Global', color: '#7D39EB' },
      ],
      weeks: 8,
      peak: 3,
    },
    {
      rank: 5,
      trend: 'new',
      artist: 'Didi B & Fally Ipupa',
      title: 'Cherie Coco',
      album: 'Bazarhoff & Diyilem',
      country: '🇨🇮🇨🇩',
      countryName: 'CI × Congo',
      genre: 'Afropop',
      deezerQuery: 'Didi B Fally Ipupa Cherie Coco',
      cover: 'https://cdn-images.dzcdn.net/images/artist/7ff0f0c21c16e60194e48395a79347e4/264x264-000000-80-0-0.jpg',
      stats: { streams: 'Apple CI', label: '#8' },
      badges: [
        { label: '🇨🇮 Top 10', color: '#FFEF4D' },
        { label: 'Collab', color: '#C6FF33' },
      ],
      weeks: 2,
      peak: 5,
      peakNew: true,
    },
    {
      rank: 6,
      trend: 'stable',
      artist: 'Asake',
      title: 'Forgiveness',
      album: 'Single',
      country: '🇳🇬',
      countryName: 'Nigéria',
      genre: 'Afrobeats',
      deezerQuery: 'Asake Forgiveness',
      cover: 'https://cdn-images.dzcdn.net/images/artist/e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0/264x264-000000-80-0-0.jpg',
      stats: { streams: 'UK #3', label: 'Official Chart' },
      badges: [
        { label: 'UK #3', color: '#2A428C' },
        { label: '3 semaines', color: '#7D39EB' },
      ],
      weeks: 3,
      peak: 3,
    },
    {
      rank: 7,
      trend: 'up',
      artist: 'Ameka Zrai',
      title: 'Adriano',
      album: 'Single',
      country: '🇨🇮',
      countryName: 'Côte d\'Ivoire',
      genre: 'Afro-Urbain',
      deezerQuery: 'Ameka Zrai Adriano',
      cover: 'https://cdn-images.dzcdn.net/images/artist/f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1/264x264-000000-80-0-0.jpg',
      stats: { streams: 'Apple CI', label: '#2' },
      badges: [
        { label: '🇨🇮 #2', color: '#FFEF4D' },
        { label: 'Buzz', color: '#C6FF33' },
      ],
      weeks: 4,
      peak: 2,
    },
  ],
  spotlight: {
    label: '🇬🇳 Guinée à l\'honneur',
    artist: 'Ans-T Crazy',
    note: 'Concert Zénith Paris · 11 septembre 2026',
    link: 'article.html?id=a-032-anst',
  },
};

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
