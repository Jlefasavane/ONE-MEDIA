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

/* ── BOOKMARK SYSTEM ─────────────────────────────────────── */
function getSavedArticles() {
  try { return JSON.parse(localStorage.getItem('om_saved') || '[]'); }
  catch { return []; }
}
function isSaved(id) { return getSavedArticles().includes(String(id)); }
function toggleSave(id) {
  const saved = getSavedArticles();
  const idx   = saved.indexOf(String(id));
  if (idx === -1) saved.push(String(id));
  else saved.splice(idx, 1);
  localStorage.setItem('om_saved', JSON.stringify(saved));
  window.dispatchEvent(new CustomEvent('om-saved-changed'));
  return idx === -1; // true si vient d'être sauvegardé
}

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

  /* ── Open Graph dynamique ── */
  const ogUrl = `https://one-media-delta.vercel.app/article.html?id=${a.id}`;
  const ogImg = a.image || 'https://one-media-delta.vercel.app/og-cover.jpg';
  const ogDesc = a.excerpt || 'Le média culturel de référence. Musique, Cinéma, Mode, Art, Lifestyle africain.';
  const setMeta = (id, attr, val) => { const el = document.getElementById(id); if (el) el.setAttribute(attr, val); };
  setMeta('og-title',   'content', `${a.title} — ONE MEDIA`);
  setMeta('og-desc',    'content', ogDesc);
  setMeta('og-image',   'content', ogImg);
  setMeta('og-url',     'content', ogUrl);
  setMeta('tw-title',   'content', `${a.title} — ONE MEDIA`);
  setMeta('tw-desc',    'content', ogDesc);
  setMeta('tw-image',   'content', ogImg);
  setMeta('page-desc',  'content', ogDesc);

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
      ${a.video ? `
      <div class="article-video-label">▶ Vidéo</div>
      <div class="article-video-wrap">
        <iframe src="https://www.youtube.com/embed/${a.video}?rel=0&modestbranding=1"
          title="${a.title}" allowfullscreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture">
        </iframe>
      </div>` : ''}
      <div class="article-body">
        ${a.body || LOREM_BODY.join('\n')}
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

  /* ── BOOKMARK BUTTON in hero ── */
  const heroContent = document.querySelector('.article-hero-content');
  if (heroContent) {
    const bBtn = document.createElement('button');
    bBtn.className = 'article-bookmark-btn' + (isSaved(a.id) ? ' saved' : '');
    bBtn.setAttribute('aria-label', 'Sauvegarder');
    bBtn.innerHTML = isSaved(a.id)
      ? '<span class="bk-icon">★</span><span class="bk-label">Sauvegardé</span>'
      : '<span class="bk-icon">☆</span><span class="bk-label">Sauvegarder</span>';
    bBtn.addEventListener('click', () => {
      const nowSaved = toggleSave(a.id);
      bBtn.classList.toggle('saved', nowSaved);
      bBtn.innerHTML = nowSaved
        ? '<span class="bk-icon">★</span><span class="bk-label">Sauvegardé</span>'
        : '<span class="bk-icon">☆</span><span class="bk-label">Sauvegarder</span>';
    });
    heroContent.appendChild(bBtn);
  }

  /* ── STICKY SHARE BAR ── */
  const shareBar = document.createElement('div');
  shareBar.className = 'sticky-share';
  shareBar.innerHTML = `
    <span class="sticky-share-label">Partager</span>
    <button class="sticky-share-btn" id="ss-copy" title="Copier le lien">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
    </button>
    <a class="sticky-share-btn" href="https://twitter.com/intent/tweet?text=${encodeURIComponent(a.title)}&url=${encodeURIComponent(location.href)}" target="_blank" title="Partager sur X">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
    </a>
    <a class="sticky-share-btn" href="https://wa.me/?text=${encodeURIComponent(a.title + ' — ' + location.href)}" target="_blank" title="WhatsApp">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
    </a>
    <button class="sticky-share-btn sticky-save-btn${isSaved(a.id) ? ' saved' : ''}" id="ss-save" title="Sauvegarder">
      ${isSaved(a.id) ? '★' : '☆'}
    </button>`;
  document.body.appendChild(shareBar);

  // Copy link
  document.getElementById('ss-copy')?.addEventListener('click', function() {
    navigator.clipboard?.writeText(location.href).then(() => {
      this.style.color = '#00f5ff';
      setTimeout(() => this.style.color = '', 1500);
    });
  });

  // Save from sticky bar
  const ssSave = document.getElementById('ss-save');
  ssSave?.addEventListener('click', () => {
    const nowSaved = toggleSave(a.id);
    ssSave.classList.toggle('saved', nowSaved);
    ssSave.textContent = nowSaved ? '★' : '☆';
    // Sync hero button
    const bBtn = document.querySelector('.article-bookmark-btn');
    if (bBtn) {
      bBtn.classList.toggle('saved', nowSaved);
      bBtn.innerHTML = nowSaved
        ? '<span class="bk-icon">★</span><span class="bk-label">Sauvegardé</span>'
        : '<span class="bk-icon">☆</span><span class="bk-label">Sauvegarder</span>';
    }
  });

  // Sticky bar visibility on scroll
  let stickyShown = false;
  window.addEventListener('scroll', () => {
    const show = window.scrollY > 400;
    if (show !== stickyShown) { stickyShown = show; shareBar.classList.toggle('visible', show); }
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', renderArticlePage);
