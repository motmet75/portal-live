(function () {
    const config = window.quoteConfig || {};
    if (config.tokenAccessRequired) {
        const tokenInput = document.getElementById('quoteToken');
        if (tokenInput) tokenInput.focus();
        return;
    }

    const categorySelect = document.getElementById('quoteCategory');
    const sortSelect = document.getElementById('quoteSort');
    const exchangeInput = document.getElementById('exchangeRate');
    const customerNameInput = document.getElementById('customerName');
    const customerPhoneInput = document.getElementById('customerPhone');
    const noteInput = document.getElementById('quoteNote');
    const productRows = document.getElementById('productRows');
    const cartRows = document.getElementById('cartRows');
    const summaryUsd = document.getElementById('summaryUsd');
    const summaryVnd = document.getElementById('summaryVnd');
    const cartItemCount = document.getElementById('cartItemCount');
    const cartQtyTotal = document.getElementById('cartQtyTotal');
    const cartPanelUsd = document.getElementById('cartPanelUsd');
    const cartPanelVnd = document.getElementById('cartPanelVnd');
    const quoteModeLabel = document.getElementById('quoteModeLabel');
    const globalDiscountInput = document.getElementById('globalDiscount');
    const applyDiscountBtn = document.getElementById('applyDiscountBtn');
    const saveQuoteBtn = document.getElementById('saveQuoteBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const clearCartBtn = document.getElementById('clearCartBtn');
    const downloadCsvBtn = document.getElementById('downloadCsvBtn');
    const downloadImageBtn = document.getElementById('downloadImageBtn');
    const refreshRateBtn = document.getElementById('refreshRateBtn');
    const fillStockQtyBtn = document.getElementById('fillStockQtyBtn');
    const productFilterId = document.getElementById('productFilterId');
    const productFilterCode = document.getElementById('productFilterCode');
    const productFilterName = document.getElementById('productFilterName');
    const productFilteredCount = document.getElementById('productFilteredCount');
    const productQtyTotal = document.getElementById('productQtyTotal');
    const productGrossTotal = document.getElementById('productGrossTotal');
    const productDiscountAmountTotal = document.getElementById('productDiscountAmountTotal');
    const productAfterDiscountTotal = document.getElementById('productAfterDiscountTotal');
    const productVndTotal = document.getElementById('productVndTotal');
    const productPrevPage = document.getElementById('productPrevPage');
    const productNextPage = document.getElementById('productNextPage');
    const productPageInfo = document.getElementById('productPageInfo');
    const productPageSize = document.getElementById('productPageSize');
    const customerDialog = document.getElementById('customerDialog');
    const customerDialogForm = document.getElementById('customerDialogForm');
    const dialogCustomerName = document.getElementById('dialogCustomerName');
    const dialogCustomerPhone = document.getElementById('dialogCustomerPhone');
    const customerDialogCancel = document.getElementById('customerDialogCancel');

    let products = [];
    let productDrafts = {};
    let currentProductPage = 1;
    let cart = [];
    let editingQuoteId = '';
    let pendingCustomerResolve = null;
    const PRODUCT_PAGE_SIZE_COOKIE = 'quoteProductPageSize';
    const PRODUCT_PAGE_SIZES = ['10', '25', '50', '100'];

    function setCookie(name, value, days) {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
    }

    function getCookie(name) {
        return document.cookie.split('; ')
            .find(row => row.startsWith(name + '='))
            ?.split('=')[1];
    }

    function parseNumber(value) {
        const parsed = Number(String(value || '').replace(/,/g, ''));
        return Number.isFinite(parsed) ? parsed : 0;
    }

    function clampDiscount(value) {
        return Math.min(100, Math.max(0, parseNumber(value)));
    }

    function exchangeRate() {
        return Math.max(1, parseNumber(exchangeInput.value || config.defaultExchangeRate || 26466));
    }

    function formatUsd(value) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0);
    }

    function formatVnd(value) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0
        }).format(value || 0);
    }

    function escapeHtml(value) {
        return String(value || '').replace(/[&<>"']/g, char => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[char]));
    }

    function selectedCategory() {
        return categorySelect.value || config.defaultCategory || 'outboard-motor';
    }

    function draftFor(product) {
        if (!product || !product.productCode) {
            return { unit: 0, quantity: 0, discountPercent: 0, stockQty: 0 };
        }
        if (!productDrafts[product.productCode]) {
            const stockQty = parseNumber(product.stockQty);
            productDrafts[product.productCode] = {
                unit: parseNumber(product.unitPrice),
                quantity: stockQty > 0 ? 1 : 0,
                discountPercent: clampDiscount(product.discountPercent),
                stockQty
            };
        }
        return productDrafts[product.productCode];
    }

    function filteredProducts() {
        const idFilter = String(productFilterId?.value || '').trim().toLowerCase();
        const codeFilter = String(productFilterCode?.value || '').trim().toLowerCase();
        const nameFilter = String(productFilterName?.value || '').trim().toLowerCase();
        return products.filter(product => {
            const id = String(product.id || '').toLowerCase();
            const code = String(product.productCode || '').toLowerCase();
            const name = String(product.productName || '').toLowerCase();
            return (!idFilter || id.includes(idFilter))
                && (!codeFilter || code.includes(codeFilter))
                && (!nameFilter || name.includes(nameFilter));
        });
    }

    function productLineValues(product) {
        const draft = draftFor(product);
        const quantity = parseNumber(draft.quantity);
        const unit = parseNumber(draft.unit);
        const discountPercent = clampDiscount(draft.discountPercent);
        const gross = unit * quantity;
        const discountAmount = gross * discountPercent / 100;
        const afterDiscount = gross - discountAmount;
        return {
            quantity,
            unit,
            discountPercent,
            gross,
            discountAmount,
            afterDiscount,
            vndTotal: afterDiscount * exchangeRate()
        };
    }

    function updateProductSummary(filtered = filteredProducts()) {
        const totals = filtered.reduce((summary, product) => {
            const values = productLineValues(product);
            summary.quantity += values.quantity;
            summary.gross += values.gross;
            summary.discountAmount += values.discountAmount;
            summary.afterDiscount += values.afterDiscount;
            summary.vnd += values.vndTotal;
            return summary;
        }, { quantity: 0, gross: 0, discountAmount: 0, afterDiscount: 0, vnd: 0 });

        const pageSize = Math.max(1, parseNumber(productPageSize?.value || 50));
        const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
        currentProductPage = Math.min(Math.max(1, currentProductPage), totalPages);

        if (productFilteredCount) productFilteredCount.textContent = filtered.length;
        if (productQtyTotal) productQtyTotal.textContent = totals.quantity;
        if (productGrossTotal) productGrossTotal.textContent = formatUsd(totals.gross);
        if (productDiscountAmountTotal) productDiscountAmountTotal.textContent = formatUsd(totals.discountAmount);
        if (productAfterDiscountTotal) productAfterDiscountTotal.textContent = formatUsd(totals.afterDiscount);
        if (productVndTotal) productVndTotal.textContent = formatVnd(totals.vnd);
        if (productPageInfo) productPageInfo.textContent = `Trang ${currentProductPage} / ${totalPages}`;
        if (productPrevPage) productPrevPage.disabled = currentProductPage <= 1;
        if (productNextPage) productNextPage.disabled = currentProductPage >= totalPages;
    }

    function initCategory() {
        const params = new URLSearchParams(window.location.search);
        const fromUrl = params.get('category');
        const fromCookie = getCookie('quoteCategory');
        const category = fromUrl || (fromCookie ? decodeURIComponent(fromCookie) : '') || config.defaultCategory || 'outboard-motor';
        if (![...categorySelect.options].some(option => option.value === category)) {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        }
        categorySelect.value = category;
    }

    function initProductPageSize() {
        if (!productPageSize) return;
        const saved = getCookie(PRODUCT_PAGE_SIZE_COOKIE);
        let pageSize = '50';
        if (saved) {
            try {
                const decoded = decodeURIComponent(saved);
                if (PRODUCT_PAGE_SIZES.includes(decoded)) pageSize = decoded;
            } catch (error) {
                // Ignore malformed cookies and retain the safe default.
            }
        }
        productPageSize.value = pageSize;
    }

    async function loadProducts() {
        const category = selectedCategory();
        const sort = sortSelect.value || 'id';
        setCookie('quoteCategory', category, 60);
        const params = new URLSearchParams({ category, sort });
        productRows.innerHTML = '<tr><td colspan="12" class="empty-state">Đang tải sản phẩm...</td></tr>';
        try {
            const response = await fetch(`/api/quote/products?${params.toString()}`);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Không tải được sản phẩm.');
            }
            products = data.products || [];
            if (data.exchangeRate && !parseNumber(exchangeInput.value)) {
                exchangeInput.value = data.exchangeRate;
            }
            products.forEach(draftFor);
            currentProductPage = 1;
            renderProducts();
        } catch (error) {
            productRows.innerHTML = `<tr><td colspan="12" class="empty-state">${escapeHtml(error.message)}</td></tr>`;
            updateProductSummary([]);
        }
    }

    function renderProducts() {
        const filtered = filteredProducts();
        const pageSize = Math.max(1, parseNumber(productPageSize?.value || 50));
        const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
        currentProductPage = Math.min(Math.max(1, currentProductPage), totalPages);
        const start = (currentProductPage - 1) * pageSize;
        const pageProducts = filtered.slice(start, start + pageSize);
        if (!products.length) {
            productRows.innerHTML = '<tr><td colspan="12" class="empty-state">Không có sản phẩm trong danh mục này.</td></tr>';
            updateProductSummary([]);
            return;
        }
        if (!pageProducts.length) {
            productRows.innerHTML = '<tr><td colspan="12" class="empty-state">Không có sản phẩm phù hợp bộ lọc.</td></tr>';
            updateProductSummary(filtered);
            return;
        }
        productRows.innerHTML = pageProducts.map(product => {
            const draft = draftFor(product);
            const stock = parseNumber(draft.stockQty);
            return `
                <tr data-code="${escapeHtml(product.productCode)}" data-stock="${stock}">
                    <td class="num">${product.id}</td>
                    <td class="code">${escapeHtml(product.productCode)}</td>
                    <td class="product-name">${escapeHtml(product.productName)}</td>
                    <td class="num">${stock}</td>
                    <td class="num"><input class="price-input" data-field="unit" type="number" min="0" step="0.01" value="${parseNumber(draft.unit).toFixed(2)}"></td>
                    <td class="num"><input class="mini-input" data-field="qty" type="number" min="0" step="1" value="${parseNumber(draft.quantity)}"></td>
                    <td class="num" data-role="lineTotal">$0.00</td>
                    <td class="num"><input class="mini-input" data-field="discount" type="number" min="0" max="100" step="1" value="${clampDiscount(draft.discountPercent)}"></td>
                    <td class="num" data-role="unitAfter">$0.00</td>
                    <td class="num" data-role="afterTotal">$0.00</td>
                    <td class="num" data-role="vndTotal">0 ₫</td>
                    <td><button type="button" data-action="add">Thêm</button></td>
                </tr>
            `;
        }).join('');
        productRows.querySelectorAll('tr[data-code]').forEach(updateProductRow);
        updateProductSummary(filtered);
    }

    function rowValues(row) {
        const unit = parseNumber(row.querySelector('[data-field="unit"]')?.value);
        const quantity = parseNumber(row.querySelector('[data-field="qty"]')?.value);
        const discountPercent = clampDiscount(row.querySelector('[data-field="discount"]')?.value);
        const stockQty = parseNumber(row.dataset.stock);
        const unitAfterDiscount = unit * (1 - discountPercent / 100);
        const total = unit * quantity;
        const afterTotal = unitAfterDiscount * quantity;
        const vndTotal = afterTotal * exchangeRate();
        return { unit, quantity, discountPercent, stockQty, unitAfterDiscount, total, afterTotal, vndTotal };
    }

    function updateProductRow(row) {
        const values = rowValues(row);
        const draft = productDrafts[row.dataset.code] || {};
        draft.unit = values.unit;
        draft.quantity = values.quantity;
        draft.discountPercent = values.discountPercent;
        draft.stockQty = values.stockQty;
        productDrafts[row.dataset.code] = draft;
        row.querySelector('[data-role="lineTotal"]').textContent = formatUsd(values.total);
        row.querySelector('[data-role="unitAfter"]').textContent = formatUsd(values.unitAfterDiscount);
        row.querySelector('[data-role="afterTotal"]').textContent = formatUsd(values.afterTotal);
        row.querySelector('[data-role="vndTotal"]').textContent = formatVnd(values.vndTotal);
        updateProductSummary();
    }

    function addProduct(row) {
        const product = products.find(item => item.productCode === row.dataset.code);
        if (!product) return;
        const values = rowValues(row);
        if (values.quantity <= 0) {
            alert('Vui lòng nhập số lượng lớn hơn 0.');
            return;
        }
        const existing = cart.find(item => item.productCode === product.productCode);
        const newQuantity = (existing ? existing.quantity : 0) + values.quantity;
        if (values.stockQty > 0 && newQuantity > values.stockQty) {
            alert('Số lượng vượt quá tồn kho hiện tại.');
            return;
        }
        if (existing) {
            existing.quantity = newQuantity;
            existing.unitPrice = values.unit;
            existing.discountPercent = values.discountPercent;
        } else {
            cart.push({
                productCode: product.productCode,
                productName: product.productName,
                stockQty: values.stockQty,
                unitPrice: values.unit,
                quantity: values.quantity,
                discountPercent: values.discountPercent
            });
        }
        renderCart();
    }

    function lineAfterDiscount(item) {
        return item.unitPrice * item.quantity * (1 - item.discountPercent / 100);
    }

    function renderCart() {
        if (!cart.length) {
            cartRows.innerHTML = '<tr><td colspan="9" class="empty-state">Chưa có sản phẩm trong giỏ báo giá.</td></tr>';
            updateTotals();
            return;
        }
        cartRows.innerHTML = cart.map((item, index) => {
            const remaining = item.stockQty - item.quantity;
            return `
                <tr data-index="${index}">
                    <td class="code">${escapeHtml(item.productCode)}</td>
                    <td class="product-name">${escapeHtml(item.productName)}</td>
                    <td class="num">${remaining}</td>
                    <td class="num"><input class="price-input" data-cart-field="unitPrice" type="number" min="0" step="0.01" value="${item.unitPrice.toFixed(2)}"></td>
                    <td class="num"><input class="mini-input" data-cart-field="quantity" type="number" min="0" step="1" value="${item.quantity}"></td>
                    <td class="num"><input class="mini-input" data-cart-field="discountPercent" type="number" min="0" max="100" step="1" value="${item.discountPercent}"></td>
                    <td class="num">${formatUsd(lineAfterDiscount(item))}</td>
                    <td class="num">${formatVnd(lineAfterDiscount(item) * exchangeRate())}</td>
                    <td><button type="button" class="danger" data-cart-action="remove">Xóa</button></td>
                </tr>
            `;
        }).join('');
        updateTotals();
    }

    function updateCartItem(row) {
        const item = cart[Number(row.dataset.index)];
        if (!item) return;
        item.unitPrice = parseNumber(row.querySelector('[data-cart-field="unitPrice"]').value);
        item.quantity = parseNumber(row.querySelector('[data-cart-field="quantity"]').value);
        item.discountPercent = clampDiscount(row.querySelector('[data-cart-field="discountPercent"]').value);
        if (item.stockQty > 0 && item.quantity > item.stockQty) {
            item.quantity = item.stockQty;
        }
        renderCart();
    }

    function updateTotals() {
        const usd = cart.reduce((total, item) => total + lineAfterDiscount(item), 0);
        const quantity = cart.reduce((total, item) => total + parseNumber(item.quantity), 0);
        summaryUsd.textContent = formatUsd(usd);
        summaryVnd.textContent = formatVnd(usd * exchangeRate());
        if (cartItemCount) cartItemCount.textContent = cart.length;
        if (cartQtyTotal) cartQtyTotal.textContent = quantity;
        if (cartPanelUsd) cartPanelUsd.textContent = formatUsd(usd);
        if (cartPanelVnd) cartPanelVnd.textContent = formatVnd(usd * exchangeRate());
    }

    function setEditMode(quoteId) {
        editingQuoteId = quoteId || '';
        quoteModeLabel.textContent = editingQuoteId ? `Đang sửa ${editingQuoteId}` : 'Báo giá mới';
        saveQuoteBtn.textContent = editingQuoteId ? 'Cập nhật báo giá' : 'Lưu báo giá';
        cancelEditBtn.hidden = !editingQuoteId;
    }

    function resetQuoteForm() {
        cart = [];
        noteInput.value = '';
        customerNameInput.value = '';
        customerPhoneInput.value = '';
        setEditMode('');
        renderCart();
    }

    function quotePayload() {
        return {
            category: selectedCategory(),
            exchangeRate: exchangeRate(),
            customerName: customerNameInput.value || '',
            customerPhone: customerPhoneInput.value || '',
            note: noteInput.value || '',
            items: cart
        };
    }

    function finishCustomerDialog(shouldContinue) {
        if (customerDialog && customerDialog.open) {
            customerDialog.close();
        }
        if (pendingCustomerResolve) {
            pendingCustomerResolve(shouldContinue);
            pendingCustomerResolve = null;
        }
    }

    function requestCustomerInfo() {
        if (!customerDialog || !customerDialog.showModal) {
            const customerName = prompt('Tên khách hàng', customerNameInput.value || '');
            if (customerName === null) return Promise.resolve(false);
            const customerPhone = prompt('Số điện thoại', customerPhoneInput.value || '');
            if (customerPhone === null) return Promise.resolve(false);
            customerNameInput.value = customerName.trim();
            customerPhoneInput.value = customerPhone.trim();
            return Promise.resolve(Boolean(customerNameInput.value && customerPhoneInput.value));
        }

        dialogCustomerName.value = customerNameInput.value || '';
        dialogCustomerPhone.value = customerPhoneInput.value || '';
        customerDialog.showModal();
        setTimeout(() => (dialogCustomerName.value ? dialogCustomerPhone : dialogCustomerName).focus(), 0);
        return new Promise(resolve => {
            pendingCustomerResolve = resolve;
        });
    }

    async function saveQuote() {
        if (!cart.length) {
            alert('Vui lòng thêm sản phẩm vào giỏ báo giá.');
            return;
        }
        if (saveQuoteBtn.disabled) {
            return;
        }
        saveQuoteBtn.disabled = true;
        try {
            if (!editingQuoteId) {
                const hasCustomerInfo = await requestCustomerInfo();
                if (!hasCustomerInfo) {
                    return;
                }
            }
            const url = editingQuoteId
                ? `/api/quote/${encodeURIComponent(editingQuoteId)}`
                : '/api/quote/save';
            const response = await fetch(url, {
                method: editingQuoteId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(quotePayload())
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Không lưu được báo giá.');
            }
            alert(`${editingQuoteId ? 'Đã cập nhật' : 'Đã lưu'} báo giá ${data.orderStringId}.`);
            resetQuoteForm();
            window.location.reload();
        } catch (error) {
            alert(error.message);
        } finally {
            saveQuoteBtn.disabled = false;
        }
    }

    function downloadCsv() {
        if (!cart.length) {
            alert('Giỏ báo giá đang trống.');
            return;
        }
        const rows = [
            ['Khách hàng', customerNameInput.value || ''],
            ['Số điện thoại', customerPhoneInput.value || ''],
            ['Tỷ giá USD/VND', exchangeRate()],
            ['Ghi chú', noteInput.value || ''],
            [],
            ['Mã', 'Sản phẩm', 'Đơn giá USD', 'Số lượng', 'Tổng USD', 'Giảm %', 'Tổng sau giảm USD', 'Tổng VND']
        ];
        cart.forEach(item => {
            const total = item.unitPrice * item.quantity;
            const after = lineAfterDiscount(item);
            rows.push([
                item.productCode,
                item.productName,
                item.unitPrice,
                item.quantity,
                total,
                item.discountPercent,
                after,
                after * exchangeRate()
            ]);
        });
        const csv = '\ufeff' + rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `bao-gia-${Date.now()}.csv`;
        link.click();
        URL.revokeObjectURL(link.href);
    }

    function downloadImage() {
        if (!cart.length) {
            alert('Giỏ báo giá đang trống.');
            return;
        }
        const width = 1400;
        const rowHeight = 34;
        const height = 240 + cart.length * rowHeight + 80;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#111827';
        ctx.font = 'bold 30px Arial';
        ctx.fillText('Báo giá', 32, 48);
        ctx.font = '16px Arial';
        ctx.fillText(`Khách hàng: ${customerNameInput.value || ''}`, 32, 78);
        ctx.fillText(`Số điện thoại: ${customerPhoneInput.value || ''}`, 32, 104);
        ctx.fillText(`Tỷ giá USD/VND: ${exchangeRate().toLocaleString('vi-VN')}`, 32, 130);
        ctx.fillText(`Ngày tạo: ${new Date().toLocaleString('vi-VN')}`, 32, 156);

        const columns = [32, 190, 600, 760, 870, 980, 1100, 1240];
        const headers = ['Mã', 'Sản phẩm', 'Đơn giá', 'SL', 'Giảm %', 'Sau giảm', 'Tổng USD', 'Tổng VND'];
        ctx.fillStyle = '#eaf1fb';
        ctx.fillRect(24, 180, width - 48, 36);
        ctx.fillStyle = '#111827';
        ctx.font = 'bold 15px Arial';
        headers.forEach((header, index) => ctx.fillText(header, columns[index], 203));
        ctx.font = '14px Arial';
        cart.forEach((item, index) => {
            const y = 242 + index * rowHeight;
            const after = lineAfterDiscount(item);
            const values = [
                item.productCode,
                item.productName.slice(0, 46),
                formatUsd(item.unitPrice),
                item.quantity,
                `${item.discountPercent}%`,
                formatUsd(item.unitPrice * (1 - item.discountPercent / 100)),
                formatUsd(after),
                formatVnd(after * exchangeRate())
            ];
            values.forEach((value, columnIndex) => ctx.fillText(String(value), columns[columnIndex], y));
        });
        const totalUsd = cart.reduce((total, item) => total + lineAfterDiscount(item), 0);
        ctx.font = 'bold 20px Arial';
        ctx.fillText(`Tổng cộng: ${formatUsd(totalUsd)} - ${formatVnd(totalUsd * exchangeRate())}`, 32, height - 34);
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `bao-gia-${Date.now()}.png`;
        link.click();
    }

    async function refreshExchangeRate() {
        refreshRateBtn.disabled = true;
        try {
            const response = await fetch('/api/quote/exchange/usd');
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Không lấy được tỷ giá.');
            }
            exchangeInput.value = data.exchangeRate;
            productRows.querySelectorAll('tr[data-code]').forEach(updateProductRow);
            renderCart();
        } catch (error) {
            alert(error.message);
        } finally {
            refreshRateBtn.disabled = false;
        }
    }

    async function confirmPurchased(button) {
        const quoteId = button.dataset.quoteId;
        if (!quoteId || !confirm(`Xác nhận báo giá ${quoteId} đã mua và trừ tồn kho?`)) {
            return;
        }
        button.disabled = true;
        try {
            const response = await fetch(`/api/quote/${encodeURIComponent(quoteId)}/purchase`, { method: 'POST' });
            const data = await response.json();
            if (!response.ok) {
                const details = Array.isArray(data.details) ? '\n' + data.details.join('\n') : '';
                throw new Error((data.error || 'Không xác nhận được báo giá.') + details);
            }
            alert(data.message || 'Đã xác nhận.');
            window.location.reload();
        } catch (error) {
            alert(error.message);
            button.disabled = false;
        }
    }

    function applyGlobalDiscount() {
        const discount = clampDiscount(globalDiscountInput.value);
        globalDiscountInput.value = discount;
        products.forEach(product => {
            const draft = draftFor(product);
            draft.discountPercent = discount;
        });
        cart.forEach(item => {
            item.discountPercent = discount;
        });
        renderProducts();
        renderCart();
    }

    function fillFilteredQtyWithStock() {
        filteredProducts().forEach(product => {
            const draft = draftFor(product);
            draft.quantity = parseNumber(draft.stockQty);
        });
        renderProducts();
    }

    async function loadSavedQuote(button) {
        const quoteId = button.dataset.quoteId;
        if (!quoteId) return;
        button.disabled = true;
        try {
            const response = await fetch(`/api/quote/${encodeURIComponent(quoteId)}`);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Không mở được báo giá.');
            }
            if (data.category) {
                if (![...categorySelect.options].some(option => option.value === data.category)) {
                    const option = document.createElement('option');
                    option.value = data.category;
                    option.textContent = data.category;
                    categorySelect.appendChild(option);
                }
                categorySelect.value = data.category;
                setCookie('quoteCategory', data.category, 60);
                loadProducts();
            }
            exchangeInput.value = data.exchangeRate || exchangeRate();
            customerNameInput.value = data.customerName || '';
            customerPhoneInput.value = data.customerPhone || '';
            noteInput.value = data.note || '';
            cart = (data.items || []).map(item => ({
                productCode: item.productCode,
                productName: item.productName,
                stockQty: parseNumber(item.stockQty),
                unitPrice: parseNumber(item.unitPrice),
                quantity: parseNumber(item.quantity),
                discountPercent: clampDiscount(item.discountPercent)
            }));
            setEditMode(data.orderStringId || quoteId);
            renderCart();
            document.getElementById('quoteCartExport')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch (error) {
            alert(error.message);
        } finally {
            button.disabled = false;
        }
    }

    async function cloneSavedQuote(button) {
        const quoteId = button.dataset.quoteId;
        if (!quoteId) return;
        button.disabled = true;
        try {
            const sourceResponse = await fetch(`/api/quote/${encodeURIComponent(quoteId)}`);
            const source = await sourceResponse.json();
            if (!sourceResponse.ok) {
                throw new Error(source.error || 'Không mở được báo giá để nhân bản.');
            }
            const customerName = prompt('Tên khách hàng mới', source.customerName || '');
            if (customerName === null) return;
            const customerPhone = prompt('Số điện thoại mới', source.customerPhone || '');
            if (customerPhone === null) return;
            const response = await fetch(`/api/quote/${encodeURIComponent(quoteId)}/clone`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ customerName, customerPhone })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Không nhân bản được báo giá.');
            }
            alert(`Đã nhân bản báo giá ${data.orderStringId}.`);
            window.location.reload();
        } catch (error) {
            alert(error.message);
        } finally {
            button.disabled = false;
        }
    }

    function exportSavedQuote(button) {
        const quoteId = button.dataset.quoteId;
        if (quoteId) {
            window.location.href = `/api/quote/${encodeURIComponent(quoteId)}/export.xlsx`;
        }
    }

    productRows.addEventListener('input', event => {
        const row = event.target.closest('tr[data-code]');
        if (row) updateProductRow(row);
    });

    productRows.addEventListener('click', event => {
        const row = event.target.closest('tr[data-code]');
        if (row && event.target.dataset.action === 'add') {
            addProduct(row);
        }
    });

    [productFilterId, productFilterCode, productFilterName].forEach(input => {
        if (!input) return;
        input.addEventListener('input', () => {
            currentProductPage = 1;
            renderProducts();
        });
    });

    if (productPageSize) {
        productPageSize.addEventListener('change', () => {
            const pageSize = PRODUCT_PAGE_SIZES.includes(productPageSize.value)
                ? productPageSize.value : '50';
            productPageSize.value = pageSize;
            setCookie(PRODUCT_PAGE_SIZE_COOKIE, pageSize, 365);
            currentProductPage = 1;
            renderProducts();
        });
    }

    if (productPrevPage) {
        productPrevPage.addEventListener('click', () => {
            currentProductPage = Math.max(1, currentProductPage - 1);
            renderProducts();
        });
    }

    if (productNextPage) {
        productNextPage.addEventListener('click', () => {
            currentProductPage += 1;
            renderProducts();
        });
    }

    cartRows.addEventListener('input', event => {
        const row = event.target.closest('tr[data-index]');
        if (row) updateCartItem(row);
    });

    cartRows.addEventListener('click', event => {
        const row = event.target.closest('tr[data-index]');
        if (row && event.target.dataset.cartAction === 'remove') {
            cart.splice(Number(row.dataset.index), 1);
            renderCart();
        }
    });

    categorySelect.addEventListener('change', () => {
        setCookie('quoteCategory', selectedCategory(), 60);
        const url = new URL(window.location.href);
        url.searchParams.set('category', selectedCategory());
        window.history.replaceState({}, '', url.toString());
        loadProducts();
    });

    sortSelect.addEventListener('change', loadProducts);
    exchangeInput.addEventListener('input', () => {
        productRows.querySelectorAll('tr[data-code]').forEach(updateProductRow);
        updateProductSummary();
        updateTotals();
    });
    applyDiscountBtn.addEventListener('click', applyGlobalDiscount);
    saveQuoteBtn.addEventListener('click', saveQuote);
    cancelEditBtn.addEventListener('click', resetQuoteForm);
    clearCartBtn.addEventListener('click', () => { cart = []; renderCart(); });
    downloadCsvBtn.addEventListener('click', downloadCsv);
    downloadImageBtn.addEventListener('click', downloadImage);
    refreshRateBtn.addEventListener('click', refreshExchangeRate);
    if (fillStockQtyBtn) {
        fillStockQtyBtn.addEventListener('click', fillFilteredQtyWithStock);
    }
    if (customerDialogForm) {
        customerDialogForm.addEventListener('submit', event => {
            event.preventDefault();
            const name = dialogCustomerName.value.trim();
            const phone = dialogCustomerPhone.value.trim();
            if (!name) {
                dialogCustomerName.focus();
                return;
            }
            if (!phone) {
                dialogCustomerPhone.focus();
                return;
            }
            customerNameInput.value = name;
            customerPhoneInput.value = phone;
            finishCustomerDialog(true);
        });
    }
    if (customerDialogCancel) {
        customerDialogCancel.addEventListener('click', () => finishCustomerDialog(false));
    }
    if (customerDialog) {
        customerDialog.addEventListener('cancel', event => {
            event.preventDefault();
            finishCustomerDialog(false);
        });
    }
    document.querySelectorAll('.quote-edit-btn').forEach(button => {
        button.addEventListener('click', () => loadSavedQuote(button));
    });
    document.querySelectorAll('.quote-clone-btn').forEach(button => {
        button.addEventListener('click', () => cloneSavedQuote(button));
    });
    document.querySelectorAll('.quote-export-btn').forEach(button => {
        button.addEventListener('click', () => exportSavedQuote(button));
    });
    document.querySelectorAll('.quote-confirm-btn').forEach(button => {
        button.addEventListener('click', () => confirmPurchased(button));
    });

    initCategory();
    initProductPageSize();
    if (!parseNumber(exchangeInput.value)) {
        exchangeInput.value = config.defaultExchangeRate || 26466;
    }
    loadProducts();
    renderCart();
})();
