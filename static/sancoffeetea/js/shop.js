(function () {
  'use strict';

  var status = document.getElementById('san-menu-status');
  var grid = document.getElementById('san-menu-grid');
  var searchInput = document.getElementById('san-menu-search');
  var categoryList = document.getElementById('san-category-list');
  var menuCount = document.getElementById('san-menu-count');
  var supportedLanguages = ['vi', 'en', 'cn', 'tw', 'ja', 'ko', 'th', 'es', 'ms', 'id', 'dv'];
  var orderLabels = {
    vi: 'Đặt món',
    en: 'Order',
    cn: '下单',
    tw: '點餐',
    ja: '注文',
    ko: '주문',
    th: 'สั่ง',
    es: 'Pedir',
    ms: 'Pesan',
    id: 'Pesan',
    dv: 'Order'
  };
  var menuLabels = {
    vi: 'Thực đơn',
    en: 'Menu',
    cn: '菜单',
    tw: '菜單',
    ja: 'メニュー',
    ko: '메뉴',
    th: 'เมนู',
    es: 'Menú',
    ms: 'Menu',
    id: 'Menu',
    dv: 'Menu'
  };
  var state = {
    lang: initialLanguage(),
    config: null,
    rows: [],
    search: '',
    category: ''
  };
  var shopServiceOrigin = 'https://anhmedia.vn';
  var shopServiceBase = shopServiceOrigin + '/bom-inventory';

  function normalizeLanguage(value) {
    var code = String(value || '').trim().toLowerCase().replace(/_/g, '-');
    if (code === 'zh' || code === 'zh-cn' || code.indexOf('zh-hans') === 0) return 'cn';
    if (code === 'zh-tw' || code === 'zh-hant' || code.indexOf('zh-hant') === 0) return 'tw';
    if (code === 'thai' || code === 'thailand') return 'th';
    code = code.split('-')[0];
    return supportedLanguages.indexOf(code) >= 0 ? code : '';
  }

  function initialLanguage() {
    var fromUrl = '';
    try { fromUrl = normalizeLanguage(new URLSearchParams(window.location.search).get('lang')); } catch (ignored) {}
    if (fromUrl) return fromUrl;
    var stored = '';
    try { stored = normalizeLanguage(localStorage.getItem('san_shop_language')); } catch (ignored) {}
    return stored || 'vi';
  }

  function join(base, path) {
    return String(base || '').replace(/\/+$/, '') + path;
  }

  function cleanBase(value) {
    var base = String(value || '').trim() || shopServiceBase;
    try {
      var url = new URL(base, shopServiceOrigin);
      url.hash = '';
      url.search = '';
      if (/^(?:.+\.)?anhmedia\.vn$/i.test(url.hostname)) {
        url.protocol = 'https:';
        url.hostname = 'anhmedia.vn';
        url.port = '';
      }
      if (!/^\/bom-inventory(?:\/|$)/i.test(url.pathname)) {
        url.pathname = '/bom-inventory' + (url.pathname === '/' ? '' : url.pathname.replace(/^\/+/, '/'));
      }
      return url.href.replace(/\/+$/, '');
    } catch (ignored) {
      return shopServiceBase;
    }
  }

  function menuBaseUrl() {
    var base = cleanBase(state.config && state.config.demoBaseUrl);
    if (/\/shop\/menu\/?$/i.test(base)) return base.replace(/\/+$/, '');
    if (/\/bom-inventory\/?$/i.test(base)) return join(base, '/shop/menu');
    return join(base, '/shop/menu');
  }

  function demoOrigin() {
    try { return new URL(cleanBase(state.config && state.config.demoBaseUrl), window.location.origin).origin; } catch (ignored) {}
    return 'https://anhmedia.vn';
  }

  function orderUrl(searchName) {
    var cfg = state.config || {};
    var params = new URLSearchParams();
    if (cfg.tenantId) params.set('tenantId', cfg.tenantId);
    if (cfg.companyId) params.set('companyId', cfg.companyId);
    params.set('lang', state.lang);
    if (searchName) {
      params.set('search', searchName);
      params.set('q', searchName);
      params.set('item', searchName);
    }
    var query = params.toString();
    return menuBaseUrl() + (query ? '?' + query : '');
  }

  function hasShopConfig() {
    var cfg = state.config || {};
    return Boolean(cfg.tenantId && cfg.companyId);
  }

  function openOrder(searchName, event) {
    if (event) event.preventDefault();
    if (!hasShopConfig()) {
      if (status) {
        status.hidden = false;
        status.textContent = 'Đang tải cấu hình cửa hàng, vui lòng thử lại sau vài giây.';
      }
      return false;
    }
    var url = orderUrl(searchName || '');
    var opened = window.open(url, '_blank', 'noopener');
    if (opened) {
      try { opened.opener = null; opened.focus && opened.focus(); } catch (ignored) {}
    } else {
      window.location.href = url;
    }
    return false;
  }

  function money(value) {
    var locale = state.lang === 'en' ? 'en-US' : 'vi-VN';
    return new Intl.NumberFormat(locale).format(Number(value || 0)) + ' ₫';
  }

  function parseTranslations(value) {
    if (!value) return {};
    if (typeof value === 'object' && !Array.isArray(value)) return value;
    try {
      var parsed = JSON.parse(value);
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch (ignored) {
      return {};
    }
  }

  function localizedValue(baseValue, translations, lang) {
    var map = parseTranslations(translations);
    return map[lang] || baseValue || '';
  }

  function itemName(item) {
    return localizedValue(item.modelName || item.name, item.modelNameTranslations, state.lang) || 'SAN';
  }

  function itemCategory(item) {
    return localizedValue(item.category, item.categoryTranslations, state.lang);
  }

  function normalizeSearch(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  function itemSearchText(item) {
    return normalizeSearch([itemName(item), itemCategory(item), item.ingredients].filter(Boolean).join(' '));
  }

  function filteredRows() {
    var query = normalizeSearch(state.search);
    return (state.rows || []).filter(function (item) {
      var category = itemCategory(item);
      if (state.category && category !== state.category) return false;
      if (query && itemSearchText(item).indexOf(query) < 0) return false;
      return true;
    });
  }

  function safeImage(value) {
    if (!value) return '/dailocoffee/images/gallery_9.jpeg';
    if (/^https?:\/\//i.test(value)) return value;
    if (String(value).charAt(0) === '/') return demoOrigin() + value;
    return value;
  }

  function updateLanguageUi() {
    document.documentElement.lang = state.lang;
    document.querySelectorAll('[data-san-lang-code]').forEach(function (button) {
      button.setAttribute('aria-pressed', button.getAttribute('data-san-lang-code') === state.lang ? 'true' : 'false');
    });
    document.querySelectorAll('[data-san-shop-menu]').forEach(function (a) {
      a.href = hasShopConfig() ? orderUrl('') : '#';
      a.textContent = menuLabels[state.lang] || menuLabels.en;
      a.target = '_blank';
      a.rel = 'noopener';
    });
    document.querySelectorAll('[data-san-order]').forEach(function (a) {
      a.href = hasShopConfig() ? orderUrl('') : '#';
      a.textContent = orderLabels[state.lang] || orderLabels.en;
      a.target = '_blank';
      a.rel = 'noopener';
    });
  }

  function setLanguage(lang) {
    var normalized = normalizeLanguage(lang) || 'vi';
    if (state.lang === normalized) return;
    state.lang = normalized;
    try { localStorage.setItem('san_shop_language', state.lang); } catch (ignored) {}
    try {
      var url = new URL(window.location.href);
      url.searchParams.set('lang', state.lang);
      window.history.replaceState({}, '', url.toString());
    } catch (ignored) {}
    updateLanguageUi();
    renderCategoryFilters();
    renderMenu();
  }

  function renderCategoryFilters() {
    if (!categoryList) return;
    var categories = [];
    (state.rows || []).forEach(function (item) {
      var category = itemCategory(item);
      if (category && categories.indexOf(category) < 0) categories.push(category);
    });
    categories.sort(function (a, b) { return a.localeCompare(b); });
    if (state.category && categories.indexOf(state.category) < 0) state.category = '';
    categoryList.innerHTML = '';
    var all = document.createElement('button');
    all.type = 'button';
    all.className = 'san-category-filter';
    all.textContent = state.lang === 'en' ? 'All' : 'Tất cả';
    all.setAttribute('aria-pressed', state.category ? 'false' : 'true');
    all.addEventListener('click', function () {
      state.category = '';
      renderCategoryFilters();
      renderMenu();
    });
    categoryList.appendChild(all);
    categories.forEach(function (category) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'san-category-filter';
      button.textContent = category;
      button.setAttribute('aria-pressed', state.category === category ? 'true' : 'false');
      button.addEventListener('click', function () {
        state.category = state.category === category ? '' : category;
        renderCategoryFilters();
        renderMenu();
      });
      categoryList.appendChild(button);
    });
  }

  function renderMenu() {
    if (!grid) return;
    var rows = filteredRows();
    if (menuCount) {
      menuCount.hidden = !(state.rows || []).length;
      menuCount.textContent = rows.length + ' / ' + (state.rows || []).length + ' món';
    }
    grid.innerHTML = '';
    if (!rows.length) {
      grid.hidden = true;
      if (status) {
        status.hidden = false;
        status.textContent = state.search || state.category ? 'Không tìm thấy món phù hợp.' : 'Cửa hàng chưa có món đang bán.';
      }
      return;
    }
    rows.forEach(function (item) {
      var name = itemName(item);
      var category = itemCategory(item);
      var card = document.createElement('article');
      card.className = 'san-card';

      var image = document.createElement('img');
      image.src = safeImage(item.imageUrl || item.thumbnailUrl);
      image.alt = name;

      var body = document.createElement('div');
      body.className = 'san-card-body';

      if (category) {
        var categoryEl = document.createElement('div');
        categoryEl.className = 'san-category';
        categoryEl.textContent = category;
        body.appendChild(categoryEl);
      }

      var title = document.createElement('h3');
      title.textContent = name;
      body.appendChild(title);

      if (item.ingredients) {
        var ingredients = document.createElement('p');
        ingredients.className = 'san-ingredients';
        ingredients.textContent = item.ingredients;
        body.appendChild(ingredients);
      }

      var actions = document.createElement('div');
      actions.className = 'san-card-actions';

      var price = document.createElement('span');
      price.className = 'san-price';
      price.textContent = money(item.sellingPrice != null ? item.sellingPrice : item.price);

      var order = document.createElement('a');
      order.className = 'san-card-order';
      order.href = orderUrl(name);
      order.target = '_blank';
      order.rel = 'noopener';
      order.textContent = orderLabels[state.lang] || orderLabels.en;
      order.addEventListener('click', function (event) {
        openOrder(name, event);
      });

      actions.appendChild(price);
      actions.appendChild(order);
      body.appendChild(actions);
      card.appendChild(image);
      card.appendChild(body);
      grid.appendChild(card);
    });
    if (status) status.hidden = true;
    grid.hidden = false;
  }

  document.querySelectorAll('[data-san-lang-code]').forEach(function (button) {
    button.addEventListener('click', function () {
      setLanguage(button.getAttribute('data-san-lang-code'));
    });
  });
  document.querySelectorAll('[data-san-shop-menu]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      openOrder('', event);
    });
  });
  document.querySelectorAll('[data-san-order]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      openOrder('', event);
    });
  });
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      state.search = searchInput.value || '';
      renderMenu();
    });
  }
  updateLanguageUi();

  fetch('/api/public/shopfront/current', { credentials: 'same-origin' }).then(function (r) {
    if (!r.ok) throw new Error('Không đọc được cấu hình cửa hàng.');
    return r.json();
  }).then(function (cfg) {
    if (!cfg.tenantId || !cfg.companyId) throw new Error('Chưa cấu hình Tenant ID và Company ID trong Portal Admin → SAN Shop Connection.');
    state.config = cfg;
    updateLanguageUi();
    if (cfg.address) document.querySelectorAll('[data-san-address]').forEach(function (el) { el.textContent = cfg.address; });
    if (cfg.openingHours) document.querySelectorAll('[data-san-hours]').forEach(function (el) { el.textContent = cfg.openingHours; });
    if (!grid) return [];
    return fetch('/api/public/shopfront/current/menu', { credentials: 'same-origin' }).then(function (r) {
      if (!r.ok) throw new Error('Không tải được menu từ demo (' + r.status + ').');
      return r.json();
    });
  }).then(function (menu) {
    if (!grid) return;
    var rows = Array.isArray(menu) ? menu : (menu.items || menu.content || []);
    if (!rows.length) throw new Error('Cửa hàng chưa có món đang bán.');
    state.rows = rows;
    renderCategoryFilters();
    renderMenu();
  }).catch(function (error) {
    if (status) status.textContent = error.message;
  });
}());
