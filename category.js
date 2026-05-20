/* ===========================================================
   ONE MEDIA — category.js
   =========================================================== */

const ITEMS_PER_PAGE = 9;

function getCatFromUrl() {
  return new URLSearchParams(window.location.search).get('cat') || null;
}

function renderCategoryPage() {
  const catId  = getCatFromUrl();
  const cat    = catId ? getCategoryMeta(catId) : null;

  /* ── HERO ── */
  const hero = document.getElementById('cat-hero');
  if (hero) {
    const topArticle = catId
      ? getArticlesByCategory(catId, 1)[0]
      : getLatestArticles(1)[0];

    const label = cat ? cat.label : 'Tout';
    const count = catId ? getArticlesByCategory(catId).length : ARTICLES.length;

    hero.innerHTML = `
      ${topArticle ? `<div class="cat-hero-bg"><img src="${topArticle.image}" alt="${label}" loading="lazy"></div>` : ''}
      <div class="cat-hero-content">
        <div class="cat-hero-label" style="color:${cat ? cat.color : 'var(--signal)'}">ONE MEDIA</div>
        <h1 class="cat-hero-title" style="color:${cat ? cat.color : 'var(--ink)'}">${label}</h1>
        <div class="cat-hero-count">${count} article${count > 1 ? 's' : ''}</div>
      </div>
      ${cat ? `<div class="cat-hero-num">${cat.label.toUpperCase()}</div>` : ''}`;

    document.title = `${label} — ONE MEDIA`;
  }

  /* ── FILTER BAR ── */
  const filterBar = document.getElementById('cat-filter-bar');
  if (filterBar) {
    const allCats = [
      { id: null, label: 'Tout' },
      ...CATEGORIES,
    ];
    filterBar.innerHTML = `
      ${allCats.map(c => `
        <button class="cat-filter-btn${(catId === c.id) || (!catId && !c.id) ? ' active' : ''}"
                data-filter="${c.id || ''}"
                style="${c.id && getCategoryMeta(c.id).color ? `--cat-color:${getCategoryMeta(c.id).color}` : ''}">
          ${c.label}
        </button>`).join('')}
      <select class="cat-sort" id="cat-sort">
        <option value="recent">Plus récents</option>
        <option value="popular">Plus lus</option>
      </select>`;

    filterBar.querySelectorAll('.cat-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.dataset.filter || null;
        const url = new URL(window.location.href);
        if (val) url.searchParams.set('cat', val);
        else url.searchParams.delete('cat');
        window.location.href = url.toString();
      });
    });
  }

  /* ── GRID ── */
  let articles = catId ? getArticlesByCategory(catId) : [...ARTICLES];
  let shownCount = ITEMS_PER_PAGE;

  // Sort
  const sortEl = document.getElementById('cat-sort');
  sortEl?.addEventListener('change', () => {
    sortArticles(sortEl.value);
    renderGrid();
  });

  function sortArticles(mode) {
    if (mode === 'popular') articles.sort((a, b) => b.views - a.views);
    else articles.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
  sortArticles('recent');

  function renderGrid() {
    const grid = document.getElementById('cat-page-grid');
    const loadBtn = document.getElementById('load-more');
    if (!grid) return;

    grid.innerHTML = articles.slice(0, shownCount).map(a => renderArticleCard(a)).join('');

    if (loadBtn) {
      loadBtn.style.display = articles.length > shownCount ? '' : 'none';
      loadBtn.onclick = () => {
        shownCount += ITEMS_PER_PAGE;
        renderGrid();
      };
    }

    // Re-trigger reveal
    setTimeout(() => {
      grid.querySelectorAll('.reveal').forEach(el => {
        const obs = new IntersectionObserver(entries => {
          entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
        }, { threshold: 0.08 });
        obs.observe(el);
      });
    }, 50);
  }

  renderGrid();

  /* Active nav */
  if (catId) {
    document.querySelectorAll('.nav-link[data-cat]').forEach(link => {
      link.classList.toggle('active', link.dataset.cat === catId);
    });
  }
}

document.addEventListener('DOMContentLoaded', renderCategoryPage);
