(function () {
  'use strict';

  const searchInput   = document.querySelector('#productSearchBox');
  const selectElement = document.querySelector('#productCatalogSelect');

  if (!searchInput) return;

  const searchForm = searchInput.closest('form');
  let searchTimeout = null;

  /* ── 1. Inject CSS (clone of main.js styleElement) ── */
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    .product-search-popup {
      display: none;
      position: absolute;
      z-index: 10020;
      background-color: #fff;
      border: 1px solid #ddd;
      width: 100%;
      max-height: 500px;
      overflow-y: auto;
      box-shadow: 0 4px 8px rgba(0,0,0,0.12);
      border-radius: 0 0 6px 6px;
    }

    .product-search-popup .search-result-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      border-bottom: 1px solid #eee;
      cursor: pointer;
      transition: background-color 0.2s ease;
      text-decoration: none;
    }

    .product-search-popup .search-result-item:hover {
      background-color: #f5f5f5;
    }

    .product-search-popup .search-result-item img {
      width: 44px;
      height: 44px;
      object-fit: cover;
      border-radius: 4px;
      flex-shrink: 0;
    }

    .product-search-popup .search-result-item .product-name {
      font-weight: 600;
      font-size: 0.9rem;
      color: #222;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .product-search-popup .search-result-item .product-name a {
      color: #222;
      text-decoration: none;
    }

    .product-search-popup .search-result-item .product-desc {
      font-size: 0.8rem;
      color: #e74c3c;
      margin-top: 2px;
    }

    .product-search-popup .view-all {
      text-align: center;
      padding: 10px;
      font-weight: 600;
      border-top: 1px solid #ddd;
    }

    .product-search-popup .view-all a {
      color: #007bff;
      text-decoration: none;
      font-size: 0.88rem;
    }

    .product-search-popup .loading-item {
      text-align: center;
      padding: 12px;
      color: #888;
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .product-search-popup {
        left: 0 !important;
        width: 100% !important;
        max-height: 60vh;
        border-left: none;
        border-right: none;
        border-radius: 0 0 6px 6px;
      }
    }
  `;
  document.head.appendChild(styleElement);

  /* ── 2. Create popup container, insert after form ── */
  const popupContainer = document.createElement('div');
  popupContainer.className = 'product-search-popup';

  // Anchor the wrapper so the absolute popup sits directly below the search box
  const wrapper = searchForm.closest('.product-search-wrapper') || searchForm.parentNode;
  wrapper.style.position = 'relative';
  wrapper.appendChild(popupContainer);

  /* ── 3. Position popup under the input field ── */
  function positionPopup() {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      // full width of wrapper, just below the form
      popupContainer.style.top   = searchForm.offsetTop + searchForm.offsetHeight + 'px';
      popupContainer.style.left  = '0';
      popupContainer.style.width = '100%';
    } else {
      // align left edge & width to the text input only
      popupContainer.style.top   = searchForm.offsetTop + searchForm.offsetHeight + 'px';
      popupContainer.style.left  = searchInput.offsetLeft + 'px';
      popupContainer.style.width = searchInput.offsetWidth + 'px';
    }
  }

  /* ── 4. Fetch from /api/products/search (same endpoint as main.js) ── */
  async function fetchProducts(searchTerm, catalogCode) {
    try {
      const params = new URLSearchParams();
      params.append('searchTerm', searchTerm);
      params.append('catalogCode', catalogCode);

      const response = await fetch('/api/products-admin/search?' + params.toString());
      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      const hasMore   = data.length > 5;
      const itemsToShow = data.slice(0, 5);
      return [itemsToShow, hasMore, catalogCode, searchTerm];
    } catch (error) {
      console.error('[product-search]', error);
      return [[], false, catalogCode, searchTerm];
    }
  }

  /* ── 5. Render results (clone of main.js displayResults) ── */
  function displayResults(items, hasMore, catalogCode, searchTerm) {
    popupContainer.innerHTML = '';

    if (items.length === 0) {
      popupContainer.style.display = 'none';
      return;
    }

    items.forEach(function (product) {
      const resultItem = document.createElement('div');
      resultItem.className = 'search-result-item';

      const price = product.formatedPriceAfterDiscount
        ? product.formatedPriceAfterDiscount + ' ' + (product.productPriceCurrency || '')
        : (product.productPriceAmount || '');

      resultItem.innerHTML =
        '<img src="' + (product.productImageDesUrl || '') + '" alt="" onerror="this.style.display=\'none\'">' +
        '<div class="info">' +
          '<div class="product-name"><a href="/product/' + product.path + '">' + product.productName + '</a></div>' +
          '<div class="product-desc">' + price + '</div>' +
        '</div>';

      resultItem.addEventListener('click', function () {
        searchInput.value = product.productName;
        popupContainer.style.display = 'none';
      });

      popupContainer.appendChild(resultItem);
    });

    /* "View all results" link (clone of main.js) */
    if (hasMore) {
      const viewAllItem = document.createElement('div');
      viewAllItem.className = 'search-result-item view-all';
      viewAllItem.innerHTML =
        '<a href="/products-admin.html?catalog=' + encodeURIComponent(catalogCode) +
        '&keyword=' + encodeURIComponent(searchTerm) + '">Xem tất cả kết quả &raquo;</a>';
      popupContainer.appendChild(viewAllItem);
    }

    popupContainer.style.display = 'block';
    positionPopup();
  }

  /* ── 6. Loading indicator (clone of main.js) ── */
  function showLoadingIndicator() {
    popupContainer.innerHTML = '<div class="loading-item">Đang tìm kiếm...</div>';
    popupContainer.style.display = 'block';
    positionPopup();
  }

  /* ── 7. Input event with debounce (clone of main.js) ── */
  searchInput.addEventListener('input', function () {
    const searchTerm  = this.value.trim();
    const catalogCode = selectElement ? selectElement.value : '0';

    if (searchTimeout) clearTimeout(searchTimeout);

    if (searchTerm.length < 1) {
      popupContainer.style.display = 'none';
      return;
    }

    showLoadingIndicator();

    searchTimeout = setTimeout(async function () {
      const [items, hasMore, catalogCodeFinal, searchTermFinal] =
        await fetchProducts(searchTerm, catalogCode);
      displayResults(items, hasMore, catalogCodeFinal, searchTermFinal);
    }, 300);
  });

  /* ── 8. keyup fallback for IME / paste ── */
  searchInput.addEventListener('keyup', function (e) {
    if (e.key === 'Escape') {
      popupContainer.style.display = 'none';
      if (searchTimeout) clearTimeout(searchTimeout);
    }
  });

  /* ── 9. Catalog change re-triggers search (clone of main.js) ── */
  if (selectElement) {
    selectElement.addEventListener('change', function () {
      const searchTerm  = searchInput.value.trim();
      const catalogCode = this.value;

      if (searchTimeout) clearTimeout(searchTimeout);

      if (searchTerm.length >= 1) {
        showLoadingIndicator();
        searchTimeout = setTimeout(async function () {
          const [items, hasMore, catalogCodeFinal, searchTermFinal] =
            await fetchProducts(searchTerm, catalogCode);
          displayResults(items, hasMore, catalogCodeFinal, searchTermFinal);
        }, 300);
      } else {
        popupContainer.style.display = 'none';
      }
    });
  }

  /* ── 10. Close popup when clicking outside (clone of main.js) ── */
  document.addEventListener('click', function (e) {
    if (!popupContainer.contains(e.target) && e.target !== searchInput) {
      popupContainer.style.display = 'none';
    }
  });

  /* ── 11. Reposition on resize ── */
  window.addEventListener('resize', function () {
    if (popupContainer.style.display === 'block') positionPopup();
  });

}());