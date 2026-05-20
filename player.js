/* ===========================================================
   ONE MEDIA — player.js
   Bande musicale : Dernières sorties
   =========================================================== */

(function initMusicPlayer() {

  const TRACKS = [
    {
      title:    'Water',
      artist:   'Tyla',
      label:    'Epic Records · 2023',
      duration: 187,
      img:      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=120&q=80',
      spotify:  'https://open.spotify.com/track/219mg0lqLCIHJWBjFNVwM8',
      color:    '#ff9f43',
    },
    {
      title:    "It's Plenty",
      artist:   'Burna Boy',
      label:    'Atlantic · 2023',
      duration: 218,
      img:      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=120&q=80',
      spotify:  'https://open.spotify.com/artist/3wcj11K77LjEY1PkEazffa',
      color:    '#00f5ff',
    },
    {
      title:    'Unavailable',
      artist:   'Davido ft. Musa Keys',
      label:    'Sony Music · 2023',
      duration: 195,
      img:      'https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?w=120&q=80',
      spotify:  'https://open.spotify.com/artist/0Y3agQaa6g2r0YmHPOO9rh',
      color:    '#bf5af2',
    },
    {
      title:    'Commas',
      artist:   'Asake',
      label:    'YBNL · 2023',
      duration: 178,
      img:      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=120&q=80',
      spotify:  'https://open.spotify.com/artist/7iZtZyCzp3LItcw1wtPI3D',
      color:    '#ffe500',
    },
    {
      title:    'Rush',
      artist:   'Ayra Starr',
      label:    'Mavin · 2023',
      duration: 161,
      img:      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=120&q=80',
      spotify:  'https://open.spotify.com/artist/7ne4VBA60CxGM75vw0mMT3',
      color:    '#ff2d55',
    },
    {
      title:    'Cruel Santino',
      artist:   'Cruel Santino',
      label:    'Subculture · 2024',
      duration: 204,
      img:      'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=120&q=80',
      spotify:  'https://open.spotify.com/artist/1e4oBBVKw5OELA7M5jLLCT',
      color:    '#30d158',
    },
  ];

  let current  = 0;
  let playing  = false;
  let elapsed  = 0;
  let ticker   = null;
  let eqTimer  = null;
  let listOpen = false;

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
      <button class="mp-play" id="mp-play" title="Écouter sur Spotify">
        <svg class="icon-play" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        <svg class="icon-pause" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="display:none"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
      </button>
      <button class="mp-btn" id="mp-next" title="Suivant">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 6h-2v12h2zm-3.5 6L6 6v12z"/></svg>
      </button>

      <div class="mp-track" id="mp-track-btn">
        <div class="mp-art" id="mp-art"><img id="mp-img" src="" alt=""></div>
        <div class="mp-info">
          <div class="mp-title" id="mp-title"></div>
          <div class="mp-artist" id="mp-artist"></div>
        </div>
      </div>

      <div class="mp-progress-wrap">
        <span class="mp-time" id="mp-elapsed">0:00</span>
        <div class="mp-bar"><div class="mp-fill" id="mp-fill"></div></div>
        <span class="mp-time" id="mp-duration">0:00</span>
      </div>

      <div class="mp-eq" id="mp-eq">
        <span></span><span></span><span></span><span></span><span></span>
      </div>
    </div>

    <div class="mp-right">
      <a class="mp-spotify" id="mp-spotify" href="#" target="_blank" title="Ouvrir sur Spotify">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
        Spotify
      </a>
    </div>

    <!-- TRACKLIST POPUP -->
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
  const spotifyA  = document.getElementById('mp-spotify');
  const eqEl      = document.getElementById('mp-eq');
  const listEl    = document.getElementById('mp-list');
  const listItems = document.getElementById('mp-list-items');
  const trackBtn  = document.getElementById('mp-track-btn');
  const toggleBtn = document.getElementById('mp-toggle');

  /* ── UTILS ── */
  function fmt(s) {
    return Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
  }

  /* ── LOAD TRACK ── */
  function load(idx, autoPlay = false) {
    const t = TRACKS[idx];
    titleEl.textContent  = t.title;
    artistEl.textContent = t.artist;
    imgEl.src            = t.img;
    durEl.textContent    = fmt(t.duration);
    spotifyA.href        = t.spotify;
    fillEl.style.width   = '0%';
    elapsedEl.textContent = '0:00';
    artEl.style.setProperty('--track-color', t.color);
    bar.style.setProperty('--track-color', t.color);
    elapsed = 0;
    renderList();
    if (autoPlay) start();
  }

  /* ── PLAY / PAUSE ── */
  function start() {
    playing = true;
    playBtn.querySelector('.icon-play').style.display  = 'none';
    playBtn.querySelector('.icon-pause').style.display = '';
    bar.classList.add('playing');
    clearInterval(ticker);
    ticker = setInterval(() => {
      elapsed++;
      const t = TRACKS[current];
      if (elapsed >= t.duration) { elapsed = 0; goNext(); return; }
      fillEl.style.width    = (elapsed / t.duration * 100) + '%';
      elapsedEl.textContent = fmt(elapsed);
    }, 1000);
    animEQ();
  }

  function pause() {
    playing = false;
    playBtn.querySelector('.icon-play').style.display  = '';
    playBtn.querySelector('.icon-pause').style.display = 'none';
    bar.classList.remove('playing');
    clearInterval(ticker);
    cancelAnimationFrame(eqTimer);
  }

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
    listItems.innerHTML = TRACKS.map((t, i) => `
      <div class="mp-list-item ${i === current ? 'active' : ''}" data-idx="${i}">
        <div class="mp-list-art"><img src="${t.img}" alt="${t.artist}"></div>
        <div class="mp-list-info">
          <div class="mp-list-title">${t.title}</div>
          <div class="mp-list-artist">${t.artist} · ${t.label}</div>
        </div>
        <a href="${t.spotify}" target="_blank" class="mp-list-spot" title="Spotify">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
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
    if (playing) pause(); else start();
  });
  prevBtn.addEventListener('click', goPrev);
  nextBtn.addEventListener('click', goNext);

  trackBtn.addEventListener('click', () => {
    listOpen = !listOpen;
    listEl.classList.toggle('open', listOpen);
  });

  toggleBtn.addEventListener('click', () => {
    bar.classList.toggle('collapsed');
    const icon = toggleBtn.querySelector('svg');
    icon.style.transform = bar.classList.contains('collapsed') ? 'rotate(180deg)' : '';
  });

  document.addEventListener('click', e => {
    if (listOpen && !listEl.contains(e.target) && !trackBtn.contains(e.target)) {
      listOpen = false;
      listEl.classList.remove('open');
    }
  });

  /* ── INIT ── */
  load(0);
  setTimeout(() => bar.classList.add('visible'), 3000);

})();
