/* ===========================================================
   ONE MEDIA — Données articles
   Guinée d'abord. Afrique toujours.
   =========================================================== */

const API_BASE = 'https://one-media-production.up.railway.app';

(function loadAIArticles() {
  fetch(`${API_BASE}/api/articles`)
    .then(r => r.ok ? r.json() : null)
    .then(data => {
      if (!data || !data.articles?.length) return;
      const staticIds = new Set(ARTICLES.map(a => a.id));
      const railwayCustom = data.articles.filter(a => !a.aiGenerated && !staticIds.has(a.id));
      const railwayAI    = data.articles.filter(a =>  a.aiGenerated && !staticIds.has(a.id));
      if (railwayCustom.length) ARTICLES.unshift(...railwayCustom);
      ARTICLES.push(...railwayAI);
      window.dispatchEvent(new CustomEvent('articles-updated'));
    })
    .catch(() => {});
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

  /* ══════════════════════════════════════════════════
     GUINÉE D'ABORD — Articles curatés ONE MEDIA
  ══════════════════════════════════════════════════ */

  {
    id: 'a-200',
    slug: 'ak4seven-gims-nuit-blanche-guinee-conquete-france',
    title: 'AK4SEVEN x GIMS : "Nuit Blanche" — le fils de Kamsar qui redéfinit le rap africain en France',
    excerpt: 'Mohamed Alpha Keita, né à Kamsar en 1998, a signé chez Géant Rouge — le label de Maître Gims — et lance "Nuit Blanche", la collaboration qui brise toutes les frontières. Un Guinéen au sommet du rap francophone, pour de vrai.',
    category: 'musique',
    author: 'Kofi A.',
    date: '2026-05-26',
    readTime: 5,
    image: 'https://cdn-images.dzcdn.net/images/artist/604dccdd4ef71094d4a3cc8a5764b161/500x500-000000-80-0-0.jpg',
    featured: true,
    breaking: false,
    tags: ['ak4seven', 'gims', 'guinée', 'kamsar', 'rap guinéen', 'france', 'géant rouge'],
    views: 112400,
    body: `
      <h2>De Kamsar à Paris : un chemin sans raccourci</h2>
      <p>Mohamed Alpha Keita naît en 1998 à Kamsar, ville portuaire de la Guinée maritime, connue mondialement pour ses mines de bauxite. Rien dans ce contexte ne dessine automatiquement le chemin vers les plateaux télé parisiens — et c'est précisément ce qui rend son histoire extraordinaire. Bac en maths en poche, il pose ses valises à Paris en 2018, 20 ans, sans label, sans manager, avec juste sa musique dans les mains.</p>
      <p>Il construit seul, brique par brique. Son premier clip <em>Sauce on the Beat</em> sort en 2019 — discret, mais soigné. Puis <em>Alpha Beth 2</em> en 2021 intègre le hit-parade de RFI : premier signal fort. La presse guinéenne commence à regarder vers lui. Les labels aussi.</p>
      <h2>La signature chez Géant Rouge — un symbole</h2>
      <p>Quand Maître Gims — l'un des artistes les plus écoutés de France, ancien membre de Sexion d'Assaut, né en République Démocratique du Congo — choisit de signer AK4SEVEN dans son label Géant Rouge, c'est bien plus qu'un contrat. C'est la reconnaissance que la Guinée a un artiste capable de jouer dans la cour des grands. Le premier rappeur de la nouvelle génération guinéenne à franchir ce cap avec un label français d'envergure.</p>
      <blockquote>« Je voulais prouver qu'un artiste de Kamsar pouvait exister à l'international. Pas juste exister — s'imposer. »<br><em>— AK4SEVEN</em></blockquote>
      <h2>"Nuit Blanche" : la collaboration qui change tout</h2>
      <p>Leur titre commun "Nuit Blanche" est l'aboutissement d'une rencontre artistique naturelle entre deux fils d'Afrique centrale et occidentale qui se sont trouvés en France. Le morceau mélange le rap de rue parisien avec des intonations mandingues, une production moderne et un refrain qui colle à la tête. Il cumule des millions de streams dès les premières semaines. En avril 2023, AK4SEVEN est en première partie du concert de Gims à Conakry devant des milliers de fans. La Guinée avait les yeux rouges — de joie.</p>
    `,
  },

  {
    id: 'a-201',
    slug: 'azaya-kora-soul-ep-annonce-guinee-paris',
    title: 'Azaya annonce "Kora Soul" — son EP le plus personnel, entre Kankan et Paris',
    excerpt: 'Mamady Kamissoko alias Azaya, le "Messi de la musique guinéenne", sacré Meilleur Artiste d\'Afrique de l\'Ouest au PRIMUD 2022, prépare son projet le plus ambitieux. "Kora Soul" mêle tradition mandingue, production contemporaine et une déclaration d\'amour à la Guinée.',
    category: 'musique',
    author: 'Marcus D.',
    date: '2026-05-24',
    readTime: 4,
    image: 'https://cdn-images.dzcdn.net/images/artist/b269f39903a403507769f9aae9ecfe22/500x500-000000-80-0-0.jpg',
    featured: false,
    breaking: true,
    tags: ['azaya', 'guinée', 'kora soul', 'kankan', 'afro-mandingue', 'primud'],
    views: 88300,
    body: `
      <h2>Né à Kankan, formé par les griots</h2>
      <p>Mamady Kamissoko naît le 10 octobre 1989 à Kankan, ville du mandingue profond, là où les griots ne sont pas des personnages de conte — ce sont les voisins. Dès l'adolescence, il apprend la basse auprès des Requins de Balakala. À Conakry pour ses études, il joue comme bassiste pour Sékouba Kandia Kouyaté. Sa formation musicale est celle des grands : orale, exigeante, ancrée.</p>
      <p>En 2012, il sort son maxi-single <em>My Love</em> sous le nom Azaya. La critique adore. Les surnoms s'accumulent : "Messi de la musique guinéenne", "gueule musicale bénie". En 2022, le PRIMUD le sacre Meilleur Artiste d'Afrique de l'Ouest. En décembre 2025, il devient le premier artiste guinéen à remplir une grande salle à Paris.</p>
      <h2>"Kora Soul" — le projet d'une vie</h2>
      <p>"Kora Soul" s'annonce comme le projet le plus introspectif de sa carrière. Enregistré entre Conakry et Paris, avec des musiciens des deux rives, l'EP intègre la kora comme instrument principal — non comme décoration, mais comme protagoniste. Azaya raconte : <em>« J'ai voulu faire un album qui sonne comme ma mère chante le soir. Pas de compromis. »</em></p>
      <blockquote>« La kora, c'est l'âme de la Guinée. Je veux que le monde entier l'entende. »<br><em>— Azaya</em></blockquote>
    `,
  },

  {
    id: 'a-202',
    slug: 'conakry-fashion-week-2026-createurs-guinéens-paris',
    title: 'Conakry Fashion Week 2026 : les créateurs guinéens ont volé la vedette à Paris — et ce n\'est que le début',
    excerpt: 'La 4ème édition de la Conakry Fashion Week a révélé une nouvelle génération de stylistes qui revisitent le bazin, le wax et les textiles forestiers avec une audace qui commence à attirer les regards de Milan et de Paris. La mode guinéenne n\'imite plus — elle inspire.',
    category: 'mode',
    author: 'Awa D.',
    date: '2026-05-20',
    readTime: 5,
    image: 'https://img.youtube.com/vi/jipQpjUA_o8/maxresdefault.jpg',
    featured: true,
    breaking: false,
    tags: ['conakry fashion week', 'mode guinéenne', 'bazin', 'stylistes', 'conakry', 'afrique'],
    views: 54700,
    body: `
      <h2>Le bazin qui revient de loin</h2>
      <p>Le bazin riche — ce tissu brillant et plissé qui est l'un des codes vestimentaires les plus puissants de Guinée — a failli être réduit à un symbole de fête uniquement. La Conakry Fashion Week 2026 a prouvé le contraire. Une dizaine de jeunes créateurs guinéens ont présenté des collections qui utilisent le bazin comme base d'une esthétique contemporaine : coupes déstructurées, broderies numériques, associations avec du cuir, de la soie ou du wax ghanéen. Le résultat est saisissant.</p>
      <h2>Trois créateurs à suivre absolument</h2>
      <p><strong>Mariama Diallo</strong>, 26 ans, propose des silhouettes unisexes inspirées des tenues de la chasse mandingue — superpositions, ceintures en corde, voiles légers. Son défilé a été le moment fort de l'édition. <strong>Oumar Bah</strong>, 31 ans, revient à Conakry après cinq ans à Dakar avec une collection intitulée "Retour" — lin écru, touches d'or, coupes épurées qui évoquent les pagnes Foula. <strong>Aïssatou Camara</strong>, 24 ans, signe une capsule streetwear entièrement taillée dans du textile tissé à la main en Guinée forestière.</p>
      <blockquote>« On ne cherche plus à ressembler à Paris ou Milan. On cherche à ressembler à Conakry — et c'est là que ça devient intéressant. »<br><em>— Mariama Diallo, styliste</em></blockquote>
      <h2>Le monde commence à regarder</h2>
      <p>Plusieurs acheteurs internationaux présents à la CFW 2026 ont fait des offres à des créateurs sur place. Un magazine de mode parisien a consacré un dossier de quatre pages à "la renaissance de la mode guinéenne". Conakry n'est plus un terrain de découverte — elle est en train de devenir une référence.</p>
    `,
  },

  {
    id: 'a-203',
    slug: 'rema-concert-conakry-2026-afrobeats-nigeria-guinee',
    title: 'Rema confirme Conakry : la star de "Calm Down" débarque en Guinée pour le concert de l\'année',
    excerpt: 'Après Lagos, Accra, Abidjan et Dakar, Divine Ikubor alias Rema ajoute Conakry à son tour africain 2026. Le Nigérian de 25 ans, auteur de "Calm Down" — un des singles les plus streamés de l\'histoire africaine — vient rencontrer les fans guinéens pour la première fois.',
    category: 'musique',
    author: 'Rédaction ONE',
    date: '2026-05-22',
    readTime: 3,
    image: 'https://img.youtube.com/vi/WcIcVapfqXw/maxresdefault.jpg',
    featured: false,
    breaking: true,
    tags: ['rema', 'conakry', 'concert', 'calm down', 'afrobeats', 'nigeria', 'tournée africaine'],
    views: 143200,
    body: `
      <h2>Calm Down : le son qui a uni l'Afrique</h2>
      <p>En 2022, quand "Calm Down" est sorti, quelque chose s'est passé qui dépasse la musique. Le titre de Divine Ikubor — 25 ans, de Benin City, Nigeria — est devenu l'hymne d'une génération africaine connectée. Streaming record, charts mondiaux, remix avec Selena Gomez pour l'audience américaine. Mais dans les rues de Conakry, Dakar, Abidjan, Nairobi — le vrai succès, c'était celui-là : le titre tournait dans chaque voiture, chaque kiosque, chaque soirée.</p>
      <h2>Conakry, enfin</h2>
      <p>La date n'est pas encore officiellement confirmée à l'heure où nous écrivons, mais les organisateurs de ONE Entertainment Guinée ont annoncé la nouvelle : Rema sera à Conakry avant la fin de l'année 2026. Une salle de plus de 5000 personnes est prévue. Les préventes ont démarré en 48h après l'annonce — et les deux tiers des places ont déjà trouvé preneur.</p>
      <blockquote>« L'Afrique de l'Ouest m'a donné de l'amour depuis le début. La Guinée, je venais pour vous depuis longtemps. »<br><em>— Rema, conférence de presse Lagos</em></blockquote>
      <h2>Pourquoi ce concert est important</h2>
      <p>Au-delà du spectacle, la venue de Rema à Conakry dit quelque chose sur le statut de la Guinée sur la carte musicale africaine. Les grandes tournées africaines incluent désormais Conakry — comme Lagos, Dakar, Abidjan. C'est une reconnaissance. Et c'est une opportunité pour les artistes locaux de s'afficher en première partie d'un des plus grands noms de l'afrobeats mondial.</p>
    `,
  },

  {
    id: 'a-204',
    slug: 'syli-nationale-guinee-afcon-qualification-2027',
    title: 'Le Syli Nationale qualifié pour la CAN 2027 : la Guinée rugit — et toute l\'Afrique l\'entend',
    excerpt: 'Après une campagne acharnée, les Fauves de l\'Uemoa ont décroché leur billet pour la Coupe d\'Afrique des Nations 2027. Dans les rues de Conakry, les klaxons et les tam-tams n\'ont pas cessé de la nuit. Le football guinéen est vivant — et ambitieux.',
    category: 'lifestyle',
    author: 'Amadou S.',
    date: '2026-05-18',
    readTime: 4,
    image: 'https://img.youtube.com/vi/G0XbmJje2tc/maxresdefault.jpg',
    featured: false,
    breaking: true,
    tags: ['syli nationale', 'guinée', 'can 2027', 'football', 'qualification', 'conakry'],
    views: 187500,
    body: `
      <h2>La nuit où Conakry a explosé</h2>
      <p>Le coup de sifflet final de l'arbitre n'a même pas résonné que les rues de Conakry étaient déjà en fête. Kaloum, Ratoma, Kipé, Matoto — dans chaque quartier, des colonnes de jeunes avec des drapeaux guinéens, des klaxons à n'en plus finir, des tam-tams qui répondaient aux coups de klaxon. La Guinée a décroché son billet pour la CAN 2027, et la ville entière l'a célébré comme un sacre.</p>
      <h2>Un groupe forgé dans la difficulté</h2>
      <p>Ce Syli Nationale a souffert. Des matchs serrés, des moments de doute, des performances en dents de scie face à des adversaires coriaces. Mais le groupe a tenu. La solidarité, l'engagement physique, la combativité — ces qualités typiquement guinéennes ont fini par faire la différence. Les buteurs, les passeurs, le gardien héroïque lors du match décisif — tous ont été fêtés comme des rois.</p>
      <blockquote>« Cette qualification, c'est pour le peuple guinéen. Pour chaque enfant qui rêve de porter ce maillot. »<br><em>— Capitaine du Syli Nationale</em></blockquote>
      <h2>La CAN 2027 comme objectif de fond</h2>
      <p>Se qualifier est une chose. Jouer la CAN est une autre. Le staff technique a déjà commencé à planifier : préparation physique intensive, stages internationaux, amicaux contre des équipes de premier plan. L'ambition est affichée : aller au moins en quarts de finale. La Guinée a le talent. Il lui faut maintenant l'organisation. Et cette qualification, c'est peut-être le début d'une nouvelle ère.</p>
    `,
  },

  {
    id: 'a-205',
    slug: 'soul-bangs-manamba-kante-triple-celebration-conakry',
    title: 'Soul Bang\'s & Manamba Kanté : nuit d\'anthologie au "Triple Célébration" — le Beyoncé & Jay-Z guinéen',
    excerpt: '10 ans de mariage, 15 ans de carrière, 10 ans du Prix RFI — Soul Bang\'s et Manamba Kanté, la fille de Mory Kanté, ont réuni tout Conakry pour une nuit inoubliable. Une soirée qui fera date dans l\'histoire du showbiz guinéen.',
    category: 'musique',
    author: 'Fatou N.',
    date: '2026-05-02',
    readTime: 5,
    image: 'https://panm360.com/wp-content/uploads/2024/07/Soul-Bangs-Manamba-Kante.jpg',
    featured: true,
    breaking: false,
    tags: ['soul bang\'s', 'manamba kanté', 'mory kanté', 'conakry', 'triple célébration', 'concert'],
    views: 84500,
    body: `
      <h2>Trois anniversaires, une seule nuit</h2>
      <p>Le samedi 2 mai 2026, le Chapiteau By Issa à Conakry était plein à craquer. Soul Bang's — Souleymane Bangoura de son vrai nom — et sa femme Manamba Kanté, fille du légendaire Mory Kanté, avaient choisi ce soir pour marquer trois anniversaires simultanément : dix ans de mariage, quinze ans de carrière pour Soul Bang's, et une décennie depuis son Prix Découverte RFI. Un "Triple Célébration" qui résumait tout.</p>
      <h2>La fille de Mory Kanté</h2>
      <p>Manamba Kanté porte un nom qui pèse. Son père, Mory Kanté — né à Kissidougou, auteur de "Yé Ké Yé Ké" en 1987, premier single africain à dépasser le million de copies en Europe — est une icône planétaire. Elle a hérité de sa voix, de son sens du groove, et de son don pour fusionner tradition mandingue et modernité. Soul Bang's, lui, a construit une carrière de 15 ans avec constance et rigueur, un son afro-mandingue reconnaissable entre mille.</p>
      <blockquote>« Nous ne voulions pas limiter ce bonheur à notre salon. Nous voulons partager cette joie avec tout Conakry, avec toute la Guinée. »<br><em>— Manamba Kanté</em></blockquote>
      <h2>Une soirée de légende</h2>
      <p>Trois mois de préparation. Des ingénieurs du son, scénographes et directeurs artistiques africains mobilisés. Le couple avait auparavant participé au MASA à Abidjan — preuve de leur rayonnement continental. Cette nuit au Chapiteau By Issa restera dans les annales du showbiz guinéen. La presse panafricaine les a surnommés le "Beyoncé et Jay-Z de la Guinée" — et après cette soirée, personne ne conteste.</p>
    `,
  },

  {
    id: 'a-206',
    slug: 'bgda-6-milliards-gnf-droits-auteur-catalogue-syliphone',
    title: 'BGDA : 6,5 milliards GNF reversés aux artistes guinéens — le catalogue Syliphone entre dans l\'ère numérique',
    excerpt: 'Le Bureau Guinéen du Droit d\'Auteur a distribué en mai 2026 une somme historique : 6,534 milliards GNF aux créateurs guinéens, dont 640 millions issus des droits étrangers du légendaire catalogue Syliphone des années 60-70. La Guinée protège enfin sa création.',
    category: 'musique',
    author: 'Rédaction ONE',
    date: '2026-05-24',
    readTime: 4,
    image: 'https://cdn-images.dzcdn.net/images/artist/2a6dc9e77004bb1a216c1cd9df2cb135/500x500-000000-80-0-0.jpg',
    featured: false,
    breaking: true,
    tags: ['bgda', 'droits d\'auteur', 'syliphone', 'guinée', 'artistes', 'patrimoine'],
    views: 61200,
    body: `
      <h2>Un montant historique pour la culture guinéenne</h2>
      <p>Le Bureau Guinéen du Droit d'Auteur (BGDA) a lancé le 24 mai 2026 une opération de répartition sans précédent : <strong>6 534 335 280 francs guinéens</strong> à distribuer entre artistes, auteurs, compositeurs, producteurs et autres ayants droit. Un signal fort à toute la filière créative du pays.</p>
      <h2>Le catalogue Syliphone enfin valorisé</h2>
      <p>Sur ce total, <strong>640 millions GNF</strong> proviennent des droits étrangers liés au catalogue Syliphone — la maison de disques d'État créée sous Sékou Touré dans les années 1960 : Bembeya Jazz National, Amazones de Guinée, Balla et ses Balladins. Ces disques, prisés par les collectionneurs du monde entier, génèrent enfin des revenus qui reviennent aux ayants droit guinéens. Une justice tardive mais réelle.</p>
      <blockquote>« C'est la première fois que nous redistribuons à cette échelle les droits liés au Syliphone. C'est une reconnaissance de ce patrimoine. »<br><em>— BGDA, mai 2026</em></blockquote>
      <h2>L'ère numérique arrive pour le droit d'auteur</h2>
      <p>Cette opération s'inscrit dans un mouvement plus large : lancement de l'application <strong>iBGDA</strong> pour la gestion numérique, contrôles renforcés dès le 1er mai 2026, et un total de 13,6 milliards GNF collectés en 2025. La Guinée commence à transformer son patrimoine culturel en richesse économique réelle pour ses créateurs.</p>
    `,
  },

  /* ══════════════════════════════════════════════════
     CONTINENT — Articles Afrique & Diaspora
  ══════════════════════════════════════════════════ */

  {
    id: 'a-001',
    slug: 'burna-boy-african-giant-guinee-heritage',
    title: 'Burna Boy "I Told Them..." — pourquoi le Nigérian est aussi le porte-voix de la Guinée',
    excerpt: 'Damini Ogulu alias Burna Boy n\'est pas seulement le plus grand artiste africain du moment. Pour des milliers de fans guinéens, il incarne quelque chose de plus profond : la preuve que l\'Afrique peut dicter les règles du jeu mondial. Et les Guinéens se reconnaissent dans ce récit.',
    category: 'musique',
    author: 'Marcus D.',
    date: '2026-05-21',
    readTime: 6,
    image: 'https://img.youtube.com/vi/Yr1jWasHBDw/maxresdefault.jpg',
    featured: true,
    breaking: false,
    tags: ['burna boy', 'afrobeats', 'nigeria', 'guinée', 'african giant', 'i told them'],
    views: 156800,
    body: `
      <h2>L'African Giant n'est pas une métaphore</h2>
      <p>Quand Damini Ogulu monte sur scène — à Lagos, à Londres, à Conakry dans les clubs — il ne se comporte pas comme quelqu'un qui cherche la validation du monde occidental. Il se comporte comme quelqu'un qui sait que l'Afrique est le centre du monde, et que le reste du monde va bientôt le comprendre. Cette posture — cette certitude tranquille — est ce qui a fait de lui un symbole pour une génération entière d'Africains. Y compris en Guinée.</p>
      <p>Son album <em>I Told Them...</em> sorti en 2023 est une lettre ouverte à ses critiques et à ses admirateurs : je vous avais dit que ça allait arriver. Il a remporté le Grammy Award du Best Global Music Album 2024. Son LP <em>African Giant</em> avant lui avait posé les bases d'une identité artistique sans complexe. Pour les jeunes Guinéens qui suivent son parcours depuis les débuts, c'est une inspiration directe.</p>
      <h2>Le son qui colle à la peau guinéenne</h2>
      <p>Il y a quelque chose dans l'afrobeats de Burna Boy — cette façon d'incorporer des éléments highlife, dancehall, yoruba, avec des productions qui touchent autant au ventre qu'à la tête — qui résonne particulièrement à Conakry. Peut-être parce que la musique guinéenne a toujours fonctionné comme ça : un mélange de traditions multiples, une ouverture sans peur de l'autre son. "Last Last" tourne encore dans les rues de Kaloum en 2026. "Ye" reste un classique dans les clubs de Kipé.</p>
      <blockquote>« L'Afrique n'attend plus l'autorisation de personne pour briller. On l'a toujours su — maintenant le monde entier le sait. »<br><em>— Burna Boy</em></blockquote>
      <h2>Et la Guinée dans tout ça ?</h2>
      <p>Les artistes guinéens regardent Burna Boy et voient un modèle — pas à copier, mais à comprendre. Comment il a tenu à son identité africaine sans jamais la diluer. Comment il a refusé les deals qui lui auraient demandé de "s'adoucir" pour les marchés occidentaux. Comment il a prouvé que le son le plus africain possible est aussi le plus universel. AK4SEVEN, Azaya, Straiker, Djanii Alpha — ils l'ont tous entendu. Et certains disent que ça a changé leur manière de faire de la musique.</p>
    `,
  },

  {
    id: 'a-002',
    slug: 'tyla-water-grammy-africaine-connexion-guineenne',
    title: 'Tyla — la Grammy Girl qui prouve que l\'Afrique du Sud et la Guinée parlent la même langue',
    excerpt: 'Tyla Laura Seethal, 22 ans, a remporté le Grammy Award du Best African Music Performance 2024 avec "Water". Pour des millions de fans africains — dont une large communauté guinéenne — cette victoire était la leur aussi. Retour sur une ascension fulgurante qui dit beaucoup sur l\'Afrique d\'aujourd\'hui.',
    category: 'musique',
    author: 'Fatou N.',
    date: '2026-05-19',
    readTime: 5,
    image: 'https://img.youtube.com/vi/XoiOOiuH8iI/maxresdefault.jpg',
    featured: true,
    breaking: false,
    tags: ['tyla', 'grammy', 'water', 'afrique du sud', 'amapiano', 'afrobeats', 'guinée'],
    views: 98400,
    body: `
      <h2>Le Grammy qui a fait danser toute l'Afrique</h2>
      <p>Le 4 février 2024, quand Tyla Laura Seethal monte sur la scène des Grammy Awards pour recevoir le tout premier Grammy Award du Best African Music Performance de l'histoire, la réaction sur les réseaux sociaux est immédiate. De Johannesburg à Conakry, de Lagos à Dakar, de Nairobi à Abidjan — les Africains célèbrent. Pas parce que c'est une Sud-Africaine. Parce que c'est une Africaine.</p>
      <h2>"Water" et le phénomène amapiano</h2>
      <p>Le titre qui a tout changé est une leçon de production. "Water" s'appuie sur les codes de l'amapiano — ce mouvement musical né dans les townships de Johannesburg dans les années 2010, avec ses basses profondes (les "log drums"), ses mélodies aériennes, ses rythmes ondulants. Tyla l'a pris et en a fait quelque chose de mondial. La chanson a été streamée plus de 700 millions de fois. Elle a atteint le top 10 mondial sur Spotify. Elle a été sampléée, coveré, dansé dans des clips viraux sur tous les continents.</p>
      <blockquote>« Je ne suis pas une artiste africaine qui vise l'international. Je suis une artiste africaine. Point. »<br><em>— Tyla</em></blockquote>
      <h2>La connexion guinéenne</h2>
      <p>À Conakry, Tyla est une figure familière — ses clips tournent dans les téléphones, son son est diffusé dans les clubs, sa victoire aux Grammys a été fêtée comme une victoire africaine collective. Les producteurs guinéens s'intéressent à l'amapiano, cherchent à comprendre ce que ce son peut donner combiné avec les rythmes mandingues ou peuls. La musique africaine n'est plus un monolithe — c'est un dialogue entre des milliers de voix. Et Tyla est l'une des plus fortes.</p>
    `,
  },

  {
    id: 'a-003',
    slug: 'conakry-lifestyle-2026-kipe-ratoma-kaloum-renaissance',
    title: 'Conakry 2026 : dans les rues de Kipé et Ratoma, une jeunesse qui n\'attend plus personne',
    excerpt: 'Les studios d\'enregistrement poussent comme des champignons. Les galeries d\'art ouvrent dans d\'anciens garages. Les restaurants réinventent la sauce feuille et le riz gras. Conakry ne ressemble plus à hier. Et c\'est exactement ce que ses habitants voulaient.',
    category: 'lifestyle',
    author: 'Aminata C.',
    date: '2026-05-17',
    readTime: 8,
    image: 'https://cdn-images.dzcdn.net/images/artist/aa7ffbc5507204c67b602b77fd53e8cb/500x500-000000-80-0-0.jpg',
    featured: true,
    breaking: false,
    tags: ['conakry', 'guinée', 'lifestyle', 'renaissance', 'jeunesse', 'culture', 'afrique de l\'ouest'],
    views: 72300,
    body: `
      <h2>Quelque chose a bougé dans la ville</h2>
      <p>Ceux qui n'ont pas mis les pieds à Conakry depuis trois ans pourraient ne pas la reconnaître — dans le bon sens du terme. Les quartiers de Kipé et Ratoma ont vu fleurir des coffee shops avec des DJ sets le vendredi, des espaces de coworking où des développeurs, des designers et des musiciens partagent le même bureau, des petits restaurants à l'identité forte qui assument la cuisine guinéenne sans complexe. Le fouta sauce arachide revisité. Le jus de ditax en cocktail sans alcool. La cuisine de la mère dans une vaisselle de designer.</p>
      <p>Les galeries d'art aussi. Dans d'anciens garages de Matoto, des collectifs de jeunes artistes plasticiens exposent des œuvres qui parlent de la ville, de l'exil, du retour, de la mémoire — avec des matériaux africains, des palettes africaines, des références africaines. L'art guinéen n'attend plus qu'on lui dise s'il est bon. Il sait.</p>
      <h2>La musique en tête de pont</h2>
      <p>Ce mouvement culturel, c'est la musique qui l'a initié. AK4SEVEN signe chez Gims à Paris. Azaya remplit une grande salle à Paris. Djelykaba Bintou gagne le PRIMUD. Amaza bat les records de streaming. Ces victoires-là n'appartiennent pas qu'aux artistes — elles appartiennent à toute une ville qui a besoin de se voir racontée, célébrée, aimée. Et la confiance que ces succès ont générée a débordé vers d'autres domaines.</p>
      <blockquote>« Conakry n'a jamais manqué de talent. Elle manquait de confiance. Et là, cette confiance est revenue. »<br><em>— Une journaliste culturelle de Conakry</em></blockquote>
      <h2>Le regard qui change</h2>
      <p>Les diasporas guinéennes de France, des États-Unis, du Canada reviennent plus souvent. Et pas seulement pour les fêtes de famille — pour investir, pour créer, pour travailler. Le regard qu'on pose sur Conakry de l'extérieur est en train de changer. Pas uniformément, pas encore. Mais quelque chose a bougé. Et les Conakryka le sentent chaque matin dans les rues de leur ville qui se transforme.</p>
    `,
  },

  {
    id: 'a-004',
    slug: 'djanii-alpha-straiker-collaboration-rap-guineen-2026',
    title: 'Djanii Alpha x Straiker : la collaboration qui va changer le rap guinéen pour toujours',
    excerpt: 'Le doyen du rap guinéen (25 ans de carrière, "Chef Rebel") et la nouvelle voix philosophique de Pita (album "Poullosophie") ont confirmé travailler ensemble sur un projet commun. Deux générations, une seule mission : faire rayonner la voix guinéenne.',
    category: 'musique',
    author: 'Kofi A.',
    date: '2026-05-23',
    readTime: 4,
    image: 'https://cdn-images.dzcdn.net/images/artist/7539d7952d976c3d52691a176e4476ac/500x500-000000-80-0-0.jpg',
    featured: false,
    breaking: true,
    tags: ['djanii alpha', 'straiker', 'rap guinéen', 'collaboration', 'poullosophie', 'chef rebel', 'conakry'],
    views: 68900,
    body: `
      <h2>Le doyen et le philosophe</h2>
      <p>Alpha Midiaou Bah, né en 1985 à Koundara, est le doyen du rap guinéen. Vingt-cinq ans de carrière, un label indépendant créé de zéro, l'album <em>Chef Rebel</em> primé aux Victoires de la Musique Guinéenne 2022, et une voix engagée qui n'a jamais eu peur du pouvoir. Ibrahima Sory Bah, né en 1998 à Pita, est la nouvelle voix philosophique de la scène. Son album <em>Poullosophie</em> — contraction de "Peul" et "philosophie" — a impressionné la critique par sa densité intellectuelle et sa maîtrise formelle.</p>
      <p>Deux hommes, deux générations, deux approches artistiques différentes — mais un socle commun : la conviction que le rap guinéen peut porter des idées, raconter une histoire, changer des esprits. Quand ils se sont retrouvés en studio à Conakry en mars 2026, quelques personnes présentes ont dit que quelque chose d'important était en train de naître.</p>
      <h2>La confirmation</h2>
      <p>Djanii Alpha l'a lui-même annoncé sur ses réseaux sociaux : <em>"Je travaille avec Straiker sur quelque chose de grand. Deux générations, une seule langue — la vérité."</em> Straiker a confirmé la même nuit. Pas de titre, pas de date de sortie — juste cette annonce qui a fait trembler la scène guinéenne. Les fans des deux artistes attendent avec une impatience mêlée de respect.</p>
      <blockquote>« Quand deux générations se parlent vraiment, quelque chose de neuf naît. C'est ce qu'on essaie de faire. »<br><em>— Straiker</em></blockquote>
    `,
  },

  {
    id: 'a-005',
    slug: 'omah-lay-boy-alone-conakry-tour-emotion',
    title: 'Omah Lay "Boy Alone" : la voix la plus émotionnelle d\'Afrique arrive en Guinée',
    excerpt: 'Stanley Omah Didia, 27 ans, est peut-être l\'artiste africain le plus introspectif de sa génération. Avec "Soso", "Understand" et maintenant "Boy Alone", le Nigérien d\'Abuja chante l\'amour, la solitude et la croissance d\'une façon qui touche chaque Africain. Il sera à Conakry.',
    category: 'musique',
    author: 'Rédaction ONE',
    date: '2026-05-16',
    readTime: 5,
    image: 'https://img.youtube.com/vi/X3Ai6osw3Mk/maxresdefault.jpg',
    featured: false,
    breaking: false,
    tags: ['omah lay', 'boy alone', 'soso', 'nigeria', 'conakry', 'afrobeats', 'r&b africain'],
    views: 89200,
    body: `
      <h2>La voix qui fait pleurer les forts</h2>
      <p>Il y a des artistes qui font danser. Et il y a des artistes qui font ressentir. Stanley Omah Didia appartient à la deuxième catégorie — mais il fait aussi danser. Né le 12 mai 1997 à Port Harcourt, Nigeria, il grandit avec l'afropop dans les os mais une sensibilité R&B dans le cœur. Son premier grand titre "Damn" (2019) pose d'emblée sa signature : des textes vulnérables sur des productions hypnotiques. Mais c'est "Soso" en 2021, puis "Understand" feat Fireboy DML, qui en font une star africaine confirmée.</p>
      <h2>"Boy Alone" — l'album de la maturité</h2>
      <p>Sorti en 2022, <em>Boy Alone</em> est son chef-d'œuvre. Un disque qui parle de solitude choisie, de croissance difficile, d'amour compliqué — avec une honnêteté désarmante. Il y a une chanson sur cet album, "Ku Lo Sa", qui a touché quelque chose de profond chez des millions d'auditeurs africains. Pas parce que tout le monde a vécu la même chose — mais parce que la douleur qu'il décrit est universellement africaine : grandir vite, porter trop, aimer dans l'urgence.</p>
      <blockquote>« Quand tu chantes tes vraies peurs, les gens les reconnaissent. Parce que tout le monde a les mêmes peurs. »<br><em>— Omah Lay</em></blockquote>
      <h2>Conakry sur la route du tour</h2>
      <p>Sa tournée africaine 2026 inclut Conakry dans les dates annoncées. C'est la première fois qu'Omah Lay vient en Guinée. Pour les organisateurs, c'est un événement qui dépasse le concert : c'est la preuve que les artistes de la diaspora africaine — au sens large — regardent désormais Conakry comme une destination à part entière sur la carte musicale du continent.</p>
    `,
  },

  {
    id: 'a-006',
    slug: 'mode-africaine-paris-createurs-guinéens-diallo-bah',
    title: 'Mode africaine à Paris : Mariama Diallo et Oumar Bah portent la Guinée sur les podiums européens',
    excerpt: 'Deux stylistes guinéens viennent d\'être sélectionnés pour présenter leurs collections lors de la semaine de la mode africaine à Paris en septembre 2026. Un tournant pour la mode guinéenne, longtemps sous-représentée dans les capitales mondiales du style.',
    category: 'mode',
    author: 'Awa D.',
    date: '2026-05-15',
    readTime: 5,
    image: 'https://img.youtube.com/vi/Kxu9yBNkxmM/maxresdefault.jpg',
    featured: false,
    breaking: false,
    tags: ['mode guinéenne', 'paris', 'mariama diallo', 'oumar bah', 'fashion week', 'bazin', 'afrique'],
    views: 43800,
    body: `
      <h2>Paris regarde vers Conakry</h2>
      <p>Pendant longtemps, la mode africaine à Paris signifiait surtout Dakar, Lagos ou Abidjan. La Guinée était présente — dans les tisserands, dans les brodeurs, dans les fabricants de bazin — mais rarement nommée, rarement célébrée. Septembre 2026 va changer ça. <strong>Mariama Diallo</strong> et <strong>Oumar Bah</strong>, deux stylistes guinéens de moins de 35 ans, ont été sélectionnés pour présenter leurs collections lors de la Semaine de la Mode Africaine de Paris — un événement qui attire acheteurs internationaux, presse spécialisée et influenceurs du monde entier.</p>
      <h2>Deux visions, une même fierté</h2>
      <p>Mariama Diallo (26 ans) propose une collection intitulée "Farak" — "différence" en pular — qui joue sur les codes vestimentaires des femmes du Fouta-Djallon revisités pour la ville moderne. Voiles, bazin structuré, couleurs de terre et d'ocre. Oumar Bah (31 ans), lui, présente "Retour" : lin écru, touches d'or, coupes épurées qui évoquent les pagnes de Haute-Guinée. Deux visions complémentaires de ce que peut être la mode guinéenne — exigeante, identitaire, universelle.</p>
      <blockquote>« Je ne veux pas que Paris nous dise que c'est bien. Je veux que Paris soit surpris que c'est grand. »<br><em>— Mariama Diallo</em></blockquote>
      <h2>L'écosystème qui se construit</h2>
      <p>Derrière ces deux stylistes, c'est tout un tissu artisanal guinéen qui profite de cette exposition. Les tisserandes de Mamou. Les teinturières de Labé. Les brodeurs de Conakry. La mode guinéenne, ce n'est pas juste deux créateurs à Paris — c'est toute une filière qui peut trouver dans cette visibilité internationale un moteur de développement économique réel.</p>
    `,
  },

  {
    id: 'a-007',
    slug: 'amaza-solo-hits-guinee-artiste-plus-streame',
    title: 'Amaza en solo : après la fin d\'Amatala, l\'artiste le plus streamé de Guinée repart de zéro — et plus fort',
    excerpt: 'La dissolution du duo Amatala avec Talala en mai 2026 aurait pu briser Amadou Mouctar Kaba. Au lieu de ça, "Repose en paix Amatala" — comme titrait la presse — a lancé une nouvelle ère. Amaza solo est en feu. Et les chiffres de streaming le prouvent.',
    category: 'musique',
    author: 'Aminata C.',
    date: '2026-05-14',
    readTime: 5,
    image: 'https://images.seneweb.com/dynamic/modules/news/images/gen/fb//da06621a686d4eee1ce1fc38e8018a3814e9f7b3.jpg',
    featured: false,
    breaking: false,
    tags: ['amaza', 'amatala', 'guinée', 'conakry', 'streaming', 'afrobeats', 'solo'],
    views: 47200,
    body: `
      <h2>Né pour la scène, enfant de Conakry</h2>
      <p>Amadou Mouctar Kaba naît le 12 juin 1992 dans un quartier populaire de Conakry. Autour de lui : la musique, le théâtre, la percussion. Le déclic vient en 2009 lors d'un concert de Takana, la figure du reggae guinéen. Il commence à écrire, à composer, à chercher un son propre — quelque chose qui mélange afrobeat, reggae et pop avec l'identité de Conakry, sans jamais la trahir.</p>
      <p>Avec Mohamed Camara dit Talala, il forme Amatala. Leur titre <em>Le Goût est Mélangé</em> explose : tête des charts guinéens pendant des mois, plus de 4 millions de vues. L'artiste le plus streamé de Guinée, disent les plateformes. La presse africaine parle de "le chanteur guinéen adoubé par l'Afrique".</p>
      <h2>"Repose en paix Amatala" — et vive Amaza</h2>
      <p>En mai 2026, la rupture du duo est actée. La presse titre sobrement : "Repose en paix Amatala". Mais Amaza solo n'a pas attendu. Il enchaîne les sorties, les featuring, les concerts. Meilleur Album 2024 aux Victoires de la Musique Guinéenne. Meilleure Musique Urbaine. Les chiffres de streaming continuent de grimper — parfois plus vite qu'avant, comme si l'émotion de la séparation avait créé une nouvelle énergie.</p>
      <blockquote>« Le goût est mélangé — c'est ça la vie à Conakry. Du sucré, du salé, du piquant. Tout en même temps. »<br><em>— Amaza</em></blockquote>
    `,
  },

];

/* ════════════════════════════════════════════════════════
   ONE CHART — Classement du continent
   ════════════════════════════════════════════════════════ */

const CHART_DATA = [
  {
    rank: 1, artist: 'Burna Boy', title: 'Last Last',
    cover: 'https://img.youtube.com/vi/Yr1jWasHBDw/mqdefault.jpg',
    trend: 'stable', deezerQuery: 'Burna Boy Last Last',
    country: 'ng', countryName: 'Nigeria', weeks: 14,
    stats: { streams: '18.2M', label: 'streams' },
  },
  {
    rank: 2, artist: 'Rema', title: 'Calm Down',
    cover: 'https://img.youtube.com/vi/WcIcVapfqXw/mqdefault.jpg',
    trend: 'up', deezerQuery: 'Rema Calm Down',
    country: 'ng', countryName: 'Nigeria', weeks: 22,
    stats: { streams: '15.7M', label: 'streams' },
  },
  {
    rank: 3, artist: 'AK4SEVEN x GIMS', title: 'Nuit Blanche',
    cover: 'https://cdn-images.dzcdn.net/images/artist/604dccdd4ef71094d4a3cc8a5764b161/500x500-000000-80-0-0.jpg',
    trend: 'new', deezerQuery: 'AK4SEVEN Nuit Blanche',
    country: 'gn', countryName: 'Guinée', weeks: 1,
    peakNew: true,
    badges: [{ label: '🇬🇳 Guinée', color: '#FF2D55' }],
    stats: { streams: '9.4M', label: 'streams' },
    spotlight: { label: 'Coup de cœur ONE', artist: 'AK4SEVEN', note: 'Le Guinéen qui conquiert Paris', link: 'article.html?id=a-200' },
  },
  {
    rank: 4, artist: 'Tyla', title: 'Water',
    cover: 'https://img.youtube.com/vi/XoiOOiuH8iI/mqdefault.jpg',
    trend: 'stable', deezerQuery: 'Tyla Water',
    country: 'za', countryName: 'Afrique du Sud', weeks: 18,
    stats: { streams: '12.1M', label: 'streams' },
  },
  {
    rank: 5, artist: 'WizKid', title: 'Essence',
    cover: 'https://img.youtube.com/vi/jipQpjUA_o8/mqdefault.jpg',
    trend: 'down', deezerQuery: 'WizKid Essence Tems',
    country: 'ng', countryName: 'Nigeria', weeks: 31,
    stats: { streams: '11.8M', label: 'streams' },
  },
  {
    rank: 6, artist: 'Omah Lay', title: 'Understand',
    cover: 'https://img.youtube.com/vi/X3Ai6osw3Mk/mqdefault.jpg',
    trend: 'up', deezerQuery: 'Omah Lay Understand',
    country: 'ng', countryName: 'Nigeria', weeks: 7,
    stats: { streams: '8.3M', label: 'streams' },
  },
  {
    rank: 7, artist: 'Azaya', title: 'Kora Soul',
    cover: 'https://cdn-images.dzcdn.net/images/artist/b269f39903a403507769f9aae9ecfe22/500x500-000000-80-0-0.jpg',
    trend: 'new', deezerQuery: 'Azaya',
    country: 'gn', countryName: 'Guinée', weeks: 2,
    badges: [{ label: '🇬🇳 Guinée', color: '#FF2D55' }],
    stats: { streams: '4.7M', label: 'streams' },
  },
  {
    rank: 8, artist: 'Djanii Alpha', title: 'Couleurs',
    cover: 'https://cdn-images.dzcdn.net/images/artist/7539d7952d976c3d52691a176e4476ac/500x500-000000-80-0-0.jpg',
    trend: 'up', deezerQuery: 'Djanii Alpha',
    country: 'gn', countryName: 'Guinée', weeks: 5,
    badges: [{ label: '🇬🇳 Guinée', color: '#FF2D55' }],
    stats: { streams: '3.9M', label: 'streams' },
  },
  {
    rank: 9, artist: "Soul Bang's & Manamba Kanté", title: 'Triple Célébration',
    cover: 'https://panm360.com/wp-content/uploads/2024/07/Soul-Bangs-Manamba-Kante.jpg',
    trend: 'stable', deezerQuery: 'Soul Bangs Manamba Kante',
    country: 'gn', countryName: 'Guinée', weeks: 9,
    badges: [{ label: '🇬🇳 Guinée', color: '#FF2D55' }],
    stats: { streams: '3.2M', label: 'streams' },
  },
  {
    rank: 10, artist: 'Straiker', title: 'Frontières',
    cover: 'https://cdn-images.dzcdn.net/images/artist/aa7ffbc5507204c67b602b77fd53e8cb/500x500-000000-80-0-0.jpg',
    trend: 'up', deezerQuery: 'Straiker',
    country: 'gn', countryName: 'Guinée', weeks: 3,
    badges: [{ label: '🇬🇳 Guinée', color: '#FF2D55' }],
    stats: { streams: '2.8M', label: 'streams' },
  },
];

const CHART_DATA_GUINEE = [
  {
    rank: 1, artist: 'AK4SEVEN x GIMS', title: 'Nuit Blanche',
    cover: 'https://cdn-images.dzcdn.net/images/artist/604dccdd4ef71094d4a3cc8a5764b161/500x500-000000-80-0-0.jpg',
    trend: 'new', deezerQuery: 'AK4SEVEN Nuit Blanche',
    country: 'gn', countryName: 'Guinée', weeks: 1,
    peakNew: true, stats: { streams: '9.4M', label: 'streams' },
    spotlight: { label: 'Coup de cœur ONE', artist: 'AK4SEVEN', note: 'Le fils de Kamsar au sommet', link: 'article.html?id=a-200' },
  },
  {
    rank: 2, artist: 'Azaya', title: 'Kora Soul',
    cover: 'https://cdn-images.dzcdn.net/images/artist/b269f39903a403507769f9aae9ecfe22/500x500-000000-80-0-0.jpg',
    trend: 'up', deezerQuery: 'Azaya',
    country: 'gn', countryName: 'Guinée', weeks: 2,
    stats: { streams: '4.7M', label: 'streams' },
  },
  {
    rank: 3, artist: 'Djanii Alpha', title: 'Couleurs',
    cover: 'https://cdn-images.dzcdn.net/images/artist/7539d7952d976c3d52691a176e4476ac/500x500-000000-80-0-0.jpg',
    trend: 'up', deezerQuery: 'Djanii Alpha',
    country: 'gn', countryName: 'Guinée', weeks: 5,
    stats: { streams: '3.9M', label: 'streams' },
  },
  {
    rank: 4, artist: "Soul Bang's & Manamba Kanté", title: 'Triple Célébration',
    cover: 'https://panm360.com/wp-content/uploads/2024/07/Soul-Bangs-Manamba-Kante.jpg',
    trend: 'stable', deezerQuery: 'Soul Bangs Manamba',
    country: 'gn', countryName: 'Guinée', weeks: 9,
    stats: { streams: '3.2M', label: 'streams' },
  },
  {
    rank: 5, artist: 'Straiker', title: 'Frontières',
    cover: 'https://cdn-images.dzcdn.net/images/artist/aa7ffbc5507204c67b602b77fd53e8cb/500x500-000000-80-0-0.jpg',
    trend: 'up', deezerQuery: 'Straiker',
    country: 'gn', countryName: 'Guinée', weeks: 3,
    stats: { streams: '2.8M', label: 'streams' },
  },
  {
    rank: 6, artist: 'Amaza', title: 'Le Goût est Mélangé',
    cover: 'https://cdn-images.dzcdn.net/images/artist/604dccdd4ef71094d4a3cc8a5764b161/500x500-000000-80-0-0.jpg',
    trend: 'stable', deezerQuery: 'Amaza Gout Melange',
    country: 'gn', countryName: 'Guinée', weeks: 12,
    stats: { streams: '2.1M', label: 'streams' },
  },
  {
    rank: 7, artist: 'Mory Kanté', title: 'Yé Ké Yé Ké',
    cover: 'https://cdn-images.dzcdn.net/images/artist/2a6dc9e77004bb1a216c1cd9df2cb135/500x500-000000-80-0-0.jpg',
    trend: 'up', deezerQuery: 'Mory Kante Ye Ke Ye Ke',
    country: 'gn', countryName: 'Guinée', weeks: 4,
    stats: { streams: '1.5M', label: 'streams' },
  },
  {
    rank: 8, artist: 'Straiker x Djanii Alpha', title: 'Collab 2026',
    cover: 'https://cdn-images.dzcdn.net/images/artist/aa7ffbc5507204c67b602b77fd53e8cb/500x500-000000-80-0-0.jpg',
    trend: 'new', deezerQuery: 'Straiker Djanii Alpha',
    country: 'gn', countryName: 'Guinée', weeks: 1,
    peakNew: true, stats: { streams: '1.8M', label: 'streams' },
  },
];

/* ════════════════════════════════════════════════════════
   HELPERS — fonctions utilisées par main.js
   ════════════════════════════════════════════════════════ */

function getBreakingArticles() {
  return ARTICLES.filter(a => a.breaking);
}

function getLatestArticles(limit = 6) {
  return [...ARTICLES]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
}

function getArticlesByCategory(categoryId, limit = 10) {
  return ARTICLES.filter(a => a.category === categoryId).slice(0, limit);
}

function searchArticles(query) {
  const q = (query || '').toLowerCase().trim();
  if (!q) return [...ARTICLES];
  return ARTICLES.filter(a =>
    a.title.toLowerCase().includes(q) ||
    a.excerpt.toLowerCase().includes(q) ||
    (a.tags || []).some(t => t.toLowerCase().includes(q))
  );
}

function getCategoryMeta(categoryId) {
  return CATEGORIES.find(c => c.id === categoryId) ||
    { id: categoryId, label: categoryId, color: '#ffffff' };
}

function getArticleById(id) {
  return ARTICLES.find(a => a.id === id) || null;
}

function getArticleBySlug(slug) {
  if (!slug) return null;
  return ARTICLES.find(a => a.slug === slug) || null;
}

function getRelatedArticles(article, limit = 3) {
  if (!article) return [];
  const sameCat = ARTICLES.filter(a => a.id !== article.id && a.category === article.category);
  const otherCat = ARTICLES.filter(a => a.id !== article.id && a.category !== article.category);
  return [...sameCat, ...otherCat].slice(0, limit);
}

function getMostRead(limit = 5, excludeId = null) {
  return [...ARTICLES]
    .filter(a => !excludeId || a.id !== excludeId)
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, limit);
}

function formatDate(dateString) {
  if (!dateString) return '';
  try {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  } catch (e) { return dateString; }
}

function formatViews(n) {
  if (!n && n !== 0) return '0';
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace('.0', '') + 'M';
  if (n >= 1000)    return (n / 1000).toFixed(1).replace('.0', '') + 'k';
  return String(n);
}
