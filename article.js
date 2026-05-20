/* ===========================================================
   ONE MEDIA — article.js
   =========================================================== */

const LOREM_BODY = [
  `<p>C'est un de ces moments rares où la culture populaire et l'histoire s'entremêlent au point de devenir indiscernables. Ce n'est pas seulement une question de musique, de mode ou d'images — c'est une question de sens. De ce que nous choisissons de célébrer, de ce que nous décidons de questionner.</p>`,

  `<h2>Un contexte qui change tout</h2>
  <p>Pour comprendre ce qui se joue ici, il faut remonter en arrière. Non pas de quelques mois, mais de plusieurs années. Les graines de cette histoire ont été plantées bien avant que le grand public ne commence à en parler. Ceux qui suivaient de près le mouvement l'avaient vu venir.</p>
  <p>Les chiffres parlent d'eux-mêmes : en l'espace de dix-huit mois, le paysage a été redessiné. Les acteurs traditionnels ont été forcés de s'adapter ou de se mettre en retrait. Les nouveaux entrants ont imposé leurs règles. Et quelque part dans tout ça, une question fondamentale a émergé : à qui appartient la culture ?</p>`,

  `<blockquote>«&nbsp;Ce qui se passe là n'est pas une révolution. C'est une évolution. Mais une évolution si rapide qu'elle ressemble à une révolution.&nbsp;»</blockquote>`,

  `<h2>Les forces en présence</h2>
  <p>D'un côté, les institutions. Lentes, parfois réticentes, mais détentrices d'une légitimité accumulée sur des décennies. De l'autre, une génération qui n'a pas attendu leur validation pour créer, diffuser, imposer. Entre les deux, un espace de tension créatrice extraordinairement fertile.</p>
  <p>Nous avons rencontré plusieurs acteurs clés de ce mouvement. Ils ont tous une chose en commun : la conviction que ce qui se passe maintenant est irréversible. Qu'on ne peut pas revenir en arrière. Que la question n'est plus de savoir si les choses vont changer, mais comment.</p>`,

  `<div class="article-img-full">
    <img src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200&q=80" alt="Illustration" loading="lazy">
    <div class="img-caption">© ONE MEDIA — Toute reproduction interdite</div>
  </div>`,

  `<h2>Ce que ça dit de nous</h2>
  <p>Au fond, ce phénomène n'est pas différent de tous ceux qui l'ont précédé. L'histoire de la culture est une longue succession de ruptures, de récupérations, de réinventions. Ce qui est nouveau, c'est la vitesse. Et peut-être aussi la conscience collective — cette capacité qu'ont désormais les créateurs à se voir créer, à s'analyser en temps réel.</p>
  <p>C'est vertigineux et fascinant à la fois. Ça oblige à repenser les catégories, les hiérarchies, les valeurs. Ça oblige surtout à regarder en face quelque chose que la culture a toujours su faire : tenir un miroir au monde. Et ce que ce miroir reflète aujourd'hui est à la fois familier et complètement inédit.</p>
  <p>La suite ? Personne ne la connaît vraiment. Mais une chose est certaine : ceux qui refusent de regarder passeront à côté de quelque chose d'essentiel.</p>`,
];

function getArticleFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const id   = params.get('id');
  const slug = params.get('slug');
  return (id ? getArticleById(id) : null)
      || (slug ? getArticleBySlug(slug) : null)
      || ARTICLES[0];
}

function renderArticlePage() {
  const a = getArticleFromUrl();
  if (!a) return;

  document.title = `${a.title} — ONE MEDIA`;
  const cat = getCategoryMeta(a.category);

  /* ── HERO ── */
  const hero = document.getElementById('article-hero');
  if (hero) {
    hero.innerHTML = `
      <div class="article-hero-img"><img src="${a.image}" alt="${a.title}"></div>
      <div class="article-hero-content">
        <div class="article-breadcrumb">
          <a href="index.html">Accueil</a> &nbsp;/&nbsp;
          <a href="category.html?cat=${a.category}">${cat.label}</a> &nbsp;/&nbsp;
          <span>${a.title.slice(0, 50)}${a.title.length > 50 ? '…' : ''}</span>
        </div>
        <div class="article-hero-cat cat-${a.category}">${cat.label}</div>
        <h1 class="article-hero-title">${a.title}</h1>
        <div class="article-hero-meta">
          <span>${a.author}</span>
          <span class="sep">·</span>
          <span>${formatDate(a.date)}</span>
          <span class="sep">·</span>
          <span class="article-read-time">⏱ ${a.readTime} min de lecture</span>
          <span class="sep">·</span>
          <span>${formatViews(a.views)} lectures</span>
        </div>
      </div>`;
  }

  /* ── MAIN BODY ── */
  const main = document.getElementById('article-main');
  if (main) {
    main.innerHTML = `
      <p class="article-lead">${a.excerpt}</p>
      <div class="article-body">
        ${LOREM_BODY.join('\n')}
      </div>
      <div class="article-tags">
        ${a.tags.map(t => `<a href="category.html?cat=${a.category}&tag=${encodeURIComponent(t)}" class="article-tag"># ${t}</a>`).join('')}
      </div>`;
  }

  /* ── SIDEBAR ── */
  const sidebar = document.getElementById('article-sidebar');
  if (sidebar) {
    const related = getRelatedArticles(a, 3);
    const mostRead = getMostRead(3, a.id);
    sidebar.innerHTML = `
      <div class="sidebar-section">
        <div class="sidebar-label">À lire aussi</div>
        ${related.map(r => {
          const rc = getCategoryMeta(r.category);
          return `
            <a href="article.html?id=${r.id}" class="sidebar-article">
              <div class="sidebar-article-img"><img src="${r.image}" alt="${r.title}" loading="lazy"></div>
              <div>
                <div class="sidebar-article-cat cat-${r.category}">${rc.label}</div>
                <div class="sidebar-article-title">${r.title}</div>
              </div>
            </a>`;
        }).join('')}
      </div>
      <div class="sidebar-section">
        <div class="sidebar-label">Les plus lus</div>
        ${mostRead.map(r => {
          const rc = getCategoryMeta(r.category);
          return `
            <a href="article.html?id=${r.id}" class="sidebar-article">
              <div class="sidebar-article-img"><img src="${r.image}" alt="${r.title}" loading="lazy"></div>
              <div>
                <div class="sidebar-article-cat cat-${r.category}">${rc.label}</div>
                <div class="sidebar-article-title">${r.title}</div>
              </div>
            </a>`;
        }).join('')}
      </div>
      <div class="sidebar-section">
        <div class="sidebar-label">Partager</div>
        <div class="share-btns">
          <button class="share-btn" onclick="navigator.clipboard?.writeText(location.href);this.textContent='✓ Copié !'">
            <span class="share-btn-icon">🔗</span> Copier le lien
          </button>
          <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(a.title)}&url=${encodeURIComponent(location.href)}" target="_blank" class="share-btn">
            <span class="share-btn-icon">✕</span> Partager sur X
          </a>
          <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(location.href)}" target="_blank" class="share-btn">
            <span class="share-btn-icon">in</span> LinkedIn
          </a>
        </div>
      </div>`;
  }

  /* ── RELATED SECTION ── */
  const relatedGrid = document.getElementById('related-grid');
  if (relatedGrid) {
    const rel = getRelatedArticles(a, 3);
    relatedGrid.innerHTML = rel.map(r => renderArticleCard(r)).join('');
  }

  /* ── READ PROGRESS ── */
  const bar = document.getElementById('read-progress');
  if (bar) {
    window.addEventListener('scroll', () => {
      const body   = document.getElementById('article-main');
      if (!body) return;
      const rect   = body.getBoundingClientRect();
      const total  = body.offsetHeight;
      const scrolled = -rect.top;
      const pct    = Math.min(100, Math.max(0, (scrolled / total) * 100));
      bar.style.width = pct + '%';
    }, { passive: true });
  }

  /* Active nav */
  document.querySelectorAll('.nav-link[data-cat]').forEach(link => {
    link.classList.toggle('active', link.dataset?.cat === a.category);
  });
}

document.addEventListener('DOMContentLoaded', renderArticlePage);
