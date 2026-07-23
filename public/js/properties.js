/**
 * Loads and filters property listings on properties.html from the
 * backend API (GET /api/properties).
 */
(function () {
  const PAGE_SIZE = 6;

  const state = {
    category: 'all', // all | residential | commercial | ongoing | completed
    city: '',
    page: 1,
  };

  const grid = document.getElementById('properties-cards');
  const featuredContainer = document.getElementById('featured-property');
  const loadingEl = document.getElementById('properties-loading');
  const emptyEl = document.getElementById('properties-empty');
  const loadMoreBtn = document.getElementById('load-more-btn');

  function statusBadgeClass(status) {
    return status === 'completed' ? 'bg-green-600/90' : 'bg-brand-gold/90';
  }

  function capitalize(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
  }

  function renderFeatured(p) {
    if (!p) {
      featuredContainer.innerHTML = '';
      return;
    }
    featuredContainer.innerHTML = `
      <div class="mb-12 group cursor-pointer">
        <div class="relative overflow-hidden rounded-sm h-[500px]">
          <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="${p.image_url}" alt="${p.title}" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
          <div class="absolute top-6 left-6">
            <span class="bg-brand-gold text-white text-xs tracking-widest uppercase px-4 py-1.5 rounded-full">Featured · ${capitalize(p.status)}</span>
          </div>
          <div class="absolute bottom-0 left-0 right-0 p-10 flex justify-between items-end">
            <div class="text-white">
              <p class="text-xs tracking-widest uppercase opacity-70 mb-2">${p.city} · ${p.area}</p>
              <h2 class="font-display text-4xl font-bold mb-2">${p.title}</h2>
              <p class="text-gray-300 text-sm max-w-md">${p.description}</p>
            </div>
            <div class="text-right text-white">
              <p class="text-xs tracking-widest uppercase opacity-70 mb-2">Starting From</p>
              <p class="font-display text-3xl font-bold text-brand-gold">${p.price_label}</p>
              <a href="contact.html#inquiry" class="mt-4 inline-flex items-center gap-2 bg-white/10 hover:bg-brand-gold border border-white/20 px-6 py-2.5 rounded-full text-sm transition-all duration-300">Enquire Now <i class="fa-solid fa-arrow-right text-xs"></i></a>
            </div>
          </div>
        </div>
      </div>`;
  }

  function renderCard(p) {
    return `
      <article class="group cursor-pointer bg-white rounded-sm shadow-sm hover:shadow-2xl transition-all duration-500">
        <div class="relative overflow-hidden h-64">
          <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="${p.image_url}" alt="${p.title}" />
          <div class="absolute top-4 left-4 flex gap-2">
            <span class="${statusBadgeClass(p.status)} text-white text-xs px-3 py-1 rounded-full">${capitalize(p.status)}</span>
            <span class="bg-white/90 text-brand-dark text-xs px-3 py-1 rounded-full">${capitalize(p.category)}</span>
          </div>
        </div>
        <div class="p-6">
          <p class="text-xs tracking-widest uppercase text-gray-400 mb-2">${p.city} · ${p.area}</p>
          <h3 class="font-display text-2xl font-bold mb-2">${p.title}</h3>
          <p class="text-gray-500 text-sm mb-4 leading-relaxed">${p.description}</p>
          <div class="flex justify-between items-center pt-4 border-t border-brand-hairline">
            <div>
              <p class="text-xs text-gray-400 mb-1">Starting From</p>
              <p class="font-display text-xl font-bold text-brand-dark">${p.price_label}</p>
            </div>
            <div class="flex gap-4 text-xs text-gray-400">
              <span><i class="fa-solid ${p.spec_icon} mr-1"></i>${p.spec_label}</span>
              <span><i class="fa-solid fa-expand mr-1"></i>${p.area_label}</span>
            </div>
          </div>
        </div>
      </article>`;
  }

  function buildQuery() {
    const params = new URLSearchParams();
    if (state.category === 'residential' || state.category === 'commercial') {
      params.set('category', state.category);
    } else if (state.category === 'ongoing' || state.category === 'completed') {
      params.set('status', state.category);
    }
    if (state.city) params.set('city', state.city);
    params.set('page', state.page);
    params.set('limit', PAGE_SIZE);
    return params.toString();
  }

  async function loadFeatured() {
    try {
      const res = await apiFetch('/properties?featured=true&limit=1');
      renderFeatured(res.data && res.data[0]);
    } catch (err) {
      // Non-fatal — just skip the featured banner
      featuredContainer.innerHTML = '';
    }
  }

  async function loadProperties(append) {
    loadingEl.classList.remove('hidden');
    emptyEl.classList.add('hidden');
    try {
      const res = await apiFetch(`/properties?${buildQuery()}`);
      const items = res.data || [];

      if (!append) grid.innerHTML = '';
      grid.insertAdjacentHTML('beforeend', items.map(renderCard).join(''));

      const loadedCount = grid.children.length;
      const hasMore = res.total ? loadedCount < res.total : items.length === PAGE_SIZE;
      loadMoreBtn.classList.toggle('hidden', !hasMore);

      if (loadedCount === 0) {
        emptyEl.classList.remove('hidden');
      }
    } catch (err) {
      grid.innerHTML = `<p class="col-span-full text-center text-red-400">Could not load properties: ${err.message}</p>`;
    } finally {
      loadingEl.classList.add('hidden');
    }
  }

  document.getElementById('category-filters').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-cat]');
    if (!btn) return;
    document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    state.category = btn.dataset.cat;
    state.page = 1;
    loadProperties(false);
  });

  document.getElementById('city-filter').addEventListener('change', (e) => {
    state.city = e.target.value;
    state.page = 1;
    loadProperties(false);
  });

  loadMoreBtn.addEventListener('click', () => {
    state.page += 1;
    loadProperties(true);
  });

  loadFeatured();
  loadProperties(false);
})();
