/* ===========================================================
   ONE MEDIA — design.js
   Preloader · Transitions · Dark/Light · Back to top · Cookies
   =========================================================== */

/* ── PRELOADER ───────────────────────────────────────────── */
(function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  const hide = () => {
    preloader.classList.add('hidden');
    document.body.style.overflow = '';
  };

  document.body.style.overflow = 'hidden';

  if (document.readyState === 'complete') {
    setTimeout(hide, 1600);
  } else {
    window.addEventListener('load', () => setTimeout(hide, 1600));
  }
})();

/* ── PAGE TRANSITIONS ────────────────────────────────────── */
(function initPageTransitions() {
  const overlay = document.getElementById('page-transition');
  if (!overlay) return;

  // Entrée : fade in depuis overlay
  document.addEventListener('DOMContentLoaded', () => {
    overlay.classList.remove('active');
  });

  // Sortie : overlay avant navigation
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;

    link.addEventListener('click', e => {
      e.preventDefault();
      overlay.classList.add('active');
      setTimeout(() => { window.location.href = href; }, 280);
    });
  });
})();

/* ── THEME DARK / LIGHT ──────────────────────────────────── */
(function initTheme() {
  const btn  = document.getElementById('theme-btn');
  const saved = localStorage.getItem('om_theme');

  if (saved === 'light') {
    document.body.classList.add('light');
    if (btn) btn.textContent = '☾';
  }

  btn?.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light');
    btn.textContent = isLight ? '☾' : '☀';
    localStorage.setItem('om_theme', isLight ? 'light' : 'dark');
  });
})();

/* ── BACK TO TOP ─────────────────────────────────────────── */
(function initBackTop() {
  const btn = document.getElementById('back-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ── COOKIES ─────────────────────────────────────────────── */
(function initCookies() {
  const banner  = document.getElementById('cookie-banner');
  if (!banner) return;
  if (localStorage.getItem('om_cookies')) return;

  setTimeout(() => banner.classList.add('visible'), 2000);

  document.getElementById('cookie-accept')?.addEventListener('click', () => {
    localStorage.setItem('om_cookies', 'accepted');
    banner.classList.remove('visible');
  });
  document.getElementById('cookie-refuse')?.addEventListener('click', () => {
    localStorage.setItem('om_cookies', 'refused');
    banner.classList.remove('visible');
  });
})();

/* ── STICKY SHARE (article) ──────────────────────────────── */
(function initStickyShare() {
  const shareBar = document.querySelector('.sticky-share');
  if (!shareBar) return;

  let shown = false;
  window.addEventListener('scroll', () => {
    const show = window.scrollY > 400;
    if (show !== shown) {
      shown = show;
      shareBar.classList.toggle('visible', show);
    }
  }, { passive: true });
})();

/* ── PARALLAX HERO ───────────────────────────────────────── */
(function initParallax() {
  const heroImg = document.querySelector('.hero-main-img');
  if (!heroImg) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      heroImg.style.transform = `translateY(${y * 0.25}px)`;
    }
  }, { passive: true });
})();

/* ── ARTICLE CARD DATA-CAT ATTRIBUTE ─────────────────────── */
(function addCardCatAttrs() {
  document.querySelectorAll('.article-card').forEach(card => {
    const catEl = card.querySelector('[class*="cat-"]');
    if (!catEl) return;
    const cls = [...catEl.classList].find(c => c.startsWith('cat-') && c !== 'cat-bar');
    if (cls) card.dataset.cat = cls.replace('cat-', '');
  });
})();

/* ── GLITCH ON HERO TITLES ───────────────────────────────── */
(function initGlitch() {
  document.querySelectorAll('.glitch').forEach(el => {
    el.dataset.text = el.textContent;
  });
})();

/* ── MANIFESTO BAND (si présent) ─────────────────────────── */
(function initManifestoBand() {
  const band = document.querySelector('.manifesto-band-inner');
  if (!band) return;
  // Clone pour loop infinie
  const clone = band.innerHTML;
  band.innerHTML = clone + clone;
})();

/* ── NUMBER COUNTER ANIMATION ────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.about-stat-num');
  if (!counters.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const raw = el.textContent;
      const num = parseFloat(raw.replace(/[^0-9.]/g, ''));
      const suffix = raw.replace(/[0-9.]/g, '');
      if (!num) return;

      let start = 0;
      const duration = 1200;
      const startTime = performance.now();

      function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = start + (num - start) * eased;
        el.textContent = (current >= 1000 ? (current / 1000).toFixed(1).replace('.0','') + suffix.replace('M','') + 'M' : Math.round(current) + suffix);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = raw;
      }
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => obs.observe(c));
})();

/* ── THEME BUTTON dans header principal ──────────────────── */
// Inject le bouton si pas présent (pages sans design.js inline)
(function injectThemeBtn() {
  if (document.getElementById('theme-btn')) return;
  const actions = document.querySelector('.header-actions');
  if (!actions) return;

  const btn = document.createElement('button');
  btn.className = 'theme-btn';
  btn.id = 'theme-btn';
  btn.setAttribute('aria-label', 'Changer le thème');
  const saved = localStorage.getItem('om_theme');
  btn.textContent = saved === 'light' ? '☾' : '☀';
  if (saved === 'light') document.body.classList.add('light');

  btn.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light');
    btn.textContent = isLight ? '☾' : '☀';
    localStorage.setItem('om_theme', isLight ? 'light' : 'dark');
  });

  actions.insertBefore(btn, actions.firstChild);
})();

/* ── BACK TO TOP INJECT ──────────────────────────────────── */
(function injectBackTop() {
  if (document.getElementById('back-top')) return;
  const btn = document.createElement('button');
  btn.className = 'back-top';
  btn.id = 'back-top';
  btn.setAttribute('aria-label', 'Retour en haut');
  btn.textContent = '↑';
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 600), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ── CATEGORY INTRO ANIMATION ────────────────────────────── */
(function initCatIntro() {
  // Seulement sur la page catégorie
  if (!window.location.href.includes('category')) return;
  const cat = new URLSearchParams(window.location.search).get('cat');
  if (!cat) return;

  const barHeights = [62, 92, 48, 100, 78, 54, 88, 42, 96, 70, 58, 82];

  const splatPositions = [
    { w: 60, h: 60, top: '20%', left: '15%' },
    { w: 40, h: 40, top: '70%', left: '75%' },
    { w: 80, h: 80, top: '15%', left: '70%' },
    { w: 35, h: 35, top: '75%', left: '20%' },
    { w: 55, h: 55, top: '45%', left: '88%' },
  ];

  const labels = { musique:'MUSIQUE', cinema:'CINÉMA', mode:'MODE', art:'ART', lifestyle:'LIFESTYLE' };

  const buildHtml = {
    musique: () =>
      `<div class="ci-bars">${barHeights.map((h,i)=>`<div class="ci-bar" style="height:${h}%;--i:${i}"></div>`).join('')}</div>
       <div class="ci-label">${labels.musique}</div>`,

    cinema: () =>
      `<div class="ci-left"></div><div class="ci-right"></div>
       <div class="ci-label">${labels.cinema}</div>`,

    mode: () =>
      `<div class="ci-slices">${Array.from({length:6},(_,i)=>`<div class="ci-slice" style="--i:${i}"></div>`).join('')}</div>
       <div class="ci-label">${labels.mode}</div>`,

    art: () =>
      `<div class="ci-ink"></div>
       ${splatPositions.map((s,i)=>`<div class="ci-splat" style="width:${s.w}px;height:${s.h}px;top:${s.top};left:${s.left};--i:${i}"></div>`).join('')}
       <div class="ci-label">${labels.art}</div>`,

    lifestyle: () =>
      `${Array.from({length:5},(_,i)=>`<div class="ci-ring" style="--i:${i}"></div>`).join('')}
       <div class="ci-label">${labels.lifestyle}</div>`,
  };

  if (!buildHtml[cat]) return;

  const intro = document.createElement('div');
  intro.className = `cat-intro cat-intro--${cat}`;
  intro.innerHTML = buildHtml[cat]();
  document.body.appendChild(intro);

  // Double RAF pour déclencher les transitions CSS
  requestAnimationFrame(() => requestAnimationFrame(() => {
    intro.classList.add('playing');
  }));

  // Phase exit : révèle la page
  setTimeout(() => {
    intro.classList.add('exiting');
    setTimeout(() => intro.remove(), 700);
  }, 1050);
})();

/* ── COOKIE INJECT ───────────────────────────────────────── */
(function injectCookies() {
  if (document.getElementById('cookie-banner')) return;
  if (localStorage.getItem('om_cookies')) return;

  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.id = 'cookie-banner';
  banner.innerHTML = `
    <div class="cookie-text">On utilise des cookies pour améliorer ton expérience. <a href="#">En savoir plus.</a></div>
    <div class="cookie-btns">
      <button class="cookie-btn" id="cookie-refuse">Refuser</button>
      <button class="cookie-btn accept" id="cookie-accept">Accepter</button>
    </div>`;
  document.body.appendChild(banner);
  setTimeout(() => banner.classList.add('visible'), 2200);

  banner.querySelector('#cookie-accept').addEventListener('click', () => { localStorage.setItem('om_cookies','accepted'); banner.classList.remove('visible'); });
  banner.querySelector('#cookie-refuse').addEventListener('click', () => { localStorage.setItem('om_cookies','refused');  banner.classList.remove('visible'); });
})();

/* ── RÉACTIONS ÉMOJIS (article) ──────────────────────────── */
(function initReactions() {
  const main = document.getElementById('article-main');
  if (!main) return;

  const REACTIONS = [
    { id: 'fire',   emoji: '🔥', label: 'Feu'          },
    { id: 'gold',   emoji: '💯', label: 'Incontournable' },
    { id: 'mind',   emoji: '🤯', label: 'Mind blown'    },
    { id: 'heart',  emoji: '❤️', label: 'Coup de cœur'  },
    { id: 'target', emoji: '🎯', label: 'Précis'        },
  ];

  // Clé basée sur l'URL de l'article
  const key = 'om_reactions_' + (new URLSearchParams(location.search).get('id') || 'default');

  function getState() {
    try { return JSON.parse(localStorage.getItem(key) || '{}'); }
    catch { return {}; }
  }

  // Compteurs de base fictifs pour donner vie
  const BASE = { fire: 47, gold: 31, mind: 22, heart: 38, target: 19 };

  function render() {
    const state = getState();
    const wrap  = document.getElementById('reactions-row');
    if (!wrap) return;
    REACTIONS.forEach(r => {
      const btn = wrap.querySelector(`[data-rid="${r.id}"]`);
      if (!btn) return;
      const count = BASE[r.id] + (state[r.id] || 0);
      btn.querySelector('.reaction-count').textContent = count;
      btn.classList.toggle('reacted', !!state[r.id]);
    });
  }

  // Injecte le bloc après les tags
  const tagsEl = main.querySelector('.article-tags');
  const block  = document.createElement('div');
  block.className = 'article-reactions';
  block.innerHTML = `
    <div class="reactions-label">Ta réaction</div>
    <div class="reactions-row" id="reactions-row">
      ${REACTIONS.map(r => `
        <button class="reaction-btn" data-rid="${r.id}" title="${r.label}">
          <span class="reaction-emoji">${r.emoji}</span>
          <span class="reaction-count">0</span>
        </button>`).join('')}
    </div>`;

  if (tagsEl) tagsEl.after(block);
  else main.appendChild(block);

  render();

  block.querySelectorAll('.reaction-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const rid   = btn.dataset.rid;
      const state = getState();
      // Toggle : +1 si pas encore réagi, -1 si déjà réagi
      if (state[rid]) delete state[rid];
      else state[rid] = 1;
      localStorage.setItem(key, JSON.stringify(state));

      btn.classList.add('pop');
      btn.addEventListener('animationend', () => btn.classList.remove('pop'), { once: true });
      render();
    });
  });
})();

/* ── SÉLECTION → PARTAGER LA CITATION ───────────────────── */
(function initQuoteShare() {
  const body = document.querySelector('.article-body');
  if (!body) return;

  const popup = document.createElement('div');
  popup.className = 'quote-share-popup';
  popup.innerHTML = `
    <button class="quote-share-btn" id="qs-tweet">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      Tweeter
    </button>
    <span class="quote-sep">|</span>
    <button class="quote-share-btn" id="qs-copy">📋 Copier</button>`;
  document.body.appendChild(popup);

  let hideTimer;

  document.addEventListener('mouseup', e => {
    clearTimeout(hideTimer);
    const sel  = window.getSelection();
    const text = sel?.toString().trim();

    if (!text || text.length < 20 || text.length > 280 || !body.contains(sel.anchorNode)) {
      hideTimer = setTimeout(() => popup.classList.remove('visible'), 200);
      return;
    }

    const range = sel.getRangeAt(0).getBoundingClientRect();
    popup.style.left = Math.min(window.innerWidth - 240, Math.max(10, range.left + range.width / 2 - 110)) + 'px';
    popup.style.top  = (range.top + window.scrollY - popup.offsetHeight - 14) + 'px';
    popup.classList.add('visible');

    popup.querySelector('#qs-tweet').onclick = () => {
      const tweet = `"${text}" — ONE MEDIA`;
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}&url=${encodeURIComponent(location.href)}`, '_blank');
      popup.classList.remove('visible');
    };
    popup.querySelector('#qs-copy').onclick = () => {
      navigator.clipboard?.writeText(`"${text}" — ${document.title}`);
      popup.querySelector('#qs-copy').textContent = '✓ Copié !';
      setTimeout(() => { popup.querySelector('#qs-copy').textContent = '📋 Copier'; popup.classList.remove('visible'); }, 1400);
    };
  });

  document.addEventListener('mousedown', e => {
    if (!popup.contains(e.target)) {
      hideTimer = setTimeout(() => popup.classList.remove('visible'), 150);
    }
  });
})();

/* ── MODE LECTURE ────────────────────────────────────────── */
(function initReadMode() {
  const main = document.getElementById('article-main');
  if (!main) return;

  const bookmarkBtn = document.querySelector('.article-bookmark-btn');
  const btn = document.createElement('button');
  btn.className = 'read-mode-btn';
  btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> Lecture`;

  const saved = localStorage.getItem('om_read_mode') === '1';
  if (saved) { document.body.classList.add('read-mode'); btn.classList.add('active'); btn.innerHTML = btn.innerHTML.replace('Lecture', 'Normal'); }

  btn.addEventListener('click', () => {
    const active = document.body.classList.toggle('read-mode');
    btn.classList.toggle('active', active);
    btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> ${active ? 'Normal' : 'Lecture'}`;
    localStorage.setItem('om_read_mode', active ? '1' : '0');
  });

  if (bookmarkBtn) bookmarkBtn.after(btn);
  else document.querySelector('.article-hero-content')?.appendChild(btn);
})();
