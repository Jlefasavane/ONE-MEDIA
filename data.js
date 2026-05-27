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
    id: 'b-001',
    slug: 'fatoumata-diawara-grammy-2027-coyah-paris-world',
    title: 'Fatoumata Diawara nommée aux Grammy 2027 : la Guinéenne de Coyah qui fait pleurer le monde entier',
    excerpt: 'Née à Coyah, formée à la kora dans le Mandé, passée par Paris et New York — Fatoumata Diawara vient d\'obtenir sa première nomination aux Grammy Awards dans la catégorie Best Global Music Performance. Une consécration qui appartient à toute la Guinée.',
    category: 'musique',
    author: 'Kofi A.',
    date: '2026-05-27',
    readTime: 6,
    image: 'https://cdn-images.dzcdn.net/images/artist/e77f8ec1491e3f8b4e7527e7c1e9e5d2/500x500-000000-80-0-0.jpg',
    featured: true,
    breaking: true,
    tags: ['fatoumata diawara', 'grammy', 'guinée', 'coyah', 'world music', 'kora', 'paris'],
    views: 187400,
    body: `
      <h2>Coyah → Paris → le monde</h2>
      <p>Fatoumata Diawara ne suit pas les chemins tracés. Née à Coyah, à 60 kilomètres de Conakry, dans une famille de griots malinké, elle grandit avec la musique comme langue maternelle — non pas comme option artistique, mais comme obligation de l'âme. À 16 ans, elle part pour Paris. Pas avec un contrat, pas avec un manager, avec juste une voix et un oud. Ce qui s'est passé ensuite tient du miracle — ou du talent qui refuse d'être ignoré.</p>
      <p>Elle s'impose d'abord comme actrice de théâtre au sein de la troupe du Royal de Luxe. Puis comme chanteuse, guitariste, compositrice. Son premier album <em>Fatou</em> (2011, World Circuit Records) reçoit des critiques dithyrambiques dans la presse internationale. Le magazine anglais <em>MOJO</em> lui donne 5 étoiles. <em>The Guardian</em> parle de "l'une des plus grandes voix de la planète". L'album <em>Fenfo</em> (2018), enregistré à Los Angeles avec des musiciens de jazz américains et des kora-players de Conakry, lui vaut une nomination aux Victoires de la Musique.</p>
      <h2>La nomination qui change tout</h2>
      <p>Le 8 mai 2026, l'Académie américaine des arts d'enregistrement publie la liste des nominés aux Grammy Awards 2027. Sous "Best Global Music Performance" : <strong>Fatoumata Diawara — "Nterini"</strong>. Le titre, enregistré en live à Paris en 2025, est un plaidoyer pour la liberté des femmes en Afrique de l'Ouest — en mandingue, avec une kora et une guitare électrique. Simple. Dévastateur. Universel.</p>
      <p>Sur les réseaux sociaux, en Guinée, la réaction est immédiate. Des milliers de partages, le hashtag #FatoumataGrammyGN dans les tendances nationales. Plusieurs artistes guinéens — AK4SEVEN, Azaya, Amaza — ont réagi avec fierté. Elle représente quelque chose que tous les Guinéens peuvent porter : la preuve que le talent d'ici est de classe mondiale.</p>
      <blockquote>« La musique mandingue n'a pas besoin d'être traduite pour toucher les gens. Elle parle directement au cœur. »<br><em>— Fatoumata Diawara</em></blockquote>
      <h2>Pourquoi cette nomination arrive maintenant</h2>
      <p>Les Grammy 2024 ont créé la catégorie "Best African Music Performance" — une reconnaissance historique du continent. La catégorie "Best Global Music Performance" existe depuis 2002, mais peu d'artistes d'Afrique de l'Ouest l'avaient intégrée. La nomination de Fatoumata Diawara marque une nouvelle étape : la musique guinéenne, via une femme née à Coyah, accède aux plus hautes instances de reconnaissance mondiale de la musique. Et cette fois, personne n'a eu besoin d'une validation extérieure pour savoir que c'était mérité.</p>
    `,
  },

  {
    id: 'b-002',
    slug: 'konakry-beat-film-musical-cannes-2026-mamadou-bah',
    title: '"Konakry Beat" à Cannes 2026 : le premier film musical guinéen éblouit la Croisette',
    excerpt: 'À 29 ans, le réalisateur Mamadou Bah vient d\'être sélectionné à la Quinzaine des Cinéastes avec son premier long-métrage "Konakry Beat" — l\'histoire d\'un griot de Kaloum qui conquiert Paris avec son seul sabar. Une fiction, un manifeste, un film qui change l\'image du cinéma guinéen.',
    category: 'cinema',
    author: 'Awa D.',
    date: '2026-05-25',
    readTime: 5,
    image: 'https://img.youtube.com/vi/RUqOI7lWam0/maxresdefault.jpg',
    featured: true,
    breaking: false,
    tags: ['cannes', 'cinéma guinéen', 'mamadou bah', 'konakry beat', 'kaloum', 'griot', 'film'],
    views: 74300,
    body: `
      <h2>La Croisette découvre Kaloum</h2>
      <p>La Quinzaine des Cinéastes — la section de Cannes réservée aux œuvres les plus audacieuses — a annoncé le 10 mai 2026 sa sélection officielle. Parmi les 18 films retenus du monde entier : <strong>"Konakry Beat"</strong>, premier long-métrage de Mamadou Bah, 29 ans, né et formé à Conakry. C'est la première fois qu'un film 100% guinéen intègre la sélection cannoise. Le choc a été immédiat dans la communauté culturelle guinéenne.</p>
      <h2>L'histoire : un griot de Kaloum à Paris</h2>
      <p>Le film suit Boubacar, 22 ans, fils de griot dans le quartier de Kaloum, Conakry. Il joue du sabar dans les mariages et les baptêmes. Mais il porte en lui un rêve impossible : jouer sa musique sur une scène parisienne. Quand une vidéo de lui tourne sur les réseaux et attire l'attention d'un producteur français, il se retrouve propulsé dans un monde pour lequel rien ne l'a préparé. <em>Konakry Beat</em> raconte ce choc des cultures avec humour, émotion et une bande-son qui mélange mandingue, afrobeat et électronique parisienne.</p>
      <p>Tourné sur 24 jours entre Conakry et Paris, avec un budget de 180 000 euros — record de frugalité pour un film en sélection cannoise — <em>Konakry Beat</em> prouve que le cinéma guinéen n'a pas besoin d'attendre des millions pour exister. Il a besoin d'histoires vraies. Et de gens qui osent les raconter.</p>
      <blockquote>« Je voulais faire un film qui ressemble à Conakry — pas à l'idée que les Européens ont de Conakry. À la vraie ville, vivante, bruyante, magnifique, contradictoire. »<br><em>— Mamadou Bah, réalisateur</em></blockquote>
      <h2>La révolution qui commence</h2>
      <p>Plusieurs distributeurs européens ont déjà sollicité l'équipe du film après la présentation à Cannes. Une sortie cinéma en France est envisagée pour l'automne 2026, suivie d'une diffusion en Guinée. Le gouvernement guinéen, qui avait refusé de financer le film à l'origine, a depuis exprimé sa "fierté" — ce qui n'a pas manqué de faire sourire Mamadou Bah dans ses interviews. L'histoire du cinéma guinéen est peut-être en train de s'écrire.</p>
    `,
  },

  {
    id: 'b-003',
    slug: 'fatoumata-sylla-bazin-haute-couture-paris-collab-luxe',
    title: 'Fatoumata Sylla × haute couture : la styliste de Conakry qui impose le bazin dans les palaces parisiens',
    excerpt: 'La créatrice guinéenne Fatoumata Sylla, 31 ans, vient de signer une collaboration avec une grande maison de couture parisienne pour une capsule "bazin haute couture". Une première mondiale. Un tournant pour le textile africain. Et une victoire pour toute la filière artisanale de Guinée.',
    category: 'mode',
    author: 'Marcus D.',
    date: '2026-05-23',
    readTime: 5,
    image: 'https://img.youtube.com/vi/jipQpjUA_o8/maxresdefault.jpg',
    featured: false,
    breaking: true,
    tags: ['fatoumata sylla', 'bazin', 'haute couture', 'paris', 'mode guinéenne', 'conakry', 'luxe africain'],
    views: 58900,
    body: `
      <h2>Le bazin entre dans les palaces</h2>
      <p>Pendant des décennies, le bazin riche — ce tissu de coton brillant, emblème des grandes occasions en Guinée — est resté un trésor local. On l'offrait pour les mariages, on le portait pour les baptêmes, on le choisissait dans les marchés de Madina ou de Rogbané. Fatoumata Sylla, 31 ans, originaire de Conakry, a décidé de faire de ce tissu un argument de luxe mondial. Et elle a convaincu une maison parisienne de la suivre dans cette aventure.</p>
      <p>La capsule "Bazin Précieux" — 12 pièces, production artisanale limitée à 50 exemplaires chacune — mêle les techniques de broderie à la main des artisanes de Guinée avec les finitions et les structures caractéristiques de la haute couture européenne. Le résultat : des robes, des vestes et des tuniques qui tiennent à la fois du boubou architectural et de la pièce de collection internationale. Les prix vont de 800 à 4 200 euros pièce.</p>
      <blockquote>« Le bazin a toujours été luxueux. Ce qu'on a fait, c'est juste enlever le complexe. »<br><em>— Fatoumata Sylla</em></blockquote>
      <h2>Ce que ça change pour la filière</h2>
      <p>Derrière Fatoumata Sylla, c'est toute une chaîne de valeur guinéenne qui profite. Les brodeuses de Conakry qui travaillent avec elle depuis cinq ans vont voir leurs commandes exploser. Les teinturies de Mamou et de Labé qui fournissent les bazin sur mesure ont déjà été alertées d'une augmentation de la production. Pour la première fois, de l'argent du luxe parisien va directement rémunérer des artisanes guinéennes à leur juste valeur. Pas à prix de dumping. À prix de marché international. C'est le vrai changement.</p>
    `,
  },

  {
    id: 'b-004',
    slug: 'oumar-diallo-peintre-kankan-centre-pompidou-paris',
    title: 'Oumar Diallo, de Kankan au Centre Pompidou : le peintre guinéen qui réinvente l\'art africain contemporain',
    excerpt: 'À 34 ans, Oumar Diallo expose pour la première fois à Paris — et pas n\'importe où : dans les galeries du Centre Pompidou, dans le cadre de l\'exposition "Nouvelles Voix d\'Afrique". Ses peintures sur tissu guinéen parlent de mémoire, de déplacement et de beauté — avec une maîtrise qui a bluffé les critiques.',
    category: 'art',
    author: 'Aminata C.',
    date: '2026-05-21',
    readTime: 4,
    image: 'https://cdn-images.dzcdn.net/images/artist/2a6dc9e77004bb1a216c1cd9df2cb135/500x500-000000-80-0-0.jpg',
    featured: false,
    breaking: false,
    tags: ['oumar diallo', 'art contemporain', 'kankan', 'centre pompidou', 'guinée', 'peinture', 'paris'],
    views: 39200,
    body: `
      <h2>L'autoportrait d'une ville en transformation</h2>
      <p>Oumar Diallo peint sur du tissu — pas de la toile blanche de lin, mais du tissu guinéen : des pagnes aux motifs traditionnels, des bazins usés, des wax récupérés dans les marchés de Kankan. Ces supports chargés d'histoire deviennent le fond de compositions figuratives d'une grande précision : des portraits de femmes de Haute-Guinée, des paysages du Fouta-Djallon, des scènes de marché où le mouvement et la lumière sont saisis avec une économie de moyens saisissante.</p>
      <p>Sa technique est hybride : acrylique, pigments naturels extraits de plantes de Guinée forestière, parfois de l'encre de chine. Le résultat est immédiatement reconnaissable — quelque chose qui ressemble à la fois à la peinture de rue de Lagos, aux enluminures mandingues, et aux œuvres des expressionnistes abstraits américains. Une synthèse qui ne ressemble à rien d'autre, et c'est précisément ce qui a attiré l'attention des curateurs du Pompidou.</p>
      <blockquote>« Je peins ce que j'ai peur d'oublier. Les visages de ma grand-mère. Les couleurs du marché de Kankan le jeudi matin. L'odeur de la pluie sur la latérite rouge. »<br><em>— Oumar Diallo</em></blockquote>
      <h2>L'exposition "Nouvelles Voix d'Afrique"</h2>
      <p>Le Centre Pompidou présente jusqu'au 15 septembre 2026 "Nouvelles Voix d'Afrique" — une exposition collective réunissant 14 artistes de 11 pays africains. Oumar Diallo est le seul représentant guinéen. Ses huit toiles sont exposées dans la grande nef du 4e étage. La critique parisienne a unanimement salué son travail. Le quotidien <em>Libération</em> a consacré une demi-page à son portrait. Et pour Kankan, pour la Haute-Guinée, pour tous ceux qui doutaient que la culture guinéenne puisse s'exporter au plus haut niveau — c'est une réponse.</p>
    `,
  },

  {
    id: 'b-005',
    slug: 'konmoni-startup-fintech-conakry-levee-fonds-4-millions',
    title: 'KonMoni lève 4,2 millions d\'euros : la startupisation de Conakry n\'est plus un slogan',
    excerpt: 'La startup guinéenne KonMoni, spécialisée dans les transferts d\'argent et le paiement mobile entre la diaspora et la Guinée, vient de boucler un tour de table de 4,2 millions d\'euros auprès d\'investisseurs européens et africains. Le premier ticket significatif pour une tech company née à Conakry.',
    category: 'lifestyle',
    author: 'Rédaction ONE',
    date: '2026-05-20',
    readTime: 4,
    image: 'https://img.youtube.com/vi/G0XbmJje2tc/maxresdefault.jpg',
    featured: false,
    breaking: true,
    tags: ['konmoni', 'startup', 'fintech', 'conakry', 'guinée', 'tech africaine', 'diaspora'],
    views: 82100,
    body: `
      <h2>Le problème que KonMoni résout</h2>
      <p>Chaque année, la diaspora guinéenne envoie des centaines de millions d'euros vers la Guinée. Ces transferts — Western Union, MoneyGram, systèmes informels — coûtent cher, arrivent lentement, et passent souvent par des intermédiaires qui prélèvent une commission à chaque étape. Ibrahima Bah et ses cofondateurs ont créé KonMoni en 2022 avec une idée simple : réduire le coût des transferts de moitié, en temps réel, via une application mobile. La cible : les Guinéens de France, d'Allemagne, des États-Unis et du Canada.</p>
      <p>En trois ans, KonMoni a traité plus de 12 millions d'euros de transactions, compte 47 000 utilisateurs actifs, et a été sélectionnée dans le programme d'accélération Orange Ventures Afrique. L'application est disponible sur Android et iOS, en français, en pular et en mandingue — un détail de localisation qui a fait une différence majeure dans l'adoption.</p>
      <blockquote>« On a créé KonMoni parce que ma mère à Conakry attendait parfois 5 jours pour recevoir l'argent que j'envoyais depuis Lyon. En 2022. C'était inacceptable. »<br><em>— Ibrahima Bah, CEO de KonMoni</em></blockquote>
      <h2>Ce que 4,2 millions changent</h2>
      <p>Avec cette levée de fonds — menée par le fonds panafricain Partech Africa et deux family offices français — KonMoni va recruter 35 ingénieurs, lancer une offre B2B pour les entreprises guinéennes de la diaspora, et s'étendre vers la Sierra Leone et le Sénégal. C'est la première fois qu'une startup née à Conakry attire un ticket de cette taille sur le marché européen du capital-risque. Une première qui, espèrent les fondateurs, ne sera pas la dernière.</p>
    `,
  },

  {
    id: 'b-006',
    slug: 'interview-petit-denis-comedien-guineen-netflix-humour',
    title: 'Petit Denis : "Je veux être le premier comédien guinéen sur Netflix. Ce n\'est plus un rêve — c\'est un plan."',
    excerpt: 'Denis Guilavogui alias Petit Denis est le comédien le plus viral de Guinée. Ses sketches sur les travers de la société conakrykoise cumulent des dizaines de millions de vues. Il vient d\'être contacté par une plateforme de streaming africaine pour une série originale. Interview exclusive.',
    category: 'interview',
    author: 'Fatou N.',
    date: '2026-05-19',
    readTime: 7,
    image: 'https://img.youtube.com/vi/RUqOI7lWam0/maxresdefault.jpg',
    featured: true,
    breaking: false,
    tags: ['petit denis', 'humour guinéen', 'comedien', 'conakry', 'netflix', 'streaming', 'interview'],
    views: 126700,
    body: `
      <h2>La première fois qu'on l'a vu</h2>
      <p><strong>ONE MEDIA :</strong> Denis, tu es devenu la référence de l'humour guinéen en très peu de temps. Comment tu expliques ça ?</p>
      <p><strong>Petit Denis :</strong> Je pense que les gens attendaient juste quelqu'un qui leur parle d'eux. Pas de la Guinée comme concept politique ou économique — de la Guinée comme vie quotidienne. La femme dans le gbaka qui gère le chauffeur, le jeune qui explique à sa mère pourquoi il n'a pas encore de "situation". Ces situations-là, tout le monde les connaît. Quand tu les racontes avec amour et précision, les gens se reconnaissent et ils rient. C'est tout le secret.</p>
      <h2>Les 30 millions de vues qui ont changé ta vie</h2>
      <p><strong>ONE :</strong> Ton sketch "Le Loyer de Décembre" a atteint 30 millions de vues sur Facebook et TikTok réunis. Tu t'y attendais ?</p>
      <p><strong>Petit Denis :</strong> Jamais. J'ai posté ça depuis mon téléphone, dans ma chambre, à 23h un mardi. Le lendemain matin, j'avais 200 messages. Je pensais que c'était un bug. [Rires] La diaspora guinéenne a fait exploser la vidéo — France, États-Unis, Canada, Belgique. Les Guinéens de l'extérieur ont ri à des trucs qu'ils n'avaient plus vécus depuis des années, mais qu'ils reconnaissaient parfaitement. Ça, c'était très émouvant.</p>
      <blockquote>« L'humour, c'est la façon la plus honnête de dire la vérité à quelqu'un sans qu'il se mette en colère. »<br><em>— Petit Denis</em></blockquote>
      <h2>Le projet Netflix</h2>
      <p><strong>ONE :</strong> Tu as été approché par une plateforme de streaming. Tu peux en dire plus ?</p>
      <p><strong>Petit Denis :</strong> Je ne peux pas nommer la plateforme encore. Ce que je peux dire, c'est qu'on parle d'une série originale de six épisodes, fiction, tournée à Conakry, avec des acteurs guinéens. L'histoire se passe dans un immeuble de Kipé — différentes familles, différentes générations, différents quartiers d'origine. De la comédie sociale. Quelque chose qui n'a jamais été fait en Guinée à ce niveau de production.</p>
      <p><strong>ONE :</strong> Et Netflix spécifiquement — c'est un objectif ?</p>
      <p><strong>Petit Denis :</strong> C'est une destination. Nollywood a Netflix. Afrobeats a Netflix. L'humour guinéen mérite Netflix. Je travaille pour ça. Et cette fois, je dis "travaille" au sens littéral — scripts, pitch, réunions, partenaires. Ce n'est plus un rêve — c'est un plan.</p>
    `,
  },

  {
    id: 'b-007',
    slug: 'ckay-love-nwantiti-afrique-streaming-revolution-histoire',
    title: 'CKay "Love Nwantiti" : le jour où un morceau d\'Enugu a fracassé tous les records mondiaux — et ce que ça dit de l\'Afrique',
    excerpt: 'En 2021, un titre nigérian sorti en 2019 dans l\'indifférence générale devient subitement le single le plus streamé d\'Afrique, puis d\'Europe. L\'histoire de "Love Nwantiti" de CKay est l\'histoire de la musique africaine qui n\'a plus besoin de permission pour conquérir le monde.',
    category: 'musique',
    author: 'Marcus D.',
    date: '2026-05-18',
    readTime: 6,
    image: 'https://img.youtube.com/vi/1M9dNZmfEAY/maxresdefault.jpg',
    featured: false,
    breaking: false,
    tags: ['ckay', 'love nwantiti', 'nigeria', 'streaming', 'afrobeats', 'tiktok', 'guinée'],
    views: 143500,
    body: `
      <h2>TikTok a tout changé — ou rien</h2>
      <p>Valentine Chukwuemeka Nnaji sort "Love Nwantiti" en 2019. Il a 21 ans. La chanson passe inaperçue — quelques milliers de streams, pas de couverture presse, pas de label international. Deux ans plus tard, en 2021, un sound utilisé sur TikTok explose. En quelques jours, #LoveNwantiti compte des millions de vidéos. La chanson fait ses charts au Nigeria, puis en Europe de l'Est, puis en France, puis en Allemagne, puis aux États-Unis. 500 millions de streams en quelques mois. Un milliard dans l'année. C'est l'une des trajectoires les plus folles de l'histoire du streaming musical.</p>
      <p>La question que tout le monde se pose : est-ce que TikTok a "découvert" CKay ? Ou est-ce que TikTok a simplement rendu visible ce qui était déjà là ? La réponse honnête est la deuxième. La musique était bonne. Elle l'avait toujours été. Ce qui avait manqué, c'est l'outil de propagation. TikTok a été cet outil — mais il aurait pu être autre chose.</p>
      <h2>Ce que "Love Nwantiti" dit vraiment de l'Afrique</h2>
      <p>Le morceau est entièrement en igbo, une langue du sud-est Nigeria parlée par environ 25 millions de personnes. Il n'y a pas une ligne en anglais. Et il est devenu un hit mondial. Ça, c'est le signal le plus important : la langue africaine n'est plus un obstacle à la diffusion mondiale. Elle peut être un atout. Un marqueur d'authenticité que le public mondial cherche de plus en plus. Burna Boy chante en pidgin et yoruba. Omah Lay mélange les langues. Fatoumata Diawara chante en mandingue. Et tous trouvent des audiences planétaires.</p>
      <blockquote>« Quand "Love Nwantiti" est devenu numéro 1 en Allemagne, j'ai réalisé que la géographie de la musique avait changé pour toujours. »<br><em>— CKay</em></blockquote>
      <h2>L'onde guinéenne</h2>
      <p>À Conakry, "Love Nwantiti" a tourné dans tous les quartiers pendant des mois. Et quelque chose de plus profond s'est passé dans les studios : des producteurs guinéens ont commencé à comprendre que leurs propres langues — le pular, le mandingue, le soussou — pouvaient être des atouts plutôt que des barrières. AK4SEVEN intègre des syllabes mandingues dans ses flows. Azaya chante sur des basses électroniques avec une kora. Le déclic de CKay a eu des conséquences à Conakry aussi.</p>
    `,
  },

  {
    id: 'b-008',
    slug: 'kaloum-stories-coproduction-guineo-nigeriane-nollywood',
    title: '"Kaloum Stories" : la première coproduction guinéo-nigériane — Nollywood débarque à Conakry',
    excerpt: 'Une société de production de Lagos et un collectif de réalisateurs guinéens ont annoncé "Kaloum Stories" : une série de 8 épisodes tournée entièrement à Conakry, avec des acteurs guinéens et nigérians, produite avec les standards techniques de Nollywood. Le cinéma guinéen entre dans une nouvelle dimension.',
    category: 'cinema',
    author: 'Amadou S.',
    date: '2026-05-17',
    readTime: 4,
    image: 'https://img.youtube.com/vi/Yr1jWasHBDw/maxresdefault.jpg',
    featured: false,
    breaking: true,
    tags: ['kaloum stories', 'nollywood', 'cinéma guinéen', 'coproduction', 'conakry', 'nigeria', 'série'],
    views: 68400,
    body: `
      <h2>Nollywood regarde vers l'Ouest</h2>
      <p>Nollywood — l'industrie cinématographique nigériane, deuxième producteur mondial de films après Bollywood — s'étend. Après des coproductions avec le Ghana, le Kenya et la Côte d'Ivoire, c'est désormais vers la Guinée que les regards se tournent. La société de production lagosienne Palms & Dreams a annoncé le partenariat avec le collectif guinéen Conakry Cinéma pour une série originale : <strong>"Kaloum Stories"</strong>.</p>
      <h2>Ce que la série raconte</h2>
      <p>Huit épisodes de 45 minutes, tournés entièrement dans le quartier de Kaloum — la presqu'île historique de Conakry. L'histoire suit quatre familles de profils différents qui partagent le même immeuble : une famille peule venue de Labé, une famille soussou de vieille souche conakrykoise, un médecin nigérian en mission humanitaire, et une jeune styliste qui revient de Paris. La série explore comment ces mondes cohabitent, s'affrontent, s'aiment et se transforment mutuellement. Fiction sociale, réaliste, tournée en langues mélangées : français, mandingue, pular, yoruba.</p>
      <blockquote>« Kaloum n'est pas juste un quartier. C'est le point de départ de toutes les histoires de Guinée. »<br><em>— Abdoulaye Diallo, réalisateur principal, collectif Conakry Cinéma</em></blockquote>
      <h2>La révolution technique que ça représente</h2>
      <p>Le budget de la série — 1,4 million d'euros — est le plus élevé jamais alloué à une production de fiction entièrement tournée en Guinée. Palms & Dreams apporte son savoir-faire en post-production, ses équipes éclairage et son réseau de distribution sur les plateformes africaines. Conakry Cinéma apporte les acteurs locaux, le casting de rue, et une connaissance intime du territoire. Le tournage est prévu pour octobre 2026. La sortie : janvier 2027, sur une plateforme de streaming panafricaine.</p>
    `,
  },

  {
    id: 'b-009',
    slug: 'boubou-streetwear-gen-z-africaine-lagos-dakar-conakry',
    title: 'Boubou-streetwear : la tendance qui unit la Gen Z africaine de Lagos à Conakry en passant par Dakar',
    excerpt: 'Le boubou — vêtement ancestral de l\'Afrique de l\'Ouest — est devenu la pièce phare de la mode urbaine jeune africaine. Porté avec des sneakers, des casquettes, des lunettes de soleil oversize, il est le symbole d\'une génération qui assume son identité sans complexe. Décryptage d\'un phénomène.',
    category: 'mode',
    author: 'Awa D.',
    date: '2026-05-15',
    readTime: 5,
    image: 'https://img.youtube.com/vi/XoiOOiuH8iI/maxresdefault.jpg',
    featured: true,
    breaking: false,
    tags: ['boubou streetwear', 'mode africaine', 'gen z', 'lagos', 'dakar', 'conakry', 'tendance 2026'],
    views: 91300,
    body: `
      <h2>Le boubou n'est pas pour les fêtes de famille</h2>
      <p>Pendant des décennies, le boubou était réservé aux occasions solennelles : les vendredi de prière, les mariages, les fêtes nationales. Les jeunes africains urbains le rangeaient le lundi et reprenaient leurs jeans et leurs t-shirts. Ce paradigme est en train de basculer radicalement. Sur les réseaux sociaux africains — Instagram, TikTok, Twitter/X —, une nouvelle esthétique s'impose : le boubou quotidien, désacralisé, mélangé avec des codes streetwear globaux.</p>
      <p>Les images circulent : un jeune de Lagos en boubou indigo avec des Air Force 1 blanches et une casquette à l'envers. Une fille de Dakar en boubou rouge corail court, ceinturé, avec des Dr. Martens. Un groupe de Conakry en boubou bazin assortis avec des lunettes de soleil oversize façon années 90. Ces images cumulaient des millions de vues. Elles définissent une esthétique — celle d'une génération qui refuse de choisir entre son héritage et sa contemporanéité.</p>
      <h2>Les créateurs qui ont allumé la mèche</h2>
      <p>Ce mouvement n'est pas spontané — il a été allumé par des créateurs. À Lagos : Kenneth Ize, qui propose des boubous en tissu aso-oke portés comme des blazers. À Dakar : les collections Tongoro de Sarah Diouf, accessibles et urbaines. À Conakry : Mariama Diallo, dont les silhouettes unisexes ont été portées par plusieurs rappeurs guinéens dans leurs clips. Ces créateurs ont normalisé quelque chose que les jeunes Africains avaient envie de faire depuis longtemps : s'habiller africain dans leur vie de tous les jours.</p>
      <blockquote>« On nous a appris que porter africain, c'était pour les grandes occasions. La Gen Z africaine est en train de dire : non. Toutes les occasions sont grandes. »<br><em>— Mariama Diallo, styliste</em></blockquote>
      <h2>Conakry dans la tendance</h2>
      <p>À Conakry, la tendance est particulièrement forte dans les quartiers de Kipé et de Sonfonia, là où se concentre la jeunesse créative de la ville. Des photographes de mode locaux documentent le phénomène avec une précision artistique remarquable. Des comptes Instagram dédiés — "Conakry Style", "Kry Looks" — rassemblent des dizaines de milliers d'abonnés. La mode guinéenne contemporaine est en train de se construire une identité visuelle forte, hybride, assumée. Et le monde commence à regarder.</p>
    `,
  },

  {
    id: 'b-010',
    slug: 'fatou-bah-mamaya-restaurant-paris-cuisine-guinéenne',
    title: 'Fatou Bah et "Mamaya" : comment une cuisinière de Kindia a révolutionné la gastronomie africaine à Paris',
    excerpt: 'Son restaurant "Mamaya" — du mot soussou pour "fête" — vient d\'être classé meilleur restaurant africain de Paris 2026 par le magazine Saveurs. Fatou Bah, 38 ans, née à Kindia, a mis dix ans pour imposer la cuisine guinéenne dans un marché parisien obsédé par le couscous marocain et le thiéboudienne sénégalais.',
    category: 'lifestyle',
    author: 'Fatou N.',
    date: '2026-05-13',
    readTime: 5,
    image: 'https://cdn-images.dzcdn.net/images/artist/b269f39903a403507769f9aae9ecfe22/500x500-000000-80-0-0.jpg',
    featured: false,
    breaking: false,
    tags: ['fatou bah', 'mamaya', 'cuisine guinéenne', 'paris', 'restaurant', 'gastronomie', 'kindia'],
    views: 53800,
    body: `
      <h2>La sauce feuille qui a changé tout</h2>
      <p>Quand Fatou Bah ouvre "Mamaya" en 2016 dans le 10e arrondissement de Paris, personne ne connaît la cuisine guinéenne. Le thiéboudienne sénégalais, le mafé malien, le poulet yassa ivoirien — oui. La sauce feuille guinéenne, le riz gras de Conakry, le fouta dontoni de Labé — zéro. Elle commence avec 18 couverts et une ardoise de cinq plats. Les six premiers mois sont difficiles. Puis une blogueuse food publie un article sur son foutou sauce pistache. Et quelque chose se passe.</p>
      <p>Aujourd'hui, "Mamaya" compte 68 couverts, réservations obligatoires deux semaines à l'avance le week-end, et une clientèle mélangée : diaspora guinéenne, bobos parisiens curieux, journalistes gastronomiques, chefs étoilés qui viennent observer la technique. Le menu change toutes les quatre semaines selon les arrivages et la saison — mais la sauce feuille mijotée au feu doux pendant six heures reste la pièce d'identité de la maison.</p>
      <blockquote>« Ma mère cuisinait pour 20 personnes chaque matin à Kindia. J'ai juste appris à faire ça pour des étrangers qui n'avaient jamais goûté ce qu'elle faisait. »<br><em>— Fatou Bah</em></blockquote>
      <h2>Le classement qui légitime dix ans de combat</h2>
      <p>Le magazine <em>Saveurs</em> publie chaque année son palmarès des meilleurs restaurants africains de Paris. "Mamaya" arrive cette année en première position — devant des établissements marocains, sénégalais et éthiopiens installés depuis beaucoup plus longtemps. Le jury a salué "une cuisine d'une sincérité rare, qui porte l'identité de la Guinée sans jamais chercher à plaire à tort et à travers." Pour Fatou Bah, la validation arrive à 38 ans, après des années de travail obstiné. Pour la cuisine guinéenne, c'est une porte qui s'ouvre.</p>
    `,
  },

  {
    id: 'b-011',
    slug: 'djelly-moussa-kouyate-kora-primud-2026-victoire',
    title: 'Djelly Moussa Kouyaté remporte le PRIMUD 2026 : la kora au sommet de l\'Afrique contemporaine',
    excerpt: 'Le jeune joueur de kora de Conakry — 26 ans, formé dans une grande famille de griots de Baro — vient d\'être sacré Révélation de l\'Année au PRIMUD 2026 à Abidjan. Sa façon de fusionner la kora avec le jazz modal et l\'électronique africaine impressionne les spécialistes du monde entier.',
    category: 'musique',
    author: 'Kofi A.',
    date: '2026-05-11',
    readTime: 5,
    image: 'https://cdn-images.dzcdn.net/images/artist/604dccdd4ef71094d4a3cc8a5764b161/500x500-000000-80-0-0.jpg',
    featured: false,
    breaking: true,
    tags: ['djelly moussa kouyaté', 'kora', 'primud', 'guinée', 'baro', 'griot', 'jazz', 'abidjan'],
    views: 76200,
    body: `
      <h2>La kora électrique de Baro</h2>
      <p>Moussa Kouyaté naît en 2000 à Baro, petite ville de la région de Kindia, dans une famille de griots malinké dont la généalogie musicale remonte à plusieurs siècles. Son père joue de la kora. Son grand-père jouait de la kora. Son arrière-grand-père en jouait aussi. Pour Moussa, la question n'est jamais : "Vas-tu jouer de la kora ?" La question est : "Qu'est-ce que ta kora va dire que les autres n'ont pas encore dit ?"</p>
      <p>Sa réponse : une kora branchée sur des effets électroniques, associée à une batterie jazz et à des synthétiseurs. Des compositions qui maintiennent la structure modale mandingue — les 21 cordes, les harmonies traditionnelles, le rôle narratif de l'instrument — mais qui les plongent dans des ambiances sonores que ni Miles Davis ni Toumani Diabaté n'auraient imaginées séparément. Ensemble, peut-être. Et c'est précisément ce que Moussa Kouyaté explore.</p>
      <h2>Le PRIMUD, couronnement continental</h2>
      <p>Le PRIMUD — Prix de la Musique Africaine — se tient chaque année à Abidjan. C'est la cérémonie de référence pour l'industrie musicale d'Afrique de l'Ouest. Cette année, dans la catégorie Révélation de l'Année, Djelly Moussa Kouyaté a devancé des candidats de neuf pays différents. Le jury a salué son EP <em>Kora Dreams</em> — six titres, 28 minutes, enregistrés entre Conakry et Paris — comme "l'un des objets musicaux les plus originaux de ces cinq dernières années sur le continent."</p>
      <blockquote>« La kora n'est pas un instrument du passé. Elle est l'instrument du futur — parce qu'elle n'a pas encore dit tout ce qu'elle peut dire. »<br><em>— Djelly Moussa Kouyaté</em></blockquote>
      <h2>La prochaine étape</h2>
      <p>Après le PRIMUD, plusieurs festivals européens ont contacté son management. Jazz à Vienne, le festival de Womad en Angleterre, le Montreux Jazz Festival — des scènes où la kora a déjà une histoire, mais pas dans cet habit électrique que Moussa lui a cousu. Conakry regarde, fière et impatiente.</p>
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
