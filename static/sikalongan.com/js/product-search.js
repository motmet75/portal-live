(() => {
  'use strict';

  const input = document.querySelector('#productSearchBox');
  const catalogInput = document.querySelector('#productCatalogSelect');
  const form = document.querySelector('[data-product-search-form]');
  const popup = document.querySelector('[data-product-search-results]');
  const filters = [...document.querySelectorAll('[data-product-filter]')];

  if (!input || !form || !popup) return;

  let debounceTimer;
  let activeRequest;
  let requestSequence = 0;

  const currentCatalog = () => catalogInput?.value || '0';

  const hidePopup = () => {
    popup.hidden = true;
    popup.replaceChildren();
    input.setAttribute('aria-expanded', 'false');
  };

  const showStatus = message => {
    const status = document.createElement('div');
    status.className = 'product-search-popup__status';
    status.textContent = message;
    popup.replaceChildren(status);
    popup.hidden = false;
    input.setAttribute('aria-expanded', 'true');
  };

  const createResult = product => {
    const link = document.createElement('a');
    link.className = 'product-search-popup__item';
    link.href = `/product/${product.path || ''}`;
    link.setAttribute('role', 'option');

    const image = document.createElement('img');
    image.src = product.productImageDesUrl || '/sikalongan.com/images/product-placeholder.svg';
    image.alt = '';
    image.loading = 'lazy';

    const copy = document.createElement('span');
    copy.className = 'product-search-popup__copy';

    const name = document.createElement('b');
    name.textContent = product.productName || 'Sản phẩm';

    const detail = document.createElement('small');
    detail.textContent = product.productCatalog || product.productBrand || 'Liên hệ báo giá';

    const arrow = document.createElement('span');
    arrow.className = 'product-search-popup__arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '↗';

    copy.append(name, detail);
    link.append(image, copy, arrow);
    return link;
  };

  const renderResults = (products, hasMore) => {
    if (!products.length) {
      showStatus('Không tìm thấy sản phẩm phù hợp.');
      return;
    }

    const fragment = document.createDocumentFragment();
    products.forEach(product => fragment.append(createResult(product)));

    if (hasMore) {
      const viewAll = document.createElement('button');
      viewAll.className = 'product-search-popup__all';
      viewAll.type = 'button';
      viewAll.textContent = 'Xem tất cả kết quả bên dưới';
      viewAll.addEventListener('click', () => {
        hidePopup();
        document.querySelector('.result-count')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      fragment.append(viewAll);
    }

    popup.replaceChildren(fragment);
    popup.hidden = false;
    input.setAttribute('aria-expanded', 'true');
  };

  const searchProducts = async () => {
    const searchTerm = input.value.trim();
    if (!searchTerm) {
      hidePopup();
      return;
    }

    activeRequest?.abort();
    activeRequest = new AbortController();
    const sequence = ++requestSequence;
    showStatus('Đang tìm kiếm…');

    const params = new URLSearchParams({
      searchTerm,
      catalogCode: currentCatalog()
    });

    try {
      const response = await fetch(`/api/products/search?${params}`, {
        headers: { Accept: 'application/json' },
        signal: activeRequest.signal
      });
      if (!response.ok) throw new Error(`Search failed: ${response.status}`);

      const data = await response.json();
      if (sequence !== requestSequence) return;
      const products = Array.isArray(data) ? data : [];
      renderResults(products.slice(0, 5), products.length > 5);
    } catch (error) {
      if (error.name === 'AbortError') return;
      console.error('[sikalongan-product-search]', error);
      showStatus('Không thể tải gợi ý. Vui lòng thử lại.');
    }
  };

  const scheduleSearch = (immediate = false) => {
    window.clearTimeout(debounceTimer);
    if (!input.value.trim()) {
      hidePopup();
      return;
    }
    debounceTimer = window.setTimeout(searchProducts, immediate ? 0 : 300);
  };

  input.setAttribute('aria-expanded', 'false');
  input.addEventListener('input', () => scheduleSearch());
  input.addEventListener('keydown', event => {
    if (event.key === 'Escape') hidePopup();
    if (event.key === 'ArrowDown' && !popup.hidden) {
      event.preventDefault();
      popup.querySelector('a, button')?.focus();
    }
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    scheduleSearch(true);
  });

  filters.forEach(button => button.addEventListener('click', () => {
    if (catalogInput) {
      catalogInput.value = button.dataset.productFilter === 'all'
        ? '0'
        : (button.dataset.productFilter || '0');
    }
    if (input.value.trim()) scheduleSearch(true);
  }));

  document.addEventListener('click', event => {
    if (!form.contains(event.target) && !popup.contains(event.target)) hidePopup();
  });
})();
