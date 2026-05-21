/* ===========================================================
   ONE MEDIA — Serveur Express
   Sert le site statique + API articles + refresh auto IA
   =========================================================== */

require('dotenv').config();
const express = require('express');
const path    = require('path');
const fs      = require('fs');
const cron    = require('node-cron');
const { generate } = require('./generator');

const app  = express();
const PORT = process.env.PORT || 3002;

const ARTICLES_FILE  = path.join(__dirname, 'articles.json');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'onemedia2026!';

/* ── Middleware ──────────────────────────────────────────── */
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,x-admin-token');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

/* ── Auth Admin ──────────────────────────────────────────── */
function adminAuth(req, res, next) {
  const token = req.headers['x-admin-token'];
  const expected = Buffer.from(ADMIN_PASSWORD).toString('base64');
  if (token !== expected) {
    return res.status(401).json({ error: 'Non autorisé' });
  }
  next();
}

// POST /api/admin/login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    const token = Buffer.from(ADMIN_PASSWORD).toString('base64');
    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, error: 'Mot de passe incorrect' });
  }
});

/* ── API Articles ────────────────────────────────────────── */

// GET /api/articles — tous les articles IA
app.get('/api/articles', (req, res) => {
  if (!fs.existsSync(ARTICLES_FILE)) {
    return res.json({ articles: [], generatedAt: null, count: 0 });
  }
  try {
    const data = JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf8'));
    res.json(data);
  } catch {
    res.status(500).json({ error: 'Erreur lecture articles.json' });
  }
});

// GET /api/articles/:id — un article par ID
app.get('/api/articles/:id', (req, res) => {
  if (!fs.existsSync(ARTICLES_FILE)) return res.status(404).json({ error: 'Not found' });
  const data = JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf8'));
  const article = data.articles?.find(a => a.id === req.params.id || a.slug === req.params.id);
  if (!article) return res.status(404).json({ error: 'Article not found' });
  res.json(article);
});

// GET /api/status — statut du générateur
app.get('/api/status', (req, res) => {
  const exists = fs.existsSync(ARTICLES_FILE);
  if (!exists) return res.json({ status: 'no_articles', message: 'Aucun article généré.' });
  const data = JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf8'));
  res.json({
    status: 'ok',
    count: data.count,
    generatedAt: data.generatedAt,
    nextRefresh: 'Toutes les 6 heures (cron)',
  });
});

// POST /api/refresh — déclenche une génération (protégé admin)
let isGenerating = false;
app.post('/api/refresh', adminAuth, async (req, res) => {
  if (isGenerating) {
    return res.json({ message: 'Génération déjà en cours…' });
  }
  console.log('\n🔄 Refresh déclenché via admin');
  res.json({ message: 'Génération démarrée. Revenez dans 1-2 minutes.' });
  isGenerating = true;
  try {
    await generate();
    console.log('✅ Refresh terminé');
  } catch (err) {
    console.error('❌ Erreur refresh :', err.message);
  } finally {
    isGenerating = false;
  }
});

// GET /api/refresh/status — état de la génération
app.get('/api/refresh/status', (req, res) => {
  res.json({ generating: isGenerating });
});

/* ── Fichiers statiques ──────────────────────────────────── */
app.use(express.static(__dirname));

// Fallback SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

/* ── Cron : refresh toutes les 6 heures ─────────────────── */
cron.schedule('0 */6 * * *', async () => {
  if (isGenerating) return;
  console.log('\n⏰ Cron refresh démarré...');
  isGenerating = true;
  try {
    await generate();
  } catch (err) {
    console.error('❌ Erreur cron :', err.message);
  } finally {
    isGenerating = false;
  }
});

/* ── Lancement ───────────────────────────────────────────── */
app.listen(PORT, () => {
  console.log('\n' + '═'.repeat(50));
  console.log('  🔴  ONE MEDIA SERVER');
  console.log('═'.repeat(50));
  console.log(`  URL    : http://localhost:${PORT}`);
  console.log(`  API    : http://localhost:${PORT}/api/articles`);
  console.log(`  Admin  : http://localhost:${PORT}/admin.html`);
  console.log('═'.repeat(50));
  console.log('  Refresh auto : toutes les 6 heures');
  console.log('  Mot de passe admin : défini dans ADMIN_PASSWORD\n');

  if (!fs.existsSync(ARTICLES_FILE) && process.env.GROQ_API_KEY && process.env.NEWS_API_KEY) {
    console.log('📡 Première génération au démarrage...');
    isGenerating = true;
    generate()
      .catch(err => console.error('❌ Erreur init :', err.message))
      .finally(() => { isGenerating = false; });
  } else if (!fs.existsSync(ARTICLES_FILE)) {
    console.log('⚠️  Ajoute tes clés API dans .env puis relance.');
  } else {
    const data = JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf8'));
    console.log(`📦 ${data.count} articles chargés (générés le ${new Date(data.generatedAt).toLocaleString('fr-FR')})`);
  }
});
