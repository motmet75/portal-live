/* UTF-8 */
(() => {
    "use strict";

    const body = document.body;
    const menu = document.querySelector("[data-mobile-menu]");
    const menuToggle = document.querySelector("[data-menu-toggle]");
    const search = document.querySelector("[data-search-panel]");
    const cart = document.querySelector("[data-cart-drawer]");
    const filter = document.querySelector("[data-filter-panel]");
    const filterBackdrop = document.querySelector(".filter-backdrop");

    const lockIfNeeded = () => {
        const locked = cart?.classList.contains("open") || filter?.classList.contains("open");
        body.classList.toggle("no-scroll", Boolean(locked));
    };

    menuToggle?.addEventListener("click", () => {
        const open = menu?.classList.toggle("open") ?? false;
        menuToggle.setAttribute("aria-expanded", String(open));
    });

    document.querySelector("[data-search-toggle]")?.addEventListener("click", () => {
        search?.classList.add("open");
        setTimeout(() => search?.querySelector("input")?.focus(), 100);
    });
    document.querySelector("[data-search-close]")?.addEventListener("click", () => search?.classList.remove("open"));

    const setCart = (open) => {
        cart?.classList.toggle("open", open);
        cart?.setAttribute("aria-hidden", String(!open));
        lockIfNeeded();
    };
    document.querySelectorAll("[data-cart-open]").forEach((button) => button.addEventListener("click", () => setCart(true)));
    document.querySelectorAll("[data-cart-close]").forEach((button) => button.addEventListener("click", () => setCart(false)));

    const setFilter = (open) => {
        filter?.classList.toggle("open", open);
        filterBackdrop?.classList.toggle("open", open);
        lockIfNeeded();
    };
    document.querySelector("[data-filter-open]")?.addEventListener("click", () => setFilter(true));
    document.querySelectorAll("[data-filter-close]").forEach((button) => button.addEventListener("click", () => setFilter(false)));

    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        setCart(false);
        setFilter(false);
        search?.classList.remove("open");
        menu?.classList.remove("open");
    });

    const addButton = document.querySelector(".add-to-bag");
    addButton?.addEventListener("click", async () => {
        if (!addButton.dataset.productCode) {
            addButton.classList.add("added");
            addButton.innerHTML = "Demo sản phẩm <span>✓</span>";
            return;
        }
        addButton.disabled = true;
        try {
            const response = await fetch("/cart/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: [{
                        productCode: addButton.dataset.productCode,
                        name: addButton.dataset.productName,
                        imageUrl: addButton.dataset.productImage,
                        price: Number(addButton.dataset.productPrice || 0),
                        quantity: 1,
                        colorCode: "none",
                        sizeCode: "none",
                        priceCode: "none"
                    }]
                })
            });
            if (!response.ok) throw new Error(`Cart request failed: ${response.status}`);
            const result = await response.json();
            document.querySelectorAll("[data-cart-count]").forEach((count) => {
                count.textContent = String(result.totalItems ?? result.items?.length ?? 0);
            });
            addButton.classList.add("added");
            addButton.innerHTML = "Đã thêm vào túi <span>✓</span>";
            setTimeout(() => window.location.reload(), 600);
        } catch (error) {
            console.error(error);
            addButton.innerHTML = "Vui lòng thử lại <span>↻</span>";
        } finally {
            addButton.disabled = false;
        }
    });

    window.elancierRemoveItem = async (itemId) => {
        const response = await fetch(`/cart/remove/${encodeURIComponent(itemId)}`, { method: "POST" });
        if (response.ok) window.location.reload();
    };

    document.querySelectorAll("[data-current-year]").forEach((year) => {
        year.textContent = String(new Date().getFullYear());
    });
})();
