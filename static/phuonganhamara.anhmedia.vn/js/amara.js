(function () {
  'use strict';
  var menuToggle = document.querySelector('[data-menu-toggle]');
  var menu = document.querySelector('[data-menu]');
  if (menuToggle && menu) menuToggle.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });

  var cart = document.querySelector('[data-cart]');
  function setCart(open) {
    if (!cart) return;
    cart.classList.toggle('open', open);
    cart.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('cart-open', open);
  }
  document.querySelectorAll('[data-cart-open]').forEach(function (el) { el.addEventListener('click', function () { setCart(true); }); });
  document.querySelectorAll('[data-cart-close]').forEach(function (el) { el.addEventListener('click', function () { setCart(false); }); });
  document.addEventListener('keydown', function (event) { if (event.key === 'Escape') setCart(false); });

  async function request(url, options) {
    var response = await fetch(url, options || {});
    if (!response.ok) throw new Error('Request failed');
    window.location.reload();
  }
  document.querySelectorAll('.add-cart').forEach(function (button) {
    button.addEventListener('click', async function () {
      button.disabled = true;
      try {
        await request('/cart/add', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: [{ productCode: button.dataset.productCode, name: button.dataset.productName, imageUrl: button.dataset.productImage, price: Number(button.dataset.productPrice || 0), quantity: 1, colorCode: 'none', sizeCode: 'none', priceCode: 'none' }] }) });
      } catch (error) { button.disabled = false; button.textContent = 'Thử lại'; }
    });
  });
  document.querySelectorAll('[data-cart-delta]').forEach(function (button) { button.addEventListener('click', function () { var qty = Number(button.parentElement.querySelector('b').textContent) + Number(button.dataset.cartDelta); request('/cart/update/?id=' + encodeURIComponent(button.dataset.cartItemId) + '&quantity=' + Math.max(0, qty), { method: 'POST' }); }); });
  document.querySelectorAll('[data-cart-remove-id]').forEach(function (button) { button.addEventListener('click', function () { request('/cart/remove/' + encodeURIComponent(button.dataset.cartRemoveId), { method: 'POST' }); }); });
}());
