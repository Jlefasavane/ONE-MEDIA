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
      follower.style.borderColor = 'rgba(125,57,235,.8)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width   = '8px';
      cursor.style.height  = '8px';
      follower.style.transform = 'translate(-50%,-50%) scale(1)';
      follower.style.borderColor = 'rgba(125,57,235,.5)';
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

/* ── LAZY IMAGE FADE-IN ──────────────────────────────────── */
(function initLazyFade() {
  const fadeInImage = img => {
    if (img.complete) { img.classList.add('loaded'); return; }
    img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
  };
  // Images déjà dans le DOM
  document.querySelectorAll('img[loading="lazy"]').forEach(fadeInImage);
  // Observer pour les images ajoutées dynamiquement
  const mo = new MutationObserver(muts => {
    muts.forEach(m => m.addedNodes.forEach(node => {
      if (node.nodeType !== 1) return;
      const imgs = node.matches?.('img[loading="lazy"]') ? [node] : [...(node.querySelectorAll?.('img[loading="lazy"]') || [])];
      imgs.forEach(fadeInImage);
    }));
  });
  mo.observe(document.body, { childList: true, subtree: true });
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

  function renderHome() {
  /* HERO — sélection aléatoire à chaque visite */
  const allForHero = (ARTICLES || []).filter(a => a.title && a.image && a.excerpt);
  // Mélange Fisher-Yates (déterministe par session via seed basé sur la minute)
  const seed = Math.floor(Date.now() / 60000); // change chaque minute
  const rng  = (i) => ((seed * 1103515245 + i * 12345 + 7) >>> 0) / 0xFFFFFFFF;
  const shuffled = [...allForHero].sort((a, b) => rng(allForHero.indexOf(a)) - rng(allForHero.indexOf(b)));
  const featured = shuffled.slice(0, 3);
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
  } // end renderHome

  renderHome();
  window.addEventListener('articles-updated', renderHome);
})();

/* ═══════════════════════════════════════════════════
   ONE CHART — Le Classement du Continent
   Sources : Apple Music CI · UK Official Afrobeats ·
             Spotify · Billboard Hot 100
═══════════════════════════════════════════════════ */
(function initChart() {
  const list  = document.getElementById('chart-list');
  const label = document.getElementById('chart-week-label');
  if (!list || typeof CHART_DATA === 'undefined') return;

  if (label) label.textContent = CHART_DATA.weekLabel;

  const TREND_ICON  = { up: '↑', down: '↓', stable: '—', new: 'NEW' };
  const TREND_CLASS = { up: 'trend-up', down: 'trend-down', stable: 'trend-stable', new: 'trend-new' };

  // Source pills header
  const srcEl = document.getElementById('chart-sources');
  if (srcEl && CHART_DATA.sources) {
    srcEl.innerHTML = CHART_DATA.sources.map(s =>
      `<span class="chart-source-pill">${s}</span>`
    ).join('');
  }

  list.innerHTML = CHART_DATA.tracks.map(t => {
    const badges = (t.badges || []).map(b =>
      `<span class="chart-badge" style="--badge-color:${b.color}">${b.label}</span>`
    ).join('');
    const peakMark = t.peakNew
      ? `<span class="chart-peak chart-peak--new">▲ Nouveau</span>`
      : (t.peak === t.rank ? `<span class="chart-peak chart-peak--top">◆ Peak</span>` : '');

    return `
    <div class="chart-item" data-query="${encodeURIComponent(t.deezerQuery)}" data-rank="${t.rank}">
      <div class="chart-rank-block">
        <div class="chart-rank">${String(t.rank).padStart(2, '0')}</div>
        <div class="chart-trend ${TREND_CLASS[t.trend]}">${TREND_ICON[t.trend]}</div>
      </div>
      <div class="chart-cover">
        <img src="${t.cover}" alt="${t.artist}" loading="lazy"
             onerror="this.src='https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=56&h=56&fit=crop&q=60'">
      </div>
      <div class="chart-info">
        <div class="chart-artist-row">
          <span class="chart-artist">${t.artist}</span>
          <span class="chart-country-flag" title="${t.countryName||''}">${t.country}</span>
        </div>
        <div class="chart-track">${t.title}</div>
        <div class="chart-badges-row">${badges}${peakMark}</div>
      </div>
      <div class="chart-stats">
        <div class="chart-stat-number">${t.stats?.streams || ''}</div>
        <div class="chart-stat-label">${t.stats?.label || ''}</div>
        <div class="chart-weeks">${t.weeks} sem.</div>
      </div>
      <button class="chart-play-btn" aria-label="Écouter ${t.title} de ${t.artist}">
        <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor"><path d="M0 0l12 7-12 7z"/></svg>
      </button>
    </div>`;
  }).join('');

  // Spotlight Guinée
  if (CHART_DATA.spotlight) {
    const sp = CHART_DATA.spotlight;
    const spEl = document.createElement('div');
    spEl.className = 'chart-spotlight';
    spEl.innerHTML = `
      <span class="chart-spotlight-label">${sp.label}</span>
      <span class="chart-spotlight-artist">${sp.artist}</span>
      <span class="chart-spotlight-note">${sp.note}</span>
    `;
    list.appendChild(spEl);
  }

  // Click → recherche Deezer dans le player
  list.querySelectorAll('.chart-item').forEach(item => {
    item.addEventListener('click', () => {
      const query = decodeURIComponent(item.dataset.query);
      window.dispatchEvent(new CustomEvent('deezer-search', { detail: { query } }));
    });
    item.querySelector('.chart-play-btn')?.addEventListener('click', e => {
      e.stopPropagation();
      const query = decodeURIComponent(item.dataset.query);
      window.dispatchEvent(new CustomEvent('deezer-search', { detail: { query } }));
    });
  });
})();

/* ═══════════════════════════════════════════════════
   CLIPS YOUTUBE
═══════════════════════════════════════════════════ */
(function initClips() {
  const scroll  = document.getElementById('clips-scroll');
  const modal   = document.getElementById('yt-modal');
  const iframe  = document.getElementById('yt-iframe');
  const mTitle  = document.getElementById('yt-modal-title');
  const mArtist = document.getElementById('yt-modal-artist');
  const mClose  = document.getElementById('yt-modal-close');
  const mBdrop  = document.getElementById('yt-modal-backdrop');
  if (!scroll) return;

  const COUNTRY_FLAGS = { guinee: '🇬🇳', cote_ivoire: '🇨🇮', senegal: '🇸🇳', nigeria: '🇳🇬', afrique: '🌍', mali: '🇲🇱', cameroun: '🇨🇲' };

  function openModal(clip) {
    iframe.src = `https://www.youtube.com/embed/${clip.videoId}?autoplay=1&rel=0&modestbranding=1`;
    mTitle.textContent  = clip.title;
    mArtist.textContent = clip.artist;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    iframe.src = '';
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (mClose)  mClose.addEventListener('click', closeModal);
  if (mBdrop)  mBdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  function renderClips(clips) {
    if (!clips.length) {
      scroll.innerHTML = `
        <div class="clips-empty">
          <div class="clips-empty-icon">🎬</div>
          <div class="clips-empty-text">Les premiers clips arrivent bientôt.<br>Tu es artiste ? Soumets le tien !</div>
          <button class="clips-empty-btn" onclick="document.getElementById('clips-submit-btn').click()">Soumettre mon clip</button>
        </div>`;
      return;
    }
    scroll.innerHTML = clips.map(clip => {
      const thumb = `https://img.youtube.com/vi/${clip.videoId}/mqdefault.jpg`;
      const flag  = COUNTRY_FLAGS[clip.country] || '🌍';
      const isNew = clip.addedAt && (Date.now() - new Date(clip.addedAt).getTime()) < 7 * 24 * 3600 * 1000;
      return `
        <div class="clip-card" data-video="${clip.videoId}" data-title="${clip.title}" data-artist="${clip.artist}">
          <div class="clip-thumb">
            <img src="${thumb}" alt="${clip.title}" loading="lazy">
            <div class="clip-play-btn">
              <div class="clip-play-circle">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
              </div>
            </div>
            <div class="clip-country-flag">${flag}</div>
          </div>
          <div class="clip-info">
            <div class="clip-title">${clip.title}${isNew ? '<span class="clip-new-badge">NEW</span>' : ''}</div>
            <div class="clip-artist">${clip.artist}</div>
          </div>
        </div>`;
    }).join('');

    scroll.querySelectorAll('.clip-card').forEach(card => {
      card.addEventListener('click', () => openModal({
        videoId: card.dataset.video,
        title:   card.dataset.title,
        artist:  card.dataset.artist,
      }));
    });
  }

  // Charger depuis Railway
  fetch(`${typeof API_BASE !== 'undefined' ? API_BASE : ''}/api/clips`)
    .then(r => r.ok ? r.json() : { clips: [] })
    .then(d => renderClips(d.clips || []))
    .catch(() => renderClips([]));
})();

/* ═══════════════════════════════════════════════════
   MODAL SOUMETTRE UN CLIP
═══════════════════════════════════════════════════ */
(function initSubmitModal() {
  const submitBtn    = document.getElementById('clips-submit-btn');
  const modal        = document.getElementById('submit-modal');
  const closeBtn     = document.getElementById('submit-modal-close');
  const backdrop     = document.getElementById('submit-modal-backdrop');
  const form         = document.getElementById('submit-form');
  const successEl    = document.getElementById('submit-success');
  if (!modal) return;

  function open()  { modal.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function close() { modal.classList.remove('open'); document.body.style.overflow = ''; }

  if (submitBtn) submitBtn.addEventListener('click', e => { e.preventDefault(); open(); });
  if (closeBtn)  closeBtn.addEventListener('click', close);
  if (backdrop)  backdrop.addEventListener('click', close);

  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const data = {
        url:    document.getElementById('submit-url').value,
        artist: document.getElementById('submit-artist').value,
        title:  document.getElementById('submit-title').value,
        email:  document.getElementById('submit-email').value,
      };
      try {
        await fetch(`${typeof API_BASE !== 'undefined' ? API_BASE : ''}/api/clips/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      } catch {}
      form.style.display = 'none';
      successEl.style.display = 'block';
      setTimeout(close, 3000);
    });
  }
})();

/* ═══════════════════════════════════════════════════
   NEWSLETTER
═══════════════════════════════════════════════════ */
(function initNewsletter() {
  const form    = document.getElementById('signal-form');
  const success = document.getElementById('signal-success');
  const emailEl = document.getElementById('signal-email');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const email = emailEl.value.trim();
    if (!email) return;
    try {
      await fetch(`${typeof API_BASE !== 'undefined' ? API_BASE : ''}/api/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    } catch {}
    form.style.display = 'none';
    success.style.display = 'block';
    localStorage.setItem('om_subscribed', '1');
  });

  // Masquer si déjà abonné
  if (localStorage.getItem('om_subscribed')) {
    form.style.display = 'none';
    if (success) { success.style.display = 'block'; success.textContent = '✓ Tu es déjà sur le signal.'; }
  }
})();

/* ═══════════════════════════════════════════════════
   ÉVÉNEMENTS — Section agenda + LIVE polling
═══════════════════════════════════════════════════ */
(function initEvents() {
  const scrollEl  = document.getElementById('events-scroll');
  if (!scrollEl) return;

  const MONTHS_FR = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];
  const CAT_LABELS = { concert: 'Concert', festival: 'Festival', expo: 'Exposition', conference: 'Conférence', mode: 'Défilé', sport: 'Sport' };

  let _liveModalOpen = false;
  let _knownLiveIds  = new Set();

  /* ── Rendu d'une carte ── */
  function renderCard(evt) {
    const d    = new Date(evt.date);
    const day  = d.getDate();
    const mon  = MONTHS_FR[d.getMonth()];
    const cat  = CAT_LABELS[evt.category] || evt.category;

    const liveClass = evt.isLive ? 'is-live' : '';
    const liveBadge = evt.isLive
      ? `<div class="event-live-badge">EN DIRECT</div>` : '';
    const catBadge  = !evt.isLive
      ? `<div class="event-cat-badge">${cat}</div>` : '';

    const ticketBtn = evt.ticketUrl
      ? `<a href="${evt.ticketUrl}" target="_blank" rel="noopener" class="event-btn event-btn-ticket">Réserver →</a>`
      : `<span class="event-btn event-btn-ticket" style="opacity:.45;cursor:default">Bientôt →</span>`;

    const liveBtn = evt.isLive
      ? `<button class="event-btn event-btn-live" onclick="openLiveModal('${evt.id}')">SUIVRE EN LIVE</button>`
      : '';

    return `
    <div class="event-card ${liveClass}" id="evtcard-${evt.id}">
      ${liveBadge}
      <div class="event-img-wrap">
        <img src="${evt.image || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80'}"
             alt="${evt.title}" loading="lazy"
             onerror="this.src='https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80'">
        ${catBadge}
        <div class="event-date-badge">
          <div class="event-date-day">${day}</div>
          <div class="event-date-month">${mon}</div>
        </div>
      </div>
      <div class="event-body">
        <div class="event-artist">${evt.artist || ''}</div>
        <div class="event-title-card">${evt.title}</div>
        <div class="event-venue">📍 ${evt.venue}</div>
        <div class="event-city">${evt.city}</div>
        <div class="event-time">🕐 ${evt.time}</div>
        <div class="event-actions">
          ${ticketBtn}
          ${liveBtn}
        </div>
      </div>
    </div>`;
  }

  /* ── Chargement des événements ── */
  async function loadEvents() {
    try {
      const r = await fetch(`${API_BASE}/api/events`);
      if (!r.ok) return;
      const { events } = await r.json();
      if (!events?.length) {
        scrollEl.innerHTML = `<p class="events-empty">Aucun événement annoncé pour le moment. Revenez bientôt.</p>`;
        return;
      }
      // Trier par date + isLive en premier
      events.sort((a, b) => {
        if (a.isLive && !b.isLive) return -1;
        if (!a.isLive && b.isLive) return 1;
        return new Date(a.date) - new Date(b.date);
      });
      scrollEl.innerHTML = events.map(renderCard).join('');

      // Détecter nouveaux events LIVE pour la notification
      events.forEach(evt => {
        if (evt.isLive && !_knownLiveIds.has(evt.id)) {
          _knownLiveIds.add(evt.id);
          showLiveAlert(evt);
        }
      });
      _knownLiveIds = new Set(events.filter(e => e.isLive).map(e => e.id));
    } catch (e) {
      console.warn('Events load error', e);
    }
  }

  /* ── Bannière notification LIVE ── */
  function showLiveAlert(evt) {
    let alert = document.getElementById('live-alert-banner');
    if (!alert) {
      alert = document.createElement('div');
      alert.className = 'live-alert';
      alert.id = 'live-alert-banner';
      document.body.appendChild(alert);
    }
    alert.innerHTML = `<span class="live-alert-dot"></span> 🔴 ${evt.title} est EN DIRECT maintenant — <u>Rejoindre le live</u>`;
    alert.onclick = () => openLiveModal(evt.id);
    requestAnimationFrame(() => alert.classList.add('show'));
    // Se cache après 12s si non cliqué
    setTimeout(() => alert.classList.remove('show'), 12000);
  }

  /* ── Modal LIVE ── */
  let _eventsCache = [];
  window.openLiveModal = function(evtId) {
    fetch(`${API_BASE}/api/events`).then(r => r.json()).then(({ events }) => {
      const evt = events.find(e => e.id === evtId);
      if (!evt || !evt.isLive) return;
      _eventsCache = events;
      const modal = document.getElementById('live-modal');
      const iframe = document.getElementById('live-iframe');
      const titleEl = document.getElementById('live-modal-event-title');
      if (!modal || !iframe) return;
      // Convertir une URL YouTube/Twitch en embed
      const src = buildEmbedUrl(evt.liveUrl);
      iframe.src = src;
      if (titleEl) titleEl.textContent = evt.title;
      modal.classList.add('open');
      _liveModalOpen = true;
    });
  };

  function buildEmbedUrl(url) {
    if (!url) return '';
    // YouTube live
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`;
    // YouTube live direct embed
    const ytEmbed = url.match(/youtube\.com\/embed\/([^?&\s]+)/);
    if (ytEmbed) return url;
    // Twitch
    const twitch = url.match(/twitch\.tv\/([^\/\s?]+)/);
    if (twitch) return `https://player.twitch.tv/?channel=${twitch[1]}&parent=${window.location.hostname}&autoplay=true`;
    // URL déjà prête
    return url;
  }

  // Fermeture du modal
  function closeLiveModal() {
    const modal  = document.getElementById('live-modal');
    const iframe = document.getElementById('live-iframe');
    if (modal)  modal.classList.remove('open');
    if (iframe) iframe.src = '';
    _liveModalOpen = false;
  }

  document.addEventListener('click', e => {
    if (e.target.id === 'live-modal-backdrop' || e.target.id === 'live-modal-close') {
      closeLiveModal();
    }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLiveModal(); });

  /* ── Polling LIVE toutes les 30 secondes ── */
  loadEvents();
  setInterval(loadEvents, 30000);

})();

/* ═══════════════════════════════════════════════════
   PWA — Bannière d'installation
═══════════════════════════════════════════════════ */
(function initPWA() {
  let deferredPrompt = null;
  if (localStorage.getItem('pwa_dismissed')) return;

  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    setTimeout(showBanner, 5000);
  });

  function showBanner() {
    const banner = document.createElement('div');
    banner.className = 'pwa-banner';
    banner.innerHTML = `
      <div class="pwa-icon">📱</div>
      <div class="pwa-text">
        <div class="pwa-title">Installer ONE MEDIA</div>
        <div class="pwa-sub">Accès direct depuis ton téléphone</div>
      </div>
      <button class="pwa-btn" id="pwa-install">Installer</button>
      <button class="pwa-dismiss" id="pwa-dismiss">✕</button>`;
    document.body.appendChild(banner);
    setTimeout(() => banner.classList.add('show'), 100);

    document.getElementById('pwa-install').addEventListener('click', () => {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => { banner.remove(); });
    });
    document.getElementById('pwa-dismiss').addEventListener('click', () => {
      banner.classList.remove('show');
      setTimeout(() => banner.remove(), 400);
      localStorage.setItem('pwa_dismissed', '1');
    });
  }
})();
