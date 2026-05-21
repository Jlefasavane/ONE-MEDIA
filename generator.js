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
      'afrobeats afrique musique 2026',
      'rap ivoirien guinéen artiste',
      'musique africaine sortie album',
    ],
  },
  {
    id: 'cinema',
    label: 'Cinéma',
    color: '#FF2D55',
    queries: [
      'cinema africain festival film',
      'nollywood film afrique',
      'cannes film afrique 2026',
    ],
  },
  {
    id: 'mode',
    label: 'Mode',
    color: '#FFE500',
    queries: [
      'mode africaine designer fashion',
      'streetwear afrique tendance',
      'fashion week afrique 2026',
    ],
  },
  {
    id: 'art',
    label: 'Art',
    color: '#BF5AF2',
    queries: [
      'art contemporain afrique exposition',
      'street art afrique artiste',
      'art guinéen ivoirien culture',
    ],
  },
  {
    id: 'lifestyle',
    label: 'Lifestyle',
    color: '#30D158',
    queries: [
      'culture lifestyle afrique jeunesse',
      'gastronomie afrique diaspora',
      'conakry abidjan culture vie',
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

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-8b-instant',
        max_tokens: 1500,
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
        timeout: 15000,
      }
    );

    const text = response.data.choices[0].message.content.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');
    return JSON.parse(jsonMatch[0]);

  } catch (err) {
    console.warn('  ⚠ Groq error:', err.message);
    return null;
  }
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

      await new Promise(r => setTimeout(r, 500));
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

  return allArticles;
}

module.exports = { generate };

if (require.main === module) {
  generate().catch(err => {
    console.error('❌ Erreur fatale :', err);
    process.exit(1);
  });
}
