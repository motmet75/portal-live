document.documentElement.classList.add('js');

(() => {
  document.addEventListener('error', event => {
    const image = event.target;
    if (!(image instanceof HTMLImageElement)) return;
    if (!image.dataset.jpgRetry && /\/sikalongan\.com\/images\/.*\.png(?:\?.*)?$/i.test(image.src)) {
      image.dataset.jpgRetry = 'true';
      image.src = image.src.replace(/\.png(?=\?|$)/i, '.jpg');
      return;
    }
    if (!image.dataset.fallbackApplied) {
      image.dataset.fallbackApplied = 'true';
      image.src = '/sikalongan.com/images/product-placeholder.svg';
    }
  }, true);

  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-main-menu]');
  toggle?.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  const cards = [...document.querySelectorAll('[data-product-card]')];
  const search = document.querySelector('[data-product-search]');
  const filters = [...document.querySelectorAll('[data-product-filter]')];
  const count = document.querySelector('[data-visible-count]');
  const empty = document.querySelector('[data-empty-state]');
  if (!cards.length) return;

  const normalize = value => (value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  let active = 'all';

  const apply = () => {
    const query = normalize(search?.value);
    let visible = 0;
    cards.forEach(card => {
      const text = normalize([card.dataset.name, card.dataset.catalog, card.dataset.brand].join(' '));
      const matchesQuery = !query || text.includes(query);
      const matchesFilter = active === 'all' || text.includes(normalize(active));
      const show = matchesQuery && matchesFilter;
      card.hidden = !show;
      if (show) visible += 1;
    });
    if (count) count.textContent = String(visible);
    if (empty) empty.hidden = visible !== 0;
  };

  search?.addEventListener('input', apply);
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    active = button.dataset.productFilter || 'all';
    apply();
  }));

  const params = new URLSearchParams(location.search);
  const requested = params.get('catalog') || params.get('brand');
  if (requested) {
    active = requested;
    const exact = filters.find(button => button.dataset.productFilter === requested);
    if (exact) {
      filters.forEach(item => item.classList.remove('active'));
      exact.classList.add('active');
    }
    apply();
  }
})();
