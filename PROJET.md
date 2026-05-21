# ONE MEDIA — État du projet

## Infos générales
- **Type** : Media culturel (Guinée / Afrique)
- **Frontend** : Vercel → https://one-media-delta.vercel.app
- **Backend** : Railway → https://one-media-production.up.railway.app
- **Repo GitHub** : https://github.com/Jlefasavane/ONE-MEDIA (branche `master`)
- **Dossier local** : `C:\Users\jeune\OneMedia`
- **Admin** : https://one-media-delta.vercel.app/admin.html — mdp : `onemedia2026!`

## Stack technique
- **Frontend** : HTML/CSS/JS vanilla (pas de framework)
- **Backend** : Node.js + Express sur Railway
- **CSS principal** : `design.css` + `style.css`
- **Fichiers JS** : `article.js`, `category.js`, `player.js`
- **Email** : Resend.com (3000 mails/mois gratuit)
- **Données** : JSON locaux sur Railway (articles.json, subscribers.json, events.json, clips.json, artists.json, contacts.json, submissions.json)

## Pages du site
- `index.html` — Page d'accueil
- `article.html` + `article.js` — Articles dynamiques (param `?id=...`)
- `category.html` + `category.js` — Filtrage par catégorie
- `artists.html` — Artistes (local hardcodé + API custom)
- `about.html` — À propos
- `contact.html` — Formulaire contact multi-onglets
- `submission.html` — Soumission artiste
- `legal.html` — Mentions légales / RGPD / CGU / cookies
- `admin.html` — Panneau d'administration complet

## Backend — Endpoints principaux
```
POST /api/admin/login
GET  /api/articles
POST /api/articles/generate
PUT  /api/articles/:id
GET  /api/clips
POST /api/clips/auto-refresh
GET  /api/events
POST /api/events/add
PUT  /api/events/:id/live
GET  /api/subscribers
POST /api/newsletter/subscribe
POST /api/newsletter/send       ← Resend.com
GET  /api/unsubscribe
POST /api/contact
GET  /api/contacts              ← admin
POST /api/submission
GET  /api/submissions           ← admin
PUT  /api/submissions/:id/status
GET  /api/artists
POST /api/artists/autofill      ← YouTube handle → channelId + vidéos
POST /api/artists               ← admin
PUT  /api/artists/:id           ← admin
DELETE /api/artists/:id         ← admin
GET  /api/music/search          ← proxy Deezer (contourne CORS)
```

## Fonctionnalités complètes
- [x] SEO + Open Graph sur toutes les pages
- [x] Génération automatique d'articles (cron)
- [x] Clips YouTube auto-refresh via RSS Atom (sans API key)
- [x] Artistes dynamiques : admin peut ajouter via handle YouTube (auto-fill)
- [x] Player musique Deezer 30s (proxy Railway pour contourner CORS)
- [x] Newsletter Resend.com (subscribe + unsubscribe + envoi batch admin)
- [x] Formulaire contact (5 types) + soumissions artistes
- [x] Admin complet : articles, clips, events, artistes, contacts, soumissions, newsletter
- [x] Live events (URL YouTube/Twitch + toggle EN LIVE)
- [x] Footer avec tous les liens corrects

## Problèmes connus / en attente
- [ ] **Emails Railway** : l'utilisateur reçoit des mails d'erreur de Railway — à diagnostiquer (probablement redéploiements qui échouent ou health checks)
- [ ] **og-cover.jpg** : image OG manquante dans le repo (à ajouter pour les previews sociales)
- [ ] **Admin** : à retester après le fix du `}` parasite — l'utilisateur a dit "Ca marche pas" mais on est passés à autre chose

## Derniers commits
1. `fix: player musique — proxy Railway pour contourner CORS Deezer`
2. `fix: admin.html — suppression du } parasite qui cassait tout le JS`
3. `feat: artistes dynamiques — CRUD admin + auto-fill YouTube`
4. `feat: SEO, pages manquantes, newsletter Resend, soumissions artistes`
