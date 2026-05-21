/* ===========================================================
   ONE MEDIA — player.js
   Musique via proxy Railway → Deezer Preview (30s, gratuit)
   =========================================================== */

(function initMusicPlayer() {

  const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3002'
    : 'https://one-media-production.up.railway.app';

  /* ── Tracks à charger (Guinée/Afrique en priorité) ───────── */
  const QUERIES = [
    { q: 'azaya guinee',            color: '#00F5FF' },
    { q: 'straiker conakry',        color: '#BF5AF2' },
    { q: 'djanii alfa guinee',      color: '#FF9500' },
    { q: 'ak4seven guinee',         color: '#BF5AF2' },
    { q: 'didi b cote ivoire',      color: '#FF2D55' },
    { q: 'burna boy last last',     color: '#30D158' },
    { q: 'wizkid essence',          color: '#FFE500' },
    { q: 'tyla water',              color: '#ff9f43' },
    { q: 'rema calm down',          color: '#30D158' },
    { q: 'aya nakamura djadja',     color: '#BF5AF2' },
  ];

  let TRACKS  = [];
  let audio   = new Audio();
  let current = 0;
  let playing = false;
  let ticker  = null;
  let eqTimer = null;
  let listOpen = false;

  audio.crossOrigin = 'anonymous';

  /* ── Chargement Deezer ──────────────────────────────────── */
  async function loadTracks() {
    const results = await Promise.all(QUERIES.map(async ({ q, color }) => {
      try {
        const r = await fetch(
          `${API_BASE}/api/music/search?q=${encodeURIComponent(q)}`,
          { mode: 'cors' }
        );
        const d = await r.json();
        const t = d.data?.[0];
        if (!t?.preview) return null;
        return {
          title:   t.title_short || t.title,
          artist:  t.artist.name,
          label:   t.album.title,
          duration: t.duration,
          img:     t.album.cover_medium || t.album.cover,
          preview: t.preview,
          deezer:  `https://www.deezer.com/track/${t.id}`,
          color,
        };
      } catch { return null; }
    }));
    TRACKS = results.filter(Boolean);
    if (TRACKS.length > 0) {
      load(0);
      bar.classList.add('ready');
    }
  }

  /* ── BUILD HTML ── */
  const bar = document.createElement('div');
  bar.id = 'music-player';
  bar.innerHTML = `
    <div class="mp-left">
      <button class="mp-toggle-btn" id="mp-toggle" title="Afficher / masquer">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="m18 15-6-6-6 6"/>
        </svg>
      </button>
      <div class="mp-label">DERNIÈRES SORTIES</div>
    </div>

    <div class="mp-center">
      <button class="mp-btn" id="mp-prev" title="Précédent">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>
      </button>
      <button class="mp-play" id="mp-play" title="Écouter">
        <svg class="icon-play" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        <svg class="icon-pause" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="display:none"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
      </button>
      <button class="mp-btn" id="mp-next" title="Suivant">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 6h-2v12h2zm-3.5 6L6 6v12z"/></svg>
      </button>

      <div class="mp-track" id="mp-track-btn">
        <div class="mp-art" id="mp-art"><img id="mp-img" src="" alt=""></div>
        <div class="mp-info">
          <div class="mp-title" id="mp-title">Chargement…</div>
          <div class="mp-artist" id="mp-artist"></div>
        </div>
      </div>

      <div class="mp-progress-wrap">
        <span class="mp-time" id="mp-elapsed">0:00</span>
        <div class="mp-bar" id="mp-bar-click">
          <div class="mp-fill" id="mp-fill"></div>
        </div>
        <span class="mp-time" id="mp-duration">0:00</span>
      </div>

      <div class="mp-eq" id="mp-eq">
        <span></span><span></span><span></span><span></span><span></span>
      </div>
    </div>

    <div class="mp-right">
      <a class="mp-spotify" id="mp-deezer" href="#" target="_blank" title="Ouvrir sur Deezer">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.81 11.647a.18.18 0 0 1-.178.155h-2.135a.18.18 0 0 1-.178-.155l-.27-1.964h3.03zm-4.63.992a.18.18 0 0 1-.178.155H11.87a.18.18 0 0 1-.178-.155l-.27-1.964h3.03zm4.63 1.937a.18.18 0 0 1-.178.155h-2.135a.18.18 0 0 1-.178-.155l-.27-1.964h3.03zM5.19 11.647a.18.18 0 0 1-.178.155H2.877a.18.18 0 0 1-.178-.155l-.27-1.964H5.46zm4.63.992a.18.18 0 0 1-.178.155H7.507a.18.18 0 0 1-.178-.155l-.27-1.964h3.03zm4.63 0a.18.18 0 0 1-.178.155h-2.135a.18.18 0 0 1-.178-.155l-.27-1.964h3.03z"/>
        </svg>
        Deezer
      </a>
    </div>

    <div class="mp-list" id="mp-list">
      <div class="mp-list-head">Dernières sorties · ONE MEDIA</div>
      <div class="mp-list-items" id="mp-list-items"></div>
    </div>`;

  document.body.appendChild(bar);

  /* ── REFS ── */
  const playBtn   = document.getElementById('mp-play');
  const prevBtn   = document.getElementById('mp-prev');
  const nextBtn   = document.getElementById('mp-next');
  const titleEl   = document.getElementById('mp-title');
  const artistEl  = document.getElementById('mp-artist');
  const imgEl     = document.getElementById('mp-img');
  const artEl     = document.getElementById('mp-art');
  const fillEl    = document.getElementById('mp-fill');
  const elapsedEl = document.getElementById('mp-elapsed');
  const durEl     = document.getElementById('mp-duration');
  const deezerA   = document.getElementById('mp-deezer');
  const eqEl      = document.getElementById('mp-eq');
  const listEl    = document.getElementById('mp-list');
  const listItems = document.getElementById('mp-list-items');
  const trackBtn  = document.getElementById('mp-track-btn');
  const toggleBtn = document.getElementById('mp-toggle');
  const barClick  = document.getElementById('mp-bar-click');

  /* ── UTILS ── */
  function fmt(s) {
    return Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
  }

  /* ── LOAD TRACK ── */
  function load(idx, autoPlay = false) {
    if (!TRACKS.length) return;
    const t = TRACKS[idx];
    titleEl.textContent   = t.title;
    artistEl.textContent  = t.artist;
    imgEl.src             = t.img;
    durEl.textContent     = fmt(t.duration);
    deezerA.href          = t.deezer;
    fillEl.style.width    = '0%';
    elapsedEl.textContent = '0:00';
    artEl.style.setProperty('--track-color', t.color);
    bar.style.setProperty('--track-color', t.color);

    audio.pause();
    audio.src = t.preview;
    audio.load();

    renderList();
    if (autoPlay) startPlay();
  }

  /* ── PLAY / PAUSE ── */
  function startPlay() {
    audio.play().then(() => {
      playing = true;
      playBtn.querySelector('.icon-play').style.display  = 'none';
      playBtn.querySelector('.icon-pause').style.display = '';
      bar.classList.add('playing');
      animEQ();
    }).catch(e => console.warn('Audio play error:', e));
  }

  function pause() {
    audio.pause();
    playing = false;
    playBtn.querySelector('.icon-play').style.display  = '';
    playBtn.querySelector('.icon-pause').style.display = 'none';
    bar.classList.remove('playing');
    cancelAnimationFrame(eqTimer);
  }

  /* ── Sync barre de progression avec l'audio ── */
  audio.addEventListener('timeupdate', () => {
    const pct = audio.duration ? audio.currentTime / audio.duration : 0;
    fillEl.style.width    = (pct * 100) + '%';
    elapsedEl.textContent = fmt(audio.currentTime);
    durEl.textContent     = fmt(audio.duration || TRACKS[current]?.duration || 0);
  });

  audio.addEventListener('ended', () => goNext());

  audio.addEventListener('error', () => {
    console.warn('Audio error — passage au suivant');
    goNext();
  });

  /* ── Seek en cliquant sur la barre ── */
  barClick.addEventListener('click', e => {
    if (!audio.duration) return;
    const rect = barClick.getBoundingClientRect();
    const pct  = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
  });

  /* ── EQ ANIMATION ── */
  function animEQ() {
    if (!playing) return;
    eqEl.querySelectorAll('span').forEach(s => {
      s.style.height = (20 + Math.random() * 80) + '%';
    });
    eqTimer = setTimeout(animEQ, 120);
  }

  /* ── NAV ── */
  function goPrev() { current = (current - 1 + TRACKS.length) % TRACKS.length; load(current, playing); }
  function goNext() { current = (current + 1) % TRACKS.length; load(current, playing); }

  /* ── TRACKLIST ── */
  function renderList() {
    if (!TRACKS.length) return;
    listItems.innerHTML = TRACKS.map((t, i) => `
      <div class="mp-list-item ${i === current ? 'active' : ''}" data-idx="${i}">
        <div class="mp-list-art"><img src="${t.img}" alt="${t.artist}" loading="lazy"></div>
        <div class="mp-list-info">
          <div class="mp-list-title">${t.title}</div>
          <div class="mp-list-artist">${t.artist} · ${t.label}</div>
        </div>
        <a href="${t.deezer}" target="_blank" class="mp-list-spot" title="Deezer">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18.81 11.647a.18.18 0 0 1-.178.155h-2.135a.18.18 0 0 1-.178-.155l-.27-1.964h3.03zm-4.63.992a.18.18 0 0 1-.178.155H11.87a.18.18 0 0 1-.178-.155l-.27-1.964h3.03zm4.63 1.937a.18.18 0 0 1-.178.155h-2.135a.18.18 0 0 1-.178-.155l-.27-1.964h3.03zM5.19 11.647a.18.18 0 0 1-.178.155H2.877a.18.18 0 0 1-.178-.155l-.27-1.964H5.46zm4.63.992a.18.18 0 0 1-.178.155H7.507a.18.18 0 0 1-.178-.155l-.27-1.964h3.03zm4.63 0a.18.18 0 0 1-.178.155h-2.135a.18.18 0 0 1-.178-.155l-.27-1.964h3.03z"/></svg>
        </a>
        <span class="mp-list-dur">${fmt(t.duration)}</span>
      </div>`).join('');

    listItems.querySelectorAll('.mp-list-item').forEach(item => {
      item.addEventListener('click', e => {
        if (e.target.closest('.mp-list-spot')) return;
        current = parseInt(item.dataset.idx);
        load(current, true);
        listEl.classList.remove('open');
        listOpen = false;
      });
    });
  }

  /* ── EVENTS ── */
  playBtn.addEventListener('click', () => {
    if (!TRACKS.length) return;
    if (playing) pause(); else startPlay();
  });
  prevBtn.addEventListener('click', goPrev);
  nextBtn.addEventListener('click', goNext);
  trackBtn.addEventListener('click', () => {
    listOpen = !listOpen;
    listEl.classList.toggle('open', listOpen);
  });
  toggleBtn.addEventListener('click', () => {
    bar.classList.toggle('collapsed');
    toggleBtn.querySelector('svg').style.transform =
      bar.classList.contains('collapsed') ? 'rotate(180deg)' : '';
  });
  document.addEventListener('click', e => {
    if (listOpen && !listEl.contains(e.target) && !trackBtn.contains(e.target)) {
      listOpen = false;
      listEl.classList.remove('open');
    }
  });

  /* ── INIT ── */
  setTimeout(() => {
    bar.classList.add('visible');
    loadTracks();
  }, 2000);

})();
