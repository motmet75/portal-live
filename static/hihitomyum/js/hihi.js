/* UTF-8 */
(() => {
    "use strict";

    const body = document.body;
    const drawer = document.querySelector("[data-cart-drawer]");
    const nav = document.querySelector("[data-navigation]");
    const navToggle = document.querySelector("[data-nav-toggle]");

    const setDrawer = (open) => {
        if (!drawer) return;
        drawer.classList.toggle("is-open", open);
        drawer.setAttribute("aria-hidden", String(!open));
        body.classList.toggle("is-locked", open);
    };

    document.querySelectorAll("[data-cart-open]").forEach((button) => {
        button.addEventListener("click", () => setDrawer(true));
    });
    document.querySelectorAll("[data-cart-close]").forEach((button) => {
        button.addEventListener("click", () => setDrawer(false));
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") setDrawer(false);
    });

    navToggle?.addEventListener("click", () => {
        const open = nav?.classList.toggle("is-open") ?? false;
        navToggle.setAttribute("aria-expanded", String(open));
    });
    nav?.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            nav.classList.remove("is-open");
            navToggle?.setAttribute("aria-expanded", "false");
        });
    });

    const updateCartView = (cart) => {
        const count = cart?.totalItems ?? cart?.items?.length ?? 0;
        document.querySelectorAll("#cartCount").forEach((element) => {
            element.textContent = String(count);
        });
        const total = document.querySelector("#cartDrawerTotal");
        if (total && cart?.formatedPrice != null) {
            total.textContent = `${cart.formatedPrice} ${cart.currency ?? "₫"}`;
        }
        window.location.reload();
    };

    document.querySelectorAll(".add-bowl[data-product-code]").forEach((button) => {
        button.addEventListener("click", async () => {
            if (button.disabled) return;
            button.disabled = true;
            const original = button.innerHTML;
            try {
                const response = await fetch("/cart/add", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        items: [{
                            productCode: button.dataset.productCode,
                            name: button.dataset.productName,
                            imageUrl: button.dataset.productImage,
                            price: Number(button.dataset.productPrice || 0),
                            quantity: 1,
                            colorCode: "none",
                            sizeCode: "none",
                            priceCode: "none"
                        }]
                    })
                });
                if (!response.ok) throw new Error(`Cart request failed: ${response.status}`);
                button.classList.add("is-added");
                button.innerHTML = "Added <span>✓</span>";
                const cart = await response.json();
                setTimeout(() => updateCartView(cart), 450);
            } catch (error) {
                console.error(error);
                button.innerHTML = "Try again <span>↻</span>";
                setTimeout(() => { button.innerHTML = original; }, 1800);
            } finally {
                button.disabled = false;
            }
        });
    });

    window.hihiRemoveFromCart = async (itemId) => {
        const response = await fetch(`/cart/remove/${encodeURIComponent(itemId)}`, { method: "POST" });
        if (response.ok) updateCartView(await response.json());
    };

    window.hihiCartQty = async (button, delta) => {
        const quantityElement = button.parentElement?.querySelector("span");
        const quantity = Math.max(1, Number(quantityElement?.textContent || 1) + delta);
        const itemId = button.dataset.itemId;
        const response = await fetch(`/cart/update/?id=${encodeURIComponent(itemId)}&quantity=${quantity}`, { method: "POST" });
        if (response.ok) updateCartView(await response.json());
    };

    document.querySelectorAll("[data-current-year]").forEach((element) => {
        element.textContent = String(new Date().getFullYear());
    });
})();
