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

// GET /api/status
app.get('/api/status', (req, res) => {
  if (!fs.existsSync(ARTICLES_FILE)) return res.json({ status: 'no_articles', message: 'Aucun article.' });
  const data = JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf8'));
  res.json({ status: 'ok', count: data.count, generatedAt: data.generatedAt, nextRefresh: 'Toutes les 6 heures (cron)' });
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
        YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY ? '✅ Présente' : '⚠ Non configurée (clips auto désactivés)',
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

// POST /api/clips/auto-refresh — cherche les clips YouTube des 48h (admin)
let isRefreshingClips = false;
app.post('/api/clips/auto-refresh', adminAuth, async (req, res) => {
  const YOUTUBE_KEY = process.env.YOUTUBE_API_KEY;
  if (!YOUTUBE_KEY) {
    return res.status(400).json({
      error: 'YOUTUBE_API_KEY non configurée.',
      help: 'Ajoute YOUTUBE_API_KEY dans les variables Railway (console.cloud.google.com → Credentials)',
    });
  }
  if (isRefreshingClips) return res.json({ message: 'Refresh clips déjà en cours…' });

  res.json({ message: 'Recherche de nouveaux clips YouTube démarrée…' });
  isRefreshingClips = true;

  try {
    await refreshYouTubeClips(YOUTUBE_KEY);
    console.log('✅ Clips YouTube rafraîchis');
  } catch (err) {
    console.error('❌ Erreur clips YouTube:', err.message);
  } finally {
    isRefreshingClips = false;
  }
});

/* ── Chercher de nouveaux clips YouTube 48h ──────────────── */
async function refreshYouTubeClips(apiKey) {
  const since48h = new Date(Date.now() - 48 * 3600 * 1000).toISOString();

  const QUERIES = [
    { q: 'afrobeats clip officiel 2026',   country: 'afrique' },
    { q: 'guinee musique clip officiel',   country: 'guinee' },
    { q: 'cote ivoire afropop clip',       country: 'cote_ivoire' },
    { q: 'senegal musique clip officiel',  country: 'senegal' },
    { q: 'nigeria afrobeats clip 2026',    country: 'nigeria' },
    { q: 'mali musique clip officiel',     country: 'mali' },
  ];

  const data        = readJSON(CLIPS_FILE, { clips: [], pending: [] });
  const existingIds = new Set(data.clips.map(c => c.videoId));
  let   added       = 0;

  for (const { q, country } of QUERIES) {
    try {
      const res = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part:          'snippet',
          q,
          type:          'video',
          videoCategoryId: '10', // Music
          publishedAfter: since48h,
          order:         'date',
          maxResults:    5,
          key:           apiKey,
          relevanceLanguage: 'fr',
        },
        timeout: 10000,
      });

      const items = res.data.items || [];
      console.log(`  🎬 YouTube "${q}" → ${items.length} clips`);

      for (const item of items) {
        const videoId = item.id?.videoId;
        if (!videoId || existingIds.has(videoId)) continue;

        const clip = {
          id:         `clip_yt_${Date.now()}_${videoId}`,
          videoId,
          title:      item.snippet.title,
          artist:     item.snippet.channelTitle,
          country,
          addedAt:    new Date().toISOString(),
          releasedAt: item.snippet.publishedAt,
          verified:   false, // l'admin doit valider
          autoFound:  true,
          thumbnail:  item.snippet.thumbnails?.high?.url || '',
        };

        data.clips.unshift(clip);
        existingIds.add(videoId);
        added++;
      }

      await new Promise(r => setTimeout(r, 500)); // respecter les quotas
    } catch (err) {
      console.warn(`  ⚠ YouTube search "${q}":`, err.response?.data?.error?.message || err.message);
    }
  }

  data.updatedAt    = new Date().toISOString();
  data.lastAutoRefresh = new Date().toISOString();
  writeJSON(CLIPS_FILE, data);
  console.log(`  🎬 ${added} nouveaux clips trouvés sur YouTube`);
  return added;
}

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

// Refresh clips YouTube toutes les 6h si clé disponible
cron.schedule('30 */6 * * *', async () => {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key || isRefreshingClips) return;
  console.log('\n⏰ Cron clips YouTube...');
  isRefreshingClips = true;
  try   { await refreshYouTubeClips(key); }
  catch (err) { console.error('❌ Cron clips:', err.message); }
  finally     { isRefreshingClips = false; }
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
