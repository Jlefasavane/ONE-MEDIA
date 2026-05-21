/* ===========================================================
   ONE MEDIA — main.js (shared across all pages)
   =========================================================== */

/* ── CURSOR ──────────────────────────────────────────────── */
(function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (!cursor || !follower) return;

  let mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  (function animFollower() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(animFollower);
  })();

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width   = '14px';
      cursor.style.height  = '14px';
      follower.style.transform = 'translate(-50%,-50%) scale(1.6)';
      follower.style.borderColor = 'rgba(0,245,255,.7)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width   = '8px';
      cursor.style.height  = '8px';
      follower.style.transform = 'translate(-50%,-50%) scale(1)';
      follower.style.borderColor = 'rgba(0,245,255,.4)';
    });
  });

  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; follower.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; follower.style.opacity = '1'; });
})();

/* ── TICKER ──────────────────────────────────────────────── */
(function initTicker() {
  const inner = document.getElementById('ticker-inner');
  if (!inner) return;

  const breaking = getBreakingArticles();
  const latest   = getLatestArticles(6);
  const items    = [...breaking, ...latest].slice(0, 8);

  const html = items.map(a =>
    `<a href="article.html?id=${a.id}">${a.breaking ? '🔴 ' : ''}${a.title}</a><span class="ticker-sep">·</span>`
  ).join('');
  // Duplicate for seamless loop
  inner.innerHTML = html + html;
})();

/* ── HEADER HIDE ON SCROLL ───────────────────────────────── */
(function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;
  let lastY = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 20);
    header.classList.toggle('hidden', y > lastY && y > 200);
    lastY = y;
  }, { passive: true });
})();

/* ── ACTIVE NAV ──────────────────────────────────────────── */
(function initActiveNav() {
  const params = new URLSearchParams(window.location.search);
  const cat = params.get('cat');
  if (!cat) return;
  document.querySelectorAll('.nav-link[data-cat]').forEach(link => {
    link.classList.toggle('active', link.dataset.cat === cat);
  });
})();

/* ── MOBILE NAV ──────────────────────────────────────────── */
(function initMobileNav() {
  const btn     = document.getElementById('hamburger');
  const drawer  = document.getElementById('nav-drawer');
  const overlay = document.getElementById('nav-overlay');
  const close   = document.getElementById('nav-drawer-close');
  if (!btn || !drawer) return;

  const open  = () => { drawer.classList.add('open'); overlay.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const closeF= () => { drawer.classList.remove('open'); overlay.classList.remove('open'); document.body.style.overflow = ''; };

  btn.addEventListener('click', open);
  close?.addEventListener('click', closeF);
  overlay?.addEventListener('click', closeF);
})();

/* ── SEARCH ──────────────────────────────────────────────── */
(function initSearch() {
  const trigger  = document.getElementById('search-trigger');
  const overlay  = document.getElementById('search-overlay');
  const input    = document.getElementById('search-input');
  const results  = document.getElementById('search-results');
  const closeBtn = document.getElementById('search-close');
  if (!trigger || !overlay) return;

  const open  = () => { overlay.classList.add('open'); document.body.style.overflow = 'hidden'; setTimeout(() => input?.focus(), 100); };
  const close = () => { overlay.classList.remove('open'); document.body.style.overflow = ''; if (input) input.value = ''; if (results) results.innerHTML = ''; };

  trigger.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); open(); } });

  input?.addEventListener('input', () => {
    const q = input.value.trim();
    if (!results) return;
    if (!q) { results.innerHTML = ''; return; }

    const found = searchArticles(q);
    if (!found.length) {
      results.innerHTML = `<div class="search-no-results">Aucun résultat pour "${q}"</div>`;
      return;
    }
    results.innerHTML = found.slice(0, 6).map(a => `
      <a href="article.html?id=${a.id}" class="search-result-item">
        <div class="search-result-img"><img src="${a.image}" alt="${a.title}" loading="lazy"></div>
        <div>
          <div class="search-result-cat cat-${a.category}">${getCategoryMeta(a.category).label}</div>
          <div class="search-result-title">${a.title}</div>
        </div>
      </a>`).join('');
  });
})();

/* ── NEWSLETTER (signal form) ────────────────────────────── */
(function initNewsletter() {
  const form    = document.getElementById('signal-form');
  const success = document.getElementById('signal-success');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('signal-email')?.value;
    if (!email) return;
    localStorage.setItem('om_newsletter', email);
    form.style.display = 'none';
    if (success) success.style.display = '';
  });
})();

/* ── SAVED ARTICLES PANEL ────────────────────────────────── */
(function initSavedPanel() {
  function getSaved() {
    try { return JSON.parse(localStorage.getItem('om_saved') || '[]'); }
    catch { return []; }
  }

  // Inject bouton bookmark dans header-actions
  const actions = document.querySelector('.header-actions');
  if (!actions) return;

  const bkBtn = document.createElement('button');
  bkBtn.className = 'bookmark-header-btn';
  bkBtn.id = 'bookmark-header-btn';
  bkBtn.setAttribute('aria-label', 'Articles sauvegardés');
  bkBtn.innerHTML = `
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
    <span class="bookmark-badge" id="bookmark-badge" style="display:none">0</span>`;
  // Insérer avant search-trigger
  const searchTrigger = document.getElementById('search-trigger');
  actions.insertBefore(bkBtn, searchTrigger);

  // Panneau slide-in
  const panel = document.createElement('div');
  panel.className = 'saved-panel';
  panel.id = 'saved-panel';
  panel.innerHTML = `
    <div class="saved-panel-head">
      <span class="saved-panel-title">★ Sauvegardés</span>
      <button class="saved-panel-close" id="saved-panel-close">✕</button>
    </div>
    <div class="saved-panel-body" id="saved-panel-body"></div>`;
  document.body.appendChild(panel);

  const overlay = document.createElement('div');
  overlay.className = 'saved-panel-overlay';
  overlay.id = 'saved-panel-overlay';
  document.body.appendChild(overlay);

  function updateBadge() {
    const count = getSaved().length;
    const badge = document.getElementById('bookmark-badge');
    if (!badge) return;
    badge.style.display = count ? '' : 'none';
    badge.textContent = count;
  }

  function renderPanel() {
    const saved = getSaved();
    const body  = document.getElementById('saved-panel-body');
    if (!body) return;
    if (!saved.length) {
      body.innerHTML = `<div class="saved-empty">Aucun article sauvegardé.<br><span>Clique sur ☆ sur un article pour le retrouver ici.</span></div>`;
      return;
    }
    const articles = saved.map(id => typeof getArticleById === 'function' ? getArticleById(id) : null).filter(Boolean);
    body.innerHTML = articles.map(a => {
      const cat = typeof getCategoryMeta === 'function' ? getCategoryMeta(a.category) : { label: a.category };
      return `
        <a href="article.html?id=${a.id}" class="saved-item">
          <div class="saved-item-img"><img src="${a.image}" alt="${a.title}" loading="lazy"></div>
          <div class="saved-item-content">
            <div class="saved-item-cat cat-${a.category}">${cat.label}</div>
            <div class="saved-item-title">${a.title}</div>
            <div class="saved-item-meta">${a.readTime} min · ${a.author}</div>
          </div>
          <button class="saved-item-remove" data-id="${a.id}" title="Retirer">✕</button>
        </a>`;
    }).join('');

    body.querySelectorAll('.saved-item-remove').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault(); e.stopPropagation();
        const id   = btn.dataset.id;
        const list = getSaved().filter(x => x !== id);
        localStorage.setItem('om_saved', JSON.stringify(list));
        window.dispatchEvent(new CustomEvent('om-saved-changed'));
        renderPanel();
      });
    });
  }

  function openPanel() {
    renderPanel();
    panel.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closePanel() {
    panel.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  bkBtn.addEventListener('click', openPanel);
  document.getElementById('saved-panel-close')?.addEventListener('click', closePanel);
  overlay.addEventListener('click', closePanel);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePanel(); });
  window.addEventListener('om-saved-changed', updateBadge);

  updateBadge();
})();

/* ── REVEAL ON SCROLL ────────────────────────────────────── */
(function initReveals() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  items.forEach(el => obs.observe(el));
})();

/* ── ARTICLE CARD RENDERER ───────────────────────────────── */
function renderArticleCard(a, opts = {}) {
  const cat = getCategoryMeta(a.category);
  const { showExcerpt = true } = opts;
  return `
    <a href="article.html?id=${a.id}" class="article-card reveal">
      <div class="article-card-img">
        ${a.breaking ? '<span class="breaking-badge">Breaking</span>' : ''}
        <img src="${a.image}" alt="${a.title}" loading="lazy">
      </div>
      <div class="article-card-body">
        <div class="article-card-cat cat-${a.category}">${cat.label}</div>
        <div class="article-card-title">${a.title}</div>
        ${showExcerpt ? `<div class="article-card-excerpt">${a.excerpt}</div>` : ''}
        <div class="article-card-meta">
          <span>${a.author}</span>
          <span class="sep">·</span>
          <span>${formatDate(a.date)}</span>
          <span class="sep">·</span>
          <span>${a.readTime} min</span>
        </div>
      </div>
    </a>`;
}

/* ── HOME PAGE RENDER ────────────────────────────────────── */
(function initHome() {
  const heroGrid = document.getElementById('hero-grid');
  if (!heroGrid) return;

  /* HERO */
  const featured = getFeaturedArticles().slice(0, 3);
  const [main, ...sides] = featured;
  if (!main) return;

  const mainCat = getCategoryMeta(main.category);
  heroGrid.innerHTML = `
    <a href="article.html?id=${main.id}" class="hero-main">
      <div class="hero-main-img"><img src="${main.image}" alt="${main.title}"></div>
      <div class="hero-main-content">
        <div class="hero-cat-badge"><span class="dot"></span>${mainCat.label}</div>
        <h1 class="hero-title">${main.title}</h1>
        <p class="hero-excerpt">${main.excerpt}</p>
        <div class="hero-meta">
          <span>${main.author}</span>
          <span class="sep">·</span>
          <span>${formatDate(main.date)}</span>
          <span class="sep">·</span>
          <span>${main.readTime} min de lecture</span>
          <span class="sep">·</span>
          <span>${formatViews(main.views)} vues</span>
        </div>
      </div>
    </a>
    <div class="hero-side">
      ${sides.map(a => {
        const c = getCategoryMeta(a.category);
        return `
          <a href="article.html?id=${a.id}" class="hero-side-item">
            <div class="hero-side-bg"><img src="${a.image}" alt="${a.title}" loading="lazy"></div>
            <div class="hero-side-content">
              <div class="hero-side-cat">${c.label}</div>
              <div class="hero-side-title">${a.title}</div>
            </div>
          </a>`;
      }).join('')}
    </div>`;

  /* LATEST */
  const latestGrid = document.getElementById('latest-grid');
  if (latestGrid) {
    latestGrid.innerHTML = getLatestArticles(4)
      .map(a => renderArticleCard(a, { showExcerpt: false })).join('');
  }

  /* CAT SECTIONS */
  const cats = [
    { id: 'musique',   gridId: 'grid-musique',   limit: 3 },
    { id: 'cinema',    gridId: 'grid-cinema',    limit: 3 },
    { id: 'mode',      gridId: 'grid-mode',      limit: 3 },
    { id: 'art',       gridId: 'grid-art',       limit: 3 },
    { id: 'lifestyle', gridId: 'grid-lifestyle', limit: 4 },
  ];
  cats.forEach(({ id, gridId, limit }) => {
    const el = document.getElementById(gridId);
    if (!el) return;
    el.innerHTML = getArticlesByCategory(id, limit).map(a => renderArticleCard(a)).join('');
  });

  /* INTERVIEWS */
  const interviewGrid = document.getElementById('grid-interview');
  if (interviewGrid) {
    const interviews = getArticlesByCategory('interview', 3);
    interviewGrid.innerHTML = interviews.map(a => `
      <a href="article.html?id=${a.id}" class="interview-card reveal">
        <div class="interview-card-tag">Interview exclusive</div>
        <div class="interview-card-img"><img src="${a.image}" alt="${a.title}" loading="lazy"></div>
        <div class="interview-card-title">${a.title}</div>
        <div class="interview-card-excerpt">${a.excerpt}</div>
        <div class="interview-card-meta">
          <span>${a.author}</span>
          <span>·</span>
          <span>${formatDate(a.date)}</span>
          <span>·</span>
          <span>⏱ ${a.readTime} min</span>
        </div>
      </a>`).join('');
  }

  /* MOST READ */
  const mrList = document.getElementById('most-read-list');
  if (mrList) {
    mrList.innerHTML = getMostRead(5).map((a, i) => {
      const cat = getCategoryMeta(a.category);
      return `
        <a href="article.html?id=${a.id}" class="most-read-item reveal">
          <div class="most-read-num">0${i+1}</div>
          <div class="most-read-img"><img src="${a.image}" alt="${a.title}" loading="lazy"></div>
          <div class="most-read-content">
            <div class="most-read-cat cat-${a.category}">${cat.label}</div>
            <div class="most-read-title">${a.title}</div>
            <div class="most-read-views">${formatViews(a.views)} lectures</div>
          </div>
        </a>`;
    }).join('');
  }

  /* Trigger reveal after DOM is populated */
  setTimeout(() => {
    document.querySelectorAll('.reveal').forEach(el => {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
      }, { threshold: 0.08 });
      obs.observe(el);
    });
  }, 50);
})();
