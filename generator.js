/* ===========================================================
   ONE MEDIA — Générateur IA v3
   RSS réelles (RFI, BBC Afrique, Jeune Afrique, etc.)
   → Groq réécriture style ONE MEDIA sans hallucination
   =========================================================== */

require('dotenv').config();
const axios    = require('axios');
const fs       = require('fs');
const path     = require('path');
const nodemailer = require('nodemailer');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const OUTPUT_FILE  = path.join(__dirname, 'articles.json');

/* ── Sources RSS par catégorie ───────────────────────────── */
const RSS_SOURCES = [
  /* MUSIQUE */
  { url: 'https://www.rfi.fr/fr/musiques/rss',             category: 'musique',   label: 'RFI Musiques' },
  { url: 'https://www.rfi.fr/fr/afrique/rss',              category: 'musique',   label: 'RFI Afrique' },
  { url: 'https://www.jeuneafrique.com/feed/',             category: 'musique',   label: 'Jeune Afrique' },

  /* CINÉMA / CULTURE */
  { url: 'https://www.rfi.fr/fr/culture/rss',              category: 'cinema',    label: 'RFI Culture' },
  { url: 'https://feeds.bbci.co.uk/afrique/rss.xml',       category: 'cinema',    label: 'BBC Afrique' },
  { url: 'https://www.jeuneafrique.com/feed/',             category: 'cinema',    label: 'Jeune Afrique' },

  /* MODE */
  { url: 'https://www.jeuneafrique.com/feed/',             category: 'mode',      label: 'Jeune Afrique' },
  { url: 'https://feeds.bbci.co.uk/afrique/rss.xml',       category: 'mode',      label: 'BBC Afrique' },

  /* ART */
  { url: 'https://www.rfi.fr/fr/culture/rss',              category: 'art',       label: 'RFI Culture' },
  { url: 'https://www.jeuneafrique.com/feed/',             category: 'art',       label: 'Jeune Afrique' },

  /* LIFESTYLE */
  { url: 'https://www.rfi.fr/fr/afrique/rss',              category: 'lifestyle', label: 'RFI Afrique' },
  { url: 'https://feeds.bbci.co.uk/afrique/rss.xml',       category: 'lifestyle', label: 'BBC Afrique' },
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
  try {
    const res = await axios.get(source.url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'ONE MEDIA News Bot/1.0',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
      },
    });
    const items = parseRSSItems(res.data);
    return items.map(i => ({ ...i, source: source.label, sourceCat: source.category }));
  } catch (err) {
    console.warn(`  ⚠ RSS fetch failed for ${source.label}: ${err.message}`);
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

RÈGLE ABSOLUE : Tu RÉÉCRIS des informations existantes. Tu ne dois JAMAIS inventer de faits, chiffres, noms ou événements qui ne sont pas dans la source originale. Si l'information est insuffisante, dis-le clairement dans le corps de l'article plutôt qu'inventer.

Ton style :
- Titres percutants et précis
- Ton engagé, culturellement informé
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
  const systemPrompt = `Tu es le rédacteur en chef de ONE MEDIA. Rédige un article de fond sur le sujet donné avec des informations générales et vérifiables sur la culture africaine. Ne cite pas de personnes réelles sans être certain des faits. Réponds UNIQUEMENT avec du JSON valide.`;
  const userPrompt   = `SUJET : ${topic.titleHint}\nANGLE : ${topic.angle}\nCATÉGORIE : ${catLabel}\n\nJSON :\n{"title":"...","excerpt":"...","body":"<h2>...</h2><p>...</p>...","tags":[],"readTime":5}`;

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

  // Test RSS (les 3 premiers)
  for (const src of RSS_SOURCES.slice(0, 3)) {
    const items = await fetchRSS(src);
    result.rss.push({ source: src.label, url: src.url, count: items.length, sample: items[0]?.title?.slice(0, 60) || null });
  }

  return result;
}

/* ── Newsletter ─────────────────────────────────────────── */
async function sendNewsletter(articles) {
  const GMAIL_USER = process.env.GMAIL_USER;
  const GMAIL_PASS = process.env.GMAIL_APP_PASSWORD;
  const SUB_FILE   = path.join(__dirname, 'subscribers.json');

  if (!GMAIL_USER || !GMAIL_PASS) { console.log('📧 Newsletter : GMAIL non configuré (skip)'); return; }
  if (!fs.existsSync(SUB_FILE))   { console.log('📧 Newsletter : 0 abonné'); return; }

  const { subscribers } = JSON.parse(fs.readFileSync(SUB_FILE, 'utf8'));
  if (!subscribers?.length) { console.log('📧 Newsletter : 0 abonné'); return; }

  const top5 = articles.slice(0, 5);
  const CAT_COLORS = { musique:'#00F5FF', cinema:'#FF2D55', mode:'#FFE500', art:'#BF5AF2', lifestyle:'#30D158' };
  const SITE_URL   = 'https://one-media-delta.vercel.app';

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Arial,sans-serif;color:#eee}.wrap{max-width:600px;margin:0 auto;padding:40px 20px}.logo{font-size:28px;font-weight:900}.logo span{color:#FF2D55}.article{border:1px solid #222;border-radius:12px;overflow:hidden;margin-bottom:16px}.article img{width:100%;height:160px;object-fit:cover}.article-body{padding:14px}.cat{font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:6px}.art-title{font-size:16px;font-weight:700;margin-bottom:8px}.read-btn{display:inline-block;background:#00F5FF;color:#000;font-weight:700;font-size:12px;padding:8px 16px;border-radius:6px;text-decoration:none}.footer{margin-top:32px;text-align:center;color:#444;font-size:12px}</style></head>
<body><div class="wrap"><div class="logo">ONE<span>.</span>MEDIA</div><p style="color:#666;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:4px 0 28px">📡 Le signal du jour</p>
${top5.map(a => `<div class="article">${a.image ? `<img src="${a.image}" alt="${a.title}">` : ''}<div class="article-body"><div class="cat" style="color:${CAT_COLORS[a.category]||'#00F5FF'}">${a.category.toUpperCase()}</div><div class="art-title">${a.title}</div><a href="${SITE_URL}/article.html?id=${a.id}" class="read-btn">Lire →</a></div></div>`).join('')}
<div class="footer"><p>ONE MEDIA — Culture sans frontières</p><p><a href="${SITE_URL}" style="color:#666">Visiter le site</a></p></div></div></body></html>`;

  const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: GMAIL_USER, pass: GMAIL_PASS } });
  let sent = 0;
  for (const email of subscribers) {
    try {
      await transporter.sendMail({ from: `"ONE MEDIA" <${GMAIL_USER}>`, to: email, subject: `📡 ONE MEDIA — ${top5[0]?.title?.slice(0,50)||'Nouveaux articles'}`, html });
      sent++;
      await new Promise(r => setTimeout(r, 300));
    } catch (err) { console.warn(`  ⚠ Email error: ${err.message}`); }
  }
  console.log(`📧 Newsletter → ${sent}/${subscribers.length} abonnés`);
}

module.exports = { generate, debugAPIs };

if (require.main === module) {
  generate().catch(err => { console.error('❌ Erreur fatale :', err); process.exit(1); });
}
