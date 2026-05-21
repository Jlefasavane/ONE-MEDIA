/* ===========================================================
   ONE MEDIA — Générateur IA
   NewsAPI → Groq (Llama 3) → articles.json
   =========================================================== */

require('dotenv').config();
const axios  = require('axios');
const fs     = require('fs');
const path   = require('path');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const NEWS_API_KEY = process.env.NEWS_API_KEY;
const OUTPUT_FILE  = path.join(__dirname, 'articles.json');

/* ── Catégories & requêtes NewsAPI ───────────────────────── */
const CATEGORIES = [
  {
    id: 'musique',
    label: 'Musique',
    color: '#00F5FF',
    queries: [
      'musique guinee conakry artiste',        // 1. Guinée en priorité
      'musique afrique abidjan dakar',          // 2. Afrique
      'afrobeats africa music artist',          // 3. Global africain
    ],
  },
  {
    id: 'cinema',
    label: 'Cinéma',
    color: '#FF2D55',
    queries: [
      'cinema guinee cote ivoire film',         // 1. Guinée/Côte d'Ivoire
      'african cinema film festival',           // 2. Afrique
      'cannes nollywood africa film',           // 3. Global
    ],
  },
  {
    id: 'mode',
    label: 'Mode',
    color: '#FFE500',
    queries: [
      'mode afrique guinee designer',           // 1. Guinée/Afrique
      'african fashion week wax pagne',         // 2. Afrique
      'fashion africa diaspora style',          // 3. Diaspora
    ],
  },
  {
    id: 'art',
    label: 'Art',
    color: '#BF5AF2',
    queries: [
      'art contemporain guinee afrique',        // 1. Guinée/Afrique
      'african contemporary art exhibition',    // 2. Afrique
      'africa artist culture diaspora',         // 3. Diaspora
    ],
  },
  {
    id: 'lifestyle',
    label: 'Lifestyle',
    color: '#30D158',
    queries: [
      'jeunesse guinee conakry culture vie',    // 1. Guinée en priorité
      'afrique culture lifestyle diaspora',     // 2. Afrique
      'abidjan dakar paris afrique culture',    // 3. Diaspora France
    ],
  },
];

const AUTHORS = [
  'Marcus D.', 'Léa M.', 'Kofi A.', 'Fatou N.',
  'Thomas R.', 'Inès K.', 'Amadou S.', 'Sophie L.',
  'Yann F.', 'Awa D.', 'Pierre V.', 'Aminata C.',
];

/* ── Fetch depuis NewsAPI ─────────────────────────────────── */
async function fetchNews(query, pageSize = 3) {
  try {
    const res = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: query,
        language: 'fr',
        sortBy: 'publishedAt',
        pageSize,
        apiKey: NEWS_API_KEY,
      },
      timeout: 8000,
    });

    if (!res.data.articles?.length) {
      const resEn = await axios.get('https://newsapi.org/v2/everything', {
        params: {
          q: query,
          language: 'en',
          sortBy: 'publishedAt',
          pageSize,
          apiKey: NEWS_API_KEY,
        },
        timeout: 8000,
      });
      return resEn.data.articles || [];
    }

    return res.data.articles || [];
  } catch (err) {
    console.warn(`  ⚠ NewsAPI error for "${query}":`, err.message);
    return [];
  }
}

/* ── Réécriture Groq (Llama 3) ───────────────────────────── */
async function rewriteWithGroq(rawArticle, category) {
  const systemPrompt = `Tu es le rédacteur en chef de ONE MEDIA, un média culturel premium qui couvre la musique, le cinéma, la mode, l'art et le lifestyle africain et de la diaspora.

Ton style :
- Titres percutants, directs
- Ton engagé, culturellement informé
- Focus sur les cultures africaines (Guinée, Côte d'Ivoire, Sénégal, Nigeria...)
- Phrases dynamiques, rythme soutenu
- Toujours en français

Réponds UNIQUEMENT avec du JSON valide, rien d'autre.`;

  const userPrompt = `Information brute :
TITRE : ${rawArticle.title}
DESCRIPTION : ${rawArticle.description || 'Non disponible'}
SOURCE : ${rawArticle.source?.name || 'Source inconnue'}
DATE : ${rawArticle.publishedAt}
CATÉGORIE : ${category.label}

Réécris en article ONE MEDIA. JSON avec cette structure EXACTE :
{
  "title": "Titre accrocheur en français (max 80 caractères)",
  "excerpt": "Chapeau de 2-3 phrases qui donne envie de lire",
  "body": "<h2>Titre section</h2><p>Paragraphe 1...</p><p>Paragraphe 2...</p><h2>Titre section 2</h2><p>Paragraphe 3...</p><blockquote>Citation marquante</blockquote><p>Conclusion...</p>",
  "tags": ["tag1", "tag2", "tag3"],
  "readTime": 5
}`;

  const maxRetries = 3;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama-3.1-8b-instant',
          max_tokens: 1200,
          temperature: 0.7,
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
          timeout: 20000,
        }
      );

      const text = response.data.choices[0].message.content.trim();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON in response');
      return JSON.parse(jsonMatch[0]);

    } catch (err) {
      const is429 = err.response?.status === 429;
      if (is429 && attempt < maxRetries) {
        const wait = attempt * 8000;
        console.warn(`  ⏳ Rate limit Groq — attente ${wait/1000}s (tentative ${attempt}/${maxRetries})...`);
        await new Promise(r => setTimeout(r, wait));
      } else {
        console.warn('  ⚠ Groq error:', err.message);
        return null;
      }
    }
  }
  return null;
}

/* ── Générer un article complet ──────────────────────────── */
async function generateArticle(rawArticle, category, index) {
  console.log(`  ✍  Réécriture : "${rawArticle.title?.slice(0, 60)}..."`);

  const rewritten = await rewriteWithGroq(rawArticle, category);
  if (!rewritten) return null;

  const id   = `ai-${category.id}-${Date.now()}-${index}`;
  const slug = rewritten.title
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);

  return {
    id,
    slug,
    title:      rewritten.title,
    excerpt:    rewritten.excerpt,
    body:       rewritten.body,
    category:   category.id,
    author:     AUTHORS[Math.floor(Math.random() * AUTHORS.length)],
    date:       new Date().toISOString().slice(0, 10),
    readTime:   rewritten.readTime || 5,
    image:      rawArticle.urlToImage || getFallbackImage(category.id),
    sourceUrl:  rawArticle.url,
    sourceName: rawArticle.source?.name,
    featured:   false,
    breaking:   false,
    tags:       rewritten.tags || [],
    views:      Math.floor(Math.random() * 50000) + 5000,
    aiGenerated: true,
  };
}

/* ── Images de fallback par catégorie ────────────────────── */
function getFallbackImage(catId) {
  const fallbacks = {
    musique:   'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1400&q=85',
    cinema:    'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1400&q=85',
    mode:      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=85',
    art:       'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=1400&q=85',
    lifestyle: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1400&q=85',
  };
  return fallbacks[catId] || fallbacks.musique;
}

/* ── Fonction principale ─────────────────────────────────── */
async function generate() {
  console.log('\n🚀 ONE MEDIA — Génération IA démarrée (Groq / Llama 3)');
  console.log('━'.repeat(50));

  if (!NEWS_API_KEY) {
    console.error('❌ NEWS_API_KEY manquante dans .env');
    return;
  }
  if (!GROQ_API_KEY) {
    console.error('❌ GROQ_API_KEY manquante dans .env');
    return;
  }

  const allArticles = [];

  for (const cat of CATEGORIES) {
    console.log(`\n📡 Catégorie : ${cat.label.toUpperCase()}`);

    const query = cat.queries[0];
    console.log(`  🔍 Recherche : "${query}"`);

    const rawArticles = await fetchNews(query, 2);
    console.log(`  📰 ${rawArticles.length} articles récupérés`);

    for (let i = 0; i < rawArticles.length; i++) {
      const raw = rawArticles[i];
      if (!raw.title || raw.title === '[Removed]') continue;

      const article = await generateArticle(raw, cat, i);
      if (article) {
        allArticles.push(article);
        console.log(`  ✅ "${article.title.slice(0, 55)}..."`);
      }

      await new Promise(r => setTimeout(r, 2500));
    }
  }

  if (allArticles.length > 0) allArticles[0].featured = true;
  if (allArticles.length > 1) allArticles[1].featured = true;
  if (allArticles.length > 2) allArticles[2].featured = true;

  const output = {
    generatedAt: new Date().toISOString(),
    count: allArticles.length,
    articles: allArticles,
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf8');

  console.log('\n' + '━'.repeat(50));
  console.log(`✅ ${allArticles.length} articles générés → articles.json`);
  console.log('━'.repeat(50) + '\n');

  // Envoi newsletter automatique
  await sendNewsletter(allArticles);

  return allArticles;
}

/* ── Newsletter automatique ──────────────────────────────── */
async function sendNewsletter(articles) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const SUBSCRIBERS_FILE = path.join(__dirname, 'subscribers.json');

  if (!RESEND_API_KEY) {
    console.log('📧 Newsletter : RESEND_API_KEY non configurée (skip)');
    return;
  }
  if (!fs.existsSync(SUBSCRIBERS_FILE)) {
    console.log('📧 Newsletter : 0 abonné');
    return;
  }

  const { subscribers } = JSON.parse(fs.readFileSync(SUBSCRIBERS_FILE, 'utf8'));
  if (!subscribers?.length) { console.log('📧 Newsletter : 0 abonné'); return; }

  const top5 = articles.slice(0, 5);
  const CAT_COLORS = { musique:'#00F5FF', cinema:'#FF2D55', mode:'#FFE500', art:'#BF5AF2', lifestyle:'#30D158', interview:'#FF9500' };
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
      <div class="excerpt">${a.excerpt?.slice(0, 120)}…</div>
      <a href="${SITE_URL}/article.html?id=${a.id}" class="read-btn">Lire l'article →</a>
    </div>
  </div>`).join('')}
  <div class="footer">
    <p>ONE MEDIA — Culture sans frontières</p>
    <p style="margin-top:8px"><a href="${SITE_URL}">Visiter le site</a> · <a href="${SITE_URL}/unsubscribe.html">Se désabonner</a></p>
  </div>
</div></body></html>`;

  let sent = 0;
  for (const email of subscribers) {
    try {
      await axios.post('https://api.resend.com/emails', {
        from:    process.env.NEWSLETTER_FROM || 'ONE MEDIA <newsletter@one-media.fr>',
        to:      [email],
        subject: `📡 ONE MEDIA — ${top5[0]?.title?.slice(0, 50) || 'Nouveaux articles du jour'}`,
        html,
      }, {
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        timeout: 10000,
      });
      sent++;
      await new Promise(r => setTimeout(r, 200));
    } catch (err) {
      console.warn(`  ⚠ Email error for ${email}:`, err.message);
    }
  }
  console.log(`📧 Newsletter envoyée à ${sent}/${subscribers.length} abonnés`);
}

module.exports = { generate };

if (require.main === module) {
  generate().catch(err => {
    console.error('❌ Erreur fatale :', err);
    process.exit(1);
  });
}
