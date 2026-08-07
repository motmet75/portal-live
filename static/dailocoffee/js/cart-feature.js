(() => {
  "use strict";
  const drawer = document.querySelector("[data-dailo-cart]");
  const setOpen = (open) => {
    if (!drawer) return;
    drawer.classList.toggle("is-open", open);
    drawer.setAttribute("aria-hidden", String(!open));
    document.body.classList.toggle("dailo-cart-lock", open);
  };
  document.querySelectorAll("[data-dailo-cart-open]").forEach((el) => el.addEventListener("click", () => setOpen(true)));
  document.querySelectorAll("[data-dailo-cart-close]").forEach((el) => el.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") setOpen(false); });

  const cartRequest = async (url, options = {}) => {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`Cart request failed: ${response.status}`);
    return response.json();
  };

  document.querySelectorAll(".dailo-add-cart[data-product-code]").forEach((button) => {
    button.addEventListener("click", async () => {
      if (button.disabled) return;
      button.disabled = true;
      const original = button.innerHTML;
      try {
        await cartRequest("/cart/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: [{
            productCode: button.dataset.productCode,
            name: button.dataset.productName,
            imageUrl: button.dataset.productImage || "",
            price: Number(button.dataset.productPrice || 0),
            quantity: 1,
            colorCode: "none",
            sizeCode: "none",
            priceCode: "none"
          }] })
        });
        button.classList.add("is-added");
        button.innerHTML = "Đã thêm <span>✓</span>";
        setTimeout(() => window.location.reload(), 400);
      } catch (error) {
        console.error(error);
        button.innerHTML = "Thử lại <span>↻</span>";
        setTimeout(() => { button.innerHTML = original; }, 1600);
      } finally { button.disabled = false; }
    });
  });

  document.querySelectorAll("[data-cart-item-id]").forEach((button) => {
    button.addEventListener("click", async () => {
      const current = Number(button.parentElement.querySelector("b")?.textContent || 1);
      const quantity = Math.max(1, current + Number(button.dataset.cartDelta || 0));
      await cartRequest(`/cart/update/?id=${encodeURIComponent(button.dataset.cartItemId)}&quantity=${quantity}`, { method: "POST" });
      window.location.reload();
    });
  });

  document.querySelectorAll("[data-cart-remove-id]").forEach((button) => {
    button.addEventListener("click", async () => {
      await cartRequest(`/cart/remove/${encodeURIComponent(button.dataset.cartRemoveId)}`, { method: "POST" });
      window.location.reload();
    });
  });
})();
