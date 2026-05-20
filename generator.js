/* ===========================================================
   ONE MEDIA — Générateur IA
   NewsAPI → Claude → articles.json
   =========================================================== */

require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');
const axios     = require('axios');
const fs        = require('fs');
const path      = require('path');

const anthropic    = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const NEWS_API_KEY = process.env.NEWS_API_KEY;
const OUTPUT_FILE  = path.join(__dirname, 'articles.json');

/* ── Catégories & requêtes NewsAPI ───────────────────────── */
const CATEGORIES = [
  {
    id: 'musique',
    label: 'Musique',
    color: '#00F5FF',
    queries: ['music hip-hop', 'afrobeats africa music', 'jazz new album', 'rap culture'],
  },
  {
    id: 'cinema',
    label: 'Cinéma',
    color: '#FF2D55',
    queries: ['film festival cannes', 'cinema africa nollywood', 'movie director', 'hollywood film'],
  },
  {
    id: 'mode',
    label: 'Mode',
    color: '#FFE500',
    queries: ['fashion week paris', 'streetwear luxury brand', 'african fashion designer', 'mode culture'],
  },
  {
    id: 'art',
    label: 'Art',
    color: '#BF5AF2',
    queries: ['art exhibition contemporary', 'street art culture', 'digital art museum', 'african art'],
  },
  {
    id: 'lifestyle',
    label: 'Lifestyle',
    color: '#30D158',
    queries: ['culture lifestyle africa', 'travel creative city', 'gastronomy diaspora', 'mental health creative'],
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

    // Fallback anglais si pas de résultats en français
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

/* ── Réécriture Claude ───────────────────────────────────── */
async function rewriteWithClaude(rawArticle, category) {
  const systemPrompt = `Tu es le rédacteur en chef de ONE MEDIA, un média culturel premium qui couvre la musique, le cinéma, la mode, l'art et le lifestyle à l'échelle mondiale, avec un focus particulier sur les cultures africaines et de la diaspora.

Ton style éditorial :
- Titres percutants, directs, jamais trop académiques
- Ton engagé, culturellement informé, sans jargon inutile
- Perspective internationale mais ancrée dans la culture contemporaine
- Tu parles à une génération connectée, curieuse, exigeante
- Jamais condescendant, toujours respectueux des cultures couvertes
- Phrases dynamiques, rythme soutenu

Tu dois TOUJOURS répondre en JSON valide uniquement, sans texte autour.`;

  const userPrompt = `Voici une information brute provenant d'une source d'actualité :

TITRE ORIGINAL : ${rawArticle.title}
DESCRIPTION : ${rawArticle.description || 'Non disponible'}
SOURCE : ${rawArticle.source?.name || 'Source inconnue'}
DATE : ${rawArticle.publishedAt}
CATÉGORIE : ${category.label}

Réécris cela comme un article complet pour ONE MEDIA en français. Génère un JSON avec exactement cette structure :
{
  "title": "Titre accrocheur en français (max 80 caractères)",
  "excerpt": "Chapeau de 2-3 phrases qui donne envie de lire (max 200 caractères)",
  "body": "Corps de l'article en HTML avec balises <p>, <h2>, <blockquote>. Minimum 4 paragraphes. Ajoute ton analyse et perspective éditoriale. Environ 400-600 mots.",
  "tags": ["tag1", "tag2", "tag3"],
  "readTime": 5
}`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const text = response.content[0].text.trim();
    // Extraire le JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found in response');
    return JSON.parse(jsonMatch[0]);

  } catch (err) {
    console.warn('  ⚠ Claude error:', err.message);
    return null;
  }
}

/* ── Générer un article complet ──────────────────────────── */
async function generateArticle(rawArticle, category, index) {
  console.log(`  ✍  Réécriture : "${rawArticle.title?.slice(0, 60)}..."`);

  const rewritten = await rewriteWithClaude(rawArticle, category);
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
    title:    rewritten.title,
    excerpt:  rewritten.excerpt,
    body:     rewritten.body,
    category: category.id,
    author:   AUTHORS[Math.floor(Math.random() * AUTHORS.length)],
    date:     new Date().toISOString().slice(0, 10),
    readTime: rewritten.readTime || 5,
    image:    rawArticle.urlToImage || getFallbackImage(category.id),
    sourceUrl:rawArticle.url,
    sourceName: rawArticle.source?.name,
    featured: false,
    breaking: false,
    tags:     rewritten.tags || [],
    views:    Math.floor(Math.random() * 50000) + 5000,
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
  console.log('\n🚀 ONE MEDIA — Génération IA démarrée');
  console.log('━'.repeat(50));

  if (!NEWS_API_KEY) {
    console.error('❌ NEWS_API_KEY manquante dans .env');
    process.exit(1);
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ ANTHROPIC_API_KEY manquante dans .env');
    process.exit(1);
  }

  const allArticles = [];

  for (const cat of CATEGORIES) {
    console.log(`\n📡 Catégorie : ${cat.label.toUpperCase()}`);

    // Prendre la première query (pour limiter les appels API)
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

      // Pause pour éviter le rate limiting
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  // Marquer le premier article comme featured
  if (allArticles.length > 0) allArticles[0].featured = true;
  if (allArticles.length > 1) allArticles[1].featured = true;
  if (allArticles.length > 2) allArticles[2].featured = true;

  // Sauvegarder
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

// Lancement direct
if (require.main === module) {
  generate().catch(err => {
    console.error('❌ Erreur fatale :', err);
    process.exit(1);
  });
}
