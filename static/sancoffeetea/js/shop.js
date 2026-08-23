(function () {
  'use strict';

  var status = document.getElementById('san-menu-status');
  var grid = document.getElementById('san-menu-grid');
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
    rows: []
  };

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
    var base = String(value || '').trim() || 'https://anhmedia.vn/bom-inventory/';
    try {
      return new URL(base, window.location.origin).href.replace(/\/+$/, '');
    } catch (ignored) {
      return 'https://anhmedia.vn/bom-inventory';
    }
  }

  function menuBaseUrl() {
    var base = cleanBase(state.config && state.config.demoBaseUrl);
    return /\/shop\/menu\/?$/.test(base) ? base.replace(/\/+$/, '') : join(base, '/shop/menu');
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
    }
    var query = params.toString();
    return menuBaseUrl() + (query ? '?' + query : '');
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
      a.href = orderUrl('');
      a.textContent = menuLabels[state.lang] || menuLabels.en;
      a.target = '_blank';
      a.rel = 'noopener';
    });
    document.querySelectorAll('[data-san-order]').forEach(function (a) {
      a.href = orderUrl('');
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
    renderMenu();
  }

  function renderMenu() {
    if (!grid) return;
    var rows = state.rows || [];
    if (!rows.length) return;
    grid.innerHTML = '';
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
  updateLanguageUi();

  fetch('/api/public/shopfront/current', { credentials: 'same-origin' }).then(function (r) {
    if (!r.ok) throw new Error('Không đọc được cấu hình cửa hàng.');
    return r.json();
  }).then(function (cfg) {
    if (!cfg.tenantId || !cfg.companyId) throw new Error('Chưa cấu hình Tenant ID và Company ID trong Portal Admin → SAN Shop Connection.');
    state.config = cfg;
    updateLanguageUi();
    document.querySelectorAll('[data-san-address]').forEach(function (el) { el.textContent = cfg.address || 'Đang cập nhật'; });
    document.querySelectorAll('[data-san-hours]').forEach(function (el) { el.textContent = cfg.openingHours || 'Đang cập nhật'; });
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
    renderMenu();
  }).catch(function (error) {
    if (status) status.textContent = error.message;
  });
}());
