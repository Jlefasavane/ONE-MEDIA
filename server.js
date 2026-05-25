/* ===========================================================
   ONE MEDIA — Serveur Express v2
   Compression gzip + API étendue + clips YouTube 48h
   =========================================================== */

require('dotenv').config();
const express     = require('express');
const compression = require('compression');
const path        = require('path');
const fs          = require('fs');
const cron        = require('node-cron');
const axios       = require('axios');
const { generate, debugAPIs } = require('./generator');

const app  = express();
const PORT = process.env.PORT || 3002;

const ARTICLES_FILE    = path.join(__dirname, 'articles.json');
const CLIPS_FILE       = path.join(__dirname, 'clips.json');
const SUBSCRIBERS_FILE = path.join(__dirname, 'subscribers.json');
const EVENTS_FILE      = path.join(__dirname, 'events.json');
const CHANNEL_CACHE_FILE = path.join(__dirname, 'channel_ids.json');
const ADMIN_PASSWORD   = process.env.ADMIN_PASSWORD || 'onemedia2026!';

/* ── Helpers fichiers ─────────────────────────────────────── */
function readJSON(file, def) {
  try { return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : def; }
  catch { return def; }
}
function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

/* ── Compression gzip (performance) ─────────────────────── */
app.use(compression({ level: 6, threshold: 1024 }));

/* ── Middleware ──────────────────────────────────────────── */
app.use(express.json({ limit: '2mb' }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,x-admin-token');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

/* ── Cache-Control pour assets statiques ─────────────────── */
app.use(express.static(__dirname, {
  maxAge: '1h',
  setHeaders(res, filePath) {
    // HTML jamais mis en cache (pour les mises à jour)
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, must-revalidate');
    }
    // JS/CSS : 1h de cache
    else if (filePath.endsWith('.js') || filePath.endsWith('.css')) {
      res.setHeader('Cache-Control', 'public, max-age=3600');
    }
    // Fonts : 24h
    else if (/\.(woff2?|ttf|eot)$/.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }
  },
}));

/* ── Auth Admin ──────────────────────────────────────────── */
function adminAuth(req, res, next) {
  const token    = req.headers['x-admin-token'];
  const expected = Buffer.from(ADMIN_PASSWORD).toString('base64');
  if (token !== expected) return res.status(401).json({ error: 'Non autorisé' });
  next();
}

// POST /api/admin/login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true, token: Buffer.from(ADMIN_PASSWORD).toString('base64') });
  } else {
    res.status(401).json({ success: false, error: 'Mot de passe incorrect' });
  }
});

/* ── API Articles ────────────────────────────────────────── */

// GET /api/articles
app.get('/api/articles', (req, res) => {
  if (!fs.existsSync(ARTICLES_FILE)) return res.json({ articles: [], generatedAt: null, count: 0 });
  try {
    const data = JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf8'));
    res.setHeader('Cache-Control', 'public, max-age=300'); // 5 min
    res.json(data);
  } catch { res.status(500).json({ error: 'Erreur lecture articles.json' }); }
});

// GET /api/articles/:id
app.get('/api/articles/:id', (req, res) => {
  if (!fs.existsSync(ARTICLES_FILE)) return res.status(404).json({ error: 'Not found' });
  const data    = JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf8'));
  const article = data.articles?.find(a => a.id === req.params.id || a.slug === req.params.id);
  if (!article) return res.status(404).json({ error: 'Article not found' });
  res.json(article);
});

// PUT /api/articles/:id — modifier un article (admin)
app.put('/api/articles/:id', adminAuth, (req, res) => {
  if (!fs.existsSync(ARTICLES_FILE)) return res.status(404).json({ error: 'articles.json introuvable' });
  try {
    const data = JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf8'));
    const idx  = data.articles?.findIndex(a => a.id === req.params.id);
    if (idx === -1 || idx === undefined) return res.status(404).json({ error: 'Article introuvable' });

    // On autorise uniquement les champs éditoriaux (pas id, aiGenerated, etc.)
    const EDITABLE = ['title','excerpt','body','image','tags','readTime','category','author','date','featured','breaking'];
    const update   = {};
    EDITABLE.forEach(k => { if (req.body[k] !== undefined) update[k] = req.body[k]; });

    data.articles[idx] = { ...data.articles[idx], ...update, editedAt: new Date().toISOString() };
    writeJSON(ARTICLES_FILE, data);
    console.log(`✏️  Article modifié : "${data.articles[idx].title.slice(0,50)}"`);
    res.json({ success: true, article: data.articles[idx] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/articles/:id — supprimer un article (admin)
app.delete('/api/articles/:id', adminAuth, (req, res) => {
  if (!fs.existsSync(ARTICLES_FILE)) return res.status(404).json({ error: 'articles.json introuvable' });
  const data = JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf8'));
  const before = data.articles?.length || 0;
  data.articles  = (data.articles || []).filter(a => a.id !== req.params.id);
  data.count     = data.articles.length;
  writeJSON(ARTICLES_FILE, data);
  res.json({ success: true, deleted: before - data.articles.length });
});

// GET /health — healthcheck Railway (répond toujours 200)
app.get('/health', (req, res) => res.json({ ok: true, uptime: process.uptime() }));

// GET /api/status
app.get('/api/status', (req, res) => {
  if (!fs.existsSync(ARTICLES_FILE)) return res.json({ status: 'no_articles', message: 'Aucun article.' });
  try {
    const data = JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf8'));
    res.json({ status: 'ok', count: data.count, generatedAt: data.generatedAt, nextRefresh: 'Toutes les 6 heures (cron)' });
  } catch { res.json({ status: 'error', message: 'Lecture articles.json impossible' }); }
});

// GET /og-cover.jpg — image OG par défaut (redirect vers image Unsplash)
app.get('/og-cover.jpg', (req, res) => {
  res.redirect(301, 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=630&fit=crop&q=80');
});

// POST /api/refresh (admin)
let isGenerating = false;
app.post('/api/refresh', adminAuth, async (req, res) => {
  if (isGenerating) return res.json({ message: 'Génération déjà en cours…' });
  console.log('\n🔄 Refresh déclenché via admin');
  res.json({ message: 'Génération démarrée. Revenez dans 2-3 minutes.' });
  isGenerating = true;
  try   { await generate(); console.log('✅ Refresh terminé'); }
  catch (err) { console.error('❌ Erreur refresh :', err.message); }
  finally     { isGenerating = false; }
});

// GET /api/refresh/status
app.get('/api/refresh/status', (req, res) => {
  res.json({ generating: isGenerating });
});

// GET /api/debug (admin)
app.get('/api/debug', adminAuth, async (req, res) => {
  try {
    const result = await debugAPIs();
    res.json({
      ...result,
      env: {
        GROQ_API_KEY:    process.env.GROQ_API_KEY    ? `✅ Présente (${process.env.GROQ_API_KEY.length} chars)` : '❌ Manquante',
        CHANNEL_CACHE:   fs.existsSync(CHANNEL_CACHE_FILE) ? `✅ ${Object.keys(readJSON(CHANNEL_CACHE_FILE,{})).length} chaînes résolues` : '⚠ Pas encore résolu (lance le scan clips)',
        ADMIN_PASSWORD:  process.env.ADMIN_PASSWORD  ? '✅ Défini' : '⚠ Valeur par défaut',
        GMAIL_USER:      process.env.GMAIL_USER || '❌ Non configuré',
      },
      articlesFile: fs.existsSync(ARTICLES_FILE) ? readJSON(ARTICLES_FILE, {}) : { count: 0 },
      isGenerating,
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ── API Clips ───────────────────────────────────────────── */

// GET /api/clips
app.get('/api/clips', (req, res) => {
  const data = readJSON(CLIPS_FILE, { clips: [], updatedAt: null });
  res.setHeader('Cache-Control', 'public, max-age=120'); // 2 min
  res.json(data);
});

// POST /api/clips/add (admin)
app.post('/api/clips/add', adminAuth, (req, res) => {
  const { videoId, title, artist, country, releasedAt } = req.body;
  if (!videoId || !title || !artist) return res.status(400).json({ error: 'Champs manquants' });
  const data = readJSON(CLIPS_FILE, { clips: [] });
  const clip = {
    id:         `clip_${Date.now()}`,
    videoId,
    title,
    artist,
    country:    country || 'afrique',
    addedAt:    new Date().toISOString(),
    releasedAt: releasedAt || new Date().toISOString(), // date de sortie du clip
    verified:   true,
    autoFound:  false,
  };
  data.clips.unshift(clip);
  data.updatedAt = new Date().toISOString();
  writeJSON(CLIPS_FILE, data);
  res.json({ success: true, clip });
});

// DELETE /api/clips/:id (admin)
app.delete('/api/clips/:id', adminAuth, (req, res) => {
  const data = readJSON(CLIPS_FILE, { clips: [] });
  data.clips = data.clips.filter(c => c.id !== req.params.id);
  writeJSON(CLIPS_FILE, data);
  res.json({ success: true });
});

// POST /api/clips/submit (public)
app.post('/api/clips/submit', (req, res) => {
  const { url, artist, title, email } = req.body;
  const data = readJSON(CLIPS_FILE, { clips: [], pending: [] });
  if (!data.pending) data.pending = [];
  const match   = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  const videoId = match?.[1] || url;
  data.pending.push({ videoId, title, artist, email, submittedAt: new Date().toISOString() });
  writeJSON(CLIPS_FILE, data);
  res.json({ success: true, message: 'Soumission reçue !' });
});

/* ══════════════════════════════════════════════════════════
   CLIPS AUTO — RSS GRATUIT (zéro API, zéro carte bancaire)
   YouTube expose des flux Atom publics par chaîne :
   youtube.com/feeds/videos.xml?channel_id=UCxxxxx
   On résout les @handles → channel_id une seule fois (cache).
   ══════════════════════════════════════════════════════════ */

// Chaînes des artistes africains/guinéens suivis par ONE MEDIA
// channelId direct = pas besoin de résolution (plus rapide)
const ARTIST_CHANNELS = [
  // 🇬🇳 GUINÉE — channel IDs vérifiés
  { handle: '@AzayaOfficiel',       channelId: 'UCZTxOvGsnZ_BpCwyO8SBkaw', artist: 'Azaya',           country: 'guinee' },
  { handle: '@Straiker',            channelId: 'UCvQJ64ZOVrfDSRUZppEyczg', artist: 'Straiker',         country: 'guinee' },
  { handle: '@AK4SEVEN',            channelId: 'UCxLMyx_l2xVDqYqNr6W7tzQ', artist: 'AK4SEVEN',         country: 'guinee' },
  { handle: '@DjaniiAlfa',          channelId: 'UCn-taVB8ecvYdOMxCPYpeEA', artist: 'Djanii Alfa',       country: 'guinee' },
  { handle: '@djelykababintou',     channelId: 'UCQbckj_GH8g80f6L6PnSYfQ', artist: 'Djelykaba Bintou', country: 'guinee' },
  { handle: '@AmazaOfficiel',       channelId: null,                        artist: 'Amaza',            country: 'guinee' },

  // 🇳🇬 NIGERIA
  { handle: '@BurnaBoyTV',          channelId: null, artist: 'Burna Boy',    country: 'nigeria' },
  { handle: '@wizkidayo',           channelId: null, artist: 'Wizkid',       country: 'nigeria' },
  { handle: '@DavidoOfficial',      channelId: null, artist: 'Davido',       country: 'nigeria' },
  { handle: '@RemaOfficial',        channelId: null, artist: 'Rema',         country: 'nigeria' },
  { handle: '@OmahLayOfficial',     channelId: null, artist: 'Omah Lay',     country: 'nigeria' },
  { handle: '@FireboyDML',          channelId: null, artist: 'Fireboy DML',  country: 'nigeria' },
  { handle: '@TiwaSavageVEVO',      channelId: null, artist: 'Tiwa Savage',  country: 'nigeria' },

  // 🇨🇮 CÔTE D'IVOIRE
  { handle: '@DidiB',               channelId: null, artist: 'Didi B',       country: 'cote_ivoire' },
  { handle: '@HimraOfficiel',       channelId: null, artist: 'Himra',        country: 'cote_ivoire' },

  // 🇸🇳 SÉNÉGAL
  { handle: '@YoussouNDourOfficiel',channelId: null, artist: 'Youssou N\'Dour', country: 'senegal' },

  // 🌍 AFRIQUE / DIASPORA
  { handle: '@AyaNakamuraOfficiel', channelId: null, artist: 'Aya Nakamura', country: 'france' },
  { handle: '@MHDofficiel',         channelId: null, artist: 'MHD',          country: 'france' },
  { handle: '@FallyIpupaOfficiel',  channelId: null, artist: 'Fally Ipupa',  country: 'afrique' },
  { handle: '@Tyla',                channelId: null, artist: 'Tyla',         country: 'afrique' },
];

/* ── Résoudre @handle → channel_id (sans API key) ────────── */
async function resolveChannelId(handle) {
  const url = `https://www.youtube.com/${handle}`;
  try {
    const res = await axios.get(url, {
      timeout: 8000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
        'Accept-Language': 'fr-FR,fr;q=0.9',
      },
    });
    // Le channel_id est dans le HTML de la page : /channel/UCxxxxxx
    const match = String(res.data).match(/"channelId":"(UC[A-Za-z0-9_-]{22})"/);
    if (match) return match[1];
    // Fallback : canonical link
    const link = String(res.data).match(/channel\/(UC[A-Za-z0-9_-]{22})/);
    return link ? link[1] : null;
  } catch (err) {
    console.warn(`  ⚠ Résolution ${handle}: ${err.message}`);
    return null;
  }
}

/* ── Lire le flux Atom RSS d'une chaîne YouTube ───────────── */
async function fetchChannelVideos(channelId) {
  const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  try {
    const res = await axios.get(url, {
      timeout: 8000,
      headers: { 'User-Agent': 'Mozilla/5.0 AppleWebKit/537.36 Chrome/124.0', 'Accept': 'application/atom+xml,*/*' },
    });
    const xml     = String(res.data);
    const entries = [];
    const entryRx = /<entry>([\s\S]*?)<\/entry>/gi;
    let m;
    while ((m = entryRx.exec(xml)) !== null) {
      const raw     = m[1];
      const videoId = (raw.match(/<yt:videoId>([^<]+)<\/yt:videoId>/) || [])[1];
      const title   = (raw.match(/<title>([^<]+)<\/title>/) || [])[1];
      const published = (raw.match(/<published>([^<]+)<\/published>/) || [])[1];
      if (videoId && title) entries.push({ videoId, title, published: published || '' });
    }
    return entries;
  } catch (err) {
    console.warn(`  ⚠ RSS chaîne ${channelId}: ${err.message}`);
    return [];
  }
}

/* ── Refresh clips depuis les chaînes YouTube (GRATUIT) ──── */
let isRefreshingClips = false;

async function refreshClipsFromChannels() {
  console.log('\n🎬 ONE MEDIA — Scan clips YouTube (RSS gratuit)');

  // 1. Charger le cache des channel_id
  let cache = readJSON(CHANNEL_CACHE_FILE, {});

  // 2. Résoudre les handles manquants dans le cache
  // Les artistes avec channelId direct sont immédiatement mis en cache
  for (const ch of ARTIST_CHANNELS) {
    if (ch.channelId && !cache[ch.handle]) {
      cache[ch.handle] = ch.channelId; // channel ID connu directement
    }
    if (!cache[ch.handle]) {
      console.log(`  🔍 Résolution ${ch.handle}…`);
      const id = await resolveChannelId(ch.handle);
      if (id) {
        cache[ch.handle] = id;
        console.log(`  ✓ ${ch.handle} → ${id}`);
      }
      await new Promise(r => setTimeout(r, 800));
    }
  }
  writeJSON(CHANNEL_CACHE_FILE, cache);

  // 3. Lire les vidéos récentes de chaque chaîne
  const since48h    = Date.now() - 48 * 3600 * 1000;
  const data        = readJSON(CLIPS_FILE, { clips: [], pending: [] });
  const existingIds = new Set(data.clips.map(c => c.videoId));
  let   added       = 0;

  for (const ch of ARTIST_CHANNELS) {
    const channelId = cache[ch.handle];
    if (!channelId) continue;

    const videos = await fetchChannelVideos(channelId);
    for (const v of videos) {
      if (existingIds.has(v.videoId)) continue;

      const publishedTs = v.published ? new Date(v.published).getTime() : 0;
      const isNew48h    = publishedTs && publishedTs >= since48h;

      const clip = {
        id:         `clip_rss_${Date.now()}_${v.videoId}`,
        videoId:    v.videoId,
        title:      v.title,
        artist:     ch.artist,
        country:    ch.country,
        addedAt:    new Date().toISOString(),
        releasedAt: v.published || new Date().toISOString(),
        verified:   false,     // l'admin valide avant affichage public
        autoFound:  true,
        isNew48h,
      };
      data.clips.unshift(clip);
      existingIds.add(v.videoId);
      if (isNew48h) {
        added++;
        console.log(`  🆕 ${ch.artist} : "${v.title.slice(0, 50)}" (${v.published?.slice(0,10)})`);
      }
    }
    await new Promise(r => setTimeout(r, 600));
  }

  data.updatedAt       = new Date().toISOString();
  data.lastAutoRefresh = new Date().toISOString();
  writeJSON(CLIPS_FILE, data);
  console.log(`  ✅ ${added} nouveau(x) clip(s) des 48h trouvés\n`);
  return added;
}

// POST /api/clips/auto-refresh — déclenche le scan (admin)
app.post('/api/clips/auto-refresh', adminAuth, async (req, res) => {
  if (isRefreshingClips) return res.json({ message: 'Scan clips déjà en cours…' });
  res.json({ message: '🎬 Scan clips YouTube démarré (RSS gratuit, sans API)…' });
  isRefreshingClips = true;
  try   { await refreshClipsFromChannels(); }
  catch (err) { console.error('❌ Clips refresh:', err.message); }
  finally     { isRefreshingClips = false; }
});

// GET /api/clips/new48h — clips des 48 dernières heures (public)
app.get('/api/clips/new48h', (req, res) => {
  const data    = readJSON(CLIPS_FILE, { clips: [] });
  const since48h = Date.now() - 48 * 3600 * 1000;
  const recent  = (data.clips || []).filter(c => {
    const ts = c.releasedAt ? new Date(c.releasedAt).getTime() : 0;
    return ts >= since48h && c.verified !== false; // seulement les clips vérifiés
  });
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.json({ clips: recent, count: recent.length, since: new Date(since48h).toISOString() });
});

/* ── API Événements ─────────────────────────────────────── */

app.get('/api/events', (req, res) => {
  const data = readJSON(EVENTS_FILE, { events: [] });
  data.events.sort((a, b) => new Date(a.date) - new Date(b.date));
  res.setHeader('Cache-Control', 'public, max-age=60');
  res.json(data);
});

app.post('/api/events/add', adminAuth, (req, res) => {
  const { title, artist, date, time, venue, city, country, category, image, description, ticketUrl } = req.body;
  if (!title || !date) return res.status(400).json({ error: 'title et date requis' });
  const data = readJSON(EVENTS_FILE, { events: [] });
  const evt  = {
    id: `evt_${Date.now()}`,
    title, artist: artist||'', date, time: time||'20:00',
    venue: venue||'', city: city||'', country: country||'guinee',
    category: category||'concert',
    image: image||'',
    description: description||'',
    ticketUrl: ticketUrl||'',
    isLive: false, liveUrl: '',
    addedAt: new Date().toISOString(),
  };
  data.events.push(evt);
  writeJSON(EVENTS_FILE, data);
  res.json({ success: true, event: evt });
});

app.post('/api/events/:id/live', adminAuth, (req, res) => {
  const { isLive, liveUrl } = req.body;
  const data = readJSON(EVENTS_FILE, { events: [] });
  const evt  = data.events.find(e => e.id === req.params.id);
  if (!evt) return res.status(404).json({ error: 'Événement introuvable' });
  evt.isLive  = !!isLive;
  evt.liveUrl = liveUrl !== undefined ? liveUrl : evt.liveUrl;
  writeJSON(EVENTS_FILE, data);
  console.log(`📡 Event "${evt.title}" → ${evt.isLive ? '🔴 EN LIVE' : '⚫ offline'}`);
  res.json({ success: true, event: evt });
});

app.put('/api/events/:id', adminAuth, (req, res) => {
  const data = readJSON(EVENTS_FILE, { events: [] });
  const idx  = data.events.findIndex(e => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Événement introuvable' });
  data.events[idx] = { ...data.events[idx], ...req.body, id: req.params.id };
  writeJSON(EVENTS_FILE, data);
  res.json({ success: true, event: data.events[idx] });
});

app.delete('/api/events/:id', adminAuth, (req, res) => {
  const data = readJSON(EVENTS_FILE, { events: [] });
  data.events = data.events.filter(e => e.id !== req.params.id);
  writeJSON(EVENTS_FILE, data);
  res.json({ success: true });
});

/* ── Proxy Deezer (contourne le blocage CORS navigateur) ─── */
app.get('/api/music/search', async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).json({ error: 'q requis' });
  try {
    const r = await axios.get(`https://api.deezer.com/search`, {
      params: { q, limit: 1 },
      timeout: 6000,
      headers: { 'Accept': 'application/json' }
    });
    res.json(r.data);
  } catch (err) {
    console.warn('Deezer proxy error:', err.message);
    res.status(502).json({ data: [] });
  }
});

/* ── Artists CRUD ────────────────────────────────────────── */
const ARTISTS_FILE = path.join(__dirname, 'artists.json');

// GET public — retourne les artistes custom ajoutés via admin
app.get('/api/artists', (req, res) => {
  res.json(readJSON(ARTISTS_FILE, { artists: [] }));
});

// POST admin — auto-fill depuis un handle YouTube
app.post('/api/artists/autofill', adminAuth, async (req, res) => {
  const { handle } = req.body;
  if (!handle) return res.status(400).json({ error: 'Handle requis (ex: @NomArtiste)' });
  const cleanHandle = handle.trim().startsWith('@') ? handle.trim() : `@${handle.trim()}`;

  try {
    // 1. Résoudre channel ID (cache d'abord)
    let channelId = null;
    const cache = readJSON(CHANNEL_CACHE_FILE, {});
    if (cache[cleanHandle]) {
      channelId = cache[cleanHandle];
      console.log(`  ✓ Cache: ${cleanHandle} → ${channelId}`);
    } else {
      console.log(`  🔍 Résolution ${cleanHandle}…`);
      channelId = await resolveChannelId(cleanHandle);
      if (channelId) {
        cache[cleanHandle] = channelId;
        writeJSON(CHANNEL_CACHE_FILE, cache);
        console.log(`  ✓ Résolu: ${cleanHandle} → ${channelId}`);
      }
    }

    if (!channelId) {
      return res.json({ success: false, error: `Chaîne YouTube introuvable pour "${cleanHandle}". Vérifie le handle exact.` });
    }

    // 2. Lire flux RSS pour avoir le nom de chaîne et les vidéos récentes
    const videos = await fetchChannelVideos(channelId);
    const latestVideos = videos.slice(0, 3).map(v => ({
      title: v.title,
      url:   `https://www.youtube.com/watch?v=${v.videoId}`,
      thumb: `https://img.youtube.com/vi/${v.videoId}/mqdefault.jpg`,
      date:  v.published
    }));

    // 3. Construire l'image de profil depuis la miniature du dernier clip
    const profileImage = latestVideos[0]
      ? `https://img.youtube.com/vi/${videos[0].videoId}/maxresdefault.jpg`
      : '';

    // 4. Nom de chaîne = texte entre les <name> du flux Atom
    let channelName = cleanHandle.replace('@', '');
    try {
      const xmlRes = await axios.get(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, {
        timeout: 6000, headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      const authorMatch = String(xmlRes.data).match(/<author>\s*<name>([^<]+)<\/name>/);
      if (authorMatch) channelName = authorMatch[1].trim();
    } catch { /* keep handle name */ }

    const suggestedId = channelName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    res.json({
      success:     true,
      channelId,
      channelName,
      prefilled: {
        id:            suggestedId,
        name:          channelName,
        youtubeHandle: cleanHandle,
        youtube:       `https://www.youtube.com/${cleanHandle}`,
        image:         profileImage,
        recentVideos:  latestVideos,
        videoCount:    videos.length,
      }
    });
  } catch (err) {
    console.error('autofill error:', err.message);
    res.json({ success: false, error: err.message });
  }
});

// POST admin — ajouter un artiste
app.post('/api/artists', adminAuth, (req, res) => {
  const a = req.body;
  if (!a.name) return res.status(400).json({ error: 'Champ "name" requis' });
  const data = readJSON(ARTISTS_FILE, { artists: [] });
  const id = (a.id || a.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')) + '-custom';
  if (data.artists.find(x => x.id === id)) return res.status(409).json({ error: `ID "${id}" déjà utilisé` });
  const artist = {
    id,
    name:          a.name          || '',
    realName:      a.realName      || '',
    country:       a.country       || 'afrique',
    flag:          a.flag          || '🌍',
    genre:         a.genre         || '',
    genres:        a.genres        || ['afrobeats'],
    verified:      a.verified      !== false,
    image:         a.image         || '',
    imageFallback: a.imageFallback || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80',
    bio:           a.bio           || '',
    streams:       a.streams       || '',
    streamNote:    a.streamNote    || 'Spotify',
    award:         a.award         || '',
    articles:      [],
    spotify:       a.spotify       || '',
    deezer:        a.deezer        || '',
    youtube:       a.youtube       || '',
    instagram:     a.instagram     || '',
    tiktok:        a.tiktok        || '',
    color:         a.color         || '#FF6B35',
    stats:         a.stats         || [],
    youtubeHandle: a.youtubeHandle || '',
    channelId:     a.channelId     || '',
    addedAt:       new Date().toISOString(),
    source:        'admin'
  };
  data.artists.push(artist);
  writeJSON(ARTISTS_FILE, data);
  console.log(`🎤 Artiste ajouté: ${artist.name} (${artist.country})`);
  res.json({ success: true, artist });
});

// PUT admin — modifier un artiste
app.put('/api/artists/:id', adminAuth, (req, res) => {
  const data = readJSON(ARTISTS_FILE, { artists: [] });
  const idx  = data.artists.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Artiste introuvable' });
  data.artists[idx] = { ...data.artists[idx], ...req.body, id: req.params.id, updatedAt: new Date().toISOString() };
  writeJSON(ARTISTS_FILE, data);
  res.json({ success: true, artist: data.artists[idx] });
});

// DELETE admin — supprimer un artiste
app.delete('/api/artists/:id', adminAuth, (req, res) => {
  const data = readJSON(ARTISTS_FILE, { artists: [] });
  const found = data.artists.find(a => a.id === req.params.id);
  if (!found) return res.status(404).json({ error: 'Artiste introuvable' });
  data.artists = data.artists.filter(a => a.id !== req.params.id);
  writeJSON(ARTISTS_FILE, data);
  console.log(`🗑 Artiste supprimé: ${found.name}`);
  res.json({ success: true });
});

/* ── Contact form ───────────────────────────────────────── */
const CONTACTS_FILE     = path.join(__dirname, 'contacts.json');
const SUBMISSIONS_FILE  = path.join(__dirname, 'submissions.json');

app.post('/api/contact', (req, res) => {
  const { name, email, subject, message, type, organization, artistName, artistLink } = req.body;
  if (!name || !email || !subject || !message) return res.status(400).json({ error: 'Champs requis manquants' });
  const data = readJSON(CONTACTS_FILE, { contacts: [] });
  data.contacts.push({ id: Date.now().toString(), name, email, subject, message, type: type || 'general', organization, artistName, artistLink, receivedAt: new Date().toISOString(), read: false });
  writeJSON(CONTACTS_FILE, data);
  console.log(`📬 Nouveau contact: [${type || 'general'}] ${name} <${email}> — "${subject}"`);
  res.json({ success: true });
});

app.get('/api/contacts', adminAuth, (req, res) => {
  res.json(readJSON(CONTACTS_FILE, { contacts: [] }));
});

/* ── Artist submissions ──────────────────────────────────── */
app.post('/api/submission', (req, res) => {
  const { artist, links, contact, message, submittedAt } = req.body;
  if (!artist?.stageName || !contact?.email) return res.status(400).json({ error: 'Dossier incomplet' });
  const data = readJSON(SUBMISSIONS_FILE, { submissions: [] });
  data.submissions.push({
    id: Date.now().toString(),
    artist, links, contact, message,
    submittedAt: submittedAt || new Date().toISOString(),
    status: 'pending'  // pending | accepted | rejected
  });
  writeJSON(SUBMISSIONS_FILE, data);
  console.log(`🎤 Nouvelle soumission artiste: ${artist.stageName} (${artist.country}) par ${contact.name} <${contact.email}>`);
  res.json({ success: true });
});

app.get('/api/submissions', adminAuth, (req, res) => {
  res.json(readJSON(SUBMISSIONS_FILE, { submissions: [] }));
});

app.put('/api/submissions/:id/status', adminAuth, (req, res) => {
  const { status } = req.body;
  if (!['pending','accepted','rejected'].includes(status)) return res.status(400).json({ error: 'Status invalide' });
  const data = readJSON(SUBMISSIONS_FILE, { submissions: [] });
  const sub  = data.submissions.find(s => s.id === req.params.id);
  if (!sub) return res.status(404).json({ error: 'Introuvable' });
  sub.status = status;
  writeJSON(SUBMISSIONS_FILE, data);
  res.json({ success: true, submission: sub });
});

/* ── Newsletter ──────────────────────────────────────────── */

app.post('/api/subscribe', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'Email invalide' });
  const data = readJSON(SUBSCRIBERS_FILE, { subscribers: [] });
  if (!data.subscribers.includes(email)) {
    data.subscribers.push(email);
    writeJSON(SUBSCRIBERS_FILE, data);
  }
  res.json({ success: true, total: data.subscribers.length });
});

app.get('/api/subscribers', adminAuth, (req, res) => {
  res.json(readJSON(SUBSCRIBERS_FILE, { subscribers: [] }));
});

/* ── Newsletter send (Resend.com) ────────────────────────── */
app.post('/api/newsletter/send', adminAuth, async (req, res) => {
  const RESEND_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_KEY) return res.status(500).json({ error: 'RESEND_API_KEY non configurée. Ajoute-la dans Railway → Variables.' });

  const { subject, html, previewText } = req.body;
  if (!subject || !html) return res.status(400).json({ error: 'subject et html requis' });

  const data = readJSON(SUBSCRIBERS_FILE, { subscribers: [] });
  const emails = data.subscribers.filter(e => e && e.includes('@'));
  if (emails.length === 0) return res.status(400).json({ error: 'Aucun abonné' });

  // Resend batch: max 50 per request (free plan)
  const BATCH = 50;
  const results = { sent: 0, failed: 0, errors: [] };

  for (let i = 0; i < emails.length; i += BATCH) {
    const batch = emails.slice(i, i + BATCH);
    try {
      const payload = {
        from: 'ONE MEDIA <newsletter@onemedia.africa>',
        to: batch,
        subject,
        html: html + `<p style="font-size:11px;color:#666;margin-top:32px;">
          Tu reçois cet email car tu t'es abonné(e) à ONE MEDIA.<br>
          <a href="https://one-media-delta.vercel.app" style="color:#FF6B35">Lire sur le site</a> &nbsp;·&nbsp;
          <a href="https://one-media-production.up.railway.app/api/unsubscribe?email={{email}}" style="color:#666">Se désabonner</a>
        </p>`,
        ...(previewText ? { headers: { 'X-Preview-Text': previewText } } : {})
      };
      const response = await axios.post('https://api.resend.com/emails/batch', batch.map(to => ({
        from: 'ONE MEDIA <onboarding@resend.dev>',
        to: [to],
        subject,
        html: payload.html
      })), {
        headers: { Authorization: `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
        timeout: 15000
      });
      results.sent += batch.length;
    } catch (err) {
      results.failed += batch.length;
      results.errors.push(err.response?.data?.message || err.message);
    }
  }

  console.log(`📧 Newsletter envoyée: ${results.sent} succès, ${results.failed} échecs`);
  res.json({ success: results.failed === 0, ...results, total: emails.length });
});

/* ── Unsubscribe (lien email) ────────────────────────────── */
app.get('/api/unsubscribe', (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).send('Email manquant');
  const data = readJSON(SUBSCRIBERS_FILE, { subscribers: [] });
  const before = data.subscribers.length;
  data.subscribers = data.subscribers.filter(e => e !== email);
  writeJSON(SUBSCRIBERS_FILE, data);
  const removed = data.subscribers.length < before;
  res.send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Désabonnement — ONE MEDIA</title>
  <style>body{font-family:sans-serif;background:#0a0a0a;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}
  .box{text-align:center;max-width:400px;padding:40px}</style></head><body><div class="box">
  <h1 style="color:#FF6B35;font-size:40px;margin:0 0 16px">${removed ? '✓' : 'ℹ️'}</h1>
  <h2>${removed ? 'Désabonnement confirmé' : 'Email non trouvé'}</h2>
  <p style="color:#aaa">${removed ? `<strong>${email}</strong> a bien été retiré(e) de la liste.` : 'Cet email n\'est pas dans notre liste.'}</p>
  <a href="https://one-media-delta.vercel.app" style="color:#FF6B35">← Retour à ONE MEDIA</a>
  </div></body></html>`);
});

/* ── Fallback SPA ────────────────────────────────────────── */
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

/* ── Cron ────────────────────────────────────────────────── */
cron.schedule('0 */6 * * *', async () => {
  if (isGenerating) return;
  console.log('\n⏰ Cron articles...');
  isGenerating = true;
  try   { await generate(); }
  catch (err) { console.error('❌ Cron articles:', err.message); }
  finally     { isGenerating = false; }
});

// Refresh clips YouTube toutes les 6h (RSS GRATUIT — pas de clé API)
cron.schedule('30 */6 * * *', async () => {
  if (isRefreshingClips) return;
  console.log('\n⏰ Cron clips YouTube RSS...');
  isRefreshingClips = true;
  try   { await refreshClipsFromChannels(); }
  catch (err) { console.error('❌ Cron clips:', err.message); }
  finally     { isRefreshingClips = false; }
});

/* ── Gestion erreurs globales (évite les crashs Railway) ─── */
process.on('uncaughtException', (err) => {
  console.error('❌ UncaughtException (non-fatal):', err.message);
});
process.on('unhandledRejection', (reason) => {
  console.error('❌ UnhandledRejection (non-fatal):', reason?.message || reason);
});

/* ── Lancement ───────────────────────────────────────────── */
app.listen(PORT, () => {
  console.log('\n' + '═'.repeat(50));
  console.log('  🔴  ONE MEDIA SERVER v2');
  console.log('═'.repeat(50));
  console.log(`  URL    : http://localhost:${PORT}`);
  console.log(`  API    : http://localhost:${PORT}/api/articles`);
  console.log(`  Admin  : http://localhost:${PORT}/admin.html`);
  console.log(`  Gzip   : ✅ activé`);
  console.log(`  YouTube: ${process.env.YOUTUBE_API_KEY ? '✅ clips auto' : '⚠ clé manquante'}`);
  console.log('═'.repeat(50) + '\n');

  if (!fs.existsSync(ARTICLES_FILE) && process.env.GROQ_API_KEY) {
    console.log('📡 Première génération au démarrage...');
    isGenerating = true;
    generate().catch(err => console.error('❌ Init:', err.message)).finally(() => { isGenerating = false; });
  } else if (fs.existsSync(ARTICLES_FILE)) {
    const d = readJSON(ARTICLES_FILE, { count: 0 });
    console.log(`📦 ${d.count} articles chargés`);
  }
});
