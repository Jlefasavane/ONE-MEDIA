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
     GUINÉE & AFRIQUE — Articles curatés ONE MEDIA
  ══════════════════════════════════════════════════ */

  {
    id: 'c-001',
    slug: 'elhadj-ibrahima-balde-boxe-titre-mondial-wbc-guinee',
    title: 'Elhadj Ibrahima Baldé : le poing de Guinée qui vise le titre mondial WBC des super-welters',
    excerpt: 'Invaincu en 19 combats, 16 victoires par KO, un style dévastateur forgé dans les salles de Matoto — Elhadj Ibrahima Baldé est le secret le mieux gardé de la boxe africaine. Il combat pour le titre continental en juillet. Et ensuite, il vise Las Vegas.',
    category: 'lifestyle',
    author: 'Amadou S.',
    date: '2026-05-27',
    readTime: 5,
    image: 'https://img.youtube.com/vi/G0XbmJje2tc/maxresdefault.jpg',
    featured: true,
    breaking: true,
    tags: ['boxe', 'guinée', 'ibrahima baldé', 'wbc', 'sport', 'conakry', 'matoto'],
    views: 214300,
    body: `
      <h2>19-0. 16 KO. Zéro défaite.</h2>
      <p>Il y a des statistiques qui parlent d'elles-mêmes. Elhadj Ibrahima Baldé, 26 ans, né dans le quartier de Matoto à Conakry, est invaincu depuis ses débuts professionnels en 2020. Dix-neuf combats, seize victoires avant la limite — dont cinq par KO au premier round. Son style est celui d'un chasseur : patient, analytique dans les premiers rounds, explosif quand il sent la faiblesse. Ses adversaires connaissent en général le moment exact où ils ont perdu. C'est quand il les touche la première fois vraiment.</p>
      <p>Formé dès l'âge de 12 ans dans la salle du club Étoile Noire de Matoto, Baldé a grandi avec la boxe comme discipline de vie autant que sport. "Mon entraîneur m'a appris à ne jamais frapper en colère. La colère, c'est de l'énergie gaspillée. Tu frappes quand tu as calculé." Cette philosophie froide explique son efficacité. Il ne détruit pas ses adversaires — il les déchiffre, puis les conclut.</p>
      <h2>Le titre continental, premier palier</h2>
      <p>Le 18 juillet 2026, Baldé montera sur le ring à Abidjan pour le titre WBC Continental Afrique des super-welters. Son adversaire : un Ivoirien expérimenté, 31 combats au compteur, jamais KO. Pour l'équipe Baldé, c'est exactement le test qu'ils voulaient. "On ne progresse pas en battant des gens faciles", dit son manager. La Guinée sera devant ses écrans.</p>
      <blockquote>« Je boxe pour ma famille, pour Matoto, pour la Guinée. Mais je boxe aussi pour prouver que l'Afrique de l'Ouest produit des champions mondiaux — pas seulement des espoirs. »<br><em>— Elhadj Ibrahima Baldé</em></blockquote>
      <h2>Las Vegas comme horizon</h2>
      <p>Son promoteur américain — contacté après une vidéo virale d'un de ses KO — a été clair : si Baldé remporte le titre continental, une exposition aux États-Unis est programmée pour début 2027. Madison Square Garden ou T-Mobile Arena à Las Vegas. Un Guinéen sous les grandes lumières de la boxe mondiale. La route est tracée. Il reste à la boxer.</p>
    `,
  },

  {
    id: 'c-002',
    slug: 'guinea-surf-coast-bel-air-atlantique-tourisme-inconnu',
    title: 'La côte guinéenne que personne ne connaît : surf, mangroves et plages vierges à 30 minutes de Conakry',
    excerpt: 'Pendant que le monde entier se presse à Dakar ou Abidjan, la Guinée garde un secret : des kilomètres de plages de sable blanc, des vagues de surf entre Coyah et Dubréka, et une côte atlantique encore quasi-vierge. Le tourisme guinéen attend son heure — et elle arrive.',
    category: 'lifestyle',
    author: 'Aminata C.',
    date: '2026-05-25',
    readTime: 6,
    image: 'https://img.youtube.com/vi/XoiOOiuH8iI/maxresdefault.jpg',
    featured: false,
    breaking: false,
    tags: ['guinée', 'surf', 'tourisme', 'côte atlantique', 'bel air', 'conakry', 'plage'],
    views: 89700,
    body: `
      <h2>La plus belle plage d'Afrique de l'Ouest que vous n'avez jamais vue</h2>
      <p>À 35 kilomètres de Conakry, en direction de Dubréka, la route longe une côte que la plupart des Conakrykois eux-mêmes n'ont jamais explorée. Des plages de sable fin, des eaux atlantiques claires le matin avant que les vents ne se lèvent, des mangroves habitées de milliers d'oiseaux que vous ne trouverez nulle part ailleurs en Afrique de l'Ouest. Et presque personne. Voilà ce que la Guinée maritime a gardé pour elle — par manque d'infrastructure, par manque de promotion, par timidité peut-être.</p>
      <p>La plage de Bel-Air est la plus connue des locaux qui savent. Un spot de surf discret, avec des droites et des gauches de qualité honorable entre novembre et mars, quand la houle atlantique gonfle. Quelques Guinéens de la diaspora française qui ont surfé à Hossegor et Biarritz sont revenus avec des planches et ont commencé à partager le spot. Des surfeurs sénégalais ont commencé à faire le détour. Le bouche-à-oreille travaille en silence.</p>
      <h2>Le tourisme qui se construit sans bruit</h2>
      <p>Plusieurs lodges de petite taille ont ouvert ces trois dernières années entre Conakry et Coyah — construits avec des matériaux locaux, gérés par des familles guinéennes, avec une cuisine qui honore la tradition soussou côtière. Poisson braisé, tilapia grillé à la braise avec du citron et du piment, crevettes géantes de l'estuaire du Konkouré — une gastronomie maritime que personne ne raconte encore. Les premières reviews sur des plateformes de voyage internationales commencent à apparaître. La réputation se construit.</p>
      <blockquote>« On a tout ici. L'Atlantique, les mangroves, les îles de Loos à 20 minutes de bateau, une culture soussou côtière extraordinaire. On n'a juste jamais crié assez fort. »<br><em>— Guide touristique local, Coyah</em></blockquote>
      <h2>Les îles de Loos — le trésor oublié</h2>
      <p>À 20 minutes de bateau depuis le port de Conakry, l'archipel des îles de Loos offre des plages dignes des Maldives — sans les Maldives. Trois îles principales, des eaux turquoise, du corail intact, des tortues marines qui nichent encore sur certaines plages. Le potentiel est vertigineux. Les obstacles sont réels aussi — accès difficile, peu d'hébergement, manque de promotion institutionnelle. Mais ça change. Lentement, mais ça change.</p>
    `,
  },

  {
    id: 'c-003',
    slug: 'playlist-definitif-guinee-2026-20-sons-essentiels',
    title: '20 sons qui définissent la Guinée en 2026 — la playlist que vous mettez dans la voiture et vous ne changez plus',
    excerpt: 'Du mandingue électrique à l\'afrobeats de Conakry, du coupé-décalé local au rap pular de Labé — on a sélectionné les 20 titres qui capturent l\'énergie de la Guinée musicale en ce moment. Coupez tout. Mettez ça. Montez le volume.',
    category: 'musique',
    author: 'Kofi A.',
    date: '2026-05-24',
    readTime: 4,
    image: 'https://cdn-images.dzcdn.net/images/artist/b269f39903a403507769f9aae9ecfe22/500x500-000000-80-0-0.jpg',
    featured: true,
    breaking: false,
    tags: ['playlist', 'guinée', 'musique guinéenne', 'top 20', '2026', 'afrobeats', 'mandingue'],
    views: 178900,
    body: `
      <h2>Les règles de cette sélection</h2>
      <p>Pas de nostalgie. On aime Bembeya Jazz et Mory Kanté — mais cette liste, c'est 2026. Des sons sortis ces 18 derniers mois, ou des titres plus anciens qui tournent encore parce qu'ils sont inusables. Et on a cherché la diversité : toutes les régions, toutes les langues, tous les genres. La Guinée n'est pas un son. C'est plusieurs sons qui coexistent. On vous les donne tous.</p>
      <h2>Les 20 incontournables</h2>
      <p><strong>1. Azaya — "Mon Étoile"</strong> : La voix qui arrête les conversations. Un afro-mandingue avec une ligne de basse qui colle pendant trois jours.</p>
      <p><strong>2. Straiker — "Pita"</strong> : Le rap pular de Labé qui devient universel. Pour ceux qui pensaient que le rap en langue locale ne pouvait pas toucher un public large.</p>
      <p><strong>3. AK4SEVEN — "Diaspora"</strong> : Avant "Nuit Blanche" avec Gims, il y avait ça. L'hymne de tous les Guinéens de l'extérieur.</p>
      <p><strong>4. Djanii Alpha — "Koundara"</strong> : 25 ans de carrière. Il sait toujours quelque chose que les jeunes ne savent pas encore.</p>
      <p><strong>5. Amaza — "On Est Chaud"</strong> : La post-Amatala en pleine forme. Ce titre prouve que la séparation du duo a libéré quelque chose.</p>
      <p><strong>6. Soul Bang's — "Mandingue Road"</strong> : Afrobeat avec une âme mandingue. La fusion qui sonne naturelle parce qu'elle l'est.</p>
      <p><strong>7. Djelly Moussa Kouyaté — "Kora Dreams"</strong> : La kora en 2026. Électronique, jazz modal, tradition. Le futur de la musique traditionnelle guinéenne.</p>
      <p><strong>8. Didi B — "Kpangor" (feat. artiste guinéen)</strong> : L'Ivoirien qui ramène les Guinéens dans ses featurings. Signe d'un respect continental.</p>
      <p><strong>9. Manamba Kanté — "Fille de"</strong> : Solo. Sans Soul Bang's. Elle prouve qu'elle n'avait pas besoin de l'ombre de son mari.</p>
      <p><strong>10. Mariama Kouyaté — "Fouta"</strong> : Voix traditionnelle peule sur une production électronique parisienne. Bouleversant.</p>
      <p><strong>11–20 :</strong> Takana Zion · DK Any Many · Bintou Diarra · Lass Guinée · Moussou Diallo · Aminata Kouyaté · Mohamed Kouyaté · Les Ambassadeurs Revisités · Sekouba Bambino Fête · Baloji feat. Guinéen de la diaspora.</p>
      <blockquote>« La Guinée musicale de 2026, c'est une conversation entre plusieurs générations, plusieurs langues, plusieurs influences. Et cette conversation est passionnante. »<br><em>— Rédaction ONE MEDIA</em></blockquote>
    `,
  },

  {
    id: 'c-004',
    slug: 'nft-art-numerique-conakry-artistes-blockchain-afrique',
    title: 'NFT et art numérique à Conakry : la révolution silencieuse que personne ne couvre',
    excerpt: 'Pendant que le monde débat des NFT, une dizaine d\'artistes visuels guinéens les utilisent concrètement pour vendre leurs œuvres directement à des collectionneurs du monde entier — sans galerie, sans intermédiaire, sans visa pour voyager. L\'art numérique est peut-être la meilleure nouvelle pour la création africaine en ce moment.',
    category: 'art',
    author: 'Marcus D.',
    date: '2026-05-22',
    readTime: 5,
    image: 'https://cdn-images.dzcdn.net/images/artist/2a6dc9e77004bb1a216c1cd9df2cb135/500x500-000000-80-0-0.jpg',
    featured: false,
    breaking: false,
    tags: ['nft', 'art numérique', 'conakry', 'blockchain', 'artistes guinéens', 'web3', 'afrique'],
    views: 62400,
    body: `
      <h2>Le problème que le NFT résout pour les artistes africains</h2>
      <p>Un artiste plasticien de Conakry veut vendre ses œuvres à un collectionneur parisien. Problème numéro un : comment envoyer l'œuvre physique ? Problème numéro deux : comment être payé de manière sécurisée depuis l'étranger ? Problème numéro trois : comment accéder aux galeries et aux foires internationales sans visa, sans billet d'avion, sans réseau ? Le NFT — Non-Fungible Token, jeton non fongible sur blockchain — ne résout pas tout. Mais il résout ces trois problèmes-là. Et pour des artistes guinéens, c'est une révolution.</p>
      <p>Depuis 2023, un collectif informel d'artistes visuels basés à Conakry s'est formé autour du NFT. Ils s'appellent "Guinée Digital Art Collective". Ils sont une douzaine. Certains font de la peinture numérique — des portraits de femmes guinéennes en style afrofuturiste, des paysages du Fouta-Djallon en palette cyberpunk, des scènes de marché de Madina en pixel art haute résolution. D'autres créent des animations 3D inspirées des masques de Guinée forestière. Tous vendent sur OpenSea et Foundation.</p>
      <h2>Les chiffres qui changent des vies</h2>
      <p>Sans révéler de noms, plusieurs membres du collectif ont vendu des œuvres entre 500 et 3 000 dollars à des collectionneurs basés en Europe, aux États-Unis et au Japon. Pour des artistes qui peinaient à vendre localement pour 50 000 GNF, c'est un changement de vie. L'argent arrive en crypto, qu'ils convertissent via des plateformes locales ou des services de la diaspora.</p>
      <blockquote>« Pour la première fois, je peux vendre mon travail au prix qu'il vaut — pas au prix que quelqu'un ici est prêt à payer. Le monde entier est mon marché. »<br><em>— Artiste membre du collectif, Conakry</em></blockquote>
      <h2>Les limites et les risques</h2>
      <p>La volatilité des cryptomonnaies reste un danger réel. Le marché NFT a connu des crashs sévères. Et l'accès à internet stable reste un luxe dans certains quartiers de Conakry. Mais le principe est établi : la technologie blockchain peut donner aux artistes africains un accès direct au marché mondial de l'art, en court-circuitant des intermédiaires qui, historiquement, prenaient la majorité de la valeur créée.</p>
    `,
  },

  {
    id: 'c-005',
    slug: 'interview-aminata-bah-ingenieure-nasa-guinee-spatiale',
    title: 'Interview — Aminata Bah, ingénieure guinéenne à la NASA : "Personne ne m\'avait dit qu\'une fille de Labé pouvait travailler sur Mars"',
    excerpt: 'À 32 ans, Aminata Bah est ingénieure en systèmes de propulsion au Jet Propulsion Laboratory de la NASA à Pasadena. Née à Labé, élevée à Conakry, formée en France puis aux États-Unis — elle travaille sur la prochaine mission martienne. Rencontre avec une Guinéenne qui a fait l\'impossible sa routine.',
    category: 'interview',
    author: 'Fatou N.',
    date: '2026-05-21',
    readTime: 8,
    image: 'https://img.youtube.com/vi/RUqOI7lWam0/maxresdefault.jpg',
    featured: true,
    breaking: false,
    tags: ['aminata bah', 'nasa', 'guinée', 'labé', 'ingénieure', 'mars', 'sciences', 'diaspora'],
    views: 241800,
    body: `
      <h2>De Labé au Jet Propulsion Laboratory</h2>
      <p><strong>ONE MEDIA :</strong> Aminata, quand tu étais enfant à Labé, est-ce que tu imaginais un jour travailler à la NASA ?</p>
      <p><strong>Aminata Bah :</strong> Honnêtement, non. Pas parce que je n'avais pas d'ambition — mais parce que personne ne m'avait montré que c'était possible. Je n'avais pas de modèle qui ressemblait à moi dans ce domaine. Quand je regardais les documentaires sur l'espace à la télévision, je ne voyais jamais une femme africaine. Alors ça n'existait pas dans mon imagination. C'est pour ça que je parle aujourd'hui — pour que les petites filles de Labé qui regardent le ciel la nuit sachent que l'espace est aussi pour elles.</p>
      <p><strong>ONE :</strong> Comment tu as franchi ce chemin, concrètement ?</p>
      <p><strong>Aminata :</strong> Bac scientifique au lycée de Labé avec mention très bien. Bourse d'excellence pour l'École Centrale de Lyon — génie mécanique. Ensuite un master en propulsion aérospatiale à l'ISAE-SUPAERO à Toulouse. Puis un doctorat en California Institute of Technology — Caltech — à Pasadena. C'est là que j'ai été repérée par le JPL. Chaque étape a demandé un travail immense. Mais à aucun moment je n'ai pensé que c'était impossible. J'avais juste décidé que ça allait se faire.</p>
      <h2>Travailler sur Mars</h2>
      <p><strong>ONE :</strong> Sur quoi travailles-tu exactement en ce moment ?</p>
      <p><strong>Aminata :</strong> Je ne peux pas donner de détails techniques sur la mission en cours. Ce que je peux dire : je travaille sur les systèmes de propulsion pour la prochaine mission de retour d'échantillons martiens. On conçoit des moteurs qui doivent fonctionner dans une atmosphère que nous n'avons jamais visitée physiquement. Avec des marges d'erreur proches de zéro. C'est le travail le plus exigeant et le plus passionnant que j'aie jamais fait.</p>
      <blockquote>« Le jour où j'ai vu mon nom dans un rapport de mission NASA, j'ai pensé à ma mère à Labé. Elle m'a appris à travailler. Elle ne savait pas pour quoi. »<br><em>— Aminata Bah</em></blockquote>
      <h2>Le message à la Guinée</h2>
      <p><strong>ONE :</strong> Qu'est-ce que tu veux dire aux jeunes Guinéens qui te lisent ?</p>
      <p><strong>Aminata :</strong> Que la géographie de votre naissance n'est pas une condamnation. Que le monde a besoin de vos cerveaux — pas de votre exotisme, de votre intelligence. Et qu'il faut choisir les études les plus difficiles que vous puissiez suivre. Pas les plus sûres. Les plus difficiles. Parce que c'est là que se trouvent les opportunités que personne d'autre ne voit encore.</p>
    `,
  },

  {
    id: 'c-006',
    slug: 'gastronomie-10-plats-guinéens-monde-devrait-connaitre',
    title: 'Les 10 plats guinéens que le monde entier devrait connaître (et ne connaît pas encore)',
    excerpt: 'La sauce feuille. Le riz gras au poulet. Le fouta dontoni. La soupe kandja. La bouillie de fonio. La Guinée a une des gastronomies les plus riches et les moins connues du continent africain. On répare ça maintenant.',
    category: 'lifestyle',
    author: 'Aminata C.',
    date: '2026-05-20',
    readTime: 5,
    image: 'https://cdn-images.dzcdn.net/images/artist/aa7ffbc5507204c67b602b77fd53e8cb/500x500-000000-80-0-0.jpg',
    featured: false,
    breaking: false,
    tags: ['gastronomie', 'guinée', 'cuisine', 'sauce feuille', 'riz gras', 'fonio', 'conakry', 'labé'],
    views: 134600,
    body: `
      <h2>Le problème de la cuisine guinéenne</h2>
      <p>La cuisine sénégalaise a le thiéboudienne. La cuisine ivoirienne a l'attiéké et le poulet braisé. La cuisine ghanéenne a le jollof. La cuisine guinéenne a tout ça — et plus encore — mais n'a pas encore trouvé son ambassadeur mondial. Ce n'est pas une question de qualité. C'est une question de narration. On est en train d'y remédier.</p>
      <h2>Les 10 indispensables</h2>
      <p><strong>1. La Sauce Feuille</strong> — La reine absolue. Une sauce à base de feuilles de manioc pilées, de palmiste, de poisson fumé, de viande ou de crevettes séchées. Longue à préparer (4 à 6 heures minimum), inimitable. Servie sur du riz blanc. C'est le plat de la mère. Le plat du dimanche. Le plat du cœur.</p>
      <p><strong>2. Le Riz Gras au Poulet</strong> — Pas le jollof rice. Le riz gras guinéen a ses épices propres : du soumbara (néré fermenté), du poivre de Guinée, une cuisson dans le bouillon de viande réduit. La croûte au fond de la casserole — le "grillé" — est un délice que les non-initiés ne comprennent pas encore.</p>
      <p><strong>3. Le Fouta Dontoni</strong> — Spécialité peule de Haute-Guinée. Une sorte de boule de mil ou de sorgho, servie avec une sauce à base de lait caillé et de beurre de karité. Simple en apparence, complexe en goût. Le comfort food de la région de Labé et Mamou.</p>
      <p><strong>4. La Soupe Kandja</strong> — Soupe à base de gombo frais, de palmiste, de poisson ou de viande. Une texture épaisse, un goût umami prononcé. Servie sur du riz ou mangée seule avec du pain guinéen.</p>
      <p><strong>5. Le Foutou avec Sauce Pistache</strong> — Le foutou de banane plantain pilé, avec une sauce d'arachides grillées et pilées, tomates, piment, poisson fumé. L'équivalent guinéen du fufu west-africain, mais avec une identité propre.</p>
      <p><strong>6. Le Tô de Fonio</strong> — Le fonio est une céréale ancestrale de Guinée, remise en valeur par la gastronomie internationale. Le tô de fonio — une pâte épaisse à base de fonio cuit — est son expression la plus traditionnelle. Riche en minéraux, sans gluten, d'un goût délicat.</p>
      <p><strong>7. Les Crevettes de l'Estuaire du Konkouré</strong> — Des crevettes géantes de l'estuaire guinéen, braisées sur des braises de bois de palme, avec du jus de citron vert et du piment frais. Un produit d'une qualité exceptionnelle que les restaurants européens paieraient très cher.</p>
      <p><strong>8. Le Haricot Rouge Sauté</strong> — Street food de Conakry. Des haricots rouges sautés à l'huile de palme avec des épices, de l'oignon et du poisson séché. Servi dans un sachet en plastique ou sur une feuille de bananier. Le meilleur fast food de la ville.</p>
      <p><strong>9. La Bouillie de Mil au Lait</strong> — Petit-déjeuner roi dans tout le pays. Mil ou sorgho cuit dans de l'eau, assaisonné de lait caillé, de sucre et parfois de poudre d'arachide. Chaud, onctueux, énergétique. La Guinée se réveille avec ça depuis des siècles.</p>
      <p><strong>10. Le Pain Guinéen Beurré</strong> — Dernier de la liste mais pas le moindre. Le pain guinéen — cuit dans des fours à bois, croustillant dehors, moelleux dedans — avec du beurre de karité ou de la margarine et du café Nescafé sucré. Le breakfast iconique des quartiers populaires. Vous ne pouvez pas venir à Conakry sans ça.</p>
    `,
  },

  {
    id: 'c-007',
    slug: 'reggae-guineen-retour-nouvelle-generation-takana-zion',
    title: 'Le retour du reggae guinéen : après Takana Zion, une nouvelle génération rallume la flamme roots à Conakry',
    excerpt: 'Il y a dix ans, Takana Zion définissait seul le reggae guinéen sur la scène africaine. Aujourd\'hui, cinq jeunes artistes de Conakry, Kindia et Mamou font vivre un son qui semblait en voie de disparition. Le reggae guinéen n\'est pas mort — il préparait son retour.',
    category: 'musique',
    author: 'Marcus D.',
    date: '2026-05-18',
    readTime: 5,
    image: 'https://cdn-images.dzcdn.net/images/artist/7539d7952d976c3d52691a176e4476ac/500x500-000000-80-0-0.jpg',
    featured: false,
    breaking: false,
    tags: ['reggae guinéen', 'takana zion', 'conakry', 'roots', 'guinée', 'nouvelle génération', 'musique'],
    views: 71200,
    body: `
      <h2>L'héritage Takana</h2>
      <p>Alpha Camara dit Takana Zion est une figure. Depuis ses débuts à Conakry dans les années 2000, il a défini ce que peut être le reggae en Guinée : une musique de résistance, de spiritualité, de fierté africaine, portée par une voix puissante et des paroles qui ne font pas de compromis. Il a joué avec des légendes jamaïcaines. Il a représenté la Guinée dans des festivals du monde entier. Il a prouvé que le reggae n'appartient pas à la Jamaïque — il appartient à ceux qui ont quelque chose à dire.</p>
      <p>Mais Takana Zion ne peut pas être partout. Et pendant quelques années, le reggae guinéen a semblé sur pause — comme si la scène attendait de savoir qui allait porter le flambeau après lui.</p>
      <h2>Les cinq noms à retenir</h2>
      <p><strong>Roots Ibrahima</strong> (Conakry, 24 ans) — Un son qui mélange le reggae roots jamaïcain classique avec des paroles en mandingue. Son EP "Kora Roots" sorti en mars 2026 a été très bien accueilli.</p>
      <p><strong>Sita Danaya</strong> (Kindia, 27 ans) — La voix féminine du reggae guinéen. Sa façon de chanter le Fouta-Djallon sur des riddims modernes est unique.</p>
      <p><strong>Lion de Mamou</strong> (Mamou, 29 ans) — Dancehall roots avec des influences afrobeat. Le son le plus dansant de la nouvelle vague.</p>
      <p><strong>Junior Kora</strong> (Conakry, 22 ans) — Le plus jeune. Le plus expérimental. Il incorpore de l'électronique et de la kora dans ses productions reggae. Un son inédit.</p>
      <p><strong>Griot Rebel</strong> (Kankan, 31 ans) — Le plus ancré dans la tradition. Ses textes en langues locales parlent de l'histoire de la Guinée avec une précision historique impressionnante.</p>
      <blockquote>« Le reggae, c'est la musique des gens qui refusent d'être silencieux. En Guinée, on n'a jamais manqué de gens comme ça. »<br><em>— Takana Zion</em></blockquote>
    `,
  },

  {
    id: 'c-008',
    slug: 'mode-street-style-conakry-30-looks-kipe-sonfonia',
    title: 'Street style Conakry 2026 : 30 looks repérés dans les rues de Kipé, Sonfonia et Kaloum',
    excerpt: 'Nos photographes ont passé une semaine dans les rues de Conakry avec une mission : capturer la vraie mode de la ville. Voici ce qu\'ils ont trouvé. Spoiler : Conakry s\'habille mieux que vous ne le pensez — et différemment de tout ce que vous avez vu en Afrique de l\'Ouest.',
    category: 'mode',
    author: 'Awa D.',
    date: '2026-05-17',
    readTime: 4,
    image: 'https://img.youtube.com/vi/jipQpjUA_o8/maxresdefault.jpg',
    featured: false,
    breaking: false,
    tags: ['street style', 'conakry', 'mode', 'kipé', 'sonfonia', 'kaloum', 'fashion', 'photos'],
    views: 156300,
    body: `
      <h2>La semaine où on a arrêté de marcher vite</h2>
      <p>Normalement à Conakry, on marche vite. Le trafic, la chaleur, les mille choses à faire. Mais cette semaine-là, nos photographes avaient pour consigne de ralentir. De regarder les gens. De remarquer comment ils s'habillaient, ce qu'ils portaient, comment ils mixaient les pièces. Ce qu'ils ont ramené est une encyclopédie visuelle de la Conakry qui se construit en ce moment.</p>
      <h2>Kipé : la jeunesse créative</h2>
      <p>Kipé, c'est le quartier de la jeunesse éduquée, des étudiants, des jeunes professionnels. Le style dominant : une hybridation audacieuse. Bazin court avec des sneakers Nike, boubou oversized comme un hoodie, wax en jupe portefeuille avec un crop top blanc et des lunettes aviateur dorées. On voit beaucoup de rouge — la couleur qui revient depuis quelques saisons à Conakry. Et des sacs en paille tressée localement, portés comme des it-bags.</p>
      <h2>Sonfonia : le style "street mandingue"</h2>
      <p>À Sonfonia, le style est plus affirmé, plus assumé dans ses racines. Des groupes de jeunes hommes en boubou coordonnés — pas pour une fête, juste pour aller au marché. Des femmes en tenue complète bazin riche couleur électrique portées avec une décontraction totale. Quelqu'un a dit un jour que "le style africain, c'est mettre sa tenue de fête dans sa vie de tous les jours." À Sonfonia, c'est quotidien.</p>
      <h2>Kaloum : le business chic</h2>
      <p>Dans le centre-ville, proche des administrations et des banques, le style est plus formel — mais pas austère. Des chemises africaines bien coupées sous des costumes slim. Des pagnes en jupe midi avec des blazers. La Guinée professionnelle qui refuse de ressembler à une copie de Wall Street. Elle emprunte les codes formels mais les réinterprète avec ses propres matières et ses propres couleurs.</p>
      <blockquote>« Conakry s'habille pour elle-même. Pas pour les magazines de Paris. Et c'est pour ça que c'est intéressant. »<br><em>— Photographe, équipe ONE MEDIA</em></blockquote>
    `,
  },

  {
    id: 'c-009',
    slug: 'cinema-africain-films-voir-2026-selection-one-media',
    title: '12 films africains à voir absolument en 2026 — la sélection ONE MEDIA',
    excerpt: 'De Nairobi à Conakry, de Lagos à Casablanca — le cinéma africain n\'a jamais été aussi riche, aussi varié, aussi ambitieux. On a tout regardé. On vous dit quoi voir. Les thrillers kenyans, les comédies ivoiriennes, les drames sociaux guinéens — tout est là.',
    category: 'cinema',
    author: 'Awa D.',
    date: '2026-05-15',
    readTime: 6,
    image: 'https://img.youtube.com/vi/Kxu9yBNkxmM/maxresdefault.jpg',
    featured: true,
    breaking: false,
    tags: ['cinéma africain', 'films 2026', 'nollywood', 'cannes', 'guinée', 'afrique', 'sélection'],
    views: 98700,
    body: `
      <h2>Pourquoi 2026 est une année charnière</h2>
      <p>Le cinéma africain a toujours existé. Mais 2026 marque un point d'inflexion : les budgets augmentent, les coproductions internationales se multiplient, les plateformes de streaming investissent massivement sur le continent, et — surtout — une nouvelle génération de cinéastes arrive avec une vision et une technique qui n'ont rien à envier aux meilleures productions mondiales. Voici 12 films qui le prouvent.</p>
      <h2>Les 12 à ne pas manquer</h2>
      <p><strong>1. "Sira" (Afrique de l'Ouest / France, drame)</strong> — Une femme au Mali qui survit à l'enfer et se reconstruit. Produit par Apolline Traoré. Puissant, sans concessions.</p>
      <p><strong>2. "Banel & Adama" (Sénégal)</strong> — Un amour fou au bord d'un village qui s'effondre. La réalisatrice Ramata-Toulaye Sy signe un film d'une beauté formelle époustouflante.</p>
      <p><strong>3. "Mami Wata" (Nigeria)</strong> — Noir et blanc, mythologie yoruba, suspense. CJ Obasi réinvente le film fantastique africain.</p>
      <p><strong>4. "Konakry Beat" (Guinée)</strong> — Notre film guinéen de l'année. Voir l'article complet sur ONE MEDIA.</p>
      <p><strong>5. "Aisha Can't Fly Away" (Kenya)</strong> — Thriller psychologique nairobian. Les codes du genre américain appliqués à une réalité kenyane. Efficace et original.</p>
      <p><strong>6. "Brotherhood" (Maroc / France)</strong> — Frères, identité, immigration. Mozaïque humaine entre Casablanca et Marseille.</p>
      <p><strong>7. "La Voix du Griot" (Guinée / France)</strong> — Documentaire sur les derniers grands griots de Haute-Guinée. Un trésor.</p>
      <p><strong>8. "Desrances" (Cameroun)</strong> — De la violence, de la grâce, de la beauté formelle. Un cinéaste qui impose son monde.</p>
      <p><strong>9. "Four Daughters" (Tunisie)</strong> — Documentaire sur la radicalisation d'une famille. Lion d'Or à Venise 2023. Encore disponible sur quelques plateformes.</p>
      <p><strong>10. "Farha" (Jordanie / Suède)</strong> — Pas strictement africain, mais un modèle de production à petit budget à fort impact émotionnel.</p>
      <p><strong>11. "The Mother of All Lies" (Maroc)</strong> — Fiction documentaire sur une émeute marocaine des années 80 que l'histoire officielle a effacée.</p>
      <p><strong>12. "My Imaginary Country" (Chili) bonus</strong> — Hors continent, mais la cinéaste Maïté Alberdi montre comment documenter des mouvements sociaux avec amour. À voir pour les cinéastes africains.</p>
      <blockquote>« Le cinéma africain ne cherche plus à être approuvé par les festivals européens. Il s'impose. »<br><em>— Rédaction ONE MEDIA</em></blockquote>
    `,
  },

  {
    id: 'c-010',
    slug: 'jeunesse-guinéenne-reseaux-sociaux-militantisme-tiktok',
    title: 'TikTok, X, Instagram : comment la jeunesse guinéenne a réinventé le militantisme depuis un smartphone',
    excerpt: 'Ils n\'ont pas de cartes de parti, pas de bureau, pas de permanent. Ils ont un téléphone, une connexion et une colère précise. La jeunesse guinéenne connectée est en train de redéfinir ce que "s\'engager" veut dire en Afrique de l\'Ouest. Une révolution silencieuse, diffuse, et difficile à arrêter.',
    category: 'lifestyle',
    author: 'Fatou N.',
    date: '2026-05-12',
    readTime: 7,
    image: 'https://img.youtube.com/vi/G0XbmJje2tc/maxresdefault.jpg',
    featured: false,
    breaking: true,
    tags: ['jeunesse guinéenne', 'tiktok', 'militantisme', 'réseaux sociaux', 'guinée', 'engagement', 'web'],
    views: 187200,
    body: `
      <h2>La génération qui refuse le silence</h2>
      <p>Ils ont entre 18 et 30 ans. Ils sont à Conakry, à Labé, à Kankan, mais aussi à Paris, à Lyon, à Montréal. Ils suivent l'actualité guinéenne en temps réel — les coupures d'électricité filmées depuis un appartement de Kipé, les scandales exposés depuis une chambre de la banlieue parisienne, les injustices documentées avec un téléphone Android et une connexion 4G instable. Et ils parlent. Fort.</p>
      <p>TikTok est leur tribune. Une jeune femme de 23 ans qui filme l'état des routes de Coyah après la pluie et explique en pular, mandingue et français pourquoi c'est inacceptable — ses vidéos atteignent régulièrement 200 000 vues. Un étudiant en droit de Conakry qui décortique un article de la Constitution guinéenne en 60 secondes — ses threads sur X sont relayés par des journalistes de RFI et de Jeune Afrique. Une comptable de la diaspora qui explique comment fonctionne la corruption dans les marchés publics — ses vidéos éducatives sont téléchargées et partagées en dehors des réseaux.</p>
      <h2>Une forme d'engagement inédite</h2>
      <p>Ce n'est pas du militantisme au sens traditionnel. Il n'y a pas de leader désigné, pas de manifeste, pas d'organisation formelle. C'est quelque chose de plus liquide, de plus difficile à saisir — et de plus difficile à contrôler. Des coalitions ponctuelles se forment autour d'un hashtag, d'un scandale, d'une injustice précise. Elles se mobilisent, font du bruit, disparaissent — jusqu'à la prochaine fois.</p>
      <blockquote>« Je ne veux pas être chef d'un parti. Je veux que ma rue soit goudronnée et que les enfants de mon quartier aient accès à une école correcte. Ce n'est pas trop demander. »<br><em>— Militante TikTok, Conakry, 24 ans</em></blockquote>
      <h2>Les limites de la mobilisation numérique</h2>
      <p>Le militantisme en ligne a ses forces — vitesse, portée, contournement de la censure — et ses faiblesses : dispersion, manque de durée, difficulté à se transformer en changement concret. La question que se posent les plus expérimentés de ce mouvement numérique guinéen : comment passer de la viralité à l'impact réel ? Certains ont commencé à construire des associations formelles. D'autres restent délibérément informels. Le débat est ouvert. Et c'est peut-être ça, la santé d'une démocratie : que les jeunes débattent de comment s'engager.</p>
    `,
  },

  {
    id: 'c-011',
    slug: 'guinée-architecture-patrimoine-conakry-buildings-histoire',
    title: 'Conakry, ville invisible : les bâtiments qui racontent 150 ans d\'histoire que personne ne photographie',
    excerpt: 'La cathédrale Sainte-Marie, la Gare de Conakry, les villas coloniales de Kaloum, l\'immeuble Fria de style soviétique, les marchés couverts des années 70 — Conakry a un patrimoine architectural extraordinaire et totalement méconnu. Un photographe guinéen de 28 ans a décidé de le documenter avant qu\'il disparaisse.',
    category: 'art',
    author: 'Marcus D.',
    date: '2026-05-09',
    readTime: 5,
    image: 'https://cdn-images.dzcdn.net/images/artist/604dccdd4ef71094d4a3cc8a5764b161/500x500-000000-80-0-0.jpg',
    featured: false,
    breaking: false,
    tags: ['architecture', 'conakry', 'patrimoine', 'kaloum', 'histoire', 'photographie', 'guinée'],
    views: 48300,
    body: `
      <h2>La ville que les photographes ne voient pas</h2>
      <p>Les photographes qui viennent à Conakry cherchent souvent la même chose : les marchés bondés, les enfants qui jouent dans la rue, les femmes aux robes colorées. Des images vraies, mais prévisibles. Mamadou Sylla, 28 ans, photographe conakrykois, a décidé de chercher autre chose : l'architecture. Et il a trouvé une ville que même les Conakrykois ne voient plus vraiment, à force de la côtoyer chaque jour.</p>
      <h2>Kaloum : la presqu'île des fantômes</h2>
      <p>La presqu'île de Kaloum — le centre historique de Conakry — est un palimpseste architectural d'une richesse stupéfiante. Des villas coloniales françaises du début du XXe siècle, aux façades rongées par l'humidité atlantique mais toujours debout. La cathédrale Sainte-Marie de Conakry, construite en 1932, avec ses vitraux qui filtrent une lumière particulière à certaines heures de la journée. La gare ferroviaire de Conakry, chef-d'œuvre de métal et de brique rouge, inaugurée en 1904, aujourd'hui en cours de réhabilitation.</p>
      <p>Mais aussi des bâtiments de l'ère Sékou Touré — des constructions massives de style soviétique, cadeaux diplomatiques de l'URSS dans les années 60 et 70, qui donnent à certains quartiers une atmosphère d'Est-européen tropical absolument unique. L'immeuble Fria, la Cité des Chemins de Fer, le Palais du Peuple — des architectures que vous ne trouverez nulle part ailleurs en Afrique de l'Ouest.</p>
      <blockquote>« Conakry a un patrimoine qui mériterait un musée dédié. À la place, il disparaît bâtiment par bâtiment. Mon projet, c'est d'en garder une trace avant qu'il soit trop tard. »<br><em>— Mamadou Sylla, photographe</em></blockquote>
      <h2>Le projet de documentation</h2>
      <p>Mamadou Sylla a lancé un projet photographique appelé "Conakry Invisible" — 200 photographies grand format de bâtiments et espaces architecturaux de Conakry, accompagnées de recherches historiques sur leur construction et leur usage. L'exposition a déjà été présentée à l'Institut Français de Guinée. Une collaboration avec une université française est en discussion pour une publication. Et un compte Instagram dédié — @conakryinvisible — rassemble déjà 85 000 abonnés.</p>
    `,
  },

];

/* ════════════════════════════════════════════════════════
   ONE CHART — Classement du continent
   ════════════════════════════════════════════════════════ */

const CHART_DATA = [
  {
    rank: 1, artist: 'CKay', title: 'Love Nwantiti',
    cover: 'https://img.youtube.com/vi/1M9dNZmfEAY/mqdefault.jpg',
    trend: 'stable', deezerQuery: 'CKay Love Nwantiti',
    country: 'ng', countryName: 'Nigeria', weeks: 11,
    stats: { streams: '24.3M', label: 'streams' },
  },
  {
    rank: 2, artist: 'Ayra Starr', title: 'Rush',
    cover: 'https://img.youtube.com/vi/Kxu9yBNkxmM/mqdefault.jpg',
    trend: 'up', deezerQuery: 'Ayra Starr Rush',
    country: 'ng', countryName: 'Nigeria', weeks: 8,
    stats: { streams: '19.7M', label: 'streams' },
  },
  {
    rank: 3, artist: 'Fatoumata Diawara', title: 'Nterini',
    cover: 'https://cdn-images.dzcdn.net/images/artist/e77f8ec1491e3f8b4e7527e7c1e9e5d2/500x500-000000-80-0-0.jpg',
    trend: 'new', deezerQuery: 'Fatoumata Diawara',
    country: 'gn', countryName: 'Guinée', weeks: 3,
    peakNew: true,
    badges: [{ label: '🇬🇳 Guinée', color: '#FF2D55' }],
    stats: { streams: '11.2M', label: 'streams' },
    spotlight: { label: 'Coup de cœur ONE', artist: 'Fatoumata Diawara', note: 'La Guinéenne nommée aux Grammy 2027', link: 'article.html?id=b-001' },
  },
  {
    rank: 4, artist: 'Asake', title: 'Active',
    cover: 'https://img.youtube.com/vi/HrFbag8m6Tk/mqdefault.jpg',
    trend: 'up', deezerQuery: 'Asake Active',
    country: 'ng', countryName: 'Nigeria', weeks: 6,
    stats: { streams: '16.8M', label: 'streams' },
  },
  {
    rank: 5, artist: 'Fireboy DML', title: 'Peru',
    cover: 'https://img.youtube.com/vi/QnYpBVTm0qA/mqdefault.jpg',
    trend: 'down', deezerQuery: 'Fireboy DML Peru',
    country: 'ng', countryName: 'Nigeria', weeks: 29,
    stats: { streams: '14.5M', label: 'streams' },
  },
  {
    rank: 6, artist: 'Kizz Daniel', title: 'Buga',
    cover: 'https://img.youtube.com/vi/zBbSsNMWKaA/mqdefault.jpg',
    trend: 'stable', deezerQuery: 'Kizz Daniel Buga',
    country: 'ng', countryName: 'Nigeria', weeks: 21,
    stats: { streams: '13.1M', label: 'streams' },
  },
  {
    rank: 7, artist: 'Djelly Moussa Kouyaté', title: 'Kora Dreams',
    cover: 'https://cdn-images.dzcdn.net/images/artist/604dccdd4ef71094d4a3cc8a5764b161/500x500-000000-80-0-0.jpg',
    trend: 'new', deezerQuery: 'Djelly Moussa Kouyate',
    country: 'gn', countryName: 'Guinée', weeks: 2,
    badges: [{ label: '🇬🇳 Guinée', color: '#FF2D55' }],
    stats: { streams: '5.9M', label: 'streams' },
  },
  {
    rank: 8, artist: 'Omah Lay', title: 'Ku Lo Sa',
    cover: 'https://img.youtube.com/vi/X3Ai6osw3Mk/mqdefault.jpg',
    trend: 'up', deezerQuery: 'Omah Lay Ku Lo Sa',
    country: 'ng', countryName: 'Nigeria', weeks: 13,
    stats: { streams: '9.6M', label: 'streams' },
  },
  {
    rank: 9, artist: 'Amaarae', title: 'SAD GIRLZ LUV MONEY',
    cover: 'https://img.youtube.com/vi/7BwB5w0l9pU/mqdefault.jpg',
    trend: 'up', deezerQuery: 'Amaarae Sad Girlz',
    country: 'gh', countryName: 'Ghana', weeks: 9,
    stats: { streams: '8.4M', label: 'streams' },
  },
  {
    rank: 10, artist: 'Joeboy', title: 'Alcohol',
    cover: 'https://img.youtube.com/vi/3GzwD8y6jdk/mqdefault.jpg',
    trend: 'stable', deezerQuery: 'Joeboy Alcohol',
    country: 'ng', countryName: 'Nigeria', weeks: 16,
    stats: { streams: '7.2M', label: 'streams' },
  },
];

const CHART_DATA_GUINEE = [
  {
    rank: 1, artist: 'Djelly Moussa Kouyaté', title: 'Kora Dreams',
    cover: 'https://cdn-images.dzcdn.net/images/artist/604dccdd4ef71094d4a3cc8a5764b161/500x500-000000-80-0-0.jpg',
    trend: 'new', deezerQuery: 'Djelly Moussa Kouyate',
    country: 'gn', countryName: 'Guinée', weeks: 2,
    peakNew: true, stats: { streams: '5.9M', label: 'streams' },
    spotlight: { label: 'Coup de cœur ONE', artist: 'Djelly Moussa Kouyaté', note: 'PRIMUD 2026 — Révélation de l\'Année', link: 'article.html?id=b-011' },
  },
  {
    rank: 2, artist: 'Fatoumata Diawara', title: 'Nterini',
    cover: 'https://cdn-images.dzcdn.net/images/artist/e77f8ec1491e3f8b4e7527e7c1e9e5d2/500x500-000000-80-0-0.jpg',
    trend: 'up', deezerQuery: 'Fatoumata Diawara Nterini',
    country: 'gn', countryName: 'Guinée', weeks: 3,
    stats: { streams: '11.2M', label: 'streams' },
  },
  {
    rank: 3, artist: 'Amaza', title: 'On Est Chaud',
    cover: 'https://images.seneweb.com/dynamic/modules/news/images/gen/fb//da06621a686d4eee1ce1fc38e8018a3814e9f7b3.jpg',
    trend: 'up', deezerQuery: 'Amaza Guinee',
    country: 'gn', countryName: 'Guinée', weeks: 7,
    stats: { streams: '4.3M', label: 'streams' },
  },
  {
    rank: 4, artist: 'Azaya', title: 'Mandingue Love',
    cover: 'https://cdn-images.dzcdn.net/images/artist/b269f39903a403507769f9aae9ecfe22/500x500-000000-80-0-0.jpg',
    trend: 'stable', deezerQuery: 'Azaya',
    country: 'gn', countryName: 'Guinée', weeks: 12,
    stats: { streams: '3.8M', label: 'streams' },
  },
  {
    rank: 5, artist: 'Straiker', title: 'Pita',
    cover: 'https://cdn-images.dzcdn.net/images/artist/aa7ffbc5507204c67b602b77fd53e8cb/500x500-000000-80-0-0.jpg',
    trend: 'up', deezerQuery: 'Straiker Conakry',
    country: 'gn', countryName: 'Guinée', weeks: 5,
    stats: { streams: '3.1M', label: 'streams' },
  },
  {
    rank: 6, artist: 'AK4SEVEN', title: 'Nuit Blanche',
    cover: 'https://cdn-images.dzcdn.net/images/artist/604dccdd4ef71094d4a3cc8a5764b161/500x500-000000-80-0-0.jpg',
    trend: 'down', deezerQuery: 'AK4SEVEN Guinee',
    country: 'gn', countryName: 'Guinée', weeks: 18,
    stats: { streams: '9.4M', label: 'streams' },
  },
  {
    rank: 7, artist: 'Djanii Alpha', title: 'Koundara',
    cover: 'https://cdn-images.dzcdn.net/images/artist/7539d7952d976c3d52691a176e4476ac/500x500-000000-80-0-0.jpg',
    trend: 'stable', deezerQuery: 'Djanii Alpha Guinee',
    country: 'gn', countryName: 'Guinée', weeks: 8,
    stats: { streams: '2.7M', label: 'streams' },
  },
  {
    rank: 8, artist: "Soul Bang's & Manamba Kanté", title: 'Wo Wo Wo',
    cover: 'https://panm360.com/wp-content/uploads/2024/07/Soul-Bangs-Manamba-Kante.jpg',
    trend: 'up', deezerQuery: 'Soul Bangs Manamba',
    country: 'gn', countryName: 'Guinée', weeks: 4,
    stats: { streams: '2.2M', label: 'streams' },
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
