/* ===========================================================
   ONE MEDIA — Générateur IA v2
   Groq (Llama 3) génération autonome — pas de NewsAPI
   =========================================================== */

require('dotenv').config();
const axios      = require('axios');
const fs         = require('fs');
const path       = require('path');
const nodemailer = require('nodemailer');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const OUTPUT_FILE  = path.join(__dirname, 'articles.json');

/* ── Sujets par catégorie (génération autonome) ───────────── */
const TOPICS = [
  /* MUSIQUE */
  {
    category: { id: 'musique', label: 'Musique', color: '#00F5FF' },
    titleHint: 'Azaya, la voix de Conakry qui fait vibrer le continent',
    angle: "Portrait d'Azaya, jeune artiste guinéen qui monte en puissance sur la scène afropop africaine. Son parcours de Conakry aux grandes scènes, ses influences, son style unique mêlant mandingue et afrobeats.",
  },
  {
    category: { id: 'musique', label: 'Musique', color: '#00F5FF' },
    titleHint: 'Afrobeats 2026 : les sons africains qui dominent les charts',
    angle: "Analyse des tendances de l'afrobeats et de l'afropop en 2026. Les artistes qui font parler d'eux entre Lagos, Abidjan, Conakry et Paris. Collaborations, influence mondiale, nouvelles sonorités.",
  },
  {
    category: { id: 'musique', label: 'Musique', color: '#00F5FF' },
    titleHint: 'Guinée : la scène rap de Conakry explose',
    angle: "La nouvelle génération de rappeurs guinéens : AK4SEVEN, Straiker et leurs pairs redéfinissent le hip-hop guinéen. Flow acéré, textes engagés, productions modernes. Comment ce mouvement émerge à Conakry.",
  },

  /* CINÉMA */
  {
    category: { id: 'cinema', label: 'Cinéma', color: '#FF2D55' },
    titleHint: 'Le cinéma africain conquiert les festivals internationaux',
    angle: "Les films africains qui font sensation dans les grands festivals (Cannes, Berlin, Sundance). Focus sur les réalisateurs guinéens, ivoiriens et sénégalais qui portent une nouvelle vision du cinéma africain.",
  },
  {
    category: { id: 'cinema', label: 'Cinéma', color: '#FF2D55' },
    titleHint: 'Nollywood et la révolution du streaming africain',
    angle: "Comment Nollywood et les productions africaines dominent les plateformes de streaming. Netflix Africa, Amazon Prime, les séries et films qui captent l'audience mondiale. L'industrie du cinéma en pleine mutation.",
  },

  /* MODE */
  {
    category: { id: 'mode', label: 'Mode', color: '#FFE500' },
    titleHint: 'Wax et modernité : les designers africains réinventent la mode',
    angle: "La nouvelle génération de créateurs africains qui réinterprètent les tissus traditionnels — wax, kente, bogolan — avec une vision contemporaine et internationale. Entre Abidjan, Accra, Dakar et Paris.",
  },
  {
    category: { id: 'mode', label: 'Mode', color: '#FFE500' },
    titleHint: 'Fashion Week Africaine : le continent rayonne sur la scène mondiale',
    angle: "Les fashion weeks d'Afrique — Lagos, Dakar, Johannesburg — s'imposent comme des références mondiales. Les stylistes qui font le buzz, les tendances qui partent du continent pour conquérir le monde.",
  },

  /* ART */
  {
    category: { id: 'art', label: 'Art', color: '#BF5AF2' },
    titleHint: "L'art contemporain africain explose sur le marché mondial",
    angle: "Les artistes africains et de la diaspora qui font monter les enchères dans les grandes maisons de vente. Sotheby's, Christie's, galeries new-yorkaises et londoniennes : l'art africain est la nouvelle frontière du marché de l'art.",
  },
  {
    category: { id: 'art', label: 'Art', color: '#BF5AF2' },
    titleHint: 'Graffiti et street art : Conakry se couvre de couleurs',
    angle: "Mouvement du street art à Conakry et dans les grandes villes africaines. Des jeunes artistes guinéens transforment les murs de leur ville en galeries à ciel ouvert. Portraits, fresques, engagements artistiques.",
  },

  /* LIFESTYLE */
  {
    category: { id: 'lifestyle', label: 'Lifestyle', color: '#30D158' },
    titleHint: 'Conakry by Night : la jeunesse guinéenne réinvente sa ville',
    angle: "La nuit conakryenne en 2026 : maquis, clubs, restaurants, rooftops — comment la jeunesse guinéenne crée une culture urbaine bouillonnante. Gastronomie fusion, culture hip-hop, mode de vie.",
  },
  {
    category: { id: 'lifestyle', label: 'Lifestyle', color: '#30D158' },
    titleHint: 'La diaspora africaine transforme les codes du luxe parisien',
    angle: "À Paris, la diaspora africaine et guinéenne impose ses codes dans la mode, la restauration, la musique et la culture. Ces entrepreneurs et créatifs qui redessinent le paysage culturel français avec leur identité africaine.",
  },
];

const AUTHORS = [
  'Marcus D.', 'Léa M.', 'Kofi A.', 'Fatou N.',
  'Thomas R.', 'Inès K.', 'Amadou S.', 'Sophie L.',
  'Yann F.', 'Awa D.', 'Pierre V.', 'Aminata C.',
];

/* ── Génération autonome via Groq ─────────────────────────── */
async function generateWithGroq(topic) {
  const systemPrompt = `Tu es le rédacteur en chef de ONE MEDIA, un média culturel premium qui couvre la musique, le cinéma, la mode, l'art et le lifestyle africain et de la diaspora.

Ton style :
- Titres percutants, directs, accrocheurs
- Ton engagé, culturellement informé, authentique
- Focus sur les cultures africaines (Guinée, Côte d'Ivoire, Sénégal, Nigeria, diaspora)
- Phrases dynamiques, rythme soutenu
- Toujours en français impeccable
- Corps d'article : 400-600 mots minimum, structuré, riche

Réponds UNIQUEMENT avec du JSON valide, sans markdown, sans explication.`;

  const userPrompt = `Écris un article ONE MEDIA complet sur ce sujet :

TITRE SUGGÉRÉ : ${topic.titleHint}
ANGLE ÉDITORIAL : ${topic.angle}
CATÉGORIE : ${topic.category.label}

JSON avec cette structure EXACTE (corps d'article riche, minimum 5 paragraphes) :
{
  "title": "Titre accrocheur en français (max 85 caractères)",
  "excerpt": "Chapeau de 2-3 phrases engageantes qui donnent envie de lire (80-120 mots)",
  "body": "<h2>Titre de section</h2><p>Paragraphe développé...</p><p>Paragraphe suite...</p><h2>Deuxième section</h2><p>Contenu riche...</p><p>Suite...</p><blockquote>Citation marquante d'un acteur du secteur</blockquote><p>Analyse approfondie...</p><h2>Conclusion</h2><p>Ouverture et perspectives...</p>",
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "readTime": 5
}`;

  const maxRetries = 3;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama-3.1-8b-instant',
          max_tokens: 1800,
          temperature: 0.75,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user',   content: userPrompt },
          ],
        },
        {
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type':  'application/json',
          },
          timeout: 30000,
        }
      );

      const text = response.data.choices[0].message.content.trim();
      // Extraire le JSON même s'il y a du texte autour
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Pas de JSON dans la réponse');
      return JSON.parse(jsonMatch[0]);

    } catch (err) {
      const status = err.response?.status;
      if (status === 429 && attempt < maxRetries) {
        const wait = attempt * 10000;
        console.warn(`  ⏳ Rate limit Groq — attente ${wait/1000}s (tentative ${attempt}/${maxRetries})...`);
        await new Promise(r => setTimeout(r, wait));
      } else if (status === 401) {
        console.error('  ❌ GROQ_API_KEY invalide (401 Unauthorized)');
        return null;
      } else if (status === 400) {
        console.warn(`  ⚠ Groq 400 Bad Request:`, err.response?.data?.error?.message || err.message);
        return null;
      } else {
        console.warn(`  ⚠ Groq erreur (tentative ${attempt}):`, err.message);
        if (attempt < maxRetries) {
          await new Promise(r => setTimeout(r, 3000));
        } else {
          return null;
        }
      }
    }
  }
  return null;
}

/* ── Images de fallback par catégorie ────────────────────── */
function getFallbackImage(catId) {
  const fallbacks = {
    musique: [
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1400&q=85',
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1400&q=85',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1400&q=85',
    ],
    cinema: [
      'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1400&q=85',
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1400&q=85',
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1400&q=85',
    ],
    mode: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1400&q=85',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1400&q=85',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1400&q=85',
    ],
    art: [
      'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=1400&q=85',
      'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=1400&q=85',
      'https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=1400&q=85',
    ],
    lifestyle: [
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1400&q=85',
      'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1400&q=85',
      'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=1400&q=85',
    ],
  };
  const list = fallbacks[catId] || fallbacks.musique;
  return list[Math.floor(Math.random() * list.length)];
}

/* ── Fonction principale ─────────────────────────────────── */
async function generate() {
  console.log('\n🚀 ONE MEDIA — Génération IA autonome (Groq / Llama 3)');
  console.log('━'.repeat(50));

  if (!GROQ_API_KEY) {
    console.error('❌ GROQ_API_KEY manquante dans les variables d\'environnement');
    // Écrire quand même pour mettre à jour generatedAt
    const existing = fs.existsSync(OUTPUT_FILE)
      ? JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'))
      : { articles: [] };
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify({
      generatedAt: new Date().toISOString(),
      count: existing.articles?.length || 0,
      articles: existing.articles || [],
      error: 'GROQ_API_KEY manquante',
    }, null, 2), 'utf8');
    return [];
  }

  const allArticles = [];

  for (let i = 0; i < TOPICS.length; i++) {
    const topic = TOPICS[i];
    console.log(`\n📝 [${i+1}/${TOPICS.length}] ${topic.category.label.toUpperCase()} — "${topic.titleHint.slice(0, 55)}..."`);

    const rewritten = await generateWithGroq(topic);
    if (!rewritten) {
      console.warn(`  ⚠ Skipped — Groq n'a pas retourné de contenu valide`);
      // Pause avant le prochain article
      if (i < TOPICS.length - 1) await new Promise(r => setTimeout(r, 2000));
      continue;
    }

    const id   = `ai-${topic.category.id}-${Date.now()}-${i}`;
    const slug = (rewritten.title || topic.titleHint)
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 80);

    const article = {
      id,
      slug,
      title:       rewritten.title || topic.titleHint,
      excerpt:     rewritten.excerpt || '',
      body:        rewritten.body || '',
      category:    topic.category.id,
      author:      AUTHORS[Math.floor(Math.random() * AUTHORS.length)],
      date:        new Date().toISOString().slice(0, 10),
      readTime:    rewritten.readTime || 5,
      image:       getFallbackImage(topic.category.id),
      featured:    false,
      breaking:    false,
      tags:        rewritten.tags || [],
      views:       Math.floor(Math.random() * 80000) + 10000,
      aiGenerated: true,
    };

    allArticles.push(article);
    console.log(`  ✅ "${article.title.slice(0, 60)}..."`);

    // Pause entre les appels Groq pour éviter le rate limit
    if (i < TOPICS.length - 1) {
      await new Promise(r => setTimeout(r, 2500));
    }
  }

  // Marquer les 3 premiers comme featured
  if (allArticles.length > 0) allArticles[0].featured = true;
  if (allArticles.length > 1) allArticles[1].featured = true;
  if (allArticles.length > 2) allArticles[2].featured = true;

  const output = {
    generatedAt: new Date().toISOString(),
    count:       allArticles.length,
    articles:    allArticles,
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf8');

  console.log('\n' + '━'.repeat(50));
  console.log(`✅ ${allArticles.length}/${TOPICS.length} articles générés → articles.json`);
  console.log('━'.repeat(50) + '\n');

  // Envoi newsletter automatique
  if (allArticles.length > 0) {
    await sendNewsletter(allArticles);
  }

  return allArticles;
}

/* ── Debug : tester les clés API ─────────────────────────── */
async function debugAPIs() {
  const result = { groq: null, timestamp: new Date().toISOString() };

  // Test Groq
  try {
    const res = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-8b-instant',
        max_tokens: 30,
        messages: [{ role: 'user', content: 'Dis juste "OK"' }],
      },
      {
        headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
        timeout: 10000,
      }
    );
    result.groq = {
      ok: true,
      model: res.data.model,
      response: res.data.choices[0].message.content.trim().slice(0, 50),
    };
  } catch (err) {
    result.groq = { ok: false, status: err.response?.status, message: err.message };
  }

  return result;
}

/* ── Newsletter automatique ──────────────────────────────── */
async function sendNewsletter(articles) {
  const GMAIL_USER     = process.env.GMAIL_USER;
  const GMAIL_PASS     = process.env.GMAIL_APP_PASSWORD;
  const SUBSCRIBERS_FILE = path.join(__dirname, 'subscribers.json');

  if (!GMAIL_USER || !GMAIL_PASS) {
    console.log('📧 Newsletter : GMAIL_USER/GMAIL_APP_PASSWORD non configurés (skip)');
    return;
  }
  if (!fs.existsSync(SUBSCRIBERS_FILE)) {
    console.log('📧 Newsletter : 0 abonné');
    return;
  }

  const { subscribers } = JSON.parse(fs.readFileSync(SUBSCRIBERS_FILE, 'utf8'));
  if (!subscribers?.length) { console.log('📧 Newsletter : 0 abonné'); return; }

  const top5 = articles.slice(0, 5);
  const CAT_COLORS = {
    musique: '#00F5FF', cinema: '#FF2D55', mode: '#FFE500',
    art: '#BF5AF2', lifestyle: '#30D158', interview: '#FF9500',
  };
  const SITE_URL = 'https://one-media-delta.vercel.app';

  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body{margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Arial,sans-serif;color:#eee}
  .wrap{max-width:600px;margin:0 auto;padding:40px 20px}
  .logo{font-size:28px;font-weight:900;letter-spacing:-1px;margin-bottom:4px}
  .logo span{color:#FF2D55}
  .tag{font-size:11px;color:#666;letter-spacing:2px;text-transform:uppercase;margin-bottom:32px}
  .headline{font-size:22px;font-weight:800;margin-bottom:8px}
  .sub{font-size:14px;color:#888;margin-bottom:32px;line-height:1.5}
  .article{border:1px solid #222;border-radius:12px;overflow:hidden;margin-bottom:16px}
  .article img{width:100%;height:180px;object-fit:cover;display:block}
  .article-body{padding:16px}
  .cat{font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px}
  .art-title{font-size:17px;font-weight:700;margin-bottom:8px;line-height:1.3}
  .excerpt{font-size:13px;color:#888;line-height:1.5;margin-bottom:12px}
  .read-btn{display:inline-block;background:#00F5FF;color:#000;font-weight:700;font-size:12px;padding:8px 16px;border-radius:6px;text-decoration:none}
  .footer{margin-top:40px;padding-top:24px;border-top:1px solid #222;text-align:center;color:#444;font-size:12px}
  .footer a{color:#666}
</style></head>
<body><div class="wrap">
  <div class="logo">ONE<span>.</span>MEDIA</div>
  <div class="tag">📡 Le signal du jour</div>
  <div class="headline">Nouveaux articles · ${new Date().toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long' })}</div>
  <div class="sub">Voici ce qui vaut la peine d'être lu aujourd'hui.</div>
  ${top5.map(a => `
  <div class="article">
    ${a.image ? `<img src="${a.image}" alt="${a.title}">` : ''}
    <div class="article-body">
      <div class="cat" style="color:${CAT_COLORS[a.category]||'#00F5FF'}">${a.category.toUpperCase()}</div>
      <div class="art-title">${a.title}</div>
      <div class="excerpt">${(a.excerpt||'').slice(0, 120)}…</div>
      <a href="${SITE_URL}/article.html?id=${a.id}" class="read-btn">Lire l'article →</a>
    </div>
  </div>`).join('')}
  <div class="footer">
    <p>ONE MEDIA — Culture sans frontières</p>
    <p style="margin-top:8px"><a href="${SITE_URL}">Visiter le site</a></p>
  </div>
</div></body></html>`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: GMAIL_USER, pass: GMAIL_PASS },
  });

  let sent = 0;
  for (const email of subscribers) {
    try {
      await transporter.sendMail({
        from:    `"ONE MEDIA" <${GMAIL_USER}>`,
        to:      email,
        subject: `📡 ONE MEDIA — ${top5[0]?.title?.slice(0, 50) || 'Nouveaux articles du jour'}`,
        html,
      });
      sent++;
      await new Promise(r => setTimeout(r, 300));
    } catch (err) {
      console.warn(`  ⚠ Email error for ${email}:`, err.message);
    }
  }
  console.log(`📧 Newsletter envoyée à ${sent}/${subscribers.length} abonnés`);
}

module.exports = { generate, debugAPIs };

if (require.main === module) {
  generate().catch(err => {
    console.error('❌ Erreur fatale :', err);
    process.exit(1);
  });
}
