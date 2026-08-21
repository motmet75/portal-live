(function () {
  'use strict';
  var status = document.getElementById('san-menu-status');
  var grid = document.getElementById('san-menu-grid');
  function join(base, path) { return String(base || '').replace(/\/$/, '') + path; }
  function money(value) { return new Intl.NumberFormat('vi-VN').format(Number(value || 0)) + ' ₫'; }
  function safeImage(value) { return value || '/dailocoffee/images/gallery_9.jpeg'; }
  fetch('/api/public/shopfront/current', { credentials: 'same-origin' }).then(function (r) {
    if (!r.ok) throw new Error('Không đọc được cấu hình cửa hàng.'); return r.json();
  }).then(function (cfg) {
    if (!cfg.tenantId || !cfg.companyId) throw new Error('Chưa cấu hình Tenant ID và Company ID trong Portal Admin → SAN Shop Connection.');
    var query = '?tenantId=' + encodeURIComponent(cfg.tenantId) + '&companyId=' + encodeURIComponent(cfg.companyId);
    var orderUrl = join(cfg.demoBaseUrl, '/shop/menu') + query;
    document.querySelectorAll('[data-san-order]').forEach(function (a) { a.href = orderUrl; });
    document.querySelectorAll('[data-san-address]').forEach(function (el) { el.textContent = cfg.address || 'Đang cập nhật'; });
    document.querySelectorAll('[data-san-hours]').forEach(function (el) { el.textContent = cfg.openingHours || 'Đang cập nhật'; });
    return fetch(join(cfg.demoBaseUrl, '/api/shop/public/menu') + query).then(function (r) {
      if (!r.ok) throw new Error('Không tải được menu từ demo (' + r.status + ').'); return r.json();
    });
  }).then(function (menu) {
    var rows = Array.isArray(menu) ? menu : (menu.items || menu.content || []);
    if (!rows.length) throw new Error('Cửa hàng chưa có món đang bán.');
    grid.innerHTML = '';
    rows.forEach(function (item) {
      var card = document.createElement('article'); card.className = 'san-card';
      var image = document.createElement('img'); image.src = safeImage(item.imageUrl); image.alt = item.modelName || item.name || 'Món SAN';
      var body = document.createElement('div'); var title = document.createElement('h3'); title.textContent = item.modelName || item.name || 'Món SAN';
      var price = document.createElement('span'); price.className = 'san-price'; price.textContent = money(item.sellingPrice != null ? item.sellingPrice : item.price);
      body.appendChild(title); body.appendChild(price); card.appendChild(image); card.appendChild(body); grid.appendChild(card);
    });
    status.hidden = true; grid.hidden = false;
  }).catch(function (error) { if (status) status.textContent = error.message; });
}());
