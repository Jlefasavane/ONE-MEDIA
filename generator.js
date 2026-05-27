/* ===========================================================
   ONE MEDIA — Générateur IA v3
   RSS réelles (RFI, BBC Afrique, Jeune Afrique, etc.)
   → Groq réécriture style ONE MEDIA sans hallucination
   =========================================================== */

require('dotenv').config();
const axios    = require('axios');
const fs       = require('fs');
const path     = require('path');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const OUTPUT_FILE  = path.join(process.env.DATA_DIR || __dirname, 'articles.json');

/* ── Sources RSS via Google News (accessible sans restriction) */
// Google News RSS est accessible depuis n'importe quel serveur,
// pas de clé API, contenu frais des dernières heures.
const RSS_SOURCES = [
  /* MUSIQUE */
  { url: 'https://news.google.com/rss/search?q=musique+guinee+artiste&hl=fr&gl=FR&ceid=FR:fr',      category: 'musique',   label: 'Google News' },
  { url: 'https://news.google.com/rss/search?q=afrobeats+afrique+clip&hl=fr&gl=FR&ceid=FR:fr',      category: 'musique',   label: 'Google News' },
  { url: 'https://news.google.com/rss/search?q=musique+africaine+album+2026&hl=fr&gl=FR&ceid=FR:fr',category: 'musique',   label: 'Google News' },

  /* CINÉMA */
  { url: 'https://news.google.com/rss/search?q=cinema+africain+film&hl=fr&gl=FR&ceid=FR:fr',        category: 'cinema',    label: 'Google News' },
  { url: 'https://news.google.com/rss/search?q=nollywood+streaming+film+afrique&hl=fr&gl=FR&ceid=FR:fr', category: 'cinema', label: 'Google News' },

  /* MODE */
  { url: 'https://news.google.com/rss/search?q=mode+africaine+designer+fashion&hl=fr&gl=FR&ceid=FR:fr', category: 'mode',  label: 'Google News' },
  { url: 'https://news.google.com/rss/search?q=fashion+week+afrique+wax+pagne&hl=fr&gl=FR&ceid=FR:fr',  category: 'mode',  label: 'Google News' },

  /* ART */
  { url: 'https://news.google.com/rss/search?q=art+contemporain+africain+galerie&hl=fr&gl=FR&ceid=FR:fr', category: 'art', label: 'Google News' },

  /* LIFESTYLE */
  { url: 'https://news.google.com/rss/search?q=lifestyle+afrique+jeunesse+culture&hl=fr&gl=FR&ceid=FR:fr', category: 'lifestyle', label: 'Google News' },
  { url: 'https://news.google.com/rss/search?q=conakry+abidjan+dakar+culture+2026&hl=fr&gl=FR&ceid=FR:fr', category: 'lifestyle', label: 'Google News' },
];

/* Mots-clés pertinents par catégorie pour filtrer les articles */
const CATEGORY_KEYWORDS = {
  musique:   ['musique', 'music', 'artiste', 'artist', 'concert', 'album', 'chanson', 'rap', 'afrobeats', 'guinee', 'guinéen', 'chanteur', 'groupe', 'beat', 'track', 'single'],
  cinema:    ['film', 'cinéma', 'cinema', 'série', 'serié', 'réalisateur', 'acteur', 'actrice', 'festival', 'cannes', 'nollywood', 'streaming', 'netflix', 'amazon'],
  mode:      ['mode', 'fashion', 'style', 'designer', 'créateur', 'wax', 'pagne', 'tissu', 'tendance', 'collection', 'vêtement', 'look'],
  art:       ['art', 'artiste', 'exposition', 'galerie', 'peinture', 'sculpture', 'créativité', 'culture', 'patrimoine', 'musée', 'graffiti', 'street art'],
  lifestyle: ['jeunesse', 'vie', 'lifestyle', 'culture', 'gastronomie', 'voyage', 'diaspora', 'tendance', 'société', 'ville', 'paris', 'conakry', 'abidjan'],
};

/* Sujets autonomes de secours si RSS ne donne rien de frais */
const FALLBACK_TOPICS = {
  musique:   [
    { titleHint: "La scène afrobeats africaine en 2026 : les artistes à suivre", angle: "Tour d'horizon des artistes africains les plus influents de l'afrobeats actuellement — Nigeria, Côte d'Ivoire, Guinée, Sénégal. Tendances sonores, collaborations internationales, chiffres streaming." },
    { titleHint: "Guinée : le rap de Conakry prend de l'envergure", angle: "La génération de rappeurs guinéens qui montent — flows, productions, textes engagés. Comment Conakry construit sa scène hip-hop unique mêlant langues locales et influences globales." },
  ],
  cinema:    [
    { titleHint: "Le cinéma africain à la conquête des plateformes mondiales", angle: "Les productions africaines sur Netflix, Prime Video et Canal+. Réalisateurs, scénaristes, acteurs — le nouveau visage du cinéma du continent face au monde." },
  ],
  mode:      [
    { titleHint: "Mode africaine : les créateurs qui définissent les codes 2026", angle: "De Dakar à Abidjan, des designers africains imposent leur vision sur la scène internationale. Wax réinventé, coupes contemporaines, Fashion Week africaine." },
  ],
  art:       [
    { titleHint: "L'art contemporain africain s'exporte sur les grandes scènes", angle: "Peintres, sculpteurs et artistes numériques africains qui font parler d'eux dans les galeries mondiales. De Conakry à Paris, une génération qui redéfinit l'art africain." },
  ],
  lifestyle: [
    { titleHint: "Conakry 2026 : la jeunesse guinéenne réinvente sa ville", angle: "Vie nocturne, gastronomie, culture urbaine — comment la jeunesse conakryenne crée un art de vivre unique mêlant tradition et modernité." },
  ],
};

const AUTHORS = ['Marcus D.', 'Léa M.', 'Kofi A.', 'Fatou N.', 'Thomas R.', 'Inès K.', 'Amadou S.', 'Sophie L.', 'Yann F.', 'Awa D.', 'Pierre V.', 'Aminata C.'];

/* ── Parser RSS minimaliste (sans dépendance XML) ─────────── */
function parseRSSItems(xml) {
  const items = [];
  const itemRx = /<item[\s>]([\s\S]*?)<\/item>/gi;
  let m;
  while ((m = itemRx.exec(xml)) !== null) {
    const raw = m[1];
    const get = tag => {
      const r = new RegExp(`<${tag}[^>]*>\\s*(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?\\s*<\\/${tag}>`, 'i');
      const x = raw.match(r);
      return x ? x[1].replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/<[^>]+>/g,' ').trim() : '';
    };
    const link = raw.match(/<link>([^<]+)/i)?.[1]?.trim() || get('link');
    const imgMatch = raw.match(/url="([^"]+\.(jpg|jpeg|png|webp)[^"]*)"/i)
                  || raw.match(/<media:thumbnail[^>]+url="([^"]+)"/i)
                  || raw.match(/<enclosure[^>]+url="([^"]+)"/i);
    items.push({
      title:       get('title'),
      description: get('description') || get('summary') || '',
      link:        link,
      pubDate:     get('pubDate') || get('dc:date') || get('published') || '',
      image:       imgMatch ? imgMatch[1] : '',
      source:      '',
    });
  }
  return items.filter(i => i.title && i.link);
}

/* ── Récupère et parse un flux RSS ────────────────────────── */
async function fetchRSS(source) {
  // Headers qui imitent un navigateur pour éviter les blocages
  const BROWSER_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
  };
  try {
    const res = await axios.get(source.url, {
      timeout: 12000,
      headers: BROWSER_HEADERS,
      maxRedirects: 5,
    });
    if (typeof res.data !== 'string' || !res.data.includes('<item')) {
      console.warn(`  ⚠ RSS ${source.label}: réponse non-XML (${typeof res.data}, longueur: ${String(res.data).length})`);
      return [];
    }
    const items = parseRSSItems(res.data);
    return items.map(i => ({ ...i, source: source.label, sourceCat: source.category }));
  } catch (err) {
    console.warn(`  ⚠ RSS fetch ${source.label}: ${err.message}`);
    return [];
  }
}

/* ── Filtre les articles récents (< maxDaysOld jours) ──────── */
function filterRecent(items, maxDaysOld = 7) {
  const cutoff = Date.now() - maxDaysOld * 24 * 3600 * 1000;
  return items.filter(item => {
    if (!item.pubDate) return true; // si pas de date, on garde
    try {
      const ts = new Date(item.pubDate).getTime();
      return !isNaN(ts) && ts >= cutoff;
    } catch { return true; }
  });
}

/* ── Vérifie si un article est pertinent pour la catégorie ── */
function isRelevant(item, category) {
  const text = (item.title + ' ' + item.description).toLowerCase();
  const keywords = CATEGORY_KEYWORDS[category] || [];
  return keywords.some(kw => text.includes(kw));
}

/* ── Réécriture Groq — SANS hallucination ──────────────────── */
async function rewriteWithGroq(rawItem, category, catLabel) {
  const systemPrompt = `Tu es le rédacteur en chef de ONE MEDIA, un média culturel premium dédié aux cultures africaines et de la diaspora.

RÈGLE ABSOLUE ANTI-HALLUCINATION :
- Tu RÉÉCRIS uniquement des informations présentes dans la source. ZÉRO invention.
- N'ajoute aucun nom, chiffre, date, citation ou fait non présent dans la source.
- Si la description est courte, développe le CONTEXTE général du sujet (pas des faits inventés).
- Utilise des formulations honnêtes : "selon les informations disponibles", "d'après les observateurs", etc.
- NE CITE JAMAIS une personne réelle avec des mots qu'elle n'a pas dits.

Style ONE MEDIA :
- Titres percutants et FIDÈLES au contenu
- Ton engagé et culturellement informé
- Focus Afrique : Guinée, Côte d'Ivoire, Sénégal, Nigeria, diaspora
- Phrases dynamiques, rythme soutenu
- Toujours en français impeccable

Réponds UNIQUEMENT avec du JSON valide, rien d'autre.`;

  const userPrompt = `Information source (à réécrire fidèlement) :
TITRE ORIGINAL : ${rawItem.title}
DESCRIPTION : ${rawItem.description?.slice(0, 500) || 'Non disponible'}
SOURCE : ${rawItem.source}
DATE : ${rawItem.pubDate}
CATÉGORIE : ${catLabel}

Réécris en article ONE MEDIA. Conserve tous les faits. JSON EXACTEMENT :
{
  "title": "Titre accrocheur (max 85 caractères, fidèle à la source)",
  "excerpt": "Chapeau 2-3 phrases engageantes basées sur les faits de la source",
  "body": "<h2>Section 1</h2><p>...</p><p>...</p><h2>Section 2</h2><p>...</p><blockquote>Citation ou fait marquant de l'article source</blockquote><p>...</p>",
  "tags": ["tag1", "tag2", "tag3"],
  "readTime": 4
}`;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model:       'llama-3.1-8b-instant',
          max_tokens:  1600,
          temperature: 0.5,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user',   content: userPrompt },
          ],
        },
        {
          headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
          timeout: 25000,
        }
      );
      const text = res.data.choices[0].message.content.trim();
      const jm   = text.match(/\{[\s\S]*\}/);
      if (!jm) throw new Error('Pas de JSON');
      return JSON.parse(jm[0]);
    } catch (err) {
      if (err.response?.status === 429 && attempt < 3) {
        const wait = attempt * 10000;
        console.warn(`  ⏳ Rate limit — attente ${wait/1000}s...`);
        await new Promise(r => setTimeout(r, wait));
      } else if (err.response?.status === 401) {
        console.error('  ❌ GROQ_API_KEY invalide');
        return null;
      } else {
        console.warn(`  ⚠ Groq tentative ${attempt}: ${err.message}`);
        if (attempt < 3) await new Promise(r => setTimeout(r, 3000));
        else return null;
      }
    }
  }
  return null;
}

/* ── Génération autonome (fallback) ───────────────────────── */
async function generateAutonomous(topic, catId, catLabel, idx) {
  const systemPrompt = `Tu es le rédacteur en chef de ONE MEDIA, média culturel africain.

RÈGLES STRICTES :
1. Ne cite JAMAIS une vraie personne avec des mots qu'elle n'a pas dits — utilise "selon les observateurs du secteur", "d'après les acteurs du milieu", etc.
2. Ne donne JAMAIS de chiffres précis que tu ne connais pas avec certitude (streams, ventes, revenus). Utilise "des millions de streams" ou "un succès commercial notable".
3. Si tu mentionnes des artistes ou personnalités, ne dis que des choses généralement connues et vérifiables.
4. L'article est un ÉDITORIAL / ANALYSE de fond — pas un reportage factuel.
5. Réponds UNIQUEMENT avec du JSON valide.`;
  const userPrompt   = `SUJET ÉDITORIAL : ${topic.titleHint}\nANGLE : ${topic.angle}\nCATÉGORIE : ${catLabel}\n\nJSON :\n{"title":"...","excerpt":"...","body":"<h2>...</h2><p>...</p>...","tags":[],"readTime":5}`;

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        { model: 'llama-3.1-8b-instant', max_tokens: 1800, temperature: 0.7, messages: [{ role:'system', content: systemPrompt }, { role:'user', content: userPrompt }] },
        { headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' }, timeout: 25000 }
      );
      const text = res.data.choices[0].message.content.trim();
      const jm   = text.match(/\{[\s\S]*\}/);
      if (!jm) throw new Error('Pas de JSON');
      return JSON.parse(jm[0]);
    } catch (err) {
      if (err.response?.status === 429 && attempt < 2) { await new Promise(r => setTimeout(r, 12000)); }
      else { console.warn(`  ⚠ Autonome tentative ${attempt}: ${err.message}`); if (attempt === 2) return null; }
    }
  }
  return null;
}

/* ── Images de fallback ───────────────────────────────────── */
function getFallbackImage(catId) {
  const fallbacks = {
    musique:   ['https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&q=80','https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=80','https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&q=80'],
    cinema:    ['https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&q=80','https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&q=80'],
    mode:      ['https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&q=80','https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&q=80'],
    art:       ['https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=1200&q=80','https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=1200&q=80'],
    lifestyle: ['https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&q=80','https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200&q=80'],
  };
  const list = fallbacks[catId] || fallbacks.musique;
  return list[Math.floor(Math.random() * list.length)];
}

/* ── Construire un article complet ───────────────────────── */
function buildArticle(rewritten, rawItem, catId, idx, isAutonomous = false) {
  const id   = `ai-${catId}-${Date.now()}-${idx}`;
  const slug = (rewritten.title || 'article')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);

  return {
    id,
    slug,
    title:       rewritten.title,
    excerpt:     rewritten.excerpt || '',
    body:        rewritten.body || '',
    category:    catId,
    author:      AUTHORS[Math.floor(Math.random() * AUTHORS.length)],
    date:        new Date().toISOString().slice(0, 10),
    readTime:    rewritten.readTime || 5,
    image:       (rawItem?.image && rawItem.image.startsWith('http')) ? rawItem.image : getFallbackImage(catId),
    sourceUrl:   rawItem?.link   || null,
    sourceName:  rawItem?.source || null,
    featured:    false,
    breaking:    false,
    tags:        rewritten.tags || [],
    views:       Math.floor(Math.random() * 80000) + 10000,
    aiGenerated: true,
    autonomous:  isAutonomous,
    generatedAt: new Date().toISOString(),
  };
}

/* ── Fonction principale ─────────────────────────────────── */
async function generate() {
  console.log('\n🚀 ONE MEDIA — Génération IA v3 (RSS réelles → Groq)');
  console.log('━'.repeat(50));

  if (!GROQ_API_KEY) {
    console.error('❌ GROQ_API_KEY manquante');
    return [];
  }

  const CATS = [
    { id: 'musique',   label: 'Musique',   target: 3 },
    { id: 'cinema',    label: 'Cinéma',    target: 2 },
    { id: 'mode',      label: 'Mode',      target: 2 },
    { id: 'art',       label: 'Art',       target: 2 },
    { id: 'lifestyle', label: 'Lifestyle', target: 2 },
  ];

  // 1. Récupérer tous les flux RSS en parallèle
  console.log('\n📡 Récupération des flux RSS...');
  const allRSSItems = [];
  const fetchPromises = RSS_SOURCES.map(async src => {
    const items = await fetchRSS(src);
    if (items.length) console.log(`  ✓ ${src.label} → ${items.length} articles`);
    allRSSItems.push(...items);
  });
  await Promise.all(fetchPromises);
  console.log(`  📰 Total brut : ${allRSSItems.length} articles récupérés`);

  const allArticles = [];
  let idx = 0;

  for (const cat of CATS) {
    console.log(`\n📝 ${cat.label.toUpperCase()} (objectif: ${cat.target} articles)`);

    // 2. Filtrer et scorer les articles RSS pour cette catégorie
    const catItems = allRSSItems
      .filter(item => item.sourceCat === cat.id || isRelevant(item, cat.id))
      .filter(item => item.title && item.description && item.description.length > 40);

    // D'abord essayer les articles des 7 derniers jours
    const recent7  = filterRecent(catItems, 7);
    const recent30 = filterRecent(catItems, 30);
    const candidates = recent7.length >= 1 ? recent7 : recent30;

    // Dédupliquer par titre
    const seen = new Set();
    const unique = candidates.filter(item => {
      const key = item.title.toLowerCase().slice(0, 50);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    console.log(`  🔍 ${unique.length} article(s) RSS candidats`);

    // 3. Réécrire les articles RSS avec Groq
    let written = 0;
    for (const rawItem of unique.slice(0, cat.target)) {
      console.log(`  ✍ "${rawItem.title.slice(0, 55)}..." [${rawItem.source}]`);
      const rewritten = await rewriteWithGroq(rawItem, cat.id, cat.label);
      if (rewritten) {
        allArticles.push(buildArticle(rewritten, rawItem, cat.id, idx++));
        console.log(`  ✅ Écrit`);
        written++;
      }
      if (written < cat.target) await new Promise(r => setTimeout(r, 2000));
    }

    // 4. Fallback autonome si RSS insuffisant
    const needed = cat.target - written;
    if (needed > 0) {
      const fallbacks = FALLBACK_TOPICS[cat.id] || [];
      console.log(`  💡 ${needed} article(s) autonome(s) en complément`);
      for (let fi = 0; fi < Math.min(needed, fallbacks.length); fi++) {
        const rewritten = await generateAutonomous(fallbacks[fi], cat.id, cat.label, idx);
        if (rewritten) {
          allArticles.push(buildArticle(rewritten, null, cat.id, idx++, true));
          console.log(`  ✅ Autonome écrit`);
        }
        if (fi < needed - 1) await new Promise(r => setTimeout(r, 2000));
      }
    }
  }

  // 5. Marquer les articles featured
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
  console.log(`✅ ${allArticles.length} articles générés → articles.json`);
  console.log('━'.repeat(50) + '\n');

  if (allArticles.length > 0) await sendNewsletter(allArticles);
  return allArticles;
}

/* ── Debug API ──────────────────────────────────────────── */
async function debugAPIs() {
  const result = { groq: null, rss: [], timestamp: new Date().toISOString() };

  // Test Groq
  try {
    const res = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      { model: 'llama-3.1-8b-instant', max_tokens: 30, messages: [{ role: 'user', content: 'Dis OK' }] },
      { headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' }, timeout: 10000 }
    );
    result.groq = { ok: true, model: res.data.model, response: res.data.choices[0].message.content.trim().slice(0, 50) };
  } catch (err) {
    result.groq = { ok: false, status: err.response?.status, message: err.message };
  }

  // Test RSS — un par catégorie
  const testSources = RSS_SOURCES.filter((s, i, arr) => arr.findIndex(x => x.category === s.category) === i);
  for (const src of testSources) {
    const items = await fetchRSS(src);
    const recent = filterRecent(items, 7);
    result.rss.push({
      category: src.category,
      url:      src.url.slice(0, 80),
      total:    items.length,
      recent7:  recent.length,
      sample:   items[0]?.title?.slice(0, 70) || null,
      sampleDate: items[0]?.pubDate || null,
    });
  }

  return result;
}

/* ── Newsletter auto après génération ───────────────────────
   Note : l'envoi manuel passe par Resend dans server.js
   Ici on fait juste un log — pas d'envoi automatique
   pour éviter les doublons et les erreurs SMTP sur Railway.
   ─────────────────────────────────────────────────────────── */
async function sendNewsletter(articles) {
  console.log(`📧 ${articles.length} articles générés — newsletter disponible depuis l'admin (Resend)`);
}

module.exports = { generate, debugAPIs };

if (require.main === module) {
  generate().catch(err => { console.error('❌ Erreur fatale :', err); process.exit(1); });
}
