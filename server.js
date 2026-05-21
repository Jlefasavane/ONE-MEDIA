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

const ARTICLES_FILE = path.join(__dirname, 'articles.json');

/* ── Middleware ──────────────────────────────────────────── */
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
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
  if (!exists) return res.json({ status: 'no_articles', message: 'Aucun article généré. Lance /api/refresh.' });
  const data = JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf8'));
  res.json({
    status: 'ok',
    count: data.count,
    generatedAt: data.generatedAt,
    nextRefresh: 'Toutes les 6 heures (cron)',
  });
});

// POST /api/refresh — déclenche une génération manuelle
app.post('/api/refresh', async (req, res) => {
  console.log('\n🔄 Refresh manuel déclenché via API');
  res.json({ message: 'Génération démarrée. Revenez dans 1-2 minutes.' });
  try {
    await generate();
    console.log('✅ Refresh terminé');
  } catch (err) {
    console.error('❌ Erreur refresh :', err.message);
  }
});

/* ── Fichiers statiques ──────────────────────────────────── */
app.use(express.static(__dirname));

// Fallback SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

/* ── Cron : refresh toutes les 6 heures ─────────────────── */
cron.schedule('0 */6 * * *', async () => {
  console.log('\n⏰ Cron refresh démarré...');
  try {
    await generate();
  } catch (err) {
    console.error('❌ Erreur cron :', err.message);
  }
});

/* ── Lancement ───────────────────────────────────────────── */
app.listen(PORT, () => {
  console.log('\n' + '═'.repeat(50));
  console.log('  🔴  ONE MEDIA SERVER');
  console.log('═'.repeat(50));
  console.log(`  URL    : http://localhost:${PORT}`);
  console.log(`  API    : http://localhost:${PORT}/api/articles`);
  console.log(`  Status : http://localhost:${PORT}/api/status`);
  console.log('═'.repeat(50));
  console.log('  Refresh auto : toutes les 6 heures');
  console.log('  Refresh manuel : POST /api/refresh\n');

  // Génération au démarrage si pas d'articles
  if (!fs.existsSync(ARTICLES_FILE) && process.env.GROQ_API_KEY && process.env.NEWS_API_KEY) {
    console.log('📡 Première génération au démarrage...');
    generate().catch(err => console.error('❌ Erreur init :', err.message));
  } else if (!fs.existsSync(ARTICLES_FILE)) {
    console.log('⚠️  Ajoute tes clés API dans .env puis relance.');
  } else {
    const data = JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf8'));
    console.log(`📦 ${data.count} articles chargés (générés le ${new Date(data.generatedAt).toLocaleString('fr-FR')})`);
  }
});
